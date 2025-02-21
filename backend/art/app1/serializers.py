from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
from .models import *
import bleach

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    profile_picture = serializers.ImageField(required=False) 
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2', 'profile_picture']
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return data

    def create(self, validated_data):
        validated_data.pop('password2')  # Remove password2 since it's not stored in DB
        profile_picture = validated_data.pop('profile_picture', None)
        
        user = User.objects.create_user(**validated_data)  # Securely create user
        if profile_picture:
            user.profile_picture = profile_picture
            user.save()  # Save profile picture if provided
        
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get("email")
        password = data.get("password")

        if email and password:
            user = authenticate(username=email, password=password)
            if user:
                if not user.is_email_verified:
                    raise serializers.ValidationError("Email not verified. Please verify OTP before logging in.")
                if not user.is_active:
                    raise serializers.ValidationError("User is deactivated.")
                data["user"] = user
            else:
                raise serializers.ValidationError("Invalid email or password.")
        else:
            raise serializers.ValidationError("Both fields are required.")

        return data

class UserProfileSerializer(serializers.ModelSerializer):
    profile_picture = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'profile_picture']

    def get_profile_picture(self, obj):
        """Return the full S3 URL for the profile picture"""
        if obj.profile_picture:
            return obj.profile_picture.url  # Returns the full URL from S3
        return None  # If no profile picture, return None
    
class ScheduledEmailSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScheduledEmail
        fields = ['id', 'recipient_email', 'subject', 'body', 'scheduled_time', 'is_sent']