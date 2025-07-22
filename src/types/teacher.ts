
export interface Faculty {
  id: string;
  name: string;
  description?: string;
  dean?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Department {
  id: string;
  name: string;
  facultyId: string;
  description?: string;
  headId?: string;
  headName?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Specialty {
  id: string;
  name: string;
  code: string;
  departmentId: string;
  level: 'licence' | 'master' | 'doctorat';
  description?: string;
  duration: number; // en années
  coordinatorId?: string;
  coordinatorName?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Publication {
  id: string;
  title: string;
  type: 'Article' | 'Book' | 'Conference' | 'Thesis';
  year: number;
  journal?: string;
  isbn?: string;
  doi?: string;
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  firstNameArabic?: string;
  lastNameArabic?: string;
  civility?: string;
  email: string;
  phone?: string;
  dateOfBirth: Date;
  placeOfBirth?: string;
  placeOfBirthArabic?: string;
  nationality?: string;
  nationalId?: string;
  socialSecurityNumber?: string;
  ccpAccount?: string;
  bloodType?: string;
  rfidCardNumber?: string;
  photo?: string;
  affiliationDate?: Date;
  familyStatus?: string;
  numberOfChildren?: number;
  nationalService?: {
    status: string;
    startDate?: Date;
    endDate?: Date;
  };
  address?: {
    street: string;
    city: string;
    wilaya: string;
    postalCode: string;
  };
}

export interface ProfessionalInfo {
  employeeId?: string;
  currentGrade: string;
  currentEchelon?: number;
  speciality?: string;
  department?: string;
  faculty?: string;
  hireDate?: Date;
  tenureDate?: Date;
  contractType?: string;
  status?: string;
}

export interface CareerPath {
  id: string;
  teacherId: string;
  type: 'grade' | 'echelon';
  gradeOrEchelon: string;
  obtentionDate: Date;
  durationInMonths?: number;
  decision?: string;
  isActive: boolean;
}

export interface DigitalFolder {
  id: string;
  teacherId: string;
  documents: DigitalDocument[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DigitalDocument {
  id: string;
  name: string;
  type: string;
  fileUrl: string;
  uploadDate: Date;
  category: 'diplome' | 'cv' | 'decision' | 'medical' | 'autre';
  description?: string;
}

export interface EchelonHistoryEntry {
  echelon: number;
  acquisitionDate: Date;
  advancementType: string;
  decision?: string;
}

export interface GradeHistoryEntry {
  grade: string;
  acquisitionDate: Date;
  endDate?: Date;
  decision?: string;
}

export interface AdministrativePosition {
  id: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  isCurrent: boolean;
}

export interface Education {
  id: string;
  level: string;
  field: string;
  institution: string;
  country: string;
  graduationYear: number;
  isRecognized: boolean;
}

export interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  grade: 'Professeur' | 'Maître de Conférences A' | 'Maître de Conférences B' | 'Maître Assistant A' | 'Maître Assistant B' | 'Assistant';
  specialty: string;
  departmentId: string;
  isActive: boolean;
  hiringDate: Date;
  echelon: number;
  lastPromotionDate?: Date;
  nextPromotionDate?: Date;
  isExternal: boolean;
  contractType?: 'CDI' | 'CDD' | 'Vacation';
  maxWeeklyHours: number;
  currentWeeklyHours: number;
  qualifications: string[];
  researchInterests: string[];
  publications?: Publication[];
  createdAt: Date;
  updatedAt: Date;
  // Extended structure for detailed components
  personalInfo?: PersonalInfo;
  professionalInfo?: ProfessionalInfo;
  echelonHistory?: EchelonHistoryEntry[];
  gradeHistory?: GradeHistoryEntry[];
  administrativePositions?: AdministrativePosition[];
  education?: Education[];
  careerPath?: CareerPath[];
  digitalFolder?: DigitalFolder;
}

export interface TeacherAbsence {
  id: string;
  teacherId: string;
  startDate: Date;
  endDate: Date;
  type: 'maladie' | 'conge_annuel' | 'formation' | 'mission' | 'autre';
  reason: string;
  isJustified: boolean;
  justificationDocument?: string;
  status: 'pending' | 'approved' | 'rejected';
  replacementTeacherId?: string;
  coursesAffected: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AbsenceStatistics {
  teacherId: string;
  teacherName: string;
  period: {
    startDate: Date;
    endDate: Date;
  };
  absencesSummary: {
    totalAbsences: number;
    totalDays: number;
    byType: {
      [key: string]: {
        count: number;
        days: number;
        percentage: number;
      };
    };
    justified: number;
    unjustified: number;
  };
  impact: {
    coursesImpacted: number;
    studentsAffected: number;
    hoursLost: number;
    replacementRate: number;
  };
  trend: {
    comparedToPreviousPeriod: number;
    averageAbsenceRate: number;
    riskLevel: 'low' | 'medium' | 'high';
  };
}

export interface WorkloadStatistics {
  department: string;
  period: {
    semester: 'S1' | 'S2';
    academicYear: string;
  };
  overview: {
    totalTeachers: number;
    totalHours: number;
    averageLoadPerTeacher: number;
    overloadedTeachers: number;
    underloadedTeachers: number;
  };
  byGrade: {
    [key: string]: {
      count: number;
      averageHours: number;
      maxHours: number;
      minHours: number;
      overloadedCount: number;
    };
  };
  distribution: {
    teaching: number;
    supervision: number;
    administrative: number;
  };
  alerts: Array<{
    type: string;
    teacherId: string;
    teacherName: string;
    currentHours: number;
    recommendedHours: number;
    severity: 'low' | 'medium' | 'high';
  }>;
}

export const TEACHER_GRADES = [
  'Professeur',
  'Maître de Conférences A',
  'Maître de Conférences B',
  'Maître Assistant A',
  'Maître Assistant B',
  'Assistant'
] as const;

export type TeacherGrade = typeof TEACHER_GRADES[number];

// Separate interface for form data that matches the form structure
export interface TeacherFormData {
  personalInfo: PersonalInfo;
  professionalInfo: ProfessionalInfo;
  echelonHistory: EchelonHistoryEntry[];
  gradeHistory: GradeHistoryEntry[];
  administrativePositions: AdministrativePosition[];
  education: Education[];
  careerPath: CareerPath[];
  digitalFolder?: DigitalFolder;
}
