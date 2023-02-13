from django.shortcuts import render
from django.http import JsonResponse
# from .products import products
from rest_framework.decorators import api_view , permission_classes
from rest_framework.permissions import IsAuthenticated , IsAdminUser
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED , HTTP_400_BAD_REQUEST
from ..models import Product
from ..serializers import ProductSerializer, Userserializer, UserserializerWithToken
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework import status
# Create your views here.




# @api_view(["POST"])
# def allProduct(request) : 
#     serializer = ProductSerializer(request.data) 
#     if serializer.is_valid() : 
#         serializer.save( ) 
#         return Response(status=HTTP_201_CREATED)
#     else : 
#         return Response(status=HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def registerUser(request) : 
    data = request.data 
    try : 
        user =User.objects.create(
        first_name = data["name"] , 
        username = data["email"] , 
        email = data["email"] , 
        password = make_password(data["password"])
        )
        serializer = UserserializerWithToken(user , many=False)
        return Response(serializer.data)
    except Exception as ex : 
        return Response({"detail": str(ex)} , status=HTTP_400_BAD_REQUEST)
        

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        serializer = UserserializerWithToken(self.user).data 
        for k , v in serializer.items() :
            data[k] = v
        
        
        # refresh = self.get_token(self.user)

        # data["refresh"] = str(refresh)
        # data["access"] = str(refresh.access_token)

        # if api_settings.UPDATE_LAST_LOGIN:
        #     update_last_login(None, self.user)

        return data
    # @classmethod
    # def get_token(cls, user):
    #     token = super().get_token(user)

    #     # Add custom claims
    #     token['username'] = user.username 
    #     token["message"] = "hello world" 
        
    #     # ...

    #     return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
    

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUserProfile(request) : 
    user = request.user 
    serializer = UserserializerWithToken(user, many=False) 
    data = request.data 
    user.username = data["email"] 
    user.first_name = data["name"]
    user.email = data["email"]
    if data["password"] != "" : 
        user.password = make_password(data["password"] )
    user.save()
    return Response(serializer.data)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserProfile(request) : 
    user = request.user 
    serializer = Userserializer(user, many=False) 
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAdminUser])
def getUsers(request) : 
    users = User.objects.all()
    serializer = Userserializer(users , many =True) 
    
    return Response(serializer.data)

@api_view(["DELETE"])
@permission_classes([IsAdminUser]) 
def deleteUser(requset , pk) : 
    try : 
        user = User.objects.get(id = pk)
        user.delete()
        return Response({"message": "User deleted successfully"} , status=status.HTTP_200_OK)
    except Exception as ex: 
        print(str(ex))
        return Response({"message" : "Not found"} , status= status.HTTP_404_NOT_FOUND)
  
@api_view(["GET"])
@permission_classes([IsAdminUser])       
def getUserById(requset , pk) : 
    try : 
        user = User.objects.get(id = pk)
        userInfo = Userserializer(user , many=False) 
        return Response(userInfo.data , status=status.HTTP_200_OK)
    except Exception as ex: 
        print(str(ex))
        return Response({"message" : "User Not found"} , status= status.HTTP_400_BAD_REQUEST)
    
    
@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateUser(request , pk) : 
    try:
        user = User.objects.get(id = pk)
    
        data = request.data 
        user.username = data["email"] 
        user.first_name = data["name"]
        user.email = data["email"]
        user.is_staff = data["isAdmin"]
        user.save()
        serializer = UserserializerWithToken(user, many=False) 
        return Response(serializer.data)
    except Exception as ex:
        print(str(ex)) 
        return Response({"message" : "User Not found"} , status= status.HTTP_400_BAD_REQUEST)

