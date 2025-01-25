from django.urls import path
from . import views

urlpatterns = [
    path('api/registration', views.login, name='login'),
        # Endpoint to send OTP
    path('api/send_otp', views.send_otp, name='send_otp'),
    
    # Endpoint to verify OTP
    path('api/verify_otp', views.verify_otp, name='verify_otp'),
]