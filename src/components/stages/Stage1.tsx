'use client';
import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { UploadCloud, FileText, ArrowRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Stage1() {
  const { clientData, setClientData, nextStage } = useStore();
  const [isDragging, setIsDragging] = useState(false);
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => setIsDragging(false);
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files).map(f => f.name);
      setClientData({ files: [...clientData.files, ...newFiles] });
    }
  };

  const handlesFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(f => f.name);
      setClientData({ files: [...clientData.files, ...newFiles] });
    }
  };

  const removeFile = (index: number) => {
    const updated = [...clientData.files];
    updated.splice(index, 1);
    setClientData({ files: updated });
  };

  const isValid = clientData.name.trim() !== '' && (clientData.description.trim() !== '' || clientData.goals.trim() !== '' || clientData.files.length > 0);

  return (
    <div className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-xl shadow-slate-200/40 dark:shadow-none">
      <h2 className="text-3xl font-bold tracking-tight mb-2 text-slate-900 dark:text-white">Client Discovery</h2>
      <p className="text-slate-500 dark:text-zinc-400 mb-8">Gather basic information and document uploads to begin the assessment.</p>
      
      <div className="space-y-8">
        <div>
          <label className="block text-sm font-semibold text-slate-800 dark:text-zinc-200 mb-2">Client Name <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            placeholder="e.g. Wayne Enterprises"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950 focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-zinc-600"
            value={clientData.name}
            onChange={(e) => setClientData({ name: e.target.value })}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-800 dark:text-zinc-200 mb-2">Client Background</label>
            <textarea 
              placeholder="Describe the client's current situation..."
              className="w-full h-32 px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none placeholder:text-slate-400 dark:placeholder:text-zinc-600"
              value={clientData.description}
              onChange={(e) => setClientData({ description: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-800 dark:text-zinc-200 mb-2">Primary Goals</label>
            <textarea 
              placeholder="What are they trying to achieve?"
              className="w-full h-32 px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none placeholder:text-slate-400 dark:placeholder:text-zinc-600"
              value={clientData.goals}
              onChange={(e) => setClientData({ goals: e.target.value })}
            />
          </div>
        </div>

        <div>
           <div className="flex justify-between items-end mb-2">
            <label className="block text-sm font-semibold text-slate-800 dark:text-zinc-200">Supporting Documents</label>
            <span className="text-xs text-slate-500">PDF or TXT</span>
           </div>
          <label 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center transition-all cursor-pointer relative overflow-hidden group",
              isDragging ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10" : "border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950 hover:bg-slate-100 dark:hover:bg-zinc-900/50"
            )}
          >
            <input type="file" multiple className="hidden" onChange={handlesFileInput} accept=".pdf,.txt" />
            <div className="w-16 h-16 bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
               <UploadCloud className="w-8 h-8 text-indigo-500" />
            </div>
            <p className="font-medium text-slate-700 dark:text-zinc-300 mb-1">Click to upload or drag and drop</p>
          </label>
        </div>

        {clientData.files.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-700 dark:text-zinc-300">Uploaded Files</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {clientData.files.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <FileText className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                    <span className="text-sm font-medium truncate text-slate-700 dark:text-zinc-300">{file}</span>
                  </div>
                  <button onClick={() => removeFile(idx)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full text-slate-400 hover:text-red-500 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="pt-8 border-t border-slate-100 dark:border-zinc-800 flex justify-end">
          <button 
            onClick={nextStage}
            disabled={!isValid}
            className="flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 dark:disabled:bg-zinc-800 disabled:text-slate-400 dark:disabled:text-zinc-600 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20 disabled:shadow-none translate-y-0 hover:-translate-y-0.5 active:translate-y-0"
          >
            Proceed to Risk Assessment
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
