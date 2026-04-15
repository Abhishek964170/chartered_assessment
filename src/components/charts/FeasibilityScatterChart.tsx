import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { DashboardClient } from '@/store/useStore';

interface Props {
  data: DashboardClient[];
}

export function FeasibilityScatterChart({ data }: Props) {
  const getQuadrantColor = (feasibility: number, impact: number) => {
    if (feasibility >= 50 && impact >= 50) return '#65a30d'; // Neon Green
    if (feasibility < 50 && impact >= 50) return '#f59e0b'; // Amber
    if (feasibility >= 50 && impact < 50) return '#3b82f6'; // Blue
    return '#ef4444'; // Red
  };

  return (
    <div className="flex-1 w-full min-h-[300px] relative -ml-4">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} horizontal={false} />
          <XAxis 
            type="number" 
            dataKey="feasibility" 
            name="Feasibility" 
            domain={[0, 100]} 
            tick={{ fontSize: 12, fill: '#888' }}
            axisLine={{ stroke: '#888', opacity: 0.3 }}
            tickLine={{ stroke: '#888', opacity: 0.3 }}
            label={{ value: "Feasibility →", position: 'insideBottomRight', offset: 0, fill: '#888', fontSize: 12 }}
          />
          <YAxis 
            type="number" 
            dataKey="impact" 
            name="Impact" 
            domain={[0, 100]} 
            tick={{ fontSize: 12, fill: '#888' }}
            axisLine={{ stroke: '#888', opacity: 0.3 }}
            tickLine={{ stroke: '#888', opacity: 0.3 }}
            label={{ value: "Impact →", angle: -90, position: 'insideTopLeft', offset: 15, fill: '#888', fontSize: 12 }}
          />
          <Tooltip 
            cursor={{ strokeDasharray: '3 3' }} 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                return (
                  <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-xl shadow-xl text-white text-xs">
                     <p className="font-bold text-sm mb-1">{item.name}</p>
                     <p className="text-zinc-400 mb-2">{item.strategy}</p>
                     <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                       <span className="text-zinc-500">Feasibility:</span> <span className="font-bold text-right text-indigo-400">{item.feasibility}</span>
                       <span className="text-zinc-500">Impact:</span> <span className="font-bold text-right text-indigo-400">{item.impact}</span>
                     </div>
                  </div>
                )
              }
              return null;
            }}
          />
          <Scatter name="Clients" data={data}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getQuadrantColor(entry.feasibility, entry.impact)} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
      
      {/* Overlay Quadrant Labels */}
      <div className="absolute top-[10%] right-[10%] pointer-events-none opacity-20 font-bold text-indigo-500 uppercase tracking-widest text-xs">Quick Wins</div>
      <div className="absolute top-[10%] left-[15%] pointer-events-none opacity-20 font-bold text-amber-500 uppercase tracking-widest text-xs">Strategic</div>
      <div className="absolute bottom-[10%] right-[10%] pointer-events-none opacity-20 font-bold text-blue-500 uppercase tracking-widest text-xs">Fill-ins</div>
      <div className="absolute bottom-[10%] left-[15%] pointer-events-none opacity-20 font-bold text-red-500 uppercase tracking-widest text-xs">Low Priority</div>
    </div>
  );
}
