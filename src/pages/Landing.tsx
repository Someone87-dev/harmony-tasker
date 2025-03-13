
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { User, ArrowRight } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import useLocalStorage from '@/hooks/useLocalStorage';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  bio: z.string().optional(),
  avatar: z.string().optional(),
});

const Landing = () => {
  const navigate = useNavigate();
  const [, setUser] = useLocalStorage('focusflow-user', null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      bio: "",
      avatar: "https://i.pravatar.cc/150?img=8",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setUser({
      name: values.name,
      bio: values.bio || "FocusFlow Pro user",
      avatar: values.avatar || "https://i.pravatar.cc/150?img=8",
    });
    
    // Reset all local storage data
    localStorage.removeItem('focusflow-tasks');
    localStorage.removeItem('focusflow-notes');
    localStorage.removeItem('focusflow-expenses');
    localStorage.removeItem('focusflow-habits');
    
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
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
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
              control={form.control}
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
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Landing;
