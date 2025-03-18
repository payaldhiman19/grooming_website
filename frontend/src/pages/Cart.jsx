import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../contexts/CartContext';
import './Cart.css';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity } = useContext(CartContext); // Access cart from context
  const [discount, setDiscount] = useState(0);
  const [shippingCharges, setShippingCharges] = useState(0);

  const calculateTotal = () => {
    return cart.reduce((total, product) => total + product.product_price * product.quantity, 0);
  };

  const totalPriceInINR = calculateTotal();

  useEffect(() => {
    setDiscount((totalPriceInINR * 10) / 100); 
    setShippingCharges(totalPriceInINR < 999 ? 99 : 0); 
  }, [totalPriceInINR]);

  const finalTotal = Math.max(0, totalPriceInINR - discount + shippingCharges);

  const handleQuantityChange = (index, newQuantity) => {
    updateQuantity(index, newQuantity);
  };

  const handleCheckout = () => {
    alert('Proceeding to checkout...');
   };

  return (
    <>
      <h3 className="heading-h">Your Shopping Cart</h3>
      <div className="cart-page">
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div className="cart-items">
            {cart.map((product, index) => (
              <div key={index} className="cart-item">
                <img
                  src={product.product_image}
                  alt={product.product_name}
                  className="cart-item-img"
                />
                <div className="product-info">
                  <span className="product-name">{product.product_name}</span>
                  <span className="product-price">
                    ₹{new Intl.NumberFormat().format(product.product_price)}
                  </span>
                </div>

                {/* Quantity Selector */}
                <div className="quantity-container">
                  <button
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(index, product.quantity - 1)}
                    disabled={product.quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={product.quantity}
                    className="quantity-input"
                    onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
                  />
                  <button
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(index, product.quantity + 1)}
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => removeFromCart(index)}
                  className="remove-btn"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Checkout Section */}
        {cart.length > 0 && (
          <div className="checkout-section">
            <h3>Your Order</h3>
            <div className="price-summary">
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item.id}>
                      <td>
                        {item.product_name} × {item.quantity}
                      </td>
                      <td>₹{new Intl.NumberFormat().format(item.product_price * item.quantity)}</td>
                    </tr>
                  ))}
                  <tr>
                    <td>Subtotal</td>
                    <td>₹{new Intl.NumberFormat().format(totalPriceInINR)}</td>
                  </tr>
                  <tr>
                    <td>Shipping</td>
                    <td>Free Shipping</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Total</strong>
                    </td>
                    <td>
                      <strong>₹{new Intl.NumberFormat().format(finalTotal)}</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="checkout-footer">
              <p>
                Your personal data will be used to process your order, support your
                experience throughout this website, and for other purposes described in
                our <span className="privacy-policy">privacy policy</span>.
              </p>
              <button className="checkout-btn" onClick={handleCheckout}>
                Proceed to Payment
              </button>
            </div>
          </div>
        )}

      </div>
    </>
  );
};

export default Cart;
