import homeimage from '../assets/homeimage.png';
import Footer from '../components/Footer.jsx';
import Header from '../components/Header.jsx';
import { Link } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import "./Home.css";
import ProductCard from '../components/ProductCard.jsx'; 


const Home = () => {
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
      <section className="home-highlights">
        <div className="home-highlight">
          <h4>Dermatologist‑tested formulas</h4>
          <p>Every Clesa product is crafted to be gentle, effective and suitable for everyday use.</p>
        </div>
        <div className="home-highlight">
          <h4>Routine made simple</h4>
          <p>Cleanse, treat and protect with routines designed for real skin concerns.</p>
        </div>
        <div className="home-highlight">
          <h4>Free assessment</h4>
          <p>Use your skin assessment to discover products that actually match your skin.</p>
        </div>
      </section>
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

export default Home;
