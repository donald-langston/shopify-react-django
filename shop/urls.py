from django.urls import path

from . import views

urlpatterns = [
    path('secret/', views.secret, name="secret"),
    path('get_products/', views.get_products, name="get_products"),
    path('webhook/', views.my_webhook_view, name="my_webhook_view"),
]