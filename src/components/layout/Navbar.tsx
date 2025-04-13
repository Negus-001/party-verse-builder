
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="w-full bg-background/80 backdrop-blur-md z-50 fixed top-0 left-0 right-0 py-4 px-6 md:px-10">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <h1 className="text-xl md:text-2xl font-bold font-display">
            <span className="gradient-text">Party</span>Verse
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
                  <div className="flex flex-col gap-2 pt-2 border-t border-border">
                    <Link to="/login">
                      <Button variant="outline" className="w-full">Log in</Button>
                    </Link>
                    <Link to="/signup">
                      <Button className="w-full">Sign up</Button>
                    </Link>
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
            </div>
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline">Log in</Button>
              </Link>
              <Link to="/signup">
                <Button>Sign up</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
