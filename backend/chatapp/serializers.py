
from dataclasses import field
from rest_framework import serializers

from accounts.models import CustomUser
from .models import ChatMessage, ChatRoom

class ChatRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatRoom
        fields = '__all__'
        
class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id','username','email']
        
        
class ChatMessageSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer()
    class Meta:
        model = ChatMessage
        fields = '__all__'