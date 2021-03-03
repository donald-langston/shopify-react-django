from django.db import models


class Product(models.Model):
    product_name = models.CharField(max_length=200)
    product_description = models.TextField()
    product_price = models.DecimalField(max_digits=19, decimal_places=2)
    product_category = models.CharField(max_length=200)
    product_img_url = models.CharField(max_length=200)

    def __str__(self):
        return self.product_name
