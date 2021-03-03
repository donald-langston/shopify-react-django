import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import '../Css/SuccessPage.css';


function SuccessPage() {
    const history = useHistory();
    const paymentSucceded = useSelector(state => state.productReducer.paymentSucceded);
    // const firstName = useSelector(state => state.productReducer.user.firstName);
    // const lastName = useSelector(state => state.productReducer.user.lastName);
    const email = useSelector(state => state.productReducer.user.email);
    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0);
    const dispatch = useDispatch();


    useEffect(() => {
        let accumulatedTotal = 0;
        setProducts(
            history.location.state.products.map((item, index) => {
                accumulatedTotal += (item.qty * item.price);
                return (
                    <tr key={index}>
                        <td>{item.product}</td>
                        <td>{item.description}</td>
                        <td>{item.price}</td>
                        <td>{item.qty}</td>
                    </tr>
                )
            })
        );
        setTotal(accumulatedTotal);
        dispatch({type: 'product/clearCart'});
    }, []);

        

    return (
        <div id="summary-container">
            {paymentSucceded ?
                <div>
                    <h1>Sucessfully placed order</h1>
                    <h3>You will receive a confirmation email shortly to {email}</h3>
                </div>
                : ""
            }
            <div>
                <h5>Order Summary</h5>
            </div>
            <Table size="sm" borderless>
                <thead>
                    <tr>
                        <th>Purchased Product</th>
                        <th>Product Description</th>
                        <th>Price</th>
                        <th>Quantity</th>
                    </tr>
                </thead>
                <tbody>
                    {products}
                    <tr>
                        <td>
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Total</th>
                                        <th>{`$${total.toFixed(2)}`}</th>
                                    </tr>
                                </thead>
                            </Table>
                        </td>
                    </tr>
                </tbody>
            </Table>
        </div>
    )
}

export default SuccessPage;