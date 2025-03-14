
import React from 'react';
import Sidebar from '@/components/Sidebar';
import { BarChart4 } from 'lucide-react';
import ExpenseTracker from '@/components/dashboard/ExpenseTracker';
import { useIsMobile } from '@/hooks/use-mobile';

const Expenses = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <main className={`pb-16 pt-4 px-4 ${isMobile ? 'pl-4' : 'md:pl-16'} transition-all duration-300`}>
        <div className="max-w-4xl mx-auto">
          <header className="py-4 md:py-8">
            <div className="animate-fade-in">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight flex items-center gap-2">
                <BarChart4 className="h-6 w-6 md:h-8 md:w-8" />
                Expenses
              </h1>
              <p className="text-muted-foreground mt-2">Track your spending and manage your budget</p>
            </div>
          </header>
          
          <div className="glass-card rounded-xl p-4 md:p-6 border border-border bg-white/50 dark:bg-gray-800/50 animate-fade-in">
            <ExpenseTracker />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Expenses;
