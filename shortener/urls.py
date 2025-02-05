from django.urls import path
from shortener.views import ShortenedURLViewset, GenerateQRCodeView
# from rest_framework.routers import DefaultRouter

# router = DefaultRouter()
# router.register(r'shortener', ShortenedURLViewset, basename='shortener')


urlpatterns = [
    path('shortener/create-shortener/', ShortenedURLViewset.as_view({'post': 'create'})),
    path('shortener/getlist-shortener/', ShortenedURLViewset.as_view({'get': 'list'})),
    path('shortener/put-shortener/<int:pk>/', ShortenedURLViewset.as_view({'put': 'update'})),
    path('shortener/patch-shortener/<int:pk>/', ShortenedURLViewset.as_view({'patch': 'partial_update'})),
    path('shortener/delete-shortener/<int:pk>/', ShortenedURLViewset.as_view({'delete': 'destroy'})),
    path('shortener/get-project/<int:pk>/', ShortenedURLViewset.as_view({'get': 'retrieve'})),
    path('qr/<str:short_link>/', GenerateQRCodeView.as_view(), name='generate_qr_code'),
]