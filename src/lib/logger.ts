/**
 * Centralized logging utility
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug'

interface LogContext {
  [key: string]: any
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'
  private isProduction = process.env.NODE_ENV === 'production'

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString()
    const contextStr = context ? ` ${JSON.stringify(context)}` : ''
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`
  }

  private log(level: LogLevel, message: string, context?: LogContext) {
    const formattedMessage = this.formatMessage(level, message, context)

    switch (level) {
      case 'error':
        console.error(formattedMessage)
        // In production, send to error tracking service (e.g., Sentry)
        if (this.isProduction) {
          // Example: Sentry.captureException(new Error(message), { extra: context })
        }
        break
      case 'warn':
        console.warn(formattedMessage)
        break
      case 'info':
        if (this.isDevelopment) {
          console.info(formattedMessage)
        }
        break
      case 'debug':
        if (this.isDevelopment) {
          console.debug(formattedMessage)
        }
        break
    }
  }

  info(message: string, context?: LogContext) {
    this.log('info', message, context)
  }

  warn(message: string, context?: LogContext) {
    this.log('warn', message, context)
  }

  error(message: string, error?: Error | unknown, context?: LogContext) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    const errorContext = error instanceof Error 
      ? { ...context, stack: error.stack, name: error.name }
      : context
    this.log('error', errorMessage, errorContext)
  }

  debug(message: string, context?: LogContext) {
    this.log('debug', message, context)
  }
}

export const logger = new Logger()

