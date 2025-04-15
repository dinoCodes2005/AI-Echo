"""
URL configuration for mysite project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from os import name
from django.contrib import admin
from django.urls import path,include
from httpx import request
from . import views
from rest_framework.routers import DefaultRouter
from .views import ChatMessageViewSet, ChatRoomViewSet

router = DefaultRouter()
router.register(r'chat-rooms', ChatRoomViewSet)
router.register(r'api/get-message',ChatMessageViewSet)

urlpatterns = [
    path('',include(router.urls)),
    path('create-room/',views.create_room,name="create_room"),
    path('api/create/',views.create_message,name="create_message"),
]
