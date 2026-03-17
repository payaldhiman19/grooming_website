import React, { useState, useEffect, useContext } from 'react';
import './Profile.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Cookies from 'js-cookie';
import { CartContext } from '../contexts/CartContext';


const Profile = () => {
  const [user, setUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [avatarToSave, setAvatarToSave] = useState(null); // For saving the selected avatar
  const [address, setAddress] = useState('');
  const [addressSaved, setAddressSaved] = useState(false);
  const { cart, wishlist, toggleWishlist } = useContext(CartContext);

  const navigate = useNavigate(); // Correctly invoke useNavigate

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = Cookies.get('token');
      if (token) {
        try {
          const response = await fetch('http://localhost:5000/user-details', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
          });
          const data = await response.json();
          setUserDetails(data);
          const storedAddressKey = data?.email ? `clesa_address_${data.email}` : null;
          const storedAddress = storedAddressKey ? localStorage.getItem(storedAddressKey) : '';

          if (data) {
            setUser(data);
            setSelectedAvatar(data.avatarId || 'https://via.placeholder.com/150'); // Default if no avatar
            const initialAddress = data.address || storedAddress || '';
            setAddress(initialAddress);
            setAddressSaved(!!initialAddress);
          }
        } catch (err) {
          console.error('Failed to fetch user details', err);
        }
      }
    };
    fetchUserDetails();
  }, []);

  const handleGoToHome = () => {
    navigate('/'); // Correctly navigate to the home page
  };

  const handleDeleteAccount = () => {
    const confirmation = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (!confirmation) return;

    const token = Cookies.get('token');
    fetch('http://localhost:5000/delete-account', {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          alert('Account deleted successfully');
           Cookies.remove('token'); // Remove token from localStorage
          window.location.href = '/'; // Redirect to login page after account deletion
        } else {
          alert('Failed to delete account');
        }
      })
      .catch((err) => {
        console.error('Error deleting account:', err);  // Log error for debugging
        alert('Failed to delete account');
      });
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedAvatar(reader.result); // Temporarily display the selected avatar
        setAvatarToSave(file); // Store the file for later saving
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAvatar = () => {
    const token = Cookies.get('token');
    if (!avatarToSave) {
      alert('No avatar selected for upload.');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', avatarToSave);

    fetch('http://localhost:5000/upload-avatar', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`, // Include the JWT token
      },
      body: formData, // Send the file data
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.avatarId) {
          alert('Avatar updated successfully');
          setSelectedAvatar(`http://localhost:5000/uploads/${data.avatarId}`); // Update the displayed avatar
        } else {
          alert('Failed to save avatar');
        }
      })
      .catch((err) => {
        console.error('Error saving avatar:', err);
        alert('Failed to save avatar');
      });
  };

  const handleLogout = () => {
    Cookies.remove('token');
    window.location.href = '/'; // Redirect to login page
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-page-wrapper">
      <div className="profile-container">
      <h1>Your profile</h1>
      <p className="profile-subtitle">A quick snapshot of your Clesa account.</p>
      <div className="profile-details">
        <div className="profile-avatar-container">
          <img
            src={selectedAvatar || 'https://via.placeholder.com/150'}
            alt="Avatar"
            className="profile-avatar"
          />
          <label htmlFor="avatar-upload" className="upload-label">
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
            />
            Change Avatar
          </label>
          {avatarToSave && (
            <button className="save-avatar-btn" onClick={handleSaveAvatar}>
              Save Avatar
            </button>
          )}
        </div>
        {userDetails && (
          <div className="profile-main-info">
            <div className="profile-text-row">
              <div>
                <p className="label">Name</p>
                <p className="value">{userDetails.name}</p>
              </div>
              <div>
                <p className="label">Email</p>
                <p className="value">{userDetails.email}</p>
              </div>
            </div>
            <div className="profile-text-row profile-stats-row">
              <div className="profile-stat">
                <p className="label">Cart items</p>
                <p className="value">{cart.length}</p>
              </div>
              <div className="profile-stat">
                <p className="label">Wishlist items</p>
                <p className="value">{wishlist.length}</p>
              </div>
            </div>
            <div className="profile-text-row profile-address-row">
              <div>
                <p className="label">Delivery address</p>
                <textarea
                  className="address-input"
                  rows="3"
                  value={address}
                  placeholder="Add your delivery address for faster checkout."
                  onChange={(e) => {
                    setAddress(e.target.value);
                    setAddressSaved(false);
                  }}
                />
                {!addressSaved && (
                  <button
                    type="button"
                    className="save-address-btn"
                    onClick={() => {
                      if (userDetails?.email) {
                        localStorage.setItem(`clesa_address_${userDetails.email}`, address.trim());
                      }
                      setAddressSaved(true);
                    }}
                  >
                    Save address
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="profile-actions">
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
        <button className="delete-account-btn" onClick={handleDeleteAccount}>
          Delete Account
        </button>
        <button className="go-home-btn" onClick={handleGoToHome}>
          Go to Home
        </button>
      </div>
      <div className="profile-wishlist-section">
        <h2 className="profile-section-title">Your wishlist</h2>
        {wishlist.length === 0 ? (
          <p className="profile-empty-text">
            You don’t have any favourites yet. Tap the ♥ icon on products to add them here.
          </p>
        ) : (
          <div className="profile-wishlist-grid">
            {wishlist.map((item, index) => (
              <div key={index} className="profile-wishlist-card">
                <button
                  type="button"
                  className="wishlist-remove-btn"
                  onClick={() => toggleWishlist(item)}
                  aria-label="Remove from wishlist"
                >
                  ×
                </button>
                <img
                  src={item.product_image}
                  alt={item.product_name}
                  className="profile-wishlist-image"
                />
                <p className="wishlist-name">{item.product_name}</p>
                <p className="wishlist-price">₹{item.product_price}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
      </div>
  );
};

export default Profile;