import React, { useState } from 'react';
import { authAPI } from '../../services/api';
import { toast } from 'react-toastify';

const Login = ({ onLogin, switchToRegister }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await authAPI.login(formData);
      toast.success('Login successful!');
      onLogin(response.data.user_id);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed');
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
          type="password"
          placeholder="🔒 Password"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? (
            <>
              <span className="loading-spinner">🔄</span>
              Logging in...
            </>
          ) : (
            '🚀 Login'
          )}
        </button>
      </form>
      <p style={{textAlign: 'center', marginTop: '1.5rem', color: '#666'}}>
        Don't have an account? 
        <button onClick={switchToRegister} className="link-btn">Create one here</button>
      </p>
    </>
  );
};

export default Login;