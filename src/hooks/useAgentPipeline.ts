import { useState, useCallback, useRef } from 'react';
import { useStore } from '@/store/useStore';
import { PortfolioSchema, RiskSchema, RecommendationSchema, ValidatedPortfolio, ValidatedRisk, ValidatedRecommendation } from '@/lib/schemas';
import { logTelemetry } from '@/lib/telemetry';

export type PipelineStatus = 'idle' | 'running' | 'completed' | 'error';

export function useAgentPipeline() {
  const { clientData, updateAgentResults, resetAgentResults } = useStore();
  
  const [status, setStatus] = useState<PipelineStatus>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const [a1Progress, setA1Progress] = useState(0);
  const [a2Progress, setA2Progress] = useState(0);
  const [a3Progress, setA3Progress] = useState(0);

  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  const startPipeline = useCallback(async () => {
    setStatus('running');
    setErrorMsg(null);
    resetAgentResults();
    logTelemetry({ event: 'PIPELINE_STARTED' });
    
    setA1Progress(0); setA2Progress(0); setA3Progress(0);
    const startTime = Date.now();

    let tick = 0;
    progressInterval.current = setInterval(() => {
      tick += 100;
      setA1Progress(p => p >= 100 ? 100 : Math.min(99, tick / 4000 * 100)); 
      if (tick > 4000) setA2Progress(p => p >= 100 ? 100 : Math.min(99, (tick - 4000) / 4500 * 100));
      if (tick > 8500) setA3Progress(p => p >= 100 ? 100 : Math.min(99, (tick - 8500) / 6000 * 100));
    }, 100);

    try {
      // 1. Agent 1 Backend Execution (API Route)
      const res1 = await fetch('/api/analyze/portfolio', {
        method: 'POST',
        body: JSON.stringify({ docsCount: clientData.files.length })
      });
      if (!res1.ok) throw new Error((await res1.json()).error || 'Portfolio API Failed');
      
      const portfolioOut: ValidatedPortfolio = PortfolioSchema.parse(await res1.json());
      setA1Progress(100);
      updateAgentResults('portfolio', portfolioOut);
      logTelemetry({ event: 'AGENT_SUCCESS', agent: 'Agent 1', durationMs: Date.now() - startTime });

      // 2. Agent 2 Backend Execution
      const t2Start = Date.now();
      const res2 = await fetch('/api/analyze/risk', {
        method: 'POST',
        body: JSON.stringify(portfolioOut)
      });
      if (!res2.ok) throw new Error((await res2.json()).error || 'Risk API Failed');
      
      const riskOut: ValidatedRisk = RiskSchema.parse(await res2.json());
      setA2Progress(100);
      updateAgentResults('risk', riskOut);
      logTelemetry({ event: 'AGENT_SUCCESS', agent: 'Agent 2', durationMs: Date.now() - t2Start });

      // 3. Agent 3 Backend Execution
      const t3Start = Date.now();
      const res3 = await fetch('/api/analyze/recommendation', {
        method: 'POST',
        body: JSON.stringify({ portfolio: portfolioOut, risk: riskOut })
      });
      if (!res3.ok) throw new Error((await res3.json()).error || 'Recommendation API Failed');
      
      const recOut: ValidatedRecommendation = RecommendationSchema.parse(await res3.json());
      setA3Progress(100);
      updateAgentResults('recommendation', recOut);
      logTelemetry({ event: 'AGENT_SUCCESS', agent: 'Agent 3', durationMs: Date.now() - t3Start });

      setStatus('completed');
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message || 'Validation or Server Error occurred during execution.');
      logTelemetry({ 
        event: 'PIPELINE_FAILED', 
        errorDetails: err.message,
        durationMs: Date.now() - startTime 
      });
    } finally {
      if (progressInterval.current) clearInterval(progressInterval.current);
    }
  }, [clientData.files.length, resetAgentResults, updateAgentResults]);

  const overall = Math.round((0.25 * a1Progress) + (0.25 * a2Progress) + (0.5 * a3Progress));

  return {
    status,
    errorMsg,
    a1Progress,
    a2Progress,
    a3Progress,
    overall,
    startPipeline
  };
}
