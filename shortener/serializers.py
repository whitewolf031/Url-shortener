from rest_framework import serializers
from .models import Shortenedurl
from shortener.utils.short_link import generate_short_link  # Import the function

class ShortenedURLSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shortenedurl
        fields = ['id', 'original_link', 'short_link', 'click', 'created_at']
        read_only_fields = ['short_link', 'created_at']

    def create(self, validated_data):
        validated_data['short_link'] = generate_short_link()
        return super().create(validated_data)