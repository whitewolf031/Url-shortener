from rest_framework import serializers
from .models import ShortenedURL

class ShortenedURLSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShortenedURL
        fields = ('original_link', 'short_link')

class ShortUrlDetailSerializer(serializers.ModelSerializer):
    short_link = serializers.SerializerMethodField()

    class Meta:
        model = ShortenedURL
        fields = "__all__"

    def get_short_link(self, obj):
        return f"http://127.0.0.1:8000/api/{obj.short_link}"

class UserShortenedURLSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShortenedURL
        fields = "__all__"

    def get_short_link(self, obj):
        return f"http://127.0.0.1:8000/api/{obj.short_link}"