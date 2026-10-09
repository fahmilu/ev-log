import { and, count, gte, lte, sql, sum } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const { from, to } = parseBody(rangeQuery, getQuery(event))
  const s = schema.chargingSessions
  const db = useDb()
  const where = and(from ? gte(s.chargeDate, from) : undefined, to ? lte(s.chargeDate, to) : undefined)

  const month = sql<string>`to_char(${s.chargeDate}, 'YYYY-MM')`
  const metrics = {
    sessions: count(),
    kwh: sql<number>`coalesce(${sum(s.kwhAdded)}, 0)::float8`,
    cost: sql<number>`coalesce(${sum(s.cost)}, 0)::float8`,
    pct: sql<number>`coalesce(sum(${s.endPct} - ${s.startPct}), 0)::float8`,
  }

  const [byLocation, byMonth] = await Promise.all([
    db.select({ location: s.location, ...metrics }).from(s).where(where).groupBy(s.location),
    db.select({ month, location: s.location, ...metrics }).from(s).where(where).groupBy(month, s.location).orderBy(month),
  ])

  const empty = () => ({ sessions: 0, kwh: 0, cost: 0, pct: 0 })
  const home = { ...empty(), ...byLocation.find(r => r.location === 'home') }
  const spklu = { ...empty(), ...byLocation.find(r => r.location === 'spklu') }
  const total = {
    sessions: home.sessions + spklu.sessions,
    kwh: home.kwh + spklu.kwh,
    cost: home.cost + spklu.cost,
    pct: home.pct + spklu.pct,
  }

  const months = new Map<string, { month: string, home: ReturnType<typeof empty>, spklu: ReturnType<typeof empty> }>()
  for (const r of byMonth) {
    const m = months.get(r.month) ?? { month: r.month, home: empty(), spklu: empty() }
    m[r.location] = { sessions: r.sessions, kwh: r.kwh, cost: r.cost, pct: r.pct }
    months.set(r.month, m)
  }

  return {
    from: from ?? null,
    to: to ?? null,
    total: { ...total, avgPricePerKwh: total.kwh ? total.cost / total.kwh : 0 },
    home: { location: 'home' as const, sessions: home.sessions, kwh: home.kwh, cost: home.cost, pct: home.pct },
    spklu: { location: 'spklu' as const, sessions: spklu.sessions, kwh: spklu.kwh, cost: spklu.cost, pct: spklu.pct },
    months: [...months.values()],
  }
})
