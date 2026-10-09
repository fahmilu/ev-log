<script setup lang="ts">
import type { RangeMode } from '~/composables/useRange'

const { mode, month, year, from, to, label, update, shiftMonth } = useRange()

const modes: { value: RangeMode, label: string }[] = [
  { value: 'month', label: 'Monthly' },
  { value: 'year', label: 'Yearly' },
  { value: 'range', label: 'Custom' },
  { value: 'all', label: 'All' },
]

const years = computed(() => {
  const now = new Date().getFullYear()
  return Array.from({ length: 6 }, (_, i) => String(now - i))
})

function setMode(m: RangeMode) {
  if (m === 'range') {
    update({ mode: m, from: from.value, to: to.value })
  }
  else {
    update({ mode: m })
  }
}
</script>

<template>
  <div class="range card">
    <div class="seg">
      <button v-for="m in modes" :key="m.value" :class="{ on: mode === m.value }" @click="setMode(m.value)">
        {{ m.label }}
      </button>
    </div>

    <div v-if="mode === 'month'" class="range-row">
      <button class="btn icon" aria-label="Previous month" @click="shiftMonth(-1)">‹</button>
      <input type="month" :value="month" @change="update({ month: ($event.target as HTMLInputElement).value || undefined })">
      <button class="btn icon" aria-label="Next month" @click="shiftMonth(1)">›</button>
    </div>

    <div v-else-if="mode === 'year'" class="range-row">
      <select :value="year" @change="update({ year: ($event.target as HTMLSelectElement).value })">
        <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
      </select>
    </div>

    <div v-else-if="mode === 'range'" class="range-row">
      <label class="field inline">
        <span>From</span>
        <input type="date" :value="from" :max="to" @change="update({ from: ($event.target as HTMLInputElement).value || undefined })">
      </label>
      <label class="field inline">
        <span>To</span>
        <input type="date" :value="to" :min="from" @change="update({ to: ($event.target as HTMLInputElement).value || undefined })">
      </label>
    </div>

    <p class="muted small range-label">{{ label }}</p>
  </div>
</template>
