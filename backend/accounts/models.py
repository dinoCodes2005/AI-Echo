from django.db import models
from django.contrib.auth.models import AbstractUser
from phonenumber_field.modelfields import PhoneNumberField

# Create your models here.
class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]
    def __str__(self):
        return self.email
    
class Profile(models.Model):
    user = models.OneToOneField(CustomUser,null=True,on_delete=models.CASCADE)
    pinned_rooms = models.ManyToManyField('chatapp.ChatRoom',blank=True,related_name="pinned_by")
    profileImage = models.ImageField(upload_to='profile_pics',null=True,blank=True,default="profile_pics/default_profile_pic.jpg")
    bio = models.TextField()
    contact = PhoneNumberField(blank=True, null=True)
    age = models.IntegerField(null=True, blank=True)
    ai_tone = models.CharField(max_length=20, choices=[
        ('professional', 'Professional'),
        ('friendly', 'Friendly'),
        ('humorous', 'Humorous'),
        ('mentor', 'Mentor-like')
    ], default='friendly')
    ai_response_length = models.CharField(max_length=10, choices=[
        ('short', 'Short (1-2 sentences)'),
        ('medium', 'Medium (paragraph)'),
        ('detailed', 'Detailed')
    ], default='medium')
    preferred_domains = models.JSONField(
        default=['technology', 'science']
    )
    preferred_response_format = models.CharField(
        max_length=20,
        choices=[
            ('paragraph', 'Paragraphs'),
            ('bullet', 'Bullet Points'),
            ('step', 'Step-by-Step'),
            ('tabbed', 'Tabbed View')
        ],
        default='paragraph'
    )
    preferred_language = models.JSONField(
        default = ['english','hindi']
    )
    def __str__(self):
        return self.user.username