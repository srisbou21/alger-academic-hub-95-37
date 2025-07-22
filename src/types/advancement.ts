
export interface AdvancementEvaluation {
  id: string;
  employeeId: string;
  evaluationYear: number;
  score: number; // Sur 20
  appreciation: 'Excellent' | 'Très satisfaisant' | 'Satisfaisant' | 'Assez bien' | 'Passable' | 'Insuffisant';
  criteria: {
    professionalCompetence: number;
    workQuality: number;
    initiative: number;
    teamwork: number;
    punctuality: number;
  };
  evaluatedBy: string;
  evaluatedAt: Date;
  validatedBy?: string;
  validatedAt?: Date;
  status: 'draft' | 'submitted' | 'validated' | 'rejected';
  comments?: string;
}

export interface AdvancementDuration {
  score: number;
  duration: 30 | 36 | 42;
  label: 'Rapide' | 'Normal' | 'Lent';
  description: string;
}

export interface EchelonAdvancement {
  id: string;
  employeeId: string;
  employeeName: string;
  currentEchelon: number; // 1 à 12
  targetEchelon: number;
  appointmentDate: Date; // Date de nomination dans l'échelon actuel
  eligibilityDate: Date; // Date d'éligibilité pour l'avancement
  requiredDuration: 30 | 36 | 42; // En mois
  anciennete: {
    months: number;
    days: number;
    totalDays: number;
  };
  lastEvaluation: {
    score: number;
    year: number;
    duration: 30 | 36 | 42;
  };
  status: 'pending' | 'eligible' | 'processed' | 'suspended' | 'blocked';
  suspensionReason?: string;
  processedAt?: Date;
  processedBy?: string;
  decisionType?: 'automatic' | 'manual' | 'exceptional';
}

export interface AdvancementProposal {
  id: string;
  employeeId: string;
  employeeName: string;
  currentEchelon: number;
  targetEchelon: number;
  proposalDate: Date;
  eligibilityDate: Date;
  justification: string;
  supportingDocuments: string[];
  approvalChain: Array<{
    level: string;
    approver: string;
    status: 'pending' | 'approved' | 'rejected';
    comments?: string;
    date?: Date;
  }>;
  finalStatus: 'pending' | 'approved' | 'rejected';
  decisionDate?: Date;
  implementationDate?: Date;
}

export interface CareerSimulation {
  employeeId: string;
  currentEchelon: number;
  projections: Array<{
    year: number;
    echelon: number;
    estimatedScore: number;
    duration: 30 | 36 | 42;
    salaryImpact: number;
  }>;
  scenarios: {
    optimistic: Array<{ year: number; echelon: number }>;
    realistic: Array<{ year: number; echelon: number }>;
    pessimistic: Array<{ year: number; echelon: number }>;
  };
}

export interface AdvancementStatistics {
  period: {
    startDate: Date;
    endDate: Date;
  };
  totalEmployees: number;
  byEchelon: Record<number, {
    count: number;
    percentage: number;
    avgDuration: number;
  }>;
  byDuration: Record<30 | 36 | 42, {
    count: number;
    percentage: number;
  }>;
  recentAdvancements: Array<{
    month: string;
    count: number;
    avgDuration: number;
  }>;
  upcomingEligible: Array<{
    month: string;
    count: number;
    echelons: Record<number, number>;
  }>;
}

export const ADVANCEMENT_DURATIONS: AdvancementDuration[] = [
  {
    score: 18,
    duration: 30,
    label: 'Rapide',
    description: 'Notation excellente (18/20 et plus) - Performance exceptionnelle'
  },
  {
    score: 14,
    duration: 36,
    label: 'Normal',
    description: 'Notation satisfaisante (14/20 à 17/20) - Performance satisfaisante à bonne'
  },
  {
    score: 12,
    duration: 42,
    label: 'Lent',
    description: 'Notation minimale (12/20 à 13/20) - Performance juste acceptable'
  }
];

export const ECHELON_RANGE = {
  MIN: 1,
  MAX: 12
} as const;

export const EVALUATION_CRITERIA = [
  'professionalCompetence',
  'workQuality', 
  'initiative',
  'teamwork',
  'punctuality'
] as const;
