<script setup lang="ts">
definePageMeta({ middleware: 'admin' })
useHead({ title: 'Admin — VolunteerSpace' })

import db from '~/utils/supabase'
import { auth } from '~/utils/supabase'

const tab = ref<'activities' | 'users'>('activities')

// ── Activities ─────────────────────────────────
const activities = ref<any[]>([])
const loadingActivities = ref(true)

async function fetchActivities() {
  loadingActivities.value = true
  activities.value = await db.getPendingActivities()
  loadingActivities.value = false
}

async function approve(id: number) {
  await db.approveActivity(id)
  activities.value = activities.value.filter(a => a.id !== id)
}

async function reject(id: number) {
  await db.rejectActivity(id)
  activities.value = activities.value.filter(a => a.id !== id)
}

// ── Users ──────────────────────────────────────
const users = ref<any[]>([])
const loadingUsers = ref(true)

async function fetchUsers() {
  loadingUsers.value = true
  users.value = await db.getUsers()
  loadingUsers.value = false
}

async function changeRole(userId: string, role: 'volunteer' | 'organizer' | 'admin') {
  await db.updateUserRole(userId, role)
  const u = users.value.find(u => u.id === userId)
  if (u) u.role = role
}

const { profile, fetchUser } = useUser()

onMounted(async () => {
  // เช็ค login
  if (!auth.isLoggedIn()) {
    navigateTo('admin/login')
    return
  }
  
  // เช็ค role
  await fetchUser()
  if (profile.value?.role !== 'admin') {
    navigateTo('admin/login')
    return
  }
  
  fetchActivities()
  fetchUsers()
})

const roleColor: Record<string, string> = {
  volunteer: 'bg-emerald-50 text-emerald-700',
  organizer: 'bg-blue-50 text-blue-700',
  admin:     'bg-red-50 text-red-700',
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>

<template>
  <div class="min-h-screen bg-stone-50">
    <AppHeader />
    <main class="pt-16">
      <div class="max-w-5xl mx-auto px-6 py-10">

        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-2xl font-bold text-stone-900">Admin Dashboard</h1>
          <p class="text-sm text-stone-400 mt-1">จัดการกิจกรรมและผู้ใช้งาน</p>
        </div>

        <!-- Tabs -->
        <div class="flex gap-1 bg-white border border-stone-100 rounded-2xl p-1 mb-8 w-fit">
          <button
            class="px-5 py-2 rounded-xl text-sm font-medium transition-all"
            :class="tab === 'activities' ? 'bg-stone-900 text-white' : 'text-stone-500 hover:text-stone-700'"
            @click="tab = 'activities'">
            กิจกรรมรออนุมัติ
            <span v-if="activities.length" class="ml-1.5 bg-amber-400 text-white text-xs px-1.5 py-0.5 rounded-full">
              {{ activities.length }}
            </span>
          </button>
          <button
            class="px-5 py-2 rounded-xl text-sm font-medium transition-all"
            :class="tab === 'users' ? 'bg-stone-900 text-white' : 'text-stone-500 hover:text-stone-700'"
            @click="tab = 'users'">
            จัดการ User
          </button>
        </div>

        <!-- Tab: Activities -->
        <div v-if="tab === 'activities'">
          <div v-if="loadingActivities" class="text-center py-20 text-stone-400 text-sm">กำลังโหลด...</div>
          <div v-else-if="!activities.length" class="text-center py-20">
            <p class="text-4xl mb-3">✓</p>
            <p class="text-stone-500 text-sm">ไม่มีกิจกรรมรออนุมัติ</p>
          </div>
          <div v-else class="flex flex-col gap-4">
            <div v-for="a in activities" :key="a.id"
              class="bg-white rounded-2xl border border-stone-100 p-5 flex flex-col sm:flex-row gap-4">

              <!-- Cover -->
              <div class="w-full sm:w-32 h-24 rounded-xl overflow-hidden shrink-0 bg-stone-100">
                <img v-if="a.image_url" :src="a.image_url" class="w-full h-full object-cover"/>
                <div v-else class="w-full h-full flex items-center justify-center text-stone-300 text-2xl">🎯</div>
              </div>

              <!-- Info -->
              <div class="flex-1 min-w-0">
                <div class="flex flex-wrap items-center gap-2 mb-1">
                  <span class="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-medium">รออนุมัติ</span>
                  <span v-if="a.category" class="text-xs bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full">{{ a.category }}</span>
                </div>
                <h3 class="font-semibold text-stone-800 text-sm leading-snug">{{ a.title }}</h3>
                <p class="text-xs text-stone-400 mt-1 line-clamp-2">{{ a.description }}</p>
                <div class="flex flex-wrap gap-3 mt-2 text-xs text-stone-400">
                  <span v-if="a.date">📅 {{ formatDate(a.date) }}</span>
                  <span v-if="a.location">📍 {{ a.location }}</span>
                  <span v-if="a.max_volunteers">👥 {{ a.max_volunteers }} คน</span>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex sm:flex-col gap-2 shrink-0">
                <button
                  class="flex-1 sm:flex-none px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl transition-colors"
                  @click="approve(a.id)">
                  ✓ อนุมัติ
                </button>
                <button
                  class="flex-1 sm:flex-none px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium rounded-xl transition-colors"
                  @click="reject(a.id)">
                  ✕ ปฏิเสธ
                </button>
                <NuxtLink :to="`/activities/${a.id}`" target="_blank"
                  class="flex-1 sm:flex-none px-4 py-2 bg-stone-50 hover:bg-stone-100 text-stone-600 text-sm font-medium rounded-xl transition-colors text-center">
                  ดูรายละเอียด
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab: Users -->
        <div v-else-if="tab === 'users'">
          <div v-if="loadingUsers" class="text-center py-20 text-stone-400 text-sm">กำลังโหลด...</div>
          <div v-else class="bg-white rounded-2xl border border-stone-100 overflow-hidden">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-stone-100 text-xs text-stone-400 uppercase tracking-wider">
                  <th class="text-left px-5 py-3 font-medium">ผู้ใช้</th>
                  <th class="text-left px-5 py-3 font-medium hidden sm:table-cell">สมัครเมื่อ</th>
                  <th class="text-left px-5 py-3 font-medium hidden sm:table-cell">ชั่วโมง</th>
                  <th class="text-left px-5 py-3 font-medium">Role</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="u in users" :key="u.id" class="border-b border-stone-50 last:border-0 hover:bg-stone-50 transition-colors">
                  <td class="px-5 py-3">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-xs font-bold text-stone-600 shrink-0">
                        {{ (u.full_name ?? u.email ?? '?').charAt(0).toUpperCase() }}
                      </div>
                      <div>
                        <p class="font-medium text-stone-800 text-sm">{{ u.full_name ?? '(ยังไม่ตั้งชื่อ)' }}</p>
                        <p class="text-xs text-stone-400">{{ u.email }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-5 py-3 text-stone-400 text-xs hidden sm:table-cell">{{ formatDate(u.created_at) }}</td>
                  <td class="px-5 py-3 text-stone-600 text-xs hidden sm:table-cell">{{ u.total_hours ?? 0 }} ชม.</td>
                  <td class="px-5 py-3">
                    <select
                      :value="u.role"
                      class="text-xs border border-stone-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 cursor-pointer"
                      :class="roleColor[u.role]"
                      @change="changeRole(u.id, ($event.target as HTMLSelectElement).value as any)">
                      <option value="volunteer">volunteer</option>
                      <option value="organizer">organizer</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </main>
  </div>
</template>