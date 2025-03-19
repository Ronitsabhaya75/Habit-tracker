
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { ChessGame } from '@/components/ChessGame';
import { ShareButton } from '@/components/ShareButton';
import { GamepadIcon, Swords, Dice5, Puzzle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Games = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>('chess');
  
  const games = [
    {
      id: 'chess',
      name: 'Chess Challenge',
      description: 'Play chess and earn points',
      icon: <Swords className="h-6 w-6" />,
      points: 10,
      difficulty: 'Medium',
      available: true
    },
    {
      id: 'dice',
      name: 'Dice Roll',
      description: 'Test your luck with dice',
      icon: <Dice5 className="h-6 w-6" />,
      points: 5,
      difficulty: 'Easy',
      available: false
    },
    {
      id: 'puzzle',
      name: 'Daily Puzzle',
      description: 'Solve the puzzle of the day',
      icon: <Puzzle className="h-6 w-6" />,
      points: 15,
      difficulty: 'Hard',
      available: false
    }
  ];

  const handleGameSelect = (gameId: string) => {
    if (games.find(g => g.id === gameId)?.available) {
      setSelectedGame(gameId);
    } else {
      toast.info('Coming soon!', {
        description: 'This game will be available in a future update.'
      });
    }
  };

  return (
    <Layout>
      <div className="mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold mb-3">Games</h1>
          <p className="text-muted-foreground text-lg max-w-md">
            Play games and earn points to climb the leaderboard.
          </p>
        </div>
        <ShareButton 
          title="Check out my game progress!" 
          description="I'm playing games on Habit Tracker to earn points."
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="glass-card p-8 rounded-xl">
          <h2 className="font-medium mb-6 flex items-center text-xl">
            <GamepadIcon className="h-5 w-5 mr-3 text-primary" />
            Available Games
          </h2>
          
          <div className="space-y-5">
            {games.map(game => (
              <div 
                key={game.id}
                className={`p-5 rounded-xl transition-all cursor-pointer
                  ${selectedGame === game.id ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted'}
                  ${!game.available && 'opacity-70'}`}
                onClick={() => handleGameSelect(game.id)}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center
                    ${selectedGame === game.id ? 'bg-primary text-white' : 'bg-secondary'}`}>
                    {game.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-lg flex items-center">
                      {game.name}
                      {!game.available && (
                        <span className="ml-3 text-xs bg-muted px-2 py-0.5 rounded">
                          Coming Soon
                        </span>
                      )}
                    </h3>
                    <div className="text-sm text-muted-foreground mt-1">
                      {game.description}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between mt-4 pt-3 border-t border-border text-sm">
                  <div className="flex items-center">
                    <span className="font-medium text-muted-foreground">Difficulty:</span>
                    <span className="ml-2">{game.difficulty}</span>
                  </div>
                  <div className="flex items-center text-primary font-medium">
                    <span>+{game.points} pts</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 p-5 bg-muted/50 rounded-xl border border-border">
            <h3 className="font-medium text-base mb-3">How it works</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Complete games to earn points. The harder the game, the more points you earn.
              New games are added regularly, so check back often!
            </p>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          {selectedGame === 'chess' && <ChessGame />}
          
          {!selectedGame && (
            <div className="glass-card rounded-xl p-10 text-center h-full flex flex-col items-center justify-center">
              <GamepadIcon className="h-16 w-16 text-muted-foreground mb-6" />
              <h3 className="text-2xl font-medium mb-3">Select a game to play</h3>
              <p className="text-muted-foreground text-lg max-w-md mb-6">
                Choose from the available games on the left to start playing
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Games;
