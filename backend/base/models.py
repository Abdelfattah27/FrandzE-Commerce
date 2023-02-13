from django.db import models
from django.contrib.auth.models import User


class Product(models.Model) : 
    _id = models.AutoField(primary_key=True , editable=False)
    user = models.ForeignKey(User , on_delete=models.SET_NULL , null=True )
    name = models.CharField(max_length=200 , null= True , blank= True) 
    image = models.ImageField(null=True , blank=True , default="/placeholder.png")
    brand =  models.CharField(max_length=200 , null= True , blank= True) 
    category =  models.CharField(max_length=200 , null= True , blank= True) 
    description =  models.TextField(null= True , blank= True) 
    rating = models.DecimalField(max_digits=7 , decimal_places=2 , null= True , blank= True)
    numReviews = models.IntegerField(null=True , blank=True , default=0)
    price = models.DecimalField(max_digits=7 , decimal_places=2 , null= True , blank= True)
    countInStock =  models.IntegerField(null=True , blank=True , default=0)
    createdAt = models.DateTimeField(auto_now_add=True)
    
    def __str__(self): 
        return self.name
class Review(models.Model) : 
    product =  models.ForeignKey(Product , related_name="reviews" , on_delete=models.SET_NULL , null=True )
    user = models.ForeignKey(User , on_delete=models.SET_NULL , null=True )
    name =  models.CharField(max_length=200 , null= True , blank= True) 
    rating = models.IntegerField(null= True , blank= True , default= 0)
    comment = models.TextField(null= True , blank= True) 
    _id = models.AutoField(primary_key=True , editable=False)
    created_at = models.DateTimeField(auto_now_add=True , null=True)
    def __str__(self): 
        return str(self.rating)

class Order(models.Model) : 
    user = models.ForeignKey(User , on_delete=models.SET_NULL , related_name="orders", null=True )
    payment_method = models.CharField(max_length=200 , null= True , blank= True) 
    tax_price = models.DecimalField(max_digits=7 , decimal_places=2 , null= True , blank= True)
    shipping_price = models.DecimalField(max_digits=7 , decimal_places=2 , null= True , blank= True)
    total_price = models.DecimalField(max_digits=7 , decimal_places=2 , null= True , blank= True)
    is_paid = models.BooleanField(default=False)
    paid_at = models.DateTimeField(auto_now_add=False , null= True , blank= True)
    is_delivered = models.BooleanField(default=False)
    delevered_at = models.DateTimeField(auto_now_add=False , null= True , blank= True)
    created_at = models.DateTimeField(auto_now_add=True)
    _id = models.AutoField(primary_key=True , editable=False)
    
    def __str__(self): 
        return str(self.created_at)

class OrderItems(models.Model) : 
    product =  models.ForeignKey(Product , on_delete=models.SET_NULL , null=True )
    order =  models.ForeignKey(Order , on_delete=models.SET_NULL , null=True )
    name = models.CharField(max_length=200 , null= True , blank= True) 
    quantity =models.IntegerField(null= True , blank= True , default= 0)
    price = models.DecimalField(max_digits=7 , decimal_places=2 , null= True , blank= True)
    image = models.CharField(max_length=200 , null= True , blank= True) 
    _id = models.AutoField(primary_key=True , editable=False)
    def __str__(self): 
        return self.name

class ShippingAddress(models.Model) : 
    order = models.OneToOneField(Order , on_delete=models.CASCADE , related_name="shippingAddress",null= True , blank= True) 
    address = models.CharField(max_length=200 , null= True , blank= True) 
    city = models.CharField(max_length=200 , null= True , blank= True) 
    postal_code = models.CharField(max_length=200 , null= True , blank= True) 
    country = models.CharField(max_length=200 , null= True , blank= True) 
    _id = models.AutoField(primary_key=True , editable=False)
    
    def __str__(self) : 
        return self.address
    
    
    