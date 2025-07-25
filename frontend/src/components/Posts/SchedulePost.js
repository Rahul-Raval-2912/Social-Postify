import React, { useState, useEffect } from 'react';
import { postsAPI, accountsAPI } from '../../services/api';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const SchedulePost = ({ onPostCreated, setCurrentPage }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: null,
    platform_ids: [],
    scheduled_time: new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now
  });
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchAccounts();
    // Check if there's a generated image to use
    const savedImage = localStorage.getItem('generatedImageForPost');
    if (savedImage) {
      const imageData = JSON.parse(savedImage);
      // Convert base64 to blob for form submission
      const byteCharacters = atob(imageData.base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/png' });
      const file = new File([blob], 'generated-image.png', { type: 'image/png' });
      
      setFormData(prev => ({ ...prev, image: file }));
      setImagePreview(`data:image/png;base64,${imageData.base64}`);
      localStorage.removeItem('generatedImageForPost');
    }
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await accountsAPI.getAll();
      setAccounts(response.data);
    } catch (error) {
      toast.error('Failed to fetch accounts');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const togglePlatform = (accountId) => {
    const newPlatformIds = formData.platform_ids.includes(accountId)
      ? formData.platform_ids.filter(id => id !== accountId)
      : [...formData.platform_ids, accountId];
    
    setFormData({ ...formData, platform_ids: newPlatformIds });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.platform_ids.length === 0) {
      toast.error('Please select at least one platform');
      return;
    }

    if (formData.scheduled_time <= new Date()) {
      toast.error('Please select a future date and time');
      return;
    }

    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('content', formData.content);
      submitData.append('scheduled_time', formData.scheduled_time.toISOString());
      submitData.append('status', 'scheduled');
      
      if (formData.image) {
        submitData.append('image', formData.image);
      }
      
      formData.platform_ids.forEach(id => {
        submitData.append('platform_ids', id);
      });

      await postsAPI.create(submitData);
      toast.success('Post scheduled successfully! ⏰');
      onPostCreated();
    } catch (error) {
      toast.error('Failed to schedule post');
    } finally {
      setLoading(false);
    }
  };

  const getPlatformIcon = (platform) => {
    const icons = {
      telegram: '📱',
      instagram: '📷',
      facebook: '👥',
      whatsapp: '💬'
    };
    return icons[platform] || '📱';
  };

  const getTimeFromNow = (date) => {
    const now = new Date();
    const diff = date - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `in ${days} day${days > 1 ? 's' : ''}`;
    if (hours > 0) return `in ${hours} hour${hours > 1 ? 's' : ''}`;
    return 'in less than an hour';
  };

  const quickScheduleOptions = [
    { label: '1 Hour', hours: 1, icon: '⏰' },
    { label: '3 Hours', hours: 3, icon: '🕒' },
    { label: 'Tomorrow 9 AM', hours: null, time: 'tomorrow-9am', icon: '🌅' },
    { label: 'Next Week', hours: 168, icon: '📅' }
  ];

  const setQuickSchedule = (option) => {
    const now = new Date();
    let scheduledTime;
    
    if (option.time === 'tomorrow-9am') {
      scheduledTime = new Date(now);
      scheduledTime.setDate(scheduledTime.getDate() + 1);
      scheduledTime.setHours(9, 0, 0, 0);
    } else {
      scheduledTime = new Date(now.getTime() + option.hours * 60 * 60 * 1000);
    }
    
    setFormData({ ...formData, scheduled_time: scheduledTime });
  };

  return (
    <div className="schedule-post-page">
      <div className="page-header">
        <button 
          className="back-btn"
          onClick={() => setCurrentPage('dashboard')}
        >
          ← Back
        </button>
        <div className="page-title">
          <h1>⏰ Schedule Post</h1>
          <p>Plan your content for the perfect timing</p>
        </div>
      </div>

      <div className="schedule-container">
        <form onSubmit={handleSubmit} className="schedule-form">
          <div className="form-section">
            <div className="section-header">
              <h3>📝 Post Content</h3>
            </div>
            
            <div className="form-group">
              <label>Post Title *</label>
              <input
                type="text"
                placeholder="Enter an engaging title..."
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label>Content *</label>
              <textarea
                placeholder="What's on your mind? Use # for hashtags..."
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                className="form-textarea"
                rows="6"
                required
              />
            </div>
          </div>

          <div className="form-section">
            <div className="section-header">
              <h3>🖼️ Add Image</h3>
            </div>
            
            <div className="image-upload-area">
              {imagePreview ? (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                  <button 
                    type="button"
                    className="remove-image-btn"
                    onClick={() => {
                      setImagePreview(null);
                      setFormData({...formData, image: null});
                    }}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <label className="upload-label">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="file-input"
                  />
                  <div className="upload-content">
                    <div className="upload-icon">📸</div>
                    <p>Click to upload image</p>
                  </div>
                </label>
              )}
            </div>
            
            <button 
              type="button"
              className="ai-generate-btn"
              onClick={() => setCurrentPage('image-generator')}
            >
              🎨 Generate with AI
            </button>
          </div>

          <div className="form-section">
            <div className="section-header">
              <h3>⏰ Schedule Time</h3>
              <span className="schedule-info">
                {formData.scheduled_time > new Date() 
                  ? `Will post ${getTimeFromNow(formData.scheduled_time)}`
                  : 'Please select a future time'
                }
              </span>
            </div>
            
            <div className="quick-schedule">
              <h4>Quick Options:</h4>
              <div className="quick-options">
                {quickScheduleOptions.map((option, index) => (
                  <button
                    key={index}
                    type="button"
                    className="quick-option"
                    onClick={() => setQuickSchedule(option)}
                  >
                    <span className="option-icon">{option.icon}</span>
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="custom-schedule">
              <h4>Custom Date & Time:</h4>
              <DatePicker
                selected={formData.scheduled_time}
                onChange={(date) => setFormData({...formData, scheduled_time: date})}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="MMMM d, yyyy h:mm aa"
                minDate={new Date()}
                className="datetime-picker"
                placeholderText="Select date and time"
              />
            </div>
          </div>

          <div className="form-section">
            <div className="section-header">
              <h3>🎯 Select Platforms</h3>
              <span className="selected-count">
                {formData.platform_ids.length} selected
              </span>
            </div>
            
            {accounts.length === 0 ? (
              <div className="no-accounts">
                <div className="no-accounts-icon">🔗</div>
                <h4>No accounts connected</h4>
                <p>Connect your social media accounts first</p>
                <button 
                  type="button"
                  className="connect-accounts-btn"
                  onClick={() => setCurrentPage('accounts')}
                >
                  Connect Accounts
                </button>
              </div>
            ) : (
              <div className="platforms-grid">
                {accounts.map(account => (
                  <div 
                    key={account.id}
                    className={`platform-card ${formData.platform_ids.includes(account.id) ? 'selected' : ''}`}
                    onClick={() => togglePlatform(account.id)}
                  >
                    <div className="platform-icon">
                      {getPlatformIcon(account.platform)}
                    </div>
                    <div className="platform-info">
                      <h4>{account.platform}</h4>
                      <p>@{account.username}</p>
                    </div>
                    <div className="platform-checkbox">
                      {formData.platform_ids.includes(account.id) ? '✅' : '⭕'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-actions">
            <button 
              type="button"
              className="cancel-btn"
              onClick={() => setCurrentPage('dashboard')}
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="schedule-btn"
              disabled={loading || formData.platform_ids.length === 0 || formData.scheduled_time <= new Date()}
            >
              {loading ? (
                <>
                  <span className="loading-spinner">🔄</span>
                  Scheduling...
                </>
              ) : (
                <>
                  ⏰ Schedule Post
                </>
              )}
            </button>
          </div>
        </form>

        <div className="schedule-preview">
          <h3>📅 Schedule Preview</h3>
          <div className="preview-card">
            <div className="schedule-info-card">
              <div className="schedule-icon">⏰</div>
              <div className="schedule-details">
                <h4>Scheduled for:</h4>
                <p className="schedule-date">
                  {formData.scheduled_time.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <p className="schedule-time">
                  {formData.scheduled_time.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
                <p className="schedule-relative">
                  {formData.scheduled_time > new Date() 
                    ? getTimeFromNow(formData.scheduled_time)
                    : 'Past time - please update'
                  }
                </p>
              </div>
            </div>
            
            <div className="platforms-preview">
              <h4>Will post to:</h4>
              <div className="selected-platforms">
                {formData.platform_ids.length === 0 ? (
                  <p className="no-platforms">No platforms selected</p>
                ) : (
                  accounts
                    .filter(acc => formData.platform_ids.includes(acc.id))
                    .map(acc => (
                      <div key={acc.id} className="platform-preview">
                        <span>{getPlatformIcon(acc.platform)}</span>
                        <span>{acc.platform}</span>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulePost;