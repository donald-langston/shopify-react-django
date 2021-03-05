import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import Alert from 'react-bootstrap/Alert';
import CheckoutForm from './CheckoutForm';
import '../Css/Checkout.css';


function Checkout() {
  let productsInCart = useSelector(state => state.productReducer.products);
  const cardError = useSelector(state => state.productReducer.cardError);
  const dispatch = useDispatch();
  let totalPrice = 0;
  
  function increaseQuantity(productNum) {
    if(productsInCart[productNum].qty >= 0) {
        dispatch({type: 'product/changeQuantity', payload:{productNum, operation: "increase"}});
    }
  }

  function decreaseQuantity(productNum) {
    if(productsInCart[productNum].qty > 0) {
        dispatch({type: 'product/changeQuantity', payload:{productNum, operation: "decrease"}});
    }
  }

  function getTotalAmount(totalAmount) {
      const cents = totalAmount % 100;
      const dollars = (totalAmount - cents) / 100;
      return `${dollars}.${cents}`;
  }

  function deleteItem(productNum) {
    dispatch({type: 'product/removeProduct', payload: {productNum}});
  }

  
  return (
    <div id="checkout-main-container">
    {cardError ? <Alert variant="warning" onClose={() => {dispatch({type: "product/clearCardError"})}} dismissible>{cardError}</Alert> : ""}
      <div className="checkout-container">
        <div className="summary-container">
          <h4 className="d-flex justify-content-between align-items-center mb-3">
                <span className="text-muted">Your cart</span>
                <span className="badge bg-secondary rounded-pill">{productsInCart.length}</span>
          </h4>
          <ul className="list-group mb-3">
            {productsInCart.map((item, index) => {
                totalPrice += (item.price * 100 * item.qty)
                return ( 
                            <li key={index} className="list-group-item d-flex justify-content-between lh-sm">
                            <div className="product-container">
                                <div className="product">
                                    <div className="delete-button-container">
                                      <button className="delete-btn" onClick={() => deleteItem(item.productNum)}><FontAwesomeIcon icon={faMinusCircle} /></button>
                                    </div>
                                    <div className="product-description">
                                      <h6 className="my-0">{item.product}</h6>
                                      <p className="text-muted">{item.description}</p>
                                    </div>
                                </div>
                                <div className="checkout-product-quantity">
                                    <span className="text-muted span-price">{item.price}</span>
                                    <span className="text-muted">
                                      <button onClick={() => decreaseQuantity(index)}>-</button>
                                        <span className="span-quantity">{item.qty}</span>
                                      <button onClick={() => increaseQuantity(index)}>+</button>
                                    </span>
                                    <span className="text-muted span-amount">{(item.price * item.qty).toFixed(2)}</span>
                                </div>
                            </div>
                            </li>
                    
                )
            })}
                    
          </ul>
        
            <div className="total-container">
              <li className="list-group-item d-flex justify-content-between lh-sm">
                <div>
                  <h6 className="my-0">Total Price</h6>
                </div>
                <span className="text-muted">
                  {getTotalAmount(totalPrice)}
                </span>
              </li>
            </div>
        </div>
        <div className="form-container">
          <h4 className="d-flex justify-content-between align-items-center mb-3">
                <span className="text-muted">Enter payment details</span>
          </h4>
          <CheckoutForm />
        </div>
      </div>
    </div>
  );
}

export default Checkout;