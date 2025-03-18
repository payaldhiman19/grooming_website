import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import tick from '../assets/tick.jpg';
import Cookies from 'js-cookie';  // Make sure this is here


const Login = ({ onClose, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('login'); // Track active tab (login, signup, adminLogin)
  const navigate = useNavigate();

  const loginFormRef = useRef(null);
  const signupFormRef = useRef(null);

  // Check if token exists and is valid
   useEffect(() => {
    const checkToken = async () => {
      const token = Cookies.get('token'); // Retrieve token from cookies
      if (token) {
        try {
          const response = await fetch('http://localhost:5000/protected-route', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`, // Pass token in Authorization header
              'Content-Type': 'application/json',
            },
          });
          const data = await response.json();
          console.log(data); // Handle your protected data here
        } catch (err) {
          console.error('Error fetching protected route:', err);
        }
      }
    };
    checkToken();
  }, []);
  const handleSignup = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;
    const passwordCriteria = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/;

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!passwordCriteria.test(password)) {
      setError('Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
        credentials: 'include', // Include cook
      });

      if (response.ok) {
        setIsSignedUp(true);
        signupFormRef.current.reset();
        setError('');
      } else {
        const errorData = await response.json();
        setError(errorData.error);
      }
    } catch (err) {
      setError('Error connecting to server');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
  
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Include cookies in the request
      });
  
      if (response.ok) {
        const data = await response.json();
        Cookies.set('token', data.token, { expires: 7 }); // Store the token in cookies
        navigate('/profile');
      } else {
        const result = await response.json();
        setError(result.error || 'Invalid email or password');
      }
    } catch (err) {
      setError('Error connecting to server');
    }
  };
  

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await fetch('http://localhost:5000/get-all-admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        Cookies.set('adminToken', data.token, { expires: 7 }); // Store admin token in cookies for 7 days
        navigate('/AdminPage');
      } else {
        const result = await response.json();
        setError(result.error || 'Invalid admin credentials');
      }
    } catch (err) {
      setError('Error connecting to server');
    }
  };

  const closePopup = () => {
    setIsSignedUp(false);
    setIsLogin(true); // Go to login after signup
  };

  return (
    <div className="login-container">
      {isSignedUp && (
        <div className="popup open-popup">
          <img src={tick} alt="Success" />
          <h2>Thank You!</h2>
          <p>Your details have been successfully submitted. Thanks!</p>
          <button type="button" onClick={closePopup}>
            Back to Login
          </button>
        </div>
      )}

      <div className={`form-container ${isSignedUp ? 'blur' : ''}`}>
        <button className="close-btn" onClick={onClose}>X</button>
        <div className="form-toggle">
          <button
            className={activeTab === 'login' ? 'active' : ''}
            onClick={() => setActiveTab('login')}
          >
            Login
          </button>
          <button
            className={activeTab === 'signup' ? 'active' : ''}
            onClick={() => setActiveTab('signup')}
          >
            Signup
          </button>
          <button
            className={activeTab === 'adminLogin' ? 'active' : ''}
            onClick={() => setActiveTab('adminLogin')}
          >
            Admin Panel
          </button>
        </div>

        {activeTab === 'login' && (
          <div className="form">
            <h2>Log in</h2>
            {error && <p className="error">{error}</p>}
            <form ref={loginFormRef} onSubmit={handleLogin}>
              <input type="email" name="email" placeholder="Email" required />
              <input type="password" name="password" placeholder="Password" required />
              <a href="#">Forgot Password?</a>
              <p>Not a member? <a href="#" onClick={() => setActiveTab('signup')}>Sign up now</a></p>
              <p>Login as Admin? <a href="#" onClick={() => setActiveTab('adminLogin')}>Click here</a></p>
              <button type="submit" className="submit-btn">Login</button>
            </form>
          </div>
        )}

        {activeTab === 'signup' && (
          <div className="form">
            <h2>Sign up</h2>
            {error && <p className="error">{error}</p>}
            <form ref={signupFormRef} onSubmit={handleSignup}>
              <input type="text" name="name" placeholder="Name" required />
              <input type="email" name="email" placeholder="Email" required />
              <input type="password" name="password" placeholder="Password" required />
              <input type="password" name="confirmPassword" placeholder="Confirm Password" required />
              <button type="submit" className="submit-btn">Sign Up</button>
            </form>
            <p>Already a member? <a href="#" onClick={() => setActiveTab('login')}>Login now</a></p>
          </div>
        )}

        {activeTab === 'adminLogin' && (
          <div className="form">
            <h2>Admin Panel</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleAdminLogin}>
              <input type="email" name="email" placeholder="Email" required />
              <input type="password" name="password" placeholder="Password" required />
              <button type="submit" className="submit-btn">
                Admin Login
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
