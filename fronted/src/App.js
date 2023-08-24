import React, { useState } from "react";
import Header from "./component/layout/Header/Header";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import webfont from "webfontloader";
import Footer from "./component/layout/Footer/Footer";
import Home from "./component/Home/Home";
import ProductDetails from "./component/Product/ProductDetails";
import Products from "./component/Product/Products";
import Search from "./component/Product/Search";
import LoginSignUp from "./component/User/LoginSignUp";
import store from "./store";
import { loadUser } from "./actions/userAction";
import { useSelector } from "react-redux";
import UserOptions from "./component/layout/Header/UserOptions";
import Profile from "./component/User/Profile";
import UpdateProfile from "./component/User/UpdateProfile";
import UpdatePassword from "./component/User/UpdatePassword";
import Cart from "./component/Cart/Cart";
import Shipping from "./component/Cart/Shipping";
import ConfirmOrder from "./component/Cart/ConfirmOrder";
import Payment from "./component/Cart/Payment";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import OrderSuccess from "./component/Cart/OrderSuccess";
import MyOrders from "./component/Order/MyOrders";
import OrderDetails from "./component/Order/OrderDetails";
import DashBoard from "./component/Admin/DashBoard";
import ProductList from "./component/Admin/ProductList";
import NewProduct from "./component/Admin/NewProduct";
import UpdateProduct from "./component/Admin/UpdateProduct";
import OrderList from "./component/Admin/OrderList";
import UsersList from "./component/Admin/UserList";
import UpdateUser from "./component/Admin/UpdateUser";
import ProductReviews from "./component/Admin/ProductReviews";
import ProcessOrder from "./component/Admin/ProcessOrder";
import { instance as axios } from "./constants/userConstans";


function App() {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const [stripeApiKey, setStripeApiKey] = useState("");

  const token = localStorage.getItem("token");

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        }
      };

  async function getStripeApiKey() {
    const { data } = await axios.get("/api/v1/stripeapikey",config);
    console.log("stripe api key is ",data.stripeApiKey);
    setStripeApiKey(data.stripeApiKey);
  }

  React.useEffect(() => {
    webfont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });
    store.dispatch(loadUser());

    getStripeApiKey();
  }, []);

  return (
    <div>
      <Router>
        <Header />
        {isAuthenticated && <UserOptions user={user} />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:keyword" element={<Products />} />
          <Route path="/search" element={<Search />} />
          <Route path="/login" element={<LoginSignUp />} />
          <Route path="/account" element={isAuthenticated ? ( <Profile />) : (<Navigate replace to={"/login"} />)} />
          <Route path="/me/update" element={isAuthenticated ? ( <UpdateProfile />) : (<Navigate replace to={"/login"} />)} />
          <Route path="/password/update" element={isAuthenticated ? ( <UpdatePassword />) : (<Navigate replace to={"/login"} />)} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login/shipping" element={isAuthenticated ? ( <Shipping />) : (<Navigate replace to={"/login"} />)} />
          <Route path="/order/confirm" element={isAuthenticated ? ( <ConfirmOrder />) : (<Navigate replace to={"/login"} />)} />
          {stripeApiKey && <Route path="/process/payment" element={
            <Elements stripe={loadStripe(stripeApiKey)}>
              <Payment />
            </Elements>
          }
          />}
          <Route path="/success"element={isAuthenticated ? ( <OrderSuccess />) : (<Navigate replace to={"/login"} />)}   />
          <Route path="/orders" element={isAuthenticated ? ( <MyOrders />) : (<Navigate replace to={"/login"} />)} />
          <Route path="/order/:id" element={<OrderDetails />} />
          <Route  path="/admin/dashboard" element={isAuthenticated && user.role === "admin" ? ( <DashBoard />) : (<Navigate replace to={"/login"} />)}  />
          <Route  path="/admin/products" element={isAuthenticated && user.role === "admin" ? ( <ProductList />) : (<Navigate replace to={"/login"} />)} />
          <Route  path="/admin/product" element={isAuthenticated && user.role === "admin" ? ( <NewProduct />) : (<Navigate replace to={"/login"} />)}  />
          <Route  path="/admin/product/:id"element={isAuthenticated && user.role === "admin"? ( <UpdateProduct />) : (<Navigate replace to={"/login"} />)}   />
          <Route  path="/admin/orders" element={isAuthenticated && user.role === "admin" ? ( <OrderList />) : (<Navigate replace to={"/login"} />)}   />
          <Route  path="/admin/order/:id"element={isAuthenticated && user.role === "admin"? ( <ProcessOrder />) : (<Navigate replace to={"/login"} />)} />
          <Route  path="/admin/users"element={isAuthenticated && user.role === "admin"? ( <UsersList />) : (<Navigate replace to={"/login"} />)}  />
          <Route  path="/admin/user/:id"element={isAuthenticated && user.role === "admin" ? ( <UpdateUser />) : (<Navigate replace to={"/login"} />)}   />
          <Route  path="/admin/reviews" element={isAuthenticated && user.role === "admin"? ( <ProductReviews />) : (<Navigate replace to={"/login"} />)} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
