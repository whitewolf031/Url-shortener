from user.urls import urlpatterns as users_urls
from shortener.urls import urlpatterns as shortener_urls

app_name = 'api'

urlpatterns = [

]

urlpatterns += users_urls
urlpatterns += shortener_urls