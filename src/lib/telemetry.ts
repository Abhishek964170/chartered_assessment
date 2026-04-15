/**
 * Mock Telemetry Logger
 * In a real FAANG production system, this would stream to Datadog, Sentry, or Grafana Loki.
 */

interface TelemetryPayload {
  event: 'PIPELINE_STARTED' | 'AGENT_SUCCESS' | 'AGENT_FAILURE' | 'PIPELINE_FAILED';
  agent?: 'Agent 1' | 'Agent 2' | 'Agent 3';
  errorDetails?: any;
  durationMs?: number;
}

export function logTelemetry(payload: TelemetryPayload) {
  // Simulating sending data to a monitoring service
  const timestamp = new Date().toISOString();
  
  if (['AGENT_FAILURE', 'PIPELINE_FAILED'].includes(payload.event)) {
    console.error(`🚨 [TELEMETRY ERROR] ${timestamp} | Event: ${payload.event}`, payload);
  } else {
    // Info logs
    console.info(`📊 [TELEMETRY INFO] ${timestamp} | Event: ${payload.event}`, payload);
  }
}
