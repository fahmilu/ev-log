import { timingSafeEqual } from 'node:crypto'

export default defineEventHandler(async (event) => {
  const { password } = await readBody<{ password?: string }>(event)
  const expected = useRuntimeConfig(event).appPassword
  if (!expected) {
    throw createError({ statusCode: 500, statusMessage: 'NUXT_APP_PASSWORD is not configured' })
  }
  const a = Buffer.from(String(password ?? ''))
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    throw createError({ statusCode: 401, statusMessage: 'Wrong password' })
  }
  await setUserSession(event, { user: { name: 'owner' }, loggedInAt: Date.now() })
  return { ok: true }
})
