from django.urls import path

from chatapp.views import fetch_user
from .views import *
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("register/",UserRegistrationAPIView.as_view(),name="register-user"),
    path("update-profile/",ProfileUpdateAPIView.as_view(),name="update-profile"),
    path("update-credentials/",CustomUserUpdateAPIView.as_view(),name="update-credentials"),
    path("login/",UserLoginAPIView.as_view(),name="login-user"),
    path("logout/",UserLogoutAPIView.as_view(),name="logout-user"),
    path('token/refresh/',TokenRefreshView.as_view(),name="token-refresh"),
    path('user/',UserInfoAPIView.as_view(),name="user-info"),
    path('fetch-user/<int:id>/',fetch_user,name="fetch-user"),
]