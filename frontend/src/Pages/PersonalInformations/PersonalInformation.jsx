import React, { useState, useEffect } from 'react';
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
import Sidebar from '../../Components/Sidebar/Sidebar'; 
import './PersonalInformation.css';

const PersonalInformation = () => {
  const [formData, setFormData] = useState({
   
    firstName: '',
    lastName: '',
    country: '',
    company: '',
    streetAddress: '',
    apartment: '',
    city: '',
    state: '',
    phone: '',
    postalCode: '',
    deliveryInstructions: '',
    defaultShipping: false,
    defaultBilling: false,
  });

  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      alert('Missing token. Please sign in again.');
      return;
    }

    fetch('http://localhost:5000/api/personal-info/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) {
          setFormData({
           
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            country: data.country || '',
            company: data.company || '',
            streetAddress: data.streetAddress || '',
            apartment: data.apartment || '',
            city: data.city || '',
            state: data.state || '',
            phone: data.phone || '',
            postalCode: data.postalCode || '',
            deliveryInstructions: data.deliveryInstructions || '',
            defaultShipping: data.defaultShipping || false,
            defaultBilling: data.defaultBilling || false,
          });
          setIsEditing(false);
        } else {
          alert('No personal info found. Please complete your profile.');
        }
      })
      .catch(err => {
        console.error('Error fetching personal info:', err);
        alert('Failed to fetch personal info.');
      });
  }, [token]);

  const handleInputChange = (e) => {
    if (!isEditing) return;

    const { name, value, type, checked } = e.target;

    if (name === 'phone') {
      const digits = value.replace(/\D/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: digits,
      }));
      setErrors(prev => ({ ...prev, phone: '' }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First Name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last Name is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';
    if (!formData.streetAddress.trim()) newErrors.streetAddress = 'Street Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    else if (formData.phone.length < 10 || formData.phone.length > 12) newErrors.phone = 'Phone number must be 10-12 digits';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal Code is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      alert('Please fill in all required fields.');
      return;
    }

    if (!token) {
      alert('Missing token. Please sign in again.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/personal-info/me', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const resData = await response.json();

      if (!response.ok) {
        alert(resData.message || 'Failed to save data');
        return;
      }

      setSuccessMessage(resData.message || 'Profile information saved successfully!');
      setTimeout(() => setSuccessMessage(''), 2000);
      setIsEditing(false);

    } catch (error) {
      console.error('Error saving form:', error);
      alert('Network error while saving form.');
    }
  };

  const handleEdit = () => setIsEditing(true);

  const handleClear = () => {
    setFormData({
      
      firstName: '',
      lastName: '',
      country: '',
      company: '',
      streetAddress: '',
      apartment: '',
      city: '',
      state: '',
      phone: '',
      postalCode: '',
      deliveryInstructions: '',
      defaultShipping: false,
      defaultBilling: false,
    });
    setErrors({});
    setIsEditing(true);
  };

  const inputProps = isEditing ? {} : { readOnly: true, disabled: true };

  // Toast popup for success message
  const Toast = ({ message }) => (
    <div style={{
      position: 'fixed',
      left: '50%',
      bottom: 40,
      transform: 'translateX(-50%)',
      background: '#222',
      color: '#fff',
      padding: '16px 32px',
      borderRadius: 8,
      fontWeight: 500,
      fontSize: 16,
      boxShadow: '0 2px 16px rgba(60,66,66,0.13)',
      zIndex: 9999,
      opacity: message ? 1 : 0,
      transition: 'opacity 0.3s',
    }}>
      {message}
    </div>
  );

  return (
    <>
      <Header />
      <div className="container">
        <div className="main-layout" style={{ display: 'flex', alignItems: 'flex-start' }}>
          <Sidebar />
          <div style={{ flex: 1, marginLeft: 32 }}>
            <div className="form-container">
              <h1 className="form-title1">Personal Information</h1>
              <p className="form-subtitle1">Add Address</p>
              <form className="form-root">
                <div className="form-grid">
                  
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="label">First Name</label>
                      <input
                        className="input"
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        {...inputProps}
                      />
                    </div>
                    <div className="form-group">
                      <label className="label">Last Name</label>
                      <input
                        className="input"
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        {...inputProps}
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="label">Country</label>
                      <input
                        className="input"
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        {...inputProps}
                      />
                    </div>
                    <div className="form-group">
                      <label className="label">Company</label>
                      <input
                        className="input"
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        {...inputProps}
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="label">Street Address</label>
                      <input
                        className="input"
                        type="text"
                        name="streetAddress"
                        value={formData.streetAddress}
                        onChange={handleInputChange}
                        {...inputProps}
                      />
                    </div>
                    <div className="form-group">
                      <label className="label">Apartment</label>
                      <input
                        className="input"
                        type="text"
                        name="apartment"
                        value={formData.apartment}
                        onChange={handleInputChange}
                        {...inputProps}
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="label">City</label>
                      <input
                        className="input"
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        {...inputProps}
                      />
                    </div>
                    <div className="form-group">
                      <label className="label">State</label>
                      <input
                        className="input"
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        {...inputProps}
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="label">Phone</label>
                      <input
                        className="input"
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        {...inputProps}
                      />
                    </div>
                    <div className="form-group">
                      <label className="label">Postal Code</label>
                      <input
                        className="input"
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        {...inputProps}
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group-full">
                      <label className="label">Delivery Instructions</label>
                      <input
                        className="input"
                        type="text"
                        name="deliveryInstructions"
                        value={formData.deliveryInstructions}
                        onChange={handleInputChange}
                        {...inputProps}
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="checkbox-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          className="checkbox"
                          name="defaultShipping"
                          checked={formData.defaultShipping}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                        <span className="checkbox-text">Default Shipping</span>
                      </label>
                    </div>
                    <div className="checkbox-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          className="checkbox"
                          name="defaultBilling"
                          checked={formData.defaultBilling}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                        <span className="checkbox-text">Default Billing</span>
                      </label>
                    </div>
                  </div>
              
               
                <div className="button-group">
                  {isEditing ? (
                    <>
                      <button type="button" onClick={handleClear} className="personal-edit-btn">Clear</button>
                      <button type="button" onClick={handleSave} className="personal-save-btn">Save</button>
                    </>
                  ) : (
                    <>
                      <button type="button" onClick={handleEdit} className="personal-edit-btn">Edit</button>
                      <button type="button" onClick={handleClear} className="personal-edit-btn">Clear</button>
                    </>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <Toast message={successMessage} />
    </>
  );
};

export default PersonalInformation;
