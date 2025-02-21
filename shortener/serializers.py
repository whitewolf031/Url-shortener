from rest_framework import serializers
from .models import ShortenedURL

class ShortenedURLSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShortenedURL
        fields = ['short_link', 'original_link', 'clicks', 'status', 'created_at']
        read_only_fields = ('short_link', 'clicks', 'status', 'created_at')

class ShortUrlDetailSerializer(serializers.ModelSerializer):
    short_link = serializers.SerializerMethodField()

    class Meta:
        model = ShortenedURL
        fields = "__all__"

    def get_short_link(self, obj):
        return f"http://127.0.0.1:8000/api/{obj.short_link}"