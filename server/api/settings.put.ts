import { z } from 'zod'

const body = z.object({
  batteryKwh: z.number().positive().max(500),
  priceHomePerKwh: z.number().min(0),
  priceSpkluPerKwh: z.number().min(0),
})

export default defineEventHandler(async (event) => {
  const data = parseBody(body, await readBody(event))
  const db = useDb()
  const [row] = await db
    .insert(schema.settings)
    .values({ id: 1, ...data })
    .onConflictDoUpdate({ target: schema.settings.id, set: { ...data, updatedAt: new Date() } })
    .returning()
  return row
})
