import React, { useState } from 'react';
import { product_list } from '../assets/asset.js';
import Footer from '../components/Footer.jsx';
import Header from '../components/Header.jsx';
import { Link } from 'react-router-dom'; // For navigation to the cart page
import Cart from './Cart'; // Import Cart component

const Skincare = () => {
  const [cart, setCart] = useState([]); // State to store cart items

  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]); // Add product to cart state
    alert(`${product.product_name} added to cart!`); // Alert on item added
  };

  const removeFromCart = (index) => {
    setCart((prevCart) => prevCart.filter((_, i) => i !== index)); // Remove product from cart
  };

  const cleanser = product_list.slice(0, 5);
  const moisturizer = product_list.slice(5, 10);
  const serums = product_list.slice(10, 15);
  const sunscreen = product_list.slice(20, 25);

  return (
    <div className="home">
      <Header />

      {/* Cart Link to redirect to Cart page */}
      <div className="cart-info">
        <Link to="/cart">
          <h5>Cart: {cart.length} items</h5>
        </Link>
      </div>

      <h4 className="main-heading">Cleansers</h4>
      <div className="image-gallery row">
        {cleanser.map((product, index) => (
          <div key={index} className="col-md-4 mb-4">
            <figure className="figure">
              <img
                src={product.product_image}
                alt={product.product_name}
                className="figure-img img-fluid rounded animate-img"
              />
              <figcaption className="figure-caption text-center">
                <p>{product.product_name}</p>
                <p><strong>Price: ₹{product.product_price}</strong></p>
                <button 
                  className="btn btn-primary" 
                  onClick={() => addToCart(product)}>
                  Add to Cart
                </button>
              </figcaption>
            </figure>
          </div>
        ))}
      </div>

      {/* Repeat the same for other categories like Moisturizer, Serums, and Sunscreen */}
      <h4 className="main-heading">Moisturizers</h4>
      <div className="image-gallery row">
        {moisturizer.map((product, index) => (
          <div key={index} className="col-md-4 mb-4">
            <figure className="figure">
              <img
                src={product.product_image}
                alt={product.product_name}
                className="figure-img img-fluid rounded animate-img"
              />
              <figcaption className="figure-caption text-center">
                <p>{product.product_name}</p>
                <p><strong>Price: ₹{product.product_price}</strong></p>
                <button 
                  className="btn btn-primary" 
                  onClick={() => addToCart(product)}>
                  Add to Cart
                </button>
              </figcaption>
            </figure>
          </div>
        ))}
      </div>

      {/* Repeat for other product categories */}
      <Footer />
    </div>
  );
};

export default Skincare;
