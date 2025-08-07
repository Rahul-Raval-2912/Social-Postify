import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Bell, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";

const Navbar = ({ user, onLogout }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  
  const handleLogout = () => {
    onLogout();
    toast({ title: "Logged out successfully", description: "See you soon!" });
  };
  
  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <nav className="glass-card border-b border-border/20 p-4">
      <div className="flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search posts, clients, analytics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 glass-surface border-border/30"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <Button 
            variant="ghost" 
            size="icon"
            className="relative hover:bg-secondary/50"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full animate-pulse"></span>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="flex items-center gap-2 hover:bg-secondary/50"
              >
                <div className="w-8 h-8 gradient-primary rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-medium">{user?.username || 'User'}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-card border-border/30">
              <DropdownMenuItem className="hover:bg-secondary/50" onClick={handleProfileClick}>
                <User className="w-4 h-4 mr-2" />
                Profile & Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-secondary/50">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border/30" />
              <DropdownMenuItem 
                className="hover:bg-destructive/20 text-destructive"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;