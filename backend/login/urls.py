from django.urls import path
from . import views

urlpatterns = [
    path('api/registration', views.login, name='login'),
]