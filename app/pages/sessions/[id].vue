<script setup lang="ts">
import type { SessionFormValue } from '~/components/SessionForm.vue'

const route = useRoute()
const id = route.params.id as string
const { data: session, error: loadError } = await useFetch(`/api/sessions/${id}`)

const busy = ref(false)
const error = ref('')

async function save(value: SessionFormValue) {
  busy.value = true
  error.value = ''
  try {
    await $fetch(`/api/sessions/${id}`, { method: 'PUT', body: value })
    await navigateTo('/sessions')
  }
  catch (e: any) {
    error.value = e?.data?.statusMessage || 'Failed to save'
  }
  finally {
    busy.value = false
  }
}

async function remove() {
  if (!confirm('Delete this session?')) return
  await $fetch(`/api/sessions/${id}`, { method: 'DELETE' })
  await navigateTo('/sessions')
}
</script>

<template>
  <div class="stack narrow">
    <div class="page-head">
      <h1>Edit session</h1>
      <button v-if="session" class="btn ghost sm danger" @click="remove">Delete</button>
    </div>
    <p v-if="loadError" class="alert error">Session not found.</p>
    <p v-if="error" class="alert error">{{ error }}</p>
    <section v-if="session" class="card">
      <SessionForm
        :initial="{ ...session, note: session.note ?? '' }"
        :snapshot="{ batteryKwh: session.batteryKwh, pricePerKwh: session.pricePerKwh, location: session.location }"
        submit-label="Update session"
        :busy="busy"
        @submit="save"
      />
      <p class="muted small mt">
        Recorded {{ new Date(session.createdAt).toLocaleString('en-GB') }} ·
        uses the battery capacity and price saved with this session.
      </p>
    </section>
  </div>
</template>
