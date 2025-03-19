
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Calendar as CalendarIcon, Plus, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { HabitCard } from '@/components/HabitCard';
import { ShareButton } from '@/components/ShareButton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';

const CalendarPage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [habitDialogOpen, setHabitDialogOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<string | null>(null);
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [newHabitDescription, setNewHabitDescription] = useState('');
  
  // Mock data for habits
  const [habits, setHabits] = useState([
    {
      id: '1',
      title: 'Morning Workout',
      description: 'Complete 30 mins of exercise',
      completed: false,
      date: new Date(),
      points: 20,
    },
    {
      id: '2',
      title: 'Read a Book',
      description: 'Read for 20 mins',
      completed: true,
      date: new Date(),
      points: 20,
    },
    {
      id: '3',
      title: 'Meditation',
      description: 'Meditate for 10 mins',
      completed: false,
      date: new Date(),
      points: 20,
    }
  ]);

  const handleAddHabit = () => {
    if (!newHabitTitle.trim()) {
      toast.error('Please enter a habit title');
      return;
    }
    
    const newHabit = {
      id: Date.now().toString(),
      title: newHabitTitle.trim(),
      description: newHabitDescription.trim(),
      completed: false,
      date: date || new Date(),
      points: 20,
    };
    
    setHabits([...habits, newHabit]);
    setNewHabitTitle('');
    setNewHabitDescription('');
    setHabitDialogOpen(false);
    
    toast.success('Habit added successfully!');
  };

  const handleEditHabit = () => {
    if (!editingHabit || !newHabitTitle.trim()) return;
    
    setHabits(habits.map(habit => 
      habit.id === editingHabit 
        ? { 
            ...habit, 
            title: newHabitTitle.trim(),
            description: newHabitDescription.trim()
          }
        : habit
    ));
    
    setEditingHabit(null);
    setNewHabitTitle('');
    setNewHabitDescription('');
    setHabitDialogOpen(false);
    
    toast.success('Habit updated successfully!');
  };

  const handleToggleComplete = (id: string, completed: boolean) => {
    setHabits(habits.map(habit => 
      habit.id === id 
        ? { ...habit, completed }
        : habit
    ));
  };

  const openEditDialog = (habit: typeof habits[0]) => {
    setEditingHabit(habit.id);
    setNewHabitTitle(habit.title);
    setNewHabitDescription(habit.description || '');
    setHabitDialogOpen(true);
  };

  const resetForm = () => {
    setEditingHabit(null);
    setNewHabitTitle('');
    setNewHabitDescription('');
  };

  // Get habits for the selected date
  const filteredHabits = habits.filter(habit => {
    if (!date) return false;
    
    const habitDate = new Date(habit.date);
    return (
      habitDate.getDate() === date.getDate() &&
      habitDate.getMonth() === date.getMonth() &&
      habitDate.getFullYear() === date.getFullYear()
    );
  });

  const handleDialogOpenChange = (open: boolean) => {
    setHabitDialogOpen(open);
    if (!open) resetForm();
  };

  return (
    <Layout>
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Habit Calendar</h1>
          <p className="text-muted-foreground">
            Track your daily habits and earn points for completion.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <ShareButton 
            title="My Habit Tracking Progress" 
            description="Check out my habits on Habit Tracker!"
          />
          <Dialog open={habitDialogOpen} onOpenChange={handleDialogOpenChange}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Habit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingHabit ? 'Edit Habit' : 'Add New Habit'}
                </DialogTitle>
                <DialogDescription>
                  {editingHabit 
                    ? 'Edit your habit details below' 
                    : 'Create a new habit to track daily'}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input 
                    id="title" 
                    value={newHabitTitle}
                    onChange={(e) => setNewHabitTitle(e.target.value)}
                    placeholder="e.g., Morning Workout"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description">Description (optional)</Label>
                  <Textarea 
                    id="description" 
                    value={newHabitDescription}
                    onChange={(e) => setNewHabitDescription(e.target.value)}
                    placeholder="e.g., Complete 30 mins of exercise"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label>Date</Label>
                  <div className="border rounded-md p-2">
                    <Calendar 
                      mode="single" 
                      selected={date}
                      onSelect={setDate}
                      className="pointer-events-auto"
                    />
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setHabitDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={editingHabit ? handleEditHabit : handleAddHabit}>
                  {editingHabit ? 'Save Changes' : 'Add Habit'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="glass-card p-5 rounded-xl animate-fade-in">
          <h2 className="font-medium mb-4 flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2 text-primary" />
            Select Date
          </h2>
          <Calendar 
            mode="single" 
            selected={date}
            onSelect={setDate}
            className="rounded-md pointer-events-auto"
          />
          
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-teal mr-2"></div>
                <span>Completed</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-muted mr-2"></div>
                <span>Pending</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-medium text-xl">
              {date && date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </h2>
            
            <div className="flex items-center text-sm text-muted-foreground">
              <Check className="h-4 w-4 text-teal mr-1.5" />
              <span>{filteredHabits.filter(h => h.completed).length}/{filteredHabits.length} completed</span>
            </div>
          </div>
          
          {filteredHabits.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 animate-fade-in">
              {filteredHabits.map(habit => (
                <HabitCard
                  key={habit.id}
                  id={habit.id}
                  title={habit.title}
                  description={habit.description}
                  completed={habit.completed}
                  date={habit.date}
                  points={habit.points}
                  onToggleComplete={handleToggleComplete}
                  onEdit={() => openEditDialog(habit)}
                />
              ))}
            </div>
          ) : (
            <div className="glass-card rounded-xl p-8 text-center animate-fade-in">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                <X className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No habits for this day</h3>
              <p className="text-muted-foreground mb-4">
                Get started by adding your first habit for this day
              </p>
              <Button onClick={() => setHabitDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Habit
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CalendarPage;
