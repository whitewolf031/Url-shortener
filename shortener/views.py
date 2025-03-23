from django.shortcuts import get_object_or_404, redirect
from django.utils.timezone import now
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics, viewsets, status
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema_view, extend_schema
from .models import ShortenedURL
from .serializers import ShortUrlDetailSerializer, ShortenedURLSerializer

class SitePagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 1000

# list all short url and create new short url:
@extend_schema_view(
    create=extend_schema(summary="Create a new shortened URL", tags=["URL Shortener"]),
)
# list all short url and create new short url:
@extend_schema_view(
    create=extend_schema(summary="Create a new shortened URL", tags=["URL Shortener"]),
)
class ShortenURLListView(generics.CreateAPIView):
    queryset = ShortenedURL.objects.all()
    serializer_class = ShortenedURLSerializer
    permission_classes = [AllowAny]  # ✅ Hamma foydalanuvchilar uchun ochiq

    def perform_create(self, serializer):
        """Foydalanuvchi avtorizatsiyadan o‘tgan bo‘lsa, user maydonini bog‘lash"""
        if self.request.user.is_authenticated:
            serializer.save(user=self.request.user)  # ✅ Foydalanuvchini bog‘lash
        else:
            serializer.save()

# Short url to original url:
@extend_schema_view(summary="Redirect a shortened URL", tags=["URL Shortener"])
class RedirectShortURLView(APIView):
    def get(self, request, short_link):
        try:
            url_instance = ShortenedURL.objects.get(short_link=short_link)
        except ShortenedURL.DoesNotExist:
            return Response({"error": "Shortened URL not found."}, status=status.HTTP_404_NOT_FOUND)

        url_instance.check_status()
        if not url_instance.status:
            return Response({"error": "This short URL is inactive."}, status=410)


        url_instance.clicks += 1
        url_instance.last_accessed = now()
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
    queryset = ShortenedURL.objects.order_by('-created_at')
    serializer_class = ShortUrlDetailSerializer
    pagination_class = SitePagination

    def get_queryset(self):
        queryset = ShortenedURL.objects.filter(user=self.request.user).order_by('-created_at')

        status = self.request.query_params.get('status')
        created_at = self.request.query_params.get('created_at')
        search_short = self.request.query_params.get('search_short')
        search_origin = self.request.query_params.get('search_origin')

        if status:
            queryset = queryset.filter(status=status)

        if created_at:
            queryset = queryset.filter(created_at=created_at)

        if search_short:
            queryset = queryset.filter(short_link=search_short)

        if search_origin:
            queryset = queryset.filter(original_link=search_origin)

        return queryset
    # def get_queryset(self):
    #     return ShortenedURL.objects.filter(user=self.request.user).order_by('-created_at')
