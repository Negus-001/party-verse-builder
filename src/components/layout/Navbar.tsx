
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, LogOut, User, LayoutDashboard, Settings, ShieldAlert, Package } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { logoutUser } from '@/lib/firebase';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, isAdmin, isVendor } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const handleLogout = async () => {
    try {
      await logoutUser();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate('/');
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Get the appropriate dashboard link based on user role
  const getDashboardLink = () => {
    if (isAdmin) return '/admin';
    if (isVendor) return '/vendor';
    return '/dashboard';
  };

  // Get avatar icon based on user role
  const getUserIcon = () => {
    if (isAdmin) return <ShieldAlert size={18} className="text-red-500" />;
    if (isVendor) return <Package size={18} className="text-blue-500" />;
    return <User size={18} />;
  };

  return (
    <nav className="w-full bg-background/80 backdrop-blur-md z-50 fixed top-0 left-0 right-0 py-4 px-6 md:px-10">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <h1 className="text-xl md:text-2xl font-bold font-display">
            <span className="gradient-text">Celebration</span> Central
          </h1>
        </Link>

        {isMobile ? (
          <>
            <button 
              onClick={toggleMenu}
              className="p-2 text-foreground"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            {isMenuOpen && (
              <div className="absolute top-16 left-0 right-0 bg-background/95 backdrop-blur-md shadow-lg p-4 animate-fade-in z-50">
                <div className="flex flex-col gap-4">
                  <Link to="/events" className="px-4 py-2 hover:bg-accent rounded-md">Events</Link>
                  <Link to="/vendors" className="px-4 py-2 hover:bg-accent rounded-md">Vendors</Link>
                  <Link to="/inspiration" className="px-4 py-2 hover:bg-accent rounded-md">AI Inspiration</Link>
                  
                  {isAdmin && (
                    <Link to="/admin" className="px-4 py-2 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-md flex items-center">
                      <ShieldAlert size={16} className="mr-2" />
                      Admin Dashboard
                    </Link>
                  )}
                  
                  {isVendor && (
                    <Link to="/vendor" className="px-4 py-2 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-md flex items-center">
                      <Package size={16} className="mr-2" />
                      Vendor Dashboard
                    </Link>
                  )}
                  
                  <div className="flex flex-col gap-2 pt-2 border-t border-border">
                    {currentUser ? (
                      <>
                        <Link to={getDashboardLink()} className="px-4 py-2 hover:bg-accent rounded-md">Dashboard</Link>
                        <Link to="/create-event" className="px-4 py-2 hover:bg-accent rounded-md">Create Event</Link>
                        <button 
                          onClick={handleLogout} 
                          className="flex items-center px-4 py-2 hover:bg-accent rounded-md text-left"
                        >
                          <LogOut size={16} className="mr-2" />
                          Log out
                        </button>
                      </>
                    ) : (
                      <>
                        <Link to="/login">
                          <Button variant="outline" className="w-full">Log in</Button>
                        </Link>
                        <Link to="/signup">
                          <Button className="w-full">Sign up</Button>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-6">
              <Link to="/events" className="text-sm font-medium hover:text-primary transition-colors">Events</Link>
              <Link to="/vendors" className="text-sm font-medium hover:text-primary transition-colors">Vendors</Link>
              <Link to="/inspiration" className="text-sm font-medium hover:text-primary transition-colors">AI Inspiration</Link>
              
              {isAdmin && (
                <Link 
                  to="/admin" 
                  className="text-sm font-medium text-red-600 hover:text-red-500 dark:text-red-400 transition-colors flex items-center"
                >
                  <ShieldAlert size={14} className="mr-1" />
                  Admin
                </Link>
              )}
              
              {isVendor && (
                <Link 
                  to="/vendor" 
                  className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-colors flex items-center"
                >
                  <Package size={14} className="mr-1" />
                  Vendor
                </Link>
              )}
            </div>
            <div className="flex items-center gap-2">
              {currentUser ? (
                <>
                  <Link to="/create-event">
                    <Button variant="outline" size="sm">Create Event</Button>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="rounded-full w-9 h-9 p-0"
                      >
                        {getUserIcon()}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <div className="flex items-center justify-start gap-2 p-2">
                        <div className="rounded-full w-8 h-8 bg-primary/10 flex items-center justify-center">
                          {getUserIcon()}
                        </div>
                        <div className="flex flex-col space-y-0.5">
                          <p className="text-sm font-medium">
                            {currentUser.displayName || currentUser.email}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {currentUser.email}
                          </p>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      
                      <DropdownMenuItem asChild>
                        <Link to={getDashboardLink()} className="flex items-center">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem asChild>
                        <Link to="/events">My Events</Link>
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem asChild>
                        <Link to="/profile" className="flex items-center">
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem asChild>
                        <Link to="/settings" className="flex items-center">
                          <Settings className="mr-2 h-4 w-4" />
                          Settings
                        </Link>
                      </DropdownMenuItem>
                      
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={handleLogout} 
                        className="text-destructive focus:text-destructive"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="outline">Log in</Button>
                  </Link>
                  <Link to="/signup">
                    <Button>Sign up</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
