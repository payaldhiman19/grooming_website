import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();
export const WishlistContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
    const savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(savedWishlist);
  }, []);

  const persist = (nextCart) => {
    setCart(nextCart);
    localStorage.setItem("cart", JSON.stringify(nextCart));
  };

  const persistWishlist = (nextWishlist) => {
    setWishlist(nextWishlist);
    localStorage.setItem("wishlist", JSON.stringify(nextWishlist));
  };

  const addToCart = (product, quantity = 1) => {
    const qty = Math.max(1, Number(quantity) || 1);
    const id = product?._id || product?.id;
    if (!id) {
      persist([...cart, { ...product, quantity: qty }]);
      return;
    }

    const idx = cart.findIndex((p) => (p?._id || p?.id) === id);
    if (idx === -1) {
      persist([...cart, { ...product, quantity: qty }]);
      return;
    }

    const next = [...cart];
    next[idx] = { ...next[idx], quantity: (Number(next[idx].quantity) || 1) + qty };
    persist(next);
  };

  const removeFromCart = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    persist(updatedCart);
  };

  const updateQuantity = (index, quantity) => {
    const qty = Math.max(1, Number(quantity) || 1);
    const updatedCart = [...cart];
    if (!updatedCart[index]) return;
    updatedCart[index].quantity = qty;
    persist(updatedCart);
  };

  const toggleWishlist = (product) => {
    if (!product) return;
    const key = product?._id || product?.id || product?.product_name;
    if (!key) return;

    const getKey = (p) => p?._id || p?.id || p?.product_name;
    const exists = wishlist.find((p) => getKey(p) === key);

    if (exists) {
      persistWishlist(wishlist.filter((p) => getKey(p) !== key));
    } else {
      persistWishlist([...wishlist, product]);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, wishlist, toggleWishlist }}>
      {children}
    </CartContext.Provider>
  );
};
