import React, { useContext } from 'react';
import { product_list } from '../assets/asset.js';
import Footer from '../components/Footer.jsx';
import Header from '../components/Header.jsx';
import { CartContext } from '../contexts/CartContext';

const Bodycare = () => {
  const bodywash = product_list.slice(25, 30); 
  const { addToCart, wishlist, toggleWishlist } = useContext(CartContext);

  const getKey = (p) => p?._id || p?.id || p?.product_name;

  const isInWishlist = (product) => {
    const key = getKey(product);
    if (!key) return false;
    return wishlist?.some((p) => getKey(p) === key);
  };

  return (
    <div className="home">
      <Header />
      <h4 className="main-heading">Bodywash</h4>
      <div className="image-gallery row">
        {bodywash.map((product, index) => (
          <div key={index} className="col-md-4 mb-4">
            <figure className="figure">
              <img
                src={product.product_image}
                alt={product.product_name}
                className="figure-img img-fluid rounded animate-img"
              />
              <figcaption className="figure-caption text-center">
                <div>{product.product_name}</div>
                <div><strong>₹{product.product_price}</strong></div>
                <button
                  className="btn btn-primary"
                  onClick={() => addToCart(product, 1)}
                >
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
      <Footer />
    </div>
  );
};

export default Bodycare;