<script setup lang="ts">
interface Bucket { sessions: number, kwh: number, cost: number }
const props = defineProps<{ months: { month: string, home: Bucket, spklu: Bucket }[] }>()

const metric = ref<'cost' | 'kwh'>('cost')

const max = computed(() =>
  Math.max(1, ...props.months.map(m => m.home[metric.value] + m.spklu[metric.value])),
)

const fmt = (v: number) => (metric.value === 'cost' ? formatIDR(v) : formatKwh(v))
const pct = (v: number) => `${(v / max.value) * 100}%`
</script>

<template>
  <section class="card">
    <div class="card-head">
      <h2>Monthly breakdown</h2>
      <div class="seg sm">
        <button :class="{ on: metric === 'cost' }" @click="metric = 'cost'">Cost</button>
        <button :class="{ on: metric === 'kwh' }" @click="metric = 'kwh'">kWh</button>
      </div>
    </div>

    <p v-if="!months.length" class="muted">No data in this period.</p>

    <ul v-else class="bars">
      <li v-for="m in months" :key="m.month">
        <div class="bar-label">
          <span>{{ formatMonth(m.month) }}</span>
          <strong>{{ fmt(m.home[metric] + m.spklu[metric]) }}</strong>
        </div>
        <div class="bar-track">
          <div class="bar home" :style="{ width: pct(m.home[metric]) }" :title="`Home: ${fmt(m.home[metric])}`" />
          <div class="bar spklu" :style="{ width: pct(m.spklu[metric]) }" :title="`SPKLU: ${fmt(m.spklu[metric])}`" />
        </div>
        <div class="bar-sub muted small">
          <span><i class="dot home" /> {{ fmt(m.home[metric]) }}</span>
          <span><i class="dot spklu" /> {{ fmt(m.spklu[metric]) }}</span>
          <span>{{ m.home.sessions + m.spklu.sessions }} sessions</span>
        </div>
      </li>
    </ul>
  </section>
</template>
