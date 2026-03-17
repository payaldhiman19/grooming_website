import React, { useState, useEffect, useContext } from "react";
import { CartContext } from "../contexts/CartContext";
import "./ProductCard.css";

function ProductCard({ product, currentUserId }) {
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { addToCart: addToCartContext, wishlist, toggleWishlist } = useContext(CartContext);
  const id = product?._id || product?.id;
  const isWishlisted = wishlist?.some((p) => (p?._id || p?.id) === id);

  useEffect(() => {
    if (added) {
      const timerId = setTimeout(() => {
        setAdded(false); // Reset "Added" state after 1.5 seconds
      }, 1700);
      return () => clearTimeout(timerId);
    }
  }, [added]);

  const handleAddToCart = () => {
    addToCartContext(product, quantity);
    setAdded(true);
  };

  const handleQuantityChange = (e) => {
    const value = Math.max(1, parseInt(e.target.value) || 1); // Prevent invalid quantities
    console.log("Quantity changed:", value); // Debug log
    setQuantity(value);
  };

  return (
    <div className="product-card">
      <img
        src={product.product_image}
        alt={product.product_name}
        className="product-image"
      />
      <div className="product-details">
        <h4>{product.product_name}</h4>
        <p className="price">₹{product.product_price.toFixed(2)}</p>
      </div>
      <div className="product-actions">
        <button
          className={`add-to-cart-btn ${added ? "added" : ""}`}
          onClick={handleAddToCart}
        >
          {added ? "Added" : "Add to Cart"}
        </button>
        <button
          type="button"
          className={`wishlist-btn ${isWishlisted ? "active" : ""}`}
          onClick={() => toggleWishlist(product)}
          aria-label="Add to wishlist"
        >
          {isWishlisted ? "♥" : "♡"}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
