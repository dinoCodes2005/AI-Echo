
from dataclasses import field
from rest_framework import serializers

from accounts.models import CustomUser
from accounts.serializers import ProfileSerializer , CustomUserSerializer
from .models import ChatMessage, ChatRoom

class CustomUserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()
    class Meta:
        model = CustomUser
        fields = ['id','username','email','profile']
        
class ChatRoomSerializer(serializers.ModelSerializer):
    owners = CustomUserSerializer(many=True,read_only=True)
    class Meta:
        model = ChatRoom
        fields = '__all__'
        
class ChatMessageSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer()
    class Meta:
        model = ChatMessage
        fields = '__all__'