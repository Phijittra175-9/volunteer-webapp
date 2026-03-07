<script setup lang="ts">
import { ref, computed } from 'vue'
import { Earth, BookSearch, Search, FilePenLine, Star } from 'lucide-vue-next'
import { Leaf, Users, BookOpen, HeartHandshake, HeartPulse } from 'lucide-vue-next'

// ── inline mock data (ไม่ใช้ alias import ให้แน่ใจ 100%) ──────────────────

type Category = 'สิ่งแวดล้อม' | 'สังคม' | 'การศึกษา' | 'งานบุญ' | 'สุขภาพ'

interface Activity {
  id: number
  title: string
  organizer: string
  category: Category
  location: string
  date: string
  hours: number
  slots: number
  slotsLeft: number
  img: string
  tags: string[]
}

const activities: Activity[] = [
  {
    id: 1,
    title: 'ปลูกป่าชายเลน บางปู',
    organizer: 'มูลนิธิสิ่งแวดล้อมไทย',
    category: 'สิ่งแวดล้อม',
    location: 'สมุทรปราการ',
    date: '2025-04-12',
    hours: 6,
    slots: 30,
    slotsLeft: 8,
    img: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800',
    tags: ['ธรรมชาติ', 'ปลูกต้นไม้'],
  },
  {
    id: 2,
    title: 'เก็บขยะชายหาดบางแสน',
    organizer: 'กลุ่มรักษ์ทะเล',
    category: 'สิ่งแวดล้อม',
    location: 'ชลบุรี',
    date: '2025-04-20',
    hours: 4,
    slots: 50,
    slotsLeft: 22,
    img: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800',
    tags: ['ทะเล', 'ทำความสะอาด'],
  },
  {
    id: 3,
    title: 'แจกอาหารผู้สูงอายุ',
    organizer: 'วัดโพธิ์ท่าเตียน',
    category: 'สังคม',
    location: 'กรุงเทพฯ',
    date: '2025-04-15',
    hours: 3,
    slots: 20,
    slotsLeft: 5,
    img: 'https://planet-barcode.co.th/wp-content/uploads/2020/05/Screenshot_12.png?w=800',
    tags: ['อาหาร', 'ผู้สูงอายุ'],
  },
  {
    id: 4,
    title: 'สอนหนังสือเด็กชายขอบ',
    organizer: 'โรงเรียนบ้านดอยสูง',
    category: 'การศึกษา',
    location: 'เชียงราย',
    date: '2025-05-01',
    hours: 8,
    slots: 10,
    slotsLeft: 3,
    img: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800',
    tags: ['เด็ก', 'การศึกษา'],
  },
  {
    id: 5,
    title: 'ติวสอบ O-NET ฟรี',
    organizer: 'เครือข่ายครูอาสา',
    category: 'การศึกษา',
    location: 'ออนไลน์',
    date: '2025-04-28',
    hours: 5,
    slots: 100,
    slotsLeft: 67,
    img: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800',
    tags: ['ออนไลน์', 'นักเรียน'],
  },
  {
    id: 6,
    title: 'ตรวจสุขภาพฟรีชุมชน',
    organizer: 'โรงพยาบาลชุมชน',
    category: 'สุขภาพ',
    location: 'นครราชสีมา',
    date: '2025-05-10',
    hours: 6,
    slots: 40,
    slotsLeft: 18,
    img: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=800',
    tags: ['สุขภาพ', 'ชุมชน'],
  },
]

const stats = {
  totalActivities: 128,
  totalVolunteers: 4320,
  totalHours: 21500,
  totalOrganizers: 86,
}

// ── page meta ──────────────────────────────────────────────────────────────
useHead({
  title: 'VolunteerSpace — ร่วมสร้างชุมชนที่ดีกว่า',
  meta: [{ name: 'description', content: 'แพลตฟอร์มจิตอาสาที่เชื่อมต่อผู้ที่อยากช่วยเหลือสังคมกับกิจกรรมทั่วประเทศ' }],
})

// ── filter ─────────────────────────────────────────────────────────────────
const categories: { label: string; value: Category | 'ทั้งหมด'; icon: any }[] = [
  { label: 'ทั้งหมด', value: 'ทั้งหมด', icon: BookSearch },
  { label: 'สิ่งแวดล้อม', value: 'สิ่งแวดล้อม', icon: Leaf },
  { label: 'สังคม', value: 'สังคม', icon: Users },
  { label: 'การศึกษา', value: 'การศึกษา', icon: BookOpen },
  { label: 'งานบุญ', value: 'งานบุญ', icon: HeartHandshake },
  { label: 'สุขภาพ', value: 'สุขภาพ', icon: HeartPulse },
]

const selectedCategory = ref<Category | 'ทั้งหมด'>('ทั้งหมด')
const searchQuery = ref('')

const filtered = computed(() =>
  activities.filter((a) => {
    const matchCat = selectedCategory.value === 'ทั้งหมด' || a.category === selectedCategory.value
    const matchSearch =
      a.title.includes(searchQuery.value) || a.location.includes(searchQuery.value)
    return matchCat && matchSearch
  })
)

const statItems = [
  { label: 'กิจกรรมทั้งหมด',   value: stats.totalActivities.toLocaleString(),  suffix: 'กิจกรรม' },
  { label: 'จิตอาสาทั่วประเทศ', value: stats.totalVolunteers.toLocaleString(),  suffix: 'คน' },
  { label: 'ชั่วโมงจิตอาสา',    value: stats.totalHours.toLocaleString(),       suffix: 'ชั่วโมง' },
  { label: 'องค์กรที่ร่วม',     value: stats.totalOrganizers.toLocaleString(),  suffix: 'องค์กร' },
]
</script>

<template>
  <div class="min-h-screen bg-stone-50 font-sans">
    <AppHeader />

    <main class="pt-16">

      <!-- ─── HERO ──────────────────────────────────── -->
      <section class="relative overflow-hidden bg-white">
        <div class="absolute inset-0 bg-[linear-gradient(to_right,#e7e5e410_1px,transparent_1px),linear-gradient(to_bottom,#e7e5e410_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div class="absolute -top-32 -right-32 w-96 h-96 bg-emerald-100 rounded-full blur-3xl opacity-60" />
        <div class="absolute -bottom-20 -left-20 w-72 h-72 bg-amber-100 rounded-full blur-3xl opacity-50" />

        <div class="relative max-w-6xl mx-auto px-6 py-24 md:py-32 flex flex-col items-center text-center gap-6">
          <span class="inline-flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
            <Earth class="w-4 h-4 text-emerald-600" />
            เปิดรับสมัครจิตอาสาทั่วประเทศ
          </span>

          <h1 class="text-4xl md:text-6xl font-bold text-stone-900 leading-tight tracking-tight max-w-3xl">
            ร่วมสร้าง<br/>
            <span class="text-emerald-600">ชุมชนที่ดีกว่า</span>
          </h1>

          <p class="text-stone-500 text-lg max-w-xl leading-relaxed">
            ทำจิตอาสากับกิจกรรมที่ใช่ สะสมชั่วโมง และสร้างความเปลี่ยนแปลงให้สังคมไทย
          </p>

        </div>
      </section>

      <!-- ─── STATS ──────────────────────────────────── -->
      <section class="bg-stone-900 text-white">
        <div class="max-w-6xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div v-for="item in statItems" :key="item.label" class="flex flex-col items-center text-center gap-1">
            <span class="text-3xl font-bold text-emerald-400">{{ item.value }}</span>
            <span class="text-xs text-stone-400">{{ item.suffix }}</span>
            <span class="text-xs text-stone-500 mt-0.5">{{ item.label }}</span>
          </div>
        </div>
      </section>

      <!-- ─── ACTIVITIES ──────────────────────────────── -->
      <section class="max-w-6xl mx-auto px-6 py-16">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <p class="text-xs text-emerald-600 font-medium uppercase tracking-widest mb-1">กิจกรรมล่าสุด</p>
            <h2 class="text-2xl md:text-3xl font-bold text-stone-900">เลือกกิจกรรมที่ใช่สำหรับคุณ</h2>
          </div>
          <NuxtLink to="/activities" class="text-sm text-stone-400 hover:text-emerald-600 transition-colors shrink-0">
            ดูทั้งหมด →
          </NuxtLink>
        </div>

        <!-- Search + filter -->
        <div class="flex flex-col md:flex-row gap-3 mb-8">
          <div class="relative flex-1">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 0z"/>
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="ค้นหากิจกรรม หรือสถานที่..."
              class="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition"
            />
          </div>
          <div class="flex gap-2 flex-wrap">
            <button
              v-for="cat in categories"
              :key="cat.value"
              class="text-xs px-3 py-2 rounded-xl border transition-all"
              :class="selectedCategory === cat.value
                ? 'bg-stone-900 text-white border-stone-900'
                : 'bg-white text-stone-500 border-stone-200 hover:border-stone-300'"
              @click="selectedCategory = cat.value" 
            >
              <span class="flex items-center gap-1">
               <component
                v-if="cat.icon"
                :is="cat.icon"
                class="w-3 h-3"
                :class="selectedCategory === cat.value ? 'text-white-100' : 'text-emerald-400'"
              />

                {{ cat.label }}
              </span>
            </button>
          </div>
        </div>

        <!-- Grid -->
        <div v-if="filtered.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ActivityCard v-for="activity in filtered" :key="activity.id" :activity="activity" />
        </div>

        <!-- Empty state -->
        <div v-else class="py-24 flex flex-col items-center gap-3 text-stone-400">
          <svg class="w-12 h-12 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm5.25 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <p class="text-sm">ไม่พบกิจกรรมที่ตรงกัน</p>
          <button
            class="text-xs text-emerald-600 hover:underline"
            @click="selectedCategory = 'ทั้งหมด'; searchQuery = ''"
          >
            ล้างตัวกรอง
          </button>
        </div>
      </section>

      <!-- ─── HOW IT WORKS ──────────────────────────── -->
      <section class="bg-white border-t border-stone-100">
          <div class="text-center mb-12 mt-10">
            <p class="text-xs text-emerald-600 font-medium uppercase tracking-widest mb-2">เริ่มต้นง่ายๆ</p>
            <h2 class="text-2xl md:text-3xl font-bold text-stone-900">วิธีการใช้งาน</h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div
              v-for="(step, i) in [
                { icon: Search, title: 'ค้นหากิจกรรม', desc: 'เลือกกิจกรรมที่สนใจจากหลากหลายประเภท ทั่วทุกจังหวัดในไทย' },
                { icon: FilePenLine, title: 'สมัครเป็นจิตอาสา', desc: 'ลงทะเบียนและสมัครเข้าร่วมกิจกรรมได้ทันที ไม่มีขั้นตอนซับซ้อน' },
                { icon: Star, title: 'สะสมชั่วโมง', desc: 'ทำกิจกรรมและรับการยืนยันชั่วโมงจิตอาสาเพื่อสร้างประวัติของคุณ' }
              ]"
              :key="i"
              class="flex flex-col items-center text-center gap-3 p-6 rounded-2xl hover:bg-stone-50 transition-colors"
            >

              <component :is="step.icon" class="w-8 h-8 text-emerald-600" />

              <div class="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center">
                {{ i + 1 }}
              </div>

              <h3 class="font-semibold text-stone-800">{{ step.title }}</h3>

              <p class="text-sm text-stone-500 leading-relaxed">
                {{ step.desc }}
              </p>
          </div>
        </div>
      </section>

      <!-- ─── CTA BANNER ──────────────────────────────── -->
      <section class="max-w-6xl mx-auto px-6 py-16">
        <div class="bg-emerald-600 rounded-3xl p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div class="absolute -right-12 -top-12 w-48 h-48 bg-emerald-500 rounded-full opacity-40" />
          <div class="absolute -left-8 -bottom-8 w-32 h-32 bg-emerald-700 rounded-full opacity-30" />
          <div class="relative z-10">
            <h2 class="text-2xl md:text-3xl font-bold text-white mb-2">มีกิจกรรมที่อยากสร้าง?</h2>
            <p class="text-emerald-100 text-sm">ลงทะเบียนเป็นผู้จัดกิจกรรมและค้นหาจิตอาสาที่ใช่ให้กับโครงการของคุณ</p>
          </div>
          <NuxtLink
            to="/create-activity"
            class="relative z-10 shrink-0 bg-white hover:bg-stone-50 text-emerald-700 font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
          >
            สร้างกิจกรรมเลย →
          </NuxtLink>
        </div>
      </section>

      <!-- ─── FOOTER ──────────────────────────────────── -->
      <footer class="border-t border-stone-100 bg-white">
        <div class="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <span>© 2025 VolunteerSpace · ทุกสิทธิ์สงวนไว้</span>
          <div class="flex gap-6">
            <a href="#" class="hover:text-stone-600 transition-colors">นโยบายความเป็นส่วนตัว</a>
            <a href="#" class="hover:text-stone-600 transition-colors">ติดต่อเรา</a>
          </div>
        </div>
      </footer>

    </main>
  </div>
</template>