export interface AppSettings {
  id: number
  batteryKwh: number
  priceHomePerKwh: number
  priceSpkluPerKwh: number
  updatedAt: string
}

export function useSettings() {
  return useFetch<AppSettings | null>('/api/settings', { key: 'settings' })
}
