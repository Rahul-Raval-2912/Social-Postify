import React, { useState, useEffect } from 'react';
import { postsAPI } from '../../services/api';
import { toast } from 'react-toastify';

const PostsList = ({ onEdit, refreshTrigger }) => {
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
      const response = await postsAPI.publish(post.id, credentials);
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
    <div className="posts-list">
      <h3>Your Posts</h3>
      {posts.length === 0 ? (
        <p>No posts yet. Create your first post!</p>
      ) : (
        posts.map(post => (
          <div key={post.id} className="post-card">
            <div className="post-header">
              <h4>{post.title}</h4>
              <span className={`status ${post.status}`}>{post.status}</span>
            </div>
            
            <p>{post.content}</p>
            
            {post.image && (
              <img 
                src={post.image} 
                alt="Post" 
                className="post-image"
              />
            )}
            
            <div className="post-platforms">
              <strong>Platforms:</strong>
              {post.platforms.map(platform => (
                <span key={platform.id} className="platform-tag">
                  {platform.platform}
                </span>
              ))}
            </div>
            
            {post.scheduled_time && (
              <p><strong>Scheduled:</strong> {new Date(post.scheduled_time).toLocaleString()}</p>
            )}
            
            <div className="post-actions">
              <button onClick={() => onEdit(post)}>Edit</button>
              
              {post.status === 'draft' && (
                <button 
                  onClick={() => handlePublish(post)}
                  disabled={publishingPost === post.id}
                >
                  {publishingPost === post.id ? 'Publishing...' : 'Publish Now'}
                </button>
              )}
              
              <button 
                onClick={() => deletePost(post.id)}
                className="delete-btn"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}

      {/* Instagram Credentials Modal */}
      {showCredentialsModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Instagram Login Required</h3>
            <p>Your Instagram credentials are needed for posting. They will not be stored.</p>
            
            <input
              type="text"
              placeholder="Instagram Username"
              value={instagramCredentials.username}
              onChange={(e) => setInstagramCredentials({
                ...instagramCredentials,
                username: e.target.value
              })}
            />
            
            <input
              type="password"
              placeholder="Instagram Password"
              value={instagramCredentials.password}
              onChange={(e) => setInstagramCredentials({
                ...instagramCredentials,
                password: e.target.value
              })}
            />
            
            <div className="modal-actions">
              <button onClick={handleCredentialsSubmit}>Publish</button>
              <button onClick={() => setShowCredentialsModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostsList;