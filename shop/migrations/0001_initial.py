# Generated by Django 3.1.7 on 2021-03-01 15:47

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('product_name', models.CharField(max_length=200)),
                ('product_description', models.TextField()),
                ('product_price', models.DecimalField(decimal_places=2, max_digits=19)),
                ('product_category', models.CharField(max_length=200)),
                ('product_img_url', models.CharField(max_length=200)),
            ],
        ),
    ]
