import React, { useState, useEffect } from 'react';
import './Profile.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Cookies from 'js-cookie';


const Profile = () => {
  const [user, setUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [avatarToSave, setAvatarToSave] = useState(null); // For saving the selected avatar

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
          if (data) {
            setUser(data);
            setSelectedAvatar(data.avatarId || 'https://via.placeholder.com/150'); // Default if no avatar
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
    <div className="profile-container">
      <h1>User Profile</h1>
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
        {userDetails ? (
          <div>
            <p>
              <strong>Name:</strong> {userDetails.name}
            </p>
            <p>
              <strong>Email:</strong> {userDetails.email}
            </p>
          </div>
        ) : (
          <div>Loading...</div>
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
    </div>
  );
};

export default Profile;