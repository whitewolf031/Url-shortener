from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    # ---------------------- Admin Panel ----------------------
    path('admin/', admin.site.urls),

    # ---------------------- Authentication (Djoser) ----------------------
    path('auth/', include('djoser.urls')),  # Asosiy Djoser URL-lari
    # path('auth/', include('djoser.urls.jwt')),  # JWT uchun
    path('auth/', include('djoser.urls.authtoken')),

    # ---------------------- API Routes ----------------------
    path('api/', include('shortener.urls')),  # Shortener uchun API yo‘llari
]
