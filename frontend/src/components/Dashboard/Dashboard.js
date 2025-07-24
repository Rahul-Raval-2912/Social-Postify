import React, { useState, useEffect } from 'react';
import { postsAPI, accountsAPI } from '../../services/api';
import { toast } from 'react-toastify';

const Dashboard = ({ setCurrentPage }) => {
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    scheduledPosts: 0,
    connectedAccounts: 0
  });
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [postsResponse, accountsResponse] = await Promise.all([
        postsAPI.getAll(),
        accountsAPI.getAll()
      ]);

      const posts = postsResponse.data;
      const accounts = accountsResponse.data;

      setStats({
        totalPosts: posts.length,
        publishedPosts: posts.filter(p => p.status === 'posted').length,
        scheduledPosts: posts.filter(p => p.status === 'scheduled').length,
        connectedAccounts: accounts.length
      });

      setRecentPosts(posts.slice(0, 5));
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Create Post',
      description: 'Write and publish instantly',
      icon: '✍️',
      color: '#4CAF50',
      action: () => setCurrentPage('create-post')
    },
    {
      title: 'Generate Image',
      description: 'AI-powered image creation',
      icon: '🎨',
      color: '#FF9800',
      action: () => setCurrentPage('image-generator')
    },
    {
      title: 'Schedule Post',
      description: 'Plan your content ahead',
      icon: '⏰',
      color: '#2196F3',
      action: () => setCurrentPage('schedule-post')
    },
    {
      title: 'Manage Accounts',
      description: 'Connect social platforms',
      icon: '🔗',
      color: '#9C27B0',
      action: () => setCurrentPage('accounts')
    }
  ];

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner">🔄</div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back! 👋</h1>
        <p>Here's what's happening with your social media</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>{stats.totalPosts}</h3>
            <p>Total Posts</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{stats.publishedPosts}</h3>
            <p>Published</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>{stats.scheduledPosts}</h3>
            <p>Scheduled</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🔗</div>
          <div className="stat-content">
            <h3>{stats.connectedAccounts}</h3>
            <p>Connected Accounts</p>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          {quickActions.map((action, index) => (
            <div 
              key={index} 
              className="action-card"
              onClick={action.action}
              style={{ borderLeft: `4px solid ${action.color}` }}
            >
              <div className="action-icon">{action.icon}</div>
              <div className="action-content">
                <h3>{action.title}</h3>
                <p>{action.description}</p>
              </div>
              <div className="action-arrow">→</div>
            </div>
          ))}
        </div>
      </div>

      <div className="recent-posts">
        <div className="section-header">
          <h2>Recent Posts</h2>
          <button 
            className="view-all-btn"
            onClick={() => setCurrentPage('posts')}
          >
            View All →
          </button>
        </div>
        
        {recentPosts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>No posts yet</h3>
            <p>Create your first post to get started!</p>
            <button 
              className="create-first-post-btn"
              onClick={() => setCurrentPage('create-post')}
            >
              Create First Post
            </button>
          </div>
        ) : (
          <div className="posts-preview">
            {recentPosts.map(post => (
              <div key={post.id} className="post-preview-card">
                <div className="post-preview-header">
                  <h4>{post.title}</h4>
                  <span className={`status-badge ${post.status}`}>
                    {post.status}
                  </span>
                </div>
                <p className="post-preview-content">
                  {post.content.substring(0, 100)}...
                </p>
                <div className="post-preview-footer">
                  <span className="post-date">
                    {new Date(post.created_at).toLocaleDateString()}
                  </span>
                  <div className="post-platforms">
                    {post.platforms.map(platform => (
                      <span key={platform.id} className="platform-badge">
                        {platform.platform}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;