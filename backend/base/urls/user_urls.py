from django.urls import path 
from ..views.user_views import *
urlpatterns = [
   # path("" ,views.getRoutes , name="routes") , 

    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path("register/" , registerUser , name = "register-user") , 
    path("profile/update/" , updateUserProfile , name = "update-user") , 
    path("profile/" , getUserProfile , name="user-profile"),
    path("" , getUsers , name="all-users"),
    path("deleteuser/<str:pk>" , deleteUser , name="delete-users"),
    path("updateuser/<str:pk>/" , updateUser , name="update-users"),
    path("<str:pk>/" , getUserById , name="get-users"),
    
]
