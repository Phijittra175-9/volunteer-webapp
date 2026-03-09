// composables/useUser.ts
// วางไว้ที่ composables/useUser.ts → Nuxt auto-import ให้อัตโนมัติ ไม่ต้อง import เอง

import { auth } from '~/utils/supabase'
import db from '~/utils/supabase'
import type { User } from '~/utils/supabase'

export const useUser = () => {
  const user    = useState<any>('auth_user',     () => null)
  const profile = useState<User | null>('user_profile', () => null)
  const loading = useState<boolean>('user_loading',  () => false)

  // โหลด auth user + profile พร้อมกัน
  const fetchUser = async () => {
  // ถ้าไม่มี token ไม่ต้องเรียก API เลย
  if (!auth.isLoggedIn()) {
    user.value = null
    profile.value = null
    return
  }

  loading.value = true
  try {
    const authUser = await auth.getUser()
    user.value = authUser
    if (authUser?.id) {
      profile.value = await db.getUserProfile(authUser.id)
    }
  } catch {
    user.value = null
    profile.value = null
  } finally {
    loading.value = false
  }
}

  const signIn = async (email: string, password: string) => {
    const data = await auth.signIn(email, password)
    await fetchUser()
    return data
  }

  const signUp = async (email: string, password: string) => {
    return auth.signUp(email, password)
  }

  const signOut = async () => {
    await auth.signOut()
    user.value = null
    profile.value = null
  }

  const isAdmin      = computed(() => profile.value?.role === 'admin')
  const isOrganizer  = computed(() => profile.value?.role === 'organizer' || profile.value?.role === 'admin')
  const isLoggedIn   = computed(() => !!user.value)

  return { user, profile, loading, fetchUser, signIn, signUp, signOut, isAdmin, isOrganizer, isLoggedIn }
}