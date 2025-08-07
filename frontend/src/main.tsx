import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import './styles/themes.css'

// Set initial theme
document.documentElement.setAttribute('data-theme', localStorage.getItem('theme') || 'dark');

createRoot(document.getElementById("root")!).render(<App />);
