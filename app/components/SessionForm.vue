<script setup lang="ts">
export interface SessionFormValue {
  chargeDate: string
  location: 'home' | 'spklu'
  startPct: number
  endPct: number
  note: string
}

const props = defineProps<{
  initial?: Partial<SessionFormValue>
  // Snapshot values of an existing session; when absent, current settings are used.
  snapshot?: { batteryKwh: number, pricePerKwh: number, location: 'home' | 'spklu' }
  submitLabel?: string
  busy?: boolean
}>()
const emit = defineEmits<{ submit: [value: SessionFormValue] }>()

const { data: settings } = await useSettings()

const form = reactive<SessionFormValue>({
  chargeDate: props.initial?.chargeDate ?? todayISO(),
  location: props.initial?.location ?? 'home',
  startPct: props.initial?.startPct ?? 20,
  endPct: props.initial?.endPct ?? 80,
  note: props.initial?.note ?? '',
})

const batteryKwh = computed(() => props.snapshot?.batteryKwh ?? settings.value?.batteryKwh ?? 0)
const pricePerKwh = computed(() => {
  if (props.snapshot && props.snapshot.location === form.location) return props.snapshot.pricePerKwh
  if (!settings.value) return 0
  return form.location === 'home' ? settings.value.priceHomePerKwh : settings.value.priceSpkluPerKwh
})

const valid = computed(() =>
  !!form.chargeDate && form.startPct >= 0 && form.endPct <= 100 && form.endPct > form.startPct,
)
const kwh = computed(() => (valid.value ? ((form.endPct - form.startPct) / 100) * batteryKwh.value : 0))
const cost = computed(() => kwh.value * pricePerKwh.value)

function onSubmit() {
  if (valid.value) emit('submit', { ...form })
}
</script>

<template>
  <form class="stack" @submit.prevent="onSubmit">
    <div v-if="!settings && !snapshot" class="alert">
      Set your battery capacity and prices in <NuxtLink to="/settings">Settings</NuxtLink> first.
    </div>

    <label class="field">
      <span>Charge date</span>
      <input v-model="form.chargeDate" type="date" required :max="todayISO()">
    </label>

    <div class="field">
      <span>Location</span>
      <div class="seg big">
        <button type="button" :class="{ on: form.location === 'home' }" @click="form.location = 'home'">🏠 Home</button>
        <button type="button" :class="{ on: form.location === 'spklu' }" @click="form.location = 'spklu'">⚡ SPKLU</button>
      </div>
    </div>

    <div class="grid-2">
      <label class="field">
        <span>Start %</span>
        <input v-model.number="form.startPct" type="number" inputmode="decimal" min="0" max="100" step="0.1" required>
      </label>
      <label class="field">
        <span>Finish %</span>
        <input v-model.number="form.endPct" type="number" inputmode="decimal" min="0" max="100" step="0.1" required>
      </label>
    </div>

    <div class="soc">
      <div class="soc-track">
        <div class="soc-fill" :style="{ left: `${form.startPct}%`, width: `${Math.max(0, form.endPct - form.startPct)}%` }" />
      </div>
      <input v-model.number="form.startPct" type="range" min="0" max="100" step="1" aria-label="Start %">
      <input v-model.number="form.endPct" type="range" min="0" max="100" step="1" aria-label="Finish %">
    </div>

    <p v-if="form.endPct <= form.startPct" class="error small">Finish % must be greater than start %.</p>

    <label class="field">
      <span>Note <em class="muted">(optional)</em></span>
      <input v-model="form.note" type="text" maxlength="500" placeholder="e.g. SPKLU Rest Area KM 57">
    </label>

    <div class="preview card tinted">
      <div>
        <span class="muted small">Energy added</span>
        <strong>{{ formatKwh(kwh) }}</strong>
        <span class="muted small">{{ formatNum(form.endPct - form.startPct, 1) }}% × {{ formatNum(batteryKwh) }} kWh</span>
      </div>
      <div>
        <span class="muted small">Estimated cost</span>
        <strong>{{ formatIDR(cost) }}</strong>
        <span class="muted small">@ {{ formatIDR(pricePerKwh) }}/kWh</span>
      </div>
    </div>

    <button class="btn primary block" type="submit" :disabled="!valid || busy || (!settings && !snapshot)">
      {{ busy ? 'Saving…' : (submitLabel ?? 'Save session') }}
    </button>
  </form>
</template>
