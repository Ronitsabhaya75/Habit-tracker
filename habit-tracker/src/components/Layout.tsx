
import React from 'react';
import { Navbar } from './Navbar';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, className }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className={cn(
        "flex-1 container mx-auto px-8 py-12 md:py-16 transition-all duration-300 animate-fade-in",
        isMobile ? "pt-24" : "pt-32",
        className
      )}>
        {children}
      </main>
    </div>
  );
};
