import React, { useContext } from 'react';
import { product_list } from '../assets/asset.js';
import Footer from '../components/Footer.jsx';
import Header from '../components/Header.jsx';
import { Link } from 'react-router-dom'; // For navigation to the cart page
import { CartContext } from '../contexts/CartContext';

const Skincare = () => {
  const { cart, addToCart, wishlist, toggleWishlist } = useContext(CartContext);

  const handleAdd = (product) => {
    addToCart(product, 1);
  };

  const getKey = (p) => p?._id || p?.id || p?.product_name;

  const isInWishlist = (product) => {
    const key = getKey(product);
    if (!key) return false;
    return wishlist?.some((p) => getKey(p) === key);
  };

  const cleanser = product_list.slice(0, 5);
  const moisturizer = product_list.slice(5, 10);
  const serums = product_list.slice(10, 15);
  const sunscreen = product_list.slice(20, 25);

  return (
    <div className="home">
      <Header />

      {/* Cart info removed to keep top clean; cart count is in header icon */}

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
                  onClick={() => handleAdd(product)}>
                  Add to Cart
                </button>
                <button
                  type="button"
                  className={`wishlist-inline-btn ${isInWishlist(product) ? 'active' : ''}`}
                  onClick={() => toggleWishlist(product)}
                  aria-label="Add to wishlist"
                >
                  {isInWishlist(product) ? '♥' : '♡'}
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
                  onClick={() => handleAdd(product)}>
                  Add to Cart
                </button>
                <button
                  type="button"
                  className={`wishlist-inline-btn ${isInWishlist(product) ? 'active' : ''}`}
                  onClick={() => toggleWishlist(product)}
                  aria-label="Add to wishlist"
                >
                  {isInWishlist(product) ? '♥' : '♡'}
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
