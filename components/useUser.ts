import { BookSearch, Leaf, Users, BookOpen, HeartHandshake, HeartPulse } from 'lucide-vue-next'

export interface UserState {
  name: string
  email: string
  phone: string
  address: string
  avatar: string | null
  joinedDate: string
  bio: string
  skills: string[]
  interests: string[]
  totalHours: number
  totalActivities: number
  totalCreated: number
  badges: string[]
  isLoggedIn: boolean
}

const defaultUser = (): UserState => ({
  name: '',
  email: '',
  phone: '',
  address: '',
  avatar: null,
  joinedDate: new Date().toISOString().split('T')[0],
  bio: '',
  skills: [],
  interests: [],
  totalHours: 0,
  totalActivities: 0,
  totalCreated: 0,
  badges: [],
  isLoggedIn: false,
})

export function useUser() {
  const user = useState<UserState>('user', defaultUser)

  function register(data: Omit<UserState, 'joinedDate' | 'totalHours' | 'totalActivities' | 'totalCreated' | 'badges' | 'isLoggedIn'>) {
    user.value = {
      ...data,
      joinedDate: new Date().toISOString().split('T')[0],
      isLoggedIn: true,
      totalHours: 0,
      totalActivities: 0,
      totalCreated: 0,
      badges: ['มือใหม่'],
    }
  }

  function login(email: string) {
    user.value = {
      name: 'สมชาย ใจดี',
      email,
      phone: '081-234-5678',
      address: '123 ถ.สุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110',
      avatar: null,
      joinedDate: '2024-08-01',
      bio: 'ชอบช่วยเหลือสังคมและอนุรักษ์สิ่งแวดล้อม ทำกิจกรรมจิตอาสามาตั้งแต่ปี 2567',
      skills: ['สอนหนังสือ', 'ภาษาอังกฤษ', 'ถ่ายภาพ', 'ขับรถ', 'ปฐมพยาบาล'],
      interests: ['สิ่งแวดล้อม', 'การศึกษา', 'เด็กและเยาวชน', 'ผู้สูงอายุ'],
      totalHours: 38,
      totalActivities: 7,
      totalCreated: 2,
      badges: [' นักอนุรักษ์', ' ครูอาสา', ' Top Volunteer'],
      isLoggedIn: true,
    }
  }

  function logout() { user.value = defaultUser() }
  function update(patch: Partial<UserState>) { user.value = { ...user.value, ...patch } }

  return { user, register, login, logout, update }
}