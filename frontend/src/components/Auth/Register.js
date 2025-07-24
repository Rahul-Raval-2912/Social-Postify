import React, { useState } from 'react';
import { authAPI } from '../../services/api';
import { toast } from 'react-toastify';

const Register = ({ switchToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setLoading(true);
    
    try {
      await authAPI.register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      toast.success('Registration successful! Please login.');
      switchToLogin();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="👤 Username"
          value={formData.username}
          onChange={(e) => setFormData({...formData, username: e.target.value})}
          required
        />
        <input
          type="email"
          placeholder="📧 Email Address"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
        />
        <input
          type="password"
          placeholder="🔒 Password"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          required
        />
        <input
          type="password"
          placeholder="🔒 Confirm Password"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? (
            <>
              <span className="loading-spinner">🔄</span>
              Creating account...
            </>
          ) : (
            '✨ Create Account'
          )}
        </button>
      </form>
      <p style={{textAlign: 'center', marginTop: '1.5rem', color: '#666'}}>
        Already have an account? 
        <button onClick={switchToLogin} className="link-btn">Sign in here</button>
      </p>
    </>
  );
};

export default Register;