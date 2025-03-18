// import React from 'react';
// import { useParams } from 'react-router-dom';

// const ProductPage = () => {
//   const { productId } = useParams();
//   return (
//     <div>
//       <h1>Product Details for Product {productId}</h1>
//       {/* Fetch and display product details here */}
//     </div>
//   );
// }

// export default ProductPage;



import React from 'react';
import { useParams } from 'react-router-dom';
import './ProductPage.css'

const ProductPage = () => {




  return (
    <div>
      <h1>Facewash</h1>
      <img src={image} alt='image' className='prodeets'></img>
    
    </div>
  );
}

export default ProductPage;
