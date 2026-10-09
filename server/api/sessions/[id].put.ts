import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const input = parseBody(sessionInput, await readBody(event))
  const db = useDb()
  const s = schema.chargingSessions
  const [existing] = await db.select().from(s).where(eq(s.id, id))
  if (!existing) throw createError({ statusCode: 404, statusMessage: 'Session not found' })

  // Keep the original snapshot; only take the current price if the location changed.
  let pricePerKwh = existing.pricePerKwh
  if (input.location !== existing.location) {
    const settings = await getSettings()
    if (settings) pricePerKwh = priceFor(settings, input.location)
  }
  const calc = computeCharge(input.startPct, input.endPct, existing.batteryKwh, pricePerKwh)
  const [row] = await db
    .update(s)
    .set({ ...input, note: input.note || null, pricePerKwh, ...calc, updatedAt: new Date() })
    .where(eq(s.id, id))
    .returning()
  return row
})
