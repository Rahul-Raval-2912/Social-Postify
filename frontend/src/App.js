import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import CreatePost from './components/Posts/CreatePost';
import ImageGenerator from './components/ImageGenerator/ImageGenerator';
import SchedulePost from './components/Posts/SchedulePost';
import PostsList from './components/Posts/PostsList';
import SocialAccounts from './components/Accounts/SocialAccounts';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showAuth, setShowAuth] = useState('login');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleLogin = (userId) => {
    setUser(userId);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('dashboard');
  };

  const handlePostCreated = () => {
    setRefreshTrigger(prev => prev + 1);
    setCurrentPage('posts');
  };

  if (!user) {
    return (
      <div className="App">
        <div className="auth-wrapper">
          <div className="auth-container">
            <div className="auth-header">
              <div className="logo">
                <span className="logo-icon">🚀</span>
                <h1>Social Postify</h1>
              </div>
              <p>Manage all your social media in one place</p>
            </div>
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
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    );
  }

  const renderPage = () => {
    switch(currentPage) {
      case 'dashboard':
        return <Dashboard setCurrentPage={setCurrentPage} />;
      case 'create-post':
        return <CreatePost onPostCreated={handlePostCreated} setCurrentPage={setCurrentPage} />;
      case 'image-generator':
        return <ImageGenerator setCurrentPage={setCurrentPage} />;
      case 'schedule-post':
        return <SchedulePost onPostCreated={handlePostCreated} setCurrentPage={setCurrentPage} />;
      case 'posts':
        return <PostsList refreshTrigger={refreshTrigger} setCurrentPage={setCurrentPage} />;
      case 'accounts':
        return <SocialAccounts setCurrentPage={setCurrentPage} />;
      default:
        return <Dashboard setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="App">
      <nav className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">🚀</span>
            <h2>Social Postify</h2>
          </div>
        </div>
        
        <div className="nav-menu">
          <button 
            className={`nav-item ${currentPage === 'dashboard' ? 'active' : ''}`}
            onClick={() => setCurrentPage('dashboard')}
          >
            <span className="nav-icon">📊</span>
            Dashboard
          </button>
          
          <button 
            className={`nav-item ${currentPage === 'create-post' ? 'active' : ''}`}
            onClick={() => setCurrentPage('create-post')}
          >
            <span className="nav-icon">✍️</span>
            Create Post
          </button>
          
          <button 
            className={`nav-item ${currentPage === 'image-generator' ? 'active' : ''}`}
            onClick={() => setCurrentPage('image-generator')}
          >
            <span className="nav-icon">🎨</span>
            AI Images
          </button>
          
          <button 
            className={`nav-item ${currentPage === 'schedule-post' ? 'active' : ''}`}
            onClick={() => setCurrentPage('schedule-post')}
          >
            <span className="nav-icon">⏰</span>
            Schedule
          </button>
          
          <button 
            className={`nav-item ${currentPage === 'posts' ? 'active' : ''}`}
            onClick={() => setCurrentPage('posts')}
          >
            <span className="nav-icon">📝</span>
            My Posts
          </button>
          
          <button 
            className={`nav-item ${currentPage === 'accounts' ? 'active' : ''}`}
            onClick={() => setCurrentPage('accounts')}
          >
            <span className="nav-icon">🔗</span>
            Accounts
          </button>
        </div>
        
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            Logout
          </button>
        </div>
      </nav>

      <main className="main-content">
        {renderPage()}
      </main>

      <ToastContainer 
        position="top-right" 
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;
