import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import '../Css/Product.css';
const axios = require('axios');



function Product() {
  const [products, setProducts] = useState([])
  const [productsAddedToCart, setProductsAddedToCart] = useState(0);
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  
  useEffect(() => {
    async function fetchData() {
      const response = await axios.get("https://langston-shopapp.herokuapp.com/shop/get_products");
      setProducts(response.data.map(product => {
          return {
              ...product,
              qty: 0
          }
      }));
      setIsLoading(false);
    }
    fetchData();
  },[]);

  
  function addToCart(productNum, product) {
    const selectedProduct = document.getElementById(`productInput${productNum}`);
    if(parseInt(selectedProduct.value) !== 0) {
      setProductsAddedToCart(productsAddedToCart + 1);
      dispatch({ type: 'product/addProduct', payload: {productNum: productsAddedToCart, product}})
      dispatch({ type: 'cart/addProduct', payload: {productNum: productsAddedToCart, product}})
    } else {
      setShow(true);
    }
  }

  function changeQuantity(productNum, amount, operation) {
    const selectedProduct = document.getElementById(`productInput${productNum}`);
    setProducts(products.map((product, index) => {
        if(productNum === index && operation === "increase") {
          if(selectedProduct.value >= 0) {
            selectedProduct.value++;
            return {
                ...product,
                qty: product.qty + 1
            }
          }
        } else if(productNum === index && operation === "decrease") {
          if(selectedProduct.value > 0) {
            selectedProduct.value--;
            return {
              ...product,
              qty: product.qty - 1
            }
          }
        } else if(productNum && amount) {
          return {
            ...product,
            qty: amount
          }
        }
        return product;
    }));    
  }

  function handleChange(e, productNum) {
    changeQuantity(productNum, e.target.value)
  }

  return (
    <div>
      <Alert show={show} variant={'warning'} className="error-alert">
        <p>You must select a quantity to add to cart.</p>
      </Alert>
      <div id="card-container">
      {isLoading ? 
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
        :
        products.map((product, index) => {
          return ( 
            <Card style={{ width: '18rem' }} key={product.id}>
              <Card.Img variant="top" src={product.product_img_url} />
              <Card.Body>
                <Card.Title> Product: {product.product_name}</Card.Title>
                <Card.Text>
                  Price: {product.product_price}
                </Card.Text>
                <Card.Text>
                  Description: {product.product_description}
                </Card.Text>
                
              </Card.Body>
              <div id="addCart-container">
                  <div id="itemsQty-container">
                    <button className="items-btn" onClick={(e) => changeQuantity(index, null, "decrease")}>-</button>
                        <input id={`productInput${index}`} className="items-qty" type="text" defaultValue={0} onChange={(e) => handleChange(e, index)} />
                    <button className="items-btn" onClick={(e) => changeQuantity(index, null, "increase")}>+</button>
                  </div>
                  <button className="addToCart-button" onClick={() => 
                    {addToCart(index, products[index])}} >
                    Add To Cart
                    </button>
                </div>
            </Card>
          )
        })
      }
      </div>
    </div>
  );
}

export default Product;
