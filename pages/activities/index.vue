<script setup lang="ts">
import { ref, computed } from 'vue'
useHead({ title: 'กิจกรรมทั้งหมด — VolunteerSpace' })
import { BookSearch, Leaf, Users, BookOpen, HeartHandshake, HeartPulse } from 'lucide-vue-next'


type Category = 'สิ่งแวดล้อม' | 'สังคม' | 'การศึกษา' | 'งานบุญ' | 'สุขภาพ'
type Status = 'เปิดรับสมัคร' | 'เต็ม' | 'เสร็จสิ้น'
type SortOption = 'newest' | 'soonest' | 'hours' | 'slots'

interface Activity {
  id: number
  title: string
  organizer: string
  category: Category
  location: string
  date: string
  time: string
  hours: number
  slots: number
  slotsLeft: number
  img: string
  tags: string[]
  status: Status
}

import db from '~/utils/supabase'

const allActivities = ref<any[]>([])

onMounted(async () => {
  const data = await db.getActivities({ status: 'approved' })
  allActivities.value = Array.isArray(data) ? data : []
})

const search = ref('')
const selectedCategory = ref<Category | 'ทั้งหมด'>('ทั้งหมด')
const selectedStatus = ref<Status | 'ทั้งหมด'>('ทั้งหมด')
const selectedLocation = ref('ทั้งหมด')
const sortBy = ref<SortOption>('newest')
const viewMode = ref<'grid' | 'list'>('grid')

const categories: { label: string; value: Category | 'ทั้งหมด'; icon: any }[] = [
  { label: 'ทั้งหมด', value: 'ทั้งหมด', icon: BookSearch },
  { label: 'สิ่งแวดล้อม', value: 'สิ่งแวดล้อม', icon: Leaf },
  { label: 'สังคม', value: 'สังคม', icon: Users },
  { label: 'การศึกษา', value: 'การศึกษา', icon: BookOpen },
  { label: 'งานบุญ', value: 'งานบุญ', icon: HeartHandshake },
  { label: 'สุขภาพ', value: 'สุขภาพ', icon: HeartPulse },
]

const locations = computed(() => {
  const locs = [...new Set(allActivities.value.map(a => a.location))]
  return ['ทั้งหมด', ...locs.sort()]
})

const filtered = computed(() => {
  let result = [...allActivities.value]
  if (selectedCategory.value !== 'ทั้งหมด') result = result.filter(a => a.category === selectedCategory.value)
  if (selectedStatus.value !== 'ทั้งหมด') result = result.filter(a => a.status === selectedStatus.value)
  if (selectedLocation.value !== 'ทั้งหมด') result = result.filter(a => a.location === selectedLocation.value)
  if (search.value.trim()) result = result.filter(a =>
    a.title.includes(search.value) || a.organizer.includes(search.value) ||
    a.location.includes(search.value) || a.tags.some((t: string) => t.includes(search.value))
  )
  if (sortBy.value === 'soonest') result.sort((a,b) => a.date.localeCompare(b.date))
  else if (sortBy.value === 'hours') result.sort((a,b) => b.duration_hours - a.duration_hours)
  else if (sortBy.value === 'slots') result.sort((a,b) => b.max_volunteers - a.max_volunteers)
  else result.sort((a,b) => b.date.localeCompare(a.date))
  return result
})

function clearFilters() {
  search.value = ''
  selectedCategory.value = 'ทั้งหมด'
  selectedStatus.value = 'ทั้งหมด'
  selectedLocation.value = 'ทั้งหมด'
  sortBy.value = 'newest'
}

const hasActiveFilter = computed(() =>
  search.value || selectedCategory.value !== 'ทั้งหมด' ||
  selectedStatus.value !== 'ทั้งหมด' || selectedLocation.value !== 'ทั้งหมด'
)

const categoryColor: Record<string, string> = {
  'สิ่งแวดล้อม': 'bg-emerald-50 text-emerald-700',
  'สังคม':       'bg-orange-50 text-orange-700',
  'การศึกษา':   'bg-blue-50 text-blue-700',
  'งานบุญ':      'bg-amber-50 text-amber-700',
  'สุขภาพ':      'bg-rose-50 text-rose-700',
}

const statusStyle: Record<string, string> = {
  'เปิดรับสมัคร': 'bg-emerald-100 text-emerald-700',
  'เต็ม':         'bg-red-100 text-red-600',
  'เสร็จสิ้น':    'bg-stone-100 text-stone-500',
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('th-TH', { day:'numeric', month:'short', year:'numeric' })
}

function fillPercent(a: any) {
  if (!a.max_volunteers) return 0
  return Math.round((a.current_volunteers / a.max_volunteers) * 100)
}

function fillColor(a: any) {
  const p = fillPercent(a)
  if (p >= 90) return 'bg-red-400'
  if (p >= 60) return 'bg-amber-400'
  return 'bg-emerald-500'
}
</script>

<template>
  <div class="min-h-screen bg-stone-50">
    <AppHeader />
    <main class="pt-16">

      <!-- Hero -->
      <section class="bg-white border-b border-stone-100">
        <div class="max-w-6xl mx-auto px-6 py-10">
          <p class="text-xs text-emerald-600 font-medium uppercase tracking-widest mb-2">จิตอาสาทั่วประเทศ</p>
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 class="text-3xl font-bold text-stone-900">กิจกรรมทั้งหมด</h1>
            <div class="flex items-center gap-1 bg-stone-100 rounded-xl p-1 self-start sm:self-auto">
              <button class="p-2 rounded-lg transition-all"
                :class="viewMode==='grid' ? 'bg-white shadow-sm text-stone-700' : 'text-stone-400 hover:text-stone-600'"
                @click="viewMode='grid'">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"/>
                </svg>
              </button>
              <button class="p-2 rounded-lg transition-all"
                :class="viewMode==='list' ? 'bg-white shadow-sm text-stone-700' : 'text-stone-400 hover:text-stone-600'"
                @click="viewMode='list'">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      <div class="max-w-6xl mx-auto px-6 py-8">
        <div class="flex flex-col lg:flex-row gap-8">

          <!-- Sidebar -->
          <aside class="lg:w-56 shrink-0 flex flex-col gap-4">
            <!-- Search -->
            <div class="relative">
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 0z"/>
              </svg>
              <input v-model="search" type="text" placeholder="ค้นหากิจกรรม..."
                class="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition"/>
            </div>

           <!-- Category -->
          <div class="bg-white rounded-2xl border border-stone-100 p-4">
            <p class="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">
              หมวดหมู่
            </p>

            <div class="flex flex-col gap-1">
              <button
                v-for="cat in categories"
                :key="cat.value"
                class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all text-left"
                :class="
                  selectedCategory === cat.value
                    ? 'bg-emerald-50 text-emerald-700 font-medium'
                    : 'text-stone-500 hover:bg-stone-50'
                "
                @click="selectedCategory = cat.value"
              >
                <!-- icon -->
                <component :is="cat.icon" class="w-4 h-4 shrink-0" />

                <!-- label -->
                {{ cat.label }}

                <!-- count -->
                <span class="ml-auto text-xs text-stone-400">
                  {{
                    cat.value === 'ทั้งหมด'
                      ? allActivities.length
                      : allActivities.filter(a => a.category === cat.value).length
                  }}
                </span>
              </button>
            </div>
          </div>

            <!-- Status -->
            <div class="bg-white rounded-2xl border border-stone-100 p-4">
              <p class="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">สถานะ</p>
              <div class="flex flex-col gap-1">
                <button v-for="s in ['ทั้งหมด','เปิดรับสมัคร','เต็ม','เสร็จสิ้น']" :key="s"
                  class="flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all text-left"
                  :class="selectedStatus===s ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-stone-500 hover:bg-stone-50'"
                  @click="selectedStatus=(s as any)">
                  <span class="w-1.5 h-1.5 rounded-full shrink-0"
                    :class="s==='เปิดรับสมัคร' ? 'bg-emerald-400' : s==='เต็ม' ? 'bg-red-400' : s==='เสร็จสิ้น' ? 'bg-stone-300' : 'bg-stone-200'"/>
                  {{ s }}
                </button>
              </div>
            </div>

            <!-- Location -->
            <div class="bg-white rounded-2xl border border-stone-100 p-4">
              <p class="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">สถานที่</p>
              <select v-model="selectedLocation"
                class="w-full text-sm border border-stone-200 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400">
                <option v-for="loc in locations" :key="loc" :value="loc">{{ loc }}</option>
              </select>
            </div>

            <!-- Sort -->
            <div class="bg-white rounded-2xl border border-stone-100 p-4">
              <p class="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">เรียงตาม</p>
              <div class="flex flex-col gap-1">
                <button v-for="opt in [{value:'newest',label:'ล่าสุด'},{value:'soonest',label:'ใกล้จะมาถึง'},{value:'hours',label:'ชั่วโมงมากสุด'},{value:'slots',label:'ที่นั่งว่างมาก'}]"
                  :key="opt.value"
                  class="flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all text-left"
                  :class="sortBy===opt.value ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-stone-500 hover:bg-stone-50'"
                  @click="sortBy=(opt.value as SortOption)">
                  <span class="w-1.5 h-1.5 rounded-full shrink-0" :class="sortBy===opt.value ? 'bg-emerald-500' : 'bg-stone-200'"/>
                  {{ opt.label }}
                </button>
              </div>
            </div>

            <button v-if="hasActiveFilter"
              class="text-sm text-red-400 hover:text-red-600 border border-red-100 hover:border-red-200 bg-white rounded-xl py-2.5 transition-colors"
              @click="clearFilters">
              ล้างตัวกรองทั้งหมด
            </button>
          </aside>

          <!-- Content -->
          <div class="flex-1 min-w-0">

            <!-- Active filter chips -->
            <div v-if="hasActiveFilter" class="flex flex-wrap gap-2 mb-5">
              <span v-if="selectedCategory!=='ทั้งหมด'" class="inline-flex items-center gap-1.5 text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-full">
                {{ selectedCategory }}<button class="hover:text-red-500" @click="selectedCategory='ทั้งหมด'">×</button>
              </span>
              <span v-if="selectedStatus!=='ทั้งหมด'" class="inline-flex items-center gap-1.5 text-xs bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-full">
                {{ selectedStatus }}<button class="hover:text-red-500" @click="selectedStatus='ทั้งหมด'">×</button>
              </span>
              <span v-if="selectedLocation!=='ทั้งหมด'" class="inline-flex items-center gap-1.5 text-xs bg-stone-100 text-stone-600 border border-stone-200 px-3 py-1.5 rounded-full">
                📍 {{ selectedLocation }}<button class="hover:text-red-500" @click="selectedLocation='ทั้งหมด'">×</button>
              </span>
              <span v-if="search" class="inline-flex items-center gap-1.5 text-xs bg-stone-100 text-stone-600 border border-stone-200 px-3 py-1.5 rounded-full">
                🔍 "{{ search }}"<button class="hover:text-red-500" @click="search=''">×</button>
              </span>
            </div>

            <!-- Result count -->
            <p class="text-xs text-stone-400 mb-4">พบ {{ filtered.length }} กิจกรรม</p>

            <!-- Grid view -->
            <div v-if="viewMode==='grid' && filtered.length>0" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              <NuxtLink v-for="a in filtered" :key="a.id" :to="`/activities/${a.id}`"
                class="group bg-white rounded-2xl border border-stone-100 hover:border-stone-200 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">

                <!-- Image -->
                <div class="relative h-44 overflow-hidden">
                  <img :src="a.image_url" :alt="a.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                  <!-- Status badge -->
                  <span class="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full" :class="statusStyle[a.status]">
                    {{ a.current_volunteers >= a.max_volunteers ? 'เต็มแล้ว' : 'เปิดรับสมัคร' }}
                  </span>
                  <span class="absolute top-3 right-3 text-xs font-medium bg-black/60 text-white px-2.5 py-1 rounded-full backdrop-blur-sm">
                    ⏱ {{ a.duration_hours }} ชม.
                  </span>
                </div>

                <!-- Body -->
                <div class="flex flex-col flex-1 p-4 gap-3">
                  <!-- Category + title -->
                  <div>
                    <span class="text-xs font-medium px-2 py-0.5 rounded-full" :class="categoryColor[a.category]">{{ a.category }}</span>
                    <h3 class="font-semibold text-stone-800 text-sm leading-snug mt-1.5 group-hover:text-emerald-700 transition-colors line-clamp-2">{{ a.title }}</h3>
                    <p class="text-xs text-stone-400 mt-0.5">{{ a.organizer }}</p>
                  </div>

                  <!-- Meta -->
                  <div class="flex flex-col gap-1.5 text-xs text-stone-400">
                    <span class="flex items-center gap-1.5">
                      <svg class="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>
                      {{ a.location }}
                    </span>
                    <span class="flex items-center gap-1.5">
                      <svg class="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25"/></svg>
                      {{ formatDate(a.date) }} · {{ a.start_time }} น.
                    </span>
                  </div>

                  <!-- Progress -->
                  <div v-if="a.status !== 'เสร็จสิ้น'">
                    <div class="flex justify-between text-xs mb-1">
                      <span class="text-stone-400">ที่นั่งว่าง</span>
                      <span class="font-medium" :class="a.max_volunteers - a.current_volunteers === 0 ? 'text-red-500' : a.max_volunteers - a.current_volunteers <= 5 ? 'text-amber-500' : 'text-emerald-600'">
                        {{ a.max_volunteers - a.current_volunteers }} / {{ a.max_volunteers }}
                      </span>
                    </div>
                    <div class="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                      <div class="h-full rounded-full transition-all" :class="fillColor(a)" :style="{width:`${fillPercent(a)}%`}"/>
                    </div>
                  </div>

                  <!-- Tags -->
                  <div class="flex flex-wrap gap-1">
                    <span v-for="tag in a.tags" :key="tag" class="text-xs bg-stone-100 text-stone-400 px-2 py-0.5 rounded-full">#{{ tag }}</span>
                  </div>

                  <!-- CTA -->
                  <div class="mt-auto pt-1">
                    <span class="block w-full text-center text-xs font-semibold py-2 rounded-xl transition-colors"
                      :class="a.status==='เปิดรับสมัคร' ? 'bg-emerald-600 group-hover:bg-emerald-700 text-white' : a.status==='เต็ม' ? 'bg-red-50 text-red-400' : 'bg-stone-100 text-stone-400'">
                      {{ a.status==='เปิดรับสมัคร' ? 'ดูรายละเอียด →' : a.status==='เต็ม' ? 'เต็มแล้ว' : 'เสร็จสิ้นแล้ว' }}
                    </span>
                  </div>
                </div>
              </NuxtLink>
            </div>

            <!-- List view -->
            <div v-else-if="viewMode==='list' && filtered.length>0" class="flex flex-col gap-3">
              <NuxtLink v-for="a in filtered" :key="a.id" :to="`/activities/${a.id}`"
                class="bg-white rounded-2xl border border-stone-100 hover:border-stone-200 hover:shadow-md transition-all flex gap-4 p-4 group">
                <div class="w-28 h-28 rounded-xl overflow-hidden shrink-0">
                  <img :src="a.image_url" :alt="a.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                </div>
                <div class="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                  <div>
                    <div class="flex items-center gap-2 flex-wrap mb-1">
                      <span class="text-xs font-medium px-2 py-0.5 rounded-full" :class="categoryColor[a.category]">{{ a.category }}</span>
                      <span class="text-xs font-semibold px-2 py-0.5 rounded-full" :class="statusStyle[a.status]">{{ a.status }}</span>
                    </div>
                    <h3 class="font-semibold text-stone-800 text-sm leading-snug mb-0.5 group-hover:text-emerald-700 transition-colors">{{ a.title }}</h3>
                    <p class="text-xs text-stone-400">{{ a.organizer }}</p>
                  </div>
                  <div class="flex items-center gap-3 text-xs text-stone-400 mt-2">
                    <span class="flex items-center gap-1">
                      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>
                      {{ a.location }}
                    </span>
                    <span class="flex items-center gap-1">
                      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25"/></svg>
                      {{ formatDate(a.date) }} · {{ a.start_time }} น.
                    </span>
                    <span>⏱ {{ a.duration_hours }} ชม.</span>
                  </div>
                </div>
                <div class="hidden sm:flex flex-col items-end justify-center gap-1 shrink-0">
                  <p class="text-xs text-stone-400">ที่นั่งว่าง</p>
                  <p class="text-lg font-bold" :class="a.current_volunteers === a.max_volunteers ? 'text-red-500' : 'text-emerald-600'">{{ a.max_volunteers - a.current_volunteers }}</p>
                  <p class="text-xs text-stone-400">/ {{ a.max_volunteers }}</p>
                </div>
              </NuxtLink>
            </div>

            <!-- Empty -->
            <div v-if="filtered.length===0" class="py-32 flex flex-col items-center gap-3 text-stone-400">
              <div class="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center text-2xl mb-2">🔍</div>
              <p class="font-medium text-stone-600">ไม่พบกิจกรรมที่ตรงกัน</p>
              <p class="text-sm">ลองเปลี่ยนคำค้นหาหรือตัวกรอง</p>
              <button class="mt-2 text-sm text-emerald-600 hover:underline font-medium" @click="clearFilters">ล้างตัวกรองทั้งหมด</button>
            </div>

          </div>
        </div>
      </div>
    </main>
  </div>
</template>