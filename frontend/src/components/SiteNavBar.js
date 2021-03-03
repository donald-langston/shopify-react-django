import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom';
import '../Css/SiteNavBar.css';


function SiteNavBar() {
    const productsInCart = useSelector(state => state.productReducer.products);
    const [show, setShow] = useState(false);
    const dispatch = useDispatch();
    let history = useHistory();

    function gotoCheckout() {
        history.push("/checkout");
        setShow(false);
    }

    function clearCart() {
        dispatch({type: 'product/clearCart'});
        setShow(false);
    }

    const popover = (
        <Popover id="popover-basic">
            {productsInCart.map((cart, index) => {
                return (
                    <div key={index}>
                        <Popover.Title as="h3">{cart.product}</Popover.Title>
                        <Popover.Content>
                            Price: ${cart.price}
                        </Popover.Content>
                    </div>
                )
            })}
            {productsInCart.length ? 
                <div id="cart-buttons-container">
                    <button onClick={gotoCheckout}>Checkout</button>
                    <button onClick={clearCart}>Empty Cart</button>
                </div>
                : <span>Your cart is empty</span>
            }
        </Popover>
    );


    return (
        <Navbar bg="dark" variant="dark" expand="sm">
            <Link to='/'><Navbar.Brand>Donald's Shoppify</Navbar.Brand></Link>
            <Nav>
                <Nav.Item>
                    <Link to='/'>Home</Link>
                </Nav.Item>
            </Nav>
            <OverlayTrigger show={show} placement="bottom" overlay={popover} inline>
                <button onClick={() => setShow(!show)} id="cart-button">
                    <FontAwesomeIcon icon={faShoppingCart} />
                    <span> {productsInCart.length}</span>
                </button>
            </OverlayTrigger>
        </Navbar>
    )
}

export default SiteNavBar;