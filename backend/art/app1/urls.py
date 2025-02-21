from django.urls import path
from .views import *


urlpatterns = [
    
     path('register/', RegisterView.as_view(), name='register'),
     path('verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),
     path('login/', LoginView.as_view(), name='login'),
     path("logout/", LogoutView.as_view(), name="logout"),
     path("refresh/", RefreshTokenView.as_view(), name="token_refresh"),

    path("profile/", ProfileView.as_view(), name="profile"),
    path('profile1/update-picture/', UpdateProfilePictureView.as_view(), name='update-profile-picture'),

    path('schedule-email/', ScheduleEmailView.as_view(), name='schedule-email'),
    path('schedule_email/', ScheduledEmailListCreateView.as_view(), name='schedule-email-list-create'),
    path('schedule-email/<int:pk>/', ScheduledEmailDetailView.as_view(), name='schedule-email-detail'),
    path('send-pending-emails/', SendPendingEmails.as_view(), name='send-pending-emails'),
     
]
