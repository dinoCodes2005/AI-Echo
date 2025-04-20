
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
    reply = serializers.SerializerMethodField()
    class Meta:
        model = ChatMessage
        fields = '__all__'
    
    def get_reply(self, obj):
        if obj.reply:
            return ChatMessageSerializer(obj.reply).data
        return None