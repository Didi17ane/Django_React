from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter
# from .views import IdentityViewSet, RegisterView
from .views import RegisterView

router = DefaultRouter()
# router.register(r'identities', IdentityViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path("register/", views.RegisterView.as_view(), name="register"),
    path('home/', views.HomeView.as_view(), name ='home'),
    path('logout/', views.LogoutView.as_view(), name ='logout')
]
