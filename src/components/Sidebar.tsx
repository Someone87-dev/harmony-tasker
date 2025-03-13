
import React, { useState } from 'react';
import { 
  CheckCircle, 
  Clock, 
  FileText, 
  Home, 
  Menu, 
  Swords, 
  BarChart4, 
  Settings,
  X
} from 'lucide-react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', icon: <Home size={20} /> },
    { name: 'Tasks', icon: <CheckCircle size={20} /> },
    { name: 'Notes', icon: <FileText size={20} /> },
    { name: 'Expenses', icon: <BarChart4 size={20} /> },
    { name: 'Habits', icon: <Swords size={20} /> },
    { name: 'Focus Timer', icon: <Clock size={20} /> },
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button 
        onClick={toggleSidebar} 
        className="fixed top-4 left-4 z-50 bg-white/80 p-2 rounded-lg shadow-md backdrop-blur-sm hover:bg-white/90 transition-all duration-300 border border-border/50 focus-ring"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <div className={`fixed inset-y-0 left-0 z-40 w-64 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
        <div className="glass-panel h-full flex flex-col">
          <div className="p-6 border-b border-border/50">
            <h1 className="text-xl font-semibold tracking-tight">FocusFlow Pro</h1>
          </div>
          
          <nav className="flex-1 p-4">
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.name}>
                  <a 
                    href="#" 
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-white/50 transition-colors duration-200 focus-ring"
                  >
                    <span className="text-primary">{item.icon}</span>
                    <span className="font-medium">{item.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="p-4 border-t border-border/50">
            <a 
              href="#" 
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-white/50 transition-colors duration-200 focus-ring"
            >
              <span className="text-primary"><Settings size={20} /></span>
              <span className="font-medium">Settings</span>
            </a>
          </div>
        </div>
      </div>
      
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/5 backdrop-blur-sm z-30"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default Sidebar;
