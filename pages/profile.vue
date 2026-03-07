<script setup lang="ts">
import { useUser } from '~/components/useUser'
import { ref, computed } from 'vue'
useHead({ title: 'โปรไฟล์ — VolunteerSpace' })
import { UserRoundPen, Timer } from 'lucide-vue-next'
const { user, update } = useUser()

// Fallback avatar (dicebear) ถ้าไม่ได้อัปโหลดรูป
const avatarSrc = computed(() =>
  user.value.avatar
    ? user.value.avatar
    : `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(user.value.name || 'user')}&backgroundColor=d1fae5`
)

// ── Mock history ───────────────────────────────────────────────────────────
const history = ref([
  { id: 1, title: 'ปลูกป่าชายเลน บางปู', category: 'สิ่งแวดล้อม', date: '2025-03-15', hours: 6, status: 'completed' as const, img: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=200' },
  { id: 2, title: 'สอนหนังสือเด็กชายขอบ', category: 'การศึกษา', date: '2025-02-28', hours: 8, status: 'completed' as const, img: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=200' },
  { id: 3, title: 'เก็บขยะชายหาดบางแสน', category: 'สิ่งแวดล้อม', date: '2025-02-10', hours: 4, status: 'completed' as const, img: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=200' },
  { id: 4, title: 'ติวสอบ O-NET ฟรี', category: 'การศึกษา', date: '2025-04-28', hours: 5, status: 'upcoming' as const, img: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=200' },
  { id: 5, title: 'แจกอาหารผู้สูงอายุ', category: 'สังคม', date: '2025-01-20', hours: 3, status: 'completed' as const, img: 'https://images.unsplash.com/photo-1604881987921-df8d75ab4b8f?w=200' },
  { id: 6, title: 'ตรวจสุขภาพฟรีชุมชน', category: 'สุขภาพ', date: '2025-05-10', hours: 6, status: 'upcoming' as const, img: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=200' },
  { id: 7, title: 'ช่วยงานวัดมหาธาตุ', category: 'งานบุญ', date: '2024-12-08', hours: 6, status: 'completed' as const, img: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=200' },
])

const activeTab = ref<'all' | 'completed' | 'upcoming'>('all')
const filteredHistory = computed(() =>
  activeTab.value === 'all' ? history.value : history.value.filter(h => h.status === activeTab.value)
)

const categoryColor: Record<string, string> = {
  'สิ่งแวดล้อม': 'bg-emerald-50 text-emerald-700',
  'สังคม': 'bg-orange-50 text-orange-700',
  'การศึกษา': 'bg-blue-50 text-blue-700',
  'งานบุญ': 'bg-amber-50 text-amber-700',
  'สุขภาพ': 'bg-rose-50 text-rose-700',
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })
}

// ── Edit state ─────────────────────────────────────────────────────────────
const editMode = ref(false)
const draft = ref({ ...user.value })
const newSkill = ref('')
const newInterest = ref('')

function openEdit() {
  draft.value = {
    ...user.value,
    skills: [...(user.value.skills ?? [])],
    interests: [...(user.value.interests ?? [])],
  }
  editMode.value = true
}
function saveEdit() {
  update({ ...draft.value })
  editMode.value = false
}
function addSkill() {
  if (newSkill.value.trim()) { draft.value.skills.push(newSkill.value.trim()); newSkill.value = '' }
}
function removeSkill(i: number) { draft.value.skills.splice(i, 1) }
function addInterest() {
  if (newInterest.value.trim()) { draft.value.interests.push(newInterest.value.trim()); newInterest.value = '' }
}
function removeInterest(i: number) { draft.value.interests.splice(i, 1) }
</script>

<template>
  <div class="min-h-screen bg-stone-50">
    <AppHeader />

    <main class="pt-20 pb-16">
      <div class="max-w-5xl mx-auto px-6">

        <!-- ── Cover + Avatar ──────────────────────────── -->
        <div class="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden mb-6">
          <div class="h-40 bg-[radial-gradient(ellipse_at_right,#34d399,#0d9488)]"></div>

          <div class="px-8 pb-6">
            <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-16 mb-5">
              <img :src="avatarSrc" :alt="user.name"
                class="w-32 h-32 rounded-2xl border-4 border-white shadow-sm bg-emerald-50 object-cover"/>
              <div class="flex gap-2 sm:mb-1">
                <button v-if="!editMode"
                  class="flex items-center gap-1.5 text-xs text-stone-500 hover:text-emerald-600 border border-stone-200 hover:border-emerald-300 px-3 py-2 rounded-xl transition-colors bg-white"
                  @click="openEdit">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"/>
                  </svg>
                  แก้ไขโปรไฟล์
                </button>
                <template v-else>
                  <button class="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl transition-colors" @click="saveEdit">บันทึก</button>
                  <button class="text-xs text-stone-500 border border-stone-200 px-4 py-2 rounded-xl hover:bg-stone-50 transition-colors" @click="editMode = false">ยกเลิก</button>
                </template>
              </div>
            </div>

            <!-- View mode -->
            <div v-if="!editMode">
              <div class="flex items-center gap-2 flex-wrap mb-1">
                <h1 class="text-xl font-bold text-stone-900">{{ user.name || '(ยังไม่ได้ตั้งชื่อ)' }}</h1>
                <span class="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                  <UserRoundPen class="w-3.5 h-3.5" />
                  จิตอาสา
                </span>
              </div>
              <p class="text-sm text-stone-400 mb-3">สมาชิกตั้งแต่ {{ formatDate(user.joinedDate) }}</p>
              <p class="text-sm text-stone-600 leading-relaxed mb-4">{{ user.bio || 'ยังไม่มีคำแนะนำตัว' }}</p>
              <div class="flex flex-wrap gap-2">
                <span v-for="b in user.badges" :key="b" class="text-xs bg-stone-50 border border-stone-100 text-stone-600 px-3 py-1 rounded-full">{{ b }}</span>
              </div>
            </div>

            <!-- Edit mode -->
            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-medium text-stone-500">ชื่อ-นามสกุล</label>
                <input v-model="draft.name" type="text" class="px-3 py-2 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30"/>
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-medium text-stone-500">อีเมล</label>
                <input v-model="draft.email" type="email" class="px-3 py-2 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30"/>
              </div>
              <div class="flex flex-col gap-1.5 md:col-span-2">
                <label class="text-xs font-medium text-stone-500">แนะนำตัว</label>
                <textarea v-model="draft.bio" rows="2" class="px-3 py-2 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 resize-none"/>
              </div>
            </div>
          </div>
        </div>

        <!-- ── Stats ───────────────────────────────────── -->
        <div class="grid grid-cols-3 gap-4 mb-6">
          <div v-for="s in [
            { value: user.totalHours, label: 'ชั่วโมงจิตอาสา', color: 'text-emerald-600' },
            { value: user.totalActivities, label: 'กิจกรรมที่เข้าร่วม', color: 'text-stone-800' },
            { value: user.totalCreated ?? 0, label: 'กิจกรรมที่สร้าง', color: 'text-blue-500' },
          ]" :key="s.label" class="bg-white rounded-2xl border border-stone-100 p-5 text-center">
            <p class="text-3xl font-bold" :class="s.color">{{ s.value }}</p>
            <p class="text-xs text-stone-400 mt-1">{{ s.label }}</p>
          </div>
        </div>

        <!-- ── 2-col grid ──────────────────────────────── -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

          <!-- Left column -->
          <div class="md:col-span-1 flex flex-col gap-4">

            <!-- Contact -->
            <div class="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
              <h2 class="text-sm font-semibold text-stone-800 mb-4">ข้อมูลติดต่อ</h2>
              <div class="flex flex-col gap-3">

                <div class="flex items-start gap-3">
                  <div class="w-8 h-8 rounded-lg bg-stone-50 flex items-center justify-center shrink-0">
                    <svg class="w-4 h-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/>
                    </svg>
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="text-xs text-stone-400">อีเมล</p>
                    <p v-if="!editMode" class="text-sm text-stone-700 truncate">{{ user.email || '—' }}</p>
                    <input v-else v-model="draft.email" class="w-full text-sm border border-stone-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-400"/>
                  </div>
                </div>

                <div class="flex items-start gap-3">
                  <div class="w-8 h-8 rounded-lg bg-stone-50 flex items-center justify-center shrink-0">
                    <svg class="w-4 h-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/>
                    </svg>
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="text-xs text-stone-400">เบอร์โทร</p>
                    <p v-if="!editMode" class="text-sm text-stone-700">{{ user.phone || '—' }}</p>
                    <input v-else v-model="draft.phone" class="w-full text-sm border border-stone-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-400"/>
                  </div>
                </div>

                <div class="flex items-start gap-3">
                  <div class="w-8 h-8 rounded-lg bg-stone-50 flex items-center justify-center shrink-0">
                    <svg class="w-4 h-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/>
                    </svg>
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="text-xs text-stone-400">ที่อยู่</p>
                    <p v-if="!editMode" class="text-sm text-stone-700 leading-relaxed">{{ user.address || '—' }}</p>
                    <textarea v-else v-model="draft.address" rows="3" class="w-full text-sm border border-stone-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-400 resize-none"/>
                  </div>
                </div>
              </div>
            </div>

            <!-- Skills -->
            <div class="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
              <h2 class="text-sm font-semibold text-stone-800 mb-3">ทักษะ</h2>
              <div class="flex flex-wrap gap-2">
                <template v-if="!editMode">
                  <span v-if="(user.skills ?? []).length === 0" class="text-xs text-stone-400">ยังไม่มีทักษะ</span>
                  <span v-for="s in user.skills" :key="s" class="text-xs bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded-full">{{ s }}</span>
                </template>
                <template v-else>
                  <span v-for="(s, i) in draft.skills" :key="s" class="text-xs bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded-full flex items-center gap-1">
                    {{ s }}
                    <button class="text-emerald-400 hover:text-red-400 ml-0.5 leading-none" @click="removeSkill(i)">×</button>
                  </span>
                  <div class="flex gap-1 w-full mt-1">
                    <input v-model="newSkill" placeholder="เพิ่มทักษะ..." class="flex-1 text-xs border border-stone-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-400" @keyup.enter="addSkill"/>
                    <button class="text-xs bg-emerald-600 text-white px-2.5 rounded-lg" @click="addSkill">+</button>
                  </div>
                </template>
              </div>
            </div>

            <!-- Interests -->
            <div class="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
              <h2 class="text-sm font-semibold text-stone-800 mb-3">ความสนใจ</h2>
              <div class="flex flex-wrap gap-2">
                <template v-if="!editMode">
                  <span v-if="(user.interests ?? []).length === 0" class="text-xs text-stone-400">ยังไม่มีความสนใจ</span>
                  <span v-for="i in user.interests" :key="i" class="text-xs bg-amber-50 text-amber-700 border border-amber-100 px-3 py-1 rounded-full">{{ i }}</span>
                </template>
                <template v-else>
                  <span v-for="(item, i) in draft.interests" :key="item" class="text-xs bg-amber-50 text-amber-700 border border-amber-100 px-3 py-1 rounded-full flex items-center gap-1">
                    {{ item }}
                    <button class="text-amber-400 hover:text-red-400 ml-0.5 leading-none" @click="removeInterest(i)">×</button>
                  </span>
                  <div class="flex gap-1 w-full mt-1">
                    <input v-model="newInterest" placeholder="เพิ่มความสนใจ..." class="flex-1 text-xs border border-stone-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-400" @keyup.enter="addInterest"/>
                    <button class="text-xs bg-amber-500 text-white px-2.5 rounded-lg" @click="addInterest">+</button>
                  </div>
                </template>
              </div>
            </div>
          </div>

          <!-- Right: history -->
          <div class="md:col-span-2 bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
            <div class="px-6 pt-5 pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h2 class="text-sm font-semibold text-stone-800">ประวัติกิจกรรม</h2>
              <div class="flex gap-1 bg-stone-50 border border-stone-100 rounded-xl p-1">
               <button
                v-for="tab in [
                  { value: 'all', label: 'ทั้งหมด' },
                  { value: 'completed', label: 'เสร็จแล้ว' },
                  { value: 'upcoming', label: 'กำลังจะมา', icon: Timer },
                ]"
                :key="tab.value"
                class="text-xs px-3 py-1.5 rounded-lg transition-all flex items-center gap-1"
                :class="activeTab === tab.value
                  ? 'bg-white text-stone-800 font-medium shadow-sm'
                  : 'text-stone-400 hover:text-stone-600'"
                @click="activeTab = (tab.value as 'all' | 'completed' | 'upcoming')"
              >
                <component v-if="tab.icon" :is="tab.icon" class="w-3.5 h-3.5" />
                {{ tab.label }}
              </button>
              </div>
            </div>

            <div class="divide-y divide-stone-50 mt-3">
              <div v-for="item in filteredHistory" :key="item.id"
                class="flex items-center gap-4 px-6 py-4 hover:bg-stone-50/80 transition-colors">
                <img :src="item.img" :alt="item.title" class="w-14 h-14 rounded-xl object-cover shrink-0 bg-stone-100"/>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-1.5 flex-wrap mb-1">
                    <span class="text-xs font-medium px-2 py-0.5 rounded-full" :class="categoryColor[item.category] ?? 'bg-stone-100 text-stone-600'">{{ item.category }}</span>
                    <span class="text-xs px-2 py-0.5 rounded-full" :class="item.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'">
                      <span
                        class="text-xs px-2 py-0.5 rounded-full flex items-center gap-1"
                        :class="item.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-amber-50 text-amber-600'"
                      >
                        <template v-if="item.status === 'completed'">
                          ✓ เสร็จแล้ว
                        </template>

                        <template v-else>
                          <Timer class="w-3.5 h-3.5" />
                          กำลังจะมา
                        </template>
                      </span>
                    </span>
                  </div>
                  <p class="text-sm font-medium text-stone-800 truncate">{{ item.title }}</p>
                  <p class="text-xs text-stone-400 mt-0.5">{{ formatDate(item.date) }}</p>
                </div>
                <div class="text-right shrink-0">
                  <p class="text-xl font-bold text-emerald-600">{{ item.hours }}</p>
                  <p class="text-xs text-stone-400">ชั่วโมง</p>
                </div>
              </div>

              <div v-if="filteredHistory.length === 0" class="py-16 flex flex-col items-center gap-2 text-stone-400">
                <span class="text-3xl">📭</span>
                <p class="text-sm">ยังไม่มีกิจกรรมในหมวดนี้</p>
              </div>
            </div>

            <div class="px-6 py-4 border-t border-stone-50 bg-stone-50/50 flex items-center justify-between">
              <p class="text-xs text-stone-400">{{ filteredHistory.length }} กิจกรรม</p>
              <NuxtLink to="/activities" class="text-xs text-emerald-600 hover:underline">ค้นหากิจกรรมเพิ่มเติม →</NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>