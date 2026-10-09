import { and, desc, gte, lte } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const { from, to } = parseBody(rangeQuery, getQuery(event))
  const s = schema.chargingSessions
  const db = useDb()
  return await db
    .select()
    .from(s)
    .where(and(from ? gte(s.chargeDate, from) : undefined, to ? lte(s.chargeDate, to) : undefined))
    .orderBy(desc(s.chargeDate), desc(s.id))
})
