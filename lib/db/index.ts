import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { authRelations } from './schema/auth'
import { geoserverRelations } from './schema/geoserver'

const sql = neon(process.env.DATABASE_URL!)
export const db = drizzle({
  client: sql,
  relations: { ...authRelations, ...geoserverRelations },
})
