import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const db = useDb()
  await db.delete(schema.chargingSessions).where(eq(schema.chargingSessions.id, id))
  return { ok: true }
})
