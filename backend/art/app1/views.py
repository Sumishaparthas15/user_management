from rest_framework import generics, status,views
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import *
from rest_framework.permissions import AllowAny
from django.shortcuts import render
from rest_framework.authtoken.models import Token
from django.contrib.auth import login, logout
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.permissions import IsAuthenticated
from django.core.mail import send_mail
from .tasks import send_scheduled_email

User = get_user_model()


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }
class RefreshTokenView(TokenRefreshView):
    pass
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        print("Received Data:", request.data)  # Log incoming data

        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            user.generate_otp()  # Generate and save OTP
            self.send_otp_email(user.email, user.otp)  # Send OTP via email
            return Response({"message": "User registered successfully. Please verify OTP."}, status=status.HTTP_201_CREATED)
        
        print("Errors:", serializer.errors)  # Log validation errors
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def send_otp_email(self, email, otp):
        send_mail(
            "Your OTP for Account Verification",
            f"Your OTP is: {otp}. It will expire in 5 minutes.",
            "noreply@yourapp.com",
            [email],
            fail_silently=False,
        )


class VerifyOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        otp = request.data.get("otp")

        try:
            user = User.objects.get(email=email)
            success, message = user.verify_otp(otp)

            if success:
                return Response({"message": message}, status=status.HTTP_200_OK)
            else:
                return Response({"error": message}, status=status.HTTP_400_BAD_REQUEST)

        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

class LoginView(views.APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            tokens = get_tokens_for_user(user)
            return Response({"tokens": tokens, "message": "Login successful"}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class LogoutView(APIView):
    

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh_token")
            token = RefreshToken(refresh_token)
            token.blacklist()  # Blacklist the refresh token
            return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserProfileSerializer(request.user, context={"request": request})
        return Response(serializer.data)
    
class ScheduleEmailView(generics.CreateAPIView):
    queryset = ScheduledEmail.objects.all()
    serializer_class = ScheduledEmailSerializer
    permission_classes = [IsAuthenticated]  # Ensure only authenticated users can access

    def perform_create(self, serializer):
        print("Received data:", self.request.data)  # Debugging
        if not self.request.user.is_authenticated:
            return Response({"error": "User is not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)

        scheduled_email = serializer.save(user=self.request.user)
        
        # Schedule the email with Celery
        send_scheduled_email.apply_async(
            args=[scheduled_email.id],
            eta=scheduled_email.scheduled_time
        )

        return Response({"message": "Email scheduled successfully."}, status=status.HTTP_201_CREATED)
class ScheduledEmailListCreateView(generics.ListCreateAPIView):  # ✅ Supports GET & POST
    serializer_class = ScheduledEmailSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ScheduledEmail.objects.filter(user=self.request.user)
    
class ScheduledEmailDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ScheduledEmailSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ScheduledEmail.objects.filter(user=self.request.user)

class SendPendingEmails(APIView):
    """
    API to manually trigger sending of pending emails.
    This can also be automated using Celery.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        pending_emails = ScheduledEmail.objects.filter(is_sent=False, scheduled_time__lte=now())
        sent_count = 0

        for email in pending_emails:
            # Simulate sending the email (replace with actual send logic)
            print(f"Sending email to {email.recipient_email}")
            email.is_sent = True
            email.save()
            sent_count += 1

        return Response({"message": f"{sent_count} emails sent."})
    
def some_view(request):
    from .tasks import send_scheduled_email  # Import inside the function
    send_scheduled_email.delay()
    return render(request, 'index.html')