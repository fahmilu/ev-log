import { z } from 'zod'

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected YYYY-MM-DD')

export const sessionInput = z
  .object({
    chargeDate: isoDate,
    location: z.enum(['home', 'spklu']),
    startPct: z.number().min(0).max(100),
    endPct: z.number().min(0).max(100),
    note: z.string().max(500).nullish(),
  })
  .refine(v => v.endPct > v.startPct, { message: 'Finish % must be greater than start %', path: ['endPct'] })

export const rangeQuery = z.object({
  from: isoDate.optional(),
  to: isoDate.optional(),
})

export function computeCharge(startPct: number, endPct: number, batteryKwh: number, pricePerKwh: number) {
  const kwhAdded = ((endPct - startPct) / 100) * batteryKwh
  return {
    kwhAdded: Math.round(kwhAdded * 1000) / 1000,
    cost: Math.round(kwhAdded * pricePerKwh),
  }
}

export async function getSettings() {
  const db = useDb()
  const [row] = await db.select().from(schema.settings).limit(1)
  return row ?? null
}

export function priceFor(s: { priceHomePerKwh: number, priceSpkluPerKwh: number }, location: 'home' | 'spklu') {
  return location === 'home' ? s.priceHomePerKwh : s.priceSpkluPerKwh
}

export function parseBody<T>(schemaDef: z.ZodType<T>, body: unknown): T {
  const result = schemaDef.safeParse(body)
  if (!result.success) {
    throw createError({ statusCode: 400, statusMessage: result.error.issues[0]?.message ?? 'Invalid input' })
  }
  return result.data
}
