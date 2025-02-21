from django.shortcuts import get_object_or_404, redirect
from rest_framework import generics, viewsets
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema_view, extend_schema
from common.permissions import IsAdminOrReadOnly
from .models import ShortenedURL
from .serializers import ShortUrlDetailSerializer, ShortenedURLSerializer

class SitePagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 1000

# list all short url and create new short url:
@extend_schema_view(
    create=extend_schema(summary="Create a new shortened URL", tags=["URL Shortener"]),
)
class ShortenURLListView(generics.CreateAPIView):
    queryset = ShortenedURL.objects.all()
    serializer_class = ShortenedURLSerializer
    pagination_class = SitePagination

# Short url to original url:
@extend_schema_view(summary="Redirect a shortened URL", tags=["URL Shortener"])
class RedirectShortURLView(APIView):
    def get(self, request, short_link):
        url_instance = get_object_or_404(ShortenedURL, short_link=short_link, status=True)
        url_instance.save()
        return redirect(url_instance.original_link)



# ShortUrl details CRUD:
@extend_schema_view(
    list=extend_schema(summary='List Short Urls', tags=['Short Url Details']),
    retrieve=extend_schema(summary='Retrieve Short Urls', tags=['Short Url Details']),
    create=extend_schema(summary='Create Short Urls', tags=['Short Url Details']),
    update=extend_schema(summary='Update Short Urls', tags=['Short Url Details']),
    partial_update=extend_schema(summary='Partial Update Short Urls', tags=['Short Url Details']),
    destroy=extend_schema(summary='Delete Short Urls', tags=['Short Url Details']),
)

class ShortUrlCrud(viewsets.ModelViewSet):
    queryset = ShortenedURL.objects.all().order_by('-created_at')
    serializer_class = ShortUrlDetailSerializer
    pagination_class = SitePagination