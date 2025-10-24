/**
 * Error Logging Service
 * Centralized error logging (ready for Sentry/Bugsnag integration)
 */

import ENV from '@/config/env';

export interface ErrorLog {
  message: string;
  stack?: string;
  context?: any;
  timestamp: Date;
  userId?: string;
  severity: 'error' | 'warning' | 'info';
}

class ErrorLogger {
  private logs: ErrorLog[] = [];
  private maxLogs = 100; // Keep last 100 logs in memory

  /**
   * Log error
   */
  error(error: Error | string, context?: any) {
    const errorLog: ErrorLog = {
      message: typeof error === 'string' ? error : error.message,
      stack: typeof error === 'object' ? error.stack : undefined,
      context,
      timestamp: new Date(),
      severity: 'error',
    };

    this.addLog(errorLog);

    // Console log in development
    if (ENV.isDevelopment) {
      console.error('🔴 Error:', errorLog.message);
      if (errorLog.stack) {
        console.error('Stack:', errorLog.stack);
      }
      if (context) {
        console.error('Context:', context);
      }
    }

    // TODO: Send to error tracking service (Sentry, Bugsnag, etc.)
    // this.sendToService(errorLog);
  }

  /**
   * Log warning
   */
  warn(message: string, context?: any) {
    const warningLog: ErrorLog = {
      message,
      context,
      timestamp: new Date(),
      severity: 'warning',
    };

    this.addLog(warningLog);

    if (ENV.isDevelopment) {
      console.warn('⚠️ Warning:', message);
      if (context) {
        console.warn('Context:', context);
      }
    }

    // TODO: Send to service
    // this.sendToService(warningLog);
  }

  /**
   * Log info
   */
  info(message: string, context?: any) {
    const infoLog: ErrorLog = {
      message,
      context,
      timestamp: new Date(),
      severity: 'info',
    };

    this.addLog(infoLog);

    if (ENV.isDevelopment) {
      console.log('ℹ️ Info:', message);
      if (context) {
        console.log('Context:', context);
      }
    }
  }

  /**
   * Add log to memory
   */
  private addLog(log: ErrorLog) {
    this.logs.push(log);

    // Keep only last N logs
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
  }

  /**
   * Get all logs
   */
  getLogs(): ErrorLog[] {
    return [...this.logs];
  }

  /**
   * Get logs by severity
   */
  getLogsBySeverity(severity: 'error' | 'warning' | 'info'): ErrorLog[] {
    return this.logs.filter(log => log.severity === severity);
  }

  /**
   * Clear all logs
   */
  clearLogs() {
    this.logs = [];
    console.log('✅ Logs cleared');
  }

  /**
   * Get error count
   */
  getErrorCount(): number {
    return this.logs.filter(log => log.severity === 'error').length;
  }

  /**
   * Export logs as JSON
   */
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * TODO: Send to error tracking service
   */
  private sendToService(log: ErrorLog) {
    // Implement when ready to integrate Sentry/Bugsnag
    // Example:
    // if (ENV.isProduction) {
    //   Sentry.captureException(new Error(log.message), {
    //     extra: log.context,
    //   });
    // }
  }
}

// Export singleton instance
export const errorLogger = new ErrorLogger();

/**
 * Helper function for try-catch blocks
 */
export const handleError = (error: unknown, context?: any): void => {
  if (error instanceof Error) {
    errorLogger.error(error, context);
  } else {
    errorLogger.error(String(error), context);
  }
};
