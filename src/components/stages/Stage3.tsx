'use client';
import { useStore } from '@/store/useStore';
import { useAgentPipeline } from '@/hooks/useAgentPipeline';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, BrainCircuit, Activity, PieChart, ShieldAlert, CheckCircle2, Loader2, Play, Clock, AlertTriangle, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Stage3() {
  const { clientData, nextStage, prevStage } = useStore();
  const { status, errorMsg, a1Progress, a2Progress, a3Progress, overall, startPipeline } = useAgentPipeline();

  // Dynamic calculated metrics for UI rendering
  const a1Docs = Math.floor((a1Progress / 100) * Math.max(1, clientData.files.length));
  const a1Holdings = Math.floor((a1Progress / 100) * 47);
  const a1Assets = Math.floor((a1Progress / 100) * 4);
  const a1DivScore = Math.floor((a1Progress / 100) * 42);

  const a2Metrics = Math.floor((a2Progress / 100) * 8);
  const a2Compliance = Math.floor((a2Progress / 100) * 2);
  const a2Events = Math.floor((a2Progress / 100) * 3);
  const a2RiskScore = Math.floor((a2Progress / 100) * 68);

  const a3Recs = Math.floor((a3Progress / 100) * 12);
  const a3ReturnImp = ((a3Progress / 100) * 6.2).toFixed(1);
  const a3Tax = ((a3Progress / 100) * 1.5).toFixed(1);
  const a3Cost = Math.floor((a3Progress / 100) * 8500);

  return (
    <div className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-xl shadow-slate-200/40 dark:shadow-none flex flex-col min-h-[750px] relative">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2 text-slate-900 dark:text-white flex items-center gap-3">
            <BrainCircuit className="w-8 h-8 text-indigo-600" />
            AI Synthesis Engine
          </h2>
          <p className="text-slate-500 dark:text-zinc-400">Pipeline-based multi-agent architecture execution.</p>
        </div>
        
        {status === 'idle' && (
          <button 
            onClick={startPipeline}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-indigo-600/20 transition-all hover:scale-105"
          >
            <Play className="w-4 h-4 fill-current" />
            Initialize Pipeline
          </button>
        )}
      </div>

      <div className="flex-1 flex flex-col gap-6">
        {/* Error State Banner */}
        {status === 'error' && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 p-4 rounded-2xl flex items-start justify-between"
          >
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-500 mt-0.5" />
              <div>
                <h4 className="font-bold text-red-900 dark:text-red-400">Pipeline Execution Failed</h4>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">{errorMsg}</p>
              </div>
            </div>
            <button 
              onClick={startPipeline}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Retry
            </button>
          </motion.div>
        )}

        {/* Overall Progress */}
        <div className="bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-800 p-6 rounded-2xl relative overflow-hidden">
          <div className="flex justify-between items-end mb-3 relative z-10">
            <div className="flex items-center gap-2">
               <h3 className="font-bold text-slate-800 dark:text-zinc-200">System Execution Progress</h3>
               {status === 'running' && <span className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 px-2.5 py-1 rounded-full"><Loader2 className="w-3 h-3 animate-spin" /> RUNNING</span>}
               {status === 'completed' && <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 px-2.5 py-1 rounded-full"><CheckCircle2 className="w-3 h-3" /> COMPLETE</span>}
               {status === 'error' && <span className="flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400 px-2.5 py-1 rounded-full"><AlertTriangle className="w-3 h-3" /> FAILED</span>}
            </div>
            <span className={cn("text-3xl font-black font-mono tracking-tighter", status === 'error' ? "text-red-500" : "text-indigo-600 dark:text-indigo-400")}>{overall}%</span>
          </div>
          <div className="h-5 bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden shadow-inner relative z-10">
            <motion.div 
              className={cn("h-full rounded-full", status === 'error' ? "bg-red-500" : "bg-gradient-to-r from-indigo-500 via-blue-500 to-emerald-500")}
              initial={{ width: '0%' }}
              animate={{ width: `${overall}%` }}
              transition={{ ease: "linear" }}
            />
          </div>
        </div>

        {/* Agent 1 */}
        <AgentCard 
          title="Agent 1: Portfolio Analysis"
          icon={<PieChart className="w-5 h-5 text-blue-500" />}
          progress={a1Progress}
          weight="25%"
          status={status}
          metrics={[
            { label: 'Documents Analyzed', val: `${a1Docs} files` },
            { label: 'Holdings Identified', val: `${a1Holdings} securities` },
            { label: 'Asset Classes', val: `${a1Assets} categories` },
            { label: 'Diversification Score', val: `${a1DivScore}/100` }
          ]}
        />

        {/* Agent 2 */}
        <AgentCard 
          title="Agent 2: Risk Assessment"
          icon={<ShieldAlert className="w-5 h-5 text-amber-500" />}
          progress={a2Progress}
          weight="25%"
          status={status}
          metrics={[
            { label: 'Risk Metrics', val: `${a2Metrics} indicators` },
            { label: 'Compliance Checks', val: `${a2Compliance}/2` },
            { label: 'Risk Events', val: `${a2Events} issues` },
            { label: 'Overall Risk Score', val: `${a2RiskScore}/100` }
          ]}
        />

        {/* Agent 3 */}
        <AgentCard 
          title="Agent 3: Inv. Recommendation"
          icon={<Activity className="w-5 h-5 text-emerald-500" />}
          progress={a3Progress}
          weight="50%"
          status={status}
          metrics={[
            { label: 'Recommendations', val: `${a3Recs} actions` },
            { label: 'Expected Imprv.', val: `+${a3ReturnImp}%` },
            { label: 'Tax Gain', val: `${a3Tax}%` },
            { label: 'Est. Cost', val: `$${a3Cost.toLocaleString()}` }
          ]}
        />
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
          disabled={status !== 'completed'}
          className="flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 dark:disabled:bg-zinc-800 disabled:text-slate-400 dark:disabled:text-zinc-600 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20 disabled:shadow-none translate-y-0 hover:-translate-y-0.5 active:translate-y-0"
        >
          Review Results
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

function AgentCard({ title, icon, progress, weight, status, metrics }: { title: string; icon: React.ReactNode; progress: number, weight: string, status: string, metrics: {label: string, val: string}[] }) {
  const isPending = progress === 0 && status !== 'error';
  const isRunning = progress > 0 && progress < 100 && status !== 'error';
  const isDone = progress === 100;
  const isError = status === 'error' && progress > 0 && progress < 100;

  return (
    <div className={cn(
      "border p-6 rounded-2xl transition-all duration-300 relative overflow-hidden",
      isDone ? "bg-slate-50 border-emerald-500/30 dark:bg-emerald-500/5 dark:border-emerald-500/20" :
      isError ? "bg-red-50/50 border-red-300 dark:bg-red-500/5 dark:border-red-500/20" :
      isRunning ? "bg-white border-indigo-400 shadow-md shadow-indigo-500/10 dark:bg-indigo-500/5 dark:border-indigo-500/50" : 
      "bg-slate-50 border-slate-200 opacity-60 dark:bg-zinc-900 dark:border-zinc-800"
    )}>
      
      {isRunning && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/5 to-transparent shadow-[inset_0_0_20px_rgba(99,102,241,0.1)] -z-10 animate-[pulse_2s_ease-in-out_infinite]" />
      )}

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-slate-100 dark:border-zinc-700">
            {icon}
          </div>
          <div>
             <h4 className="font-bold text-slate-800 dark:text-zinc-200 text-lg leading-tight">{title}</h4>
             <span className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">{weight} Weighting</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-2">
            {isPending && <Clock className="w-4 h-4 text-slate-400" />}
            {isRunning && <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />}
            {isDone && <CheckCircle2 className="w-6 h-6 text-emerald-500" />}
            {isError && <AlertTriangle className="w-5 h-5 text-red-500" />}
            <span className={cn(
              "text-lg font-bold font-mono w-14 text-right",
              isDone ? "text-emerald-600 dark:text-emerald-400" : 
              isError ? "text-red-600 dark:text-red-400" :
              isRunning ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-zinc-500"
            )}>
              {Math.round(progress)}%
            </span>
          </div>
        </div>
      </div>
      
      <div className="h-2 bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden mb-5">
        <motion.div 
          className={cn("h-full", isDone ? "bg-emerald-500" : isError ? "bg-red-500" : "bg-indigo-500")}
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: "linear" }}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <div key={i} className="flex flex-col bg-white dark:bg-zinc-950 p-3 rounded-lg border border-slate-100 dark:border-zinc-800/50">
            <span className="text-slate-400 dark:text-zinc-500 text-[10px] font-bold uppercase tracking-wider mb-1 line-clamp-1">{m.label}</span>
            <span className={cn(
              "font-semibold font-mono text-sm",
              isDone ? "text-slate-800 dark:text-zinc-300" : isError ? "text-red-600 dark:text-red-400" : "text-indigo-600 dark:text-indigo-400"
            )}>
              {m.val}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
