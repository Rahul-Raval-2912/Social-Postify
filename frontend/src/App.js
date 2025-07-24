import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import PostForm from './components/Posts/PostForm';
import PostsList from './components/Posts/PostsList';
import SocialAccounts from './components/Accounts/SocialAccounts';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('posts');
  const [showAuth, setShowAuth] = useState('login');
  const [editingPost, setEditingPost] = useState(null);
  const [showPostForm, setShowPostForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleLogin = (userId) => {
    setUser(userId);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('posts');
  };

  const handlePostCreated = () => {
    setShowPostForm(false);
    setEditingPost(null);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setShowPostForm(true);
  };

  if (!user) {
    return (
      <div className="App">
        <div className="auth-wrapper">
          {showAuth === 'login' ? (
            <Login 
              onLogin={handleLogin} 
              switchToRegister={() => setShowAuth('register')}
            />
          ) : (
            <Register 
              switchToLogin={() => setShowAuth('login')}
            />
          )}
        </div>
        <ToastContainer position="top-right" />
      </div>
    );
  }

  return (
    <div className="App">
      <header className="app-header">
        <h1>Social Postify</h1>
        <nav>
          <button 
            className={currentView === 'posts' ? 'active' : ''}
            onClick={() => setCurrentView('posts')}
          >
            Posts
          </button>
          <button 
            className={currentView === 'accounts' ? 'active' : ''}
            onClick={() => setCurrentView('accounts')}
          >
            Accounts
          </button>
          <button onClick={handleLogout}>Logout</button>
        </nav>
      </header>

      <main className="app-main">
        {currentView === 'posts' && (
          <div className="posts-section">
            <div className="posts-header">
              <h2>Posts Management</h2>
              <button 
                onClick={() => setShowPostForm(true)}
                className="create-btn"
              >
                Create New Post
              </button>
            </div>
            
            {showPostForm ? (
              <PostForm 
                onPostCreated={handlePostCreated}
                editPost={editingPost}
                onCancel={() => {
                  setShowPostForm(false);
                  setEditingPost(null);
                }}
              />
            ) : (
              <PostsList 
                onEdit={handleEditPost}
                refreshTrigger={refreshTrigger}
              />
            )}
          </div>
        )}

        {currentView === 'accounts' && <SocialAccounts />}
      </main>

      <ToastContainer position="top-right" />
    </div>
  );
}

export default App;
