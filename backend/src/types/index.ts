export type UserRole = 'student' | 'instructor' | 'admin'
export type CourseStatus = 'draft' | 'published' | 'archived'
export type CourseLevel = 'beginner' | 'intermediate' | 'advanced'
export type EnrollmentStatus = 'pending' | 'active' | 'completed' | 'cancelled' | 'suspended'
export type PaymentStatus = 'pending' | 'confirmed' | 'received' | 'overdue' | 'cancelled' | 'refunded'
export type PaymentMethod = 'pix' | 'boleto' | 'credit_card'
export type OSStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled'
export type OSPriority = 'low' | 'medium' | 'high' | 'urgent'
export type QuotationStatus = 'draft' | 'sent' | 'approved' | 'rejected' | 'expired'
export type EvaluationMetricType = 'theoretical' | 'practical' | 'behavioral'

export interface UserProfile {
  id: string
  email: string
  name: string
  role: UserRole
  phone?: string
  bio?: string
  avatar_url?: string
  asaas_customer_id?: string
  created_at: string
  updated_at: string
}

export interface Course {
  id: string
  title: string
  description: string
  full_description?: string
  price: number
  duration_hours: number
  level: CourseLevel
  status: CourseStatus
  thumbnail_url?: string
  instructor_id?: string
  min_attendance_percentage: number
  min_grade: number
  created_at: string
  updated_at: string
}

export interface Module {
  id: string
  course_id: string
  title: string
  order_index: number
  created_at: string
}

export interface Lesson {
  id: string
  module_id: string
  course_id: string
  title: string
  description?: string
  content?: string
  pdf_url?: string
  order_index: number
  duration_minutes?: number
  is_free_preview: boolean
  created_at: string
}

export interface Enrollment {
  id: string
  student_id: string
  course_id: string
  status: EnrollmentStatus
  enrolled_at: string
  completed_at?: string
}

export interface Payment {
  id: string
  student_id: string
  enrollment_id?: string
  asaas_payment_id: string
  asaas_customer_id: string
  amount: number
  payment_method: PaymentMethod
  status: PaymentStatus
  due_date: string
  paid_at?: string
  bank_slip_url?: string
  pix_code?: string
  description?: string
  installment_count: number
  created_at: string
}

export interface Certificate {
  id: string
  student_id: string
  course_id: string
  enrollment_id: string
  certificate_number: string
  issued_at: string
  pdf_url?: string
  revoked: boolean
  revoked_at?: string
  revoked_reason?: string
}

export interface EvaluationMetric {
  id: string
  course_id: string
  name: string
  description?: string
  max_score: number
  weight: number
  type: EvaluationMetricType
  order_index: number
}

export interface Evaluation {
  id: string
  student_id: string
  course_id: string
  metric_id: string
  enrollment_id: string
  score: number
  feedback?: string
  evaluated_by: string
  evaluated_at: string
}

export interface Attendance {
  id: string
  student_id: string
  lesson_id: string
  course_id: string
  present: boolean
  justification?: string
  recorded_by?: string
  recorded_at: string
}

export interface GamificationActivity {
  id: string
  name: string
  description?: string
  type: string
  points: number
  is_active: boolean
}

export interface GamificationLog {
  id: string
  student_id: string
  activity_id: string
  course_id?: string
  points: number
  result?: string
  notes?: string
  logged_at: string
}

export interface ServiceClient {
  id: string
  name: string
  email?: string
  phone?: string
  cpf_cnpj?: string
  address?: string
  asaas_customer_id?: string
  created_at: string
}

export interface Quotation {
  id: string
  client_id?: string
  title: string
  description?: string
  status: QuotationStatus
  valid_until?: string
  total_amount: number
  notes?: string
  created_by?: string
  created_at: string
}

export interface QuotationItem {
  id: string
  quotation_id: string
  description: string
  quantity: number
  unit_price: number
  total_price: number
  order_index: number
}

export interface ServiceOrder {
  id: string
  os_number: string
  client_id?: string
  quotation_id?: string
  title: string
  description?: string
  status: OSStatus
  priority: OSPriority
  labor_cost: number
  materials_cost: number
  total_cost: number
  notes?: string
  created_by?: string
  started_at?: string
  completed_at?: string
  created_at: string
}

export interface ServiceInvoice {
  id: string
  service_order_id: string
  client_id?: string
  asaas_payment_id?: string
  amount: number
  payment_method: PaymentMethod
  status: PaymentStatus
  due_date?: string
  paid_at?: string
  bank_slip_url?: string
  pix_code?: string
  created_at: string
}
