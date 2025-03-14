export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  dueDate?: Date;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  lastEdited: Date;
  createdAt: Date;
  pinned: boolean;
}

export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: Date;
  currency?: string;
}

export interface Habit {
  id: string;
  name: string;
  description?: string;
  completedDates: Date[];
  createdAt: Date;
  frequency: 'daily' | 'weekly';
}

export interface PomodoroSettings {
  workDuration: number;
  breakDuration: number;
  longBreakDuration: number;
  sessionsBeforeLongBreak: number;
}

export interface UserSettings {
  pomodoro: PomodoroSettings;
}
