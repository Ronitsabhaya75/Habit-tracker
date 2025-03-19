import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { ShareButton } from '@/components/ShareButton';
import { 
  Trophy, 
  Medal, 
  Crown, 
  ArrowUp, 
  ArrowDown, 
  Minus,
  Search,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

interface LeaderboardUser {
  id: string;
  rank: number;
  previousRank: number;
  name: string;
  points: number;
  avatar: string;
  isCurrentUser?: boolean;
}

const Leaderboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [leaderboardPeriod, setLeaderboardPeriod] = useState('weekly');
  
  // Mock leaderboard data
  const weeklyLeaderboard: LeaderboardUser[] = [
    {
      id: '1',
      rank: 1,
      previousRank: 2,
      name: 'Emma Watson',
      points: 450,
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    {
      id: '2',
      rank: 2,
      previousRank: 1,
      name: 'John Smith',
      points: 430,
      avatar: 'https://i.pravatar.cc/150?img=2'
    },
    {
      id: '3',
      rank: 3,
      previousRank: 3,
      name: 'Mike Johnson',
      points: 410,
      avatar: 'https://i.pravatar.cc/150?img=3'
    },
    {
      id: '4',
      rank: 4,
      previousRank: 6,
      name: 'Sarah Parker',
      points: 380,
      avatar: 'https://i.pravatar.cc/150?img=4',
      isCurrentUser: true
    },
    {
      id: '5',
      rank: 5,
      previousRank: 4,
      name: 'David Miller',
      points: 350,
      avatar: 'https://i.pravatar.cc/150?img=5'
    },
    {
      id: '6',
      rank: 6,
      previousRank: 5,
      name: 'Jessica Lee',
      points: 340,
      avatar: 'https://i.pravatar.cc/150?img=6'
    },
    {
      id: '7',
      rank: 7,
      previousRank: 7,
      name: 'Robert Chen',
      points: 320,
      avatar: 'https://i.pravatar.cc/150?img=7'
    },
    {
      id: '8',
      rank: 8,
      previousRank: 10,
      name: 'Lisa Wang',
      points: 300,
      avatar: 'https://i.pravatar.cc/150?img=8'
    },
    {
      id: '9',
      rank: 9,
      previousRank: 9,
      name: 'Kevin Brown',
      points: 280,
      avatar: 'https://i.pravatar.cc/150?img=9'
    },
    {
      id: '10',
      rank: 10,
      previousRank: 8,
      name: 'Amanda White',
      points: 260,
      avatar: 'https://i.pravatar.cc/150?img=10'
    }
  ];
  
  const monthlyLeaderboard: LeaderboardUser[] = [
    {
      id: '1',
      rank: 1,
      previousRank: 1,
      name: 'John Smith',
      points: 1230,
      avatar: 'https://i.pravatar.cc/150?img=2'
    },
    {
      id: '4',
      rank: 2,
      previousRank: 4,
      name: 'Sarah Parker',
      points: 1180,
      avatar: 'https://i.pravatar.cc/150?img=4',
      isCurrentUser: true
    },
    {
      id: '3',
      rank: 3,
      previousRank: 3,
      name: 'Mike Johnson',
      points: 1110,
      avatar: 'https://i.pravatar.cc/150?img=3'
    },
    {
      id: '2',
      rank: 4,
      previousRank: 2,
      name: 'Emma Watson',
      points: 1050,
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    {
      id: '5',
      rank: 5,
      previousRank: 5,
      name: 'David Miller',
      points: 980,
      avatar: 'https://i.pravatar.cc/150?img=5'
    },
    {
      id: '6',
      rank: 6,
      previousRank: 6,
      name: 'Jessica Lee',
      points: 920,
      avatar: 'https://i.pravatar.cc/150?img=6'
    },
    {
      id: '7',
      rank: 7,
      previousRank: 7,
      name: 'Robert Chen',
      points: 870,
      avatar: 'https://i.pravatar.cc/150?img=7'
    },
    {
      id: '8',
      rank: 8,
      previousRank: 8,
      name: 'Lisa Wang',
      points: 810,
      avatar: 'https://i.pravatar.cc/150?img=8'
    },
    {
      id: '9',
      rank: 9,
      previousRank: 9,
      name: 'Kevin Brown',
      points: 750,
      avatar: 'https://i.pravatar.cc/150?img=9'
    },
    {
      id: '10',
      rank: 10,
      previousRank: 10,
      name: 'Amanda White',
      points: 690,
      avatar: 'https://i.pravatar.cc/150?img=10'
    }
  ];
  
  const allTimeLeaderboard: LeaderboardUser[] = [
    {
      id: '2',
      rank: 1,
      previousRank: 1,
      name: 'John Smith',
      points: 5430,
      avatar: 'https://i.pravatar.cc/150?img=2'
    },
    {
      id: '1',
      rank: 2,
      previousRank: 2,
      name: 'Emma Watson',
      points: 5250,
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    {
      id: '3',
      rank: 3,
      previousRank: 3,
      name: 'Mike Johnson',
      points: 5110,
      avatar: 'https://i.pravatar.cc/150?img=3'
    },
    {
      id: '4',
      rank: 4,
      previousRank: 4,
      name: 'Sarah Parker',
      points: 5080,
      avatar: 'https://i.pravatar.cc/150?img=4',
      isCurrentUser: true
    },
    {
      id: '5',
      rank: 5,
      previousRank: 5,
      name: 'David Miller',
      points: 4980,
      avatar: 'https://i.pravatar.cc/150?img=5'
    },
    {
      id: '6',
      rank: 6,
      previousRank: 6,
      name: 'Jessica Lee',
      points: 4920,
      avatar: 'https://i.pravatar.cc/150?img=6'
    },
    {
      id: '7',
      rank: 7,
      previousRank: 7,
      name: 'Robert Chen',
      points: 4870,
      avatar: 'https://i.pravatar.cc/150?img=7'
    },
    {
      id: '8',
      rank: 8,
      previousRank: 8,
      name: 'Lisa Wang',
      points: 4810,
      avatar: 'https://i.pravatar.cc/150?img=8'
    },
    {
      id: '9',
      rank: 9,
      previousRank: 9,
      name: 'Kevin Brown',
      points: 4750,
      avatar: 'https://i.pravatar.cc/150?img=9'
    },
    {
      id: '10',
      rank: 10,
      previousRank: 10,
      name: 'Amanda White',
      points: 4690,
      avatar: 'https://i.pravatar.cc/150?img=10'
    }
  ];
  
  // Get leaderboard based on selected period
  const getLeaderboard = () => {
    switch (leaderboardPeriod) {
      case 'weekly': return weeklyLeaderboard;
      case 'monthly': return monthlyLeaderboard;
      case 'allTime': return allTimeLeaderboard;
      default: return weeklyLeaderboard;
    }
  };
  
  // Filter leaderboard based on search query
  const filteredLeaderboard = getLeaderboard().filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Get current user from leaderboard
  const currentUser = getLeaderboard().find(user => user.isCurrentUser);
  
  // Render rank change indicator
  const renderRankChange = (user: LeaderboardUser) => {
    const diff = user.previousRank - user.rank;
    
    if (diff > 0) {
      return <ArrowUp className="h-4 w-4 text-teal" />;
    } else if (diff < 0) {
      return <ArrowDown className="h-4 w-4 text-coral" />;
    } else {
      return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <Layout>
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Leaderboard</h1>
          <p className="text-muted-foreground">
            Compete with others and climb the ranks.
          </p>
        </div>
        <ShareButton 
          title="Check out my position on the leaderboard!" 
          description="I'm competing on Habit Tracker's leaderboard."
        />
      </div>
      
      <div className="glass-card rounded-xl p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card rounded-xl p-5 border border-gold/50 flex items-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gold/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="z-10 flex-1">
              <div className="text-sm text-muted-foreground mb-1">1st Place</div>
              <div className="font-medium text-lg">{getLeaderboard()[0]?.name}</div>
              <div className="flex items-center mt-1">
                <Trophy className="h-4 w-4 text-gold mr-1.5" />
                <span className="font-medium">{getLeaderboard()[0]?.points} pts</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gold">
              <img src={getLeaderboard()[0]?.avatar} alt={getLeaderboard()[0]?.name} className="w-full h-full object-cover" />
            </div>
          </div>
          
          <div className="glass-card rounded-xl p-5 border border-primary/50 flex items-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="z-10 flex-1">
              <div className="text-sm text-muted-foreground mb-1">2nd Place</div>
              <div className="font-medium text-lg">{getLeaderboard()[1]?.name}</div>
              <div className="flex items-center mt-1">
                <Medal className="h-4 w-4 text-primary mr-1.5" />
                <span className="font-medium">{getLeaderboard()[1]?.points} pts</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary">
              <img src={getLeaderboard()[1]?.avatar} alt={getLeaderboard()[1]?.name} className="w-full h-full object-cover" />
            </div>
          </div>
          
          <div className="glass-card rounded-xl p-5 border border-teal/50 flex items-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-teal/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="z-10 flex-1">
              <div className="text-sm text-muted-foreground mb-1">3rd Place</div>
              <div className="font-medium text-lg">{getLeaderboard()[2]?.name}</div>
              <div className="flex items-center mt-1">
                <Medal className="h-4 w-4 text-teal mr-1.5" />
                <span className="font-medium">{getLeaderboard()[2]?.points} pts</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-teal">
              <img src={getLeaderboard()[2]?.avatar} alt={getLeaderboard()[2]?.name} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <Tabs defaultValue="weekly" onValueChange={setLeaderboardPeriod}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <TabsList>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="allTime">All Time</TabsTrigger>
            </TabsList>
            
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full sm:w-[250px]"
              />
            </div>
          </div>
          
          <TabsContent value="weekly" className="mt-0">
            <div className="glass-card rounded-xl overflow-hidden">
              <div className="grid grid-cols-12 gap-4 p-4 bg-muted/30 border-b font-medium text-sm">
                <div className="col-span-1 text-center">Rank</div>
                <div className="col-span-7 sm:col-span-5">User</div>
                <div className="col-span-4 sm:col-span-2 text-right">Points</div>
                <div className="hidden sm:block sm:col-span-2 text-center">Change</div>
                <div className="hidden sm:block sm:col-span-2 text-right">Actions</div>
              </div>
              
              <div className="divide-y">
                {filteredLeaderboard.length > 0 ? (
                  filteredLeaderboard.map((user) => (
                    <div 
                      key={user.id} 
                      className={`grid grid-cols-12 gap-4 p-4 items-center ${user.isCurrentUser ? 'bg-primary/5' : ''}`}
                    >
                      <div className="col-span-1 text-center font-medium">
                        {user.rank <= 3 ? (
                          <div className={`
                            w-6 h-6 rounded-full flex items-center justify-center mx-auto
                            ${user.rank === 1 ? 'bg-gold/20 text-gold' : 
                              user.rank === 2 ? 'bg-primary/20 text-primary' : 'bg-teal/20 text-teal'}
                          `}>
                            {user.rank}
                          </div>
                        ) : (
                          user.rank
                        )}
                      </div>
                      
                      <div className="col-span-7 sm:col-span-5 flex items-center">
                        <div className="w-8 h-8 rounded-full overflow-hidden mr-3 flex-shrink-0">
                          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="truncate">
                          <div className="font-medium truncate">{user.name}</div>
                          {user.isCurrentUser && (
                            <div className="text-xs text-primary">You</div>
                          )}
                        </div>
                      </div>
                      
                      <div className="col-span-4 sm:col-span-2 text-right font-medium">
                        {user.points} pts
                      </div>
                      
                      <div className="hidden sm:flex sm:col-span-2 items-center justify-center">
                        <div className="flex items-center">
                          {renderRankChange(user)}
                          <span className="ml-1 text-sm">
                            {Math.abs(user.previousRank - user.rank) || '-'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="hidden sm:block sm:col-span-2 text-right">
                        <Button variant="ghost" size="sm">
                          View Profile
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <Users className="h-8 w-8 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-medium mb-1">No users found</h3>
                    <p className="text-sm text-muted-foreground">
                      Try a different search term
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="monthly" className="mt-0">
            <div className="glass-card rounded-xl overflow-hidden">
              <div className="grid grid-cols-12 gap-4 p-4 bg-muted/30 border-b font-medium text-sm">
                <div className="col-span-1 text-center">Rank</div>
                <div className="col-span-7 sm:col-span-5">User</div>
                <div className="col-span-4 sm:col-span-2 text-right">Points</div>
                <div className="hidden sm:block sm:col-span-2 text-center">Change</div>
                <div className="hidden sm:block sm:col-span-2 text-right">Actions</div>
              </div>
              
              <div className="divide-y">
                {filteredLeaderboard.length > 0 ? (
                  filteredLeaderboard.map((user) => (
                    <div 
                      key={user.id} 
                      className={`grid grid-cols-12 gap-4 p-4 items-center ${user.isCurrentUser ? 'bg-primary/5' : ''}`}
                    >
                      <div className="col-span-1 text-center font-medium">
                        {user.rank <= 3 ? (
                          <div className={`
                            w-6 h-6 rounded-full flex items-center justify-center mx-auto
                            ${user.rank === 1 ? 'bg-gold/20 text-gold' : 
                              user.rank === 2 ? 'bg-primary/20 text-primary' : 'bg-teal/20 text-teal'}
                          `}>
                            {user.rank}
                          </div>
                        ) : (
                          user.rank
                        )}
                      </div>
                      
                      <div className="col-span-7 sm:col-span-5 flex items-center">
                        <div className="w-8 h-8 rounded-full overflow-hidden mr-3 flex-shrink-0">
                          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="truncate">
                          <div className="font-medium truncate">{user.name}</div>
                          {user.isCurrentUser && (
                            <div className="text-xs text-primary">You</div>
                          )}
                        </div>
                      </div>
                      
                      <div className="col-span-4 sm:col-span-2 text-right font-medium">
                        {user.points} pts
                      </div>
                      
                      <div className="hidden sm:flex sm:col-span-2 items-center justify-center">
                        <div className="flex items-center">
                          {renderRankChange(user)}
                          <span className="ml-1 text-sm">
                            {Math.abs(user.previousRank - user.rank) || '-'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="hidden sm:block sm:col-span-2 text-right">
                        <Button variant="ghost" size="sm">
                          View Profile
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <Users className="h-8 w-8 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-medium mb-1">No users found</h3>
                    <p className="text-sm text-muted-foreground">
                      Try a different search term
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="allTime" className="mt-0">
            <div className="glass-card rounded-xl overflow-hidden">
              <div className="grid grid-cols-12 gap-4 p-4 bg-muted/30 border-b font-medium text-sm">
                <div className="col-span-1 text-center">Rank</div>
                <div className="col-span-7 sm:col-span-5">User</div>
                <div className="col-span-4 sm:col-span-2 text-right">Points</div>
                <div className="hidden sm:block sm:col-span-2 text-center">Change</div>
                <div className="hidden sm:block sm:col-span-2 text-right">Actions</div>
              </div>
              
              <div className="divide-y">
                {filteredLeaderboard.length > 0 ? (
                  filteredLeaderboard.map((user) => (
                    <div 
                      key={user.id} 
                      className={`grid grid-cols-12 gap-4 p-4 items-center ${user.isCurrentUser ? 'bg-primary/5' : ''}`}
                    >
                      <div className="col-span-1 text-center font-medium">
                        {user.rank <= 3 ? (
                          <div className={`
                            w-6 h-6 rounded-full flex items-center justify-center mx-auto
                            ${user.rank === 1 ? 'bg-gold/20 text-gold' : 
                              user.rank === 2 ? 'bg-primary/20 text-primary' : 'bg-teal/20 text-teal'}
                          `}>
                            {user.rank}
                          </div>
                        ) : (
                          user.rank
                        )}
                      </div>
                      
                      <div className="col-span-7 sm:col-span-5 flex items-center">
                        <div className="w-8 h-8 rounded-full overflow-hidden mr-3 flex-shrink-0">
                          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="truncate">
                          <div className="font-medium truncate">{user.name}</div>
                          {user.isCurrentUser && (
                            <div className="text-xs text-primary">You</div>
                          )}
                        </div>
                      </div>
                      
                      <div className="col-span-4 sm:col-span-2 text-right font-medium">
                        {user.points} pts
                      </div>
                      
                      <div className="hidden sm:flex sm:col-span-2 items-center justify-center">
                        <div className="flex items-center">
                          {renderRankChange(user)}
                          <span className="ml-1 text-sm">
                            {Math.abs(user.previousRank - user.rank) || '-'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="hidden sm:block sm:col-span-2 text-right">
                        <Button variant="ghost" size="sm">
                          View Profile
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <Users className="h-8 w-8 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-medium mb-1">No users found</h3>
                    <p className="text-sm text-muted-foreground">
                      Try a different search term
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {currentUser && (
        <div className="glass-card rounded-xl p-6 mb-8">
          <h2 className="text-xl font-medium mb-6">Your Position</h2>
          
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full overflow-hidden mr-4 border-2 border-primary">
              <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
            </div>
            
            <div className="flex-1">
              <div className="font-medium">{currentUser.name}</div>
              <div className="text-sm text-muted-foreground mt-1">
                Rank {currentUser.rank} • {currentUser.points} points
              </div>
            </div>
            
            <div>
              <div className="text-sm text-muted-foreground mb-1">Points to Next Rank</div>
              <div className="flex items-center">
                <div className="w-full bg-muted rounded-full h-2 mr-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '80%' }}></div>
                </div>
                <span className="text-sm font-medium">20</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Leaderboard;
