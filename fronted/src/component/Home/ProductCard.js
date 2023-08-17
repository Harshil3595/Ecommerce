import React from 'react';
import ReactStars from 'react-rating-stars-component';
import {Link} from 'react-router-dom';

function ProductCard({product}) {
  const options={
    edit:false,
    color:"rgba()",
    activeColor:"tomato",
    size:window.innerWidth < 600 ? 20 :25,
    value:product.ratings,
    isHalf:true
}
const image = product.images && product.images.length > 0 ? product.images[0] : null;

  return (
    <Link className='productCard' to={`/product/${product._id}`}>
      <img src={image ? image.url : "/Profile.png"} alt="Product Image" />
        <p>{product.name}</p>
        <div>
            <ReactStars {...options} /><span>({product.numOfReviews} reviews)</span>
        </div>
        <span>`₹ {product.price}`</span>
    </Link>
  )
}

export default ProductCard
