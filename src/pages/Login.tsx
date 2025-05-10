
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { signInWithEmail, signInWithGoogle } from '@/lib/firebase';
import { FirebaseError } from 'firebase/app';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { motion } from 'framer-motion';
import { User, Mail, Lock } from 'lucide-react';

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmail(email, password);
      const user = userCredential.user;
      
      // Fetch user data to determine role
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });
        
        // Redirect based on role
        switch (userData.role) {
          case 'admin':
            navigate('/admin');
            break;
          case 'vendor':
            navigate('/vendor');
            break;
          default:
            navigate('/dashboard');
        }
      } else {
        // If no user document exists, create a basic one and redirect to dashboard
        navigate('/dashboard');
      }
    } catch (error) {
      console.error("Login error:", error);
      let errorMessage = "Failed to log in. Please check your credentials and try again.";
      
      if (error instanceof FirebaseError) {
        switch(error.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
            errorMessage = "Invalid email or password.";
            break;
          case 'auth/too-many-requests':
            errorMessage = "Too many failed login attempts. Please try again later.";
            break;
          case 'auth/user-disabled':
            errorMessage = "This account has been disabled.";
            break;
        }
      }
      
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    
    try {
      const result = await signInWithGoogle();
      
      // Check if this user exists in our database
      const userDoc = await getDoc(doc(db, "users", result.user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        // Redirect based on role
        switch (userData.role) {
          case 'admin':
            navigate('/admin');
            break;
          case 'vendor':
            navigate('/vendor');
            break;
          default:
            navigate('/dashboard');
        }
      } else {
        // If this is a first-time Google sign in, create a user document
        navigate('/dashboard');
      }
      
      toast({
        title: "Success!",
        description: "You have successfully logged in with Google.",
      });
    } catch (error) {
      console.error("Google login error:", error);
      toast({
        title: "Login Failed",
        description: "Failed to log in with Google. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen flex items-center justify-center px-6 py-24 bg-gradient-to-b from-background to-background/80">
        <motion.div 
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="border-2 shadow-lg">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-3xl font-display font-bold bg-gradient-to-r from-primary to-purple-500 text-transparent bg-clip-text">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Sign in to continue planning your celebrations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    Email
                  </Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="example@email.com" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="transition-all focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-muted-foreground" />
                      Password
                    </Label>
                    <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input 
                    id="password" 
                    type="password" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="transition-all focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full transition-all hover:shadow-md" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="mr-2">Signing in</span>
                      <span className="loading loading-spinner loading-xs"></span>
                    </>
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <Button 
                variant="outline" 
                onClick={handleGoogleLogin} 
                disabled={isLoading} 
                className="w-full transition-all hover:border-primary/50"
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Sign in with Google
              </Button>
            </CardContent>
            <CardFooter className="flex flex-col items-center justify-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/signup" className="text-primary font-medium hover:underline">
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </main>

      <Footer />
    </>
  );
};

export default Login;
