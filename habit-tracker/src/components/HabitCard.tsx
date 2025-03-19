
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Check, Edit, Calendar, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface HabitCardProps {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  date: Date;
  points: number;
  onToggleComplete: (id: string, completed: boolean) => void;
  onEdit?: (id: string) => void;
  className?: string;
}

export const HabitCard: React.FC<HabitCardProps> = ({
  id,
  title,
  description,
  completed,
  date,
  points,
  onToggleComplete,
  onEdit,
  className,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const handleToggleComplete = () => {
    onToggleComplete(id, !completed);
    
    if (!completed) {
      toast.success(`You earned ${points} points!`, {
        description: `${title} completed successfully.`,
        position: 'top-center',
      });
    }
  };

  return (
    <div 
      className={cn(
        "glass-card rounded-xl p-5 transition-all duration-300",
        completed ? "border-l-4 border-l-teal" : "border-l-4 border-l-transparent",
        isHovered ? "transform-gpu -translate-y-1 shadow-lg" : "shadow-md",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "mr-3 h-8 w-8 rounded-full transition-colors",
              completed ? "bg-teal text-white border-teal hover:bg-teal/90" : "border-muted-foreground"
            )}
            onClick={handleToggleComplete}
          >
            {completed && <Check className="h-4 w-4" />}
          </Button>
          <div>
            <h3 className={cn(
              "font-medium text-base transition-colors",
              completed && "line-through text-muted-foreground"
            )}>
              {title}
            </h3>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
          </div>
        </div>
        
        {onEdit && (
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onEdit(id)}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <div className="flex justify-between items-center mt-4 pt-3 border-t border-border">
        <div className="flex items-center text-xs text-muted-foreground">
          <Calendar className="h-3 w-3 mr-1.5" />
          <span>{formattedDate}</span>
        </div>
        
        <div className="flex items-center">
          <div className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
            +{points} pts
          </div>
        </div>
      </div>
    </div>
  );
};
