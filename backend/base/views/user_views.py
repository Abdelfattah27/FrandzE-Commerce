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
from drf_yasg.utils import swagger_auto_schema


from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

# Create your views here.

# @api_view(["POST"])
# def registerUser(request) : 
#     data = request.data 
#     try : 
#         user =User.objects.create(
#         first_name = data["name"] , 
#         username = data["email"] , 
#         email = data["email"] , 
#         password = make_password(data["password"])
#         )
#         serializer = UserserializerWithToken(user , many=False)
#         return Response(serializer.data)
#     except Exception as ex : 
#         return Response({"detail": str(ex)} , status=HTTP_400_BAD_REQUEST)

@swagger_auto_schema(
    method="POST",
    operation_summary="User Registration",
    operation_description="Register a new user.",
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            "name": openapi.Schema(type=openapi.TYPE_STRING, description="The first name of the user."),
            "email": openapi.Schema(type=openapi.TYPE_STRING, description="The email address of the user."),
            "password": openapi.Schema(type=openapi.TYPE_STRING, description="The user's password.")
        },
        required=["name", "email", "password"]
    ),
    responses={
        200: openapi.Response(
            description="User Registered Successfully",
            examples={
                "application/json": {
                    "id": 1,
                    "first_name": "John",
                    "username": "john@example.com",
                    "email": "john@example.com",
                    "token": "your_auth_token_here"
                }
            }
        ),
        400: "Bad Request"
    }
)
@api_view(["POST"])
def registerUser(request):
    """
    Register a new user.

    --- Request Body Parameters ---
    - name (string): The first name of the user.
    - email (string): The email address of the user.
    - password (string): The user's password.

    Returns:
    - 200 (OK): User registered successfully with user details and authentication token.
    - 400 (Bad Request): If the request body is missing parameters or if there's an issue with user registration.
    """
    data = request.data
    try:
        user = User.objects.create(
            first_name=data["name"],
            username=data["email"],
            email=data["email"],
            password=make_password(data["password"])
        )
        serializer = UserserializerWithToken(user, many=False)
        return Response(serializer.data)
    except Exception as ex:
        return Response({"detail": str(ex)}, status=status.HTTP_400_BAD_REQUEST)

        

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        serializer = UserserializerWithToken(self.user).data 
        for k , v in serializer.items() :
            data[k] = v
        return data

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
    

# @api_view(['PUT'])
# @permission_classes([IsAuthenticated])
# def updateUserProfile(request) : 
#     user = request.user 
#     serializer = UserserializerWithToken(user, many=False) 
#     data = request.data 
#     user.username = data["email"] 
#     user.first_name = data["name"]
#     user.email = data["email"]
#     if data["password"] != "" : 
#         user.password = make_password(data["password"] )
#     user.save()
#     return Response(serializer.data)


@swagger_auto_schema(
    method="PUT",
    operation_summary="Update User Profile",
    operation_description="Update the user's profile information.",
    responses={
        200: openapi.Response(
            description="User Profile Updated Successfully",
            examples={
                "application/json": {
                    "id": 1,
                    "first_name": "Updated Name",
                    "username": "updated_email@example.com",
                    "email": "updated_email@example.com",
                    "token": "your_updated_auth_token_here"
                }
            }
        ),
        400: "Bad Request"
    }
)
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUserProfile(request):
    """
    Update the user's profile information.

    --- Request Body Parameters ---
    - name (string): The updated first name of the user.
    - email (string): The updated email address of the user.
    - password (string, optional): The updated user's password. Leave empty to keep the existing password.

    Returns:
    - 200 (OK): User profile updated successfully with updated user details and authentication token.
    - 400 (Bad Request): If the request body is missing parameters or if there's an issue with profile update.
    """
    user = request.user
    serializer = UserserializerWithToken(user, many=False)
    data = request.data
    user.username = data["email"]
    user.first_name = data["name"]
    user.email = data["email"]
    
    if data["password"] != "":
        user.password = make_password(data["password"])
    
    user.save()
    return Response(serializer.data)


# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def getUserProfile(request) : 
#     user = request.user 
#     serializer = Userserializer(user, many=False) 
#     return Response(serializer.data)

@swagger_auto_schema(
    method="GET",
    operation_summary="Get User Profile",
    operation_description="Retrieve the user's profile information.",
    responses={
        200: openapi.Response(
            description="User Profile Retrieved Successfully",
            examples={
                "application/json": {
                    "id": 1,
                    "first_name": "User Name",
                    "username": "user_email@example.com",
                    "email": "user_email@example.com"
                }
            }
        )
    }
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    """
    Retrieve the user's profile information.

    Returns:
    - 200 (OK): User profile retrieved successfully with user details.
    """
    user = request.user
    serializer = Userserializer(user, many=False)
    return Response(serializer.data)



# @api_view(["GET"])
# @permission_classes([IsAdminUser])
# def getUsers(request) : 
#     users = User.objects.all()
#     serializer = Userserializer(users , many =True) 
#     return Response(serializer.data)

@swagger_auto_schema(
    method="GET",
    operation_summary="Get All Users",
    operation_description="Retrieve a list of all users (admin access required).",
    responses={
        200: openapi.Response(
            description="Users Retrieved Successfully",
            examples={
                "application/json": [
                    {
                        "id": 1,
                        "first_name": "User 1",
                        "username": "user1@example.com",
                        "email": "user1@example.com"
                    },
                    {
                        "id": 2,
                        "first_name": "User 2",
                        "username": "user2@example.com",
                        "email": "user2@example.com"
                    }
                    # Add more user examples as needed
                ]
            }
        )
    }
)
@api_view(["GET"])
@permission_classes([IsAdminUser])
def getUsers(request):
    """
    Retrieve a list of all users (admin access required).

    Returns:
    - 200 (OK): Users retrieved successfully with user details.
    """
    users = User.objects.all()
    serializer = Userserializer(users, many=True)
    return Response(serializer.data)



# @api_view(["DELETE"])
# @permission_classes([IsAdminUser]) 
# def deleteUser(requset , pk) : 
#     try : 
#         user = User.objects.get(id = pk)
#         user.delete()
#         return Response({"message": "User deleted successfully"} , status=status.HTTP_200_OK)
#     except Exception as ex: 
#         return Response({"message" : "Not found"} , status= status.HTTP_404_NOT_FOUND)
@swagger_auto_schema(
    method="DELETE",
    operation_summary="Delete User",
    operation_description="Delete a user by their ID (admin access required).",
    manual_parameters=[
        openapi.Parameter(
            name="pk",
            in_=openapi.IN_PATH,
            description="The ID of the user to delete.",
            type=openapi.TYPE_INTEGER,
            required=True
        )
    ],
    responses={
        200: openapi.Response(
            description="User Deleted Successfully",
            examples={
                "application/json": {
                    "message": "User deleted successfully"
                }
            }
        ),
        404: "Not Found"
    }
)
@api_view(["DELETE"])
@permission_classes([IsAdminUser]) 
def deleteUser(request, pk):
    """
    Delete a user by their ID (admin access required).

    --- Path Parameters ---
    - pk (integer): The ID of the user to delete.

    Returns:
    - 200 (OK): User deleted successfully.
    - 404 (Not Found): If the user with the provided ID does not exist.
    """
    try:
        user = User.objects.get(id=pk)
        user.delete()
        return Response({"message": "User deleted successfully"}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({"message": "Not found"}, status=status.HTTP_404_NOT_FOUND)



# @api_view(["GET"])
# @permission_classes([IsAdminUser])       
# def getUserById(requset , pk) : 
#     try : 
#         user = User.objects.get(id = pk)
#         userInfo = Userserializer(user , many=False) 
#         return Response(userInfo.data , status=status.HTTP_200_OK)
#     except Exception as ex: 
#         print(str(ex))
#         return Response({"message" : "User Not found"} , status= status.HTTP_400_BAD_REQUEST)
    
@swagger_auto_schema(
    method="GET",
    operation_summary="Get User by ID",
    operation_description="Retrieve user details by their ID (admin access required).",
    manual_parameters=[
        openapi.Parameter(
            name="pk",
            in_=openapi.IN_PATH,
            description="The ID of the user to retrieve.",
            type=openapi.TYPE_INTEGER,
            required=True
        )
    ],
    responses={
        200: openapi.Response(
            description="User Retrieved Successfully",
            examples={
                "application/json": {
                    "id": 1,
                    "first_name": "User Name",
                    "username": "user@example.com",
                    "email": "user@example.com"
                }
            }
        ),
        400: "Bad Request"
    }
)
@api_view(["GET"])
@permission_classes([IsAdminUser])       
def getUserById(request, pk):
    """
    Retrieve user details by their ID (admin access required).

    --- Path Parameters ---
    - pk (integer): The ID of the user to retrieve.

    Returns:
    - 200 (OK): User details retrieved successfully.
    - 400 (Bad Request): If the user with the provided ID does not exist.
    """
    try:
        user = User.objects.get(id=pk)
        user_info = Userserializer(user, many=False)
        return Response(user_info.data, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({"message": "User Not found"}, status=status.HTTP_400_BAD_REQUEST)


# @api_view(['PUT'])
# @permission_classes([IsAdminUser])
# def updateUser(request , pk) : 
#     try:
#         user = User.objects.get(id = pk)
#         data = request.data 
#         user.username = data["email"] 
#         user.first_name = data["name"]
#         user.email = data["email"]
#         user.is_staff = data["isAdmin"]
#         user.save()
#         serializer = UserserializerWithToken(user, many=False) 
#         return Response(serializer.data)
#     except Exception as ex:
#         print(str(ex)) 
#         return Response({"message" : "User Not found"} , status= status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(
    method="PUT",
    operation_summary="Update User",
    operation_description="Update user details by their ID (admin access required).",
    manual_parameters=[
        openapi.Parameter(
            name="pk",
            in_=openapi.IN_PATH,
            description="The ID of the user to update.",
            type=openapi.TYPE_INTEGER,
            required=True
        )
    ],
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            "name": openapi.Schema(type=openapi.TYPE_STRING, description="The updated first name of the user."),
            "email": openapi.Schema(type=openapi.TYPE_STRING, description="The updated email address of the user."),
            "isAdmin": openapi.Schema(type=openapi.TYPE_BOOLEAN, description="Whether the user is an admin.")
        },
        required=["name", "email", "isAdmin"]
    ),
    responses={
        200: openapi.Response(
            description="User Updated Successfully",
            examples={
                "application/json": {
                    "id": 1,
                    "first_name": "Updated Name",
                    "username": "updated_email@example.com",
                    "email": "updated_email@example.com",
                    "token": "your_updated_auth_token_here"
                }
            }
        ),
        400: "Bad Request"
    }
)
@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateUser(request, pk):
    """
    Update user details by their ID (admin access required).

    --- Path Parameters ---
    - pk (integer): The ID of the user to update.

    --- Request Body Parameters ---
    - name (string): The updated first name of the user.
    - email (string): The updated email address of the user.
    - isAdmin (boolean): Whether the user is an admin.

    Returns:
    - 200 (OK): User details updated successfully with updated user details and authentication token.
    - 400 (Bad Request): If the request body is missing parameters or if there's an issue with user update.
    """
    try:
        user = User.objects.get(id=pk)
        data = request.data
        user.username = data.get("email" ,user.username )
        user.first_name = data.get("name" , user.first_name)
        user.email = data.get("email" , user.email)
        user.is_staff = data.get("isAdmin" , user.is_staff)
        user.save()
        serializer = UserserializerWithToken(user, many=False)
        return Response(serializer.data)
    except User.DoesNotExist:
        return Response({"message": "User Not found"}, status=status.HTTP_400_BAD_REQUEST)
