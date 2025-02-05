from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets
from .models import Shortenedurl
from .serializers import ShortenedURLSerializer
import random
import string
import qrcode
from io import BytesIO
import base64

class ShortenedURLViewset(viewsets.ModelViewSet):
    queryset = Shortenedurl.objects.all()
    serializer_class = ShortenedURLSerializer

    def create(self, request, *args, **kwargs):
        original_url = request.data.get('original_link')

        if not original_url:
            return Response({'error': 'Original URL is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Get the HTTP host (domain)
        http_host = request.get_host()

        existing_url = Shortenedurl.objects.filter(original_link=original_url).first()
        if existing_url:
            serializer = self.get_serializer(existing_url)
            return Response(serializer.data, status=status.HTTP_200_OK)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        shorten_url = f"http://{http_host}/{serializer.instance.short_link}"

        return Response({
            "original_url": serializer.instance.original_link,
            "short_link": shorten_url,
            "clicks": serializer.instance.clicks,
            "created_at": serializer.instance.created_at.isoformat()
        }, status=status.HTTP_201_CREATED)


class GenerateQRCodeView(APIView):
    def get(self, request, short_link):
        try:
            shortened_url = Shortenedurl.objects.get(short_link=short_link)
            qr = qrcode.QRCode(version=1, box_size=10, border=5)
            qr.add_data(shortened_url.original_link)
            qr.make(fit=True)
            img = qr.make_image(fill='black', back_color='white')
            buffer = BytesIO()
            img.save(buffer, format="PNG")
            img_str = base64.b64encode(buffer.getvalue()).decode()
            return Response({'qr_code': img_str}, status=status.HTTP_200_OK)
        except Shortenedurl.DoesNotExist:
            return Response({'error': 'Short URL not found'}, status=status.HTTP_404_NOT_FOUND)
