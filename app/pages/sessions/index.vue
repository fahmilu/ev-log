<script setup lang="ts">
const { params, label } = useRange()

const { data: sessions, status, refresh } = await useFetch('/api/sessions', { query: params, default: () => [] })

const totals = computed(() => sessions.value.reduce(
  (acc, s) => ({ kwh: acc.kwh + s.kwhAdded, cost: acc.cost + s.cost }),
  { kwh: 0, cost: 0 },
))

async function remove(id: number) {
  if (!confirm('Delete this session?')) return
  await $fetch(`/api/sessions/${id}`, { method: 'DELETE' })
  await refresh()
}
</script>

<template>
  <div class="stack">
    <div class="page-head">
      <h1>Sessions</h1>
      <NuxtLink to="/sessions/new" class="btn primary sm">+ Add</NuxtLink>
    </div>

    <RangePicker />

    <section class="card flush" :class="{ loading: status === 'pending' }">
      <div class="card-head padded">
        <h2>{{ sessions.length }} sessions</h2>
        <span class="muted small">{{ label }}</span>
      </div>

      <p v-if="!sessions.length" class="muted padded">No sessions in this period.</p>

      <div v-else class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Location</th>
              <th class="num">Start → Finish</th>
              <th class="num">kWh</th>
              <th class="num">Rp/kWh</th>
              <th class="num">Cost</th>
              <th>Note</th>
              <th />
            </tr>
          </thead>
          <tbody>
            <tr v-for="s in sessions" :key="s.id">
              <td class="nowrap">{{ formatDate(s.chargeDate) }}</td>
              <td><span class="badge" :class="s.location">{{ locationLabel(s.location) }}</span></td>
              <td class="num nowrap">{{ formatNum(s.startPct, 1) }}% → {{ formatNum(s.endPct, 1) }}%</td>
              <td class="num">{{ formatNum(s.kwhAdded) }}</td>
              <td class="num">{{ formatNum(s.pricePerKwh) }}</td>
              <td class="num nowrap"><strong>{{ formatIDR(s.cost) }}</strong></td>
              <td class="note">{{ s.note }}</td>
              <td class="actions nowrap">
                <NuxtLink :to="`/sessions/${s.id}`" class="btn ghost xs">Edit</NuxtLink>
                <button class="btn ghost xs danger" @click="remove(s.id)">Delete</button>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3">Total</td>
              <td class="num">{{ formatNum(totals.kwh) }}</td>
              <td class="num">{{ formatNum(totals.kwh ? totals.cost / totals.kwh : 0) }}</td>
              <td class="num nowrap">{{ formatIDR(totals.cost) }}</td>
              <td colspan="2" />
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  </div>
</template>
