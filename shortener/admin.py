from django.contrib import admin
from shortener.models import *

admin.site.register(ShortenedURL)
class ShortenedURLAdmin(admin.ModelAdmin):
    list_display = ('short_link', 'original_link', 'clicks', 'status', 'created_at')
    search_fields = ('short_link', 'original_link')