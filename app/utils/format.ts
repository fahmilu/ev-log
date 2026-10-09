const idr = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })
const num = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 })

export const formatIDR = (v: number) => idr.format(Math.round(v || 0))
export const formatKwh = (v: number) => `${num.format(v || 0)} kWh`
export const formatNum = (v: number, digits = 2) =>
  new Intl.NumberFormat('en-US', { maximumFractionDigits: digits }).format(v || 0)

export function formatDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y!, m! - 1, d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function formatMonth(ym: string) {
  const [y, m] = ym.split('-').map(Number)
  return new Date(y!, m! - 1, 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

const pad = (n: number) => String(n).padStart(2, '0')
export const toISODate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
export const todayISO = () => toISODate(new Date())
export const currentMonth = () => todayISO().slice(0, 7)

export function monthBounds(ym: string) {
  const [y, m] = ym.split('-').map(Number)
  return { from: toISODate(new Date(y!, m! - 1, 1)), to: toISODate(new Date(y!, m!, 0)) }
}

export const locationLabel = (l: 'home' | 'spklu') => (l === 'home' ? 'Home' : 'SPKLU')
