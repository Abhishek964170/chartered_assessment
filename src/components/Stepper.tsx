'use client';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

const steps = [
  { id: 1, name: 'Client Profile' },
  { id: 2, name: 'Risk & Goals' },
  { id: 3, name: 'AI Analysis' },
  { id: 4, name: 'Recommendations' },
  { id: 5, name: 'Dashboard' },
];

export function Stepper() {
  const currentStage = useStore((state) => state.currentStage);

  return (
    <div className="w-full py-6 md:px-12 flex justify-center">
      <div className="flex items-center w-full max-w-4xl relative">
        <div className="absolute top-1/2 left-0 w-[95%] sm:w-[98%] h-[2px] bg-gray-200 dark:bg-zinc-800 -z-10 -translate-y-1/2 mx-auto inset-x-0"></div>
        
        {/* Animated Progress Line */}
        <motion.div 
          className="absolute top-1/2 left-0 h-[2px] bg-indigo-600 dark:bg-indigo-500 -z-10 -translate-y-1/2 mx-auto inset-x-0 origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: (currentStage - 1) / (steps.length - 1) }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />

        {steps.map((step, idx) => {
          const isCompleted = currentStage > step.id;
          const isCurrent = currentStage === step.id;

          return (
             <div key={step.id} className="flex-1 flex flex-col items-center relative">
               <div className={cn(
                 "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm border-2 bg-white dark:bg-zinc-950",
                 isCompleted ? "border-indigo-600 bg-indigo-600 text-white dark:bg-indigo-500" : 
                 isCurrent ? "border-indigo-600 text-indigo-600 dark:text-indigo-400" :
                 "border-gray-300 dark:border-zinc-700 text-gray-400 dark:text-gray-600"
               )}>
                 {isCompleted ? <Check className="w-5 h-5 text-white" /> : <span className="text-sm font-semibold">{step.id}</span>}
               </div>
               <span className={cn(
                 "absolute -bottom-8 w-max text-xs sm:text-sm transition-all duration-300",
                 isCurrent ? "text-indigo-600 dark:text-indigo-400 font-bold translate-y-1" : 
                 isCompleted ? "text-slate-800 dark:text-slate-200 font-medium" : "text-slate-400 dark:text-slate-600"
               )}>
                 {step.name}
               </span>
             </div>
          );
        })}
      </div>
    </div>
  );
}
