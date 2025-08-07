import { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  Home, 
  BarChart3, 
  Users, 
  Plus, 
  Calendar, 
  History, 
  Settings, 
  HelpCircle,
  Menu,
  X,
  Sparkles
} from "lucide-react";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/dashboard", icon: BarChart3, label: "Dashboard" },
    { path: "/clients", icon: Users, label: "Clients" },
    { path: "/create", icon: Plus, label: "Create Post" },
    { path: "/schedule", icon: Calendar, label: "Schedule" },
    { path: "/history", icon: History, label: "Post History" },
    { path: "/help", icon: HelpCircle, label: "Help" },
  ];

  return (
    <div className={`glass-card transition-smooth border-r border-border/20 ${
      isCollapsed ? "w-16" : "w-64"
    } flex flex-col`}>
      {/* Header */}
      <div className="p-4 border-b border-border/20">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center glow-primary">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl bg-gradient-primary bg-clip-text text-transparent">
                Postify
              </span>
            </div>
          )}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-secondary/50 transition-smooth"
          >
            {isCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg transition-smooth ${
                    isActive 
                      ? "bg-primary/20 text-primary glow-primary" 
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                {!isCollapsed && <span className="font-medium">{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-border/20">
          <div className="glass-surface p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">
              ✨ AI-powered social media automation
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;