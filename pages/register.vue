<script setup lang="ts">
import { ref } from 'vue'
import { useUser } from '~/components/useUser'
useHead({ title: 'สมัครสมาชิก — VolunteerSpace' })
import { HandHeart, Sparkles, CircleChevronRight, FileSpreadsheet, Star } from 'lucide-vue-next'

const { register } = useUser()

const step = ref(1)

// Step 1
const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirm = ref(false)
const avatarPreview = ref<string | null>(null)

// Step 2
const phone = ref('')
const address = ref('')
const bio = ref('')

// Step 3
const SKILL_OPTIONS = [
  'สอนหนังสือ', 'ภาษาอังกฤษ', 'ภาษาจีน', 'ถ่ายภาพ', 'ตัดต่อวิดีโอ',
  'ขับรถ', 'ปฐมพยาบาล', 'ดนตรี', 'กีฬา', 'ทำอาหาร',
  'งานช่าง', 'เกษตรกรรม', 'IT / คอมพิวเตอร์', 'กฎหมาย', 'บัญชี / การเงิน',
]
const INTEREST_OPTIONS = [
  'สิ่งแวดล้อม', 'การศึกษา', 'เด็กและเยาวชน', 'ผู้สูงอายุ',
  'ผู้พิการ', 'สัตว์', 'ชุมชน', 'สาธารณสุข', 'ศาสนา / วัฒนธรรม',
  'ภัยพิบัติ', 'ความยากจน', 'ออนไลน์',
]
const selectedSkills = ref<string[]>([])
const selectedInterests = ref<string[]>([])
const customSkill = ref('')
const customInterest = ref('')

function toggleSkill(s: string) {
  const i = selectedSkills.value.indexOf(s)
  i === -1 ? selectedSkills.value.push(s) : selectedSkills.value.splice(i, 1)
}
function toggleInterest(it: string) {
  const i = selectedInterests.value.indexOf(it)
  i === -1 ? selectedInterests.value.push(it) : selectedInterests.value.splice(i, 1)
}
function addCustomSkill() {
  const v = customSkill.value.trim()
  if (v && !selectedSkills.value.includes(v)) selectedSkills.value.push(v)
  customSkill.value = ''
}
function addCustomInterest() {
  const v = customInterest.value.trim()
  if (v && !selectedInterests.value.includes(v)) selectedInterests.value.push(v)
  customInterest.value = ''
}

const errors = ref<Record<string, string>>({})
const loading = ref(false)

function validateStep(n: number) {
  errors.value = {}
  if (n === 1) {
    if (!name.value.trim()) errors.value.name = 'กรุณากรอกชื่อ-นามสกุล'
    if (!email.value.includes('@')) errors.value.email = 'รูปแบบอีเมลไม่ถูกต้อง'
    if (password.value.length < 6) errors.value.password = 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'
    if (confirmPassword.value !== password.value) errors.value.confirm = 'รหัสผ่านไม่ตรงกัน'
  }
  return Object.keys(errors.value).length === 0
}
function nextStep() { if (validateStep(step.value)) step.value++ }
function prevStep() { errors.value = {}; step.value-- }

function onAvatarChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => { avatarPreview.value = reader.result as string }
  reader.readAsDataURL(file)
}

async function handleRegister() {
  loading.value = true
  await new Promise(r => setTimeout(r, 800))
  register({
    name: name.value, email: email.value,
    phone: phone.value, address: address.value, bio: bio.value,
    avatar: avatarPreview.value,
    skills: selectedSkills.value, interests: selectedInterests.value,
  })
  loading.value = false
  navigateTo('/profile')
}

const stepLabels = ['บัญชีผู้ใช้', 'ข้อมูลส่วนตัว', 'ทักษะ & ความสนใจ']
</script>

<template>
  <div class="min-h-screen flex">

    <!-- Left panel -->
    <div class="hidden lg:flex w-1/2 flex-col justify-between bg-emerald-600 p-14 text-white relative overflow-hidden">
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,#059669,#065f46)]" />
      <div class="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-emerald-500/20 rounded-full" />
      <div class="absolute top-10 -left-20 w-72 h-72 bg-emerald-700/20 rounded-full" />

      <!-- Logo -->
      <div class="relative flex items-center gap-2.5">

        <span class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
          <HandHeart class="w-6 h-6 text-white"/>
        </span>

        <span class="font-semibold text-xl tracking-tight">
          VolunteerSpace
        </span>

      </div>

      <div class="relative">
        <div class="text-5xl text-emerald-400/50 font-serif leading-none mb-4">"</div>
        <p class="text-3xl font-bold leading-snug mb-4">1 บัญชี<br/>ทำได้ทุกอย่าง</p>
        <div class="flex flex-col gap-2.5 mt-6">
          <div v-for="item in [
            { icon: CircleChevronRight, text: 'สมัครเข้าร่วมกิจกรรมจิตอาสา' },
            { icon: CircleChevronRight, text: 'สร้างและจัดการกิจกรรมเอง' },
            { icon: CircleChevronRight, text: 'สะสมชั่วโมงและเหรียญรางวัล' },
          ]" :key="item.text" class="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3">
             <component :is="item.icon" class="w-5 h-5 text-emerald-200 shrink-0" />
            <p class="text-sm text-emerald-100">{{ item.text }}</p>
          </div>
        </div>
      </div>

      <!-- Step progress -->
      <div class="relative flex flex-col gap-3">
        <div v-for="(label, i) in stepLabels" :key="i" class="flex items-center gap-3"
          :class="step > i + 1 ? 'opacity-100' : step === i + 1 ? 'opacity-100' : 'opacity-40'">
          <div class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
            :class="step > i + 1 ? 'bg-white text-emerald-600' : step === i + 1 ? 'bg-white/30 text-white ring-2 ring-white' : 'bg-white/10 text-white/60'">
            <svg v-if="step > i + 1" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
            </svg>
            <span v-else>{{ i + 1 }}</span>
          </div>
          <span class="text-sm" :class="step === i + 1 ? 'font-semibold text-white' : 'text-emerald-200'">{{ label }}</span>
        </div>
      </div>
    </div>

    <!-- Right panel -->
    <div class="flex-1 flex items-start justify-center bg-stone-50 px-8 py-12 overflow-y-auto min-h-screen">
      <div class="w-full max-w-[440px]">

        <NuxtLink to="/" class="inline-flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-700 transition-colors mb-8">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/>
          </svg>
          กลับหน้าแรก
        </NuxtLink>

        <!-- Mobile progress bar -->
        <div class="flex gap-1 mb-6 lg:hidden">
          <div v-for="i in 3" :key="i" class="h-1 flex-1 rounded-full transition-all"
            :class="step >= i ? 'bg-emerald-500' : 'bg-stone-200'"/>
        </div>

        <!-- ══ STEP 1 ══ -->
        <div v-if="step === 1">
          <h1 class="text-2xl font-bold text-stone-900 mb-1 flex items-center gap-2">
            สร้างบัญชีใหม่ 
            <Sparkles class="w-6 h-6 text-[#FFDB58]"/>
          </h1>
          <p class="text-sm text-stone-400 mb-6">ขั้นตอนที่ 1/3 · ตั้งค่าบัญชีของคุณ</p>

          <div class="flex flex-col gap-4">
            <!-- Avatar -->
            <div class="flex flex-col gap-1.5">
              <label class="text-sm font-medium text-stone-700">รูปโปรไฟล์ <span class="text-stone-400 font-normal">(ไม่บังคับ)</span></label>
              <div class="flex items-center gap-4">
                <div class="relative shrink-0">
                  <div class="w-16 h-16 rounded-2xl border-2 border-dashed border-stone-200 bg-stone-50 flex items-center justify-center overflow-hidden cursor-pointer hover:border-emerald-400 transition-colors"
                    @click="($refs.avatarInput as HTMLInputElement)?.click()">
                    <img v-if="avatarPreview" :src="avatarPreview" class="w-full h-full object-cover"/>
                    <svg v-else class="w-6 h-6 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
                    </svg>
                  </div>
                  <button v-if="avatarPreview" type="button"
                    class="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600 leading-none"
                    @click="avatarPreview = null">×</button>
                </div>
                <div class="flex-1 border-2 border-dashed border-stone-200 rounded-xl px-4 py-3 flex flex-col items-center gap-1 cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/50 transition-colors"
                  @click="($refs.avatarInput as HTMLInputElement)?.click()">
                  <svg class="w-5 h-5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/>
                  </svg>
                  <p class="text-xs text-stone-500 font-medium">คลิกเพื่ออัปโหลด</p>
                  <p class="text-xs text-stone-400">JPG, PNG ไม่เกิน 5MB</p>
                </div>
                <input ref="avatarInput" type="file" accept="image/*" class="hidden" @change="onAvatarChange"/>
              </div>
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="text-sm font-medium text-stone-700">ชื่อ-นามสกุล <span class="text-red-400">*</span></label>
              <input v-model="name" type="text" placeholder="สมชาย ใจดี"
                class="px-4 py-3 text-sm border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition placeholder:text-stone-300"
                :class="errors.name ? 'border-red-300' : 'border-stone-200'"/>
              <p v-if="errors.name" class="text-xs text-red-500">{{ errors.name }}</p>
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="text-sm font-medium text-stone-700">อีเมล <span class="text-red-400">*</span></label>
              <input v-model="email" type="email" placeholder="you@example.com"
                class="px-4 py-3 text-sm border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition placeholder:text-stone-300"
                :class="errors.email ? 'border-red-300' : 'border-stone-200'"/>
              <p v-if="errors.email" class="text-xs text-red-500">{{ errors.email }}</p>
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="text-sm font-medium text-stone-700">รหัสผ่าน <span class="text-red-400">*</span></label>
              <div class="relative">
                <input v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="อย่างน้อย 6 ตัวอักษร"
                  class="w-full px-4 py-3 pr-11 text-sm border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition placeholder:text-stone-300"
                  :class="errors.password ? 'border-red-300' : 'border-stone-200'"/>
                <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-stone-300 hover:text-stone-500 p-1" @click="showPassword = !showPassword">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178zM15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                </button>
              </div>
              <p v-if="errors.password" class="text-xs text-red-500">{{ errors.password }}</p>
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="text-sm font-medium text-stone-700">ยืนยันรหัสผ่าน <span class="text-red-400">*</span></label>
              <div class="relative">
                <input v-model="confirmPassword" :type="showConfirm ? 'text' : 'password'" placeholder="••••••••"
                  class="w-full px-4 py-3 pr-11 text-sm border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition placeholder:text-stone-300"
                  :class="errors.confirm ? 'border-red-300' : 'border-stone-200'"/>
                <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-stone-300 hover:text-stone-500 p-1" @click="showConfirm = !showConfirm">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178zM15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                </button>
              </div>
              <p v-if="errors.confirm" class="text-xs text-red-500">{{ errors.confirm }}</p>
            </div>
          </div>
        </div>

        <!-- ══ STEP 2 ══ -->
        <div v-else-if="step === 2">
          <div class="flex items-center gap-2 mb-1">
            <h1 class="text-2xl font-bold text-stone-900">ข้อมูลส่วนตัว</h1>
            <FileSpreadsheet class="w-6 h-6 text-emerald-600" />
          </div>

          <p class="text-sm text-stone-400 mb-6">
            ขั้นตอนที่ 2/3 · กรอกหรือข้ามได้ แก้ไขภายหลังได้เสมอ
          </p>

          <div class="flex flex-col gap-4">

            <!-- phone -->
            <div class="flex flex-col gap-1.5">
              <label class="text-sm font-medium text-stone-700">เบอร์โทรศัพท์</label>
              <input
                v-model="phone"
                type="tel"
                placeholder="081-234-5678"
                class="px-4 py-3 text-sm border border-stone-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition placeholder:text-stone-300"
              />
            </div>

            <!-- address -->
            <div class="flex flex-col gap-1.5">
              <label class="text-sm font-medium text-stone-700">ที่อยู่</label>
              <textarea
                v-model="address"
                rows="3"
                placeholder="123 ถ.สุขุมวิท แขวงคลองเตย กรุงเทพฯ 10110"
                class="px-4 py-3 text-sm border border-stone-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition resize-none placeholder:text-stone-300"
              ></textarea>
            </div>

            <!-- bio -->
            <div class="flex flex-col gap-1.5">
              <label class="text-sm font-medium text-stone-700">แนะนำตัวสั้นๆ</label>
              <textarea
                v-model="bio"
                rows="3"
                placeholder="เล่าให้ฟังหน่อยว่าทำไมถึงอยากทำจิตอาสา..."
                class="px-4 py-3 text-sm border border-stone-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition resize-none placeholder:text-stone-300"
              ></textarea>

              <p class="text-xs text-stone-400 self-end">
                {{ bio ? bio.length : 0 }} ตัวอักษร
              </p>
            </div>

          </div>
        </div>

        <!-- ══ STEP 3 ══ -->
        <div v-else-if="step === 3">

          <div class="flex items-center gap-2 mb-1">
            <h1 class="text-2xl font-bold text-stone-900">ทักษะ & ความสนใจ</h1>
            <Star class="w-6 h-6 text-amber-500" />
          </div>

          <p class="text-sm text-stone-400 mb-6">
            ขั้นตอนที่ 3/3 · เลือกได้หลายข้อ ช่วยจับคู่กิจกรรมได้ดีขึ้น
          </p>

          <!-- skills -->
          <div class="mb-6">
            <div class="flex items-center justify-between mb-2">
              <label class="text-sm font-medium text-stone-700">ทักษะของคุณ</label>
              <span class="text-xs text-emerald-600 font-medium">
                {{ selectedSkills.length }} ทักษะ
              </span>
            </div>

            <div class="flex flex-wrap gap-2 mb-3">
              <button
                v-for="s in SKILL_OPTIONS"
                :key="s"
                type="button"
                class="text-xs px-3 py-1.5 rounded-full border transition-all"
                :class="selectedSkills.includes(s)
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-emerald-300'"
                @click="toggleSkill(s)"
              >
                {{ s }}
              </button>
            </div>

            <div class="flex gap-2">
              <input
                v-model="customSkill"
                type="text"
                placeholder="เพิ่มทักษะอื่นๆ..."
                class="flex-1 px-3 py-2 text-sm border border-stone-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 placeholder:text-stone-300"
                @keyup.enter="addCustomSkill"
              />
              <button
                type="button"
                class="px-3 py-2 text-sm bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-xl"
                @click="addCustomSkill"
              >
                + เพิ่ม
              </button>
            </div>

            <div
              v-if="selectedSkills.some(s => !SKILL_OPTIONS.includes(s))"
              class="flex flex-wrap gap-1.5 mt-2"
            >
              <span
                v-for="s in selectedSkills.filter(s => !SKILL_OPTIONS.includes(s))"
                :key="s"
                class="inline-flex items-center gap-1 text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full"
              >
                {{ s }}
                <button type="button" class="hover:text-red-500" @click="toggleSkill(s)">
                  ×
                </button>
              </span>
            </div>
          </div>

          <!-- interests -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="text-sm font-medium text-stone-700">
                ประเภทกิจกรรมที่สนใจ
              </label>
              <span class="text-xs text-amber-600 font-medium">
                {{ selectedInterests.length }} ประเภท
              </span>
            </div>

            <div class="flex flex-wrap gap-2 mb-3">
              <button
                v-for="it in INTEREST_OPTIONS"
                :key="it"
                type="button"
                class="text-xs px-3 py-1.5 rounded-full border transition-all"
                :class="selectedInterests.includes(it)
                  ? 'bg-amber-500 text-white border-amber-500'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-amber-300'"
                @click="toggleInterest(it)"
              >
                {{ it }}
              </button>
            </div>

            <div class="flex gap-2">
              <input
                v-model="customInterest"
                type="text"
                placeholder="เพิ่มความสนใจอื่นๆ..."
                class="flex-1 px-3 py-2 text-sm border border-stone-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 placeholder:text-stone-300"
                @keyup.enter="addCustomInterest"
              />
              <button
                type="button"
                class="px-3 py-2 text-sm bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-xl"
                @click="addCustomInterest"
              >
                + เพิ่ม
              </button>
            </div>

            <div
              v-if="selectedInterests.some(i => !INTEREST_OPTIONS.includes(i))"
              class="flex flex-wrap gap-1.5 mt-2"
            >
              <span
                v-for="it in selectedInterests.filter(i => !INTEREST_OPTIONS.includes(i))"
                :key="it"
                class="inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full"
              >
                {{ it }}
                <button type="button" class="hover:text-red-500" @click="toggleInterest(it)">
                  ×
                </button>
              </span>
            </div>
          </div>

        </div>

        <!-- Navigation -->
        <div class="flex items-center justify-between mt-8 gap-3">
          <button v-if="step > 1" type="button"
            class="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-700 border border-stone-200 hover:bg-stone-50 px-4 py-2.5 rounded-xl transition-colors"
            @click="prevStep">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/>
            </svg>
            ย้อนกลับ
          </button>
          <div v-else/>

          <button v-if="step < 3" type="button"
            class="flex items-center gap-2 text-sm bg-stone-900 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl transition-colors ml-auto"
            @click="nextStep">
            ถัดไป
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/>
            </svg>
          </button>

          <div v-else class="flex flex-col items-end gap-2 ml-auto">
            <button type="button" :disabled="loading"
              class="flex items-center gap-2 text-sm bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white px-6 py-3 rounded-xl transition-colors"
              @click="handleRegister">
              <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              {{ loading ? 'กำลังสร้างบัญชี...' : 'สร้างบัญชี ' }}
            </button>
            <button type="button" class="text-xs text-stone-400 hover:text-stone-600 underline underline-offset-2"
              @click="handleRegister">ข้ามและสร้างบัญชีเลย</button>
          </div>
        </div>

        <p class="text-center text-sm text-stone-500 mt-6">
          มีบัญชีแล้ว?
          <NuxtLink to="/login" class="text-emerald-600 font-medium hover:underline ml-1">เข้าสู่ระบบ</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>