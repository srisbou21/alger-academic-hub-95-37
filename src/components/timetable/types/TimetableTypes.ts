// Types et interfaces pour le système de gestion d'emplois du temps

export interface FormationOffer {
  id: string;
  name: string;
  code: string;
  level: 'licence' | 'master' | 'doctorat';
  domain: string;
  description?: string;
  duration: number; // en semestres
  totalStudents: number;
  sections: Section[];
  subjects: Subject[];
  constraints: FormationConstraints;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Section {
  id: string;
  formationId: string;
  name: string;
  code: string;
  capacity: number;
  currentStudents: number;
  groups: Group[];
  year: number; // 1ère année, 2ème année, etc.
  semester: number; // 1 ou 2
}

export interface Group {
  id: string;
  sectionId: string;
  name: string;
  code: string;
  type: 'td' | 'tp' | 'mixte';
  capacity: number;
  currentStudents: number;
  subgroups?: SubGroup[];
}

export interface SubGroup {
  id: string;
  groupId: string;
  name: string;
  capacity: number;
  students: string[]; // IDs des étudiants
}

export interface Subject {
  id: string;
  formationId: string;
  name: string;
  code: string;
  coefficient: number;
  credits: number; // ECTS
  semester: number;
  year: number;
  modules: Module[];
  prerequisites?: string[]; // IDs des matières prérequises
}

export interface Module {
  id: string;
  subjectId: string;
  type: 'cours' | 'td' | 'tp' | 'examen';
  name: string;
  duration: number; // en heures
  frequency: 'weekly' | 'biweekly' | 'monthly' | 'single';
  requiredInfrastructure: InfrastructureRequirement[];
  teacherProfile: TeacherProfile;
}

export interface InfrastructureRequirement {
  type: 'amphitheater' | 'classroom' | 'laboratory' | 'workshop';
  capacity: number;
  equipment: string[];
  characteristics: string[];
}

export interface TeacherProfile {
  qualificationLevel: 'assistant' | 'maitre-assistant' | 'maitre-conference' | 'professeur';
  specialization: string[];
  availabilityConstraints: TimeConstraint[];
}

export interface TimeConstraint {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';
  startTime: string; // format HH:mm
  endTime: string;
  isPreferred?: boolean;
  isBlocked?: boolean;
}

export interface FormationConstraints {
  maxDailyHours: number;
  maxWeeklyHours: number;
  preferredTimeSlots: TimeSlot[];
  blockedTimeSlots: TimeSlot[];
  minBreakDuration: number; // en minutes
  maxConsecutiveHours: number;
}

export interface TimeSlot {
  day: string;
  startTime: string;
  endTime: string;
  priority?: 'high' | 'medium' | 'low';
}

export interface Infrastructure {
  id: string;
  name: string;
  code: string;
  type: 'amphitheater' | 'classroom' | 'laboratory' | 'workshop';
  building: string;
  floor: string;
  capacity: number;
  equipment: Equipment[];
  characteristics: string[];
  isActive: boolean;
  maintenanceSchedule?: MaintenanceSlot[];
}

export interface Equipment {
  id: string;
  name: string;
  type: string;
  quantity: number;
  isWorking: boolean;
}

export interface MaintenanceSlot {
  date: Date;
  startTime: string;
  endTime: string;
  description: string;
}

export interface TimetableEntry {
  id: string;
  formationId: string;
  sectionId: string;
  groupId?: string;
  subjectId: string;
  moduleId: string;
  teacherId: string;
  infrastructureId: string;
  day: string;
  startTime: string;
  endTime: string;
  date?: Date; // pour les créneaux spécifiques
  week?: number; // numéro de semaine dans le semestre
  status: 'planned' | 'confirmed' | 'cancelled' | 'modified';
  notes?: string;
  conflictLevel: 'none' | 'minor' | 'major' | 'critical';
}

export interface GeneratedTimetable {
  id: string;
  formationId: string;
  semester: SemesterInfo;
  entries: TimetableEntry[];
  statistics: TimetableStatistics;
  validationStatus: ValidationStatus;
  optimizationLevel: OptimizationLevel;
  generatedAt: Date;
  lastModified: Date;
}

export interface SemesterInfo {
  year: number;
  semester: number; // 1 ou 2
  startDate: Date;
  endDate: Date;
  examPeriods: ExamPeriod[];
  holidays: Holiday[];
}

export interface ExamPeriod {
  startDate: Date;
  endDate: Date;
  type: 'mid-term' | 'final' | 'makeup';
}

export interface Holiday {
  startDate: Date;
  endDate: Date;
  name: string;
  type: 'national' | 'religious' | 'academic';
}

export interface TimetableStatistics {
  totalHours: number;
  utilizationRate: number; // pourcentage d'utilisation des infrastructures
  conflictCount: number;
  teacherWorkload: { [teacherId: string]: number };
  infrastructureUsage: { [infrastructureId: string]: number };
  distributionQuality: number; // score de qualité de répartition
}

export interface ValidationStatus {
  isValidated: boolean;
  validatedBy?: string;
  validatedAt?: Date;
  issues: ValidationIssue[];
  approvalLevel: 'none' | 'partial' | 'department' | 'faculty' | 'admin';
}

export interface ValidationIssue {
  id: string;
  type: 'conflict' | 'constraint' | 'quality' | 'resource';
  severity: 'info' | 'warning' | 'error' | 'critical';
  description: string;
  affectedEntries: string[]; // IDs des créneaux affectés
  suggestedFix?: string;
  isResolved: boolean;
}

export interface OptimizationLevel {
  algorithm: 'basic' | 'advanced' | 'ai-powered';
  objectives: OptimizationObjective[];
  constraints: OptimizationConstraint[];
  score: number; // score d'optimisation 0-100
}

export interface OptimizationObjective {
  type: 'minimize-conflicts' | 'maximize-utilization' | 'balance-workload' | 'student-satisfaction';
  weight: number;
  priority: number;
}

export interface OptimizationConstraint {
  type: 'hard' | 'soft';
  description: string;
  penalty: number;
}

export interface Reservation {
  id: string;
  timetableEntryId: string;
  infrastructureId: string;
  formationId: string;
  startDate: Date;
  endDate: Date;
  day: string;
  startTime: string;
  endTime: string;
  frequency: 'weekly' | 'biweekly' | 'single';
  status: 'pending' | 'confirmed' | 'cancelled';
  bookedBy: string;
  bookedAt: Date;
  cancelledAt?: Date;
  cancellationReason?: string;
  notes?: string;
}

export interface ReservationBatch {
  id: string;
  timetableId: string;
  formationId: string;
  semester: SemesterInfo;
  reservations: Reservation[];
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  createdAt: Date;
  completedAt?: Date;
  totalCount: number;
  successCount: number;
  failureCount: number;
  errors: ReservationError[];
}

export interface ReservationError {
  reservationId: string;
  errorType: 'conflict' | 'unavailable' | 'constraint' | 'system';
  errorMessage: string;
  suggestedAlternatives?: AlternativeSlot[];
}

export interface AlternativeSlot {
  infrastructureId: string;
  day: string;
  startTime: string;
  endTime: string;
  quality: number; // score de qualité 0-100
}

export interface OptimizationModel {
  id: string;
  name: string;
  description: string;
  algorithm: OptimizationAlgorithm;
  parameters: OptimizationParameters;
  constraints: ModelConstraint[];
  objectives: ModelObjective[];
  isActive: boolean;
  createdAt: Date;
}

export interface OptimizationAlgorithm {
  type: 'genetic' | 'simulated-annealing' | 'tabu-search' | 'constraint-programming' | 'machine-learning';
  version: string;
  configuration: { [key: string]: any };
}

export interface OptimizationParameters {
  maxIterations: number;
  convergenceThreshold: number;
  timeLimit: number; // en secondes
  populationSize?: number;
  mutationRate?: number;
  crossoverRate?: number;
  temperature?: number;
  coolingRate?: number;
}

export interface ModelConstraint {
  id: string;
  name: string;
  type: 'hard' | 'soft';
  weight: number;
  formula: string;
  parameters: { [key: string]: any };
}

export interface ModelObjective {
  id: string;
  name: string;
  type: 'minimize' | 'maximize';
  weight: number;
  formula: string;
  target?: number;
}

export interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'error' | 'skipped';
  requiredInputs: string[];
  outputs: string[];
  estimatedDuration?: number;
  actualDuration?: number;
  errorMessage?: string;
}

export interface TimetableWorkflow {
  id: string;
  formationId: string;
  semester: SemesterInfo;
  steps: WorkflowStep[];
  currentStepIndex: number;
  status: 'draft' | 'in-progress' | 'completed' | 'failed' | 'cancelled';
  progress: number; // 0-100
  startedAt?: Date;
  completedAt?: Date;
  createdBy: string;
  logs: WorkflowLog[];
}

export interface WorkflowLog {
  timestamp: Date;
  level: 'info' | 'warning' | 'error';
  stepId?: string;
  message: string;
  details?: any;
}