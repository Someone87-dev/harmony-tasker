
import React, { useState } from 'react';
import { CalendarCheck2, Check, Plus, Trash2, Swords } from 'lucide-react';
import DashboardCard from '../ui/DashboardCard';
import useLocalStorage from '@/hooks/useLocalStorage';
import { Habit } from '@/types';
import { cn } from '@/lib/utils';

const HabitTracker = () => {
  const [habits, setHabits] = useLocalStorage<Habit[]>('focusflow-habits', []);
  const [newHabitName, setNewHabitName] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');

  const addHabit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newHabitName.trim() === '') return;
    
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      name: newHabitName,
      completedDates: [],
      createdAt: new Date(),
      frequency,
    };
    
    setHabits([...habits, newHabit]);
    setNewHabitName('');
  };

  const toggleHabitCompletion = (habitId: string) => {
    setHabits(habits.map(habit => {
      if (habit.id !== habitId) return habit;
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const hasCompletedToday = habit.completedDates.some(date => {
        const completedDate = new Date(date);
        completedDate.setHours(0, 0, 0, 0);
        return completedDate.getTime() === today.getTime();
      });
      
      if (hasCompletedToday) {
        // If already completed today, remove today's entry
        return {
          ...habit,
          completedDates: habit.completedDates.filter(date => {
            const completedDate = new Date(date);
            completedDate.setHours(0, 0, 0, 0);
            return completedDate.getTime() !== today.getTime();
          })
        };
      } else {
        // If not completed today, add today's entry
        return {
          ...habit,
          completedDates: [...habit.completedDates, today]
        };
      }
    }));
  };

  const deleteHabit = (habitId: string) => {
    setHabits(habits.filter(habit => habit.id !== habitId));
  };

  const isCompletedToday = (habitDates: Date[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return habitDates.some(date => {
      const completedDate = new Date(date);
      completedDate.setHours(0, 0, 0, 0);
      return completedDate.getTime() === today.getTime();
    });
  };

  const getStreakCount = (completedDates: Date[]) => {
    if (completedDates.length === 0) return 0;
    
    // Sort dates in descending order
    const sortedDates = [...completedDates].sort((a, b) => 
      new Date(b).getTime() - new Date(a).getTime()
    );
    
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check if habit is completed today
    const lastCompletedDate = new Date(sortedDates[0]);
    lastCompletedDate.setHours(0, 0, 0, 0);
    
    if (lastCompletedDate.getTime() !== today.getTime()) {
      // If not completed today, check if it was completed yesterday
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastCompletedDate.getTime() !== yesterday.getTime()) {
        return 0; // Streak broken if not completed yesterday
      }
    }
    
    // Calculate streak
    let currentDate = new Date(today);
    for (let i = 0; i < sortedDates.length; i++) {
      const date = new Date(sortedDates[i]);
      date.setHours(0, 0, 0, 0);
      
      // Check if this date is part of the streak
      if (date.getTime() === currentDate.getTime() || 
          date.getTime() === new Date(currentDate.setDate(currentDate.getDate() - 1)).getTime()) {
        streak++;
        // Update currentDate for next iteration
        currentDate = new Date(date);
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break; // Streak broken
      }
    }
    
    return streak;
  };

  return (
    <DashboardCard 
      title="Habit Tracker" 
      icon={<Swords />}
      className="col-span-2 md:col-span-1"
    >
      <form onSubmit={addHabit} className="mb-4 flex">
        <div className="flex-1">
          <input
            type="text"
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
            placeholder="Add a new habit..."
            className="w-full px-3 py-2 bg-white/80 dark:bg-gray-700/50 border border-border rounded-l-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
        </div>
        <select
          value={frequency}
          onChange={(e) => setFrequency(e.target.value as 'daily' | 'weekly')}
          className="px-2 py-2 bg-white/80 dark:bg-gray-700/50 border-y border-r-0 border-l-0 border-border focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
        </select>
        <button
          type="submit"
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-r-lg transition-colors duration-200 focus-ring"
          aria-label="Add habit"
        >
          <Plus size={20} />
        </button>
      </form>

      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
        {habits.length === 0 ? (
          <p className="text-center py-6 text-muted-foreground">
            No habits yet. Add some habits to start tracking!
          </p>
        ) : (
          habits.map(habit => {
            const completed = isCompletedToday(habit.completedDates);
            const streak = getStreakCount(habit.completedDates);
            
            return (
              <div 
                key={habit.id}
                className={cn(
                  "p-4 rounded-lg border flex items-start gap-3 transition-all duration-200",
                  completed 
                    ? "bg-primary/10 dark:bg-primary/20 border-primary/20 dark:border-primary/30" 
                    : "bg-white/80 dark:bg-gray-700/50 border-border"
                )}
              >
                <button
                  onClick={() => toggleHabitCompletion(habit.id)}
                  className={cn(
                    "mt-0.5 h-6 w-6 flex items-center justify-center rounded-full border transition-colors duration-200 focus-ring",
                    completed 
                      ? "bg-primary border-primary text-primary-foreground" 
                      : "border-muted-foreground bg-white/80 dark:bg-gray-700/50"
                  )}
                  aria-label={completed ? "Mark as incomplete" : "Mark as complete"}
                >
                  {completed && <Check size={14} />}
                </button>
                
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">{habit.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {habit.frequency} • started {new Date(habit.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <button
                      onClick={() => deleteHabit(habit.id)}
                      className="text-muted-foreground hover:text-destructive focus-ring rounded p-1"
                      aria-label="Delete habit"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <div className="flex items-center mt-2 space-x-2">
                    <div className="text-xs bg-secondary/70 dark:bg-secondary/50 text-foreground px-2 py-1 rounded-full flex items-center gap-1">
                      <CalendarCheck2 size={12} />
                      <span>{habit.completedDates.length} completions</span>
                    </div>
                    
                    {streak > 0 && (
                      <div className="text-xs bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-2 py-1 rounded-full flex items-center gap-1 border border-amber-200 dark:border-amber-800">
                        <Swords size={12} />
                        <span>{streak} day streak</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </DashboardCard>
  );
};

export default HabitTracker;
