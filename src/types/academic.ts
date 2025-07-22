export interface Department {
  id: string;
  name: string;
  code: string;
  facultyId: string;
  head: string;
  description?: string;
  isActive: boolean;
  isValidated: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Faculty {
  id: string;
  name: string;
  description?: string;
  dean: string;
  isActive: boolean;
  isValidated: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Filiere {
  id: string;
  name: string;
  code: string;
  departmentId: string;
  description?: string;
  head?: string;
  isActive: boolean;
  isValidated: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Specialty {
  id: string;
  name: string;
  code: string;
  filiereId: string; // Changé de departmentId à filiereId
  level: 'licence' | 'master' | 'doctorat';
  description?: string;
  duration: number; // en années
  isActive: boolean;
  isValidated: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FormationOffer {
  id: string;
  name: string;
  code: string;
  specialtyId: string;
  level: string;
  academicYear: string;
  modules: Module[];
  sections: Section[];
  createdAt: Date;
  updatedAt: Date;
  // New fields for comprehensive management
  diplomaType: 'licence' | 'master' | 'doctorat';
  duration: number; // en semestres
  modality: 'presential' | 'distance' | 'hybrid';
  language: string;
  maxCapacity: number;
  admissionRequirements: string;
  pedagogicalObjectives: string[];
  careerProspects: string[];
  status: 'draft' | 'validation' | 'validated' | 'archived';
  responsibleId: string;
  responsibleName: string;
  lastModifiedBy: string;
  validationHistory: ValidationEntry[];
  totalECTS: number;
}

export interface ValidationEntry {
  id: string;
  date: Date;
  validatorId: string;
  validatorName: string;
  status: 'approved' | 'rejected' | 'pending';
  comments: string;
  stage: 'pedagogical' | 'administrative' | 'final';
}

export interface UniteEnseignement {
  id: string;
  code: string;
  name: string;
  ects: number;
  semester: number;
  character: 'obligatoire' | 'optionnel' | 'libre';
  unitType: 'fondamentale' | 'methodologique' | 'decouverte' | 'transversale';
  prerequisites: string[];
  evaluationMethods: string[];
  subjects: Subject[];
  formationId: string;
  coefficient: number; // Ajout du coefficient pour les unités
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  ueId: string;
  hours: {
    cm: number; // Cours magistraux
    td: number; // Travaux dirigés
    tp: number; // Travaux pratiques
  };
  credits: number;
  coefficient: number;
  moduleType: 'cours' | 'seminaire' | 'atelier' | 'projet' | 'stage';
  responsibleId: string;
  responsibleName: string;
  resources: string[];
}

export interface Teacher {
  id: string;
  name: string;
  grade: string;
  specialty: string;
  availability: string[];
  teachingLoad: number;
  maxLoad: number;
  isExternal: boolean;
  contractType?: string;
  evaluations: TeacherEvaluation[];
}

export interface TeacherEvaluation {
  id: string;
  academicYear: string;
  score: number;
  comments: string;
  evaluatedBy: string;
  date: Date;
}

export interface FormationVersion {
  id: string;
  formationId: string;
  version: number;
  changes: string[];
  createdAt: Date;
  createdBy: string;
  status: 'draft' | 'active' | 'archived';
}

export interface Module {
  id: string;
  name: string;
  code: string;
  credits: number;
  coefficient: number;
  teacher: string;
  teacherId: string;
  type: 'presential' | 'distance';
  semester: number; // Changed from 'S1' | 'S2' to number for dynamic calculation
  moduleType: 'cours' | 'seminaire' | 'atelier' | 'projet' | 'stage';
  pedagogicalAtoms: PedagogicalAtom[];
}

export interface PedagogicalAtom {
  id: string;
  type: 'cours' | 'td' | 'tp' | 'stage';
  hours: number; // nombre total d'heures
  totalWeeks: number; // nombre de semaines
  groupSize: number; // taille de groupe
  requiresReservation?: boolean;
  location?: 'internal' | 'external';
  description?: string;
}

export interface Section {
  id: string;
  name: string;
  code: string;
  capacity: number;
  currentEnrollment: number;
  specialtyId: string;
  semester?: string; // Ajout de la référence au semestre
  groups: Group[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Group {
  id: string;
  name: string;
  code: string;
  sectionId: string;
  capacity: number;
  currentEnrollment: number;
  type: 'td' | 'tp';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Formation {
  id: string;
  name: string;
  code: string;
  specialtyId: string;
  level: string;
  semester: string;
  academicYear: string;
  modules: FormationModule[];
  sections: Section[];
  createdAt: Date;
  updatedAt: Date;
}

export interface FormationModule {
  id: string;
  name: string;
  code: string;
  credits: number;
  coefficient: number;
  teacher: string;
  teacherId: string;
  type: 'presential' | 'distance';
  pedagogicalAtoms: PedagogicalAtom[];
}

export interface ManualTimetable {
  id: string;
  name: string;
  formationId: string;
  academicYear: string;
  semester: string;
  status: 'draft' | 'validated' | 'published' | 'invalidated';
  schedules: TimetableSchedule[];
  createdBy: string;
  validatedBy?: string;
  validatedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface TimetableSchedule {
  id: string;
  moduleId: string;
  moduleName: string;
  atomType: 'cours' | 'td' | 'tp' | 'stage';
  teacherId: string;
  teacherName: string;
  targetAudience: {
    type: 'section' | 'group';
    id: string;
    name: string;
  };
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  roomId?: string;
  roomName?: string;
  weekFrequency: 'weekly' | 'biweekly';
  startWeek: number;
  endWeek: number;
  requiresReservation: boolean;
}

// Nouvelle interface pour les entrées d'emploi du temps avec semestre
export interface TimetableEntry {
  id: string;
  moduleId?: string;
  subject: string;
  teacher: string;
  room: string;
  day: string;
  startTime: string;
  endTime: string;
  type: 'cours' | 'td' | 'tp';
  courseTypeLabel?: string;
  specialtyId: string;
  semester?: string;
  sectionId?: string;
  groupId?: string;
}
