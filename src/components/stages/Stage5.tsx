'use client';
import { useState, Fragment } from 'react';
import { useStore, DashboardClient } from '@/store/useStore';
import { Trash2, ChevronDown, ChevronUp, Download, LayoutDashboard, Search, FileDown, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FeasibilityScatterChart } from '@/components/charts/FeasibilityScatterChart';

export default function Stage5() {
  const { clients, deleteClient, resetSession } = useStore();
  const [sortField, setSortField] = useState<keyof DashboardClient>('feasibility');
  const [sortAsc, setSortAsc] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const handleSort = (field: keyof DashboardClient) => {
    if (sortField === field) setSortAsc(!sortAsc);
    else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const filtered = clients.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.strategy.toLowerCase().includes(search.toLowerCase()));

  const sorted = [...filtered].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];
    if (typeof valA === 'string' && typeof valB === 'string') {
      return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
    } else if (typeof valA === 'number' && typeof valB === 'number') {
      return sortAsc ? valA - valB : valB - valA;
    }
    return 0;
  });

  const exportCSV = () => {
    const headers = 'ID,Name,Strategy,Decision,Feasibility,Impact,Expected Return %,Cost $\n';
    const rows = sorted.map(c => `${c.id},"${c.name}","${c.strategy}",${c.decision},${c.feasibility},${c.impact},${c.expectedReturn},${c.cost}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full bg-slate-50 dark:bg-zinc-950 flex flex-col gap-8 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-sm">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-1 text-slate-900 dark:text-white flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8 text-indigo-600" />
            Portfolio Dashboard
          </h2>
          <p className="text-slate-500 dark:text-zinc-400">Manage client strategies and track impact vs. feasibility matrix.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={resetSession}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 px-5 py-2.5 rounded-xl font-bold transition-all border border-indigo-200 dark:border-indigo-500/20"
          >
            <PlusCircle className="w-4 h-4" />
            New Client
          </button>
          <button 
            onClick={exportCSV}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-slate-200 px-5 py-2.5 rounded-xl font-bold transition-all shadow-md"
          >
            <FileDown className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Matrix Side */}
        <div className="lg:col-span-1 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm flex flex-col min-h-[400px]">
          <h3 className="font-bold text-slate-800 dark:text-zinc-200 mb-6 text-lg">Feasibility vs Impact Matrix</h3>
          <FeasibilityScatterChart data={sorted} />
        </div>

        {/* Table Side */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm overflow-hidden flex flex-col">
          <div className="flex justify-between items-center mb-6">
             <h3 className="font-bold text-slate-800 dark:text-zinc-200 text-lg">Client Strategies</h3>
             <div className="relative">
               <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
               <input 
                 type="text" 
                 placeholder="Search clients..." 
                 value={search}
                 onChange={e => setSearch(e.target.value)}
                 className="pl-9 pr-4 py-2 border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950 rounded-xl text-sm outline-none focus:border-indigo-500 transition-colors w-64"
               />
             </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-zinc-800">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 dark:bg-zinc-950 border-b border-slate-200 dark:border-zinc-800 text-slate-500 dark:text-zinc-400 uppercase tracking-wider text-xs">
                <tr>
                  <th className="px-4 py-4 font-bold cursor-pointer hover:text-slate-800 dark:hover:text-zinc-200 transition-colors" onClick={() => handleSort('name')}>
                    Client Name {sortField === 'name' && (sortAsc ? '↑' : '↓')}
                  </th>
                  <th className="px-4 py-4 font-bold cursor-pointer hover:text-slate-800 dark:hover:text-zinc-200 transition-colors" onClick={() => handleSort('strategy')}>
                    Strategy {sortField === 'strategy' && (sortAsc ? '↑' : '↓')}
                  </th>
                  <th className="px-4 py-4 font-bold text-right cursor-pointer hover:text-slate-800 dark:hover:text-zinc-200 transition-colors" onClick={() => handleSort('feasibility')}>
                    Feasib. {sortField === 'feasibility' && (sortAsc ? '↑' : '↓')}
                  </th>
                  <th className="px-4 py-4 font-bold text-right cursor-pointer hover:text-slate-800 dark:hover:text-zinc-200 transition-colors" onClick={() => handleSort('impact')}>
                    Impact {sortField === 'impact' && (sortAsc ? '↑' : '↓')}
                  </th>
                  <th className="px-4 py-4 font-bold text-right cursor-pointer hover:text-slate-800 dark:hover:text-zinc-200 transition-colors" onClick={() => handleSort('expectedReturn')}>
                    Proj Ret. {sortField === 'expectedReturn' && (sortAsc ? '↑' : '↓')}
                  </th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/50">
                {sorted.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-500">No clients found.</td>
                  </tr>
                ) : (
                  sorted.map(client => (
                    <Fragment key={client.id}>
                      <tr className={cn("hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 transition-colors group cursor-pointer", expandedId === client.id && "bg-slate-50/50 dark:bg-zinc-800/30")} onClick={() => setExpandedId(expandedId === client.id ? null : client.id)}>
                        <td className="px-4 py-4 font-bold text-slate-900 dark:text-white max-w-[150px] truncate flex items-center gap-2">
                          {expandedId === client.id ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                          {client.name}
                        </td>
                        <td className="px-4 py-4 text-slate-600 dark:text-zinc-300 max-w-[200px] truncate">{client.strategy}</td>
                        <td className="px-4 py-4 text-right">
                          <span className={cn("px-2.5 py-1 rounded-md font-bold text-xs", client.feasibility >= 75 ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" : client.feasibility >= 50 ? "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400" : "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400")}>
                            {client.feasibility}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <span className={cn("px-2.5 py-1 rounded-md font-bold text-xs", client.impact >= 75 ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" : client.impact >= 50 ? "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400" : "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400")}>
                            {client.impact}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right font-mono font-bold text-indigo-600 dark:text-indigo-400">
                          {client.expectedReturn}%
                        </td>
                        <td className="px-4 py-4 text-right">
                          <button 
                            onClick={(e) => { e.stopPropagation(); deleteClient(client.id); }}
                            className="p-2 bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
                            title="Delete Client"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                      {expandedId === client.id && (
                        <tr className="bg-slate-50/50 dark:bg-zinc-800/10 border-b border-slate-100 dark:border-zinc-800/50">
                           <td colSpan={6} className="px-8 py-6 whitespace-normal">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                               <div>
                                 <h4 className="font-bold text-slate-800 dark:text-zinc-200 mb-2 text-sm uppercase tracking-wider">Strategy Details</h4>
                                 <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">{client.details || 'No extended details provided.'}</p>
                               </div>
                               <div>
                                 <h4 className="font-bold text-slate-800 dark:text-zinc-200 mb-2 text-sm uppercase tracking-wider">Identified Risks</h4>
                                 {client.risks && client.risks.length > 0 ? (
                                   <ul className="list-disc pl-4 space-y-1">
                                     {client.risks.map((r, i) => (
                                       <li key={i} className="text-sm text-slate-600 dark:text-zinc-400">{r}</li>
                                     ))}
                                   </ul>
                                 ) : (
                                   <p className="text-sm text-slate-600 dark:text-zinc-400">No specific risks identified.</p>
                                 )}
                               </div>
                             </div>
                           </td>
                        </tr>
                      )}
                    </Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
