import { createStore, combineReducers, applyMiddleware } from "redux";

import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import {
  productListReducers,
  productDetailsReducer,
  productDeleteReducer,
  productCreateReducer,
  productUpdateReducer,
  productReviewCreateReducer,
} from "./reducers/productReducers";
import { cartReducer } from "./reducers/cartReducers";
import {
  UserLoginReducer,
  UserRegisterReducer,
  UserDetailReducer,
  UpdateUserReducer,
  userListReducer,
  userDeleteReducer,
  adminUpdateUserReducer,
} from "./reducers/userReducer";
import {
  PlaceOrderReducer,
  orderDetailsReducer,
  orderPayReducer,
  orderListMyReducer,
  allOrdersReducer,
  orderDeliverReducer,
} from "./reducers/orderReducers";
const reducer = combineReducers({
  productList: productListReducers,
  productDetails: productDetailsReducer,
  cart: cartReducer,
  userLogin: UserLoginReducer,
  userRegister: UserRegisterReducer,
  userDetail: UserDetailReducer,
  userUpdate: UpdateUserReducer,
  makePlaceOrder: PlaceOrderReducer,
  orderDetails: orderDetailsReducer,
  orderPay: orderPayReducer,
  orderList: orderListMyReducer,
  userList: userListReducer,
  userDelete: userDeleteReducer,
  adminUpdateUser: adminUpdateUserReducer,
  productDelete: productDeleteReducer,
  productCreate: productCreateReducer,
  productUpdate: productUpdateReducer,
  allOrders: allOrdersReducer,
  orderDeliver: orderDeliverReducer,
  reviewCreate: productReviewCreateReducer,
});
let cartItemsFromStorage;
try {
  cartItemsFromStorage = localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [];
} catch (e) {
  cartItemsFromStorage = [];
}
let userInfoFromLocalStorage;
try {
  userInfoFromLocalStorage = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null;
} catch (e) {
  userInfoFromLocalStorage = null;
}
let shippingAddressFromLocalStorage;
try {
  shippingAddressFromLocalStorage = localStorage.getItem("shippingAddress")
    ? JSON.parse(localStorage.getItem("shippingAddress"))
    : {};
} catch (e) {
  shippingAddressFromLocalStorage = {};
}

let paymentMethodFromLocalStorage;
try {
  paymentMethodFromLocalStorage = localStorage.getItem("paymentmethod")
    ? localStorage.getItem("paymentmethod")
    : {};
} catch (e) {
  paymentMethodFromLocalStorage = {};
}

const initialState = {
  cart: {
    cartItems: cartItemsFromStorage,
    shippingAddress: shippingAddressFromLocalStorage,
    paymentMethod: paymentMethodFromLocalStorage,
  },
  userLogin: { userInfo: userInfoFromLocalStorage },
  userRegister: { userInfo: userInfoFromLocalStorage },
  makePlaceOrder: {},
};
const middleware = [thunk];
const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);
export default store;
