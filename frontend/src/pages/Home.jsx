import React from 'react';
import { Link } from 'react-router-dom';
import '../pages/Home.css';

function Home() {
  return (
    <div className="home-container">
      {/* Header */}
      <header className="header">
        <h1 className="logo">Social Postify</h1>
        <nav className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/create" className="nav-link">Create Post</Link>
          <Link to="/schedule" className="nav-link">Schedule</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <h2 className="hero-title">
          Automate Your Social Media with <span className="highlight">AI & Scheduling</span>
        </h2>
        <p className="hero-subtitle">
          Generate stunning AI-powered marketing posts, schedule across platforms like Instagram, Telegram, WhatsApp, and Email.
        </p>
        <div className="hero-buttons">
          <Link to="/create" className="create-post-button">✨ Create Post</Link>
          <Link to="/dashboard">
            <button className="dashboard-button">View Dashboard</button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        {[
          { title: "🎯 Dashboard", desc: "Track engagement, post metrics and performance charts." },
          { title: "🧠 AI Post Generator", desc: "Turn text prompts into beautiful image posts using AI." },
          { title: "📅 Smart Scheduler", desc: "Auto-post to Instagram, WhatsApp, Telegram & more." },
          { title: "📊 Analytics", desc: "See which posts perform best, across clients and platforms." },
          { title: "🧑 Clients", desc: "Manage logos, templates, and brand settings per client." },
          { title: "💬 Captions & Themes", desc: "Auto-generate engaging captions using preset tones." },
        ].map((feature, idx) => (
          <div key={idx} className="feature-card">
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-desc">{feature.desc}</p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="footer">
        © {new Date().getFullYear()} Social Postify · Built with 💜 for creators and marketers.
      </footer>
    </div>
  );
}

export default Home;
