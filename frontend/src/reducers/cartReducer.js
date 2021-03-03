const initialState = {
    products: []
}

const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'cart/addProduct':
            return {
                ...state,
                products: state.products.concat(
                    {
                        productNum: action.payload.productNum,
                        product: action.payload.product.product_name,
                        description: action.payload.product.product_description,
                        price: parseFloat(action.payload.product.product_price),
                        qty: action.payload.product.qty
                    }
                )
            }
        case 'cart/clearCart':
            return {
                ...state,
                products: []
            }
        default:
            return state;
    }
}

export default cartReducer;