from django.db import models
from django.contrib.auth.models import User

class shortenedurl(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    original_link = models.TextField()
    short_link = models.CharField(max_length=10, unique=True)
    click = models.IntegerField(default=0)
    status = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
