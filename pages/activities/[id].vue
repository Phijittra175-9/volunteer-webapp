<script setup lang="ts">
import { ref, computed } from 'vue'
import { CalendarDays, AlarmClock, Pin, UserStar, LaptopMinimalCheck } from 'lucide-vue-next'
import db from '~/utils/supabase'
import { auth } from '~/utils/supabase'

const { profile, fetchUser, user: authUser } = useUser()
const route = useRoute()
const id = computed(() => Number(route.params.id))

const activity = ref<any>(null)
const loading = ref(true)
const creator = ref<any>(null)
const errorMsg = ref('')
const isRegistered = ref(false)

onMounted(async () => {
  const data = await db.getActivityById(id.value)
  activity.value = data
  if (data?.created_by) {
    const creatorData = await db.getUserProfile(data.created_by)
    creator.value = creatorData
  }

  const user = await auth.getUser()
  if (user?.id) {
    const regs = await db.getMyRegistrations(user.id)
    isRegistered.value = regs.some((r: any) => r.activity_id === id.value)
  }

  loading.value = false
})

useHead(() => ({
  title: activity.value ? `${activity.value.title} — VolunteerSpace` : 'ไม่พบกิจกรรม',
}))

const catColor: Record<string, string> = {
  'สิ่งแวดล้อม': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'สังคม':       'bg-orange-50 text-orange-700 border-orange-200',
  'การศึกษา':   'bg-blue-50 text-blue-700 border-blue-200',
  'งานบุญ':      'bg-amber-50 text-amber-700 border-amber-200',
  'สุขภาพ':      'bg-rose-50 text-rose-700 border-rose-200',
}

const statusStyle: Record<string, string> = {
  'เปิดรับสมัคร': 'bg-emerald-100 text-emerald-700',
  'เต็ม':         'bg-red-100 text-red-600',
  'เสร็จสิ้น':    'bg-stone-100 text-stone-500',
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('th-TH', { weekday:'long', day:'numeric', month:'long', year:'numeric' })
}

const slotsLeft = computed(() => {
  if (!activity.value) return 0
  return (activity.value.max_volunteers ?? 0) - (activity.value.current_volunteers ?? 0)
})

const isFull = computed(() => slotsLeft.value <= 0)

function pct() {
  if (!activity.value?.max_volunteers) return 0
  return Math.round((activity.value.current_volunteers / activity.value.max_volunteers) * 100)
}

const displayStatus = computed(() => {
  if (!activity.value) return ''
  if (activity.value.status === 'cancelled') return 'เสร็จสิ้น'
  if (isFull.value) return 'เต็ม'
  return 'เปิดรับสมัคร'
})

const canRegister = computed(() => displayStatus.value === 'เปิดรับสมัคร')

const isOwner = computed(() => 
  authUser.value?.id === activity.value?.created_by
)

// Registration Modal
const showModal  = ref(false)
const submitted  = ref(false)
const submitting = ref(false)

const form = ref({
  firstName: '', lastName: '', phone: '', email: '',
  foodAllergy: '', note: '', consent: false,
})

const errors = ref<Record<string, string>>({})

function validate() {
  errors.value = {}
  if (!form.value.firstName.trim()) errors.value.firstName = 'กรุณากรอกชื่อ'
  if (!form.value.lastName.trim()) errors.value.lastName = 'กรุณากรอกนามสกุล'
  if (!form.value.phone.trim()) errors.value.phone = 'กรุณากรอกเบอร์โทร'
  if (!form.value.email.trim()) errors.value.email = 'กรุณากรอกอีเมล'
  if (!form.value.consent) errors.value.consent = 'กรุณายินยอมเงื่อนไข'
  return Object.keys(errors.value).length === 0
}

// แก้ openModal
async function openModal() {
  if (!canRegister.value) return

  const authUser = await auth.getUser()
  if (!authUser) {
    return navigateTo('/login')
  }

  const latest = await db.getActivityById(activity.value.id)
  if (latest) activity.value = latest

  if ((latest?.max_volunteers ?? 0) - (latest?.current_volunteers ?? 0) <= 0) return

  await fetchUser()
  const p = profile.value
  const nameParts = (p?.full_name ?? '').trim().split(' ')
  form.value = {
    firstName: nameParts[0] ?? '',
    lastName: nameParts.slice(1).join(' ') ?? '',
    phone: p?.phone ?? '',
    email: p?.email ?? '',
    foodAllergy: '',
    note: '',
    consent: false,
  }
  errors.value = {}
  showModal.value = true
}

async function submitForm() {
  if (!validate()) return
  submitting.value = true
  errorMsg.value = '' 
  try {
      
      const latest = await db.getActivityById(activity.value.id)
      if (!latest) throw new Error('ไม่พบกิจกรรม')

      const slots = (latest.max_volunteers ?? 0) - (latest.current_volunteers ?? 0)
      if (slots <= 0) {
        throw new Error('เต็มแล้ว')
        return
      }

    const authUser = await auth.getUser()
    await db.registerActivity({
      activity_id: activity.value.id,
      user_id: authUser?.id ?? null,
      first_name: form.value.firstName,
      last_name: form.value.lastName,
      phone: form.value.phone,
      email: form.value.email,
      food_allergy: form.value.foodAllergy,
      consent_accepted: form.value.consent,
    })
    showModal.value = false
    submitted.value = true

    const refreshed = await db.getActivityById(activity.value.id)
    if (refreshed) activity.value = refreshed

  } catch (e: any) {
    errorMsg.value = 'คุณได้ลงทะเบียนกิจกรรมนี้แล้วครับ' 
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-stone-50">
    <AppHeader />
    <main class="pt-16">

      <!-- Loading -->
      <div v-if="loading" class="max-w-xl mx-auto px-6 py-32 text-center text-stone-400">
        <p class="text-sm">กำลังโหลด...</p>
      </div>

      <!-- Not found -->
      <div v-else-if="!activity" class="max-w-xl mx-auto px-6 py-32 text-center">
        <p class="text-5xl mb-4">🔍</p>
        <h1 class="text-2xl font-bold text-stone-800 mb-2">ไม่พบกิจกรรมนี้</h1>
        <p class="text-stone-400 mb-6">ID ไม่ถูกต้องหรือกิจกรรมถูกลบแล้ว</p>
        <NuxtLink to="/activities" class="bg-emerald-600 text-white px-6 py-2.5 rounded-xl hover:bg-emerald-700 transition-colors text-sm font-medium">
          ← กลับไปหน้ากิจกรรม
        </NuxtLink>
      </div>

      <template v-else>

        <!-- Cover -->
        <div class="relative h-64 md:h-80 overflow-hidden">
          <img :src="activity.image_url ?? 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200'" :alt="activity.title" class="w-full h-full object-cover"/>
          <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"/>
          <div class="absolute bottom-0 left-0 right-0 max-w-6xl mx-auto px-6 pb-8">
            <NuxtLink to="/activities" class="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm mb-3 transition-colors">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/>
              </svg>
              กลับไปหน้ากิจกรรม
            </NuxtLink>
            <div class="flex flex-wrap items-center gap-2 mb-3">
              <span class="text-xs font-medium px-2.5 py-1 rounded-full border backdrop-blur-sm" :class="catColor[activity.category]">
                {{ activity.category }}
              </span>
              <span class="text-xs font-semibold px-2.5 py-1 rounded-full" :class="statusStyle[displayStatus]">
                {{ displayStatus }}
              </span>
            </div>
            <h1 class="text-2xl md:text-3xl font-bold text-white leading-tight">{{ activity.title }}</h1>
            <p class="text-white/60 mt-1 text-sm">โดย ผู้จัดกิจกรรม</p>
          </div>
        </div>

        <!-- Body -->
        <div class="max-w-6xl mx-auto px-6 py-8">
          <div class="flex flex-col lg:flex-row gap-8">

            <!-- Left: detail -->
            <article class="flex-1 min-w-0 flex flex-col gap-5">

              <!-- About -->
              <section class="bg-white rounded-2xl border border-stone-100 p-6">
                <h2 class="font-semibold text-stone-800 mb-3 flex items-center gap-2">
                  <span class="w-1 h-5 bg-emerald-500 rounded-full inline-block"/>
                  รายละเอียดกิจกรรม
                </h2>
                <p class="text-stone-600 text-sm leading-relaxed">{{ activity.description }}</p>
                <div class="flex flex-wrap gap-1.5 mt-4">
                  <span v-for="tag in (activity.tags ?? [])" :key="tag" class="text-xs bg-stone-100 text-stone-500 px-2.5 py-1 rounded-full">#{{ tag }}</span>
                </div>
              </section>

              <!-- Key info grid -->
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div class="bg-white rounded-2xl border border-stone-100 p-4 flex flex-col gap-1">
                  <p class="text-xs text-stone-400 flex items-center gap-1">
                    <CalendarDays class="w-4 h-4" /> วันที่
                  </p>
                  <p class="text-sm font-semibold text-stone-800 leading-snug">
                    {{ activity.date ? new Date(activity.date).toLocaleDateString('th-TH',{day:'numeric',month:'short',year:'numeric'}) : '-' }}
                  </p>
                </div>
                <div class="bg-white rounded-2xl border border-stone-100 p-4 flex flex-col gap-1">
                  <p class="text-xs text-stone-400 flex items-center gap-1">
                    <AlarmClock class="w-4 h-4" /> เวลา
                  </p>
                  <p class="text-sm font-semibold text-stone-800">{{ activity.start_time ?? '-' }} น.</p>
                  <p class="text-xs text-stone-400">{{ activity.duration_hours }} ชั่วโมง</p>
                </div>
                <div class="bg-white rounded-2xl border border-stone-100 p-4 flex flex-col gap-1">
                  <p class="text-xs text-stone-400 flex items-center gap-1">
                    <Pin class="w-4 h-4" /> สถานที่
                  </p>
                  <p class="text-sm font-semibold text-stone-800">{{ activity.location ?? '-' }}</p>
                </div>
                <div class="bg-white rounded-2xl border border-stone-100 p-4 flex flex-col gap-1">
                  <p class="text-xs text-stone-400 flex items-center gap-1">
                    <UserStar class="w-4 h-4" /> อาสาสมัคร
                  </p>
                  <p class="text-sm font-semibold" :class="slotsLeft===0 ? 'text-red-500' : 'text-emerald-600'">
                    {{ slotsLeft }} / {{ activity.max_volunteers }}
                  </p>
                  <p class="text-xs text-stone-400">ที่นั่งว่าง</p>
                </div>
              </div>

              <!-- Schedule -->
              <section v-if="activity.schedule?.length" class="bg-white rounded-2xl border border-stone-100 p-6">
                <h2 class="font-semibold text-stone-800 mb-5 flex items-center gap-2">
                  <span class="w-1 h-5 bg-emerald-500 rounded-full inline-block"/>
                  กำหนดการ
                </h2>
                <div class="relative">
                  <div class="absolute left-[52px] top-0 bottom-0 w-px bg-stone-100"/>
                  <div v-for="(item, i) in activity.schedule" :key="i" class="flex gap-4 pb-5 last:pb-0">
                    <div class="text-right text-xs text-stone-400 w-12 pt-0.5 shrink-0 font-medium">{{ item.time }}</div>
                    <div class="relative z-10 shrink-0 mt-1">
                      <div class="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white ring-1 ring-emerald-300"/>
                    </div>
                    <div class="flex-1">
                      <p class="text-sm font-medium text-stone-800">{{ item.title }}</p>
                      <p class="text-xs text-stone-400 mt-0.5">{{ item.detail ?? item.desc }}</p>
                    </div>
                  </div>
                </div>
              </section>

              <!-- Requirements + Items -->
              <div class="grid sm:grid-cols-2 gap-4">
                <section v-if="activity.requirements?.length" class="bg-white rounded-2xl border border-stone-100 p-5">
                  <h2 class="font-semibold text-stone-800 mb-3 flex items-center gap-2">
                    <span class="w-1 h-5 bg-blue-500 rounded-full inline-block"/>
                    คุณสมบัติผู้สมัคร
                  </h2>
                  <ul class="flex flex-col gap-2">
                    <li v-for="r in activity.requirements" :key="r" class="flex items-start gap-2 text-sm text-stone-600">
                      <svg class="w-4 h-4 text-blue-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      {{ r }}
                    </li>
                  </ul>
                </section>
                <section v-if="activity.what_to_bring?.length" class="bg-white rounded-2xl border border-stone-100 p-5">
                  <h2 class="font-semibold text-stone-800 mb-3 flex items-center gap-2">
                    <span class="w-1 h-5 bg-amber-500 rounded-full inline-block"/>
                    สิ่งที่ต้องเตรียม
                  </h2>
                  <ul class="flex flex-col gap-2">
                    <li v-for="it in activity.what_to_bring" :key="it" class="flex items-start gap-2 text-sm text-stone-600">
                      <svg class="w-4 h-4 text-amber-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      {{ it }}
                    </li>
                  </ul>
                </section>
              </div>

            </article>

            <!-- Right: sticky sidebar -->
            <aside class="lg:w-72 shrink-0">
              <div class="sticky top-24 flex flex-col gap-4">

                <!-- Register card -->
                <div class="bg-white rounded-2xl border border-stone-100 p-6 flex flex-col gap-4">

                  <!-- Slots progress -->
                  <div>
                    <div class="flex justify-between text-xs mb-1.5">
                      <span class="text-stone-500 font-medium">จำนวนอาสาสมัคร</span>
                      <span class="font-semibold" :class="slotsLeft===0?'text-red-500':slotsLeft<=5?'text-amber-500':'text-emerald-600'">
                        {{ slotsLeft }} ที่นั่งว่าง
                      </span>
                    </div>
                    <div class="h-2 bg-stone-100 rounded-full overflow-hidden">
                      <div class="h-full rounded-full transition-all"
                        :class="pct()>=90?'bg-red-400':pct()>=60?'bg-amber-400':'bg-emerald-500'"
                        :style="{width:`${pct()}%`}"/>
                    </div>
                    <p class="text-xs text-stone-400 mt-1">{{ pct() }}% จาก {{ activity.max_volunteers }} ที่นั่ง</p>
                  </div>

                  <div class="h-px bg-stone-100"/>

                  <!-- Info rows -->
                  <div class="flex flex-col gap-3 text-sm">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-lg bg-stone-50 flex items-center justify-center shrink-0">
                        <CalendarDays class="w-4 h-4 text-stone-500" />
                      </div>
                      <div>
                        <p class="text-xs text-stone-400">วันที่จัด</p>
                        <p class="font-medium text-stone-800">{{ activity.date ? formatDate(activity.date) : '-' }}</p>
                      </div>
                    </div>
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-lg bg-stone-50 flex items-center justify-center shrink-0">
                        <AlarmClock class="w-4 h-4 text-stone-500" />
                      </div>
                      <div>
                        <p class="text-xs text-stone-400">เวลา / ระยะเวลา</p>
                        <p class="font-medium text-stone-800">{{ activity.start_time ?? '-' }} น. · {{ activity.duration_hours }} ชั่วโมง</p>
                      </div>
                    </div>
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-lg bg-stone-50 flex items-center justify-center shrink-0">
                        <Pin class="w-4 h-4 text-stone-500" />
                      </div>
                      <div>
                        <p class="text-xs text-stone-400">สถานที่</p>
                        <p class="font-medium text-stone-800">{{ activity.location ?? '-' }}</p>
                      </div>
                    </div>
                  </div>

                  <div class="h-px bg-stone-100"/>

                  <!-- Success state -->
                  <div v-if="submitted" class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center flex flex-col items-center">
                    <LaptopMinimalCheck class="w-8 h-8 text-emerald-600 mb-1" />
                    <p class="text-sm font-semibold text-emerald-800">ลงทะเบียนสำเร็จ!</p>
                    <p class="text-xs text-emerald-600 mt-0.5">เราจะส่งรายละเอียดไปยังอีเมลของท่าน</p>
                  </div>

                  <!-- เจ้าของกิจกรรม -->
                  <div v-else-if="isOwner" class="bg-stone-50 border border-stone-200 rounded-xl p-4 text-center">
                      <p class="text-sm text-stone-500">คุณเป็นผู้สร้างกิจกรรมนี้</p>
                  </div>

                  <!-- Submit Success-->
                  <div v-else-if="isRegistered || submitted" class="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                    <p class="text-sm text-blue-600 font-medium">คุณลงทะเบียนแล้ว</p>
                    <p class="text-xs text-blue-400 mt-0.5">รอการอนุมัติจากผู้จัดกิจกรรม</p>
                  </div>

                  <!-- isFull -->
                  <div v-else-if="isFull" class="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                    <p class="text-sm text-amber-800">กิจกรรมนี้เต็มแล้ว</p>
                    <p class="text-xs text-amber-600 mt-1">ไม่สามารถสมัครได้</p>
                  </div>

                  <!-- CTA button -->
                  <button v-else
                    class="w-full py-3 rounded-xl font-semibold text-sm transition-all"
                    :class="canRegister
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm active:scale-[0.98]'
                      : 'bg-stone-100 text-stone-400 cursor-not-allowed'"
                    :disabled="!canRegister"
                    @click="openModal">
                    <span v-if="displayStatus==='เปิดรับสมัคร'">ลงทะเบียนเป็นจิตอาสา</span>
                    <span v-else-if="displayStatus==='เต็ม'">เต็มแล้ว ไม่สามารถสมัครได้</span>
                    <span v-else>กิจกรรมนี้เสร็จสิ้นแล้ว</span>
                  </button>

                  <p v-if="canRegister && !submitted" class="text-xs text-stone-400 text-center">ไม่มีค่าใช้จ่าย · กดเพื่อกรอกข้อมูล</p>
                </div>

                <!-- Organizer -->
<div class="bg-white rounded-2xl border border-stone-100 p-5">
  <p class="text-xs text-stone-400 uppercase tracking-wider mb-3 font-medium">ผู้จัดกิจกรรม</p>
  <div class="flex items-center gap-3">
    <div class="w-10 h-10 rounded-xl bg-stone-900 flex items-center justify-center text-white font-bold text-sm shrink-0">
      {{ creator?.full_name?.charAt(0) ?? 'V' }}
    </div>
    <div>
      <p class="text-sm font-medium text-stone-800">{{ creator?.full_name ?? 'ผู้จัดกิจกรรม' }}</p>
      <p class="text-xs text-stone-400">{{ creator?.email ?? '-' }}</p>
      <p v-if="creator?.phone" class="text-xs text-stone-400">{{ creator.phone }}</p>
    </div>
  </div>
</div>

              </div>
            </aside>

          </div>
        </div>

        <!-- MODAL -->
        <Teleport to="body">
          <Transition
            enter-active-class="transition duration-300"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition duration-200"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <div v-if="showModal" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
              <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="showModal=false"/>
              <Transition
                enter-active-class="transition duration-300"
                enter-from-class="translate-y-full sm:translate-y-4 opacity-0"
                enter-to-class="translate-y-0 opacity-100"
              >
                <div v-if="showModal" class="relative z-10 w-full sm:max-w-md bg-white sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">

                  <div class="px-6 pt-6 pb-4 border-b border-stone-100 shrink-0">
                    <div class="flex items-start justify-between gap-3">
                      <div>
                        <h3 class="font-bold text-stone-900 text-lg">ลงทะเบียนจิตอาสา</h3>
                        <p class="text-xs text-stone-400 mt-0.5 leading-relaxed">{{ activity.title }}</p>
                      </div>
                      <button class="w-8 h-8 rounded-full hover:bg-stone-100 flex items-center justify-center shrink-0 mt-0.5" @click="showModal=false">
                        <svg class="w-4 h-4 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div class="flex-1 overflow-y-auto px-6 py-5">
                    <div class="flex flex-col gap-4">

                      <div class="grid grid-cols-2 gap-3">
                        <div>
                          <label class="text-xs font-medium text-stone-600 mb-1.5 block">ชื่อ <span class="text-red-400">*</span></label>
                          <input v-model="form.firstName" type="text" placeholder="ชื่อจริง"
                            class="w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition"
                            :class="errors.firstName ? 'border-red-300 bg-red-50' : 'border-stone-200'"/>
                          <p v-if="errors.firstName" class="text-xs text-red-400 mt-1">{{ errors.firstName }}</p>
                        </div>
                        <div>
                          <label class="text-xs font-medium text-stone-600 mb-1.5 block">นามสกุล <span class="text-red-400">*</span></label>
                          <input v-model="form.lastName" type="text" placeholder="นามสกุล"
                            class="w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition"
                            :class="errors.lastName ? 'border-red-300 bg-red-50' : 'border-stone-200'"/>
                          <p v-if="errors.lastName" class="text-xs text-red-400 mt-1">{{ errors.lastName }}</p>
                        </div>
                      </div>

                      <div>
                        <label class="text-xs font-medium text-stone-600 mb-1.5 block">เบอร์โทรศัพท์ <span class="text-red-400">*</span></label>
                        <input v-model="form.phone" type="tel" placeholder="08x-xxx-xxxx"
                          class="w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition"
                          :class="errors.phone ? 'border-red-300 bg-red-50' : 'border-stone-200'"/>
                        <p v-if="errors.phone" class="text-xs text-red-400 mt-1">{{ errors.phone }}</p>
                      </div>

                      <div>
                        <label class="text-xs font-medium text-stone-600 mb-1.5 block">อีเมล <span class="text-red-400">*</span></label>
                        <input v-model="form.email" type="email" placeholder="your@email.com"
                          class="w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition"
                          :class="errors.email ? 'border-red-300 bg-red-50' : 'border-stone-200'"/>
                        <p v-if="errors.email" class="text-xs text-red-400 mt-1">{{ errors.email }}</p>
                      </div>

                      <div>
                        <label class="text-xs font-medium text-stone-600 mb-1.5 block">อาหารที่แพ้ / ข้อจำกัดด้านสุขภาพ</label>
                        <input v-model="form.foodAllergy" type="text" placeholder="เช่น แพ้อาหารทะเล (ถ้าไม่มีใส่ -)"
                          class="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition"/>
                      </div>

                      <div>
                        <label class="text-xs font-medium text-stone-600 mb-1.5 block">หมายเหตุ / ข้อมูลเพิ่มเติม</label>
                        <textarea v-model="form.note" rows="3" placeholder="ข้อมูลอื่นๆ ที่ต้องการแจ้งผู้จัด"
                          class="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition resize-none"/>
                      </div>

                      <label class="flex items-start gap-3 cursor-pointer bg-stone-50 rounded-2xl p-4 border"
                        :class="errors.consent ? 'border-red-200 bg-red-50' : 'border-stone-100'">
                        <input v-model="form.consent" type="checkbox" class="mt-0.5 accent-emerald-600 w-4 h-4 shrink-0"/>
                        <span class="text-xs text-stone-500 leading-relaxed">
                          ข้าพเจ้ายินยอมให้ข้อมูลส่วนบุคคลถูกนำไปใช้เพื่อการจัดกิจกรรม และรับทราบกฎระเบียบของผู้จัดทุกประการ
                        </span>
                      </label>
                      <p v-if="errors.consent" class="text-xs text-red-400 -mt-2">{{ errors.consent }}</p>

                    </div>
                  </div>

                  <div class="px-6 pb-6 pt-4 border-t border-stone-100 shrink-0 flex gap-3">
                    <button class="flex-1 py-3 rounded-xl border border-stone-200 text-sm text-stone-600 hover:bg-stone-50 transition-colors font-medium"
                      @click="showModal=false">
                      ยกเลิก
                    </button>
                    <button class="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      :disabled="submitting"
                      @click="submitForm">
                      <svg v-if="submitting" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 22 6.477 22 12h-4z"/>
                      </svg>
                      {{ submitting ? 'กำลังบันทึก...' : 'ยืนยันลงทะเบียน' }}
                    </button>
                  </div>
                  <p v-if="errorMsg" class="text-xs text-red-500 text-center mt-1">{{ errorMsg }}</p>

                </div>
              </Transition>
            </div>
          </Transition>
        </Teleport>

      </template>
    </main>
  </div>
</template>