
from attr import fields
from .models import CustomUser, Profile
from rest_framework import serializers
from django.contrib.auth import authenticate



class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields ='__all__'
        
class CustomUserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)
    class Meta:
        model = CustomUser
        fields = ("id",'username','email','profile','first_name','last_name','is_active','date_joined')

class UserRegistrationSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)
    
    class Meta:
        model = CustomUser
        fields = ("id",'username','email','password1','password2')
        extra_kwargs = {"password":{"write_only":True}}

    def validate(self,attrs):
        if attrs["password1"] != attrs["password2"]:
            raise serializers.ValidationError("Passwords do not match !!")
        if len(attrs['password1']) < 8:
            raise serializers.ValidationError("Passoword must be at least 8 characters !!")
        return attrs
    
    def create(self,validate_data):
        password = validate_data.pop('password1')
        validate_data.pop("password2")
        return CustomUser.objects.create_user(password=password,**validate_data)
    
class UserLoginSerializer(serializers.Serializer):
    email = serializers.CharField()
    password = serializers.CharField(write_only = True)
    def validate(self,data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Incorrect Credentials")
    

        