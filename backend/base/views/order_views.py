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

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def addOrserItems(request) : 
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
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getOrderById(request , pk) : 
    try:
        user = request.user 
        
        order = Order.objects.get(_id=pk) 
        
        if user.is_staff or order.user == user :
            serializer = OrderSerializer(order ,many=False) 
            return Response(serializer.data , status=status.HTTP_200_OK)
        else :
            return Response({"message":"Un Authorized to view this order"} , status=status.HTTP_400_BAD_REQUEST)
    except :
        return Response({"message": "Order Not Found"} , status=status.HTTP_404_NOT_FOUND)
@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def updateOrderToPaid(request , pk):
    try:
        order = Order.objects.get(_id = pk) 
        if request.user == order.user :
            order.is_paid != order.is_paid
            order.paid_at = datetime.now()
            order.save()
            return Response({"message" : "Paid successfully"})
            
        else : 
            return Response({"message" : "Not Authenticated"} , status=status.HTTP_400_BAD_REQUEST)
    except :
        return Response({"message" : "Order Not Found"} , status=status.HTTP_404_NOT_FOUND)   

@api_view(["GET"])
@permission_classes([IsAuthenticated]) 
def getMyOrders(request) : 
    try : 
        user = request.user
        orders = user.orders.all()
        serializer = OrderSerializer(orders , many=True)
        return Response(serializer.data)
    except : 
        return Response({"message":"error had happen while getting your data"} , status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"]) 
@permission_classes([IsAdminUser])
def getAllOrders(request) : 
    try: 
        orders = Order.objects.all()
        serializer = OrderSerializer(orders , many=True) 
        return Response(serializer.data)
    except Exception as ex : 
        print(str(ex)) 
        return Response (status=status.HTTP_400_BAD_REQUEST)

@api_view(["PUT"])
@permission_classes([IsAdminUser])
def updateOrderToDelivered(request , pk):
    try:
        order = Order.objects.get(_id = pk) 
        order.is_delivered = True
        order.delevered_at = datetime.now()
        order.save()
        return Response({"message" : "delivered successfully"})
    except :
        return Response({"message" : "Order Not Found"} , status=status.HTTP_404_NOT_FOUND)   

             
    