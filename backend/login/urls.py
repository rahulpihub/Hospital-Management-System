from django.urls import path
from . import views

urlpatterns = [
    path('api/login', views.login, name='login'),
    path('api/admin', views.create_account, name='create_account'),
]


