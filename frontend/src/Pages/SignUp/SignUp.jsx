import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../../Components/Footer/Footer';
import Header from '../../Components/Header/Header';
import './SignUp.css';
import signupImage from '../../Assets/signupImage.png';
import eyeIcon from '../../Assets/eye.png';

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    mobile: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Invalid email format';
      }
    }

    if (!formData.username) {
      newErrors.username = 'Username is required';
    }

    if (!formData.mobile) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = 'Mobile number must be 10 digits';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
      if (!passwordRegex.test(formData.password)) {
        newErrors.password =
          'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        if (data.user && data.user.username) {
          localStorage.setItem('username', data.user.username);
          localStorage.setItem('userEmail', data.user.email);
        }

        setMessageType('success');
        setMessage('Sign up successful! Redirecting...');
        setTimeout(() => {
          setMessage(null);
          navigate('/signin'); // 🔷 updated to redirect to Sign In page
        }, 1000);
      } else {
        setMessageType('error');
        setMessage(data.message || 'Something went wrong');
        setTimeout(() => setMessage(null), 1000);
      }
    } catch (err) {
      console.error('Signup error:', err);
      setMessageType('error');
      setMessage('Failed to connect to server.');
      setTimeout(() => setMessage(null), 1000);
    }
  };

  return (
    <div>
      <Header />
      <div className="signup-wrapper">
        <div className="signup-left">
          <form className="signup-form" onSubmit={handleSubmit}>
            <h1 className="form-title">Sign Up</h1>
            <p className="form-subtitle">Start of Something Great!</p>

            {message && (
              <div className={`alert-${messageType}`} style={{ marginBottom: '15px' }}>
                {message}
              </div>
            )}

            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your email"
            />
            {errors.email && <p className="error-msg">{errors.email}</p>}

            <label className="form-label">User Name</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your username"
            />
            {errors.username && <p className="error-msg">{errors.username}</p>}

            <label className="form-label">Mobile</label>
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your mobile number"
            />
            {errors.mobile && <p className="error-msg">{errors.mobile}</p>}

            <label className="form-label">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your password"
              />
              <img
                src={eyeIcon}
                alt="Toggle Password"
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
            {errors.password && <p className="error-msg">{errors.password}</p>}

            <button className="submit-btn" type="submit">Sign Up</button>

            <p className="signup-text">
              <span className="no-account">Have An Account?</span>{' '}
              <span className="signup-link" onClick={() => navigate('/signin')}>Sign In</span>
            </p>
          </form>
        </div>

        <div className="signup-right">
          <div className="half-bg"></div>
          <img src={signupImage} alt="Doni" className="doni-img" />
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default SignUp;
