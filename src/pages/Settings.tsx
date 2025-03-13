
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { Sun, Moon, User, Settings as SettingsIcon, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const Settings = () => {
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light');
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://i.pravatar.cc/150?img=8',
  });

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <main className="pb-16 pt-4 px-4 md:pl-16 transition-all duration-300">
        <div className="max-w-3xl mx-auto">
          <header className="py-8 md:py-12">
            <div className="animate-fade-in">
              <h1 className="text-4xl font-bold tracking-tight flex items-center gap-2">
                <SettingsIcon className="h-8 w-8" />
                Settings
              </h1>
              <p className="text-muted-foreground mt-2">Customize your FocusFlow Pro experience</p>
            </div>
          </header>
          
          <div className="space-y-10 animate-fade-in">
            {/* User Profile */}
            <section className="glass-card rounded-xl overflow-hidden p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <User className="h-5 w-5" />
                User Profile
              </h2>
              <Separator className="mb-6" />
              
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20">
                    <img 
                      src={user.avatar} 
                      alt="User avatar" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                
                <div className="flex-grow space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                      Display Name
                    </label>
                    <input 
                      type="text"
                      value={user.name}
                      onChange={(e) => setUser({...user, name: e.target.value})}
                      className="w-full px-4 py-2 rounded-md border border-border bg-white/50 focus-ring"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                      Email Address
                    </label>
                    <input 
                      type="email"
                      value={user.email}
                      onChange={(e) => setUser({...user, email: e.target.value})}
                      className="w-full px-4 py-2 rounded-md border border-border bg-white/50 focus-ring"
                    />
                  </div>
                  
                  <Button className="mt-2">
                    <Save className="h-4 w-4 mr-2" />
                    Save Profile
                  </Button>
                </div>
              </div>
            </section>
            
            {/* Appearance */}
            <section className="glass-card rounded-xl overflow-hidden p-6">
              <h2 className="text-2xl font-semibold mb-4">Appearance</h2>
              <Separator className="mb-6" />
              
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium">Theme</h3>
                    <p className="text-sm text-muted-foreground">
                      Switch between light and dark mode
                    </p>
                  </div>
                  
                  <Button 
                    onClick={toggleTheme} 
                    variant="outline" 
                    size="icon" 
                    className="h-10 w-10"
                  >
                    {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                  </Button>
                </div>
              </div>
            </section>
            
            {/* App Settings */}
            <section className="glass-card rounded-xl overflow-hidden p-6">
              <h2 className="text-2xl font-semibold mb-4">App Settings</h2>
              <Separator className="mb-6" />
              
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium">Notifications</h3>
                    <p className="text-sm text-muted-foreground">
                      Enable desktop notifications
                    </p>
                  </div>
                  
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
