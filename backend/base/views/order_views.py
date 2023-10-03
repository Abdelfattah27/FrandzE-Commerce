from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view  , permission_classes
from rest_framework.permissions import IsAdminUser , IsAuthenticated
from rest_framework import status
from ..models import Order , ShippingAddress , OrderItems , Product
from datetime import datetime
from django.contrib.auth.models import User

from ..serializers import OrderSerializer
from drf_yasg.utils import swagger_auto_schema


from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema


@swagger_auto_schema(
    method="POST",
    operation_summary="Add Order Items",
    operation_description="Create an order by adding items to the order (authenticated user access required).",
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            "orderItems": openapi.Schema(
                type=openapi.TYPE_ARRAY,
                description="List of items to be added to the order.",
                items=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "product": openapi.Schema(type=openapi.TYPE_INTEGER, description="Product ID"),
                        "quantity": openapi.Schema(type=openapi.TYPE_INTEGER, description="Quantity"),
                        "price": openapi.Schema(type=openapi.TYPE_NUMBER, description="Price per unit")
                    },
                    required=["product", "quantity", "price"]
                )
            ),
            "paymentMethod": openapi.Schema(type=openapi.TYPE_STRING, description="Payment method"),
            "taxPrice": openapi.Schema(type=openapi.TYPE_NUMBER, description="Tax price"),
            "shippingPrice": openapi.Schema(type=openapi.TYPE_NUMBER, description="Shipping price"),
            "totalPrice": openapi.Schema(type=openapi.TYPE_NUMBER, description="Total price"),
            "shippingAddress": openapi.Schema(
                type=openapi.TYPE_OBJECT,
                description="Shipping address",
                properties={
                    "address": openapi.Schema(type=openapi.TYPE_STRING, description="Address"),
                    "city": openapi.Schema(type=openapi.TYPE_STRING, description="City"),
                    "postalCode": openapi.Schema(type=openapi.TYPE_STRING, description="Postal code"),
                    "country": openapi.Schema(type=openapi.TYPE_STRING, description="Country")
                },
                required=["address", "city", "postalCode", "country"]
            )
        },
        required=["orderItems", "paymentMethod", "taxPrice", "shippingPrice", "totalPrice", "shippingAddress"]
    ),
    responses={
        201: openapi.Response(
            description="Order Created Successfully",
            examples={
                "application/json": {
                    "id": 1,
                    "user": 1,
                    "payment_method": "PayPal",
                    "tax_price": 2.0,
                    "shipping_price": 5.0,
                    "total_price": 25.0,
                    "shipping_address": {
                        "address": "123 Main St",
                        "city": "City",
                        "postal_code": "12345",
                        "country": "Country"
                    },
                    "order_items": [
                        {
                            "product": 1,
                            "name": "Product 1",
                            "quantity": 2,
                            "price": 10.0,
                            "image": "http://example.com/media/product_image.jpg"
                        }
                    ],
                    "is_paid": False,
                    "created_at": "2023-09-26T00:00:00Z"
                }
            }
        ),
        400: "Bad Request"
    }
)
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def addOrserItems(request) : 
    """
    Create an order by adding items to the order (authenticated user access required).

    --- Request Body Parameters ---
    - orderItems (array): List of items to be added to the order.
      - product (integer): Product ID.
      - quantity (integer): Quantity.
      - price (number): Price per unit.
    - paymentMethod (string): Payment method.
    - taxPrice (number): Tax price.
    - shippingPrice (number): Shipping price.
    - totalPrice (number): Total price.
    - shippingAddress (object): Shipping address.
      - address (string): Address.
      - city (string): City.
      - postalCode (string): Postal code.
      - country (string): Country.

    Returns:
    - 201 (Created): Order created successfully with order details.
    - 400 (Bad Request): If the request body is missing parameters or if there's an issue with order creation.
    """

    user = request.user 
    data = request.data
    orderItems = data["orderItems"]
    if orderItems and len(orderItems) == 0 :
        return Response({"message" : "No items to make order"} , status=status.HTTP_400_BAD_REQUEST)

    
        
    # create order
    order = Order.objects.create(
        user =user , 
        payment_method = data["paymentMethod"] , 
        tax_price = data["taxPrice"] , 
        shipping_price = data["shippingPrice"] , 
        total_price = data["totalPrice"]
        
    )
    
    #shipping address
    shipping_address = ShippingAddress.objects.create(
        order = order , 
        address = data["shippingAddress"]["address"] , 
        city = data["shippingAddress"]["city"] , 
        postal_code = data["shippingAddress"]["postalCode"] , 
        country = data["shippingAddress"]["country"]         
        
    )
    
    for i in orderItems : 
        product = Product.objects.get(_id=i["product"])
        OrderItems.objects.create(order = order , 
                                  product = product,
                                  name =product.name , 
                                  quantity = i["quantity"] , 
                                  price = i["price"] , 
                                  image = product.image.url
                                  )
        product.countInStock = product.countInStock - int(i["quantity"])
        product.save()
    serializer = OrderSerializer(order)
    return Response(serializer.data , status=status.HTTP_201_CREATED) 


# @api_view(["POST"])
# @permission_classes([IsAuthenticated])
# def addOrserItems(request) : 
#     user = request.user 
#     data = request.data
#     orderItems = data["orderItems"]
#     if orderItems and len(orderItems) == 0 :
#         return Response({"message" : "No items to make order"} , status=status.HTTP_400_BAD_REQUEST)

    
        
#     # create order
#     order = Order.objects.create(
#         user =user , 
#         payment_method = data["paymentMethod"] , 
#         tax_price = data["taxPrice"] , 
#         shipping_price = data["shippingPrice"] , 
#         total_price = data["totalPrice"]
        
#     )
    
#     #shipping address
#     shipping_address = ShippingAddress.objects.create(
#         order = order , 
#         address = data["shippingAddress"]["address"] , 
#         city = data["shippingAddress"]["city"] , 
#         postal_code = data["shippingAddress"]["postalCode"] , 
#         country = data["shippingAddress"]["country"]         
        
#     )
    
#     for i in orderItems : 
#         product = Product.objects.get(_id=i["product"])
#         OrderItems.objects.create(order = order , 
#                                   product = product,
#                                   name =product.name , 
#                                   quantity = i["quantity"] , 
#                                   price = i["price"] , 
#                                   image = product.image.url
#                                   )
#         product.countInStock = product.countInStock - int(i["quantity"])
#         product.save()
#     serializer = OrderSerializer(order)
#     return Response(serializer.data , status=status.HTTP_201_CREATED) 
@swagger_auto_schema(
    method="GET",
    operation_summary="Get Order by ID",
    operation_description="Retrieve an order by its ID (authenticated user access required).",
    manual_parameters=[
        openapi.Parameter(
            name="pk",
            in_=openapi.IN_PATH,
            description="The ID of the order to retrieve.",
            type=openapi.TYPE_INTEGER,
            required=True
        )
    ],
    responses={
        200: openapi.Response(
            description="Order Retrieved Successfully",
            examples={
                "application/json": {
                    "id": 1,
                    "user": 1,
                    "payment_method": "PayPal",
                    "tax_price": 2.0,
                    "shipping_price": 5.0,
                    "total_price": 25.0,
                    "shipping_address": {
                        "address": "123 Main St",
                        "city": "City",
                        "postal_code": "12345",
                        "country": "Country"
                    },
                    "order_items": [
                        {
                            "product": 1,
                            "name": "Product 1",
                            "quantity": 2,
                            "price": 10.0,
                            "image": "http://example.com/media/product_image.jpg"
                        }
                    ],
                    "is_paid": False,
                    "created_at": "2023-09-26T00:00:00Z"
                }
            }
        ),
        400: "Bad Request",
        403: "Forbidden",
        404: "Not Found"
    }
)
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getOrderById(request, pk):
    """
    Retrieve an order by its ID (authenticated user access required).

    --- Path Parameters ---
    - pk (integer): The ID of the order to retrieve.

    Returns:
    - 200 (OK): Order retrieved successfully with order details.
    - 400 (Bad Request): If there's an issue with the request.
    - 403 (Forbidden): If the user is not authorized to view this order.
    - 404 (Not Found): If the order with the provided ID does not exist.
    """
    try:
        user = request.user
        order = Order.objects.get(_id=pk)

        if user.is_staff or order.user == user:
            serializer = OrderSerializer(order, many=False)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"message": "Unauthorized to view this order"}, status=status.HTTP_403_FORBIDDEN)
    except Order.DoesNotExist:
        return Response({"message": "Order Not Found"}, status=status.HTTP_404_NOT_FOUND)


# @api_view(["GET"])
# @permission_classes([IsAuthenticated])
# def getOrderById(request , pk) : 
#     try:
#         user = request.user 
        
#         order = Order.objects.get(_id=pk) 
        
#         if user.is_staff or order.user == user :
#             serializer = OrderSerializer(order ,many=False) 
#             return Response(serializer.data , status=status.HTTP_200_OK)
#         else :
#             return Response({"message":"Un Authorized to view this order"} , status=status.HTTP_400_BAD_REQUEST)
#     except :
#         return Response({"message": "Order Not Found"} , status=status.HTTP_404_NOT_FOUND)

@swagger_auto_schema(
    method="PUT",
    operation_summary="Update Order to Paid",
    operation_description="Update the payment status of an order to 'Paid' (authenticated user access required).",
    manual_parameters=[
        openapi.Parameter(
            name="pk",
            in_=openapi.IN_PATH,
            description="The ID of the order to update.",
            type=openapi.TYPE_INTEGER,
            required=True
        )
    ],
    responses={
        200: openapi.Response(
            description="Order Payment Updated Successfully",
            examples={
                "application/json": {
                    "message": "Paid successfully"
                }
            }
        ),
        400: "Bad Request",
        403: "Forbidden",
        404: "Not Found"
    }
)
@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def updateOrderToPaid(request, pk):
    """
    Update the payment status of an order to 'Paid' (authenticated user access required).

    --- Path Parameters ---
    - pk (integer): The ID of the order to update.

    Returns:
    - 200 (OK): Order payment status updated successfully.
    - 400 (Bad Request): If there's an issue with the request.
    - 403 (Forbidden): If the user is not authorized to update this order.
    - 404 (Not Found): If the order with the provided ID does not exist.
    """
    try:
        order = Order.objects.get(_id=pk)

        if request.user == order.user:
            order.is_paid = not order.is_paid
            order.paid_at = datetime.now()
            order.save()
            return Response({"message": "Paid successfully"})
        else:
            return Response({"message": "Not Authenticated"}, status=status.HTTP_400_BAD_REQUEST)
    except Order.DoesNotExist:
        return Response({"message": "Order Not Found"}, status=status.HTTP_404_NOT_FOUND)

# @api_view(["PUT"])
# @permission_classes([IsAuthenticated])
# def updateOrderToPaid(request , pk):
#     try:
#         order = Order.objects.get(_id = pk) 
#         if request.user == order.user :
#             order.is_paid != order.is_paid
#             order.paid_at = datetime.now()
#             order.save()
#             return Response({"message" : "Paid successfully"})
            
#         else : 
#             return Response({"message" : "Not Authenticated"} , status=status.HTTP_400_BAD_REQUEST)
#     except :
#         return Response({"message" : "Order Not Found"} , status=status.HTTP_404_NOT_FOUND)   



@swagger_auto_schema(
    method="GET",
    operation_summary="Get My Orders",
    operation_description="Retrieve a list of orders for the authenticated user.",
    responses={
        200: openapi.Response(
            description="Orders Retrieved Successfully",
            examples={
                "application/json": [
                    {
                        "id": 1,
                        "user": 1,
                        "payment_method": "PayPal",
                        "tax_price": 2.0,
                        "shipping_price": 5.0,
                        "total_price": 25.0,
                        "shipping_address": {
                            "address": "123 Main St",
                            "city": "City",
                            "postal_code": "12345",
                            "country": "Country"
                        },
                        "order_items": [
                            {
                                "product": 1,
                                "name": "Product 1",
                                "quantity": 2,
                                "price": 10.0,
                                "image": "http://example.com/media/product_image.jpg"
                            }
                        ],
                        "is_paid": False,
                        "created_at": "2023-09-26T00:00:00Z"
                    }
                ]
            }
        ),
        400: "Bad Request"
    }
)
@api_view(["GET"])
@permission_classes([IsAuthenticated]) 
def getMyOrders(request):
    """
    Retrieve a list of orders for the authenticated user.

    Returns:
    - 200 (OK): Orders retrieved successfully with order details.
    - 400 (Bad Request): If there's an issue with retrieving the orders.
    """
    try:
        user = request.user
        orders = user.orders.all()
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)
    except Exception as ex:
        return Response({"message": "Error occurred while getting your data"}, status=status.HTTP_400_BAD_REQUEST)


# @api_view(["GET"])
# @permission_classes([IsAuthenticated]) 
# def getMyOrders(request) : 
#     try : 
#         user = request.user
#         orders = user.orders.all()
#         serializer = OrderSerializer(orders , many=True)
#         return Response(serializer.data)
#     except : 
#         return Response({"message":"error had happen while getting your data"} , status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(
    method="GET",
    operation_summary="Get All Orders",
    operation_description="Retrieve a list of all orders (admin access required).",
    responses={
        200: openapi.Response(
            description="Orders Retrieved Successfully",
            examples={
                "application/json": [
                    {
                        "id": 1,
                        "user": 1,
                        "payment_method": "PayPal",
                        "tax_price": 2.0,
                        "shipping_price": 5.0,
                        "total_price": 25.0,
                        "shipping_address": {
                            "address": "123 Main St",
                            "city": "City",
                            "postal_code": "12345",
                            "country": "Country"
                        },
                        "order_items": [
                            {
                                "product": 1,
                                "name": "Product 1",
                                "quantity": 2,
                                "price": 10.0,
                                "image": "http://example.com/media/product_image.jpg"
                            }
                        ],
                        "is_paid": False,
                        "created_at": "2023-09-26T00:00:00Z"
                    }
                ]
            }
        ),
        400: "Bad Request"
    }
)
@api_view(["GET"]) 
@permission_classes([IsAdminUser])
def getAllOrders(request):
    """
    Retrieve a list of all orders (admin access required).

    Returns:
    - 200 (OK): Orders retrieved successfully with order details.
    - 400 (Bad Request): If there's an issue with retrieving the orders.
    """
    try:
        orders = Order.objects.all()
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)
    except Exception as ex:
        return Response(status=status.HTTP_400_BAD_REQUEST)


# @api_view(["GET"]) 
# @permission_classes([IsAdminUser])
# def getAllOrders(request) : 
#     try: 
#         orders = Order.objects.all()
#         serializer = OrderSerializer(orders , many=True) 
#         return Response(serializer.data)
#     except Exception as ex : 
#         return Response (status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(
    method="PUT",
    operation_summary="Update Order to Delivered",
    operation_description="Update the delivery status of an order to 'Delivered' (admin access required).",
    manual_parameters=[
        openapi.Parameter(
            name="pk",
            in_=openapi.IN_PATH,
            description="The ID of the order to update.",
            type=openapi.TYPE_INTEGER,
            required=True
        )
    ],
    responses={
        200: openapi.Response(
            description="Order Delivery Updated Successfully",
            examples={
                "application/json": {
                    "message": "Delivered successfully"
                }
            }
        ),
        404: "Not Found"
    }
)
@api_view(["PUT"])
@permission_classes([IsAdminUser])
def updateOrderToDelivered(request, pk):
    """
    Update the delivery status of an order to 'Delivered' (admin access required).

    --- Path Parameters ---
    - pk (integer): The ID of the order to update.

    Returns:
    - 200 (OK): Order delivery status updated successfully.
    - 404 (Not Found): If the order with the provided ID does not exist.
    """
    try:
        order = Order.objects.get(_id=pk)
        order.is_delivered = True
        order.delivered_at = datetime.now()
        order.save()
        return Response({"message": "Delivered successfully"})
    except Order.DoesNotExist:
        return Response({"message": "Order Not Found"}, status=status.HTTP_404_NOT_FOUND)


# @api_view(["PUT"])
# @permission_classes([IsAdminUser])
# def updateOrderToDelivered(request , pk):
#     try:
#         order = Order.objects.get(_id = pk) 
#         order.is_delivered = True
#         order.delevered_at = datetime.now()
#         order.save()
#         return Response({"message" : "delivered successfully"})
#     except :
#         return Response({"message" : "Order Not Found"} , status=status.HTTP_404_NOT_FOUND)   

             
    