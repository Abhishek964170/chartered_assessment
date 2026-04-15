'use client';
import { useState, useEffect, useRef } from 'react';
import { useStore, RiskData } from '@/store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Bot, User, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const QUESTIONS = [
  {
    id: 'timeline',
    question: "What is the client's primary investment timeline?",
    options: [
      { label: 'Short term (< 3 years)', value: 'short' },
      { label: 'Medium term (3-7 years)', value: 'medium' },
      { label: 'Long term (7+ years)', value: 'long' },
    ]
  },
  {
    id: 'riskTolerance',
    question: "How would you describe their risk tolerance?",
    options: [
      { label: 'Conservative (Capital Preservation)', value: 'low' },
      { label: 'Moderate (Balanced Growth)', value: 'medium' },
      { label: 'Aggressive (Maximum Growth)', value: 'high' },
    ]
  },
  {
    id: 'liquidity',
    question: "What are their liquidity needs in the next 12 months?",
    options: [
      { label: 'High (Need cash soon)', value: 'high' },
      { label: 'Moderate (Standard reserves)', value: 'medium' },
      { label: 'Low (Fully invested)', value: 'low' },
    ]
  }
];

export default function Stage2() {
  const { riskData, setRiskData, nextStage, prevStage } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    let answered = 0;
    if (riskData.timeline) answered++;
    if (riskData.riskTolerance) answered++;
    if (riskData.liquidity) answered++;
    
    if (answered === 0) setCurrentIndex(0);
    else if (answered === 1) setCurrentIndex(1);
    else if (answered === 2) setCurrentIndex(2);
    else setCurrentIndex(2);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentIndex, riskData]);

  const handleSelect = (questionId: string, value: string) => {
    setRiskData({ [questionId]: value } as Partial<RiskData>);
    
    if (currentIndex < QUESTIONS.length - 1) {
      setTimeout(() => {
        setCurrentIndex(c => c + 1);
      }, 400);
    }
  };

  const getScore = () => {
    let answered = 0;
    if (riskData.timeline) answered++;
    if (riskData.riskTolerance) answered++;
    if (riskData.liquidity) answered++;
    return Math.round((answered / QUESTIONS.length) * 100);
  };

  const score = getScore();
  const canProceed = score >= 66;

  const history = QUESTIONS.slice(0, currentIndex);
  const currentQ = QUESTIONS[currentIndex];

  return (
    <div className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-xl shadow-slate-200/40 dark:shadow-none flex flex-col h-[650px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2 text-slate-900 dark:text-white">Risk & Goals</h2>
          <p className="text-slate-500 dark:text-zinc-400">Complete the profiling to unlock AI analysis.</p>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn("text-sm font-bold", score < 66 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400")}>
              {score}% Coverage
            </span>
          </div>
          <div className="w-32 h-2.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className={cn("h-full transition-all duration-500", score < 66 ? "bg-amber-500" : "bg-emerald-500")}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>
      </div>
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto mb-6 pr-2 space-y-6 flex flex-col pt-4 scroll-smooth">
        <AnimatePresence initial={false}>
          {history.map((q, idx) => (
            <motion.div 
              key={`hist-${q.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="bg-slate-50 dark:bg-zinc-800/50 rounded-2xl rounded-tl-none p-4 text-slate-700 dark:text-zinc-300">
                  {q.question}
                </div>
              </div>
              
              {riskData[q.id as keyof RiskData] && (
                <div className="flex gap-4 flex-row-reverse">
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-zinc-700 flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="w-4 h-4 text-slate-600 dark:text-zinc-300" />
                  </div>
                  <div className="bg-indigo-600 text-white rounded-2xl rounded-tr-none p-4 shadow-sm shadow-indigo-600/10">
                    {q.options.find(o => o.value === riskData[q.id as keyof RiskData])?.label}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
          
          {currentQ && (
            <motion.div 
              key={`curr-${currentQ.id}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-700/50 rounded-2xl rounded-tl-none p-5 text-slate-700 dark:text-zinc-300 shadow-sm w-full max-w-xl">
                  <p className="mb-4 font-medium text-slate-900 dark:text-white">{currentQ.question}</p>
                  <div className="flex flex-col gap-2">
                    {currentQ.options.map(opt => {
                      const isSelected = riskData[currentQ.id as keyof RiskData] === opt.value;
                      return (
                        <button
                          key={opt.value}
                          onClick={() => handleSelect(currentQ.id, opt.value)}
                          className={cn(
                            "px-4 py-3 rounded-xl text-left transition-all border",
                            isSelected 
                              ? "bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-500/10 dark:border-indigo-500/30 dark:text-indigo-300 font-medium" 
                              : "bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50 dark:bg-zinc-900 dark:border-zinc-700 dark:hover:border-indigo-500/50 dark:text-zinc-300"
                          )}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {score === 100 && (
             <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center pt-4"
             >
               <div className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-5 py-2.5 rounded-full flex items-center gap-2 text-sm font-bold shadow-sm">
                 <CheckCircle2 className="w-5 h-5" />
                 Assessment Complete
               </div>
             </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="pt-6 border-t border-slate-100 dark:border-zinc-800 flex justify-between mt-auto">
        <button 
          onClick={prevStage}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200 px-4 py-3 rounded-xl font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button 
          onClick={nextStage}
          disabled={!canProceed}
          className="flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 dark:disabled:bg-zinc-800 disabled:text-slate-400 dark:disabled:text-zinc-600 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20 disabled:shadow-none translate-y-0 hover:-translate-y-0.5 active:translate-y-0"
        >
          Run AI Analysis
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
