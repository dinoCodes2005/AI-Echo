from calendar import prmonth
from django.shortcuts import render
from grpc import Status

from accounts.models import CustomUser

from .models import ChatMessage, ChatRoom
from .serializers import ChatMessageSerializer, ChatRoomSerializer
from rest_framework import viewsets
from rest_framework.decorators import api_view
from django.http import JsonResponse
import json
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from .forms import ChatRoomForm
from django.shortcuts import get_object_or_404
import google.generativeai as genai
from django.http import StreamingHttpResponse
from django.conf import settings

# Create your views here.

class ChatRoomViewSet(viewsets.ModelViewSet):
    queryset = ChatRoom.objects.all()
    serializer_class = ChatRoomSerializer
    
class ChatMessageViewSet(viewsets.ModelViewSet):
    queryset = ChatMessage.objects.all().select_related("user")
    serializer_class = ChatMessageSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        room_slug = self.request.GET.get("room")
        queryset = queryset.filter(room__slug = room_slug)
        return queryset
    
@csrf_exempt
def create_message(request):
    if request.method == "POST":
        data = json.loads(request.body)
        user = CustomUser.objects.get(username = data["user"])
        room = get_object_or_404(ChatRoom,slug= data["room"])
        message = ChatMessage(
                            user=user,
                            room=room,
                            message_content = data["message"])
        message.save()
        return JsonResponse({
                'success': True,
                'message': message.message_content,
                'user': message.user.username,
                'room': message.room.slug,
            }, status=201)
    else:
        return JsonResponse(
            {"error": "Method not allowed. Use POST."},
            status=405
        )
    
@csrf_exempt
def delete_message(request):
    if(request.method == "POST"):
        data = json.loads(request.body)
        ChatMessage.objects.get(id=data["messageId"]).delete()
        return JsonResponse({
            'success':True,
            'message':"Message has been deleted by ",
        })    
    else:
        return JsonResponse({"error":"Method not allowed. Use POST"},
                            status=405)
    

@csrf_exempt  
def create_room(request):
    if request.method == "POST":
        form = ChatRoomForm(request.POST,request.FILES)
        print(request.POST)
        if form.is_valid():
            form.save()
            return JsonResponse({'message':'Room has been created'},status=200)
    return JsonResponse({'error':form.errors})

@csrf_exempt
def fetch_user(request,id):
    user = get_object_or_404(CustomUser,pk=id)
    if(user):
        return JsonResponse({'username':user.username,'email':user.email})
    else:
        return JsonResponse({'error':'User not found'})
    
genai.configure(api_key = settings.GEMINI_API_KEY)
@csrf_exempt
def fetch_reply(request):
    data = json.loads(request.body)
    prompt = data["prompt"]
    if not prompt:
        return JsonResponse({
            "success":False,
            "reply":"Prompt is Empty",
            
        },status = 400,)
    try:
        model = genai.GenerativeModel("gemini-2.0-flash")
        response = model.generate_content(prompt, stream=True)

        def stream_data():
            try:
                for chunk in response:
                    if chunk.text:
                        yield chunk.text + " "
            except Exception as e:
                yield f"Error: {str(e)}"

        return StreamingHttpResponse(stream_data(), content_type="text/plain")

    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)}, status=500)
    
    