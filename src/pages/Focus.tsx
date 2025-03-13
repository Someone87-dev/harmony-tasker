
import React from 'react';
import Sidebar from '@/components/Sidebar';
import { Clock } from 'lucide-react';

const Focus = () => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <main className="pb-16 pt-4 px-4 md:pl-16 transition-all duration-300">
        <div className="max-w-3xl mx-auto">
          <header className="py-8 md:py-12">
            <div className="animate-fade-in">
              <h1 className="text-4xl font-bold tracking-tight flex items-center gap-2">
                <Clock className="h-8 w-8" />
                Focus Timer
              </h1>
              <p className="text-muted-foreground mt-2">Boost your productivity with focused work sessions</p>
            </div>
          </header>
          
          <div className="glass-card rounded-xl p-6 border border-border bg-white/50 animate-fade-in">
            <div className="text-center py-12">
              <Clock className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Focus Timer Tool</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                This is a placeholder for the Focus Timer tool. Navigate using the sidebar to try other tools.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Focus;
