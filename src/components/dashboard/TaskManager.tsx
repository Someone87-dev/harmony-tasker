
import React, { useState } from 'react';
import { CheckCircle2, Circle, Plus, Clock, AlertTriangle, Trash2, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import DashboardCard from '../ui/DashboardCard';
import useLocalStorage from '@/hooks/useLocalStorage';
import { Task } from '@/types';

const TaskManager = () => {
  const [tasks, setTasks] = useLocalStorage<Task[]>('focusflow-tasks', []);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [showAddForm, setShowAddForm] = useState(false);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newTaskTitle.trim() === '') return;
    
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: newTaskTitle,
      description: newTaskDescription,
      completed: false,
      priority: newTaskPriority,
      createdAt: new Date(),
      dueDate: newTaskDueDate ? new Date(newTaskDueDate) : undefined,
    };
    
    setTasks([newTask, ...tasks]);
    setNewTaskTitle('');
    setNewTaskDescription('');
    setNewTaskDueDate('');
    setNewTaskPriority('medium');
    setShowAddForm(false);
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
    low: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    medium: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    high: 'bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
  };

  return (
    <DashboardCard 
      title="Tasks" 
      icon={<CheckCircle2 />}
      className="col-span-2 md:col-span-1 md:row-span-2"
    >
      {showAddForm ? (
        <form onSubmit={addTask} className="mb-4 space-y-3 bg-white/80 dark:bg-gray-700/50 p-4 rounded-lg border border-border">
          <div>
            <label htmlFor="task-title" className="block text-sm font-medium text-muted-foreground mb-1">Task Title</label>
            <input
              id="task-title"
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Task title..."
              className="w-full px-3 py-2 bg-white/80 dark:bg-gray-800/50 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              required
            />
          </div>
          
          <div>
            <label htmlFor="task-description" className="block text-sm font-medium text-muted-foreground mb-1">Description (Optional)</label>
            <textarea
              id="task-description"
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              placeholder="Task description..."
              className="w-full px-3 py-2 bg-white/80 dark:bg-gray-800/50 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-none"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="task-due-date" className="block text-sm font-medium text-muted-foreground mb-1">Due Date (Optional)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar size={16} className="text-muted-foreground" />
                </div>
                <input
                  id="task-due-date"
                  type="date"
                  value={newTaskDueDate}
                  onChange={(e) => setNewTaskDueDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white/80 dark:bg-gray-800/50 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="task-priority" className="block text-sm font-medium text-muted-foreground mb-1">Priority</label>
              <select
                id="task-priority"
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value as 'low' | 'medium' | 'high')}
                className="w-full px-3 py-2 bg-white/80 dark:bg-gray-800/50 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-lg transition-colors duration-200 focus-ring"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg transition-colors duration-200 focus-ring"
            >
              Add Task
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full mb-4 flex items-center justify-center gap-2 px-4 py-3 bg-white/80 dark:bg-gray-700/50 hover:bg-primary/10 dark:hover:bg-primary/20 border border-dashed border-border rounded-lg text-muted-foreground hover:text-primary transition-colors duration-200 focus-ring"
        >
          <Plus size={18} />
          <span>Add New Task</span>
        </button>
      )}

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
                "px-4 py-3 rounded-lg border flex flex-col gap-2 group transition-all duration-200",
                task.completed 
                  ? "bg-secondary/50 dark:bg-secondary/30 border-secondary" 
                  : "bg-white/80 dark:bg-gray-700/50 border-border"
              )}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleTaskCompletion(task.id)}
                  className="focus-ring rounded-full flex-shrink-0 mt-1"
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
                      task.completed && "line-through opacity-70"
                    )}>
                      {task.description}
                    </p>
                  )}
                </div>
                
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-muted-foreground hover:text-destructive focus-ring rounded"
                  aria-label="Delete task"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              <div className="flex items-center gap-2 mt-1">
                <span className={cn(
                  "text-xs px-2 py-1 rounded-full border flex items-center gap-1",
                  priorityClasses[task.priority]
                )}>
                  {priorityIcons[task.priority]}
                  {task.priority}
                </span>
                
                {task.dueDate && (
                  <span className="text-xs bg-secondary/50 dark:bg-secondary/30 text-foreground px-2 py-1 rounded-full flex items-center gap-1">
                    <Calendar size={12} />
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardCard>
  );
};

export default TaskManager;
