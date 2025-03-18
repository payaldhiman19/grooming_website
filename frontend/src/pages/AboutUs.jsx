import React from 'react';
import './AboutUs.css';
import  Header from '../components/Header.jsx'
const AboutUs = () => {
  return (
    <>
    <Header />
      <div className="background-container"></div>
      <div className="about-us-container">
        <h1>About Us</h1>
        <p>
          Welcome to our skincare e-commerce website! We are passionate about providing high-quality skincare products that nourish and protect your skin.
        </p>
        <p>
          Our journey began with a simple idea: to offer skincare solutions that are both effective and gentle on the skin. We believe in using natural ingredients, free from harsh chemicals, to create products that enhance your natural beauty.
        </p>
        <p>
          Our team is dedicated to researching and sourcing the best ingredients to create products that you can trust. We are committed to transparency, quality, and customer satisfaction.
        </p>
        <p>
          Thank you for choosing us as your skincare partner. We are here to help you achieve healthy, glowing skin!
        </p>
      </div>
    </>
  );
};

export default AboutUs;
