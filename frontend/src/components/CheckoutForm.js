import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import PaymentCard from './PaymentCard';
import {useStripe, useElements, CardElement} from '@stripe/react-stripe-js';
import Cookies from 'js-cookie';
import * as yup from 'yup';
import { Formik } from 'formik';
const axios = require("axios");
const qs = require('qs');


const csrftoken = Cookies.get('csrftoken');

const schema = yup.object({
    firstName: yup.string().required("Required"),
    lastName: yup.string().required("Required"),
    email: yup.string().email("Invalid email address").required("Required")
});

function CheckoutForm() {
    
    let history = useHistory();
    const stripe = useStripe();
    const elements = useElements();
    
    const dispatch = useDispatch();
    let productsInCart = useSelector(state => state.productReducer.products);
    

    return (
        <Formik
            validationSchema={schema}
            initialValues={{
                firstName: "",
                lastName: "",
                email: ""
            }}
            onSubmit={async (values, { setSubmitting }) => {
                if (!stripe || !elements) {
                    // Stripe.js has not yet loaded.
                    // Make sure to disable form submission until Stripe.js has loaded.
                    return;
                  }
                      
                  axios.defaults.headers['X-CSRFToken'] = csrftoken;
                  const response = await axios.post("http://localhost:8000/shop/secret/", 
                  qs.stringify({products: productsInCart, email: values.email, csrfmiddlewaretoken: csrftoken, length: productsInCart.length}),
                  {withCredentials: true});
          
                  const client_secret = response.data.client_secret;
                      
                  const result = await stripe.confirmCardPayment(client_secret, {
                      payment_method: {
                          card: elements.getElement(CardElement),
                          billing_details: {
                          name: `${values.firstName} ${values.lastName}`,
                          email: values.email
                          },
                      },
                      receipt_email: values.email
                  });
              
                  if (result.error) {
                  // Show error to your customer (e.g., insufficient funds)
                  console.log(result.error.message);
                  dispatch({type: "product/cardError", payload: {cardError: result.error.message}});
                  setSubmitting(false);
                  } else {
                      // The payment has been processed!
                      if (result.paymentIntent.status === 'succeeded') {
                          dispatch({type: "product/paymentSucceded", 
                              payload: { 
                              paymentSucceded: true,
                              firstName: values.firstName,
                              lastName: values.lastName,
                              email: values.email 
                              }
                          });
                          setSubmitting(false);
                          history.push("/success", {products: productsInCart});
                          // Show a success message to your customer
                          // There's a risk of the customer closing the window before callback
                          // execution. Set up a webhook or plugin to listen for the
                          // payment_intent.succeeded event that handles any business critical
                          // post-payment actions.
                      }
                  }
            }}
        >
            {({
                handleSubmit,
                handleChange,
                handleBlur,
                values,
                touched,
                errors,
                isSubmitting,
            }) => (
                <Form noValidate onSubmit={handleSubmit}>
                    <Form.Control type="text" name="firstName" placeholder="First name" value={values.firstName} onChange={handleChange} onBlur={handleBlur} isInvalid={touched.firstName && errors.firstName} />
                    <Form.Control.Feedback type="invalid">{errors.firstName}</Form.Control.Feedback>
                    <Form.Control type="text" name="lastName" placeholder="Last name" value={values.lastName} onChange={handleChange} onBlur={handleBlur} isInvalid={touched.lastName && errors.lastName} />
                    <Form.Control.Feedback type="invalid">{errors.lastName}</Form.Control.Feedback>
                    <Form.Control type="email" name="email" placeholder="email" value={values.email} onChange={handleChange} onBlur={handleBlur} isInvalid={touched.email && errors.email} />
                    <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                    <PaymentCard />
                    <input type="hidden" name="csrfmiddlewaretoken" value={csrftoken} />
                    <Button disabled={!stripe && isSubmitting} type={"submit"}>
                    {isSubmitting ?
                    <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                        />
                        : ""}
                        {isSubmitting ? "Processing..." : "Confirm order"}
                    </Button>
                </Form>
            )}
        </Formik>
    )
}

export default CheckoutForm;