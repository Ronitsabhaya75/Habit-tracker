
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { 
  Trophy,
  Star,
  Medal,
  Award,
  Crown,
  Flame,
  Zap,
  Target,
  CheckCircle2
} from 'lucide-react';

interface AchievementBadgeProps {
  id: string;
  name: string;
  description: string;
  icon: 'trophy' | 'star' | 'medal' | 'award' | 'crown' | 'flame' | 'zap' | 'target' | 'check';
  color: 'primary' | 'teal' | 'coral' | 'gold' | 'muted';
  unlocked: boolean;
  progress?: number;
  total?: number;
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  className?: string;
  onClick?: () => void;
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  id,
  name,
  description,
  icon,
  color,
  unlocked,
  progress = 0,
  total = 1,
  rarity = 'common',
  className,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const IconMap = {
    trophy: Trophy,
    star: Star,
    medal: Medal,
    award: Award,
    crown: Crown,
    flame: Flame,
    zap: Zap,
    target: Target,
    check: CheckCircle2
  };
  
  const IconComponent = IconMap[icon];
  
  const colorClasses = {
    primary: 'bg-primary text-primary-foreground',
    teal: 'bg-teal text-white',
    coral: 'bg-coral text-white',
    gold: 'bg-gold text-white',
    muted: 'bg-muted text-muted-foreground'
  };
  
  const rarityClasses = {
    common: 'border-border',
    uncommon: 'border-teal',
    rare: 'border-primary',
    epic: 'border-coral',
    legendary: 'border-gold shadow-[0_0_10px_rgba(var(--gold),0.3)]'
  };
  
  const rarityLabels = {
    common: 'Common',
    uncommon: 'Uncommon',
    rare: 'Rare',
    epic: 'Epic',
    legendary: 'Legendary'
  };
  
  const progressPercentage = Math.min(100, (progress / total) * 100);

  return (
    <div 
      className={cn(
        "glass-card relative overflow-hidden rounded-xl p-5 transition-all duration-300",
        unlocked ? "" : "grayscale opacity-70",
        isHovered ? "transform-gpu -translate-y-1 shadow-lg" : "shadow-md",
        rarityClasses[rarity],
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Background glowing effect for legendary badges */}
      {rarity === 'legendary' && unlocked && (
        <div className="absolute inset-0 bg-gradient-to-r from-gold/20 via-coral/20 to-gold/20 animate-pulse" />
      )}
      
      <div className="flex items-start relative z-10">
        <div 
          className={cn(
            "flex items-center justify-center w-12 h-12 rounded-lg mr-4",
            unlocked ? colorClasses[color] : "bg-muted text-muted-foreground"
          )}
        >
          <IconComponent className={cn(
            "h-6 w-6",
            unlocked ? "" : "opacity-50"
          )} />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center">
            <h3 className="font-medium text-base">{name}</h3>
            <span className={cn(
              "ml-2 text-xs px-1.5 py-0.5 rounded-full",
              `bg-${rarity}/10 text-${rarity}`
            )}>
              {rarityLabels[rarity]}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
      </div>
      
      {/* Progress bar */}
      {!unlocked && total > 1 && (
        <div className="mt-4 w-full bg-muted rounded-full h-2">
          <div 
            className={cn(
              "h-full rounded-full",
              color === 'primary' ? 'bg-primary' : 
              color === 'teal' ? 'bg-teal' : 
              color === 'coral' ? 'bg-coral' : 
              color === 'gold' ? 'bg-gold' : 'bg-muted-foreground'
            )}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      )}
      
      {/* Progress text */}
      {!unlocked && total > 1 && (
        <div className="mt-1 text-xs text-muted-foreground text-right">
          {progress} / {total}
        </div>
      )}
    </div>
  );
};
