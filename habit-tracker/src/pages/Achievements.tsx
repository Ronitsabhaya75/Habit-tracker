
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { AchievementBadge } from '@/components/AchievementBadge';
import { ShareButton } from '@/components/ShareButton';
import { Award, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: 'trophy' | 'star' | 'medal' | 'award' | 'crown' | 'flame' | 'zap' | 'target' | 'check';
  color: 'primary' | 'teal' | 'coral' | 'gold' | 'muted';
  unlocked: boolean;
  progress?: number;
  total?: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  category: 'habits' | 'games' | 'social' | 'streaks';
  date?: string;
}

const Achievements = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [rarityFilter, setRarityFilter] = useState('all');
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  
  // Mock achievements data
  const achievements: Achievement[] = [
    {
      id: '1',
      name: 'First Steps',
      description: 'Complete your first habit',
      icon: 'check',
      color: 'teal',
      unlocked: true,
      rarity: 'common',
      category: 'habits',
      date: '2023-11-15'
    },
    {
      id: '2',
      name: 'Habit Master',
      description: 'Complete 100 habits',
      icon: 'award',
      color: 'primary',
      unlocked: false,
      progress: 28,
      total: 100,
      rarity: 'rare',
      category: 'habits'
    },
    {
      id: '3',
      name: 'Streak Champion',
      description: 'Maintain a streak for 30 days',
      icon: 'flame',
      color: 'coral',
      unlocked: false,
      progress: 7,
      total: 30,
      rarity: 'epic',
      category: 'streaks'
    },
    {
      id: '4',
      name: 'Game On',
      description: 'Play your first game',
      icon: 'zap',
      color: 'primary',
      unlocked: true,
      rarity: 'common',
      category: 'games',
      date: '2023-11-16'
    },
    {
      id: '5',
      name: 'Social Butterfly',
      description: 'Share your progress 5 times',
      icon: 'star',
      color: 'gold',
      unlocked: false,
      progress: 2,
      total: 5,
      rarity: 'uncommon',
      category: 'social'
    },
    {
      id: '6',
      name: 'Perfect Week',
      description: 'Complete all habits for 7 days straight',
      icon: 'crown',
      color: 'gold',
      unlocked: false,
      progress: 3,
      total: 7,
      rarity: 'rare',
      category: 'streaks'
    },
    {
      id: '7',
      name: 'Chess Master',
      description: 'Win 10 chess games',
      icon: 'trophy',
      color: 'primary',
      unlocked: false,
      progress: 2,
      total: 10,
      rarity: 'uncommon',
      category: 'games'
    },
    {
      id: '8',
      name: 'Early Bird',
      description: 'Complete a habit before 7 AM',
      icon: 'target',
      color: 'teal',
      unlocked: true,
      rarity: 'common',
      category: 'habits',
      date: '2023-11-18'
    },
    {
      id: '9',
      name: 'Legendary Dedication',
      description: 'Complete all habits every day for 365 days',
      icon: 'medal',
      color: 'gold',
      unlocked: false,
      progress: 7,
      total: 365,
      rarity: 'legendary',
      category: 'streaks'
    }
  ];
  
  // Filter achievements based on search and filters
  const filteredAchievements = achievements.filter(achievement => {
    // Search filter
    const matchesSearch = achievement.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          achievement.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter
    const matchesCategory = categoryFilter === 'all' || achievement.category === categoryFilter;
    
    // Rarity filter
    const matchesRarity = rarityFilter === 'all' || achievement.rarity === rarityFilter;
    
    return matchesSearch && matchesCategory && matchesRarity;
  });
  
  // Get statistics
  const stats = {
    total: achievements.length,
    unlocked: achievements.filter(a => a.unlocked).length,
    percentage: Math.round((achievements.filter(a => a.unlocked).length / achievements.length) * 100)
  };

  return (
    <Layout>
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Achievements</h1>
          <p className="text-muted-foreground">
            Collect badges and showcase your progress.
          </p>
        </div>
        <ShareButton 
          title="Check out my achievements!" 
          description="I've unlocked some cool badges on Habit Tracker."
        />
      </div>
      
      <div className="glass-card rounded-xl p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-primary/10 mr-4">
              <Award className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Total Achievements</div>
              <div className="font-medium text-2xl">{stats.total}</div>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-teal/10 mr-4">
              <Award className="h-6 w-6 text-teal" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Unlocked</div>
              <div className="font-medium text-2xl">{stats.unlocked}</div>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-coral/10 mr-4">
              <Award className="h-6 w-6 text-coral" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Completion</div>
              <div className="font-medium text-2xl">{stats.percentage}%</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search achievements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
        
        <div className="flex gap-3">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[150px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="habits">Habits</SelectItem>
              <SelectItem value="games">Games</SelectItem>
              <SelectItem value="social">Social</SelectItem>
              <SelectItem value="streaks">Streaks</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={rarityFilter} onValueChange={setRarityFilter}>
            <SelectTrigger className="w-[150px]">
              <Award className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Rarity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Rarities</SelectItem>
              <SelectItem value="common">Common</SelectItem>
              <SelectItem value="uncommon">Uncommon</SelectItem>
              <SelectItem value="rare">Rare</SelectItem>
              <SelectItem value="epic">Epic</SelectItem>
              <SelectItem value="legendary">Legendary</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {filteredAchievements.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {filteredAchievements.map((achievement) => (
            <AchievementBadge
              key={achievement.id}
              id={achievement.id}
              name={achievement.name}
              description={achievement.description}
              icon={achievement.icon}
              color={achievement.color}
              unlocked={achievement.unlocked}
              progress={achievement.progress}
              total={achievement.total}
              rarity={achievement.rarity}
              onClick={() => setSelectedAchievement(achievement)}
            />
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-xl p-8 text-center animate-fade-in">
          <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-medium text-lg mb-2">No achievements found</h3>
          <p className="text-muted-foreground">
            Try adjusting your filters or search query
          </p>
        </div>
      )}
      
      {/* Achievement details dialog */}
      <Dialog open={!!selectedAchievement} onOpenChange={() => setSelectedAchievement(null)}>
        <DialogContent className="sm:max-w-md">
          {selectedAchievement && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedAchievement.name}</DialogTitle>
                <DialogDescription>
                  {selectedAchievement.description}
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-4">
                <div className="flex items-center mb-4">
                  <div 
                    className={`
                      w-16 h-16 rounded-lg flex items-center justify-center mr-4
                      ${selectedAchievement.unlocked ? 
                        selectedAchievement.color === 'primary' ? 'bg-primary text-white' : 
                        selectedAchievement.color === 'teal' ? 'bg-teal text-white' : 
                        selectedAchievement.color === 'coral' ? 'bg-coral text-white' : 
                        selectedAchievement.color === 'gold' ? 'bg-gold text-white' : 'bg-muted text-muted-foreground'
                      : 'bg-muted text-muted-foreground'}
                    `}
                  >
                    {selectedAchievement.icon === 'trophy' && <Award className="h-8 w-8" />}
                    {selectedAchievement.icon === 'star' && <Award className="h-8 w-8" />}
                    {selectedAchievement.icon === 'medal' && <Award className="h-8 w-8" />}
                    {selectedAchievement.icon === 'award' && <Award className="h-8 w-8" />}
                    {selectedAchievement.icon === 'crown' && <Award className="h-8 w-8" />}
                    {selectedAchievement.icon === 'flame' && <Award className="h-8 w-8" />}
                    {selectedAchievement.icon === 'zap' && <Award className="h-8 w-8" />}
                    {selectedAchievement.icon === 'target' && <Award className="h-8 w-8" />}
                    {selectedAchievement.icon === 'check' && <Award className="h-8 w-8" />}
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground">Rarity</div>
                    <div className="font-medium capitalize">{selectedAchievement.rarity}</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Category</div>
                    <div className="font-medium capitalize">{selectedAchievement.category}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Status</div>
                    <div className="font-medium">
                      {selectedAchievement.unlocked ? (
                        <span className="text-teal">Unlocked on {new Date(selectedAchievement.date || '').toLocaleDateString()}</span>
                      ) : (
                        <span className="text-muted-foreground">Not unlocked yet</span>
                      )}
                    </div>
                  </div>
                  
                  {!selectedAchievement.unlocked && selectedAchievement.total && selectedAchievement.progress !== undefined && (
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Progress</span>
                        <span>{selectedAchievement.progress}/{selectedAchievement.total}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${(selectedAchievement.progress / selectedAchievement.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Achievements;
