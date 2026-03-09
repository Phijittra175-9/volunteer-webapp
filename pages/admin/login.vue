<script setup lang="ts">
import { auth } from '~/utils/supabase'
import db from '~/utils/supabase'
import { ShieldCheck } from 'lucide-vue-next'

useHead({ title: 'Admin Login — VolunteerSpace' })

// ถ้า login อยู่แล้วให้ไป /admin เลย
onMounted(() => {
  if (auth.isLoggedIn()) navigateTo('/admin')
})

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  error.value = ''
  if (!email.value || !password.value) {
    error.value = 'กรุณากรอกอีเมลและรหัสผ่าน'
    return
  }
  loading.value = true
  try {
    const data = await auth.signIn(email.value, password.value)
    const profile = await db.getUserProfile(data.user.id)
    if (profile?.role !== 'admin') {
      await auth.signOut()
      error.value = 'คุณไม่มีสิทธิ์เข้าใช้งานระบบ Admin'
      return
    }
    navigateTo('/admin')
  } catch (e: any) {
    error.value = 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-stone-900 flex items-center justify-center px-6">
    <div class="w-full max-w-sm">

      <!-- Logo -->
      <div class="flex flex-col items-center mb-8">
        <div class="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center mb-4">
          <ShieldCheck class="w-8 h-8 text-white" />
        </div>
        <h1 class="text-xl font-bold text-white">Admin Portal</h1>
        <p class="text-stone-400 text-sm mt-1">VolunteerSpace</p>
      </div>

      <!-- Card -->
      <div class="bg-stone-800 rounded-2xl border border-stone-700 p-8">

        <div v-if="error" class="mb-5 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-400">
          {{ error }}
        </div>

        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-medium text-stone-400 uppercase tracking-wider">อีเมล</label>
            <input v-model="email" type="email" placeholder="admin@volunteerspace.com"
              class="px-4 py-3 text-sm border border-stone-600 rounded-xl bg-stone-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition placeholder:text-stone-500"/>
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-medium text-stone-400 uppercase tracking-wider">รหัสผ่าน</label>
            <div class="relative">
              <input v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="••••••••"
                class="w-full px-4 py-3 pr-11 text-sm border border-stone-600 rounded-xl bg-stone-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition placeholder:text-stone-500"/>
              <button type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200 p-1"
                @click="showPassword = !showPassword">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path v-if="!showPassword" stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178zM15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path v-else stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"/>
                </svg>
              </button>
            </div>
          </div>

          <button
            class="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-medium text-sm rounded-xl transition-colors flex items-center justify-center gap-2 mt-2"
            :disabled="loading"
            @click="handleLogin">
            <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            {{ loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ' }}
          </button>
        </div>

      </div>

      <p class="text-center text-xs text-stone-600 mt-6">
        สำหรับผู้ดูแลระบบเท่านั้น
      </p>
    </div>
  </div>
</template>