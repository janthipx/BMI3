export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR'
}

export function log(level: LogLevel, message: string, meta?: any) {
  const timestamp = new Date().toISOString()
  const metaStr = meta ? JSON.stringify(meta) : ''
  const logLine = `[${timestamp}] [${level}] ${message} ${metaStr}\n`

  // Only console.log to avoid file system issues in serverless environments
  console.log(logLine.trim())
}

export function logInfo(message: string, meta?: any) {
  log(LogLevel.INFO, message, meta)
}

export function logWarn(message: string, meta?: any) {
  log(LogLevel.WARN, message, meta)
}

export function logError(message: string, meta?: any) {
  log(LogLevel.ERROR, message, meta)
}
