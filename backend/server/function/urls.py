from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'posts', views.PostViewSet, basename='post')
router.register(r'accounts', views.SocialAccountViewSet, basename='socialaccount')

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/auth/register/', views.create_user, name='register'),
    path('api/auth/login/', views.login_user, name='login'),
]