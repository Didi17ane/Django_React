from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter
# from .views import IdentityViewSet, RegisterView

router = DefaultRouter()
# router.register(r'identities', IdentityViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path("piece_id/", views.PieceIdView.as_view(), name="piece_id"),
    path("register/", views.RegisterView.as_view(), name="register"),
    path('home/', views.HomeView.as_view(), name ='home'),
    # path('test/', views.TestViewSet, name ='test'),
    path('logout/', views.LogoutView.as_view(), name ='logout')
]
