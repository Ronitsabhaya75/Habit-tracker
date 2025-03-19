
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { 
  Share2, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Copy, 
  X as Close, 
  CheckCheck 
} from 'lucide-react';
import { 
  Button,
  buttonVariants
} from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from 'sonner';

interface ShareButtonProps {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  className?: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  title,
  description = "Check out my progress on Habit Tracker!",
  image,
  url = window.location.href,
  className,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    toast.success('Link copied to clipboard!');
  };

  const handleShare = (platform: string) => {
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(description)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(description)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
    setIsOpen(false);
    toast.success(`Shared on ${platform}!`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "flex items-center transition-all hover:bg-secondary", 
            className
          )}
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share your progress</DialogTitle>
          <DialogDescription>
            Let your friends know about your habit tracking journey!
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-3 gap-3">
            <button
              className={buttonVariants({
                variant: "outline",
                className: "flex flex-col items-center justify-center h-24 hover:bg-blue-50 hover:border-blue-200 transition-all"
              })}
              onClick={() => handleShare('facebook')}
            >
              <Facebook className="h-8 w-8 text-[#1877F2] mb-2" />
              <span className="text-xs">Facebook</span>
            </button>
            
            <button
              className={buttonVariants({
                variant: "outline",
                className: "flex flex-col items-center justify-center h-24 hover:bg-sky-50 hover:border-sky-200 transition-all"
              })}
              onClick={() => handleShare('twitter')}
            >
              <Twitter className="h-8 w-8 text-[#1DA1F2] mb-2" />
              <span className="text-xs">Twitter</span>
            </button>
            
            <button
              className={buttonVariants({
                variant: "outline",
                className: "flex flex-col items-center justify-center h-24 hover:bg-blue-50 hover:border-blue-200 transition-all"
              })}
              onClick={() => handleShare('linkedin')}
            >
              <Linkedin className="h-8 w-8 text-[#0A66C2] mb-2" />
              <span className="text-xs">LinkedIn</span>
            </button>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or copy link
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 items-center gap-2">
              <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground overflow-hidden whitespace-nowrap overflow-ellipsis">
                {url}
              </div>
            </div>
            <Button type="button" size="icon" onClick={handleCopyLink}>
              {isCopied ? <CheckCheck className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
