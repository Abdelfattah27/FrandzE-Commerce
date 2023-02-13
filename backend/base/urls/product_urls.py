from django.urls import path 
from ..views.product_views import *
urlpatterns = [
   # path("" ,getRoutes , name="routes") , 
    path("" , getProducts , name="allproducts"),
    path("create/" ,createProduct , name="create-product"),
    path("<str:pk>/createReview/" ,createProductReview , name="create-product-review"),
    path("delete/<str:pk>/" ,deleteProduct , name="delete-product"),
    path("update/<str:pk>/" ,updateProduct , name="update-product"),
    path("upload/" ,uploadImage , name="image-upload"),
    path("<str:pk>" ,getProduct , name="allproduct"),
]