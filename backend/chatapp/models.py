from django.db import models
from django.contrib.auth.models import User

from accounts.models import CustomUser

# Create your models here.
class ChatRoom(models.Model):
    name = models.CharField(max_length = 100)
    slug = models.SlugField(unique=True)
    image = models.ImageField(upload_to='room_images/', null=True, blank=True)
    
    def __str__(self):
        return self.name
    
    
class ChatMessage(models.Model):
    user = models.ForeignKey(CustomUser,on_delete=models.CASCADE)
    room = models.ForeignKey(ChatRoom,on_delete=models.CASCADE)
    message_content = models.TextField()
    date = models.DateField(auto_now=True)
    time = models.TimeField(auto_now=True)
        
    class Meta:
        ordering = ('date',)
        
    def __str__(self):
        return f"{self.user.username} - {self.room.name} - {self.message_content}"
    