
import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { HabitCard } from '@/components/HabitCard';
import { AchievementBadge } from '@/components/AchievementBadge';
import { Calendar, GamepadIcon, LineChart, Trophy, Award, ChevronRight } from 'lucide-react';

const Index = () => {
  // Mock data for habits
  const habits = [
    {
      id: '1',
      title: 'Morning Workout',
      description: 'Complete 30 mins of exercise',
      completed: true,
      date: new Date(),
      points: 20,
    },
    {
      id: '2',
      title: 'Read a Book',
      description: 'Read for 20 mins',
      completed: false,
      date: new Date(),
      points: 20,
    }
  ];

  return (
    <Layout className="animate-fade-in">
      <section className="mb-24 text-center max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
          Build Better Habits <span className="text-gradient">Together</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto">
          Track your habits, play games, and earn points while building a better you.
          Challenge friends and unlock achievements in this beautiful experience.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/calendar">
            <Button size="lg" className="gap-2 h-14 px-8 text-base">
              <Calendar className="h-5 w-5" />
              Start Tracking
            </Button>
          </Link>
          <Link to="/games">
            <Button size="lg" variant="outline" className="gap-2 h-14 px-8 text-base">
              <GamepadIcon className="h-5 w-5" />
              Play Games
            </Button>
          </Link>
        </div>
      </section>
      
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
        <div className="glass-card p-8 text-center hover-scale">
          <div className="bg-primary/10 p-5 inline-flex rounded-full mb-6">
            <Calendar className="h-7 w-7 text-primary" />
          </div>
          <h3 className="text-xl font-medium mb-3">Track Habits</h3>
          <p className="text-muted-foreground">
            Log daily habits and earn points for each completion.
          </p>
        </div>
        
        <div className="glass-card p-8 text-center hover-scale">
          <div className="bg-teal/10 p-5 inline-flex rounded-full mb-6">
            <GamepadIcon className="h-7 w-7 text-teal" />
          </div>
          <h3 className="text-xl font-medium mb-3">Play Games</h3>
          <p className="text-muted-foreground">
            Enjoy mini-games and earn additional points.
          </p>
        </div>
        
        <div className="glass-card p-8 text-center hover-scale">
          <div className="bg-coral/10 p-5 inline-flex rounded-full mb-6">
            <LineChart className="h-7 w-7 text-coral" />
          </div>
          <h3 className="text-xl font-medium mb-3">Track Progress</h3>
          <p className="text-muted-foreground">
            Visualize your journey with beautiful charts.
          </p>
        </div>
        
        <div className="glass-card p-8 text-center hover-scale">
          <div className="bg-gold/10 p-5 inline-flex rounded-full mb-6">
            <Trophy className="h-7 w-7 text-gold" />
          </div>
          <h3 className="text-xl font-medium mb-3">Compete</h3>
          <p className="text-muted-foreground">
            Challenge friends on the leaderboard.
          </p>
        </div>
      </section>
      
      <section className="mb-24">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Today's Habits</h2>
          <Link to="/calendar" className="flex items-center text-primary hover:underline gap-1">
            <span>View All</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {habits.map(habit => (
            <HabitCard
              key={habit.id}
              id={habit.id}
              title={habit.title}
              description={habit.description}
              completed={habit.completed}
              date={habit.date}
              points={habit.points}
              onToggleComplete={() => {}}
              onEdit={() => {}}
            />
          ))}
        </div>
      </section>
      
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Recent Achievements</h2>
          <Link to="/achievements" className="flex items-center text-primary hover:underline gap-1">
            <span>View All</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AchievementBadge
            id="1"
            name="First Habit"
            description="Complete your first habit"
            icon="check"
            color="teal"
            unlocked={true}
            rarity="common"
          />
          
          <AchievementBadge
            id="2"
            name="Game Master"
            description="Win 5 games"
            icon="trophy"
            color="gold"
            unlocked={false}
            progress={2}
            total={5}
            rarity="uncommon"
          />
          
          <AchievementBadge
            id="3"
            name="Consistency King"
            description="Complete all habits for 7 days straight"
            icon="flame"
            color="coral"
            unlocked={false}
            progress={3}
            total={7}
            rarity="rare"
          />
        </div>
      </section>
    </Layout>
  );
};

export default Index;
