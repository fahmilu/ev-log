export default defineEventHandler(async (event) => {
  const input = parseBody(sessionInput, await readBody(event))
  const settings = await getSettings()
  if (!settings) {
    throw createError({ statusCode: 400, statusMessage: 'Configure battery capacity and prices in Settings first' })
  }
  const pricePerKwh = priceFor(settings, input.location)
  const calc = computeCharge(input.startPct, input.endPct, settings.batteryKwh, pricePerKwh)
  const db = useDb()
  const [row] = await db
    .insert(schema.chargingSessions)
    .values({ ...input, note: input.note || null, batteryKwh: settings.batteryKwh, pricePerKwh, ...calc })
    .returning()
  return row
})
