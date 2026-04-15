import { z } from 'zod';

export const PortfolioSchema = z.object({
  docsAnalyzed: z.number().min(1, 'Must analyze at least 1 document'),
  holdings: z.number().min(0, 'Holdings cannot be negative'),
  assets: z.number().min(1, 'Must identify at least 1 asset class'),
  divScore: z.number().min(0).max(100, 'Diversification score must be between 0 and 100'),
  findings: z.array(z.string()).min(1, 'Must contain at least 1 finding')
});

export const RiskSchema = z.object({
  metrics: z.number().min(0),
  compliance: z.number().min(0),
  events: z.number().min(0),
  score: z.number().min(0).max(100),
  findings: z.array(z.string())
});

export const RecommendationSchema = z.object({
  actions: z.number().min(0),
  returnImp: z.number(),
  taxGain: z.number(),
  cost: z.number().min(0),
  feasibilityScore: z.number().min(0).max(100),
  impactScore: z.number().min(0).max(100),
  returnProjected: z.number(),
  value3Year: z.number(),
  taxImpact: z.string(),
  findings: z.array(z.string())
});

export const PortfolioInputSchema = z.object({
  docsCount: z.number().min(0).default(1)
});

export const RecommendationInputSchema = z.object({
  portfolio: PortfolioSchema,
  risk: RiskSchema
});

export type ValidatedPortfolio = z.infer<typeof PortfolioSchema>;
export type ValidatedRisk = z.infer<typeof RiskSchema>;
export type ValidatedRecommendation = z.infer<typeof RecommendationSchema>;
