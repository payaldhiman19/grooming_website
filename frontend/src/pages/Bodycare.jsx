import React from 'react';
import { product_list } from '../assets/asset.js';
import Footer from '../components/Footer.jsx';
import Header from '../components/Header.jsx';

const Bodycare = () => {
    const bodywash = product_list.slice(25, 30); 


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
                  {product.product_name}
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