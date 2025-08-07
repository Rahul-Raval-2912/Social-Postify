import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User, Bell, Smartphone, Mail, Link, Shield } from "lucide-react";

const Settings = () => {
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john@example.com",
    company: "Digital Marketing Agency"
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    weeklyReports: true
  });

  const [connections, setConnections] = useState({
    instagram: false,
    whatsapp: false,
    telegram: false,
    email: true
  });

  const handleProfileUpdate = () => {
    console.log("Profile updated:", profile);
  };

  const handleNotificationChange = (key, value) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const handleConnectionToggle = (platform) => {
    setConnections(prev => ({ ...prev, [platform]: !prev[platform] }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences and platform connections
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Profile Settings */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Profile Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  className="glass-surface border-border/30"
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                  className="glass-surface border-border/30"
                />
              </div>
              
              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={profile.company}
                  onChange={(e) => setProfile({...profile, company: e.target.value})}
                  className="glass-surface border-border/30"
                />
              </div>
              
              <Button onClick={handleProfileUpdate} className="btn-gradient">
                Update Profile
              </Button>
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-accent" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Get notified about post performance</p>
                  </div>
                </div>
                <Switch
                  checked={notifications.emailNotifications}
                  onCheckedChange={(checked) => handleNotificationChange('emailNotifications', checked)}
                />
              </div>

              <Separator className="bg-border/30" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">SMS Notifications</p>
                    <p className="text-sm text-muted-foreground">Critical alerts via text</p>
                  </div>
                </div>
                <Switch
                  checked={notifications.smsNotifications}
                  onCheckedChange={(checked) => handleNotificationChange('smsNotifications', checked)}
                />
              </div>

              <Separator className="bg-border/30" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Push Notifications</p>
                    <p className="text-sm text-muted-foreground">Real-time browser notifications</p>
                  </div>
                </div>
                <Switch
                  checked={notifications.pushNotifications}
                  onCheckedChange={(checked) => handleNotificationChange('pushNotifications', checked)}
                />
              </div>

              <Separator className="bg-border/30" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Weekly Reports</p>
                    <p className="text-sm text-muted-foreground">Summary of your social media performance</p>
                  </div>
                </div>
                <Switch
                  checked={notifications.weeklyReports}
                  onCheckedChange={(checked) => handleNotificationChange('weeklyReports', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Platform Connections */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="w-5 h-5 text-primary" />
                Platform Connections
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-pink-500/20 rounded-full flex items-center justify-center">
                    <span className="text-pink-400 text-sm font-bold">IG</span>
                  </div>
                  <div>
                    <p className="font-medium">Instagram</p>
                    <p className="text-sm text-muted-foreground">
                      {connections.instagram ? "Connected" : "Not connected"}
                    </p>
                  </div>
                </div>
                <Button
                  variant={connections.instagram ? "destructive" : "default"}
                  size="sm"
                  onClick={() => handleConnectionToggle('instagram')}
                  className={connections.instagram ? "" : "btn-gradient"}
                >
                  {connections.instagram ? "Disconnect" : "Connect"}
                </Button>
              </div>

              <Separator className="bg-border/30" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                    <span className="text-green-400 text-sm font-bold">WA</span>
                  </div>
                  <div>
                    <p className="font-medium">WhatsApp Business</p>
                    <p className="text-sm text-muted-foreground">
                      {connections.whatsapp ? "Connected" : "Not connected"}
                    </p>
                  </div>
                </div>
                <Button
                  variant={connections.whatsapp ? "destructive" : "default"}
                  size="sm"
                  onClick={() => handleConnectionToggle('whatsapp')}
                  className={connections.whatsapp ? "" : "btn-gradient"}
                >
                  {connections.whatsapp ? "Disconnect" : "Connect"}
                </Button>
              </div>

              <Separator className="bg-border/30" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <span className="text-blue-400 text-sm font-bold">TG</span>
                  </div>
                  <div>
                    <p className="font-medium">Telegram</p>
                    <p className="text-sm text-muted-foreground">
                      {connections.telegram ? "Connected" : "Not connected"}
                    </p>
                  </div>
                </div>
                <Button
                  variant={connections.telegram ? "destructive" : "default"}
                  size="sm"
                  onClick={() => handleConnectionToggle('telegram')}
                  className={connections.telegram ? "" : "btn-gradient"}
                >
                  {connections.telegram ? "Disconnect" : "Connect"}
                </Button>
              </div>

              <Separator className="bg-border/30" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="font-medium">Email Marketing</p>
                    <p className="text-sm text-muted-foreground">
                      {connections.email ? "Connected" : "Not connected"}
                    </p>
                  </div>
                </div>
                <Button
                  variant={connections.email ? "destructive" : "default"}
                  size="sm"
                  onClick={() => handleConnectionToggle('email')}
                  className={connections.email ? "" : "btn-gradient"}
                >
                  {connections.email ? "Disconnect" : "Connect"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-accent" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full btn-glass">
                Change Password
              </Button>
              <Button variant="outline" className="w-full btn-glass">
                Enable Two-Factor Authentication
              </Button>
              <Button variant="outline" className="w-full btn-glass">
                Download Account Data
              </Button>
              <Button variant="destructive" className="w-full">
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;