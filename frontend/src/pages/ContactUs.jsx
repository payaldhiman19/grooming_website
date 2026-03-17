import React from 'react';
import './ContactUs.css';
import Header from '../components/Header.jsx';

const ContactForm = () => {
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      message: e.target.message.value,
    };

    try {
      const response = await fetch('http://localhost:5000/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Message sent successfully!');
        e.target.reset();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (err) {
      console.error('Error connecting to server:', err);
      alert('Error connecting to server');
    }
  };

  return (
    <>
      <Header />
      <div className="background-container"></div>
      <div className="contact-form-container">
        <h1>Contact Us</h1>
        <form className="contact-form" onSubmit={handleSubmit}>
          <label htmlFor="name">Name</label>
          <input type="text"id="name"name="name"required/>

          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" require />

          <label htmlFor="message">Message</label>
          <textarea id="message" name="message" rows="5"required></textarea>

          <button type="submit"> Send Message</button>
        </form>
      </div>
    </>
  );
};

export default ContactForm;
