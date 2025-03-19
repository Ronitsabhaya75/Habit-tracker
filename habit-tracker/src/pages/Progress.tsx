
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { ProgressChart } from '@/components/ProgressChart';
import { ShareButton } from '@/components/ShareButton';
import { LineChart, CheckCircle2, Calendar, X, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Progress = () => {
  const [timeRange, setTimeRange] = useState('week');
  
  // Mock data for progress chart
  const weekData = [
    { date: 'Mon', value: 40, streak: 1 },
    { date: 'Tue', value: 30, streak: 2 },
    { date: 'Wed', value: 60, streak: 3 },
    { date: 'Thu', value: 50, streak: 4 },
    { date: 'Fri', value: 70, streak: 5 },
    { date: 'Sat', value: 80, streak: 6 },
    { date: 'Sun', value: 90, streak: 7 },
  ];
  
  const monthData = [
    { date: 'Week 1', value: 60, streak: 5 },
    { date: 'Week 2', value: 45, streak: 3 },
    { date: 'Week 3', value: 75, streak: 7 },
    { date: 'Week 4', value: 90, streak: 12 },
  ];
  
  const yearData = [
    { date: 'Jan', value: 40, streak: 10 },
    { date: 'Feb', value: 45, streak: 12 },
    { date: 'Mar', value: 50, streak: 15 },
    { date: 'Apr', value: 65, streak: 20 },
    { date: 'May', value: 60, streak: 18 },
    { date: 'Jun', value: 70, streak: 25 },
    { date: 'Jul', value: 75, streak: 28 },
    { date: 'Aug', value: 80, streak: 30 },
    { date: 'Sep', value: 85, streak: 35 },
    { date: 'Oct', value: 90, streak: 40 },
    { date: 'Nov', value: 95, streak: 45 },
    { date: 'Dec', value: 100, streak: 50 },
  ];
  
  // Current stats - mock data
  const stats = {
    currentStreak: 7,
    completionRate: 85,
    totalPoints: 340,
    habitsCompleted: 28
  };
  
  // Get data based on selected time range
  const getChartData = () => {
    switch (timeRange) {
      case 'week': return weekData;
      case 'month': return monthData;
      case 'year': return yearData;
      default: return weekData;
    }
  };

  return (
    <Layout>
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Your Progress</h1>
          <p className="text-muted-foreground">
            Track your habit completion and performance over time.
          </p>
        </div>
        <ShareButton 
          title="Check out my progress!" 
          description="I'm tracking my habits and making great progress."
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="glass-card rounded-xl p-5 animate-fade-in">
          <div className="flex items-start">
            <div className="bg-teal/10 p-2 rounded-md mr-3">
              <CheckCircle2 className="h-5 w-5 text-teal" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Current Streak</div>
              <div className="font-medium text-2xl">{stats.currentStreak} days</div>
            </div>
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-5 animate-fade-in">
          <div className="flex items-start">
            <div className="bg-primary/10 p-2 rounded-md mr-3">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Completion Rate</div>
              <div className="font-medium text-2xl">{stats.completionRate}%</div>
            </div>
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-5 animate-fade-in">
          <div className="flex items-start">
            <div className="bg-gold/10 p-2 rounded-md mr-3">
              <LineChart className="h-5 w-5 text-gold" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Total Points</div>
              <div className="font-medium text-2xl">{stats.totalPoints} pts</div>
            </div>
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-5 animate-fade-in">
          <div className="flex items-start">
            <div className="bg-coral/10 p-2 rounded-md mr-3">
              <Calendar className="h-5 w-5 text-coral" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Habits Completed</div>
              <div className="font-medium text-2xl">{stats.habitsCompleted}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="glass-card rounded-xl p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h2 className="text-xl font-medium mb-2 sm:mb-0">Performance Over Time</h2>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <ProgressChart 
          data={getChartData()} 
          title="" 
        />
        
        <div className="mt-6 pt-4 border-t border-border flex flex-col sm:flex-row sm:items-center text-sm text-muted-foreground">
          <div className="flex items-center mb-2 sm:mb-0 sm:mr-6">
            <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
            <span>Points Earned</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-teal mr-2"></div>
            <span>Streak Duration</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card rounded-xl p-6">
          <h2 className="text-xl font-medium mb-6">Habit Completion</h2>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <div className="text-sm font-medium">Morning Workout</div>
                <div className="text-sm text-muted-foreground">5/7 days</div>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-teal h-2 rounded-full" style={{ width: '71.4%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <div className="text-sm font-medium">Read a Book</div>
                <div className="text-sm text-muted-foreground">6/7 days</div>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-teal h-2 rounded-full" style={{ width: '85.7%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <div className="text-sm font-medium">Meditation</div>
                <div className="text-sm text-muted-foreground">7/7 days</div>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-teal h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <div className="text-sm font-medium">Learn a Language</div>
                <div className="text-sm text-muted-foreground">3/7 days</div>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-coral h-2 rounded-full" style={{ width: '42.9%' }}></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-6">
          <h2 className="text-xl font-medium mb-6">Points Breakdown</h2>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <div className="text-sm font-medium">Habit Completion</div>
                <div className="text-sm font-medium">240 pts</div>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '70.6%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <div className="text-sm font-medium">Games</div>
                <div className="text-sm font-medium">60 pts</div>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '17.6%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <div className="text-sm font-medium">Streak Bonuses</div>
                <div className="text-sm font-medium">40 pts</div>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '11.8%' }}></div>
              </div>
            </div>
            
            <div className="pt-4 mt-4 border-t border-border">
              <div className="flex justify-between">
                <div className="font-medium">Total</div>
                <div className="font-medium">{stats.totalPoints} pts</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Progress;
