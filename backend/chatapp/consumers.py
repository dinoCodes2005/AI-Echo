from channels.generic.websocket import AsyncWebsocketConsumer
import json
from asgiref.sync import sync_to_async
from channels.db import database_sync_to_async
from accounts.models import CustomUser
from .models import ChatMessage, ChatRoom

class ChatConsumer(AsyncWebsocketConsumer):
    
    #what this basically does is that it adds the current object of the websocket connection to the group 
    
    async def connect(self):
        print("CONNECTION ESTABLISHED !!! ")
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        
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
        username = data['username']
        if data.get("type") == "delete_message":
            messageId = data["messageId"]
            success = await self.delete_message(messageId)
            if success:
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "delete_message_broadcast",
                        "messageId": messageId,
                        "username": username,
                    }
                )
            else:
                await self.send(text_data=json.dumps({
                    "type": "error",
                    "error": "Message does not exist",
                }))
        else:
            message = data['message'] 
            room = data['room']
            await self.save_message(username,room,message)
            await self.channel_layer.group_send(
                self.room_group_name,{
                    'type':'chat_message',
                    'message':message,
                    'username':username,
                    'room':room,
                }
            )
        
    
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
       
    @database_sync_to_async
    def save_message(self,username,room,message):
        user = CustomUser.objects.get(username = username)
        room = ChatRoom.objects.get(slug=room)
        message = ChatMessage.objects.create(user = user, room = room , message_content = message)
        return message
    
    @database_sync_to_async
    def delete_message(self,messageId):
        try:
            message = ChatMessage.objects.get(id=messageId)
            message.delete()
            return True
        except ChatMessage.DoesNotExist:
            return False
        
    async def delete_message_broadcast(self, event):
        await self.send(text_data=json.dumps({
        "type": "delete_success",
        "messageId": event["messageId"],
        "username": event["username"]
    }))

        
        
        
    
