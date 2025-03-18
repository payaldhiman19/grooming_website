import React, { useState, useEffect, useContext } from "react";
import { CartContext } from "../contexts/CartContext";
import "./ProductCard.css";

function ProductCard({ product, currentUserId }) {
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1); // Track quantity
  const { addToCart: addToCartContext } = useContext(CartContext); // Use CartContext if available

  useEffect(() => {
    if (added) {
      const timerId = setTimeout(() => {
        setAdded(false); // Reset "Added" state after 1.5 seconds
      }, 1700);
      return () => clearTimeout(timerId);
    }
  }, [added]);

  // const addToCart = async (productId, quantity) => {
  //   try {
  //     const response = await fetch("http://localhost:5000/api/cart", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         userId: currentUserId,
  //         productId,
  //         quantity,
  //       }),
  //     });

  //     if (!response.ok) throw new Error("Failed to add to cart");

  //     const data = await response.json();
  //     alert("Item added to cart!");
  //     setAdded(true); // Update state to reflect the successful addition
  //   } catch (err) {
  //     console.error("Error adding to cart:", err);
  //     alert("Could not add to cart");
  //   }
  // };

  const handleAddToCart = () => {
    // Use context if available, otherwise fallback to API
    if (addToCartContext) {
      addToCartContext(product, quantity); // Add to context-based cart
      setAdded(true);
    } else {
      addToCart(product._id, quantity); // Fallback to API call
    }
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
      {/* <div className="quantity-selector">
        
        <input
          type="number"
          id={`quantity-${product._id}`}
          value={quantity}
          onChange={handleQuantityChange}
          min="1"
        />
      </div> */}
      <button
        className={`add-to-cart-btn ${added ? "added" : ""}`}
        onClick={handleAddToCart}
      >
        {added ? "Added" : "Add to Cart"}
      </button>
    </div>
  );
}

export default ProductCard;
