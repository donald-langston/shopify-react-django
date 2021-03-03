const initialState = {
    products: [],
    paymentSucceded: false,
    user: {
        firstName: "",
        lastName: "",
        email: ""
    },
    cardError: ""
}

const productReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'product/addProduct':
            return {
                ...state,
                products: state.products.concat(
                    {
                        productNum: action.payload.productNum,
                        product: action.payload.product.product_name,
                        description: action.payload.product.product_description,
                        price: action.payload.product.product_price,
                        qty: action.payload.product.qty
                    }
                )
            }
        case 'product/removeProduct':
            console.log(action.payload.productNum);
            return {
                ...state,
                products: state.products.filter(product => {
                    return product.productNum !== action.payload.productNum;
                })
            }
        case 'product/paymentSucceded':
            return {
                ...state,
                user: {
                    firstName: action.payload.firstName,
                    lastName: action.payload.lastName,
                    email: action.payload.email
                },
                paymentSucceded: action.payload.paymentSucceded
            }
        case 'product/changeQuantity':
            return {
                ...state,
                products: state.products.map(product => {
                    if(product.productNum === action.payload.productNum) {
                        if(action.payload.operation === "increase") {
                            return {
                                ...product,
                                qty: product.qty + 1
                            }
                        } else if(action.payload.operation === "decrease") {
                            return {
                                ...product,
                                qty: product.qty - 1
                            }
                        }
                    }
                    return product;
                })
            }
        case 'product/clearCart':
            return {
                ...state,
                products: []
            }
        case 'product/cardError':
            return {
                ...state,
                cardError: action.payload.cardError
            }
        case 'product/clearCardError':
            return {
                ...state,
                cardError: ""
            }  
        default:
            return state;
    }
}

export default productReducer;