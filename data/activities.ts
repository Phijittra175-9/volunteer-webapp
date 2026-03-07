export type Category = 'สิ่งแวดล้อม' | 'สังคม' | 'การศึกษา' | 'งานบุญ' | 'สุขภาพ'

export interface Activity {
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

export const activities: Activity[] = [
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
    img: 'https://images.unsplash.com/photo-1604881987921-df8d75ab4b8f?w=800',
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

export const stats = {
  totalActivities: 128,
  totalVolunteers: 4320,
  totalHours: 21500,
  totalOrganizers: 86,
}