// ============================================================
// WELDER & FUSION - TypeScript Types
// ============================================================

export type UserRole = 'student' | 'instructor' | 'admin' | 'industrial_client'
export type CourseLevel = 'beginner' | 'intermediate' | 'advanced'
export type CourseStatus = 'draft' | 'published' | 'archived'
export type EnrollmentStatus = 'pending' | 'active' | 'completed' | 'cancelled'
export type PaymentStatus = 'pending' | 'confirmed' | 'received' | 'overdue' | 'refunded' | 'cancelled'
export type PaymentMethod = 'boleto' | 'pix' | 'credit_card'
export type ServiceOrderStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled'
export type ServiceOrderPriority = 'low' | 'normal' | 'high' | 'urgent'
export type QuotationStatus = 'draft' | 'sent' | 'approved' | 'rejected' | 'expired'
export type EvaluationMetricType = 'theoretical' | 'practical'
export type GamificationActivityType = 'weld_attempt' | 'product_test' | 'lesson_complete' | 'evaluation_pass' | 'perfect_attendance' | 'course_complete'

export interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string
  bio?: string
  avatar_url?: string
  role: UserRole
  asaas_customer_id?: string
  created_at: string
  updated_at: string
}

export interface Course {
  id: string
  title: string
  description?: string
  full_description?: string
  thumbnail_url?: string
  instructor_id?: string
  instructor?: UserProfile
  price: number
  duration_hours?: number
  level?: CourseLevel
  status: CourseStatus
  min_attendance_percentage: number
  min_grade: number
  max_students?: number
  prerequisites?: string
  modules?: Module[]
  created_at: string
  updated_at: string
}

export interface Module {
  id: string
  course_id: string
  title: string
  description?: string
  order_index: number
  lessons?: Lesson[]
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
  video_url?: string
  order_index: number
  duration_minutes?: number
  is_free_preview: boolean
  created_at: string
  updated_at: string
}

export interface Enrollment {
  id: string
  student_id: string
  course_id: string
  course?: Course
  student?: UserProfile
  status: EnrollmentStatus
  enrolled_at: string
  completed_at?: string
}

export interface LessonProgress {
  id: string
  student_id: string
  lesson_id: string
  course_id: string
  completed: boolean
  completed_at?: string
  created_at: string
}

export interface Payment {
  id: string
  student_id: string
  enrollment_id?: string
  enrollment?: Enrollment
  asaas_payment_id?: string
  amount: number
  payment_method?: PaymentMethod
  status: PaymentStatus
  due_date?: string
  paid_at?: string
  invoice_url?: string
  bank_slip_url?: string
  pix_code?: string
  description?: string
  installment_count: number
  created_at: string
  updated_at: string
}

export interface Certificate {
  id: string
  student_id: string
  course_id: string
  enrollment_id: string
  course?: Course
  student?: UserProfile
  certificate_number: string
  validation_code: string
  qr_code_url?: string
  issued_at: string
  pdf_url?: string
  revoked: boolean
  revoked_at?: string
  revoked_reason?: string
}

export interface CertificateValidation {
  valid: boolean
  certificate_number: string
  validation_code: string
  student_name?: string
  course_title?: string
  course_hours?: number
  issued_at: string
  revoked: boolean
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
  created_at: string
}

export interface Evaluation {
  id: string
  student_id: string
  course_id: string
  enrollment_id: string
  metric_id: string
  metric?: EvaluationMetric
  score: number
  feedback?: string
  evaluated_by?: string
  evaluated_at: string
}

export interface Attendance {
  id: string
  student_id: string
  lesson_id: string
  course_id: string
  lesson?: Lesson
  present: boolean
  justification?: string
  recorded_by?: string
  recorded_at: string
}

export interface GamificationActivity {
  id: string
  name: string
  description?: string
  points: number
  type: GamificationActivityType
  course_id?: string
  created_at: string
}

export interface GamificationLog {
  id: string
  student_id: string
  activity_id: string
  activity?: GamificationActivity
  course_id?: string
  points: number
  result?: 'correct' | 'incorrect' | 'partial'
  notes?: string
  logged_at: string
}

export interface ServiceClient {
  id: string
  name: string
  email?: string
  phone?: string
  document?: string
  document_type?: 'cpf' | 'cnpj'
  address?: string
  city?: string
  state?: string
  zip_code?: string
  notes?: string
  asaas_customer_id?: string
  created_at: string
  updated_at: string
}

export interface QuotationItem {
  id: string
  quotation_id: string
  description: string
  quantity: number
  unit?: string
  unit_price: number
  total_price: number
  order_index: number
}

export interface Quotation {
  id: string
  client_id: string
  client?: ServiceClient
  title: string
  description?: string
  status: QuotationStatus
  valid_until?: string
  total_amount?: number
  notes?: string
  items?: QuotationItem[]
  created_by?: string
  created_at: string
  updated_at: string
}

export interface ServiceOrder {
  id: string
  client_id: string
  client?: ServiceClient
  quotation_id?: string
  quotation?: Quotation
  os_number: string
  title: string
  description?: string
  status: ServiceOrderStatus
  priority: ServiceOrderPriority
  labor_cost?: number
  materials_cost?: number
  total_cost?: number
  notes?: string
  started_at?: string
  completed_at?: string
  assigned_to?: string
  created_by?: string
  created_at: string
  updated_at: string
}

export interface ServiceInvoice {
  id: string
  service_order_id: string
  client_id: string
  asaas_payment_id?: string
  amount: number
  payment_method?: PaymentMethod
  status: PaymentStatus
  due_date?: string
  paid_at?: string
  invoice_url?: string
  bank_slip_url?: string
  pix_code?: string
  created_at: string
  updated_at: string
}

// ============================================================
// FASE 2 — EMPREGABILIDADE
// ============================================================
export type JobType = 'clt' | 'pj' | 'temporario' | 'estagio'
export type JobModality = 'presencial' | 'remoto' | 'hibrido'
export type JobLevel = 'junior' | 'pleno' | 'senior' | 'especialista'
export type JobStatus = 'open' | 'closed' | 'paused'
export type ApplicationStatus = 'applied' | 'viewed' | 'shortlisted' | 'hired' | 'rejected'
export type AvailableFor = 'clt' | 'pj' | 'both' | 'not_available'

export interface PartnerCompany {
  id: string
  name: string
  email?: string
  phone?: string
  website?: string
  document?: string
  document_type?: 'cpf' | 'cnpj'
  industry?: string
  city?: string
  state?: string
  description?: string
  logo_url?: string
  active: boolean
  created_at: string
  updated_at: string
}

export interface JobPosting {
  id: string
  company_id: string
  company?: Pick<PartnerCompany, 'id' | 'name' | 'logo_url' | 'city' | 'state'>
  title: string
  description?: string
  requirements?: string
  benefits?: string
  salary_min?: number
  salary_max?: number
  location?: string
  job_type?: JobType
  modality?: JobModality
  level?: JobLevel
  status: JobStatus
  expires_at?: string
  created_at: string
  updated_at: string
}

export interface JobApplication {
  id: string
  job_id: string
  job?: Pick<JobPosting, 'id' | 'title'> & { company?: Pick<PartnerCompany, 'name' | 'logo_url'> }
  student_id: string
  student?: Pick<UserProfile, 'id' | 'name' | 'email' | 'phone'>
  status: ApplicationStatus
  cover_letter?: string
  applied_at: string
}

export interface TalentBank {
  id: string
  student_id: string
  student?: Pick<UserProfile, 'id' | 'name' | 'email' | 'avatar_url'>
  professional_title?: string
  summary?: string
  skills?: string[]
  experience_years?: number
  available_for?: AvailableFor
  location?: string
  linkedin_url?: string
  portfolio_url?: string
  resume_url?: string
  visible: boolean
  updated_at: string
}

// ============================================================
// FASE 3 — CRM COMERCIAL
// ============================================================
export type LeadSource = 'website' | 'whatsapp' | 'instagram' | 'facebook' | 'indicacao' | 'outro'
export type InteractionType = 'call' | 'email' | 'whatsapp' | 'meeting' | 'note'

export interface SalesFunnelStage {
  id: string
  name: string
  description?: string
  order_index: number
  color: string
  created_at: string
}

export interface Lead {
  id: string
  name: string
  email?: string
  phone?: string
  source?: LeadSource
  stage_id?: string
  stage?: SalesFunnelStage
  course_interest?: string
  course?: Pick<Course, 'id' | 'title'>
  notes?: string
  assigned_to?: string
  assigned?: Pick<UserProfile, 'id' | 'name'>
  converted: boolean
  enrollment_id?: string
  created_at: string
  updated_at: string
}

export interface LeadInteraction {
  id: string
  lead_id: string
  type: InteractionType
  notes?: string
  created_by?: string
  created_by_profile?: Pick<UserProfile, 'id' | 'name'>
  created_at: string
}

// ============================================================
// FASE 4 — CONSULTORIA CORPORATIVA
// ============================================================
export type ConsultingType = 'training' | 'audit' | 'consulting' | 'inspection'
export type ConsultingStatus = 'proposal' | 'active' | 'paused' | 'completed' | 'cancelled'
export type ReportStatus = 'draft' | 'published'

export interface ConsultingEngagement {
  id: string
  client_name: string
  client_document?: string
  client_email?: string
  client_phone?: string
  type: ConsultingType
  title: string
  description?: string
  status: ConsultingStatus
  contract_url?: string
  start_date?: string
  end_date?: string
  value?: number
  assigned_to?: string
  assigned?: Pick<UserProfile, 'id' | 'name'>
  notes?: string
  created_at: string
  updated_at: string
}

export interface ConsultingReport {
  id: string
  engagement_id: string
  title: string
  content?: string
  pdf_url?: string
  status: ReportStatus
  published_at?: string
  created_by?: string
  created_at: string
  updated_at: string
}

// API Response types
export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiError {
  message: string
  code?: string
  details?: unknown
}

// Dashboard metrics
export interface AdminDashboardMetrics {
  total_students: number
  published_courses: number
  active_enrollments: number
  total_revenue: number
  active_service_orders: number
  pending_service_orders: number
  open_job_postings: number
  open_leads: number
  active_consultings: number
}

export interface StudentDashboardData {
  enrollments: Enrollment[]
  recent_progress: LessonProgress[]
  certificates: Certificate[]
  total_points: number
  pending_payments: Payment[]
}

// Calculator types
export interface WeldingParams {
  process: 'MIG' | 'MAG' | 'TIG' | 'Eletrodo' | 'Arame Tubular'
  material: 'Aço Carbono' | 'Aço Inox' | 'Alumínio'
  thickness: number
  joint_type: 'Topo' | 'Filete' | 'Sobreposição' | 'Canto'
}

export interface WeldingCalculationResult {
  amperage_min: number
  amperage_max: number
  amperage_recommended: number
  wire_diameter?: string
  electrode_diameter?: string
  travel_speed?: string
  notes: string[]
}
