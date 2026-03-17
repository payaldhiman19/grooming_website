import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import logo from '../assets/logo.png';
import Login from './Login';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faMagnifyingGlass, faUser } from '@fortawesome/free-solid-svg-icons';
import { FaShoppingCart } from 'react-icons/fa';
import Cookies from 'js-cookie';
import { CartContext } from '../contexts/CartContext';

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState('');
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const { cart } = useContext(CartContext);

  const fetchUserDetails = async () => {
    const token = Cookies.get('token');
    if (!token) return;

    try {
      const response = await fetch('http://localhost:5000/user-details', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
        setUserName(data.name);
      }
    } catch (err) {
      console.error('Failed to fetch user details', err);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const handleLoginClick = () => setShowLogin(true);

  const handleLogout = () => {
    setUser(null);
    setUserName('');
    Cookies.remove('token');
  };

  const handleLoginSuccess = async () => {
    setShowLogin(false);
    await fetchUserDetails();
  };

  const toggleSearchBar = () => setShowSearchBar((prev) => !prev);
  const toggleMenu = () => setShowMenu((prev) => !prev);

  const handleSuggestionClick = async (suggestion) => {
    setSearchQuery(suggestion);
    setSuggestions([]);
    await handleSearch(suggestion);
  };

  const handleSearchClear = () => {
    setSearchQuery('');
    setSearchResults([]);
    setSuggestions([]);
  };

  const handleSearchInputChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === '') {
      setSuggestions([]);
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/search/products?q=${encodeURIComponent(query)}`
      );
      const data = await response.json();

      if (response.ok && data.results) {
        const productNames = data.results.map((product) => product.product_name);
        setSuggestions(productNames);
      }
    } catch (err) {
      console.error('Error fetching suggestions:', err);
    }
  };

  const handleSearch = async (query) => {
    try {
      const response = await fetch(
        `http://localhost:5000/search/products?q=${encodeURIComponent(query)}`
      );

      const data = await response.json();

      if (response.ok && data.results) {
        setSearchResults(data.results);
        setSuggestions([]);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.error('Error fetching search results:', err);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header>
        <nav className="navbar">
          <div className="logo-container">
            <FontAwesomeIcon
              icon={showMenu ? faTimes : faBars}
              className="hamburger-icon"
              onClick={toggleMenu}
            />
            <img src={logo} alt="Clesa Logo" className="header-logo" />
          </div>

          <ul className={`nav-links ${showMenu ? 'active' : ''}`}>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/contact-us">Contact Us</Link></li>
            <li><Link to="/about-us">About Us</Link></li>
            <li><Link to="/Skincare">Skincare</Link></li>
            <li><Link to="/haircare">Haircare</Link></li>
            <li><Link to="/Bodycare">Bodycare</Link></li>
            <li><Link to="/Fragrance">Fragrance</Link></li>
          </ul>

          <div className="last-container">

            <div>
              {user ? (
                <>
                  <span>Welcome, {userName || 'User'}</span>
                  <Link to="/profile">
                    <button className="profile-btn">
                      <FontAwesomeIcon icon={faUser} className="profile-icon" />
                    </button>
                  </Link>
                </>
              ) : (
                <button className="login-btn" onClick={handleLoginClick}>
                  Login
                </button>
              )}
            </div>

            <div className="cart-wrapper">
              <Link to="/cart">
                <FaShoppingCart className="cart-icon" />
                {cart.length > 0 && (
                  <span className="cart-count">{cart.length}</span>
                )}
              </Link>
            </div>

            <div>
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="search-icon"
                onClick={toggleSearchBar}
              />
            </div>

          </div>
        </nav>

        {showSearchBar && (
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearchInputChange}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
            />

            {searchQuery && (
              <button className="clear-btn" onClick={handleSearchClear}>
                Clear
              </button>
            )}

            {suggestions.length > 0 && (
              <ul className="search-suggestions">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </header>

      {searchQuery && (
        <div className="search-results-container">
          {searchResults.length > 0 ? (
            searchResults.map((product) => (
              <div key={product._id} className="search-result-item">
                <img
                  src={product.product_image || '/placeholder.jpg'}
                  alt={product.product_name}
                  className="search-product-image"
                />
                <p>{product.product_name}</p>
                <p>₹{product.product_price}</p>
              </div>
            ))
          ) : (
            <p>No products found for "{searchQuery}"</p>
          )}
        </div>
      )}

      {showLogin && (
        <Login
          onLoginSuccess={handleLoginSuccess}
          onClose={() => setShowLogin(false)}
        />
      )}
    </>
  );
};

export default Header;
