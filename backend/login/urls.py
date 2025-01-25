from django.urls import path
from . import views

urlpatterns = [
    path('api/registration', views.login, name='registration'),
    path('api/send_otp', views.send_otp, name='send_otp'),
    path('api/verify_otp', views.verify_otp, name='verify_otp'),
    path('api/login', views.login, name='login'),
]