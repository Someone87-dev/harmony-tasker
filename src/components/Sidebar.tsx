
import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  Clock, 
  FileText, 
  Home, 
  Menu, 
  Swords, 
  BarChart4, 
  Settings,
  X,
  User,
  LogOut
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useLocalStorage from '@/hooks/useLocalStorage';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [user] = useLocalStorage('focusflow-user', null);
  const [theme] = useLocalStorage<'light' | 'dark'>('theme', 'light');

  useEffect(() => {
    // Close sidebar on mobile when navigation occurs
    setIsOpen(false);
  }, [location.pathname]);

  const menuItems = [
    { name: 'Dashboard', icon: <Home size={20} />, path: '/dashboard' },
    { name: 'Tasks', icon: <CheckCircle size={20} />, path: '/tasks' },
    { name: 'Notes', icon: <FileText size={20} />, path: '/notes' },
    { name: 'Expenses', icon: <BarChart4 size={20} />, path: '/expenses' },
    { name: 'Habits', icon: <Swords size={20} />, path: '/habits' },
    { name: 'Focus Timer', icon: <Clock size={20} />, path: '/focus' },
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    if (confirm("Are you sure you want to log out?")) {
      localStorage.removeItem('focusflow-user');
      navigate('/');
    }
  };

  return (
    <>
      <button 
        onClick={toggleSidebar} 
        className="fixed top-4 left-4 z-50 bg-white/80 dark:bg-gray-800/80 p-2 rounded-lg shadow-md backdrop-blur-sm hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-300 border border-border/50 focus-ring"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <div className={`fixed inset-y-0 left-0 z-40 w-64 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:translate-x-0 md:w-16 md:hover:w-64 group ${theme === 'dark' ? 'dark' : ''}`}>
        <div className="glass-panel h-full flex flex-col bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-r border-border/10 dark:border-white/10 shadow-lg">
          <div className="p-6 border-b border-border/50 dark:border-white/10 flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-white font-bold">F</div>
            <h1 className="text-xl font-semibold tracking-tight md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">FocusFlow Pro</h1>
          </div>
          
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.name}>
                  <Link 
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors duration-200 focus-ring ${isActive(item.path) ? 'bg-primary/10 text-primary dark:bg-primary/20' : ''}`}
                  >
                    <span className={`flex-shrink-0 ${isActive(item.path) ? 'text-primary' : 'text-muted-foreground'}`}>{item.icon}</span>
                    <span className={`font-medium md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 ${isActive(item.path) ? 'text-primary' : ''}`}>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="p-4 border-t border-border/50 dark:border-white/10">
            <Link 
              to="/settings"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors duration-200 focus-ring ${isActive('/settings') ? 'bg-primary/10 text-primary dark:bg-primary/20' : ''}`}
            >
              <span className={`flex-shrink-0 ${isActive('/settings') ? 'text-primary' : 'text-muted-foreground'}`}><Settings size={20} /></span>
              <span className={`font-medium md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 ${isActive('/settings') ? 'text-primary' : ''}`}>Settings</span>
            </Link>
            
            <button
              onClick={handleLogout}
              className="w-full mt-2 flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors duration-200 focus-ring"
            >
              <span className="flex-shrink-0 text-muted-foreground"><LogOut size={20} /></span>
              <span className="font-medium md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">Log Out</span>
            </button>
            
            {user && (
              <div className="mt-4 flex items-center gap-3 px-4 py-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full object-cover" />
                  ) : (
                    <User size={16} className="text-primary" />
                  )}
                </div>
                <div className="md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 truncate">
                  <p className="text-sm font-medium truncate">{user.name || 'User'}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email || user.bio || 'FocusFlow User'}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="md:pl-16 transition-all duration-300"></div>
      
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/5 backdrop-blur-sm z-30 md:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default Sidebar;
