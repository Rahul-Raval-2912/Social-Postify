import React, { useState, useEffect } from 'react';
import { postsAPI } from '../../services/api';
import { toast } from 'react-toastify';

const PostsList = ({ refreshTrigger, setCurrentPage }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [publishingPost, setPublishingPost] = useState(null);
  const [instagramCredentials, setInstagramCredentials] = useState({
    username: '',
    password: ''
  });
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, [refreshTrigger]);

  const fetchPosts = async () => {
    try {
      const response = await postsAPI.getAll();
      setPosts(response.data);
    } catch (error) {
      toast.error('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (post) => {
    const hasInstagram = post.platforms.some(p => p.platform === 'instagram');
    
    if (hasInstagram) {
      setSelectedPost(post);
      setShowCredentialsModal(true);
      return;
    }
    
    await publishPost(post, {});
  };

  const publishPost = async (post, credentials) => {
    setPublishingPost(post.id);
    try {
      await postsAPI.publish(post.id, credentials);
      toast.success('Post published successfully!');
      fetchPosts(); // Refresh to get updated status
    } catch (error) {
      toast.error('Failed to publish post');
    } finally {
      setPublishingPost(null);
      setShowCredentialsModal(false);
      setInstagramCredentials({ username: '', password: '' });
    }
  };

  const handleCredentialsSubmit = () => {
    if (!instagramCredentials.username || !instagramCredentials.password) {
      toast.error('Please enter Instagram credentials');
      return;
    }
    publishPost(selectedPost, { instagram: instagramCredentials });
  };

  const deletePost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await postsAPI.delete(postId);
        toast.success('Post deleted successfully!');
        fetchPosts();
      } catch (error) {
        toast.error('Failed to delete post');
      }
    }
  };

  if (loading) return <div>Loading posts...</div>;

  return (
    <div className="posts-list-page">
      <div className="page-header">
        <button 
          className="back-btn"
          onClick={() => setCurrentPage('dashboard')}
        >
          ← Back
        </button>
        <div className="page-title">
          <h1>📝 My Posts</h1>
          <p>Manage all your social media content</p>
        </div>
        <button 
          className="create-post-btn"
          onClick={() => setCurrentPage('create-post')}
        >
          ✍️ Create New Post
        </button>
      </div>

      {posts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>No posts yet</h3>
          <p>Create your first post to get started!</p>
          <button 
            className="create-first-post-btn"
            onClick={() => setCurrentPage('create-post')}
          >
            ✍️ Create First Post
          </button>
        </div>
      ) : (
        <div className="posts-grid">
          {posts.map(post => (
            <div key={post.id} className="modern-post-card">
              <div className="post-card-header">
                <h4>{post.title}</h4>
                <span className={`modern-status-badge ${post.status}`}>
                  {post.status === 'posted' && '✅'}
                  {post.status === 'scheduled' && '⏰'}
                  {post.status === 'draft' && '📝'}
                  {post.status === 'failed' && '❌'}
                  {post.status}
                </span>
              </div>
              
              <div className="post-card-content">
                <p>{post.content.substring(0, 150)}{post.content.length > 150 ? '...' : ''}</p>
                
                {post.image && (
                  <div className="post-card-image">
                    <img src={post.image} alt="Post" />
                  </div>
                )}
                
                <div className="post-card-platforms">
                  {post.platforms.map(platform => (
                    <span key={platform.id} className="modern-platform-tag">
                      {platform.platform === 'telegram' && '📱'}
                      {platform.platform === 'instagram' && '📷'}
                      {platform.platform === 'facebook' && '👥'}
                      {platform.platform === 'whatsapp' && '💬'}
                      {platform.platform}
                    </span>
                  ))}
                </div>
                
                <div className="post-card-meta">
                  <span className="post-date">
                    📅 {new Date(post.created_at).toLocaleDateString()}
                  </span>
                  {post.scheduled_time && (
                    <span className="scheduled-time">
                      ⏰ {new Date(post.scheduled_time).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="post-card-actions">
                {post.status === 'draft' && (
                  <button 
                    className="publish-now-btn"
                    onClick={() => handlePublish(post)}
                    disabled={publishingPost === post.id}
                  >
                    {publishingPost === post.id ? (
                      <>
                        <span className="loading-spinner">🔄</span>
                        Publishing...
                      </>
                    ) : (
                      '🚀 Publish Now'
                    )}
                  </button>
                )}
                
                <button 
                  className="delete-post-btn"
                  onClick={() => deletePost(post.id)}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Instagram Credentials Modal */}
      {showCredentialsModal && (
        <div className="modal-overlay">
          <div className="modern-modal">
            <div className="modal-header">
              <h3>📷 Instagram Login Required</h3>
              <button 
                className="modal-close"
                onClick={() => setShowCredentialsModal(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-content">
              <div className="security-notice">
                <div className="security-icon">🔒</div>
                <p>Your Instagram credentials are needed for posting. <strong>They will not be stored</strong> for your security.</p>
              </div>
              
              <div className="credentials-form">
                <input
                  type="text"
                  placeholder="👤 Instagram Username"
                  value={instagramCredentials.username}
                  onChange={(e) => setInstagramCredentials({
                    ...instagramCredentials,
                    username: e.target.value
                  })}
                  className="form-input"
                />
                
                <input
                  type="password"
                  placeholder="🔒 Instagram Password"
                  value={instagramCredentials.password}
                  onChange={(e) => setInstagramCredentials({
                    ...instagramCredentials,
                    password: e.target.value
                  })}
                  className="form-input"
                />
              </div>
            </div>
            
            <div className="modal-actions">
              <button 
                className="modal-cancel-btn"
                onClick={() => setShowCredentialsModal(false)}
              >
                Cancel
              </button>
              <button 
                className="modal-publish-btn"
                onClick={handleCredentialsSubmit}
                disabled={!instagramCredentials.username || !instagramCredentials.password}
              >
                🚀 Publish to Instagram
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostsList;