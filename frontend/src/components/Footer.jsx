import React from 'react';
import './Footer.css'; 
import logo from '../assets/logo.png';
import facebook from '../assets/facebook.png';
import insta from '../assets/insta.png';
import youtube from '../assets/youtube.png';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <img src={logo} alt="Clesa Logo" className="footer-logo" />
          <p>Your trusted partner in skincare.</p>
        </div>
        <div className="footer-center">
          <h4 >Contact Us</h4>
          <ul>
            <li>Email: support@clesa.com</li>
            <li>Phone: +1 (234) 567-890</li>
          </ul>
        </div>
        <div className="footer-right">
          <h4>Follow Us</h4>
          <ul className="social-media">
            <li>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <img src={facebook} alt="Facebook" className="social-icon" />
              </a>
            </li>
            <li>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <img src={insta} alt="Instagram" className="social-icon" />
              </a>
            </li>
            <li>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                <img src={youtube} alt="YouTube" className="social-icon" />
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 Clesa. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
