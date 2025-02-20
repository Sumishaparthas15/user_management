from celery import shared_task
from django.core.mail import send_mail
from django.utils.timezone import now
from .models import ScheduledEmail

@shared_task
def send_scheduled_email(email_id):
    try:
        email = ScheduledEmail.objects.get(id=email_id, is_sent=False)

        # Sending email
        send_mail(
            subject=email.subject,
            message=email.body,
            from_email='sumishasudha392@gmail.com',
            recipient_list=[email.recipient_email]
        )

        # Mark as sent
        email.is_sent = True
        email.save()

    except ScheduledEmail.DoesNotExist:
        pass

