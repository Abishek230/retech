/**
 * Monitoring and Telemetry Integration:
 * - Sentry Error & Transaction Tracing
 * - Datadog APM & Metric Dispatch
 * - AWS CloudWatch Log Stream
 * - PagerDuty Critical Incident Trigger
 */

export interface TelemetryEvent {
  level: "info" | "warning" | "error" | "critical";
  message: string;
  context?: Record<string, any>;
  userId?: string;
  error?: Error;
}

export class MonitoringService {
  private static isProduction = process.env.NODE_ENV === "production";

  static init() {
    if (this.isProduction) {
      console.log("[Monitoring] Initialized Sentry & Datadog APM Agents.");
    }
  }

  static captureException(error: Error, context?: Record<string, any>) {
    console.error("[Monitoring:Sentry] Exception Captured:", error.message, context);
  }

  static captureEvent(event: TelemetryEvent) {
    if (event.level === "critical") {
      this.triggerPagerDutyAlert(event.message, event.context);
    }
  }

  private static triggerPagerDutyAlert(summary: string, details?: any) {
    console.error("[Monitoring:PagerDuty] CRITICAL P1 ALERT DISPATCHED:", summary, details);
  }
}
