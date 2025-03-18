import homeimage from '../assets/homeimage.png';
import Footer from '../components/Footer.jsx';
import Header from '../components/Header.jsx';
import { Link } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import "./Home.css";
import ProductCard from '../components/ProductCard.jsx'; 


const Home = ({ cart, onAddToCart }) => {
  const [quantities, setQuantities] = useState({}); // Track quantities of products

  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok){
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchProducts();
  }, []);



  // Function to handle quantity change for each product
  const handleQuantityChange = (productId, quantity) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: quantity,
    }));
  };

  

  const handleAddToCart = (product) => {
    const quantity = quantities[product.product_id] || 1; // Default quantity is 1 if no input
    onAddToCart({ ...product, quantity }); // Pass the product with quantity to onAddToCart
  };

  return (
    <div className="home">
      <Header />
      <h3 className="main-heading">Welcome to Our Store - Clesa</h3>
      <img src={homeimage} className="homeimage" alt="Home" />
      <div className="assessment-container">
        <p className="assessment-text">
          Want to know your skin better? Take the Assessment test now!
        </p>
        <div className="assessment-link-container">
          <a href="/assessment-form" className="assessment-link">
            <button className="assessment-btn">
              Take the Assessment
            </button>
          </a>
        </div>
      </div>
      <hr></hr>
      <div className="container">
        <div className="home-container">
          {error ? (
            <p>{error}</p>
          ) : (
            <div className="products-grid">
              {products.map((product, index) => (
                <ProductCard key={index} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

const CategorySection = ({ title, products, quantities, onAddToCart, onQuantityChange }) => (
  <>
    <h4 className="main-heading">{title}</h4>
    <div className="image-gallery row">
      {products.map((product, index) => (
        <ProductCard
          key={index}
          product={product}
          quantity={quantities[product.product_id] || 1}
          onAddToCart={onAddToCart}
          onQuantityChange={onQuantityChange}
        />
      ))}
    </div>
  </>
);

export default Home;
