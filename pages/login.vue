<script setup lang="ts">
import { useUser } from '~/components/useUser'
import { ref } from 'vue'
useHead({ title: 'เข้าสู่ระบบ — VolunteerSpace' })
import { HandHeart, Hand  } from 'lucide-vue-next'

const { login } = useUser()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  error.value = ''
  if (!email.value || !password.value) { error.value = 'กรุณากรอกอีเมลและรหัสผ่าน'; return }
  loading.value = true
  await new Promise(r => setTimeout(r, 800))
  login(email.value)
  loading.value = false
  navigateTo('/profile')
}
</script>

<template>
  <div class="min-h-screen flex">

    <!-- ── Left panel ── -->
    <div class="hidden lg:flex w-1/2 flex-col justify-between bg-emerald-600 p-14 text-white relative overflow-hidden">
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,#059669,#065f46)]" />
      <div class="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-emerald-500/20 rounded-full" />
      <div class="absolute top-10 -left-20 w-72 h-72 bg-emerald-700/20 rounded-full" />

      <!-- Logo -->
      <div class="relative flex items-center gap-2.5">

        <span class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
          <HandHeart class="w-6 h-6 text-white"/>
        </span>

        <span class="font-semibold text-xl tracking-tight">
          VolunteerSpace
        </span>

      </div>

      <!-- Quote -->
      <div class="relative">
        <div class="text-5xl text-emerald-400/50 font-serif leading-none mb-4">"</div>
        <p class="text-3xl font-bold leading-snug mb-5">ทุกชั่วโมงที่คุณให้<br/>คือการเปลี่ยนแปลง<br/>ที่ยิ่งใหญ่</p>
        <p class="text-emerald-200 text-sm leading-relaxed">ร่วมเป็นส่วนหนึ่งของชุมชนจิตอาสากว่า 4,000 คนทั่วประเทศ</p>
      </div>

      <!-- Stats -->
      <div class="relative flex gap-10">
        <div v-for="s in [{ v: '4,320', l: 'จิตอาสา' }, { v: '128', l: 'กิจกรรม' }, { v: '21,500', l: 'ชั่วโมง' }]" :key="s.l">
          <p class="text-2xl font-bold">{{ s.v }}</p>
          <p class="text-emerald-300 text-xs mt-0.5">{{ s.l }}</p>
        </div>
      </div>
    </div>

    <!-- ── Right panel ── -->
    <div class="flex-1 flex items-center justify-center bg-stone-50 px-8 py-12">
      <div class="w-full max-w-[380px]">

        <NuxtLink to="/" class="inline-flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-700 transition-colors mb-10">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/>
          </svg>
          กลับหน้าแรก
        </NuxtLink>

        <h1 class="text-2xl font-bold text-stone-900 mb-1.5 flex items-center gap-2">
          ยินดีต้อนรับกลับ
          <Hand class="w-6 h-6 text-emerald-600"/>
        </h1>
        <p class="text-sm text-stone-400 mb-8">เข้าสู่ระบบเพื่อจัดการกิจกรรมของคุณ</p>

        <div v-if="error" class="mb-5 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
          {{ error }}
        </div>

        <form class="flex flex-col gap-5" @submit.prevent="handleLogin">

          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-medium text-stone-700">อีเมล</label>
            <input v-model="email" type="email" placeholder="you@example.com"
              class="px-4 py-3 text-sm border border-stone-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition placeholder:text-stone-300"/>
          </div>

          <div class="flex flex-col gap-1.5">
            <div class="flex items-center justify-between">
              <label class="text-sm font-medium text-stone-700">รหัสผ่าน</label>
              <a href="#" class="text-xs text-emerald-600 hover:underline">ลืมรหัสผ่าน?</a>
            </div>
            <div class="relative">
              <input v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="••••••••"
                class="w-full px-4 py-3 pr-11 text-sm border border-stone-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition placeholder:text-stone-300"/>
              <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-stone-300 hover:text-stone-500 p-1" @click="showPassword = !showPassword">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path v-if="!showPassword" stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178zM15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path v-else stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"/>
                </svg>
              </button>
            </div>
          </div>

          <button type="submit" :disabled="loading"
            class="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-medium text-sm rounded-xl transition-colors flex items-center justify-center gap-2 mt-1">
            <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            {{ loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ' }}
          </button>
        </form>

        <div class="flex items-center gap-3 my-7">
          <hr class="flex-1 border-stone-200"/>
          <span class="text-xs text-stone-400">หรือ</span>
          <hr class="flex-1 border-stone-200"/>
        </div>

        <p class="text-center text-sm text-stone-500">
          ยังไม่มีบัญชี?
          <NuxtLink to="/register" class="text-emerald-600 font-medium hover:underline ml-1">สมัครสมาชิก</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>