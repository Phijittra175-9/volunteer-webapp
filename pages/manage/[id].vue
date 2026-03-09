<script setup lang="ts">
import db from '~/utils/supabase'

const route = useRoute()
const activityId = Number(route.params.id)

const { user: authUser, fetchUser } = useUser()
const activity = ref<any>(null)
const registrations = ref<any[]>([])
const loading = ref(true)

onMounted(async () => {
  await fetchUser()
  const [act, regs] = await Promise.all([
    db.getActivityById(activityId),
    db.getAllRegistrations(activityId).catch(() => []),
  ])
  activity.value = act
  registrations.value = Array.isArray(regs) ? regs : []
  loading.value = false
})

async function approve(regId: string) {
  await db.approveRegistration(regId, authUser.value?.id ?? '')
  registrations.value = registrations.value.map(r =>
    r.id === regId ? { ...r, status: 'approved' } : r
  )
}

async function reject(regId: string) {
  await db.rejectRegistration(regId)
  registrations.value = registrations.value.map(r =>
    r.id === regId ? { ...r, status: 'rejected' } : r
  )
}

async function complete(regId: string) {
  const hours = activity.value?.duration_hours ?? 1
  await db.completeRegistration(regId, hours)
  registrations.value = registrations.value.map(r =>
    r.id === regId ? { ...r, status: 'completed', hours_earned: hours } : r
  )
}

const statusColor: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-600',
  approved: 'bg-blue-50 text-blue-600',
  rejected: 'bg-red-50 text-red-500',
  completed: 'bg-emerald-50 text-emerald-600',
}

const statusLabel: Record<string, string> = {
  pending: 'รอการอนุมัติ',
  approved: 'อนุมัติแล้ว',
  rejected: 'ปฏิเสธ',
  completed: 'เสร็จสิ้น',
}
</script>

<template>
  <div class="min-h-screen bg-stone-50">
    <AppHeader />
    <main class="pt-24 pb-16 max-w-4xl mx-auto px-6">

      <div v-if="loading" class="flex justify-center py-20">
        <svg class="w-8 h-8 animate-spin text-emerald-500" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
      </div>

      <template v-else>
        <div class="mb-6">
          <NuxtLink to="/profile" class="text-xs text-stone-400 hover:text-emerald-600">← กลับหน้าโปรไฟล์</NuxtLink>
          <h1 class="text-xl font-bold text-stone-900 mt-2">{{ activity?.title }}</h1>
          <p class="text-sm text-stone-400 mt-1">ผู้สมัครทั้งหมด {{ registrations.length }} คน</p>
        </div>

        <div class="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
          <div v-if="registrations.length === 0" class="py-16 flex flex-col items-center gap-2 text-stone-400">
            <span class="text-3xl">📭</span>
            <p class="text-sm">ยังไม่มีผู้สมัคร</p>
          </div>

          <div v-else class="divide-y divide-stone-50">
            <div v-for="reg in registrations" :key="reg.id" class="px-6 py-4 flex items-center gap-4">
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-stone-800">{{ reg.first_name }} {{ reg.last_name }}</p>
                <p class="text-xs text-stone-400">{{ reg.email }} · {{ reg.phone }}</p>
                <span class="inline-block mt-1 text-xs px-2 py-0.5 rounded-full" :class="statusColor[reg.status]">
                  {{ statusLabel[reg.status] }}
                </span>
              </div>
              <div class="flex gap-2 shrink-0">
                <button v-if="reg.status === 'pending'"
                  class="text-xs px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg"
                  @click="approve(reg.id)">อนุมัติ</button>
                <button v-if="reg.status === 'pending'"
                  class="text-xs px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg"
                  @click="reject(reg.id)">ปฏิเสธ</button>
                <button v-if="reg.status === 'approved'"
                  class="text-xs px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg"
                  @click="complete(reg.id)">บันทึกชั่วโมง</button>
              </div>
            </div>
          </div>
        </div>
      </template>
    </main>
  </div>
</template>