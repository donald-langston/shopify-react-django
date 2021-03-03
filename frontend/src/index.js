import "core-js/stable";
import "regenerator-runtime/runtime";
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import App from './Components/App';
import { BrowserRouter as Router } from "react-router-dom";
import productReducer from './Reducers/productReducer';
import cartReducer from './Reducers/cartReducer';


const rootReducer = combineReducers({
  productReducer,
  cartReducer
});

const store = createStore(rootReducer);

const stripePromise = loadStripe(process.env.STRIPE_KEY);

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Elements stripe={stripePromise}>
        <App />
      </Elements>
    </Router>
  </Provider>,
  document.getElementById('root')
);