from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models
import random,string
from datetime import timedelta
from django.utils.timezone import now
from storages.backends.s3boto3 import S3Boto3Storage
from django.core.files.storage import default_storage
import os

def user_directory_path(instance, filename):
    """Ensure correct folder for profile pictures"""
    if not instance.pk:  # If user is not saved yet, store temporarily
        return f'profile_pics/temp/{filename}'
    return f'profile_pics/user_{instance.pk}/{filename}'


class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    profile_picture = models.ImageField(storage=S3Boto3Storage(), upload_to=user_directory_path,  null=True, blank=True)
    is_email_verified = models.BooleanField(default=False)
    otp = models.CharField(max_length=6, null=True, blank=True)
    otp_expiry = models.DateTimeField(null=True, blank=True)
    otp_attempts = models.IntegerField(default=0)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    groups = models.ManyToManyField(Group, related_name="customuser_groups", blank=True)
    user_permissions = models.ManyToManyField(Permission, related_name="customuser_permissions", blank=True)

    def __str__(self):
        return self.email
    
    def generate_otp(self):
        """ Generate a 6-digit OTP and set expiry time """
        self.otp = ''.join(random.choices(string.digits, k=6))
        self.otp_expiry = now() + timedelta(minutes=5)
        self.otp_attempts = 0  # Reset attempts
        self.save()

    def verify_otp(self, entered_otp):
        """ Verify OTP with expiration and attempt limits """
        if self.otp_attempts >= 5:
            return False, "Too many failed attempts. Request a new OTP."

        if not self.otp or not self.otp_expiry or self.otp_expiry < now():
            return False, "OTP expired. Request a new one."

        if self.otp == entered_otp:
            self.is_email_verified = True
            self.otp = None  # Clear OTP after successful verification
            self.otp_expiry = None
            self.save()
            return True, "Email verified successfully."

        self.otp_attempts += 1
        self.save()
        return False, "Invalid OTP. Please try again."
    def save(self, *args, **kwargs):
        """Move image from temp/ to the correct user folder after user is saved"""
        if self.pk and self.profile_picture and "temp/" in self.profile_picture.name:
            old_path = self.profile_picture.name
            new_path = f'profile_pics/user_{self.pk}/{os.path.basename(old_path)}'

            # Move file to correct path in S3
            default_storage.save(new_path, self.profile_picture)

            # Delete old temp file
            default_storage.delete(old_path)

            # Update profile_picture field
            self.profile_picture.name = new_path
        
        super().save(*args, **kwargs)

class ScheduledEmail(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)  # User who scheduled the email
    recipient_email = models.EmailField()
    subject = models.CharField(max_length=255)
    body = models.TextField()
    scheduled_time = models.DateTimeField()
    is_sent = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.subject} to {self.recipient_email} at {self.scheduled_time}"