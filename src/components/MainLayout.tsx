'use client';
import { useState, useEffect } from 'react';
import { Stepper } from './Stepper';
import { Moon, Sun } from 'lucide-react';
import { useStore } from '@/store/useStore';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);
  const resetSession = useStore(state => state.resetSession);

  useEffect(() => {
    setMounted(true);
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (isDark) {
      document.documentElement.classList.add('dark');
      setTheme('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (theme === 'light') {
      document.documentElement.classList.add('dark');
      setTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      setTheme('light');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-gray-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={resetSession}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
               <span className="text-white font-black text-xl leading-none tracking-tighter">C</span>
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">Chartered</span>
          </div>
          
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Toggle Dark Mode"
          >
            {theme === 'light' ? <Moon className="w-5 h-5 text-slate-600" /> : <Sun className="w-5 h-5 text-slate-300" />}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col items-center">
        <Stepper />
        
        <div className="mt-16 w-full max-w-4xl">
          {children}
        </div>
      </main>
    </div>
  );
}
