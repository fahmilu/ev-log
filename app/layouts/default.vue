<script setup lang="ts">
const { loggedIn, clear } = useUserSession()
const route = useRoute()

const nav = [
  { to: '/', label: 'Dashboard', icon: 'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z' },
  { to: '/sessions', label: 'Sessions', icon: 'M4 6h16M4 12h16M4 18h16' },
  { to: '/sessions/new', label: 'Add', icon: 'M12 5v14M5 12h14' },
  { to: '/settings', label: 'Settings', icon: 'M12 15a3 3 0 100-6 3 3 0 000 6zm7.4-3a7.4 7.4 0 00-.1-1.2l2-1.6-2-3.4-2.4 1a7.6 7.6 0 00-2-1.2L14.5 3h-4l-.4 2.6a7.6 7.6 0 00-2 1.2l-2.4-1-2 3.4 2 1.6a7.4 7.4 0 000 2.4l-2 1.6 2 3.4 2.4-1a7.6 7.6 0 002 1.2l.4 2.6h4l.4-2.6a7.6 7.6 0 002-1.2l2.4 1 2-3.4-2-1.6c.1-.4.1-.8.1-1.2z' },
]

function isActive(to: string) {
  if (to === '/') return route.path === '/'
  if (to === '/sessions') return route.path === '/sessions' || /^\/sessions\/\d+/.test(route.path)
  return route.path === to
}

async function logout() {
  await $fetch('/api/auth/logout', { method: 'POST' })
  await clear()
  await navigateTo('/login')
}
</script>

<template>
  <div class="shell">
    <header v-if="loggedIn" class="topbar">
      <NuxtLink to="/" class="brand">
        <span class="bolt">⚡</span> EV Log
      </NuxtLink>
      <nav class="topnav">
        <NuxtLink v-for="n in nav" :key="n.to" :to="n.to" :class="{ active: isActive(n.to) }">{{ n.label }}</NuxtLink>
      </nav>
      <button class="btn ghost sm" @click="logout">Log out</button>
    </header>

    <main class="content">
      <slot />
    </main>

    <nav v-if="loggedIn" class="bottomnav">
      <NuxtLink v-for="n in nav" :key="n.to" :to="n.to" :class="{ active: isActive(n.to), add: n.to === '/sessions/new' }">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path :d="n.icon" /></svg>
        <span>{{ n.label }}</span>
      </NuxtLink>
    </nav>
  </div>
</template>
