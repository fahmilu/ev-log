import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const db = useDb()
  const [row] = await db.select().from(schema.chargingSessions).where(eq(schema.chargingSessions.id, id))
  if (!row) throw createError({ statusCode: 404, statusMessage: 'Session not found' })
  return row
})
