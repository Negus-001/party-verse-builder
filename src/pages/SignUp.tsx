
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
import { signUpWithEmail, signInWithGoogle } from '@/lib/firebase';
import { FirebaseError } from 'firebase/app';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { UserRole } from '@/context/AuthContext';
import { MultiStepProgress } from '@/components/ui/multi-step-progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { motion } from 'framer-motion';
import { User, Settings, Calendar, ChevronRight, ChevronLeft, CheckCircle, Mail, Building } from 'lucide-react';

enum SignUpStep {
  AccountDetails,
  Role,
  VendorDetails,
  Complete
}

const roleOptions = [
  { 
    id: 'user', 
    title: 'User', 
    description: 'Plan and manage your personal events',
    icon: <Calendar className="h-8 w-8 text-blue-500" />
  },
  { 
    id: 'vendor', 
    title: 'Vendor', 
    description: 'Offer services for events',
    icon: <Building className="h-8 w-8 text-green-500" />
  }
];

const SignUp = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [step, setStep] = useState<SignUpStep>(SignUpStep.AccountDetails);
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<UserRole>('user');
  
  // Vendor specific fields
  const [businessName, setBusinessName] = useState('');
  const [vendorServices, setVendorServices] = useState<string[]>([]);
  const [phone, setPhone] = useState('');
  
  const serviceOptions = [
    { id: 'catering', label: 'Catering' },
    { id: 'photography', label: 'Photography' },
    { id: 'venue', label: 'Venue' },
    { id: 'decoration', label: 'Decoration' },
    { id: 'entertainment', label: 'Entertainment' },
    { id: 'transportation', label: 'Transportation' },
    { id: 'wedding', label: 'Wedding Planning' },
    { id: 'birthday', label: 'Birthday Planning' }
  ];
  
  const handleNextStep = () => {
    if (step === SignUpStep.AccountDetails) {
      // Validate
      if (!email || !password || !confirmPassword || !displayName) {
        toast({
          title: "Missing Information",
          description: "Please fill in all fields.",
          variant: "destructive"
        });
        return;
      }
      
      if (password !== confirmPassword) {
        toast({
          title: "Passwords Don't Match",
          description: "Please make sure your passwords match.",
          variant: "destructive"
        });
        return;
      }
      
      setStep(SignUpStep.Role);
    } else if (step === SignUpStep.Role) {
      if (role === 'vendor') {
        setStep(SignUpStep.VendorDetails);
      } else {
        handleSignUp();
      }
    } else if (step === SignUpStep.VendorDetails) {
      if (!businessName || vendorServices.length === 0) {
        toast({
          title: "Missing Information",
          description: "Please provide your business name and select at least one service.",
          variant: "destructive"
        });
        return;
      }
      
      handleSignUp();
    }
  };
  
  const handlePreviousStep = () => {
    if (step === SignUpStep.Role) {
      setStep(SignUpStep.AccountDetails);
    } else if (step === SignUpStep.VendorDetails) {
      setStep(SignUpStep.Role);
    }
  };
  
  const toggleService = (serviceId: string) => {
    if (vendorServices.includes(serviceId)) {
      setVendorServices(vendorServices.filter(id => id !== serviceId));
    } else {
      setVendorServices([...vendorServices, serviceId]);
    }
  };

  const handleSignUp = async () => {
    setIsLoading(true);

    try {
      // Create the user with Firebase Auth
      const userCredential = await signUpWithEmail(email, password);
      const user = userCredential.user;
      
      // Create user document in Firestore with role
      const userData = {
        email: user.email,
        displayName: displayName,
        role: role,
        createdAt: new Date(),
        ...(role === 'vendor' && {
          businessName,
          services: vendorServices,
          phone,
          verified: false
        })
      };
      
      await setDoc(doc(db, "users", user.uid), userData);
      
      toast({
        title: "Account created!",
        description: "You have successfully signed up.",
      });
      
      if (role === 'vendor') {
        setStep(SignUpStep.Complete);
      } else {
        // Redirect to dashboard
        navigate('/dashboard');
      }
    } catch (error) {
      console.error("Signup error:", error);
      let errorMessage = "Failed to create account. Please try again.";
      
      if (error instanceof FirebaseError) {
        switch(error.code) {
          case 'auth/email-already-in-use':
            errorMessage = "This email is already in use.";
            break;
          case 'auth/invalid-email':
            errorMessage = "Please enter a valid email address.";
            break;
          case 'auth/weak-password':
            errorMessage = "Password is too weak. Please choose a stronger password.";
            break;
        }
      }
      
      toast({
        title: "Signup Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    
    try {
      await signInWithGoogle();
      
      toast({
        title: "Success!",
        description: "You have successfully signed up with Google.",
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error("Google signup error:", error);
      toast({
        title: "Signup Failed",
        description: "Failed to sign up with Google. Please try again.",
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
                {step === SignUpStep.Complete ? 'Welcome Aboard!' : 'Create Your Account'}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {step === SignUpStep.AccountDetails && "Join Celebration Central to start planning unforgettable events"}
                {step === SignUpStep.Role && "How will you be using Celebration Central?"}
                {step === SignUpStep.VendorDetails && "Tell us about your business"}
                {step === SignUpStep.Complete && "Your vendor account is ready to go"}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {step !== SignUpStep.Complete && (
                <MultiStepProgress 
                  steps={role === 'vendor' ? 3 : 2} 
                  currentStep={step === SignUpStep.AccountDetails ? 1 : step === SignUpStep.Role ? 2 : 3} 
                />
              )}
              
              {step === SignUpStep.AccountDetails && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      Full Name
                    </Label>
                    <Input 
                      id="name" 
                      placeholder="Enter your name" 
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      autoComplete="name"
                      className="transition-all focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      Email
                    </Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="example@email.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      className="transition-all focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                      className="transition-all focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input 
                      id="confirm-password" 
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      autoComplete="new-password"
                      className="transition-all focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <Button 
                    onClick={handleNextStep} 
                    className="w-full transition-all hover:shadow-md" 
                    disabled={isLoading}
                  >
                    Continue
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                  
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
                    onClick={handleGoogleSignUp} 
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
                    Sign up with Google
                  </Button>
                </motion.div>
              )}
              
              {step === SignUpStep.Role && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-4"
                >
                  <p className="text-sm text-center text-muted-foreground">
                    Choose how you'll use Celebration Central
                  </p>
                  
                  <div className="grid gap-4">
                    {roleOptions.map((option) => (
                      <div 
                        key={option.id} 
                        className={`
                          p-4 border-2 rounded-lg cursor-pointer transition-all
                          ${role === option.id ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/50'}
                        `}
                        onClick={() => setRole(option.id as UserRole)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0">
                            {option.icon}
                          </div>
                          <div className="flex-grow">
                            <h3 className="font-medium">{option.title}</h3>
                            <p className="text-sm text-muted-foreground">{option.description}</p>
                          </div>
                          <div className={`w-5 h-5 rounded-full ${role === option.id ? 'bg-primary' : 'border-2 border-muted'}`}>
                            {role === option.id && <CheckCircle className="w-5 h-5 text-primary-foreground" />}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-between pt-4">
                    <Button 
                      variant="outline" 
                      onClick={handlePreviousStep}
                      disabled={isLoading}
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    
                    <Button 
                      onClick={handleNextStep}
                      disabled={isLoading}
                    >
                      Continue
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              )}
              
              {step === SignUpStep.VendorDetails && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="business-name">Business Name</Label>
                    <Input 
                      id="business-name" 
                      placeholder="Your business name"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="transition-all focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Contact Phone</Label>
                    <Input 
                      id="phone" 
                      placeholder="Your phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      type="tel"
                      className="transition-all focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Services Offered</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {serviceOptions.map((service) => (
                        <div 
                          key={service.id} 
                          className={`
                            p-2 border rounded-md cursor-pointer transition-all flex items-center space-x-2
                            ${vendorServices.includes(service.id) ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/50'}
                          `}
                          onClick={() => toggleService(service.id)}
                        >
                          <Checkbox 
                            id={service.id} 
                            checked={vendorServices.includes(service.id)}
                            onCheckedChange={() => toggleService(service.id)}
                          />
                          <label 
                            htmlFor={service.id}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {service.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between pt-4">
                    <Button 
                      variant="outline" 
                      onClick={handlePreviousStep}
                      disabled={isLoading}
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    
                    <Button 
                      onClick={handleNextStep}
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating Account..." : "Create Account"}
                    </Button>
                  </div>
                </motion.div>
              )}
              
              {step === SignUpStep.Complete && (
                <div className="space-y-6 py-4">
                  <div className="flex justify-center">
                    <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                  
                  <div className="text-center space-y-2">
                    <h3 className="text-lg font-medium">Your vendor account is ready!</h3>
                    <p className="text-muted-foreground">
                      Your account has been created successfully. You can now start adding your services.
                    </p>
                  </div>
                  
                  <Button 
                    onClick={() => navigate('/vendor')} 
                    className="w-full"
                  >
                    Go to Vendor Dashboard
                  </Button>
                </div>
              )}
            </CardContent>
            
            {step === SignUpStep.AccountDetails && (
              <CardFooter className="flex items-center justify-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary font-medium hover:underline">
                    Sign in
                  </Link>
                </p>
              </CardFooter>
            )}
          </Card>
        </motion.div>
      </main>

      <Footer />
    </>
  );
};

export default SignUp;
