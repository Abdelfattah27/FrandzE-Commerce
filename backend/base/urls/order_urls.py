from django.urls import path 
from ..views import order_views
urlpatterns = [
    path("add/" , order_views.addOrserItems , name="orders-add"),
    path("myorder/", order_views.getMyOrders , name="order-my-orders") , 
    path("", order_views.getAllOrders , name="all-orders") , 
    path("<str:pk>/" , order_views.getOrderById , name="order-by-id") , 
    path("<str:pk>/pay/" , order_views.updateOrderToPaid , name="pay") ,
    path("<str:pk>/deliver/" , order_views.updateOrderToDelivered , name="deliver")
    
]