<script setup lang="ts">
interface Activity {
  id: number
  title: string
  category: string
  location: string
  date: string
  duration_hours: number
  max_volunteers: number
  current_volunteers: number
  image_url?: string
  tags?: string[]
}

defineProps<{ activity: Activity }>()

const categoryColor: Record<string, string> = {
  'สิ่งแวดล้อม': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'สังคม':       'bg-orange-50 text-orange-700 border-orange-200',
  'การศึกษา':   'bg-blue-50 text-blue-700 border-blue-200',
  'งานบุญ':      'bg-amber-50 text-amber-700 border-amber-200',
  'สุขภาพ':      'bg-rose-50 text-rose-700 border-rose-200',
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })
}

function fillPercent(max: number, current: number) {
  if (!max) return 0
  return Math.round((current / max) * 100)
}

function slotsLeft(max: number, current: number) {
  return Math.max(0, max - current)
}
</script>

<template>
  <NuxtLink
    :to="`/activities/${activity.id}`"
    class="group bg-white rounded-2xl border border-stone-100 hover:border-stone-200 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col"
  >
    <!-- Image -->
    <div class="relative h-44 overflow-hidden bg-stone-100">
      <img
        v-if="activity.image_url"
        :src="activity.image_url"
        :alt="activity.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div v-else class="w-full h-full flex items-center justify-center text-stone-300 text-4xl">🎯</div>

      <!-- Category badge -->
      <span
        v-if="activity.category"
        class="absolute top-3 left-3 text-xs font-medium px-2.5 py-1 rounded-full border backdrop-blur-sm"
        :class="categoryColor[activity.category] ?? 'bg-stone-50 text-stone-600 border-stone-200'"
      >
        {{ activity.category }}
      </span>
      <!-- Hours badge -->
      <span v-if="activity.duration_hours" class="absolute top-3 right-3 text-xs font-medium bg-black/60 text-white px-2.5 py-1 rounded-full backdrop-blur-sm">
        ⏱ {{ activity.duration_hours }} ชม.
      </span>
    </div>

    <!-- Content -->
    <div class="flex flex-col flex-1 p-4 gap-3">
      <div class="flex-1">
        <h3 class="font-semibold text-stone-800 text-sm leading-snug group-hover:text-emerald-700 transition-colors">
          {{ activity.title }}
        </h3>
      </div>

      <!-- Meta -->
      <div class="flex items-center gap-3 text-xs text-stone-400">
        <span v-if="activity.location" class="flex items-center gap-1">
          <svg class="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/>
          </svg>
          {{ activity.location }}
        </span>
        <span v-if="activity.date" class="flex items-center gap-1">
          <svg class="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25"/>
          </svg>
          {{ formatDate(activity.date) }}
        </span>
      </div>

      <!-- Slots progress -->
      <div v-if="activity.max_volunteers" class="flex flex-col gap-1.5">
        <div class="flex justify-between text-xs">
          <span class="text-stone-400">ที่นั่งว่าง</span>
          <span class="font-medium" :class="slotsLeft(activity.max_volunteers, activity.current_volunteers) <= 5 ? 'text-red-500' : 'text-emerald-600'">
            {{ slotsLeft(activity.max_volunteers, activity.current_volunteers) }} / {{ activity.max_volunteers }}
          </span>
        </div>
        <div class="h-1.5 bg-stone-100 rounded-full overflow-hidden">
          <div
            class="h-full rounded-full transition-all"
            :class="fillPercent(activity.max_volunteers, activity.current_volunteers) >= 90 ? 'bg-red-400' : fillPercent(activity.max_volunteers, activity.current_volunteers) >= 60 ? 'bg-amber-400' : 'bg-emerald-500'"
            :style="{ width: `${fillPercent(activity.max_volunteers, activity.current_volunteers)}%` }"
          />
        </div>
      </div>

      <!-- Tags -->
      <div v-if="activity.tags?.length" class="flex flex-wrap gap-1.5">
        <span
          v-for="tag in activity.tags" :key="tag"
          class="text-xs bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full"
        >
          #{{ tag }}
        </span>
      </div>
    </div>
  </NuxtLink>
</template>