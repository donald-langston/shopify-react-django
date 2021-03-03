import stripe
import json
import requests
import os
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse, HttpResponseRedirect
from django.views.decorators.csrf import get_token, ensure_csrf_cookie, csrf_exempt
from django.template import RequestContext
from django.core.mail import send_mail

from .models import Product

import environ
env = environ.Env()

# reading .env file
environ.Env.read_env()

stripe.api_key = env('STRIPE_API_KEY')

@ensure_csrf_cookie
def get_products(request):
    all_products = Product.objects.all()
    if not all_products:
        response = requests.get("https://fakestoreapi.com/products")
        products = response.json()

        for product in products:
            p = Product(product_name=product['title'],
                        product_description=product['description'],
                        product_price=product['price'],
                        product_category=product['category'],
                        product_img_url=product['image'])
            p.save()

        all_products = Product.objects.all()

    return JsonResponse(list(all_products.values()), safe=False)



def secret(request):
    if request.method == 'POST':

        # # Set your secret key. Remember to switch to your live secret key in production!
        # # See your keys here: https://dashboard.stripe.com/account/apikeys
        total_price = 0

        for i in range(0, int(request.POST.get('length'))):
            found_product = Product.objects.get(product_name=request.POST[f"products[{i}][product]"])
            total_price = total_price + (found_product.product_price * int(request.POST[f"products[{i}][qty]"]))
        intent = stripe.PaymentIntent.create(
            amount=int(total_price * 100),
            currency='usd',
            # Verify your integration in this guide by including this parameter
            metadata={'integration_check': 'accept_a_payment'},
        )
        return JsonResponse({"client_secret": intent.client_secret})


@csrf_exempt
def my_webhook_view(request):
    payload = request.body
    sig_header = request.META['HTTP_STRIPE_SIGNATURE']
    event = None

    try:
        event = stripe.Event.construct_event(
            payload, sig_header, endpoint_secret
        )
    except ValueError as e:
        # Invalid payload
        return HttpResponse(status=400)
    except stripe.error.SignatureVerificationError as e:
        # Invalid signature
        return HttpResponse(status=400)

    # Handle the event
    print(event)
    if event.type == 'payment_intent.succeeded':
        payment_intent = event.data.object  # contains a stripe.PaymentIntent
        parsed_body = json.loads(payload)
        name_split = parsed_body["data"]["object"]["charges"]["data"][0]["billing_details"]["name"].split()
        first_name = name_split[0]
        last_name = name_split[1]
        email = parsed_body["data"]["object"]["charges"]["data"][0]["billing_details"]["email"]
        send_mail(
            'Order processed',
            f'Dear {first_name}, Your has order been received. You should receive an email with tracking information'
            f' when your order ships.\n\n Thank you for shopping with us!',
            'donald_langston@yahoo.com',
            [email],
            fail_silently=False,
        )
    elif event.type == 'payment_method.attached':
        payment_method = event.data.object  # contains a stripe.PaymentMethod
        print('PaymentMethod was attached to a Customer!')
    # ... handle other event types
    else:
        print('Unhandled event type {}'.format(event.type))

    return HttpResponse(status=200)
