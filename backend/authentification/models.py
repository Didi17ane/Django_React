from django.db import models
from django import forms
from django.contrib.auth.models import User
# from django.contrib.auth.models import Piece

# Create your models here.

class Token(models.Model):
    id = models.AutoField(primary_key=True)
    token = models.CharField(max_length=255)
    created_at = models.DateTimeField()
    expires_at = models.DateTimeField()
    user_id = models.IntegerField()
    is_used = models.BooleanField(default=False)


class Identity(models.Model):
    # user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    lastname = models.CharField(max_length=100)
    birth_date = models.DateField()
    email = models.EmailField()
    image = models.ImageField(upload_to='ids/')
    number_piece = models.CharField(max_length=50)
    type_piece = models.CharField(max_length=50)
    expiry_date = models.DateField(default=None, blank=True, null=True)
    is_validated = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

class PieceId(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    lastname = models.CharField(max_length=100)
    birth_date = models.DateField()
    email = models.EmailField()
    image = models.ImageField(upload_to='ids/')
