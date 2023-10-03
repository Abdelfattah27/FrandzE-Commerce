from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view , permission_classes
from rest_framework.permissions import IsAuthenticated , IsAdminUser
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED , HTTP_400_BAD_REQUEST
from ..models import Product, Review
from ..serializers import ProductSerializer, Userserializer, UserserializerWithToken
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework import status

from drf_yasg.utils import swagger_auto_schema


from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

@swagger_auto_schema(
    method="GET",
    operation_summary="Get Products",
    operation_description="Retrieve a list of products based on a provided keyword.",
    responses={
        200: openapi.Response(
            description="Successful response",
            examples={
                "application/json": [
                    {
                        "id": 1,
                        "name": "Product 1",
                        "price": 9.99
                    },
                    {
                        "id": 2,
                        "name": "Product 2",
                        "price": 19.99
                    }
                ]
            }
        ),
        400: "Bad Request"
    },
    manual_parameters=[
        openapi.Parameter(
            name="keyword",
            in_=openapi.IN_QUERY,
            description="The keyword to search for products. If not provided, all products will be returned.",
            type=openapi.TYPE_STRING,
            required=False
        )
    ]
)
@api_view(["GET"])
def getProducts(request):
    """
    Retrieve a list of products based on a provided keyword.

    --- GET Parameters ---
    - keyword (string, optional): The keyword to search for products. If not provided, all products will be returned.

    Returns:
    - 200 (OK): Successful response with a JSON array of serialized products.
    - 400 (Bad Request): If an error occurs during the retrieval process.

    Example response:
    [
        {
            "id": 1,
            "name": "Product 1",
            "price": 9.99
        },
        {
            "id": 2,
            "name": "Product 2",
            "price": 19.99
        }
    ]
    """
    try:
        query = request.query_params.get("keyword")
        products = Product.objects.filter(name__icontains=query or "")
        serializer = ProductSerializer(products, many=True) 
        return Response(serializer.data)
    except:
        return Response(status=status.HTTP_400_BAD_REQUEST)

# @api_view(["GET"])
# def getProducts(request) : 
#     try :
#         query = request.query_params.get("keyword")
#         products = Product.objects.filter(name__icontains=query or "")
#         serializer = ProductSerializer(products , many=True) 
#         return Response(serializer.data)
#     except : 
#         return Response(status=status.HTTP_400_BAD_REQUEST)


from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

@swagger_auto_schema(
    method="GET",
    operation_summary="Get Product",
    operation_description="Retrieve a single product based on the provided product ID.",
    responses={
        200: openapi.Response(
            description="Successful response",
            examples={
                "application/json": {
                    "id": 1,
                    "name": "Product 1",
                    "price": 9.99
                }
            }
        ),
        404: "Product Not Found"
    },
    manual_parameters=[
        openapi.Parameter(
            name="pk",
            in_=openapi.IN_PATH,
            description="The ID of the product to retrieve.",
            type=openapi.TYPE_INTEGER,
            required=True
        )
    ]
)
@api_view(["GET"])
def getProduct(request, pk):
    """
    Retrieve a single product based on the provided product ID.

    --- Path Parameters ---
    - pk (integer): The ID of the product to retrieve.

    Returns:
    - 200 (OK): Successful response with a serialized product.
    - 404 (Product Not Found): If the product with the provided ID does not exist.

    Example response:
    {
        "id": 1,
        "name": "Product 1",
        "price": 9.99
    }
    """
    try:
        product = Product.objects.get(_id=pk)
        serializer = ProductSerializer(product, many=False)
        return Response(serializer.data)
    except Product.DoesNotExist:
        return Response({"message": "Product Not Found"}, status=status.HTTP_404_NOT_FOUND)

# @api_view(["GET"])
# def getProduct(request , pk) : 
#     try :
#         product = Product.objects.get(_id = pk) 
#         serializer = ProductSerializer(product , many = False)
#         return Response(serializer.data)
#     except: 
#         return Response({"message" : "Product Not Found"} , status = status.HTTP_404_NOT_FOUND)


# @api_view(["DELETE"])
# @permission_classes([IsAdminUser]) 
# def deleteProduct(request , pk) : 
#     try : 
#         Product.objects.get(_id = pk).delete()
#         return Response({"message" : "deleted successfully"} , status=status.HTTP_204_NO_CONTENT)
#     except Exception as ex : 
#         print(str(ex)) 
#         return Response ({"message" : "Product Not Found"} ,status=status.HTTP_404_NOT_FOUND)
@swagger_auto_schema(
    method="DELETE",
    operation_summary="Delete Product",
    operation_description="Delete a single product based on the provided product ID.",
    responses={
        204: "Product Deleted Successfully",
        404: "Product Not Found"
    },
    manual_parameters=[
        openapi.Parameter(
            name="pk",
            in_=openapi.IN_PATH,
            description="The ID of the product to delete.",
            type=openapi.TYPE_INTEGER,
            required=True
        )
    ]
)
@api_view(["DELETE"])
@permission_classes([IsAdminUser]) 
def deleteProduct(request, pk):
    """
    Delete a single product based on the provided product ID.

    --- Path Parameters ---
    - pk (integer): The ID of the product to delete.

    Returns:
    - 204 (No Content): Product deleted successfully.
    - 404 (Product Not Found): If the product with the provided ID does not exist.
    """
    try:
        product = Product.objects.get(_id=pk)
        product.delete()
        return Response({"message": "Product Deleted Successfully"}, status=status.HTTP_204_NO_CONTENT)
    except Product.DoesNotExist:
        return Response({"message": "Product Not Found"}, status=status.HTTP_404_NOT_FOUND)



# @api_view(["POST"])
# @permission_classes([IsAdminUser]) 
# def createProduct(request) :
#     try : 
#         user= request.user
#         product = Product.objects.create(
#             user = user , 
#             name = "Sample name" , 
#             price = 0 , 
#             brand = "Sample brand" , 
#             countInStock = 0 , 
#             description = "" , 
#             category = "Sample category"
#         )
#         serializer = ProductSerializer(product)
#         return Response(serializer.data) 
#     except : 
#         return Response(status=status.HTTP_400_BAD_REQUEST)
        
@swagger_auto_schema(
    method="POST",
    operation_summary="Create Product",
    operation_description="Create a new product.",
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            "name": openapi.Schema(type=openapi.TYPE_STRING, description="The name of the product."),
            "price": openapi.Schema(type=openapi.TYPE_NUMBER, description="The price of the product."),
            "brand": openapi.Schema(type=openapi.TYPE_STRING, description="The brand of the product."),
            "countInStock": openapi.Schema(type=openapi.TYPE_INTEGER, description="The count of the product in stock."),
            "description": openapi.Schema(type=openapi.TYPE_STRING, description="A description of the product."),
            "category": openapi.Schema(type=openapi.TYPE_STRING, description="The category of the product.")
        },
        required=["name", "price", "brand", "countInStock", "description", "category"]
    ),
    responses={
        201: openapi.Response(
            description="Product Created Successfully",
            examples={
                "application/json": {
                    "id": 1,
                    "name": "Sample name",
                    "price": 0,
                    "brand": "Sample brand",
                    "countInStock": 0,
                    "description": "",
                    "category": "Sample category"
                }
            }
        ),
        400: "Bad Request"
    }
)
@api_view(["POST"])
@permission_classes([IsAdminUser]) 
def createProduct(request):
    """
    Create a new product.

    --- Request Body Parameters ---
    - name (string): The name of the product.
    - price (number): The price of the product.
    - brand (string): The brand of the product.
    - countInStock (integer): The count of the product in stock.
    - description (string): A description of the product.
    - category (string): The category of the product.

    Returns:
    - 201 (Created): Product created successfully with product details.
    - 400 (Bad Request): If the request body is invalid.
    """
    try:
        user = request.user
        product = Product.objects.create(
            user=user,
            name=request.data.get("name", "Sample name"),
            price=request.data.get("price", 0),
            brand=request.data.get("brand", "Sample brand"),
            countInStock=request.data.get("countInStock", 0),
            description=request.data.get("description", ""),
            category=request.data.get("category", "Sample category")
        )
        serializer = ProductSerializer(product)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as ex:
        return Response(status=status.HTTP_400_BAD_REQUEST)



# @api_view(["PUT"])
# @permission_classes([IsAdminUser]) 
# def updateProduct(request , pk) :
#     try : 
#         product =  Product.objects.get(_id = pk) 
#         data = request.data
#         product.name = data.get("name") or product.name
#         product.brand = data.get("brand") or product.brand
#         product.countInStock = data.get("countInStock") or product.countInStock
#         product.price = data.get("price") or product.price
#         product.description = data.get("description") or product.description
#         product.category = data.get("category") or product.category
#         product.save() 
#         serializer = ProductSerializer(product) 
#         return Response(serializer.data , status.HTTP_201_CREATED)
#     except Exception as ex : 
#         return Response(status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(
    method="PUT",
    operation_summary="Update Product",
    operation_description="Update an existing product based on the provided product ID.",
    manual_parameters=[
        openapi.Parameter(
            name="pk",
            in_=openapi.IN_PATH,
            description="The ID of the product to update.",
            type=openapi.TYPE_INTEGER,
            required=True
        )
    ],
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            "name": openapi.Schema(type=openapi.TYPE_STRING, description="The updated name of the product."),
            "price": openapi.Schema(type=openapi.TYPE_NUMBER, description="The updated price of the product."),
            "brand": openapi.Schema(type=openapi.TYPE_STRING, description="The updated brand of the product."),
            "countInStock": openapi.Schema(type=openapi.TYPE_INTEGER, description="The updated count in stock."),
            "description": openapi.Schema(type=openapi.TYPE_STRING, description="The updated description of the product."),
            "category": openapi.Schema(type=openapi.TYPE_STRING, description="The updated category of the product.")
        }
    ),
    responses={
        200: openapi.Response(
            description="Product Updated Successfully",
            examples={
                "application/json": {
                    "id": 1,
                    "name": "Updated Name",
                    "price": 19.99,
                    "brand": "Updated Brand",
                    "countInStock": 10,
                    "description": "Updated Description",
                    "category": "Updated Category"
                }
            }
        ),
        400: "Bad Request",
        404: "Product Not Found"
    }
)
@api_view(["PUT"])
@permission_classes([IsAdminUser]) 
def updateProduct(request, pk):
    """
    Update an existing product based on the provided product ID.

    --- Path Parameters ---
    - pk (integer): The ID of the product to update.

    --- Request Body Parameters (Optional) ---
    - name (string): The updated name of the product.
    - price (number): The updated price of the product.
    - brand (string): The updated brand of the product.
    - countInStock (integer): The updated count in stock.
    - description (string): The updated description of the product.
    - category (string): The updated category of the product.

    Returns:
    - 200 (OK): Product updated successfully with updated product details.
    - 400 (Bad Request): If the request body is invalid.
    - 404 (Product Not Found): If the product with the provided ID does not exist.
    """
    try:
        product = Product.objects.get(_id=pk)
        data = request.data
        product.name = data.get("name", product.name)
        product.brand = data.get("brand", product.brand)
        product.countInStock = data.get("countInStock", product.countInStock)
        product.price = data.get("price", product.price)
        product.description = data.get("description", product.description)
        product.category = data.get("category", product.category)
        product.save()
        serializer = ProductSerializer(product)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Product.DoesNotExist:
        return Response({"message": "Product Not Found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as ex:
        return Response(status=status.HTTP_400_BAD_REQUEST)


# @api_view(["POST"])
# def uploadImage(request) : 
#     try:
#         data = request.data
#         product_id = data.get("product_id" , None) 
#         image  = request.FILES.get("image")
#         if product_id  and image:  
#             product = Product.objects.get(_id = product_id)
#             product.image.save(image.name, image)
#             product.save()
#             serializer = ProductSerializer(product) 
#             return Response(serializer.data)
#         else : 
#             return Response({"message" : "Parameter missed"} , status=status.HTTP_400_BAD_REQUEST)

#     except Exception as ex:
#         return Response(status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(
    method="POST",
    operation_summary="Upload Product Image",
    operation_description="Upload an image for a product based on the provided product ID.",
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            "product_id": openapi.Schema(type=openapi.TYPE_INTEGER, description="The ID of the product to associate the image with."),
            "image": openapi.Schema(type=openapi.TYPE_FILE, description="The image file to upload.")
        },
        required=["product_id", "image"]
    ),
    responses={
        200: openapi.Response(
            description="Image Uploaded Successfully",
            examples={
                "application/json": {
                    "id": 1,
                    "name": "Product Name",
                    "price": 19.99,
                    "brand": "Product Brand",
                    "countInStock": 10,
                    "description": "Product Description",
                    "category": "Product Category",
                    "image": "http://example.com/media/product_image.jpg"
                }
            }
        ),
        400: "Bad Request"
    }
)
@api_view(["POST"])
def uploadImage(request):
    """
    Upload an image for a product based on the provided product ID.

    --- Request Body Parameters ---
    - product_id (integer): The ID of the product to associate the image with.
    - image (file): The image file to upload.

    Returns:
    - 200 (OK): Image uploaded successfully with updated product details including the image URL.
    - 400 (Bad Request): If the request body is missing parameters or if there's an issue with the image upload.
    """
    try:
        data = request.data
        product_id = data.get("product_id", None)
        image = request.FILES.get("image")
        if product_id and image:
            product = Product.objects.get(_id=product_id)
            product.image.save(image.name, image)
            product.save()
            serializer = ProductSerializer(product)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"message": "Parameter(s) missing"}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as ex:
        return Response(status=status.HTTP_400_BAD_REQUEST)


            
# @api_view(["POST"])
# @permission_classes([IsAuthenticated])
# def createProductReview(request , pk) : 
#     product = Product.objects.get(_id = pk) 
#     user =request.user 
#     data = request.data
#     alreadyExist = product.reviews.filter(user = user).exists()
    
#     if alreadyExist : 
#         return Response({"message" : "Product already reviewed"} , status=status.HTTP_400_BAD_REQUEST)
#     elif data["rating"] ==0 : 
#         return Response({"message" : "Please Select a rating"} , status=status.HTTP_400_BAD_REQUEST)
#     else :  
#         review = Review.objects.create(
#             user = user , 
#             product = product , 
#             name = user.username , 
#             rating = float(data["rating"]) , 
#             comment = data["comment"]
#         )
#         reviews = product.reviews.all()
#         product.numReviews = len(reviews)

#         total = 0 
#         for i in reviews :
#             total += i.rating
#         product.rating = total /  len(reviews)
#         product.save()
#         return Response({"message" : "Review Added Successfully"} , status=status.HTTP_201_CREATED)

@swagger_auto_schema(
    method="POST",
    operation_summary="Create Product Review",
    operation_description="Create a review for a product based on the provided product ID.",
    manual_parameters=[
        openapi.Parameter(
            name="pk",
            in_=openapi.IN_PATH,
            description="The ID of the product to review.",
            type=openapi.TYPE_INTEGER,
            required=True
        )
    ],
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            "rating": openapi.Schema(type=openapi.TYPE_NUMBER, description="The rating for the product (1 to 5)."),
            "comment": openapi.Schema(type=openapi.TYPE_STRING, description="Optional comment for the review.")
        },
        required=["rating"]
    ),
    responses={
        201: openapi.Response(
            description="Review Added Successfully",
            examples={
                "application/json": {
                    "message": "Review Added Successfully"
                }
            }
        ),
        400: "Bad Request"
    }
)
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def createProductReview(request, pk):
    """
    Create a review for a product based on the provided product ID.

    --- Path Parameters ---
    - pk (integer): The ID of the product to review.

    --- Request Body Parameters ---
    - rating (number): The rating for the product (1 to 5).
    - comment (string, optional): Optional comment for the review.

    Returns:
    - 201 (Created): Review added successfully.
    - 400 (Bad Request): If the request body is missing parameters, the product has already been reviewed, or the rating is invalid.
    """
    product = Product.objects.get(_id=pk)
    user = request.user
    data = request.data
    already_exist = product.reviews.filter(user=user).exists()

    if already_exist:
        return Response({"message": "Product already reviewed"}, status=status.HTTP_400_BAD_REQUEST)
    elif data["rating"] == 0 or data["rating"] > 5:
        return Response({"message": "Please select a valid rating (1 to 5)"}, status=status.HTTP_400_BAD_REQUEST)
    else:
        review = Review.objects.create(
            user=user,
            product=product,
            name=user.username,
            rating=float(data["rating"]),
            comment=data.get("comment", "")
        )
        reviews = product.reviews.all()
        product.numReviews = len(reviews)

        total = sum(review.rating for review in reviews)
        product.rating = total / len(reviews)
        product.save()
        return Response({"message": "Review Added Successfully"}, status=status.HTTP_201_CREATED)
