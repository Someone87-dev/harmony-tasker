
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { User, ArrowRight, Upload, LogIn } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import useLocalStorage from '@/hooks/useLocalStorage';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  bio: z.string().optional(),
});

const loginSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
});

const Landing = () => {
  const navigate = useNavigate();
  const [, setUser] = useLocalStorage('focusflow-user', null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState("signup");

  const signupForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      bio: "",
    },
  });

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      name: "",
    },
  });

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

  // Generate initials for avatar fallback
  const getInitials = (name: string) => {
    if (name) {
      return name.split(' ').map(part => part[0]).join('').toUpperCase();
    }
    return 'U';
  };

  const onSignup = (values: z.infer<typeof formSchema>) => {
    setUser({
      name: values.name,
      bio: values.bio || "FocusFlow Pro user",
      avatar: avatar || null,
    });
    
    // Reset all local storage data
    localStorage.removeItem('focusflow-tasks');
    localStorage.removeItem('focusflow-notes');
    localStorage.removeItem('focusflow-expenses');
    localStorage.removeItem('focusflow-habits');
    
    navigate('/dashboard');
  };

  const onLogin = (values: z.infer<typeof loginSchema>) => {
    // For simplicity, login just creates a new user with the name
    setUser({
      name: values.name,
      bio: "FocusFlow Pro user",
      avatar: null,
    });
    
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">F</div>
          <h1 className="text-3xl font-bold">Welcome to FocusFlow Pro</h1>
          <p className="text-muted-foreground mt-2">Your all-in-one productivity dashboard</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
            <TabsTrigger value="login">Login</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signup">
            <Form {...signupForm}>
              <form onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-6">
                <div className="flex justify-center mb-6">
                  <div
                    className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary/20 relative group cursor-pointer"
                    onClick={handleAvatarClick}
                  >
                    <Avatar className="w-full h-full">
                      <AvatarImage 
                        src={avatar || undefined} 
                        alt="User avatar" 
                        className="w-full h-full object-cover" 
                      />
                      <AvatarFallback className="text-3xl bg-primary/10 text-primary w-full h-full">
                        {getInitials(signupForm.watch("name") || "U")}
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
                </div>
                <p className="text-xs text-center text-muted-foreground -mt-4 mb-2">Click to upload avatar</p>
                
                <FormField
                  control={signupForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={signupForm.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>About You (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell us a little about yourself..." 
                          className="resize-none" 
                          {...field} 
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full">
                  Sign Up
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="login">
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-6">
                <div className="flex justify-center mb-6">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary/20 relative">
                    <Avatar className="w-full h-full">
                      <AvatarFallback className="text-3xl bg-primary/10 text-primary w-full h-full">
                        {getInitials(loginForm.watch("name") || "U")}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
                
                <FormField
                  control={loginForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full">
                  Login
                  <LogIn className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Landing;
