
export interface TeacherWorkload {
  id: string;
  teacherId: string;
  teacherName: string;
  academicYear: string;
  semester: 'S1' | 'S2' | 'Année';
  assignments: WorkloadAssignment[];
  totalHours: number;
  maxHours: number;
  overloadHours?: number;
  status: 'normal' | 'overload' | 'underload';
  lastUpdated?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkloadAssignment {
  id: string;
  moduleId: string;
  moduleName: string;
  specialtyId: string;
  specialtyName: string;
  atomType: 'cours' | 'td' | 'tp' | 'stage';
  targetAudience: {
    type: 'section' | 'group';
    id: string;
    name: string;
    capacity: number;
  };
  hoursPerWeek: number;
  totalWeeks: number;
  totalHours: number;
  coefficient: number;
  isConfirmed: boolean;
}

export interface SectionConfiguration {
  id: string;
  formationOfferId: string;
  academicYear: string;
  sections: SectionDefinition[];
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
}

export interface SectionDefinition {
  id: string;
  name: string;
  code: string;
  capacity: number;
  groups: GroupDefinition[];
  startGroupNumber?: number;
  endGroupNumber?: number;
}

export interface GroupDefinition {
  id: string;
  name: string;
  code: string;
  sectionId: string;
  type: 'td' | 'tp';
  capacity: number;
  groupNumber: number;
}

export interface WorkloadStatistics {
  department: string;
  academicYear: string;
  semester?: string;
  overview?: {
    totalTeachers: number;
    totalHours: number;
    averageLoad: number;
    overloadedCount: number;
    underloadedCount: number;
  };
  byGrade?: Record<string, {
    count: number;
    averageHours: number;
    maxHours: number;
    minHours: number;
  }>;
  alerts?: WorkloadAlert[];
  totalTeachers: number;
  totalHours: number;
  averageHours: number;
  overloadedTeachers: number;
  underloadedTeachers: number;
  normalTeachers: number;
  overloadPercentage: number;
  underloadPercentage: number;
  distributionByModule: Record<string, number>;
  distributionBySpecialty: Record<string, number>;
  createdAt: Date;
}

export interface WorkloadAlert {
  id: string;
  type: 'overload' | 'underload' | 'conflict' | 'missing_assignment';
  teacherId: string;
  teacherName: string;
  severity: 'low' | 'medium' | 'high';
  message: string;
  createdAt: Date;
}
