import fs from 'fs'
import path from 'path'

export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR'
}

const LOG_FILE_PATH = path.join(process.cwd(), 'app.log')

export function log(level: LogLevel, message: string, meta?: any) {
  const timestamp = new Date().toISOString()
  const metaStr = meta ? JSON.stringify(meta) : ''
  const logLine = `[${timestamp}] [${level}] ${message} ${metaStr}\n`

  // For simplicity, we just console.log in development, but in prod we might append to file
  console.log(logLine.trim())
  
  // Optional: Append to file
  try {
    fs.appendFileSync(LOG_FILE_PATH, logLine)
  } catch (err) {
    console.error('Failed to write to log file', err)
  }
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
