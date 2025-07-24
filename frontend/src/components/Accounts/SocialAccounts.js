import React, { useState, useEffect } from 'react';
import { accountsAPI } from '../../services/api';
import { toast } from 'react-toastify';

const SocialAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    platform: '',
    username: '',
    token: '',
    chat_id: ''
  });

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await accountsAPI.getAll();
      setAccounts(response.data);
    } catch (error) {
      toast.error('Failed to fetch accounts');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await accountsAPI.create(formData);
      toast.success('Account added successfully!');
      setShowForm(false);
      setFormData({ platform: '', username: '', token: '', chat_id: '' });
      fetchAccounts();
    } catch (error) {
      toast.error('Failed to add account');
    }
  };

  const deleteAccount = async (accountId) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      try {
        await accountsAPI.delete(accountId);
        toast.success('Account deleted successfully!');
        fetchAccounts();
      } catch (error) {
        toast.error('Failed to delete account');
      }
    }
  };

  return (
    <div className="social-accounts">
      <div className="accounts-header">
        <h3>Social Media Accounts</h3>
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add Account'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="account-form">
          <select
            value={formData.platform}
            onChange={(e) => setFormData({...formData, platform: e.target.value})}
            required
          >
            <option value="">Select Platform</option>
            <option value="telegram">Telegram</option>
            <option value="instagram">Instagram</option>
            <option value="facebook">Facebook</option>
            <option value="whatsapp">WhatsApp</option>
          </select>

          <input
            type="text"
            placeholder="Username/Channel Name"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            required
          />

          {formData.platform === 'telegram' && (
            <input
              type="text"
              placeholder="Chat ID (optional)"
              value={formData.chat_id}
              onChange={(e) => setFormData({...formData, chat_id: e.target.value})}
            />
          )}

          {formData.platform !== 'instagram' && (
            <input
              type="text"
              placeholder="API Token (if required)"
              value={formData.token}
              onChange={(e) => setFormData({...formData, token: e.target.value})}
            />
          )}

          <button type="submit">Add Account</button>
        </form>
      )}

      <div className="accounts-list">
        {accounts.length === 0 ? (
          <p>No accounts configured. Add your first social media account!</p>
        ) : (
          accounts.map(account => (
            <div key={account.id} className="account-card">
              <div className="account-info">
                <h4>{account.platform}</h4>
                <p>{account.username}</p>
                <span className={`status ${account.is_active ? 'active' : 'inactive'}`}>
                  {account.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <button 
                onClick={() => deleteAccount(account.id)}
                className="delete-btn"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      <div className="platform-info">
        <h4>Platform Setup Instructions:</h4>
        <div className="info-section">
          <h5>Telegram:</h5>
          <p>1. Create a bot via @BotFather</p>
          <p>2. Get your bot token</p>
          <p>3. Add bot to your channel</p>
          <p>4. Get chat ID (optional, can use environment variable)</p>
        </div>
        
        <div className="info-section">
          <h5>Instagram:</h5>
          <p>You'll be prompted for credentials when posting (not stored for security)</p>
        </div>
        
        <div className="info-section">
          <h5>Facebook & WhatsApp:</h5>
          <p>Coming soon! These platforms will be added in future updates.</p>
        </div>
      </div>
    </div>
  );
};

export default SocialAccounts;