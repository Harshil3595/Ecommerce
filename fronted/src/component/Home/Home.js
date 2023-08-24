import React, { useEffect } from "react";
import { CgMouse } from "react-icons/cg";
import "./Home.css";
import ProductCard from "./ProductCard";
import MetaData from "../layout/MetaData";
import { getProduct } from "../../actions/productAction";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../layout/Loader/Loader";
import { useAlert } from "react-alert";


function Home() {
  const dispatch=useDispatch();
  const alert=useAlert();
  const { loading, error, products } = useSelector(state => state.products);
  useEffect(()=>{
    if(error){
      return alert.error(error);
    }
    dispatch(getProduct())
  },[dispatch,error,alert])


  return (
    <>
    {loading ? <Loader/> : (
      <>
      <MetaData title="Ecommerce" />
      <div className="banner">
        <p className="banner-text">Welcome to Ecommerce </p>
        <h1 className="banner-text">Find Amazing Product Below</h1>
        <a href="#container">
          <button>
            Scroll
            <CgMouse />
          </button>
        </a>
      </div>
      <h2 className="homeHeading">Featured Product</h2>
      <div className="container" id="container" >
        {products&&products.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </>
    )}
    </>
  );
}

export default Home;
