<script setup lang="ts">
import type { SessionFormValue } from '~/components/SessionForm.vue'

const busy = ref(false)
const error = ref('')

async function save(value: SessionFormValue) {
  busy.value = true
  error.value = ''
  try {
    await $fetch('/api/sessions', { method: 'POST', body: value })
    await navigateTo('/sessions')
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
      <h1>New charging session</h1>
    </div>
    <p v-if="error" class="alert error">{{ error }}</p>
    <section class="card">
      <SessionForm :busy="busy" @submit="save" />
    </section>
  </div>
</template>
