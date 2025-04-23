from django.shortcuts import render
from rest_framework import viewsets, permissions, generics
from django.contrib.auth.models import User
from .models import Identity
from .serializers import IdentitySerializer, RegisterSerializer

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

class HomeView(APIView):
     
    permission_classes = (IsAuthenticated, )
    def get(self, request):
        content = {'message': 'Welcome to the JWT Authentication page using React Js and Django!'}
    
        return Response(content)
    
class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)
    def post(self, request):
        
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class RegisterView(generics.CreateAPIView):
    def post(self, request):
        print(request.data)
        
        # request.data["password"] = make_password(
        #     password=request.data["password"], salt=SALT
        # )
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"success": True, "message": "You are now registered on our website!"},
                # status=status.HTTP_200_OK,
            )
        else:
            error_msg = ""
            for key in serializer.errors:
                error_msg += serializer.errors[key][0]
            return Response(
                {"success": False, "message": error_msg},
                # status=status.HTTP_200_OK,7
            )



# class RegisterView(generics.CreateAPIView):
#     queryset = User.objects.all()
#     serializer_class = RegisterSerializer

# class IdentityViewSet(viewsets.ModelViewSet):
#     queryset = Identity.objects.all()
#     serializer_class = IdentitySerializer
#     permission_classes = [permissions.IsAuthenticated]
