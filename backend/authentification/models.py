from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Token(models.Model):
    id = models.AutoField(primary_key=True)
    token = models.CharField(max_length=255)
    created_at = models.DateTimeField()
    expires_at = models.DateTimeField()
    user_id = models.IntegerField()
    is_used = models.BooleanField(default=False)


class Identity(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=100)
    birth_date = models.DateField()
    email = models.EmailField()
    image = models.ImageField(upload_to='ids/')
    id_number = models.CharField(max_length=50)
    id_type = models.CharField(max_length=50)
    expiry_date = models.DateField()
    is_validated = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
