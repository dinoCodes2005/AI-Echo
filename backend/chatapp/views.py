from django.shortcuts import render
from h11 import Response
from .models import ChatMessage, ChatRoom
from .serializers import ChatMessageSerializer, ChatRoomSerializer
from rest_framework import viewsets
from rest_framework.decorators import api_view
from django.http import JsonResponse
import json
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt

# Create your views here.

class ChatRoomViewSet(viewsets.ModelViewSet):
    queryset = ChatRoom.objects.all()
    serializer_class = ChatRoomSerializer
    
class ChatMessageViewSet(viewsets.ModelViewSet):
    queryset = ChatMessage.objects.all()
    serializer_class = ChatMessageSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        room_slug = self.request.GET.get("room")
        print("Room slug is ",room_slug)
        queryset = queryset.filter(room__slug = room_slug)
        print(queryset)
        return queryset
    
@csrf_exempt
def create_message(request):
    if request.method == "POST":
        data = json.loads(request.body)
        user = User.objects.get(username = data["user"])
        room = ChatRoom.objects.get(slug= data["room"])
        message = ChatMessage(
                            user=user,
                            room=room,
                            message_content = data["message"])
        message.save()

def current_user(request):
    return JsonResponse({
        "id":request.user.id,
        "username":request.user.username,
    })
    
    