from drf_spectacular.utils import extend_schema
from rest_framework import status, generics, permissions
from rest_framework.authtoken.models import Token
from django.contrib.auth import login
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from shortener.models import ShortenedURL
from shortener.serializers import UserShortenedURLSerializer
from .serializers import Registration, LoginSerializer, LogoutSerializer

class UserSitePagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 1000

# Register view:
@extend_schema(summary='Create Register Users', tags=['Users'])
class RegisterView(generics.CreateAPIView):
    serializer_class = Registration

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.save()
            return Response({"message": "User registered successfully."},
                            status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Login view:
@extend_schema(summary='Create user login', tags=['Users'])
class LoginView(generics.CreateAPIView):
    serializer_class = LoginSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.validated_data['user']
            login(request, user)
            token, created = Token.objects.get_or_create(user=user)  # Token yaratish yoki mavjudini olish

            # ✅ Username ni qo‘shamiz
            return Response({
                "message": "Login successful.",
                "token": token.key,
                "username": user.username  # Username ham response ga qo‘shildi
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(summary='Create user logout', tags=['Users'])
class LogoutView(generics.CreateAPIView):  # POST so‘rovini qabul qiladi
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        try:
            request.user.auth_token.delete()  # Tokenni o‘chirish
            return Response({"message": "Successfully logged out."}, status=status.HTTP_200_OK)
        except Token.DoesNotExist:
            return Response({"error": "User is already logged out or token not found."},
                            status=status.HTTP_400_BAD_REQUEST)

class UserShortenedURLsView(generics.ListAPIView):
    serializer_class = UserShortenedURLSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = UserSitePagination

    def get_queryset(self):
        return ShortenedURL.objects.filter(user=self.request.user)
