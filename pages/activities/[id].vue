<script setup lang="ts">
import { ref, computed } from 'vue'
import { CalendarDays, AlarmClock, Pin, UserStar, LaptopMinimalCheck } from 'lucide-vue-next'

const route = useRoute()
const id = computed(() => Number(route.params.id))

// ── Mock Data (เหมือนกับ activities.vue) ─────────────────────────────────
const allActivities = [
  {
    id:1, title:'ปลูกป่าชายเลน บางปู', organizer:'มูลนิธิสิ่งแวดล้อมไทย',
    category:'สิ่งแวดล้อม', location:'สมุทรปราการ', date:'2025-04-12', time:'08:00',
    hours:6, slots:30, slotsLeft:8, status:'เปิดรับสมัคร',
    img:'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200',
    tags:['ธรรมชาติ','ปลูกต้นไม้'],
    description:'ร่วมกันปลูกป่าชายเลนเพื่อฟื้นฟูระบบนิเวศชายฝั่งและเป็นแหล่งอนุบาลสัตว์น้ำ กิจกรรมนี้เหมาะสำหรับทุกวัย ไม่ต้องมีประสบการณ์มาก่อน มีเจ้าหน้าที่คอยแนะนำตลอด เราจะแบ่งกลุ่มปลูกต้นโกงกางและต้นแสมในพื้นที่ชายฝั่งที่ถูกกัดเซาะ',
    requirements:['อายุ 12 ปีขึ้นไป','สุขภาพแข็งแรง','ไม่ต้องมีประสบการณ์'],
    items:['รองเท้าบูท (มีให้ยืม)','เสื้อผ้าไม่กลัวเปื้อน','หมวก/ครีมกันแดด','น้ำดื่ม'],
    schedule:[
      {time:'08:00', title:'ลงทะเบียน', desc:'ศูนย์อนุรักษ์ป่าชายเลนบางปู'},
      {time:'08:30', title:'ปฐมนิเทศ', desc:'เรียนรู้ระบบนิเวศและวิธีปลูก'},
      {time:'09:00', title:'ลงมือปลูก', desc:'แบ่งกลุ่มปลูกต้นโกงกาง ต้นแสม'},
      {time:'12:00', title:'พักอาหารกลางวัน', desc:'มื้อกลางวันจัดเตรียมให้'},
      {time:'14:30', title:'สรุปและรับใบรับรอง', desc:'รับใบรับรองชั่วโมงจิตอาสา'},
    ],
    contactName:'คุณสมศรี มีสุข', contactEmail:'info@thaienv.org', contactPhone:'02-xxx-xxxx',
  },
  {
    id:2, title:'เก็บขยะชายหาดบางแสน', organizer:'กลุ่มรักษ์ทะเล',
    category:'สิ่งแวดล้อม', location:'ชลบุรี', date:'2025-04-20', time:'07:00',
    hours:4, slots:50, slotsLeft:22, status:'เปิดรับสมัคร',
    img:'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200',
    tags:['ทะเล','ทำความสะอาด'],
    description:'ร่วมเก็บขยะบนชายหาดบางแสนเพื่อรักษาความสวยงามและระบบนิเวศทางทะเล ลดปัญหาขยะพลาสติกในทะเลไทย กิจกรรมเหมาะสำหรับทุกวัย',
    requirements:['ทุกวัย (เด็กต้องมีผู้ปกครอง)','พร้อมทำงานกลางแจ้ง'],
    items:['ถุงมือ (มีแจก)','รองเท้าเดินทราย','น้ำดื่ม','ครีมกันแดด'],
    schedule:[
      {time:'07:00', title:'ลงทะเบียน', desc:'หน้าหาดบางแสน'},
      {time:'07:30', title:'แจกอุปกรณ์', desc:'รับถุงและแผนที่โซน'},
      {time:'08:00', title:'เริ่มเก็บขยะ', desc:'แบ่งโซนตามชายหาด'},
      {time:'11:00', title:'ชั่งและสรุป', desc:'รับใบรับรอง'},
    ],
    contactName:'คุณวิชัย ทะเลสวย', contactEmail:'raktak@gmail.com', contactPhone:'08x-xxx-xxxx',
  },
  {
    id:3, title:'แจกอาหารผู้สูงอายุ', organizer:'วัดโพธิ์ท่าเตียน',
    category:'สังคม', location:'กรุงเทพฯ', date:'2025-04-15', time:'08:00',
    hours:3, slots:20, slotsLeft:0, status:'เต็ม',
    img:'https://planet-barcode.co.th/wp-content/uploads/2020/05/Screenshot_12.png?w=1200',
    tags:['อาหาร','ผู้สูงอายุ'],
    description:'ช่วยเตรียมและแจกอาหารให้กับผู้สูงอายุในชุมชนรอบวัดโพธิ์ กิจกรรมนี้ทำทุกเดือนเป็นประจำ สร้างรอยยิ้มให้ผู้สูงวัยในชุมชน',
    requirements:['อายุ 16 ปีขึ้นไป','มีจิตใจบริการ'],
    items:['เสื้อผ้าสุภาพ'],
    schedule:[
      {time:'08:00', title:'ลงทะเบียน', desc:'ศาลาวัดโพธิ์'},
      {time:'08:30', title:'เตรียมอาหาร', desc:'จัดแบ่งและบรรจุ'},
      {time:'10:00', title:'แจกอาหาร', desc:'เดินแจกในชุมชน'},
      {time:'11:00', title:'สรุป', desc:'รับใบรับรอง'},
    ],
    contactName:'พระอาจารย์สมชาย', contactEmail:'watpho@example.com', contactPhone:'02-xxx-xxxx',
  },
  {
    id:4, title:'สอนหนังสือเด็กชายขอบ', organizer:'โรงเรียนบ้านดอยสูง',
    category:'การศึกษา', location:'เชียงราย', date:'2025-05-01', time:'07:00',
    hours:8, slots:10, slotsLeft:3, status:'เปิดรับสมัคร',
    img:'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200',
    tags:['เด็ก','การศึกษา'],
    description:'อาสาสมัครสอนหนังสือให้กับเด็กๆ ในพื้นที่ห่างไกลบนดอย ต้องการครูอาสาสำหรับทุกวิชา เด็กๆ ที่นี่มีความกระตือรือร้นในการเรียนรู้แต่ขาดโอกาส',
    requirements:['จบ ม.6 ขึ้นไป','มีความอดทน','ค้างคืนได้ 2 คืน'],
    items:['สื่อการสอน (มีให้)','เสื้อผ้าอบอุ่น','ยาส่วนตัว'],
    schedule:[
      {time:'07:00', title:'ออกเดินทาง', desc:'สถานีขนส่งเชียงราย'},
      {time:'10:00', title:'ถึงโรงเรียน', desc:'เตรียมห้องเรียน'},
      {time:'13:00', title:'เริ่มสอน', desc:'ตามวิชาที่ถนัด'},
      {time:'17:00', title:'กิจกรรมเย็น', desc:'กีฬาและสันทนาการ'},
    ],
    contactName:'ผอ.สมบัติ ดอยสูง', contactEmail:'school@doysung.ac.th', contactPhone:'053-xxx-xxxx',
  },
  {
    id:5, title:'ติวสอบ O-NET ฟรี', organizer:'เครือข่ายครูอาสา',
    category:'การศึกษา', location:'ออนไลน์', date:'2025-04-28', time:'09:00',
    hours:5, slots:100, slotsLeft:67, status:'เปิดรับสมัคร',
    img:'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1200',
    tags:['ออนไลน์','นักเรียน'],
    description:'ติวสอบ O-NET ฟรีผ่าน Zoom สำหรับนักเรียนชั้น ม.6 ครอบคลุมทุกวิชา โดยครูอาสาจากทั่วประเทศ เน้นโจทย์ที่ออกบ่อยและเทคนิคทำข้อสอบ',
    requirements:['นักเรียน ม.6 หรือผู้สนใจ','มีอินเทอร์เน็ต'],
    items:['คอมพิวเตอร์/มือถือ','สมุดจดโน้ต','ลิงก์ Zoom (ส่งทางอีเมล)'],
    schedule:[
      {time:'09:00', title:'เข้า Zoom', desc:'เปิด Room ก่อน 10 นาที'},
      {time:'09:30', title:'ติวภาษาไทย', desc:'เทคนิคการอ่านข้อสอบ'},
      {time:'11:00', title:'ติวคณิต', desc:'โจทย์ที่ออกบ่อย'},
      {time:'13:00', title:'ติววิทย์', desc:'สรุปเนื้อหาทำแบบทดสอบ'},
    ],
    contactName:'คุณครูอาสา', contactEmail:'volunteer.teacher@gmail.com', contactPhone:'ติดต่อผ่านอีเมล',
  },
  {
    id:6, title:'ตรวจสุขภาพฟรีชุมชน', organizer:'โรงพยาบาลชุมชน',
    category:'สุขภาพ', location:'นครราชสีมา', date:'2025-05-10', time:'07:30',
    hours:6, slots:40, slotsLeft:18, status:'เปิดรับสมัคร',
    img:'https://images.unsplash.com/photo-1584515933487-779824d29309?w=1200',
    tags:['สุขภาพ','ชุมชน'],
    description:'อาสาช่วยงานตรวจสุขภาพฟรีสำหรับชาวบ้านในชุมชน งานได้แก่ ลงทะเบียน จัดเอกสาร ดูแลผู้รับบริการ และช่วยเจ้าหน้าที่ทางการแพทย์',
    requirements:['อายุ 18 ปีขึ้นไป','พื้นฐานสาธารณสุขจะดีมาก'],
    items:['เสื้อผ้าสุภาพ','รองเท้าสุภาพ'],
    schedule:[
      {time:'07:30', title:'ลงทะเบียนอาสา', desc:'โรงพยาบาลชุมชน'},
      {time:'08:00', title:'เริ่มให้บริการ', desc:'ลงทะเบียนและจัดคิว'},
      {time:'12:00', title:'พักเที่ยง', desc:'อาหารจัดให้'},
      {time:'13:00', title:'รอบบ่าย', desc:'ดำเนินการต่อจนเสร็จ'},
    ],
    contactName:'พยาบาลวิชัย', contactEmail:'hospital@korat.go.th', contactPhone:'044-xxx-xxxx',
  },
  {
    id:7, title:'ช่วยงานวัดมหาธาตุ', organizer:'วัดมหาธาตุ',
    category:'งานบุญ', location:'กรุงเทพฯ', date:'2025-05-18', time:'06:00',
    hours:5, slots:25, slotsLeft:12, status:'เปิดรับสมัคร',
    img:'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=1200',
    tags:['วัด','งานบุญ'],
    description:'ช่วยงานบุญใหญ่ประจำปีของวัดมหาธาตุ งานรวมถึงการต้อนรับแขก จัดสถานที่ ดูแลความเรียบร้อย และช่วยงานพิธีต่างๆ',
    requirements:['แต่งกายสุภาพ','รักษาความสงบ'],
    items:['ชุดขาวหรือชุดสุภาพ'],
    schedule:[
      {time:'06:00', title:'ลงทะเบียน', desc:'ประตูหน้าวัด'},
      {time:'07:00', title:'เตรียมสถานที่', desc:'จัดดอกไม้ ธูปเทียน'},
      {time:'09:00', title:'พิธีเริ่ม', desc:'ดูแลแขกและความเรียบร้อย'},
      {time:'11:00', title:'เสร็จสิ้น', desc:'เก็บสถานที่'},
    ],
    contactName:'คุณธรรมศักดิ์', contactEmail:'watmahathat@example.com', contactPhone:'02-xxx-xxxx',
  },
  {
    id:8, title:'อ่านหนังสือให้ผู้ตาบอด', organizer:'มูลนิธิคนตาบอด',
    category:'สังคม', location:'ออนไลน์', date:'2025-05-05', time:'10:00',
    hours:2, slots:15, slotsLeft:9, status:'เปิดรับสมัคร',
    img:'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1200',
    tags:['ออนไลน์','การอ่าน'],
    description:'อาสาอ่านหนังสือ บทความ หรือเอกสารให้ผู้พิการทางสายตาผ่านระบบออนไลน์ งานยืดหยุ่น ทำได้จากที่บ้าน',
    requirements:['เสียงชัดเจน','ไมโครโฟนดี','อ่านไทยคล่อง'],
    items:['คอมพิวเตอร์/มือถือ','ไมโครโฟน','อินเทอร์เน็ตเสถียร'],
    schedule:[
      {time:'10:00', title:'เข้าระบบ', desc:'Log in ระบบอ่านหนังสือ'},
      {time:'10:15', title:'เริ่มอ่าน', desc:'ตามหัวข้อที่ได้รับ'},
      {time:'12:00', title:'สิ้นสุด', desc:'ส่งไฟล์และรับชั่วโมง'},
    ],
    contactName:'คุณปรีชา', contactEmail:'blind@foundation.or.th', contactPhone:'02-xxx-xxxx',
  },
  {
    id:9, title:'ปลูกผักสวนครัวโรงเรียน', organizer:'โรงเรียนวัดราษฎร์',
    category:'การศึกษา', location:'ปทุมธานี', date:'2025-05-22', time:'08:30',
    hours:4, slots:20, slotsLeft:14, status:'เปิดรับสมัคร',
    img:'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200',
    tags:['เกษตร','เด็ก'],
    description:'ช่วยสร้างสวนผักอินทรีย์ในโรงเรียนเพื่อสอนเด็กๆ เรื่องการปลูกผักและโภชนาการ เป็นการเรียนรู้นอกห้องเรียนที่สนุกและมีประโยชน์',
    requirements:['ทุกวัย','ไม่กลัวเปื้อนดิน'],
    items:['เสื้อผ้าเก่า','รองเท้าเปื้อนได้','ถุงมือ (มีแจก)'],
    schedule:[
      {time:'08:30', title:'ลงทะเบียน', desc:'โรงเรียนวัดราษฎร์'},
      {time:'09:00', title:'เตรียมดิน', desc:'ผสมดินและเตรียมแปลง'},
      {time:'10:30', title:'ปลูกผัก', desc:'ร่วมกับนักเรียน'},
      {time:'12:00', title:'อาหารกลางวัน', desc:'จัดให้'},
    ],
    contactName:'ผอ.สุนันท์', contactEmail:'school@watras.ac.th', contactPhone:'02-xxx-xxxx',
  },
  {
    id:10, title:'ทำความสะอาดคลองแสนแสบ', organizer:'กลุ่มอาสาคลองสะอาด',
    category:'สิ่งแวดล้อม', location:'กรุงเทพฯ', date:'2025-06-01', time:'06:30',
    hours:5, slots:60, slotsLeft:35, status:'เปิดรับสมัคร',
    img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200',
    tags:['คลอง','ทำความสะอาด'],
    description:'ร่วมทำความสะอาดคลองแสนแสบ เก็บขยะในน้ำและริมฝั่ง เพื่อคืนชีวิตให้คลองสายหลักของกรุงเทพฯ ใช้ทั้งทีมเรือและทีมริมฝั่ง',
    requirements:['อายุ 15 ปีขึ้นไป','ว่ายน้ำได้ (ทีมเรือ)'],
    items:['เสื้อชูชีพ (มีให้)','ถุงมือ (มีแจก)','เสื้อผ้าเก่า','ยาทากันยุง'],
    schedule:[
      {time:'06:30', title:'ลงทะเบียน', desc:'ท่าเรือแสนแสบ ประตูน้ำ'},
      {time:'07:00', title:'แบ่งกลุ่ม', desc:'ทีมเรือและทีมฝั่ง'},
      {time:'07:30', title:'เริ่มเก็บ', desc:'ทำงานตามโซน'},
      {time:'11:30', title:'สรุปผล', desc:'ชั่งขยะและถ่ายรูป'},
    ],
    contactName:'คุณสายน้ำ', contactEmail:'cleancanal@gmail.com', contactPhone:'08x-xxx-xxxx',
  },
  {
    id:11, title:'บริจาคโลหิต', organizer:'สภากาชาดไทย',
    category:'สุขภาพ', location:'กรุงเทพฯ', date:'2025-04-25', time:'08:00',
    hours:2, slots:200, slotsLeft:88, status:'เปิดรับสมัคร',
    img:'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200',
    tags:['โลหิต','สาธารณสุข'],
    description:'บริจาคโลหิตเพื่อช่วยชีวิตผู้ป่วย 1 ครั้งสามารถช่วยได้ถึง 3 ชีวิต จัดที่สภากาชาดไทย ถนนอังรีดูนังต์ บริจาคได้ทุก 3 เดือน',
    requirements:['อายุ 17–70 ปี','น้ำหนัก 45 กก.+','สุขภาพแข็งแรง'],
    items:['บัตรประชาชน','กินอาหารมาก่อน','ดื่มน้ำให้เพียงพอ'],
    schedule:[
      {time:'08:00', title:'ลงทะเบียน', desc:'อาคารเฉลิมพระเกียรติ'},
      {time:'08:30', title:'ตรวจสุขภาพ', desc:'วัดความดัน ตรวจเลือด'},
      {time:'09:00', title:'บริจาค', desc:'10–15 นาที'},
      {time:'09:30', title:'พักฟื้น', desc:'รับของว่างและพัก'},
    ],
    contactName:'ศูนย์บริจาคโลหิต', contactEmail:'blood@redcross.or.th', contactPhone:'02-256-4300',
  },
  {
    id:12, title:'สอนทักษะดิจิทัลผู้สูงอายุ', organizer:'มูลนิธิผู้สูงอายุไทย',
    category:'สังคม', location:'เชียงใหม่', date:'2025-03-10', time:'09:00',
    hours:4, slots:12, slotsLeft:0, status:'เสร็จสิ้น',
    img:'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200',
    tags:['ดิจิทัล','ผู้สูงอายุ'],
    description:'สอนสมาร์ทโฟนและแอปพื้นฐานให้ผู้สูงอายุ เช่น Line, Google Maps, PromptPay กิจกรรมนี้เสร็จสิ้นแล้ว ขอบคุณอาสาสมัครทุกท่าน',
    requirements:['อดทนสูง','อธิบายเรื่องยากได้ง่าย'],
    items:['แล็ปท็อปหรือแท็บเล็ต','สื่อการสอน (มีให้)'],
    schedule:[
      {time:'09:00', title:'ลงทะเบียน', desc:'ศูนย์ผู้สูงอายุเชียงใหม่'},
      {time:'09:30', title:'สอน Line', desc:'วิดีโอคอล สติกเกอร์'},
      {time:'11:00', title:'สอน Maps', desc:'ค้นหาเส้นทาง'},
      {time:'13:00', title:'สอน PromptPay', desc:'โอนเงินและความปลอดภัย'},
    ],
    contactName:'คุณนงนุช ใจดี', contactEmail:'elderly@foundation.or.th', contactPhone:'053-xxx-xxxx',
  },
]

const activity = computed(() => allActivities.find(a => a.id === id.value))

useHead(() => ({
  title: activity.value ? `${activity.value.title} — VolunteerSpace` : 'ไม่พบกิจกรรม',
}))

// ── Helpers ────────────────────────────────────────────────────────────────
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

function pct(slots: number, left: number) {
  return Math.round(((slots - left) / slots) * 100)
}

const canRegister = computed(() => activity.value?.status === 'เปิดรับสมัคร')

// ── Registration Modal ─────────────────────────────────────────────────────
const showModal  = ref(false)
const submitted  = ref(false)
const submitting = ref(false)

const form = ref({
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  foodAllergy: '',
  note: '',
  consent: false,
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

function openModal() {
  if (!canRegister.value) return
  form.value = { firstName:'', lastName:'', phone:'', email:'', foodAllergy:'', note:'', consent:false }
  errors.value = {}
  showModal.value = true
}

async function submitForm() {
  if (!validate()) return
  submitting.value = true
  await new Promise(r => setTimeout(r, 1000))
  submitting.value = false
  showModal.value = false
  submitted.value = true
}
</script>

<template>
  <div class="min-h-screen bg-stone-50">
    <AppHeader />
    <main class="pt-16">

      <!-- Not found -->
      <div v-if="!activity" class="max-w-xl mx-auto px-6 py-32 text-center">
        <p class="text-5xl mb-4">🔍</p>
        <h1 class="text-2xl font-bold text-stone-800 mb-2">ไม่พบกิจกรรมนี้</h1>
        <p class="text-stone-400 mb-6">ID ไม่ถูกต้องหรือกิจกรรมถูกลบแล้ว</p>
        <NuxtLink to="/activities" class="bg-emerald-600 text-white px-6 py-2.5 rounded-xl hover:bg-emerald-700 transition-colors text-sm font-medium">
          ← กลับไปหน้ากิจกรรม
        </NuxtLink>
      </div>

      <template v-else>

        <!-- ── Cover ─────────────────────────────────────── -->
        <div class="relative h-64 md:h-80 overflow-hidden">
          <img :src="activity.img" :alt="activity.title" class="w-full h-full object-cover"/>
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
              <span class="text-xs font-semibold px-2.5 py-1 rounded-full" :class="statusStyle[activity.status]">
                {{ activity.status }}
              </span>
            </div>
            <h1 class="text-2xl md:text-3xl font-bold text-white leading-tight">{{ activity.title }}</h1>
            <p class="text-white/60 mt-1 text-sm">โดย {{ activity.organizer }}</p>
          </div>
        </div>

        <!-- ── Body ──────────────────────────────────────── -->
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
                  <span v-for="tag in activity.tags" :key="tag" class="text-xs bg-stone-100 text-stone-500 px-2.5 py-1 rounded-full">#{{ tag }}</span>
                </div>
              </section>

              <!-- Key info grid -->
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">

                <!-- Date -->
                <div class="bg-white rounded-2xl border border-stone-100 p-4 flex flex-col gap-1">
                  <p class="text-xs text-stone-400 flex items-center gap-1">
                    <CalendarDays class="w-4 h-4" />
                    วันที่
                  </p>

                  <p class="text-sm font-semibold text-stone-800 leading-snug">
                    {{ new Date(activity.date).toLocaleDateString('th-TH',{day:'numeric',month:'short',year:'numeric'}) }}
                  </p>
                </div>

                <!-- Time -->
                <div class="bg-white rounded-2xl border border-stone-100 p-4 flex flex-col gap-1">
                  <p class="text-xs text-stone-400 flex items-center gap-1">
                    <AlarmClock class="w-4 h-4" />
                    เวลา
                  </p>

                  <p class="text-sm font-semibold text-stone-800">
                    {{ activity.time }} น.
                  </p>

                  <p class="text-xs text-stone-400">
                    {{ activity.hours }} ชั่วโมง
                  </p>
                </div>

                <!-- Location -->
                <div class="bg-white rounded-2xl border border-stone-100 p-4 flex flex-col gap-1">
                  <p class="text-xs text-stone-400 flex items-center gap-1">
                    <Pin class="w-4 h-4" />
                    สถานที่
                  </p>

                  <p class="text-sm font-semibold text-stone-800">
                    {{ activity.location }}
                  </p>
                </div>

                <!-- Volunteers -->
                <div class="bg-white rounded-2xl border border-stone-100 p-4 flex flex-col gap-1">
                  <p class="text-xs text-stone-400 flex items-center gap-1">
                    <UserStar class="w-4 h-4" />
                    อาสาสมัคร
                  </p>

                  <p
                    class="text-sm font-semibold"
                    :class="activity.slotsLeft===0 ? 'text-red-500' : 'text-emerald-600'"
                  >
                    {{ activity.slotsLeft }} / {{ activity.slots }}
                  </p>

                  <p class="text-xs text-stone-400">
                    ที่นั่งว่าง
                  </p>
                </div>

              </div>

              <!-- Schedule -->
              <section class="bg-white rounded-2xl border border-stone-100 p-6">
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
                      <p class="text-xs text-stone-400 mt-0.5">{{ item.desc }}</p>
                    </div>
                  </div>
                </div>
              </section>

              <!-- Requirements + Items -->
              <div class="grid sm:grid-cols-2 gap-4">
                <section class="bg-white rounded-2xl border border-stone-100 p-5">
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
                <section class="bg-white rounded-2xl border border-stone-100 p-5">
                  <h2 class="font-semibold text-stone-800 mb-3 flex items-center gap-2">
                    <span class="w-1 h-5 bg-amber-500 rounded-full inline-block"/>
                    สิ่งที่ต้องเตรียม
                  </h2>
                  <ul class="flex flex-col gap-2">
                    <li v-for="it in activity.items" :key="it" class="flex items-start gap-2 text-sm text-stone-600">
                      <svg class="w-4 h-4 text-amber-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      {{ it }}
                    </li>
                  </ul>
                </section>
              </div>

              <!-- Contact -->
              <section class="bg-white rounded-2xl border border-stone-100 p-5">
                <h2 class="font-semibold text-stone-800 mb-3 flex items-center gap-2">
                  <span class="w-1 h-5 bg-purple-500 rounded-full inline-block"/>
                  ติดต่อผู้จัด
                </h2>
                <div class="flex flex-col sm:flex-row gap-4 text-sm text-stone-600">
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/></svg>
                    {{ activity.contactName }}
                  </div>
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/></svg>
                    {{ activity.contactPhone }}
                  </div>
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/></svg>
                    {{ activity.contactEmail }}
                  </div>
                </div>
              </section>

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
                      <span class="font-semibold" :class="activity.slotsLeft===0?'text-red-500':activity.slotsLeft<=5?'text-amber-500':'text-emerald-600'">
                        {{ activity.slotsLeft }} ที่นั่งว่าง
                      </span>
                    </div>
                    <div class="h-2 bg-stone-100 rounded-full overflow-hidden">
                      <div class="h-full rounded-full transition-all"
                        :class="pct(activity.slots,activity.slotsLeft)>=90?'bg-red-400':pct(activity.slots,activity.slotsLeft)>=60?'bg-amber-400':'bg-emerald-500'"
                        :style="{width:`${pct(activity.slots,activity.slotsLeft)}%`}"/>
                    </div>
                    <p class="text-xs text-stone-400 mt-1">{{ pct(activity.slots,activity.slotsLeft) }}% จาก {{ activity.slots }} ที่นั่ง</p>
                  </div>

                  <div class="h-px bg-stone-100"/>

                  <!-- Info rows -->
                  <div class="flex flex-col gap-3 text-sm">

                    <!-- Date -->
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-lg bg-stone-50 flex items-center justify-center shrink-0">
                        <CalendarDays class="w-4 h-4 text-stone-500" />
                      </div>

                      <div>
                        <p class="text-xs text-stone-400">วันที่จัด</p>
                        <p class="font-medium text-stone-800">
                          {{ formatDate(activity.date) }}
                        </p>
                      </div>
                    </div>

                    <!-- Time -->
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-lg bg-stone-50 flex items-center justify-center shrink-0">
                        <AlarmClock class="w-4 h-4 text-stone-500" />
                      </div>

                      <div>
                        <p class="text-xs text-stone-400">เวลา / ระยะเวลา</p>
                        <p class="font-medium text-stone-800">
                          {{ activity.time }} น. · {{ activity.hours }} ชั่วโมง
                        </p>
                      </div>
                    </div>

                    <!-- Location -->
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-lg bg-stone-50 flex items-center justify-center shrink-0">
                        <Pin class="w-4 h-4 text-stone-500" />
                      </div>

                      <div>
                        <p class="text-xs text-stone-400">สถานที่</p>
                        <p class="font-medium text-stone-800">
                          {{ activity.location }}
                        </p>
                      </div>
                    </div>

                  </div>

                  <div class="h-px bg-stone-100"/>

                 <!-- Success state -->
                  <div
                    v-if="submitted"
                    class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center flex flex-col items-center"
                  >
                    <LaptopMinimalCheck class="w-8 h-8 text-emerald-600 mb-1" />

                    <p class="text-sm font-semibold text-emerald-800">
                      ลงทะเบียนสำเร็จ!
                    </p>

                    <p class="text-xs text-emerald-600 mt-0.5">
                      เราจะส่งรายละเอียดไปยังอีเมลของท่าน
                    </p>
                  </div>

                  <!-- CTA button -->
                  <button v-else
                    class="w-full py-3 rounded-xl font-semibold text-sm transition-all"
                    :class="canRegister
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm active:scale-[0.98]'
                      : 'bg-stone-100 text-stone-400 cursor-not-allowed'"
                    :disabled="!canRegister"
                    @click="openModal">
                    <span v-if="activity.status==='เปิดรับสมัคร'">ลงทะเบียนเป็นจิตอาสา</span>
                    <span v-else-if="activity.status==='เต็ม'">เต็มแล้ว ไม่สามารถสมัครได้</span>
                    <span v-else>กิจกรรมนี้เสร็จสิ้นแล้ว</span>
                  </button>

                  <p v-if="canRegister && !submitted" class="text-xs text-stone-400 text-center">ไม่มีค่าใช้จ่าย · กดเพื่อกรอกข้อมูล</p>
                </div>

                <!-- Organizer -->
                <div class="bg-white rounded-2xl border border-stone-100 p-5">
                  <p class="text-xs text-stone-400 uppercase tracking-wider mb-3 font-medium">ผู้จัดกิจกรรม</p>
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-stone-900 flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {{ activity.organizer.charAt(0) }}
                    </div>
                    <div>
                      <p class="text-sm font-medium text-stone-800">{{ activity.organizer }}</p>
                      <p class="text-xs text-stone-400">องค์กรจัดกิจกรรม</p>
                    </div>
                  </div>
                </div>

              </div>
            </aside>

          </div>
        </div>

        <!-- ══════════ MODAL ══════════ -->
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
              <!-- Backdrop -->
              <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="showModal=false"/>

              <!-- Dialog -->
              <Transition
                enter-active-class="transition duration-300"
                enter-from-class="translate-y-full sm:translate-y-4 opacity-0"
                enter-to-class="translate-y-0 opacity-100"
              >
                <div v-if="showModal" class="relative z-10 w-full sm:max-w-md bg-white sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">

                  <!-- Modal header -->
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

                  <!-- Form -->
                  <div class="flex-1 overflow-y-auto px-6 py-5">
                    <div class="flex flex-col gap-4">

                      <!-- ชื่อ + นามสกุล -->
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

                      <!-- เบอร์โทร -->
                      <div>
                        <label class="text-xs font-medium text-stone-600 mb-1.5 block">เบอร์โทรศัพท์ <span class="text-red-400">*</span></label>
                        <input v-model="form.phone" type="tel" placeholder="08x-xxx-xxxx"
                          class="w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition"
                          :class="errors.phone ? 'border-red-300 bg-red-50' : 'border-stone-200'"/>
                        <p v-if="errors.phone" class="text-xs text-red-400 mt-1">{{ errors.phone }}</p>
                      </div>

                      <!-- อีเมล -->
                      <div>
                        <label class="text-xs font-medium text-stone-600 mb-1.5 block">อีเมล <span class="text-red-400">*</span></label>
                        <input v-model="form.email" type="email" placeholder="your@email.com"
                          class="w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition"
                          :class="errors.email ? 'border-red-300 bg-red-50' : 'border-stone-200'"/>
                        <p v-if="errors.email" class="text-xs text-red-400 mt-1">{{ errors.email }}</p>
                      </div>

                      <!-- อาหารที่แพ้ -->
                      <div>
                        <label class="text-xs font-medium text-stone-600 mb-1.5 block">อาหารที่แพ้ / ข้อจำกัดด้านสุขภาพ</label>
                        <input v-model="form.foodAllergy" type="text" placeholder="เช่น แพ้อาหารทะเล, ถั่ว (ถ้าไม่มีใส่ -)"
                          class="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition"/>
                      </div>

                      <!-- หมายเหตุ -->
                      <div>
                        <label class="text-xs font-medium text-stone-600 mb-1.5 block">หมายเหตุ / ข้อมูลเพิ่มเติม</label>
                        <textarea v-model="form.note" rows="3" placeholder="ข้อมูลอื่นๆ ที่ต้องการแจ้งผู้จัด"
                          class="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition resize-none"/>
                      </div>

                      <!-- Consent -->
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

                  <!-- Footer -->
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

                </div>
              </Transition>
            </div>
          </Transition>
        </Teleport>

      </template>
    </main>
  </div>
</template>