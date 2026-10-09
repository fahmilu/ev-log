// Protect every /api route except login.
export default defineEventHandler(async (event) => {
  const path = event.path
  if (!path.startsWith('/api/') || path.startsWith('/api/auth/') || path.startsWith('/api/_auth/')) return
  await requireUserSession(event)
})
