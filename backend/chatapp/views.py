from django.shortcuts import render
from .models import ChatMessage, ChatRoom
from .serializers import ChatRoomSerializer
from rest_framework import viewsets

# Create your views here.

class ChatRoomViewSet(viewsets.ModelViewSet):
    queryset = ChatRoom.objects.all()
    serializer_class = ChatRoomSerializer