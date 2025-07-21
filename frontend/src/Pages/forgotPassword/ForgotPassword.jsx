import React, { useState } from 'react';
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
import axios from 'axios';
import signupImage from '../../Assets/signupImage.png';
import './ForgotPassword.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      setMessageType('success');
      setMessage('Password reset link sent! Check your email.');
    } catch (err) {
      setMessageType('error');
      setMessage(err.response?.data?.message || 'Error sending reset link.');
    }
  };

  return (
    <div>
      <Header />

      <div className="forgot-wrapper">
        <div className="forgot-left">
          <form onSubmit={handleSubmit} className="forgot-form">
            <h1 className="forgot-title">Forgot Password</h1>
            <p className="forgot-subtitle">Enter your email to reset your password.</p>

            {message && (
              <div className={`alert-${messageType}`} style={{ marginBottom: '15px' }}>
                {message}
              </div>
            )}

            <label className="forgot-label">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="forgot-input"
              autoComplete="email"
              required
            />

            <button type="submit" className="forgot-btn">Send Reset Link</button>
          </form>
        </div>

        <div className="forgot-right">
          <div className="half-bg"></div>
          <img
            src={signupImage}
            alt="Forgot Password Illustration"
            className="forgot-img"
          />
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ForgotPassword;
