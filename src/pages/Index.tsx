
import React from 'react';
import Sidebar from '@/components/Sidebar';
import TaskManager from '@/components/dashboard/TaskManager';
import Notes from '@/components/dashboard/Notes';
import ExpenseTracker from '@/components/dashboard/ExpenseTracker';
import HabitTracker from '@/components/dashboard/HabitTracker';
import PomodoroTimer from '@/components/dashboard/PomodoroTimer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <main className="pb-16 pt-4 px-4 md:pl-16 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          <header className="py-8 md:py-12">
            <div className="animate-fade-in">
              <h1 className="text-4xl font-bold tracking-tight">FocusFlow Pro</h1>
              <p className="text-muted-foreground mt-2">Your all-in-one productivity dashboard</p>
            </div>
          </header>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pb-12 animate-fade-in">
            <TaskManager />
            <Notes />
            <div className="col-span-2 md:col-span-1 grid grid-cols-1 gap-6">
              <ExpenseTracker />
              <HabitTracker />
              <PomodoroTimer />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
