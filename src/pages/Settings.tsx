
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/context/ThemeContext';
import { Label } from '@/components/ui/label';
import { Bell, Lock, User, Moon, Sun, Monitor, LogOut, Settings2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { auth, logoutUser } from '@/lib/firebase';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      await logoutUser();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate('/login');
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <>
      <Navbar />
      
      <main className="min-h-screen py-24 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2 slide-in-bottom">Settings</h1>
            <p className="text-muted-foreground slide-in-bottom delay-100">Customize your app preferences and account settings</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <Card className="sticky top-24 border-2 slide-in-bottom delay-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings2 className="h-5 w-5 text-primary" />
                    Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Tabs defaultValue="account" orientation="vertical" className="w-full">
                    <TabsList className="flex flex-col items-stretch h-auto bg-transparent border-r p-0">
                      <TabsTrigger value="account" className="justify-start py-2 px-4 data-[state=active]:border-r-2 border-primary data-[state=active]:bg-accent/50 rounded-none">
                        <User className="h-4 w-4 mr-2" />
                        Account
                      </TabsTrigger>
                      <TabsTrigger value="appearance" className="justify-start py-2 px-4 data-[state=active]:border-r-2 border-primary data-[state=active]:bg-accent/50 rounded-none">
                        <Sun className="h-4 w-4 mr-2" />
                        Appearance
                      </TabsTrigger>
                      <TabsTrigger value="notifications" className="justify-start py-2 px-4 data-[state=active]:border-r-2 border-primary data-[state=active]:bg-accent/50 rounded-none">
                        <Bell className="h-4 w-4 mr-2" />
                        Notifications
                      </TabsTrigger>
                      <TabsTrigger value="security" className="justify-start py-2 px-4 data-[state=active]:border-r-2 border-primary data-[state=active]:bg-accent/50 rounded-none">
                        <Lock className="h-4 w-4 mr-2" />
                        Security
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-2 space-y-8 slide-in-bottom delay-300">
              <Tabs defaultValue="account">
                <TabsContent value="account" className="space-y-6 mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Information</CardTitle>
                      <CardDescription>Manage your profile information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm font-medium">Email</p>
                        <p className="text-muted-foreground">{auth.currentUser?.email || 'Not available'}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium">Display Name</p>
                        <p className="text-muted-foreground">{auth.currentUser?.displayName || 'Not set'}</p>
                      </div>
                      
                      <div className="flex justify-between">
                        <Button variant="outline" onClick={() => navigate('/profile')}>Edit Profile</Button>
                        <Button variant="destructive" onClick={handleLogout} className="flex items-center gap-2">
                          <LogOut className="h-4 w-4" />
                          Logout
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="appearance" className="space-y-6 mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Appearance</CardTitle>
                      <CardDescription>Customize the look and feel of the application</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-medium">Theme</h3>
                          <p className="text-sm text-muted-foreground">Select your preferred color theme</p>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4">
                          <div 
                            className={`p-4 rounded-lg border-2 flex flex-col items-center justify-center gap-2 cursor-pointer ${theme === 'light' ? 'border-primary' : 'border-muted hover:border-input'}`}
                            onClick={() => setTheme('light')}
                          >
                            <div className="w-8 h-8 rounded-full bg-[#FFFFFF] border flex items-center justify-center">
                              <Sun className="h-4 w-4 text-amber-500" />
                            </div>
                            <span className="text-sm">Light</span>
                          </div>
                          
                          <div 
                            className={`p-4 rounded-lg border-2 flex flex-col items-center justify-center gap-2 cursor-pointer ${theme === 'dark' ? 'border-primary' : 'border-muted hover:border-input'}`}
                            onClick={() => setTheme('dark')}
                          >
                            <div className="w-8 h-8 rounded-full bg-[#121212] border flex items-center justify-center">
                              <Moon className="h-4 w-4 text-slate-300" />
                            </div>
                            <span className="text-sm">Dark</span>
                          </div>
                          
                          <div 
                            className={`p-4 rounded-lg border-2 flex flex-col items-center justify-center gap-2 cursor-pointer ${theme === 'system' ? 'border-primary' : 'border-muted hover:border-input'}`}
                            onClick={() => setTheme('system')}
                          >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FFFFFF] to-[#121212] border flex items-center justify-center">
                              <Monitor className="h-4 w-4" />
                            </div>
                            <span className="text-sm">System</span>
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-medium">Animation Preferences</h3>
                          <p className="text-sm text-muted-foreground">Control the animation effects across the app</p>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="animations">Enable animations</Label>
                            <Switch id="animations" defaultChecked />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <Label htmlFor="reducedMotion">Reduced motion</Label>
                            <Switch id="reducedMotion" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="notifications" className="space-y-6 mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Notifications</CardTitle>
                      <CardDescription>Manage your notification preferences</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Email Notifications</p>
                            <p className="text-sm text-muted-foreground">Receive email updates about your events</p>
                          </div>
                          <Switch id="email-notifications" defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Event Reminders</p>
                            <p className="text-sm text-muted-foreground">Get notifications before your events</p>
                          </div>
                          <Switch id="event-reminders" defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Marketing Updates</p>
                            <p className="text-sm text-muted-foreground">Receive news and special offers</p>
                          </div>
                          <Switch id="marketing" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="security" className="space-y-6 mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Security Settings</CardTitle>
                      <CardDescription>Manage your password and security preferences</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button variant="outline">Change Password</Button>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Two-Factor Authentication</p>
                          <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                        </div>
                        <Switch id="2fa" />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default Settings;
