<script setup lang="ts">
const { params, label } = useRange()

const { data: summary, status } = await useFetch('/api/summary', { query: params })
const { data: settings } = await useSettings()

const share = computed(() => {
  const t = summary.value?.total.cost || 0
  return t ? (summary.value!.home.cost / t) * 100 : 0
})
</script>

<template>
  <div class="stack">
    <div class="page-head">
      <h1>Dashboard</h1>
      <NuxtLink to="/sessions/new" class="btn primary sm">+ Add</NuxtLink>
    </div>

    <div v-if="!settings" class="alert">
      Welcome! Start by setting your battery capacity and electricity prices in
      <NuxtLink to="/settings">Settings</NuxtLink>.
    </div>

    <RangePicker />

    <div v-if="summary" class="stack" :class="{ loading: status === 'pending' }">
      <div class="stats">
        <div class="stat card accent">
          <span class="muted small">Total cost</span>
          <strong>{{ formatIDR(summary.total.cost) }}</strong>
        </div>
        <div class="stat card">
          <span class="muted small">Energy added</span>
          <strong>{{ formatKwh(summary.total.kwh) }}</strong>
        </div>
        <div class="stat card">
          <span class="muted small">Sessions</span>
          <strong>{{ summary.total.sessions }}</strong>
        </div>
        <div class="stat card">
          <span class="muted small">Avg price</span>
          <strong>{{ formatIDR(summary.total.avgPricePerKwh) }}<small>/kWh</small></strong>
        </div>
      </div>

      <section class="card">
        <div class="card-head">
          <h2>Home vs SPKLU</h2>
          <span class="muted small">{{ label }}</span>
        </div>
        <div class="split-bar" :class="{ empty: !summary.total.cost }">
          <div class="home" :style="{ width: `${share}%` }" />
          <div class="spklu" :style="{ width: `${summary.total.cost ? 100 - share : 0}%` }" />
        </div>
        <div class="split">
          <div v-for="loc in [summary.home, summary.spklu]" :key="loc.location" class="split-col">
            <h3><i class="dot" :class="loc.location" /> {{ locationLabel(loc.location) }}</h3>
            <dl>
              <dt>Cost</dt><dd>{{ formatIDR(loc.cost) }}</dd>
              <dt>Energy</dt><dd>{{ formatKwh(loc.kwh) }}</dd>
              <dt>Sessions</dt><dd>{{ loc.sessions }}</dd>
              <dt>Avg / kWh</dt><dd>{{ formatIDR(loc.kwh ? loc.cost / loc.kwh : 0) }}</dd>
              <dt>Total %</dt><dd>{{ formatNum(loc.pct, 1) }}%</dd>
            </dl>
          </div>
        </div>
      </section>

      <MonthlyChart :months="summary.months" />

      <NuxtLink :to="{ path: '/sessions', query: $route.query }" class="btn ghost block">
        View sessions in this period →
      </NuxtLink>
    </div>
  </div>
</template>
