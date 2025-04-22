from django.urls import path
from . import views
urlpatterns = [
    path("register", views.RegisterView.as_view(), name="register"),
    path('home/', views.HomeView.as_view(), name ='home'),
    path('logout/', views.LogoutView.as_view(), name ='logout')
]