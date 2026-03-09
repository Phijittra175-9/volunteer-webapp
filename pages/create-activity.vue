<script setup lang="ts">
import { ref, computed } from 'vue'
useHead({ title: 'สร้างกิจกรรม — VolunteerSpace' })
import { BookSearch, Leaf, Users, BookOpen, HeartHandshake, HeartPulse , Check, NotebookPen, LaptopMinimalCheck } from 'lucide-vue-next'
import db from '~/utils/supabase'

type Category = 'สิ่งแวดล้อม' | 'สังคม' | 'การศึกษา' | 'งานบุญ' | 'สุขภาพ'
type Status = 'open' | 'draft'

// ── Form state ─────────────────────────────────────────────────────────────
const step = ref(1) // 3-step wizard
const loading = ref(false)
const submitted = ref(false)

// Step 1 — ข้อมูลหลัก
const title = ref('')
const category = ref<Category | ''>('')
const description = ref('')
const coverPreview = ref<string | null>(null)
const coverFile = ref<File | null>(null)

// Step 2 — วันเวลา & สถานที่
const date = ref('')
const timeStart = ref('')
const timeEnd = ref('')
const location = ref('')
const locationDetail = ref('')
const isOnline = ref(false)

// Step 3 — อาสาสมัคร & เงื่อนไข
const slots = ref<number | ''>('')
const hours = ref<number | ''>('')
const status = ref<Status>('open')
const requirementInput = ref('')
const requirements = ref<string[]>([])
const bringInput = ref('')
const whatToBring = ref<string[]>([])
const tagInput = ref('')
// ข้อมูลติดต่อ
const contactName = ref('')
const contactPhone = ref('')
const contactEmail = ref('')
const tags = ref<string[]>([])
const scheduleItems = ref<{ time: string; detail: string }[]>([
  { time: '', detail: '' },
])

// ── Validation ─────────────────────────────────────────────────────────────
const errors = ref<Record<string, string>>({})

function validateStep(n: number) {
  errors.value = {}
  if (n === 1) {
    if (!title.value.trim()) errors.value.title = 'กรุณากรอกชื่อกิจกรรม'
    if (!category.value) errors.value.category = 'กรุณาเลือกหมวดหมู่'
    if (!description.value.trim()) errors.value.description = 'กรุณากรอกรายละเอียด'
  }
  if (n === 2) {
    if (!date.value) errors.value.date = 'กรุณาเลือกวันที่'
    if (!timeStart.value) errors.value.timeStart = 'กรุณาระบุเวลาเริ่ม'
    if (!timeEnd.value) errors.value.timeEnd = 'กรุณาระบุเวลาสิ้นสุด'
    if (!isOnline.value && !location.value.trim()) errors.value.location = 'กรุณาระบุสถานที่'
  }
  if (n === 3) {
    if (!slots.value || Number(slots.value) < 1) errors.value.slots = 'กรุณาระบุจำนวนอาสาสมัคร'
    if (!hours.value || Number(hours.value) < 1) errors.value.hours = 'กรุณาระบุจำนวนชั่วโมง'
  }
  return Object.keys(errors.value).length === 0
}

function nextStep() {
  if (validateStep(step.value)) step.value++
}
function prevStep() {
  errors.value = {}
  step.value--
}

// ── Helpers ────────────────────────────────────────────────────────────────
function onCoverChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  coverFile.value = file  // เก็บไฟล์จริงไว้
  const reader = new FileReader()
  reader.onload = () => { coverPreview.value = reader.result as string }
  reader.readAsDataURL(file)
}

function addRequirement() {
  if (requirementInput.value.trim()) {
    requirements.value.push(requirementInput.value.trim())
    requirementInput.value = ''
  }
}
function addBring() {
  if (bringInput.value.trim()) {
    whatToBring.value.push(bringInput.value.trim())
    bringInput.value = ''
  }
}
function addTag() {
  const t = tagInput.value.trim().replace(/^#/, '')
  if (t && !tags.value.includes(t)) {
    tags.value.push(t)
    tagInput.value = ''
  }
}
function addScheduleRow() { scheduleItems.value.push({ time: '', detail: '' }) }
function removeScheduleRow(i: number) { scheduleItems.value.splice(i, 1) }

const { user: authUser, fetchUser } = useUser()
onMounted(() => fetchUser())

async function handleSubmit() {
  if (!validateStep(3)) return
  loading.value = true
  try {
    // อัพโหลดรูปก่อนถ้ามี
    let imageUrl: string | undefined
    if (coverFile.value) {
      imageUrl = await db.uploadImage(coverFile.value)
    }

    const payload = {
      title: title.value,
      category: category.value,
      description: description.value,
      tags: tags.value.length ? tags.value : undefined,
      date: date.value,
      start_time: timeStart.value,
      location: location.value,
      duration_hours: Number(hours.value),
      max_volunteers: Number(slots.value),
      requirements: requirements.value.length ? requirements.value : undefined,
      what_to_bring: whatToBring.value.length ? whatToBring.value : undefined,
      schedule: scheduleItems.value.filter(s => s.time && s.detail).map(s => ({
        time: s.time,
        title: s.detail,
        detail: s.detail,
      })),
      contact_name: contactName.value || undefined,
      contact_phone: contactPhone.value || undefined,
      contact_email: contactEmail.value || undefined,
      image_url: imageUrl,  // ← เพิ่มบรรทัดนี้
      status: status.value === 'draft' ? 'draft' : 'pending',
      created_by: authUser.value?.id,
    }
    await db.createActivity(payload as any)
    submitted.value = true
  } catch (e: any) {
    alert(e.message ?? 'เกิดข้อผิดพลาด กรุณาลองใหม่')
  } finally {
    loading.value = false
  }
}

const categories: { label: string; value: Category | 'ทั้งหมด'; icon: any }[] = [
  { label: 'ทั้งหมด', value: 'ทั้งหมด', icon: BookSearch },
  { label: 'สิ่งแวดล้อม', value: 'สิ่งแวดล้อม', icon: Leaf },
  { label: 'สังคม', value: 'สังคม', icon: Users },
  { label: 'การศึกษา', value: 'การศึกษา', icon: BookOpen },
  { label: 'งานบุญ', value: 'งานบุญ', icon: HeartHandshake },
  { label: 'สุขภาพ', value: 'สุขภาพ', icon: HeartPulse },
]

const stepLabels = ['ข้อมูลหลัก', 'วันเวลา & สถานที่', 'อาสาสมัคร & เงื่อนไข']

const categoryColor: Record<string, string> = {
  'ทั้งหมด':      'border-purple-400 bg-stone-50 text-stone-700',
  'สิ่งแวดล้อม': 'border-emerald-400 bg-emerald-50 text-emerald-700',
  'สังคม':       'border-orange-400 bg-orange-50 text-orange-700',
  'การศึกษา':   'border-blue-400 bg-blue-50 text-blue-700',
  'งานบุญ':      'border-amber-400 bg-amber-50 text-amber-700',
  'สุขภาพ':      'border-rose-400 bg-rose-50 text-rose-700',
}
</script>

<template>
  <div class="min-h-screen bg-stone-50">
    <AppHeader />

    <main class="pt-16 pb-16">

      <!-- ── Success state ──────────────────────────── -->
      <div v-if="submitted" class="max-w-lg mx-auto px-6 py-24 flex flex-col items-center text-center gap-5">
        <div class="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-4xl"><LaptopMinimalCheck /></div>
        <h1 class="text-2xl font-bold text-stone-900">สร้างกิจกรรมสำเร็จ!</h1>
        <p class="text-sm text-stone-500 leading-relaxed">
          กิจกรรม <span class="font-semibold text-stone-700">"{{ title }}"</span> ถูกสร้างแล้ว<br/>
          รอการตรวจสอบจากทีมงานก่อนเผยแพร่
        </p>
        <div class="flex gap-3 mt-2">
          <NuxtLink to="/activities" class="text-sm bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl transition-colors">
            ดูกิจกรรมทั้งหมด
          </NuxtLink>
          <button class="text-sm border border-stone-200 hover:bg-stone-50 text-stone-600 px-5 py-2.5 rounded-xl transition-colors"
            @click="submitted = false; step = 1">
            สร้างกิจกรรมใหม่
          </button>
        </div>
      </div>

      <!-- ── Form ───────────────────────────────────── -->
      <div v-else class="max-w-5xl mx-auto px-6 pt-10">

        <!-- Page title -->
        <div class="mb-8">
          <NuxtLink to="/" class="inline-flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-700 transition-colors mb-4">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/>
            </svg>
            กลับหน้าแรก
          </NuxtLink>
          <h1 class="text-2xl font-bold text-stone-900">สร้างกิจกรรมใหม่</h1>
          <p class="text-sm text-stone-400 mt-1">กรอกข้อมูลเพื่อสร้างกิจกรรมจิตอาสาของคุณ</p>
        </div>

        <!-- Step indicator -->
        <div class="flex items-center gap-0 mb-10">
          <template v-for="(label, i) in stepLabels" :key="i">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                :class="step > i + 1
                  ? 'bg-emerald-600 text-white'
                  : step === i + 1
                    ? 'bg-stone-900 text-white'
                    : 'bg-stone-100 text-stone-400'">
                <svg v-if="step > i + 1" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
                </svg>
                <span v-else>{{ i + 1 }}</span>
              </div>
              <span class="text-xs hidden sm:block" :class="step === i + 1 ? 'text-stone-800 font-medium' : 'text-stone-400'">
                {{ label }}
              </span>
            </div>
            <div v-if="i < stepLabels.length - 1" class="flex-1 h-px mx-3"
              :class="step > i + 1 ? 'bg-emerald-400' : 'bg-stone-200'"/>
          </template>
        </div>

        <div class="flex flex-col lg:flex-row gap-8">

          <!-- ── Main form area ──────────────────────── -->
          <div class="flex-1 min-w-0">

            <!-- STEP 1 ─────────────────────────────── -->
            <div v-if="step === 1" class="flex flex-col gap-5">

              <!-- Cover image -->
              <div class="flex flex-col gap-1.5">
                <label class="text-sm font-medium text-stone-700">รูปปกกิจกรรม <span class="text-stone-400 font-normal">(ไม่บังคับ)</span></label>
                <div class="relative w-full h-48 rounded-2xl border-2 border-dashed border-stone-200 bg-white overflow-hidden cursor-pointer hover:border-emerald-400 transition-colors group"
                  @click="($refs.coverInput as HTMLInputElement)?.click()">
                  <img v-if="coverPreview" :src="coverPreview" class="w-full h-full object-cover"/>
                  <div v-else class="w-full h-full flex flex-col items-center justify-center gap-2 text-stone-400 group-hover:text-emerald-500 transition-colors">
                    <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M7.5 8.25h.008v.008H7.5V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM19.5 4.5h-15a.75.75 0 00-.75.75v13.5c0 .414.336.75.75.75h15a.75.75 0 00.75-.75V5.25a.75.75 0 00-.75-.75z"/>
                    </svg>
                    <p class="text-sm font-medium">คลิกเพื่ออัปโหลดรูปปก</p>
                    <p class="text-xs">JPG, PNG ขนาดไม่เกิน 10MB · แนะนำ 16:9</p>
                  </div>
                  <button v-if="coverPreview" type="button"
                    class="absolute top-3 right-3 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
                    @click.stop="coverPreview = null">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
                <input ref="coverInput" type="file" accept="image/*" class="hidden" @change="onCoverChange"/>
              </div>

              <!-- Title -->
              <div class="flex flex-col gap-1.5">
                <label class="text-sm font-medium text-stone-700">ชื่อกิจกรรม <span class="text-red-400">*</span></label>
                <input v-model="title" type="text" placeholder="เช่น ปลูกป่าชายเลนบางปู ครั้งที่ 3"
                  class="px-4 py-3 text-sm border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition placeholder:text-stone-300"
                  :class="errors.title ? 'border-red-300' : 'border-stone-200'"/>
                <p v-if="errors.title" class="text-xs text-red-500">{{ errors.title }}</p>
              </div>

              <!-- Category -->
              <div class="flex flex-col gap-1.5">
                <label class="text-sm font-medium text-stone-700">
                  หมวดหมู่ <span class="text-red-400">*</span>
                </label>

                <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <button
                    v-for="cat in categories"
                    :key="cat.value"
                    type="button"
                    class="flex flex-col items-center gap-1 py-3 rounded-xl border-2 transition-all text-center"
                    :class="
                      category === cat.value
                        ? categoryColor[cat.value]
                        : 'border-stone-100 bg-white hover:border-stone-200'
                    "
                    @click="category = cat.value as Category"
                  >
                    <!-- icon -->
                    <component :is="cat.icon" class="w-5 h-5" />

                    <!-- label -->
                    <span
                      class="text-xs font-medium"
                      :class="category === cat.value ? '' : 'text-stone-600'"
                    >
                      {{ cat.label }}
                    </span>
                  </button>
                </div>

                <p v-if="errors.category" class="text-xs text-red-500">
                  {{ errors.category }}
                </p>
              </div>

              <!-- Description -->
              <div class="flex flex-col gap-1.5">
                <label class="text-sm font-medium text-stone-700">รายละเอียดกิจกรรม <span class="text-red-400">*</span></label>
                <textarea v-model="description" rows="5"
                  placeholder="อธิบายรายละเอียด วัตถุประสงค์ และสิ่งที่จะได้รับจากการเข้าร่วมกิจกรรมนี้..."
                  class="px-4 py-3 text-sm border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition resize-none placeholder:text-stone-300"
                  :class="errors.description ? 'border-red-300' : 'border-stone-200'"/>
                <div class="flex justify-between">
                  <p v-if="errors.description" class="text-xs text-red-500">{{ errors.description }}</p>
                  <p class="text-xs text-stone-400 ml-auto">{{ description.length }} ตัวอักษร</p>
                </div>
              </div>

              <!-- Tags -->
              <div class="flex flex-col gap-1.5">
                <label class="text-sm font-medium text-stone-700">แท็ก <span class="text-stone-400 font-normal">(ไม่บังคับ)</span></label>
                <div class="flex flex-wrap gap-2 mb-2">
                  <span v-for="(tag, i) in tags" :key="tag"
                    class="inline-flex items-center gap-1 text-xs bg-stone-100 text-stone-600 px-3 py-1.5 rounded-full">
                    #{{ tag }}
                    <button type="button" class="hover:text-red-500 ml-0.5" @click="tags.splice(i, 1)">×</button>
                  </span>
                </div>
                <div class="flex gap-2">
                  <input v-model="tagInput" type="text" placeholder="#ธรรมชาติ"
                    class="flex-1 px-4 py-2.5 text-sm border border-stone-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition placeholder:text-stone-300"
                    @keyup.enter="addTag"/>
                  <button type="button" class="px-4 py-2.5 text-sm bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-xl transition-colors"
                    @click="addTag">เพิ่ม</button>
                </div>
              </div>
            </div>

            <!-- STEP 2 ─────────────────────────────── -->
            <div v-else-if="step === 2" class="flex flex-col gap-5">

              <!-- Date -->
              <div class="flex flex-col gap-1.5">
                <label class="text-sm font-medium text-stone-700">วันที่จัดกิจกรรม <span class="text-red-400">*</span></label>
                <input v-model="date" type="date"
                  class="px-4 py-3 text-sm border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition"
                  :class="errors.date ? 'border-red-300' : 'border-stone-200'"/>
                <p v-if="errors.date" class="text-xs text-red-500">{{ errors.date }}</p>
              </div>

              <!-- Time -->
              <div class="grid grid-cols-2 gap-4">
                <div class="flex flex-col gap-1.5">
                  <label class="text-sm font-medium text-stone-700">เวลาเริ่ม <span class="text-red-400">*</span></label>
                  <input v-model="timeStart" type="time"
                    class="px-4 py-3 text-sm border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition"
                    :class="errors.timeStart ? 'border-red-300' : 'border-stone-200'"/>
                  <p v-if="errors.timeStart" class="text-xs text-red-500">{{ errors.timeStart }}</p>
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-sm font-medium text-stone-700">เวลาสิ้นสุด <span class="text-red-400">*</span></label>
                  <input v-model="timeEnd" type="time"
                    class="px-4 py-3 text-sm border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition"
                    :class="errors.timeEnd ? 'border-red-300' : 'border-stone-200'"/>
                  <p v-if="errors.timeEnd" class="text-xs text-red-500">{{ errors.timeEnd }}</p>
                </div>
              </div>

              <!-- Online toggle -->
              <div class="flex items-center gap-3 p-4 bg-white border border-stone-200 rounded-xl">
                <button type="button"
                  class="w-11 h-6 rounded-full transition-colors relative shrink-0"
                  :class="isOnline ? 'bg-emerald-500' : 'bg-stone-200'"
                  @click="isOnline = !isOnline; if(isOnline) location = 'ออนไลน์'">
                  <span class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform"
                    :class="isOnline ? 'translate-x-5' : 'translate-x-0'"/>
                </button>
                <div>
                  <p class="text-sm font-medium text-stone-700">กิจกรรมออนไลน์</p>
                  <p class="text-xs text-stone-400">เปิดใช้ถ้ากิจกรรมจัดผ่าน Zoom, Meet ฯลฯ</p>
                </div>
              </div>

              <!-- Location -->
              <div class="flex flex-col gap-1.5">
                <label class="text-sm font-medium text-stone-700">
                  {{ isOnline ? 'แพลตฟอร์ม / ลิงก์' : 'จังหวัด / เขต' }}
                  <span class="text-red-400">*</span>
                </label>
                <input v-model="location" type="text"
                  :placeholder="isOnline ? 'เช่น Zoom, Google Meet' : 'เช่น กรุงเทพฯ, เชียงใหม่'"
                  class="px-4 py-3 text-sm border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition placeholder:text-stone-300"
                  :class="errors.location ? 'border-red-300' : 'border-stone-200'"/>
                <p v-if="errors.location" class="text-xs text-red-500">{{ errors.location }}</p>
              </div>

              <!-- Location detail -->
              <div class="flex flex-col gap-1.5">
                <label class="text-sm font-medium text-stone-700">
                  {{ isOnline ? 'ข้อมูลเพิ่มเติม' : 'ที่อยู่เต็ม' }}
                  <span class="text-stone-400 font-normal">(ไม่บังคับ)</span>
                </label>
                <textarea v-model="locationDetail" rows="2"
                  :placeholder="isOnline ? 'เช่น ลิงก์จะส่งให้ทางอีเมลหลังลงทะเบียน' : 'เช่น 123 ถ.สุขุมวิท แขวงคลองเตย เขตคลองเตย'"
                  class="px-4 py-3 text-sm border border-stone-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition resize-none placeholder:text-stone-300"/>
              </div>

              <!-- Schedule -->
              <div class="flex flex-col gap-2">
                <label class="text-sm font-medium text-stone-700">กำหนดการ <span class="text-stone-400 font-normal">(ไม่บังคับ)</span></label>
                <div v-for="(item, i) in scheduleItems" :key="i" class="flex gap-2 items-center">
                  <input v-model="item.time" type="time"
                    class="w-28 shrink-0 px-3 py-2.5 text-sm border border-stone-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"/>
                  <input v-model="item.detail" type="text" placeholder="รายละเอียด เช่น ลงทะเบียน"
                    class="flex-1 px-3 py-2.5 text-sm border border-stone-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 placeholder:text-stone-300"/>
                  <button v-if="scheduleItems.length > 1" type="button"
                    class="w-8 h-8 shrink-0 flex items-center justify-center text-stone-400 hover:text-red-400 transition-colors"
                    @click="removeScheduleRow(i)">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
                <button type="button"
                  class="self-start text-xs text-emerald-600 hover:text-emerald-700 border border-emerald-200 hover:border-emerald-300 bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                  @click="addScheduleRow">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
                  </svg>
                  เพิ่มรายการ
                </button>
              </div>
            </div>

            <!-- STEP 3 ─────────────────────────────── -->
            <div v-else-if="step === 3" class="flex flex-col gap-5">

              <!-- Slots + Hours -->
              <div class="grid grid-cols-2 gap-4">
                <div class="flex flex-col gap-1.5">
                  <label class="text-sm font-medium text-stone-700">จำนวนอาสาที่ต้องการ <span class="text-red-400">*</span></label>
                  <input v-model="slots" type="number" min="1" placeholder="เช่น 20"
                    class="px-4 py-3 text-sm border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition placeholder:text-stone-300"
                    :class="errors.slots ? 'border-red-300' : 'border-stone-200'"/>
                  <p v-if="errors.slots" class="text-xs text-red-500">{{ errors.slots }}</p>
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-sm font-medium text-stone-700">จำนวนชั่วโมง <span class="text-red-400">*</span></label>
                  <input v-model="hours" type="number" min="1" placeholder="เช่น 6"
                    class="px-4 py-3 text-sm border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition placeholder:text-stone-300"
                    :class="errors.hours ? 'border-red-300' : 'border-stone-200'"/>
                  <p v-if="errors.hours" class="text-xs text-red-500">{{ errors.hours }}</p>
                </div>
              </div>

              <!-- ข้อมูลติดต่อ -->
<div class="flex flex-col gap-4 p-5 bg-stone-50 rounded-2xl border border-stone-100">
  <p class="text-sm font-medium text-stone-700">ข้อมูลติดต่อผู้จัด <span class="text-stone-400 font-normal">(ไม่บังคับ)</span></p>
  <div class="flex flex-col gap-1.5">
    <label class="text-xs font-medium text-stone-600">ชื่อผู้ติดต่อ</label>
    <input v-model="contactName" type="text" placeholder="เช่น คุณสมศรี มีสุข"
      class="px-4 py-2.5 text-sm border border-stone-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition placeholder:text-stone-300"/>
  </div>
  <div class="grid grid-cols-2 gap-3">
    <div class="flex flex-col gap-1.5">
      <label class="text-xs font-medium text-stone-600">เบอร์โทร</label>
      <input v-model="contactPhone" type="tel" placeholder="02-xxx-xxxx"
        class="px-4 py-2.5 text-sm border border-stone-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition placeholder:text-stone-300"/>
    </div>
    <div class="flex flex-col gap-1.5">
      <label class="text-xs font-medium text-stone-600">อีเมล</label>
      <input v-model="contactEmail" type="email" placeholder="info@org.com"
        class="px-4 py-2.5 text-sm border border-stone-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition placeholder:text-stone-300"/>
    </div>
  </div>
</div>

              <!-- Status -->
              <div class="flex flex-col gap-1.5">
                <label class="text-sm font-medium text-stone-700">
                  สถานะการเผยแพร่
                </label>

                <div class="grid grid-cols-2 gap-3">
                  <button
                    v-for="opt in [
                      { value: 'open', icon: Check, label: 'เปิดรับสมัคร', desc: 'เผยแพร่ทันที' },
                      { value: 'draft', icon: NotebookPen, label: 'บันทึกแบบร่าง', desc: 'ยังไม่เผยแพร่' },
                    ]"
                    :key="opt.value"
                    type="button"
                    class="flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left"
                    :class="status === opt.value
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-stone-100 bg-white hover:border-stone-200'"
                    @click="status = opt.value as Status"
                  >
                    <!-- icon -->
                    <component :is="opt.icon" class="w-5 h-5 text-emerald-600 shrink-0" />

                    <!-- text -->
                    <div>
                      <p class="text-sm font-semibold text-stone-800">
                        {{ opt.label }}
                      </p>
                      <p class="text-xs text-stone-400">
                        {{ opt.desc }}
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              <!-- Requirements -->
              <div class="flex flex-col gap-1.5">
                <label class="text-sm font-medium text-stone-700">คุณสมบัติผู้สมัคร <span class="text-stone-400 font-normal">(ไม่บังคับ)</span></label>
                <div class="flex flex-col gap-2 mb-1">
                  <div v-for="(req, i) in requirements" :key="i" class="flex items-center gap-2 text-sm text-stone-600 bg-blue-50 border border-blue-100 px-3 py-2 rounded-xl">
                    <svg class="w-4 h-4 text-blue-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span class="flex-1">{{ req }}</span>
                    <button type="button" class="text-stone-400 hover:text-red-400" @click="requirements.splice(i, 1)">×</button>
                  </div>
                </div>
                <div class="flex gap-2">
                  <input v-model="requirementInput" type="text" placeholder="เช่น สุขภาพแข็งแรง"
                    class="flex-1 px-4 py-2.5 text-sm border border-stone-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 placeholder:text-stone-300"
                    @keyup.enter="addRequirement"/>
                  <button type="button" class="px-4 py-2.5 text-sm bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-xl transition-colors"
                    @click="addRequirement">เพิ่ม</button>
                </div>
              </div>

              <!-- What to bring -->
              <div class="flex flex-col gap-1.5">
                <label class="text-sm font-medium text-stone-700">สิ่งที่ต้องเตรียม <span class="text-stone-400 font-normal">(ไม่บังคับ)</span></label>
                <div class="flex flex-col gap-2 mb-1">
                  <div v-for="(item, i) in whatToBring" :key="i" class="flex items-center gap-2 text-sm text-stone-600 bg-amber-50 border border-amber-100 px-3 py-2 rounded-xl">
                    <svg class="w-4 h-4 text-amber-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"/>
                    </svg>
                    <span class="flex-1">{{ item }}</span>
                    <button type="button" class="text-stone-400 hover:text-red-400" @click="whatToBring.splice(i, 1)">×</button>
                  </div>
                </div>
                <div class="flex gap-2">
                  <input v-model="bringInput" type="text" placeholder="เช่น รองเท้าแตะ, ขวดน้ำ"
                    class="flex-1 px-4 py-2.5 text-sm border border-stone-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 placeholder:text-stone-300"
                    @keyup.enter="addBring"/>
                  <button type="button" class="px-4 py-2.5 text-sm bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-xl transition-colors"
                    @click="addBring">เพิ่ม</button>
                </div>
              </div>
            </div>

            <!-- Navigation buttons -->
            <div class="flex items-center justify-between mt-8 pt-6 border-t border-stone-100">
              <button v-if="step > 1" type="button"
                class="flex items-center gap-2 text-sm text-stone-500 hover:text-stone-700 border border-stone-200 hover:bg-stone-50 px-5 py-2.5 rounded-xl transition-colors"
                @click="prevStep">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/>
                </svg>
                ย้อนกลับ
              </button>
              <div v-else/>

              <button v-if="step < 3" type="button"
                class="flex items-center gap-2 text-sm bg-stone-900 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl transition-colors"
                @click="nextStep">
                ถัดไป
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/>
                </svg>
              </button>

              <button v-else type="button" :disabled="loading"
                class="flex items-center gap-2 text-sm bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white px-6 py-2.5 rounded-xl transition-colors"
                @click="handleSubmit">
                <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                {{ loading ? 'กำลังสร้าง...' : 'สร้างกิจกรรม' }}
              </button>
            </div>
          </div>

          <!-- ── Preview sidebar ─────────────────────── -->
          <div class="lg:w-64 shrink-0">
            <div class="sticky top-24">
              <p class="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">ตัวอย่างการ์ด</p>
              <div class="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
                <!-- Cover preview -->
                <div class="relative h-36 bg-stone-100 overflow-hidden">
                  <img v-if="coverPreview" :src="coverPreview" class="w-full h-full object-cover"/>
                  <div v-else class="w-full h-full flex items-center justify-center text-stone-300">
                    <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909"/>
                    </svg>
                  </div>
                  <!-- Category badge -->
                  <div v-if="category" class="absolute top-2 left-2">
                    <span class="text-xs font-medium px-2 py-0.5 rounded-full"
                      :class="categoryColor[category] ?? 'bg-stone-100 text-stone-500'">
                      {{ category }}
                    </span>
                  </div>
                  <!-- Hours badge -->
                  <div v-if="hours" class="absolute top-2 right-2">
                    <span class="text-xs font-medium bg-stone-900/70 text-white px-2 py-0.5 rounded-full">
                      {{ hours }} ชม.
                    </span>
                  </div>
                </div>

                <div class="p-4">
                  <p class="text-sm font-semibold text-stone-800 leading-snug mb-1">
                    {{ title || 'ชื่อกิจกรรม' }}
                  </p>
                  <p class="text-xs text-stone-400 mb-3">จัดโดย ผู้จัดกิจกรรม</p>

                  <div class="flex flex-col gap-1.5 text-xs text-stone-500">
                    <span v-if="date || location" class="flex items-center gap-1.5">
                      <svg class="w-3.5 h-3.5 shrink-0 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/>
                      </svg>
                      {{ location || '—' }}
                    </span>
                    <span v-if="date" class="flex items-center gap-1.5">
                      <svg class="w-3.5 h-3.5 shrink-0 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25"/>
                      </svg>
                      {{ new Date(date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }) }}
                    </span>
                  </div>

                  <!-- Slots bar -->
                  <div v-if="slots" class="mt-3">
                    <div class="flex justify-between text-xs text-stone-400 mb-1">
                      <span>ที่นั่ง</span>
                      <span>{{ slots }} คน</span>
                    </div>
                    <div class="h-1.5 bg-stone-100 rounded-full">
                      <div class="h-full w-0 bg-emerald-400 rounded-full"/>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Progress -->
              <div class="mt-4 p-4 bg-white rounded-2xl border border-stone-100">
                <p class="text-xs font-semibold text-stone-500 mb-3">ความคืบหน้า</p>
                <div class="flex flex-col gap-2">
                  <div v-for="(label, i) in stepLabels" :key="i" class="flex items-center gap-2 text-xs"
                    :class="step > i + 1 ? 'text-emerald-600' : step === i + 1 ? 'text-stone-800 font-medium' : 'text-stone-400'">
                    <svg v-if="step > i + 1" class="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
                    </svg>
                    <span v-else class="w-3.5 h-3.5 shrink-0 rounded-full border flex items-center justify-center text-[9px]"
                      :class="step === i + 1 ? 'border-stone-800 text-stone-800' : 'border-stone-300'">
                      {{ i + 1 }}
                    </span>
                    {{ label }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>