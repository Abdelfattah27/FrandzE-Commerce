from django.shortcuts import render
from django.http import JsonResponse
# from .products import products
from rest_framework.decorators import api_view , permission_classes
from rest_framework.permissions import IsAuthenticated , IsAdminUser
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED , HTTP_400_BAD_REQUEST
from ..models import Product, Review
from ..serializers import ProductSerializer, Userserializer, UserserializerWithToken
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework import status
# Create your views here.

@api_view(["GET"])
def getProducts(request) : 
    query = request.query_params.get("keyword")
    products = Product.objects.filter(name__icontains=query or "")
    serializer = ProductSerializer(products , many=True) 
    
    return Response(serializer.data)
@api_view(["GET"])
def getProduct(request , pk) : 
    product = Product.objects.get(_id = pk) 
    serializer = ProductSerializer(product , many = False)
    return Response(serializer.data)


@api_view(["DELETE"])
@permission_classes([IsAdminUser]) 
def deleteProduct(request , pk) : 
    try : 
        Product.objects.get(_id = pk).delete()
        return Response({"message" : "deleted successfully"} , status=status.HTTP_204_NO_CONTENT)
    except Exception as ex : 
        print(str(ex)) 
        return Response ({"message" : "Product Not Found"} ,status=status.HTTP_404_NOT_FOUND)

@api_view(["POST"])
@permission_classes([IsAdminUser]) 
def createProduct(request) :
    try : 
        user= request.user
        product = Product.objects.create(
            user = user , 
            name = "Sample name" , 
            price = 0 , 
            brand = "Sample brand" , 
            countInStock = 0 , 
            description = "" , 
            category = "Sample category"
        )
        serializer = ProductSerializer(product)
        return Response(serializer.data) 
    except : 
        return Response(status=status.HTTP_400_BAD_REQUEST)
        

@api_view(["PUT"])
@permission_classes([IsAdminUser]) 
def updateProduct(request , pk) :
    try : 
        product =  Product.objects.get(_id = pk) 
        data = request.data
        product.name = data["name"]
        product.brand = data["brand"]
        product.countInStock = data["countInStock"]
        product.price = data["price"]
        product.description = data["description"]
        product.category = data["category"]
        product.save() 
        print("passed")
        serializer = ProductSerializer(product) 
        return Response(serializer.data , status.HTTP_201_CREATED)
    except Exception as ex : 
        print(str(ex))
        return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
def uploadImage(request) : 
    try:
        data = request.data
        product_id = data["product_id"]
        product = Product.objects.get(_id = product_id)
        image  = request.FILES.get("image")
        product.image.save(image.name, image)
        product.save()
        
        serializer = ProductSerializer(product) 
        return Response(serializer.data)
    except Exception as ex:
        return Response(status=status.HTTP_400_BAD_REQUEST)

            
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def createProductReview(request , pk) : 
    product = Product.objects.get(_id = pk) 
    user =request.user 
    data = request.data
    alreadyExist = product.reviews.filter(user = user).exists()
    
    if alreadyExist : 
        return Response({"message" : "Product already reviewed"} , status=status.HTTP_400_BAD_REQUEST)
    elif data["rating"] ==0 : 
        return Response({"message" : "Please Select a rating"} , status=status.HTTP_400_BAD_REQUEST)
    else :  
        review = Review.objects.create(
            user = user , 
            product = product , 
            name = user.username , 
            rating = float(data["rating"]) , 
            comment = data["comment"]
        )
        reviews = product.reviews.all()
        product.numReviews = len(reviews)

        total = 0 
        for i in reviews :
            total += i.rating
        product.rating = total /  len(reviews)
        product.save()
        return Response({"message" : "Review Added Successfully"} , status=status.HTTP_201_CREATED)