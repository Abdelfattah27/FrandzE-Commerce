from django.contrib import admin

from .models import *


admin.site.register(Product)
admin.site.register(Order)
admin.site.register(ShippingAddress)
admin.site.register(OrderItems)
admin.site.register(Review)