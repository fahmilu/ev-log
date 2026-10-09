export default defineNuxtConfig({
  compatibilityDate: '2026-10-01',
  devtools: { enabled: true },
  modules: ['nuxt-auth-utils'],
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: 'EV Log',
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'theme-color', content: '#0f172a' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
      ],
    },
  },
  runtimeConfig: {
    databaseUrl: '', // NUXT_DATABASE_URL or DATABASE_URL
    appPassword: '', // NUXT_APP_PASSWORD
  },
})
