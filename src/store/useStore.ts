import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';

export interface ClientData {
  name: string;
  description: string;
  goals: string;
  files: string[];
}

export interface RiskData {
  timeline: string;
  riskTolerance: string;
  liquidity: string;
  score: number;
}

export interface PortfolioResult {
  docsAnalyzed: number;
  holdings: number;
  assets: number;
  divScore: number;
  findings: string[];
}

export interface RiskResult {
  metrics: number;
  compliance: number;
  events: number;
  score: number;
  findings: string[];
}

export interface RecommendationResult {
  actions: number;
  returnImp: number;
  taxGain: number;
  cost: number;
  feasibilityScore: number;
  impactScore: number;
  returnProjected: number;
  value3Year: number;
  taxImpact: string;
  findings: string[];
}

export interface AgentResults {
  portfolio: PortfolioResult | null;
  risk: RiskResult | null;
  recommendation: RecommendationResult | null;
}

export interface DashboardClient {
  id: string;
  name: string;
  strategy: string;
  decision: string;
  feasibility: number;
  impact: number;
  expectedReturn: number;
  cost: number;
  risks?: string[];
  details?: string;
}

interface StoreState {
  currentStage: number;
  setStage: (stage: number) => void;
  nextStage: () => void;
  prevStage: () => void;
  
  clientData: ClientData;
  setClientData: (data: Partial<ClientData>) => void;
  
  riskData: RiskData;
  setRiskData: (data: Partial<RiskData>) => void;
  
  agentResults: AgentResults;
  updateAgentResults: (key: keyof AgentResults, data: any) => void;
  resetAgentResults: () => void;
  
  clients: DashboardClient[];
  addClient: (client: DashboardClient) => void;
  deleteClient: (id: string) => void;
  
  resetSession: () => void;
}

const emptyAgentResults = { portfolio: null, risk: null, recommendation: null };

// SSR-Safe IndexedDB Storage Adapter for Zustand
const idbStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    if (typeof window === 'undefined') return null;
    const { get } = await import('idb-keyval');
    return (await get(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    if (typeof window === 'undefined') return;
    const { set } = await import('idb-keyval');
    await set(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    if (typeof window === 'undefined') return;
    const { del } = await import('idb-keyval');
    await del(name);
  },
};

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      currentStage: 1,
      setStage: (stage) => set({ currentStage: Math.max(1, Math.min(5, stage)) }),
      nextStage: () => set((state) => ({ currentStage: Math.min(5, state.currentStage + 1) })),
      prevStage: () => set((state) => ({ currentStage: Math.max(1, state.currentStage - 1) })),
      
      clientData: { name: '', description: '', goals: '', files: [] },
      setClientData: (data) => set((state) => ({ clientData: { ...state.clientData, ...data } })),
      
      riskData: { timeline: '', riskTolerance: '', liquidity: '', score: 0 },
      setRiskData: (data) => set((state) => ({ riskData: { ...state.riskData, ...data } })),
      
      agentResults: emptyAgentResults,
      updateAgentResults: (key, data) => set((state) => ({
        agentResults: { ...state.agentResults, [key]: data }
      })),
      resetAgentResults: () => set({ agentResults: emptyAgentResults }),
      
      clients: [
        { id: '1', name: 'John Doe', strategy: 'Aggressive Growth', decision: 'Implement', feasibility: 85, impact: 90, expectedReturn: 12.5, cost: 1500, risks: ['High volatility', 'Tech exposure'], details: 'Overweight in AI / Cloud infrastructure. Low fixed income.' },
        { id: '2', name: 'Jane Smith', strategy: 'Capital Preservation', decision: 'Review', feasibility: 92, impact: 65, expectedReturn: 5.2, cost: 800, risks: ['Inflation dragging real return'], details: 'Conservative treasury ladder with large cap dividend buffer.' },
      ],
      addClient: (client) => set((state) => ({ clients: [...state.clients, client] })),
      deleteClient: (id) => set((state) => ({ clients: state.clients.filter((c) => c.id !== id) })),
      
      resetSession: () => set({
        currentStage: 1,
        clientData: { name: '', description: '', goals: '', files: [] },
        riskData: { timeline: '', riskTolerance: '', liquidity: '', score: 0 },
        agentResults: emptyAgentResults
      })
    }),
    {
      name: 'advisory-platform-idb-storage',
      storage: createJSONStorage(() => idbStorage)
    }
  )
);
