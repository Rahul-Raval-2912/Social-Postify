import React, { useState, useEffect } from 'react';
import { postsAPI, accountsAPI } from '../../services/api';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const PostForm = ({ onPostCreated, editPost, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: null,
    generated_image_prompt: '',
    platform_ids: [],
    scheduled_time: null
  });
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [generatedImageBase64, setGeneratedImageBase64] = useState('');

  useEffect(() => {
    fetchAccounts();
    if (editPost) {
      setFormData({
        ...editPost,
        platform_ids: editPost.platforms?.map(p => p.id) || [],
        scheduled_time: editPost.scheduled_time ? new Date(editPost.scheduled_time) : null
      });
    }
  }, [editPost]);

  const fetchAccounts = async () => {
    try {
      const response = await accountsAPI.getAll();
      setAccounts(response.data);
    } catch (error) {
      toast.error('Failed to fetch accounts');
    }
  };

  const generateImage = async () => {
    if (!formData.generated_image_prompt) {
      toast.error('Please enter an image prompt');
      return;
    }
    
    setGeneratingImage(true);
    try {
      const response = await postsAPI.generateImage(formData.generated_image_prompt);
      setGeneratedImageBase64(response.data.image_base64);
      toast.success('Image generated successfully!');
    } catch (error) {
      toast.error('Failed to generate image');
    } finally {
      setGeneratingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('content', formData.content);
      
      if (formData.image) {
        submitData.append('image', formData.image);
      } else if (generatedImageBase64) {
        // Convert base64 to blob
        const byteCharacters = atob(generatedImageBase64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/png' });
        submitData.append('image', blob, 'generated_image.png');
      }
      
      if (formData.generated_image_prompt) {
        submitData.append('generated_image_prompt', formData.generated_image_prompt);
      }
      
      if (formData.scheduled_time) {
        submitData.append('scheduled_time', formData.scheduled_time.toISOString());
      }
      
      formData.platform_ids.forEach(id => {
        submitData.append('platform_ids', id);
      });

      if (editPost) {
        await postsAPI.update(editPost.id, submitData);
        toast.success('Post updated successfully!');
      } else {
        await postsAPI.create(submitData);
        toast.success('Post created successfully!');
      }
      
      onPostCreated();
    } catch (error) {
      toast.error('Failed to save post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-form">
      <h3>{editPost ? 'Edit Post' : 'Create New Post'}</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Post Title"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          required
        />
        
        <textarea
          placeholder="Post Content (use # for hashtags)"
          value={formData.content}
          onChange={(e) => setFormData({...formData, content: e.target.value})}
          rows="4"
          required
        />

        <div className="image-section">
          <h4>Image Options</h4>
          
          <div className="image-upload">
            <label>Upload Image:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFormData({...formData, image: e.target.files[0]})}
            />
          </div>

          <div className="image-generate">
            <label>Or Generate Image:</label>
            <input
              type="text"
              placeholder="Describe the image you want to generate"
              value={formData.generated_image_prompt}
              onChange={(e) => setFormData({...formData, generated_image_prompt: e.target.value})}
            />
            <button type="button" onClick={generateImage} disabled={generatingImage}>
              {generatingImage ? 'Generating...' : 'Generate Image'}
            </button>
          </div>

          {generatedImageBase64 && (
            <div className="generated-image">
              <img 
                src={`data:image/png;base64,${generatedImageBase64}`} 
                alt="Generated" 
                style={{maxWidth: '200px', maxHeight: '200px'}}
              />
            </div>
          )}
        </div>

        <div className="platforms-section">
          <h4>Select Platforms:</h4>
          {accounts.map(account => (
            <label key={account.id} className="platform-checkbox">
              <input
                type="checkbox"
                checked={formData.platform_ids.includes(account.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFormData({
                      ...formData,
                      platform_ids: [...formData.platform_ids, account.id]
                    });
                  } else {
                    setFormData({
                      ...formData,
                      platform_ids: formData.platform_ids.filter(id => id !== account.id)
                    });
                  }
                }}
              />
              {account.platform} ({account.username})
            </label>
          ))}
        </div>

        <div className="schedule-section">
          <label>Schedule Post (optional):</label>
          <DatePicker
            selected={formData.scheduled_time}
            onChange={(date) => setFormData({...formData, scheduled_time: date})}
            showTimeSelect
            dateFormat="Pp"
            placeholderText="Select date and time"
          />
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? 'Saving...' : (editPost ? 'Update Post' : 'Create Post')}
          </button>
          {onCancel && (
            <button type="button" onClick={onCancel}>Cancel</button>
          )}
        </div>
      </form>
    </div>
  );
};

export default PostForm;