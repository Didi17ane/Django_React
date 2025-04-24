from rest_framework import serializers
from .models import Identity, PieceId
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
class PieceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Identity
        fields = ['name', 'lastname', 'birth_date', 'email', 'image']

    def create(self, validated_data):
        piece = Identity.objects.create(**validated_data)
        return piece

class IdentitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Identity
        fields = '__all__'
