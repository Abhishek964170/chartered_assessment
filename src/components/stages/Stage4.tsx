'use client';
import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { ArrowLeft, CheckCircle2, TrendingUp, ShieldCheck, DollarSign, Target, Activity, Zap, FileSearch, PieChart } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Stage4() {
  const { agentResults, clientData, addClient, nextStage, prevStage } = useStore();
  const [strategyName, setStrategyName] = useState('');
  
  const rec = agentResults.recommendation;
  const portfolio = agentResults.portfolio;
  const risk = agentResults.risk;

  if (!rec || !portfolio || !risk) {
    return <div className="text-center p-10 text-slate-500">No AI Results available. Please complete Stage 3.</div>;
  }

  const getColor = (score: number) => {
    if (score >= 75) return 'text-emerald-600 dark:text-emerald-400';
    if (score >= 50) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };
  
  const getBgColor = (score: number) => {
    if (score >= 75) return 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20';
    if (score >= 50) return 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20';
    return 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20';
  };

  const getIndicator = (score: number) => {
    if (score >= 75) return 'High';
    if (score >= 50) return 'Medium';
    return 'Low';
  };

  const handleImplement = () => {
    addClient({
      id: Date.now().toString(),
      name: clientData.name || 'Anonymous Client',
      strategy: strategyName || 'Auto-Optimized Strategy',
      decision: 'Implement',
      feasibility: rec.feasibilityScore,
      impact: rec.impactScore,
      expectedReturn: rec.returnProjected,
      cost: rec.cost,
      risks: risk.findings,
      details: rec.findings.join(' ')
    });

    nextStage();
  };

  return (
    <div className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-xl shadow-slate-200/40 dark:shadow-none flex flex-col">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight mb-2 text-slate-900 dark:text-white flex items-center gap-3">
          <Target className="w-8 h-8 text-indigo-600" />
          Recommendation Scoring
        </h2>
        <p className="text-slate-500 dark:text-zinc-400">Review the AI-generated metrics and finalize the strategy for {clientData.name || 'the client'}.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Scoring Cards */}
        <div className={cn("border p-6 rounded-2xl flex flex-col justify-between", getBgColor(rec.feasibilityScore))}>
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold text-slate-800 dark:text-zinc-200">Feasibility Score</h3>
            <span className={cn("text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider bg-white/50 dark:bg-black/20", getColor(rec.feasibilityScore))}>
              {getIndicator(rec.feasibilityScore)}
            </span>
          </div>
          <div className="flex items-end gap-2">
            <span className={cn("text-5xl font-black tracking-tighter", getColor(rec.feasibilityScore))}>{rec.feasibilityScore}</span>
            <span className="text-slate-500 dark:text-zinc-400 font-medium mb-1">/ 100</span>
          </div>
        </div>

        <div className={cn("border p-6 rounded-2xl flex flex-col justify-between", getBgColor(rec.impactScore))}>
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold text-slate-800 dark:text-zinc-200">Impact Score</h3>
            <span className={cn("text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider bg-white/50 dark:bg-black/20", getColor(rec.impactScore))}>
              {getIndicator(rec.impactScore)}
            </span>
          </div>
          <div className="flex items-end gap-2">
            <span className={cn("text-5xl font-black tracking-tighter", getColor(rec.impactScore))}>{rec.impactScore}</span>
            <span className="text-slate-500 dark:text-zinc-400 font-medium mb-1">/ 100</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <MetricCard label="Proj. Return" value={`${rec.returnProjected}%`} icon={<TrendingUp className="w-4 h-4 text-emerald-500" />} />
        <MetricCard label="3Y Value Est." value={`$${(rec.value3Year / 1000000).toFixed(1)}M`} icon={<DollarSign className="w-4 h-4 text-blue-500" />} />
        <MetricCard label="Est. Cost" value={`$${rec.cost}`} icon={<Activity className="w-4 h-4 text-red-400" />} />
        <MetricCard label="Div. Score" value={`${portfolio.divScore}/100`} icon={<PieChart className="w-4 h-4 text-indigo-500" />} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6">
          <h3 className="font-bold text-slate-800 dark:text-zinc-200 mb-4 flex items-center gap-2">
            <FileSearch className="w-5 h-5 text-indigo-500" />
            Agent 1 & 2 Findings
          </h3>
          <ul className="space-y-3">
            {portfolio.findings.concat(risk.findings).slice(0, 3).map((f, i) => (
              <li key={i} className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700 dark:text-zinc-300 text-sm">{f}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6">
          <h3 className="font-bold text-slate-800 dark:text-zinc-200 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-indigo-500" />
            Agent 3 Recommendations
          </h3>
          <ul className="space-y-3">
            {rec.findings.map((f, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700 dark:text-zinc-300 text-sm">{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-500/20 p-6 rounded-2xl flex flex-col sm:flex-row gap-6 items-center">
        <div className="flex-1 w-full">
          <label className="block text-sm font-bold text-indigo-900 dark:text-indigo-200 mb-2">Strategy Name</label>
          <input 
            type="text" 
            placeholder="e.g. Balanced Tax-Optimized Core"
            className="w-full px-4 py-3 rounded-xl border border-indigo-200 dark:border-indigo-500/30 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-zinc-500 font-medium"
            value={strategyName}
            onChange={(e) => setStrategyName(e.target.value)}
          />
        </div>
        <button 
          onClick={handleImplement}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20 hover:-translate-y-0.5 mt-auto"
        >
          Implement & Save
        </button>
      </div>

      <div className="pt-8 mt-6 border-t border-slate-100 dark:border-zinc-800 flex justify-between">
        <button 
          onClick={prevStage}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200 px-4 py-3 rounded-xl font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to AI Analysis
        </button>
      </div>
    </div>
  );
}

function MetricCard({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl p-4 flex flex-col">
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 bg-slate-50 dark:bg-zinc-800 rounded-lg">
          {icon}
        </div>
        <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">{label}</span>
      </div>
      <span className="text-xl font-black text-slate-800 dark:text-zinc-100 tracking-tight">{value}</span>
    </div>
  );
}
