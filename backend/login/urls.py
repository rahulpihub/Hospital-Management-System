from django.urls import path
from . import views

urlpatterns = [
    path('api/login', views.login, name='login'),
    path('api/admin', views.create_account, name='create_account'),
    path('api/emailverify', views.send_email, name='verify_email'),
    path('api/logout', views.logout, name='logout'),
    path('api/forgotpassword', views.forgot_password, name='forgotpassword'),
    path('api/resetpassword', views.reset_password, name='resetpassword'),
]


