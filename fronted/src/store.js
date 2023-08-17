import { configureStore ,combineReducers } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import {newProductReducer, newReviewReducer, productReducer,productReviewsReducer,productsReducer, reviewReducer} from './reducers/productReducer'
import { productDetailsReducer } from "./reducers/productReducer";
import { allUsersReducer, profileReducer, userDetailsReducer, userReducer } from "./reducers/userReducer";
import { cartReducer } from "./reducers/cartReducer";
import { allOrdersReducer, myOrdersReducer, newOrderReducer, orderDetailsReducer, orderReducer } from "./reducers/orderReducer";

let initialState = {
  cart: {
    cartItems: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],
    shippingInfo: localStorage.getItem("shippingInfo")
      ? JSON.parse(localStorage.getItem("shippingInfo"))
      : {},
  },
};


const reducer = combineReducers({
    products : productsReducer,
    productDetails : productDetailsReducer,
    user:userReducer,
    profile:profileReducer,
    cart:cartReducer,
    newOrder:newOrderReducer,
    myOrders:myOrdersReducer,
    orderDetails:orderDetailsReducer,
    newReview:newReviewReducer,
    product:productReducer,
    allOrders:allOrdersReducer,
    order:orderReducer,
    allUsers:allUsersReducer,
    newProduct:newProductReducer, 
    userDetails: userDetailsReducer,
    productReviews:productReviewsReducer,
    review: reviewReducer,
});

const store = configureStore({
  reducer,
  preloadedState: initialState,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
  devTools: true,
});

export default store;
