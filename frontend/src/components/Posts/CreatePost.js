import React, { useState } from 'react';
import { postsAPI } from '../../services/api';
import { toast } from 'react-toastify';

const CreatePost = ({ onPostCreated, setCurrentPage }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: null,
    useInstagram: false,
    instagramCredentials: { username: '', password: '' }
  });
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imagePrompt, setImagePrompt] = useState('');
  const [generatingImage, setGeneratingImage] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const generateImageInline = async () => {
    if (!imagePrompt.trim()) {
      toast.error('Please enter an image description');
      return;
    }

    setGeneratingImage(true);
    try {
      const response = await postsAPI.generateImage(imagePrompt);
      const imageBase64 = response.data.image_base64;
      
      // Convert base64 to blob
      const byteCharacters = atob(imageBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/png' });
      const file = new File([blob], 'generated-image.png', { type: 'image/png' });
      
      setFormData({ ...formData, image: file });
      setImagePreview(`data:image/png;base64,${imageBase64}`);
      setImagePrompt('');
      toast.success('Image generated successfully! 🎨');
    } catch (error) {
      toast.error('Failed to generate image');
    } finally {
      setGeneratingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content) {
      toast.error('Please fill in all required fields');
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

      // Publish directly
      const postResponse = await postsAPI.create(submitData);
      const postId = postResponse.data.id;
      
      // Prepare credentials for publishing
      const credentials = {};
      if (formData.useInstagram) {
        credentials.instagram = formData.instagramCredentials;
      }
      
      // Publish immediately
      await postsAPI.publish(postId, credentials);
      toast.success('Post published successfully! 🎉');
      onPostCreated();
    } catch (error) {
      toast.error('Failed to create post');
    } finally {
      setLoading(false);
    }
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
              <div className="char-count">
                {formData.content.length} characters
              </div>
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
                    <span>PNG, JPG up to 10MB</span>
                  </div>
                </label>
              )}
            </div>
            
            <div className="image-generation">
              <h4>🎨 Or Generate Image with AI</h4>
              <div className="inline-generation">
                <input
                  type="text"
                  placeholder="Describe the image you want to generate..."
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  className="form-input"
                />
                <button 
                  type="button"
                  className="generate-inline-btn"
                  onClick={generateImageInline}
                  disabled={generatingImage || !imagePrompt.trim()}
                >
                  {generatingImage ? (
                    <>
                      <span className="loading-spinner">🔄</span>
                      Generating...
                    </>
                  ) : (
                    '🎨 Generate'
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="section-header">
              <h3>📱 Publishing Options</h3>
            </div>
            
            <div className="platform-options">
              <div className="platform-option">
                <div className="platform-info">
                  <span className="platform-icon">📱</span>
                  <div>
                    <h4>Telegram</h4>
                    <p>Post to your Telegram channel</p>
                  </div>
                </div>
                <div className="platform-status enabled">✅ Enabled</div>
              </div>
              
              <div className="platform-option">
                <div className="platform-info">
                  <span className="platform-icon">📷</span>
                  <div>
                    <h4>Instagram</h4>
                    <p>Post to Instagram (credentials required)</p>
                  </div>
                </div>
                <label className="platform-toggle">
                  <input
                    type="checkbox"
                    checked={formData.useInstagram}
                    onChange={(e) => setFormData({...formData, useInstagram: e.target.checked})}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              
              {formData.useInstagram && (
                <div className="instagram-credentials">
                  <div className="credentials-notice">
                    <span className="security-icon">🔒</span>
                    <p>Your Instagram credentials are only used for posting and are not stored.</p>
                  </div>
                  <div className="credentials-inputs">
                    <input
                      type="text"
                      placeholder="Instagram Username"
                      value={formData.instagramCredentials.username}
                      onChange={(e) => setFormData({
                        ...formData,
                        instagramCredentials: {
                          ...formData.instagramCredentials,
                          username: e.target.value
                        }
                      })}
                      className="form-input"
                    />
                    <input
                      type="password"
                      placeholder="Instagram Password"
                      value={formData.instagramCredentials.password}
                      onChange={(e) => setFormData({
                        ...formData,
                        instagramCredentials: {
                          ...formData.instagramCredentials,
                          password: e.target.value
                        }
                      })}
                      className="form-input"
                    />
                  </div>
                </div>
              )}
            </div>
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
              className="publish-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading-spinner">🔄</span>
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

        <div className="post-preview">
          <h3>📱 Preview</h3>
          <div className="preview-card">
            <div className="preview-header">
              <div className="preview-avatar">👤</div>
              <div className="preview-user">
                <h4>Your Account</h4>
                <span>Just now</span>
              </div>
            </div>
            
            <div className="preview-content">
              <h4>{formData.title || 'Your post title...'}</h4>
              <p>{formData.content || 'Your content will appear here...'}</p>
              
              {imagePreview && (
                <div className="preview-image">
                  <img src={imagePreview} alt="Preview" />
                </div>
              )}
            </div>
            
            <div className="preview-actions">
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