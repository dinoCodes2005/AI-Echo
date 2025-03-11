from django.shortcuts import render

from .models import ChatMessage, ChatRoom

# Create your views here.
def index(request):
    chatrooms = ChatRoom.objects.all()
    return render(request,'index.html',{"rooms":chatrooms})

def chatroom(request,slug):
    chatroom = ChatRoom.objects.get(slug=slug)
    messages = ChatMessage.objects.filter(room__slug=slug)
    return render(request,'room.html',{"chatroom":chatroom,"messages":messages})