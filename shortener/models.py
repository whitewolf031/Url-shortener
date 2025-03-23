import random
import string
from django.db import models
from django.contrib.auth import get_user_model


# Get short link:
def generate_short_link():
    """Tasodifiy 6 belgidan iborat qisqa URL yaratish"""
    return ''.join(random.choices(string.ascii_letters + string.digits, k=6))

User = get_user_model()

# ShortenedUrl model:
class ShortenedURL(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='urls', null=True, blank=True)
    short_link = models.CharField(max_length=10, unique=True, default=generate_short_link)
    original_link = models.URLField(max_length=500)
    clicks = models.PositiveIntegerField(default=0)
    status = models.BooleanField(default=True)  # True = Active, False = Inactive
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.short_link} -> {self.original_link}"

    def check_status(self):
        """Agar link noaktiv bo'lsa, False qaytaradi"""
        return self.status