import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
import axios from 'axios';
import signupImage from '../../Assets/signupImage.png';
import eyeIcon from '../../Assets/eye.png';
import './ForgotPassword.css';

function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessageType('error');
      setMessage('Passwords do not match.');
      return;
    }

    try {
      await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, { password });
      setMessageType('success');
      setMessage('Password reset successfully! Redirecting...');
      setTimeout(() => navigate('/signin'), 1500);
    } catch (err) {
      setMessageType('error');
      setMessage(err.response?.data?.message || 'Error resetting password.');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      <Header />

      <div className="forgot-wrapper">
        <div className="forgot-left">
          <form onSubmit={handleSubmit} className="forgot-form">
            <h1 className="forgot-title">Reset Password</h1>
            <p className="forgot-subtitle">Enter and confirm your new password.</p>

            {message && (
              <div className={`alert-${messageType}`} style={{ marginBottom: '15px' }}>
                {message}
              </div>
            )}

            <label className="forgot-label">New Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="forgot-input"
                required
              />
              <img
                src={eyeIcon}
                alt="Toggle Password"
                onClick={togglePasswordVisibility}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '40%', // moved a bit up
                  transform: 'translateY(-50%)',
                  cursor: 'pointer',
                  width: '22px',
                  height: '20px'
                }}
              />
            </div>

            <label className="forgot-label">Confirm New Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="forgot-input"
                required
              />
              <img
                src={eyeIcon}
                alt="Toggle Password"
                onClick={togglePasswordVisibility}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '40%', // moved a bit up
                  transform: 'translateY(-50%)',
                  cursor: 'pointer',
                  width: '22px',
                  height: '20px'
                }}
              />
            </div>

            <button type="submit" className="forgot-btn">Reset Password</button>
          </form>
        </div>

        <div className="forgot-right">
          <div className="half-bg"></div>
          <img
            src={signupImage}
            alt="Reset Password Illustration"
            className="forgot-img"
          />
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ResetPassword;
