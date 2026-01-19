import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'
import { migrate } from './schema'

let db: Database.Database | null = null

function getDbPath(): string {
  const fromEnv = process.env.SQLITE_DB_PATH
  if (fromEnv && fromEnv.trim().length > 0) {
    return fromEnv
  }
  return path.join(process.cwd(), 'data', 'bmi.sqlite')
}

export function getDb(): Database.Database {
  if (!db) {
    const dbPath = getDbPath()
    const dir = path.dirname(dbPath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    db = new Database(dbPath)
    migrate(db)
  }
  return db
}

export function closeDb(): void {
  if (db) {
    db.close()
    db = null
  }
}

export function run(sql: string, params?: any): Database.RunResult {
  const database = getDb()
  const stmt = database.prepare(sql)
  return params === undefined ? stmt.run() : stmt.run(params)
}

export function get<T = any>(sql: string, params?: any): T | undefined {
  const database = getDb()
  const stmt = database.prepare(sql)
  return params === undefined ? (stmt.get() as T | undefined) : (stmt.get(params) as T | undefined)
}

export function all<T = any>(sql: string, params?: any): T[] {
  const database = getDb()
  const stmt = database.prepare(sql)
  return params === undefined ? (stmt.all() as T[]) : (stmt.all(params) as T[])
}

