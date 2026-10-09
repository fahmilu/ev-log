import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from '../db/schema'

let _db: ReturnType<typeof drizzle<typeof schema>> | undefined

export function useDb() {
  if (!_db) {
    const url = useRuntimeConfig().databaseUrl || process.env.DATABASE_URL
    if (!url) {
      throw createError({ statusCode: 500, statusMessage: 'DATABASE_URL is not configured' })
    }
    _db = drizzle(neon(url), { schema })
  }
  return _db
}

export { schema }
