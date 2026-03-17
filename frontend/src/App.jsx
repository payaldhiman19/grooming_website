import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ContactUs from './pages/ContactUs';
import AboutUs from './pages/AboutUs';
import Skincare from './pages/Skincare';
import Haircare from './pages/Haircare';
import Bodycare from './pages/Bodycare';
import Fragrance from './pages/Fragrance';
import Footer from './components/Footer';
import Login from './components/Login';
import Cart from './pages/Cart';
import AssessmentForm from './components/AssessmentForm';
import { CartProvider } from './contexts/CartContext';
import Profile from './components/Profile';
import AdminPage from './components/AdminPage';
import './App.css';

function App() {
  const [showLogin, setShowLogin] = useState(false);

  const handleCloseLogin = () => {
    setShowLogin(false);
  };
return (
  <CartProvider>
    <Router>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/skincare" element={<Skincare />} />
            <Route path="/haircare" element={<Haircare />} />
            <Route path="/login" element={<Login/>}/>
            <Route path="/bodycare" element={<Bodycare />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/AdminPage" element={<AdminPage />} />
            <Route path="/fragrance" element={<Fragrance />} />
            <Route path="/assessment-form" element={<AssessmentForm />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </main>
        {showLogin && <Login onClose={handleCloseLogin} />}
    </Router>
  </CartProvider>
);
}

export default App;
