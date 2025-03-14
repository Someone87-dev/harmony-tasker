
import React, { useState, useEffect, useRef } from 'react';
import { Clock, Play, Pause, SkipForward, Settings as SettingsIcon } from 'lucide-react';
import DashboardCard from '../ui/DashboardCard';
import useLocalStorage from '@/hooks/useLocalStorage';
import { PomodoroSettings } from '@/types';
import { cn } from '@/lib/utils';

const PomodoroTimer = () => {
  const [settings, setSettings] = useLocalStorage<PomodoroSettings>('focusflow-pomodoro-settings', {
    workDuration: 25,
    breakDuration: 5,
    longBreakDuration: 15,
    sessionsBeforeLongBreak: 4
  });
  
  const [timeLeft, setTimeLeft] = useState(settings.workDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'work' | 'break' | 'longBreak'>('work');
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  
  const [settingsForm, setSettingsForm] = useState({
    workDuration: settings.workDuration,
    breakDuration: settings.breakDuration,
    longBreakDuration: settings.longBreakDuration,
    sessionsBeforeLongBreak: settings.sessionsBeforeLongBreak
  });
  
  const timerRef = useRef<number | null>(null);
  
  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning]);
  
  const handleTimerComplete = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    const audio = new Audio('/notification.mp3');
    audio.play().catch(e => console.log('Audio play failed:', e));
    
    if (mode === 'work') {
      const newSessionsCompleted = sessionsCompleted + 1;
      setSessionsCompleted(newSessionsCompleted);
      
      if (newSessionsCompleted % settings.sessionsBeforeLongBreak === 0) {
        setMode('longBreak');
        setTimeLeft(settings.longBreakDuration * 60);
      } else {
        setMode('break');
        setTimeLeft(settings.breakDuration * 60);
      }
    } else {
      setMode('work');
      setTimeLeft(settings.workDuration * 60);
    }
    
    setIsRunning(false);
  };
  
  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };
  
  const skipToNext = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    if (mode === 'work') {
      const newSessionsCompleted = sessionsCompleted + 1;
      setSessionsCompleted(newSessionsCompleted);
      
      if (newSessionsCompleted % settings.sessionsBeforeLongBreak === 0) {
        setMode('longBreak');
        setTimeLeft(settings.longBreakDuration * 60);
      } else {
        setMode('break');
        setTimeLeft(settings.breakDuration * 60);
      }
    } else {
      setMode('work');
      setTimeLeft(settings.workDuration * 60);
    }
    
    setIsRunning(false);
  };
  
  const saveSettings = () => {
    setSettings(settingsForm);
    
    if (mode === 'work') {
      setTimeLeft(settingsForm.workDuration * 60);
    } else if (mode === 'break') {
      setTimeLeft(settingsForm.breakDuration * 60);
    } else {
      setTimeLeft(settingsForm.longBreakDuration * 60);
    }
    
    setShowSettings(false);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const modeColors = {
    work: 'from-blue-500 to-indigo-600',
    break: 'from-teal-500 to-green-500',
    longBreak: 'from-amber-500 to-yellow-500'
  };
  
  const progress = (() => {
    const totalSeconds = (() => {
      if (mode === 'work') return settings.workDuration * 60;
      if (mode === 'break') return settings.breakDuration * 60;
      return settings.longBreakDuration * 60;
    })();
    
    return (timeLeft / totalSeconds) * 100;
  })();
  
  return (
    <DashboardCard 
      title="Pomodoro Timer" 
      icon={<Clock />}
      action={
        <button
          onClick={() => setShowSettings(true)}
          className="text-muted-foreground hover:text-foreground focus-ring rounded p-1"
          aria-label="Timer settings"
        >
          <SettingsIcon size={18} />
        </button>
      }
      className="col-span-2 md:col-span-1"
    >
      {showSettings ? (
        <div className="space-y-4 bg-white/80 dark:bg-gray-700/50 p-4 rounded-lg border border-border">
          <h3 className="font-medium">Timer Settings</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Work Duration (minutes)
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={settingsForm.workDuration}
                onChange={(e) => setSettingsForm({
                  ...settingsForm,
                  workDuration: parseInt(e.target.value) || 25
                })}
                className="w-full px-3 py-2 bg-white/80 dark:bg-gray-800/50 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Break Duration (minutes)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={settingsForm.breakDuration}
                onChange={(e) => setSettingsForm({
                  ...settingsForm,
                  breakDuration: parseInt(e.target.value) || 5
                })}
                className="w-full px-3 py-2 bg-white/80 dark:bg-gray-800/50 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Long Break Duration (minutes)
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={settingsForm.longBreakDuration}
                onChange={(e) => setSettingsForm({
                  ...settingsForm,
                  longBreakDuration: parseInt(e.target.value) || 15
                })}
                className="w-full px-3 py-2 bg-white/80 dark:bg-gray-800/50 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Sessions Before Long Break
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={settingsForm.sessionsBeforeLongBreak}
                onChange={(e) => setSettingsForm({
                  ...settingsForm,
                  sessionsBeforeLongBreak: parseInt(e.target.value) || 4
                })}
                className="w-full px-3 py-2 bg-white/80 dark:bg-gray-800/50 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-2">
            <button
              onClick={() => setShowSettings(false)}
              className="px-4 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-lg transition-colors duration-200 focus-ring border border-border"
            >
              Cancel
            </button>
            <button
              onClick={saveSettings}
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors duration-200 focus-ring"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center bg-white/80 dark:bg-gray-700/50 p-6 rounded-lg border border-border">
          <div className="relative inline-block w-48 h-48 mb-4">
            <div className="absolute inset-0 rounded-full bg-secondary/30" />
            
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="rgba(200, 200, 200, 0.2)"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={`url(#gradient-${mode})`}
                strokeWidth="8"
                strokeDasharray="283"
                strokeDashoffset={283 - (283 * progress) / 100}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id={`gradient-${mode}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" className={`stop-${mode}-start`} />
                  <stop offset="100%" className={`stop-${mode}-end`} />
                </linearGradient>
              </defs>
            </svg>
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div>
                <div className="text-4xl font-semibold tracking-tighter">
                  {formatTime(timeLeft)}
                </div>
                <div className={cn(
                  "text-xs font-medium uppercase tracking-wider mt-1",
                  mode === 'work' ? "text-blue-500 dark:text-blue-400" : 
                  mode === 'break' ? "text-teal-500 dark:text-teal-400" : 
                  "text-amber-500 dark:text-amber-400"
                )}>
                  {mode === 'work' ? 'Focus' : mode === 'break' ? 'Short Break' : 'Long Break'}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center space-x-4 mb-6">
            <button
              onClick={toggleTimer}
              className={cn(
                "w-12 h-12 flex items-center justify-center rounded-full shadow-md transition-transform duration-200 hover:scale-105 focus-ring text-white",
                mode === 'work' ? "bg-gradient-to-br from-blue-500 to-indigo-600" :
                mode === 'break' ? "bg-gradient-to-br from-teal-500 to-green-500" :
                "bg-gradient-to-br from-amber-500 to-yellow-500"
              )}
              aria-label={isRunning ? 'Pause timer' : 'Start timer'}
            >
              {isRunning ? <Pause size={20} /> : <Play size={20} />}
            </button>
            
            <button
              onClick={skipToNext}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 border border-border shadow-sm text-foreground transition-colors duration-200 hover:bg-secondary focus-ring"
              aria-label="Skip to next"
            >
              <SkipForward size={20} />
            </button>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Session {sessionsCompleted % settings.sessionsBeforeLongBreak || settings.sessionsBeforeLongBreak} of {settings.sessionsBeforeLongBreak}
          </div>
        </div>
      )}
      
      <style>
        {`
          .stop-work-start { stop-color: #3b82f6; }
          .stop-work-end { stop-color: #4f46e5; }
          .stop-break-start { stop-color: #10b981; }
          .stop-break-end { stop-color: #059669; }
          .stop-longBreak-start { stop-color: #f59e0b; }
          .stop-longBreak-end { stop-color: #eab308; }
        `}
      </style>
    </DashboardCard>
  );
};

export default PomodoroTimer;
