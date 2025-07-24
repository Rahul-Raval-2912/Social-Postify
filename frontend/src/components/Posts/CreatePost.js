import React, { useState, useEffect } from 'react';
import { postsAPI, accountsAPI } from '../../services/api';
import { toast } from 'react-toastify';

const CreatePost = ({ onPostCreated, setCurrentPage }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: null,
    platform_ids: []
  });
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

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

    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('content', formData.content);
      
      if (formData.image) {
        submitData.append('image', formData.image);
      }
      
      formData.platform_ids.forEach(id => {
        submitData.append('platform_ids', id);
      });

      await postsAPI.create(submitData);
      toast.success('Post created successfully! 🎉');
      onPostCreated();
    } catch (error) {
      toast.error('Failed to create post');
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

  return (
    <div className="create-post-page">
      <div className="page-header">
        <button 
          className="back-btn"
          onClick={() => setCurrentPage('dashboard')}
        >
          ← Back
        </button>
        <div className="page-title">
          <h1>✍️ Create New Post</h1>
          <p>Share your content across multiple platforms instantly</p>
        </div>
      </div>

      <div className="create-post-container">
        <form onSubmit={handleSubmit} className="post-form">
          <div className="form-section">
            <div className="section-header">
              <h3>📝 Post Content</h3>
            </div>
            
            <div className="form-group">
              <label>Post Title *</label>
              <input
                type=\"text\"
                placeholder=\"Enter an engaging title...\"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className=\"form-input\"
                required
              />
            </div>

            <div className=\"form-group\">
              <label>Content *</label>
              <textarea
                placeholder=\"What's on your mind? Use # for hashtags...\"
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                className=\"form-textarea\"
                rows=\"6\"
                required
              />
              <div className=\"char-count\">
                {formData.content.length} characters
              </div>
            </div>
          </div>

          <div className=\"form-section\">
            <div className=\"section-header\">
              <h3>🖼️ Add Image</h3>
            </div>
            
            <div className=\"image-upload-area\">
              {imagePreview ? (
                <div className=\"image-preview\">
                  <img src={imagePreview} alt=\"Preview\" />
                  <button 
                    type=\"button\"
                    className=\"remove-image-btn\"
                    onClick={() => {
                      setImagePreview(null);
                      setFormData({...formData, image: null});
                    }}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <label className=\"upload-label\">
                  <input
                    type=\"file\"
                    accept=\"image/*\"
                    onChange={handleImageChange}
                    className=\"file-input\"
                  />
                  <div className=\"upload-content\">
                    <div className=\"upload-icon\">📸</div>
                    <p>Click to upload image</p>
                    <span>PNG, JPG up to 10MB</span>
                  </div>
                </label>
              )}
            </div>
            
            <div className=\"image-options\">
              <button 
                type=\"button\"
                className=\"ai-generate-btn\"
                onClick={() => setCurrentPage('image-generator')}
              >
                🎨 Generate with AI
              </button>
            </div>
          </div>

          <div className=\"form-section\">
            <div className=\"section-header\">
              <h3>🎯 Select Platforms</h3>
              <span className=\"selected-count\">
                {formData.platform_ids.length} selected
              </span>
            </div>
            
            {accounts.length === 0 ? (
              <div className=\"no-accounts\">
                <div className=\"no-accounts-icon\">🔗</div>
                <h4>No accounts connected</h4>
                <p>Connect your social media accounts first</p>
                <button 
                  type=\"button\"
                  className=\"connect-accounts-btn\"
                  onClick={() => setCurrentPage('accounts')}
                >
                  Connect Accounts
                </button>
              </div>
            ) : (
              <div className=\"platforms-grid\">
                {accounts.map(account => (
                  <div 
                    key={account.id}
                    className={`platform-card ${formData.platform_ids.includes(account.id) ? 'selected' : ''}`}
                    onClick={() => togglePlatform(account.id)}
                  >
                    <div className=\"platform-icon\">
                      {getPlatformIcon(account.platform)}
                    </div>
                    <div className=\"platform-info\">
                      <h4>{account.platform}</h4>
                      <p>@{account.username}</p>
                    </div>
                    <div className=\"platform-checkbox\">
                      {formData.platform_ids.includes(account.id) ? '✅' : '⭕'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className=\"form-actions\">
            <button 
              type=\"button\"
              className=\"cancel-btn\"
              onClick={() => setCurrentPage('dashboard')}
            >
              Cancel
            </button>
            <button 
              type=\"submit\"
              className=\"publish-btn\"
              disabled={loading || formData.platform_ids.length === 0}
            >
              {loading ? (
                <>
                  <span className=\"loading-spinner\">🔄</span>
                  Publishing...
                </>
              ) : (
                <>
                  🚀 Publish Now
                </>
              )}
            </button>
          </div>
        </form>

        <div className=\"post-preview\">
          <h3>📱 Preview</h3>
          <div className=\"preview-card\">
            <div className=\"preview-header\">
              <div className=\"preview-avatar\">👤</div>
              <div className=\"preview-user\">
                <h4>Your Account</h4>
                <span>Just now</span>
              </div>
            </div>
            
            <div className=\"preview-content\">
              <h4>{formData.title || 'Your post title...'}</h4>
              <p>{formData.content || 'Your content will appear here...'}</p>
              
              {imagePreview && (
                <div className=\"preview-image\">
                  <img src={imagePreview} alt=\"Preview\" />
                </div>
              )}
            </div>
            
            <div className=\"preview-actions\">
              <span>❤️ Like</span>
              <span>💬 Comment</span>
              <span>🔄 Share</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;