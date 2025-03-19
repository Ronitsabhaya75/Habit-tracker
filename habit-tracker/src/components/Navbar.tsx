
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Calendar, 
  GamepadIcon, 
  LineChart, 
  Trophy, 
  Award,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

export const Navbar = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [points, setPoints] = useState(0); // Points would come from a context/state in a real app

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Mock data for points - in a real app this would come from context or API
  useEffect(() => {
    // Simulating points loaded from storage or API
    setPoints(120);
  }, []);

  const navLinks = [
    { name: 'Calendar', path: '/calendar', icon: <Calendar className="h-5 w-5" /> },
    { name: 'Games', path: '/games', icon: <GamepadIcon className="h-5 w-5" /> },
    { name: 'Progress', path: '/progress', icon: <LineChart className="h-5 w-5" /> },
    { name: 'Leaderboard', path: '/leaderboard', icon: <Trophy className="h-5 w-5" /> },
    { name: 'Achievements', path: '/achievements', icon: <Award className="h-5 w-5" /> },
  ];

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-background/80 backdrop-blur-lg shadow-sm" : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 md:h-20 items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center space-x-2 font-semibold text-xl transition-opacity hover:opacity-80"
          >
            <span className="text-primary">Habit</span>
            <span>Tracker</span>
          </Link>

          {isMobile ? (
            // Mobile menu button
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          ) : (
            // Desktop navigation
            <nav className="flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 transition-colors",
                    location.pathname === link.path
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                  )}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </Link>
              ))}
              
              <div className="ml-4 pl-4 border-l">
                <div className="flex items-center bg-primary/10 px-3 py-1 rounded-full">
                  <Trophy className="h-4 w-4 text-primary mr-1.5" />
                  <span className="font-semibold text-sm">{points} pts</span>
                </div>
              </div>
            </nav>
          )}
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobile && (
        <div
          className={cn(
            "fixed inset-0 bg-background z-40 pt-16 transition-transform duration-300 ease-in-out",
            isMenuOpen ? "transform translate-y-0" : "transform -translate-y-full"
          )}
        >
          <nav className="container mx-auto px-4 py-6 flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "p-3 rounded-md text-base font-medium flex items-center space-x-3 transition-colors",
                  location.pathname === link.path
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                )}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            ))}
            
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex items-center justify-center bg-primary/10 p-3 rounded-lg">
                <Trophy className="h-5 w-5 text-primary mr-2" />
                <span className="font-semibold text-base">{points} points</span>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
