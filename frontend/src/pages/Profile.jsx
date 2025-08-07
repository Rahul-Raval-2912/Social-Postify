import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import apiService from '../services/api.js';

const Profile = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    toast({ title: `Switched to ${newTheme} theme!` });
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      await apiService.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      
      toast({ title: "Password changed successfully!" });
      setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
    } catch (error) {
      toast({ title: "Failed to change password", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
        Profile Settings
      </h1>
      
      <Tabs defaultValue="profile">
        <TabsList style={{ display: 'flex', marginBottom: '20px' }}>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ marginBottom: '15px' }}>
                <Label>Username</Label>
                <Input 
                  value={formData.username} 
                  onChange={(e) => setFormData(prev => ({...prev, username: e.target.value}))} 
                  style={{ marginTop: '5px' }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <Label>Email</Label>
                <Input 
                  type="email"
                  value={formData.email} 
                  onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))} 
                  style={{ marginTop: '5px' }}
                />
              </div>
              <Button>Update Profile</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange}>
                <div style={{ marginBottom: '15px' }}>
                  <Label>Current Password</Label>
                  <Input 
                    type="password" 
                    value={formData.currentPassword} 
                    onChange={(e) => setFormData(prev => ({...prev, currentPassword: e.target.value}))} 
                    style={{ marginTop: '5px' }}
                    required
                  />
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <Label>New Password</Label>
                  <Input 
                    type="password" 
                    value={formData.newPassword} 
                    onChange={(e) => setFormData(prev => ({...prev, newPassword: e.target.value}))} 
                    style={{ marginTop: '5px' }}
                    required
                  />
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <Label>Confirm Password</Label>
                  <Input 
                    type="password" 
                    value={formData.confirmPassword} 
                    onChange={(e) => setFormData(prev => ({...prev, confirmPassword: e.target.value}))} 
                    style={{ marginTop: '5px' }}
                    required
                  />
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Changing...' : 'Change Password'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="coming-soon-banner" style={{ 
                backgroundColor: '#ffffff', 
                color: '#374151', 
                padding: '12px', 
                borderRadius: '8px', 
                marginBottom: '20px',
                textAlign: 'center',
                fontWeight: 'bold',
                border: '1px solid #d1d5db',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}>
                🚧 Coming Soon - Notification features are under development
              </div>
              <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.5 }}>
                <div>
                  <h4>Post Success Notifications</h4>
                  <p style={{ fontSize: '14px', color: '#666' }}>Get notified when posts are published</p>
                </div>
                <Button variant="outline" size="sm" disabled>Enable</Button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.5 }}>
                <div>
                  <h4>Error Notifications</h4>
                  <p style={{ fontSize: '14px', color: '#666' }}>Get notified when posts fail</p>
                </div>
                <Button variant="outline" size="sm" disabled>Enable</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
            </CardHeader>
            <CardContent>
              <h4 style={{ marginBottom: '10px' }}>Theme</h4>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Button 
                  variant={theme === 'dark' ? 'default' : 'outline'} 
                  style={{ height: '60px', flex: 1 }}
                  onClick={() => handleThemeChange('dark')}
                >
                  Dark {theme === 'dark' && '(Current)'}
                </Button>
                <Button 
                  variant={theme === 'white' ? 'default' : 'outline'} 
                  style={{ height: '60px', flex: 1 }}
                  onClick={() => handleThemeChange('white')}
                >
                  White {theme === 'white' && '(Current)'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;