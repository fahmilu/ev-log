<script setup lang="ts">
const { data: settings, refresh } = await useSettings()

const form = reactive({
  batteryKwh: settings.value?.batteryKwh ?? 0,
  priceHomePerKwh: settings.value?.priceHomePerKwh ?? 0,
  priceSpkluPerKwh: settings.value?.priceSpkluPerKwh ?? 0,
})

const busy = ref(false)
const message = ref('')
const error = ref('')

async function save() {
  busy.value = true
  message.value = ''
  error.value = ''
  try {
    await $fetch('/api/settings', { method: 'PUT', body: form })
    await refresh()
    message.value = 'Settings saved.'
  }
  catch (e: any) {
    error.value = e?.data?.statusMessage || 'Failed to save'
  }
  finally {
    busy.value = false
  }
}
</script>

<template>
  <div class="stack narrow">
    <div class="page-head">
      <h1>Settings</h1>
    </div>

    <form class="card stack" @submit.prevent="save">
      <label class="field">
        <span>Battery capacity (usable)</span>
        <div class="suffix">
          <input v-model.number="form.batteryKwh" type="number" inputmode="decimal" min="1" step="0.01" required>
          <em>kWh</em>
        </div>
      </label>

      <label class="field">
        <span>🏠 Home price</span>
        <div class="suffix">
          <input v-model.number="form.priceHomePerKwh" type="number" inputmode="decimal" min="0" step="0.01" required>
          <em>Rp/kWh</em>
        </div>
      </label>

      <label class="field">
        <span>⚡ SPKLU price</span>
        <div class="suffix">
          <input v-model.number="form.priceSpkluPerKwh" type="number" inputmode="decimal" min="0" step="0.01" required>
          <em>Rp/kWh</em>
        </div>
      </label>

      <p class="muted small">
        Changes apply to new sessions only. Existing sessions keep the capacity and price they were recorded with.
      </p>

      <p v-if="message" class="success small">{{ message }}</p>
      <p v-if="error" class="error small">{{ error }}</p>

      <button class="btn primary block" :disabled="busy">{{ busy ? 'Saving…' : 'Save settings' }}</button>
    </form>
  </div>
</template>
