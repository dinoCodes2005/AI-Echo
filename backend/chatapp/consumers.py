from channels.generic.websocket import AsyncWebsocketConsumer
import json
from asgiref.sync import sync_to_async
from django.contrib.auth.models import User

from .models import ChatMessage, ChatRoom

class ChatConsumer(AsyncWebsocketConsumer):
    
    #what this basically does is that it adds the current object of the websocket connection to the group 
    
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        
        '''
            self.scope =
                {
                'type': 'websocket',
                'path': '/ws/work/',  # Full URL path
                'raw_path': b'/ws/work/',
                'headers': [
                    (b'host', b'127.0.0.1:8000'),
                    (b'user-agent', b'Mozilla/5.0'),
                    (b'accept-language', b'en-US,en;q=0.9'),
                    (b'sec-websocket-version', b'13'),
                ],
                'query_string': b'',  # If any query params were present
                'client': ('127.0.0.1', 56789),  # Client's IP and port
                'server': ('127.0.0.1', 8000),  # Server's IP and port
                'subprotocols': [],
                'cookies': {},  # If cookies exist
                'session': {},  # If session exists
                'user': AnonymousUser(),  # User object (if authenticated)
                'url_route': {
                    'kwargs': {'room_name': 'work'}  # Extracted from the path
            }
        }
        '''
        
        self.room_group_name = 'chat_%s' %self.room_name
        
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()
    
    
    #this removees the current object of the websocket connection from the group 
    async def disconnect(self,close_code):
        await self.channel_layer.group_discard( 
            self.room_group_name,
            self.channel_name
        )

    '''ye data front end me chatSocket.send() se aa rha
    jo phir ye data ko receive karke chat_message ko bhej raha jo 
    isko frontend me display ke liye bhej rha hai 
    '''
    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['message']
        username = data['username']
        room = data['room']
        
        await self.channel_layer.group_send(
            self.room_group_name,{
                'type':'chat_message',
                'message':message,
                'username':username,
                'room':room,
            }
        )
        
        await self.save_message(username,room,message)
    
    async def chat_message(self,event):
        message = event['message']
        username = event['username']
        room = event['room']
        
        await self.send(text_data=json.dumps(
            {
                'message':message,
                'username':username,
                'room':room,
            }
        ))
       
    @sync_to_async 
    def save_message(self,username,room,message):
        user = User.objects.get(username = username)
        room = ChatRoom.objects.get(slug=room)
        ChatMessage.objects.create(user = user, room = room , message_content = message)
    
