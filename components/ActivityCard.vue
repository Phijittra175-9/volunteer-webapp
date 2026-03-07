<script setup lang="ts">
interface Activity {
  id: number
  title: string
  organizer: string
  category: string
  location: string
  date: string
  hours: number
  slots: number
  slotsLeft: number
  img: string
  tags: string[]
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

function fillPercent(slots: number, slotsLeft: number) {
  return Math.round(((slots - slotsLeft) / slots) * 100)
}
</script>

<template>
  <NuxtLink
    :to="`/activities/${activity.id}`"
    class="group bg-white rounded-2xl border border-stone-100 hover:border-stone-200 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col"
  >
    <!-- Image -->
    <div class="relative h-44 overflow-hidden">
      <img
        :src="activity.img"
        :alt="activity.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <!-- Category badge -->
      <span
        class="absolute top-3 left-3 text-xs font-medium px-2.5 py-1 rounded-full border backdrop-blur-sm"
        :class="categoryColor[activity.category]"
      >
        {{ activity.category }}
      </span>
      <!-- Hours badge -->
      <span class="absolute top-3 right-3 text-xs font-medium bg-black/60 text-white px-2.5 py-1 rounded-full backdrop-blur-sm">
        ⏱ {{ activity.hours }} ชม.
      </span>
    </div>

    <!-- Content -->
    <div class="flex flex-col flex-1 p-4 gap-3">
      <div class="flex-1">
        <h3 class="font-semibold text-stone-800 text-sm leading-snug mb-1 group-hover:text-emerald-700 transition-colors">
          {{ activity.title }}
        </h3>
        <p class="text-xs text-stone-400">{{ activity.organizer }}</p>
      </div>

      <!-- Meta -->
      <div class="flex items-center gap-3 text-xs text-stone-400">
        <span class="flex items-center gap-1">
          <svg class="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/>
          </svg>
          {{ activity.location }}
        </span>
        <span class="flex items-center gap-1">
          <svg class="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25"/>
          </svg>
          {{ formatDate(activity.date) }}
        </span>
      </div>

      <!-- Slots progress -->
      <div class="flex flex-col gap-1.5">
        <div class="flex justify-between text-xs">
          <span class="text-stone-400">ที่นั่งว่าง</span>
          <span class="font-medium" :class="activity.slotsLeft <= 5 ? 'text-red-500' : 'text-emerald-600'">
            {{ activity.slotsLeft }} / {{ activity.slots }}
          </span>
        </div>
        <div class="h-1.5 bg-stone-100 rounded-full overflow-hidden">
          <div
            class="h-full rounded-full transition-all"
            :class="fillPercent(activity.slots, activity.slotsLeft) >= 90 ? 'bg-red-400' : fillPercent(activity.slots, activity.slotsLeft) >= 60 ? 'bg-amber-400' : 'bg-emerald-500'"
            :style="{ width: `${fillPercent(activity.slots, activity.slotsLeft)}%` }"
          />
        </div>
      </div>

      <!-- Tags -->
      <div class="flex flex-wrap gap-1.5">
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