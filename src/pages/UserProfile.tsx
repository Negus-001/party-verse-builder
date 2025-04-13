
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarDays, Clock, User, Camera, ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { auth } from '@/lib/firebase';
import { useNavigate } from 'react-router-dom';
import { updateProfile } from 'firebase/auth';

const UserProfile = () => {
  const [displayName, setDisplayName] = useState(auth.currentUser?.displayName || '');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleSaveProfile = async () => {
    if (!auth.currentUser) return;
    
    setIsLoading(true);
    try {
      await updateProfile(auth.currentUser, {
        displayName: displayName
      });
      
      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const getInitials = () => {
    if (displayName) {
      return displayName.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    return auth.currentUser?.email?.substring(0, 2).toUpperCase() || 'U';
  };

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen py-24 px-6">
        <div className="container mx-auto max-w-3xl">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/settings')}
            className="mb-6 hover:bg-background group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Settings
          </Button>
          
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2 slide-in-bottom">Your Profile</h1>
            <p className="text-muted-foreground slide-in-bottom delay-100">Manage your personal information</p>
          </div>
          
          <div className="space-y-8">
            <Card className="overflow-hidden slide-in-bottom delay-200">
              <div className="h-32 bg-gradient-to-r from-primary/30 to-secondary/30"></div>
              <CardContent className="pt-0 -mt-16">
                <div className="flex flex-col items-center sm:flex-row sm:items-end sm:justify-between">
                  <div className="flex flex-col items-center sm:flex-row sm:items-end mb-4 sm:mb-0">
                    <div className="relative">
                      <Avatar className="w-24 h-24 border-4 border-background">
                        <AvatarImage src={auth.currentUser?.photoURL || ''} />
                        <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                          {getInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 rounded-full w-8 h-8">
                        <Camera className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-4 text-center sm:text-left">
                      <h2 className="text-xl font-semibold">{displayName || 'User'}</h2>
                      <p className="text-sm text-muted-foreground">{auth.currentUser?.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col text-center sm:text-right">
                    <div className="flex items-center text-sm text-muted-foreground justify-center sm:justify-end">
                      <CalendarDays className="h-4 w-4 mr-1" />
                      <span>Joined April 2025</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground justify-center sm:justify-end">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>Last active today</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="slide-in-bottom delay-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Personal Information
                </CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="displayName">Display Name</Label>
                      <Input 
                        id="displayName" 
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Your display name"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email"
                        value={auth.currentUser?.email || ''}
                        disabled
                      />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-end">
                  <Button onClick={handleSaveProfile} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default UserProfile;
