
import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '@/components/Sidebar';
import { Sun, Moon, User, Settings as SettingsIcon, Save, RefreshCw, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from "@/components/ui/use-toast";
import useLocalStorage from '@/hooks/useLocalStorage';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const Settings = () => {
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light');
  const [user, setUser] = useLocalStorage('focusflow-user', null);
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(user?.avatar || 'https://i.pravatar.cc/150?img=8');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Apply theme to the document
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfile = () => {
    setUser({
      ...user,
      name,
      email,
      bio,
      avatar
    });
    
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved.",
    });
  };

  const resetAllData = () => {
    if (confirm("Are you sure you want to reset all data? This action cannot be undone.")) {
      localStorage.removeItem('focusflow-tasks');
      localStorage.removeItem('focusflow-notes');
      localStorage.removeItem('focusflow-expenses');
      localStorage.removeItem('focusflow-habits');
      localStorage.removeItem('focusflow-pomodoro-settings');
      localStorage.removeItem('focusflow-currency');
      
      toast({
        title: "Data Reset",
        description: "All your data has been reset successfully.",
      });
    }
  };

  // Generate initials for avatar fallback
  const getInitials = () => {
    if (name) {
      return name.split(' ').map(part => part[0]).join('').toUpperCase();
    }
    return 'U';
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
            <section className="glass-card rounded-xl overflow-hidden p-6 border border-border bg-white/50 dark:bg-gray-800/50">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <User className="h-5 w-5" />
                User Profile
              </h2>
              <Separator className="mb-6" />
              
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-shrink-0">
                  <div
                    className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20 relative group cursor-pointer"
                    onClick={handleAvatarClick}
                  >
                    <Avatar className="w-full h-full">
                      <AvatarImage src={avatar} alt="User avatar" className="w-full h-full object-cover" />
                      <AvatarFallback className="text-3xl bg-primary/10 text-primary w-full h-full">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Upload className="h-8 w-8 text-white" />
                    </div>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      accept="image/*" 
                      onChange={handleFileChange} 
                      className="hidden"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-center mt-2">Click to upload avatar</p>
                </div>
                
                <div className="flex-grow space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                      Display Name
                    </label>
                    <Input 
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="focus-ring bg-white/80 dark:bg-gray-700/50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                      Email Address (Optional)
                    </label>
                    <Input 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="focus-ring bg-white/80 dark:bg-gray-700/50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                      Bio
                    </label>
                    <Textarea 
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="focus-ring resize-none bg-white/80 dark:bg-gray-700/50"
                      rows={3}
                    />
                  </div>
                  
                  <Button onClick={saveProfile}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Profile
                  </Button>
                </div>
              </div>
            </section>
            
            {/* Appearance */}
            <section className="glass-card rounded-xl overflow-hidden p-6 border border-border bg-white/50 dark:bg-gray-800/50">
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
                    className="h-10 w-10 border-primary/20 bg-white/80 dark:bg-gray-700/50"
                  >
                    {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                  </Button>
                </div>
              </div>
            </section>
            
            {/* Data Management */}
            <section className="glass-card rounded-xl overflow-hidden p-6 border border-border bg-white/50 dark:bg-gray-800/50">
              <h2 className="text-2xl font-semibold mb-4">Data Management</h2>
              <Separator className="mb-6" />
              
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium">Reset Data</h3>
                    <p className="text-sm text-muted-foreground">
                      Clear all your tasks, notes, expenses, and habits
                    </p>
                  </div>
                  
                  <Button 
                    onClick={resetAllData} 
                    variant="destructive"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset All Data
                  </Button>
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
