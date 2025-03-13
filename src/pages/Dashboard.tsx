
import React from 'react';
import Sidebar from '@/components/Sidebar';
import { Layers, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import useLocalStorage from '@/hooks/useLocalStorage';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user] = useLocalStorage('focusflow-user', null);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <main className="pb-16 pt-4 px-4 md:pl-16 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          <header className="py-8 md:py-12">
            <div className="animate-fade-in">
              <h1 className="text-4xl font-bold tracking-tight">Welcome back, {user?.name || 'User'}</h1>
              <p className="text-muted-foreground mt-2">Your all-in-one productivity dashboard</p>
            </div>
          </header>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12 animate-fade-in">
            <div className="glass-card rounded-xl p-6 col-span-full bg-white/50 border border-border">
              <div className="flex flex-col items-center text-center max-w-lg mx-auto py-8">
                <Layers className="h-16 w-16 text-primary mb-6" />
                <h2 className="text-2xl font-bold mb-4">Select a Tool to Get Started</h2>
                <p className="text-muted-foreground mb-6">
                  Use the sidebar to navigate between different productivity tools. Each tool is designed to help you stay focused and organized.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button onClick={() => navigate('/tasks')}>
                    Tasks
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button onClick={() => navigate('/notes')} variant="outline">
                    Notes
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button onClick={() => navigate('/expenses')} variant="outline">
                    Expenses
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
