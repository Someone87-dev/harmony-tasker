
import React from 'react';
import Sidebar from '@/components/Sidebar';
import { CheckCircle2 } from 'lucide-react';
import TaskManager from '@/components/dashboard/TaskManager';

const Tasks = () => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <main className="pb-16 pt-4 px-4 md:pl-16 transition-all duration-300">
        <div className="max-w-4xl mx-auto">
          <header className="py-8 md:py-12">
            <div className="animate-fade-in">
              <h1 className="text-4xl font-bold tracking-tight flex items-center gap-2">
                <CheckCircle2 className="h-8 w-8" />
                Tasks
              </h1>
              <p className="text-muted-foreground mt-2">Manage your tasks and stay organized</p>
            </div>
          </header>
          
          <div className="glass-card rounded-xl p-6 border border-border bg-white/50 dark:bg-gray-800/50 animate-fade-in">
            <TaskManager />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Tasks;
