
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface DashboardCardProps {
  title: string;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

const DashboardCard = ({ 
  title, 
  children, 
  className,
  icon,
  action
}: DashboardCardProps) => {
  return (
    <div 
      className={cn(
        "glass-card rounded-xl overflow-hidden animate-scale-in",
        className
      )}
    >
      <div className="p-5 border-b border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon && <span className="text-primary">{icon}</span>}
          <h2 className="section-title">{title}</h2>
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className="p-5">
        {children}
      </div>
    </div>
  );
};

export default DashboardCard;
