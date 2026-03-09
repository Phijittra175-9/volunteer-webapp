export default defineNuxtRouteMiddleware(() => {
  if (import.meta.server) return

  const token = localStorage.getItem('sb_token')
  if (!token) {
    return navigateTo('/login')
  }
})