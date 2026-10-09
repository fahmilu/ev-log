<script setup lang="ts">
const { fetch: refreshSession } = useUserSession()
const password = ref('')
const error = ref('')
const busy = ref(false)

async function login() {
  busy.value = true
  error.value = ''
  try {
    await $fetch('/api/auth/login', { method: 'POST', body: { password: password.value } })
    await refreshSession()
    await navigateTo('/')
  }
  catch (e: any) {
    error.value = e?.data?.statusMessage || e?.statusMessage || 'Login failed'
  }
  finally {
    busy.value = false
  }
}
</script>

<template>
  <div class="login">
    <form class="card stack" @submit.prevent="login">
      <h1>⚡ EV Log</h1>
      <p class="muted">Track your EV charging energy and cost.</p>
      <label class="field">
        <span>Password</span>
        <input v-model="password" type="password" autocomplete="current-password" required autofocus>
      </label>
      <p v-if="error" class="error small">{{ error }}</p>
      <button class="btn primary block" :disabled="busy">{{ busy ? 'Signing in…' : 'Sign in' }}</button>
    </form>
  </div>
</template>
