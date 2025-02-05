from django.contrib.auth import login
from drf_spectacular.utils import extend_schema
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from user.serializers import *


#for Swagger
@extend_schema(summary='Create Register Users', tags=['Users'])

class RegisterView(generics.CreateAPIView):
    serializer_class = Registration

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response({"message": "User registered successfully."}, status=status.HTTP_201_CREATED, headers=headers)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#For Swagger
@extend_schema(summary='Create Register Users', tags=['Users'])

class LoginView(generics.CreateAPIView):
    serializer_class = LoginSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.validate_data["user"]
            login(request, user) # log in the user
            return Response({"message": "Login successfully."}, status=status.HTTP_201_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@extend_schema(summary='Create Register Users', tags=['Users'])

class LogoutView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = logoutSerializer

    def create(self, request, *args, **kwargs):
        if hasattr(request.user, 'auth_token'):
            request.user.auth_token.delete()

        return Response({"message": "Successfully logged out."}, status=status.HTTP_200_OK)