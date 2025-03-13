
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { CheckCircle2, Circle, Plus, Clock, AlertTriangle, Trash2, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import useLocalStorage from '@/hooks/useLocalStorage';
import { Task } from '@/types';

const Tasks = () => {
  const [tasks, setTasks] = useLocalStorage<Task[]>('focusflow-tasks', []);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newTaskTitle.trim() === '') return;
    
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: newTaskTitle,
      description: newTaskDescription,
      completed: false,
      priority: newTaskPriority,
      dueDate: newTaskDueDate ? new Date(newTaskDueDate) : undefined,
      createdAt: new Date(),
    };
    
    setTasks([newTask, ...tasks]);
    setNewTaskTitle('');
    setNewTaskDescription('');
    setNewTaskPriority('medium');
    setNewTaskDueDate('');
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const priorityIcons = {
    low: <Clock size={16} className="text-blue-400" />,
    medium: <Clock size={16} className="text-amber-400" />,
    high: <AlertTriangle size={16} className="text-rose-500" />
  };

  const priorityClasses = {
    low: 'bg-blue-50 text-blue-700 border-blue-200',
    medium: 'bg-amber-50 text-amber-700 border-amber-200',
    high: 'bg-rose-50 text-rose-700 border-rose-200'
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <main className="pb-16 pt-4 px-4 md:pl-16 transition-all duration-300">
        <div className="max-w-3xl mx-auto">
          <header className="py-8 md:py-12">
            <div className="animate-fade-in">
              <h1 className="text-4xl font-bold tracking-tight flex items-center gap-2">
                <CheckCircle2 className="h-8 w-8" />
                Tasks
              </h1>
              <p className="text-muted-foreground mt-2">Manage your tasks and stay organized</p>
            </div>
          </header>
          
          <div className="space-y-8 animate-fade-in">
            <div className="glass-card rounded-xl p-6 border border-border bg-white/50">
              <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
              <form onSubmit={addTask} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Task Name
                  </label>
                  <Input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Enter task name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Description
                  </label>
                  <Textarea
                    value={newTaskDescription}
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                    placeholder="Task description (optional)"
                    className="resize-none"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                      Priority
                    </label>
                    <select
                      value={newTaskPriority}
                      onChange={(e) => setNewTaskPriority(e.target.value as 'low' | 'medium' | 'high')}
                      className="w-full px-3 py-2 bg-white border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                      Due Date
                    </label>
                    <Input
                      type="date"
                      value={newTaskDueDate}
                      onChange={(e) => setNewTaskDueDate(e.target.value)}
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full">
                  <Plus size={20} className="mr-2" />
                  Add Task
                </Button>
              </form>
            </div>
            
            <div className="glass-card rounded-xl p-6 border border-border bg-white/50">
              <h2 className="text-xl font-semibold mb-4">Your Tasks</h2>
              <Separator className="mb-4" />
              
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {tasks.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle2 className="mx-auto h-12 w-12 text-muted-foreground/50 mb-2" />
                    <p>No tasks yet. Add some tasks to get started!</p>
                  </div>
                ) : (
                  tasks.map(task => (
                    <div 
                      key={task.id}
                      className={cn(
                        "px-4 py-4 rounded-lg border flex items-start gap-3 group transition-all duration-200",
                        task.completed ? "bg-secondary/30 border-secondary" : "bg-white border-border"
                      )}
                    >
                      <button
                        onClick={() => toggleTaskCompletion(task.id)}
                        className="focus-ring rounded-full mt-1"
                        aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
                      >
                        {task.completed ? (
                          <CheckCircle2 className="text-primary h-5 w-5" />
                        ) : (
                          <Circle className="text-muted-foreground h-5 w-5" />
                        )}
                      </button>
                      
                      <div className="flex-1">
                        <p className={cn(
                          "font-medium transition-all duration-200",
                          task.completed && "line-through text-muted-foreground"
                        )}>
                          {task.title}
                        </p>
                        
                        {task.description && (
                          <p className={cn(
                            "text-sm text-muted-foreground mt-1",
                            task.completed && "line-through"
                          )}>
                            {task.description}
                          </p>
                        )}
                        
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <span className={cn(
                            "text-xs px-2 py-1 rounded-full border flex items-center gap-1",
                            priorityClasses[task.priority]
                          )}>
                            {priorityIcons[task.priority]}
                            {task.priority}
                          </span>
                          
                          {task.dueDate && (
                            <span className="text-xs px-2 py-1 rounded-full border bg-gray-50 text-gray-700 border-gray-200 flex items-center gap-1">
                              <Calendar size={16} />
                              {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-muted-foreground hover:text-destructive focus-ring rounded"
                        aria-label="Delete task"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Tasks;
