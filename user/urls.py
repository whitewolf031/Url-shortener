from django.urls import path
from user.views import RegisterView, LoginView, LogoutView, UserShortenedURLsView


urlpatterns = [
    path('registration/', RegisterView.as_view(), name='registration'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('user-urls/', UserShortenedURLsView.as_view(), name='user-urls'),
]