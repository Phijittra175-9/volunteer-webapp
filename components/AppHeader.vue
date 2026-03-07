<script setup lang="ts">
import { ref } from 'vue'
import { HandHeart  } from 'lucide-vue-next'

const navLinks = [
  { label: 'กิจกรรม', href: '/activities' },
]

const mobileOpen = ref(false)
</script>

<template>
  <header class="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-100">
    <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

      <!-- Logo — หัวใจ -->
      <NuxtLink to="/" class="flex items-center gap-2 group">
        <span >
          <HandHeart class="w-6 h-6 text-emerald-600"/>
        </span>
        <span class="font-semibold text-stone-800 tracking-tight">
          Volunteer<span class="text-emerald-600">Space</span>
        </span>
      </NuxtLink>

      <!-- Actions -->
      <div class="hidden md:flex items-center gap-3">
        <NuxtLink
          to="/login"
          class="text-sm text-stone-600 hover:text-stone-900 transition-colors px-3 py-1.5"
        >
          เข้าสู่ระบบ
        </NuxtLink>
        <NuxtLink
          to="/register"
          class="text-sm bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded-lg transition-colors"
        >
          สมัครสมาชิก
        </NuxtLink>
        <!-- ไอคอนคน → โปรไฟล์ -->
        <NuxtLink
          to="/profile"
          class="w-8 h-8 rounded-full border border-stone-200 hover:border-emerald-400 flex items-center justify-center text-stone-500 hover:text-emerald-600 transition-colors"
          title="โปรไฟล์"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
          </svg>
        </NuxtLink>
      </div>

      <!-- Mobile toggle -->
      <button class="md:hidden text-stone-500" @click="mobileOpen = !mobileOpen">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path v-if="!mobileOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <!-- Mobile menu -->
    <Transition name="slide">
      <div v-if="mobileOpen" class="md:hidden border-t border-stone-100 bg-white px-6 py-4 flex flex-col gap-4">
        <NuxtLink v-for="link in navLinks" :key="link.href" :to="link.href" class="text-sm text-stone-600">
          {{ link.label }}
        </NuxtLink>
        <hr class="border-stone-100" />
        <NuxtLink to="/login" class="text-sm text-stone-600">เข้าสู่ระบบ</NuxtLink>
        <NuxtLink to="/register" class="text-sm bg-emerald-600 text-white text-center px-4 py-2 rounded-lg">
          สมัครสมาชิก
        </NuxtLink>
        <NuxtLink to="/profile" class="text-sm text-stone-600 flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
          </svg>
          โปรไฟล์
        </NuxtLink>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.slide-enter-active, .slide-leave-active { transition: all 0.2s ease; }
.slide-enter-from, .slide-leave-to { opacity: 0; transform: translateY(-6px); }
</style>