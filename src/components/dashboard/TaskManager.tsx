
import React, { useState } from 'react';
import { CheckCircle2, Circle, Plus, Clock, AlertTriangle, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import DashboardCard from '../ui/DashboardCard';
import useLocalStorage from '@/hooks/useLocalStorage';
import { Task } from '@/types';

const TaskManager = () => {
  const [tasks, setTasks] = useLocalStorage<Task[]>('focusflow-tasks', []);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newTaskTitle.trim() === '') return;
    
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: newTaskTitle,
      description: '',
      completed: false,
      priority: newTaskPriority,
      createdAt: new Date(),
    };
    
    setTasks([newTask, ...tasks]);
    setNewTaskTitle('');
    setNewTaskPriority('medium');
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
    <DashboardCard 
      title="Tasks" 
      icon={<CheckCircle2 />}
      className="col-span-2 md:col-span-1 md:row-span-2"
    >
      <form onSubmit={addTask} className="mb-4 flex">
        <div className="flex-1">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Add a new task..."
            className="w-full px-3 py-2 bg-white/50 border border-border rounded-l-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
        </div>
        <select
          value={newTaskPriority}
          onChange={(e) => setNewTaskPriority(e.target.value as 'low' | 'medium' | 'high')}
          className="px-2 py-2 bg-white/50 border-y border-r-0 border-l-0 border-border focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button
          type="submit"
          className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-r-lg transition-colors duration-200 focus-ring"
          aria-label="Add task"
        >
          <Plus size={20} />
        </button>
      </form>

      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
        {tasks.length === 0 ? (
          <p className="text-center py-6 text-muted-foreground">
            No tasks yet. Add some tasks to get started!
          </p>
        ) : (
          tasks.map(task => (
            <div 
              key={task.id}
              className={cn(
                "px-4 py-3 rounded-lg border flex items-center gap-3 group transition-all duration-200",
                task.completed ? "bg-secondary/50 border-secondary" : "bg-white border-border"
              )}
            >
              <button
                onClick={() => toggleTaskCompletion(task.id)}
                className="focus-ring rounded-full"
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
                  "transition-all duration-200",
                  task.completed && "line-through text-muted-foreground"
                )}>
                  {task.title}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <span className={cn(
                  "text-xs px-2 py-1 rounded-full border flex items-center gap-1",
                  priorityClasses[task.priority]
                )}>
                  {priorityIcons[task.priority]}
                  {task.priority}
                </span>
                
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-muted-foreground hover:text-destructive focus-ring rounded"
                  aria-label="Delete task"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardCard>
  );
};

export default TaskManager;
