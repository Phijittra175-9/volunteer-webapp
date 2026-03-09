// utils/supabase.ts
// VolunteerSpace — Supabase REST API Client (ไม่ใช้ npm package)

export const SUPABASE_URL = 'https://hgrpuxbusbzakcofqhkf.supabase.co'
export const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhncnB1eGJ1c2J6YWtjb2ZxaGtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4NTk1NjQsImV4cCI6MjA4ODQzNTU2NH0.5KmzWLRV1nhVakA6teGAnZLplXZzYgz7QV92F_gg1Fg' // 👈 เปลี่ยนตรงนี้

// =============================================
// Types
// =============================================

export interface User {
  id: string
  email: string
  full_name?: string
  phone?: string
  address?: string
  avatar_url?: string
  bio?: string
  role: 'volunteer' | 'organizer' | 'admin'
  skills?: string[]
  total_hours: number
  created_at: string
}

export interface Organization {
  id: string
  name: string
  description?: string
  logo_url?: string
  owner_id: string
  is_approved: boolean
  created_at: string
}

export interface Activity {
  id: number
  title: string
  description?: string
  category?: string
  tags?: string[]
  image_url?: string
  location?: string
  date?: string
  start_time?: string
  duration_hours?: number
  max_volunteers?: number
  current_volunteers: number
  requirements?: string[]
  what_to_bring?: string[]
  schedule?: { time: string; title: string; detail: string }[]
  contact_name?: string
  contact_phone?: string
  contact_email?: string
  status: 'draft' | 'pending' | 'approved' | 'cancelled'
  org_id?: string
  created_by?: string
  created_at: string
}

export interface Registration {
  id: string
  activity_id: number
  user_id: string
  first_name: string
  last_name: string
  phone: string
  email: string
  food_allergy?: string
  note?: string
  consent_accepted: boolean
  status: 'pending' | 'approved' | 'rejected' | 'completed'
  hours_earned?: number
  registered_at: string
  approved_at?: string
  approved_by?: string
}

export interface SiteStats {
  total_activities: number
  total_volunteers: number
  total_hours: number
  total_organizations: number
}

// =============================================
// Headers
// =============================================

export const getHeaders = (token?: string) => ({
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${token ?? SUPABASE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation',
})

// =============================================
// AUTH — จัดการ Login / Signup / Session
// =============================================

export const auth = {
  // สมัครสมาชิก
  async signUp(email: string, password: string) {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error_description ?? data.msg ?? 'Signup failed')
    return data
  },

  // เข้าสู่ระบบ
  async signIn(email: string, password: string) {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error_description ?? data.msg ?? 'Login failed')
    if (import.meta.client) {
      localStorage.setItem('sb_token', data.access_token)
      localStorage.setItem('sb_refresh', data.refresh_token)
    }
    return data
  },

  // ออกจากระบบ
  async signOut() {
    const token = auth.getToken()
    await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
      method: 'POST',
      headers: getHeaders(token ?? undefined),
    })
    if (import.meta.client) {
      localStorage.removeItem('sb_token')
      localStorage.removeItem('sb_refresh')
    }
  },

  // ดึง user ที่ login อยู่
async getUser() {
  const token = auth.getToken()
  if (!token) return null
  const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: getHeaders(token),
  })
  // ถ้า token หมดอายุให้ clear ออกเลย
  if (res.status === 401 || res.status === 403) {
    if (import.meta.client) {
      localStorage.removeItem('sb_token')
      localStorage.removeItem('sb_refresh')
    }
    return null
  }
  if (!res.ok) return null
  return res.json()
},

  // ดึง token จาก localStorage
  getToken(): string | null {
    return import.meta.client ? localStorage.getItem('sb_token') : null
  },

  // เช็คว่า login อยู่ไหม
  isLoggedIn(): boolean {
    return !!auth.getToken()
  },
}

// =============================================
// DB — จัดการข้อมูลใน Database
// =============================================

const db = {

  // =====================
  // USERS
  // =====================

  async getUserProfile(userId: string): Promise<User | null> {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/users?id=eq.${userId}&select=*`,
      { headers: getHeaders(auth.getToken() ?? undefined) }
    )
    const data = await res.json()
    return data[0] ?? null
  },

  async updateUserProfile(userId: string, payload: Partial<User>): Promise<User> {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/users?id=eq.${userId}`,
      {
        method: 'PATCH',
        headers: getHeaders(auth.getToken() ?? undefined),
        body: JSON.stringify(payload),
      }
    )
    const data = await res.json()
    return data[0]
  },

  // =====================
  // ACTIVITIES
  // =====================

  async getActivities(params?: {
    category?: string
    status?: string
    limit?: number
    offset?: number
  }): Promise<Activity[]> {
    const query = new URLSearchParams()
    query.set('select', '*')
    query.set('status', params?.status ? `eq.${params.status}` : 'eq.approved')
    if (params?.category) query.set('category', `eq.${params.category}`)
    if (params?.limit)    query.set('limit', String(params.limit))
    if (params?.offset)   query.set('offset', String(params.offset))
    query.set('order', 'date.asc')

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/activities?${query.toString()}`,
      { headers: getHeaders(auth.getToken() ?? undefined) }
    )
    return res.json()
  },

  async getActivityById(id: number): Promise<Activity | null> {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/activities?id=eq.${id}&select=*`,
      { headers: getHeaders(auth.getToken() ?? undefined) }
    )
    const data = await res.json()
    return data[0] ?? null
  },

  async createActivity(payload: Partial<Activity>): Promise<Activity> {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/activities`, {
      method: 'POST',
      headers: getHeaders(auth.getToken() ?? undefined),
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message ?? 'Create activity failed')
    return data[0]
  },

  async updateActivity(id: number, payload: Partial<Activity>): Promise<Activity> {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/activities?id=eq.${id}`,
      {
        method: 'PATCH',
        headers: getHeaders(auth.getToken() ?? undefined),
        body: JSON.stringify(payload),
      }
    )
    const data = await res.json()
    return data[0]
  },

  // Admin อนุมัติกิจกรรม
  async approveActivity(id: number): Promise<Activity> {
    return db.updateActivity(id, { status: 'approved' })
  },

  // ← เพิ่ม 4 functions นี้เข้าไป
  async rejectActivity(id: number): Promise<Activity> {
    return db.updateActivity(id, { status: 'cancelled' })
  },

  async getUsers(): Promise<User[]> {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/users?select=*&order=created_at.desc`,
      { headers: getHeaders(auth.getToken() ?? undefined) }
    )
    return res.json()
  },

  async updateUserRole(userId: string, role: 'volunteer' | 'organizer' | 'admin'): Promise<User> {
    return db.updateUserProfile(userId, { role })
  },

  async getPendingActivities(): Promise<Activity[]> {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/activities?status=eq.pending&select=*&order=created_at.desc`,
      { headers: getHeaders(auth.getToken() ?? undefined) }
    )
    return res.json()
  },

  async registerActivity(payload: {
    activity_id: number
    user_id: string
    first_name: string
    last_name: string
    phone: string
    email: string
    food_allergy?: string
    note?: string
    consent_accepted: boolean
  }): Promise<Registration> {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/registrations`, {
      method: 'POST',
      headers: getHeaders(auth.getToken() ?? undefined),
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message ?? 'Registration failed')
    return data[0]
  },

  // ดึงการลงทะเบียนของตัวเอง (รวมข้อมูล activity)
  async getMyRegistrations(userId: string): Promise<Registration[]> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/registrations?user_id=eq.${userId}&select=*,activities(*)&order=registered_at.desc`,
    { headers: getHeaders(auth.getToken() ?? undefined) }
  )
  if (!res.ok) return []
  const data = await res.json()
  return Array.isArray(data) ? data : []
},

  // Organizer ดูรายการรอการอนุมัติ
  async getPendingRegistrations(activityId: number): Promise<Registration[]> {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/registrations?activity_id=eq.${activityId}&status=eq.pending&select=*`,
      { headers: getHeaders(auth.getToken() ?? undefined) }
    )
    return res.json()
  },

  // Admin/Organizer อนุมัติจิตอาสา
  async approveRegistration(registrationId: string, approvedBy: string): Promise<Registration> {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/registrations?id=eq.${registrationId}`,
      {
        method: 'PATCH',
        headers: getHeaders(auth.getToken() ?? undefined),
        body: JSON.stringify({
          status: 'approved',
          approved_at: new Date().toISOString(),
          approved_by: approvedBy,
        }),
      }
    )
    const data = await res.json()
    return data[0]
  },

  // Admin/Organizer ปฏิเสธจิตอาสา
  async rejectRegistration(registrationId: string): Promise<Registration> {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/registrations?id=eq.${registrationId}`,
      {
        method: 'PATCH',
        headers: getHeaders(auth.getToken() ?? undefined),
        body: JSON.stringify({ status: 'rejected' }),
      }
    )
    const data = await res.json()
    return data[0]
  },

  // กิจกรรมเสร็จ + บันทึกชั่วโมง (trigger จะบวก total_hours อัตโนมัติ)
  async completeRegistration(registrationId: string, hoursEarned: number): Promise<Registration> {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/registrations?id=eq.${registrationId}`,
      {
        method: 'PATCH',
        headers: getHeaders(auth.getToken() ?? undefined),
        body: JSON.stringify({ status: 'completed', hours_earned: hoursEarned }),
      }
    )
    const data = await res.json()
    return data[0]
  },

  // =====================
  // STORAGE
  // =====================

  async uploadImage(file: File, bucket: string = 'activities'): Promise<string> {
    const ext = file.name.split('.').pop()
    const filename = `public/${Date.now()}.${ext}`
    const res = await fetch(
      `${SUPABASE_URL}/storage/v1/object/${bucket}/${filename}`,
      {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${auth.getToken() ?? SUPABASE_KEY}`,
          'Content-Type': file.type,
          'x-upsert': 'true',
        },
        body: file,
      }
    )
    if (!res.ok) throw new Error('Upload image failed')
    return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${filename}`
  },

  // =====================
  // SITE STATS
  // =====================

// =====================
  // SITE STATS
  // =====================

  // ดึงกิจกรรมที่ฉันสร้าง
  async getMyCreatedActivities(userId: string): Promise<Activity[]> {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/activities?created_by=eq.${userId}&select=*&order=created_at.desc`,
      { headers: getHeaders(auth.getToken() ?? undefined) }
    )
    return res.json()
  },

  // ดึง registrations ทั้งหมดของกิจกรรม (สำหรับ organizer)
  async getAllRegistrations(activityId: number): Promise<Registration[]> {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/registrations?activity_id=eq.${activityId}&select=*&order=registered_at.desc`,
      { headers: getHeaders(auth.getToken() ?? undefined) }
    )
    return res.json()
  },

  // ดึง stats หน้าแรก (trigger อัพเดตอัตโนมัติแล้ว)
  async getSiteStats(): Promise<SiteStats | null> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/site_stats?id=eq.1&select=*`,
    { headers: getHeaders(auth.getToken() ?? undefined) }  // ← เพิ่ม token
  )
  const data = await res.json()
  return data[0] ?? null
},
}

export default db
