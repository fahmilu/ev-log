export type RangeMode = 'month' | 'range' | 'year' | 'all'

// Date-range filter kept in the URL query so it survives reloads and navigation.
export function useRange() {
  const route = useRoute()
  const router = useRouter()

  const mode = computed<RangeMode>(() => (route.query.mode as RangeMode) || 'month')
  const month = computed(() => (route.query.month as string) || currentMonth())
  const year = computed(() => (route.query.year as string) || todayISO().slice(0, 4))
  const from = computed(() => (route.query.from as string) || monthBounds(currentMonth()).from)
  const to = computed(() => (route.query.to as string) || todayISO())

  const params = computed<{ from?: string, to?: string }>(() => {
    switch (mode.value) {
      case 'month': return monthBounds(month.value)
      case 'year': return { from: `${year.value}-01-01`, to: `${year.value}-12-31` }
      case 'range': return { from: from.value, to: to.value }
      default: return {}
    }
  })

  const label = computed(() => {
    switch (mode.value) {
      case 'month': return formatMonth(month.value)
      case 'year': return year.value
      case 'range': return `${formatDate(from.value)} – ${formatDate(to.value)}`
      default: return 'All time'
    }
  })

  function update(patch: Record<string, string | undefined>) {
    router.replace({ query: { ...route.query, ...patch } })
  }

  function shiftMonth(delta: number) {
    const [y, m] = month.value.split('-').map(Number)
    const d = new Date(y!, m! - 1 + delta, 1)
    update({ mode: 'month', month: toISODate(d).slice(0, 7) })
  }

  return { mode, month, year, from, to, params, label, update, shiftMonth }
}
