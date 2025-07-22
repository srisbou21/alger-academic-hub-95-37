export interface TeacherScholarship {
  id: string;
  title: string;
  description: string;
  type: 'formation' | 'recherche' | 'conference' | 'stage' | 'workshop';
  duration: {
    startDate: Date;
    endDate: Date;
    totalDays: number;
  };
  location: {
    country: string;
    city: string;
    institution: string;
  };
  financialInfo: {
    totalAmount: number;
    currency: string;
    coverage: Array<'transport' | 'accommodation' | 'meals' | 'registration' | 'visa'>;
    fundingSource: string;
  };
  eligibility: {
    targetAudience: Array<'enseignant' | 'personnel_administratif' | 'etudiant_beneficiaire'>;
    minGrade?: string; // Pour enseignants/personnel
    maxAge?: number;
    minExperience?: number; // années, pour enseignants/personnel
    languageRequirements: string[];
    academicRequirements: string[];
    manualSelectionRequired: boolean; // Pour étudiants bénéficiaires
  };
  applicationPeriod: {
    openDate: Date;
    closeDate: Date;
    resultsDate: Date;
  };
  documents: Array<{
    type: string;
    required: boolean;
    description: string;
  }>;
  status: 'draft' | 'open' | 'closed' | 'evaluation' | 'completed';
  maxApplications: number;
  currentApplications: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ScholarshipApplication {
  id: string;
  scholarshipId: string;
  scholarshipTitle: string;
  applicantId: string;
  applicantName: string;
  applicantType: 'enseignant' | 'personnel_administratif' | 'etudiant';
  selectedApplicant?: any; // Données de l'enseignant/personnel depuis GRH
  personalInfo: {
    userType: 'enseignant' | 'personnel_administratif' | 'etudiant';
    // Pour étudiants
    nomArabe?: string;
    nomFrancais?: string;
    prenomArabe?: string;
    prenomFrancais?: string;
    matricule?: string;
    dateNaissance?: string;
    lieuNaissanceArabe?: string;
    lieuNaissanceFrancais?: string;
    niveauEtude?: string;
    moyenneAnneeActuelle?: number;
    // Pour enseignants/personnel
    grade?: string;
    department?: string;
    experience?: number;
    currentPosition?: string;
  };
  scholarshipInfo: {
    destinationVoulue: string;
    universiteReceptrice: string;
    beneficiePrecedente: boolean;
    consommePrecedente?: boolean;
    derniereAnneeBourse?: string;
    planProjet: string;
    objectifs: string;
  };
  documents: Array<{
    type: string;
    fileName: string;
    uploadDate: Date;
    verified: boolean;
  }>;
  evaluation: {
    academicScore?: number;
    motivationScore?: number;
    relevanceScore?: number;
    totalScore?: number;
    evaluatorComments?: string;
    evaluatedBy?: string;
    evaluatedAt?: Date;
  };
  status: 'draft' | 'submitted' | 'under_review' | 'evaluated' | 'accepted' | 'rejected' | 'completed';
  submissionDate?: Date;
  resultNotificationDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ScholarshipResult {
  applicationId: string;
  scholarshipId: string;
  applicantId: string;
  applicantName: string;
  decision: 'accepted' | 'rejected' | 'waitlist';
  ranking?: number;
  finalScore: number;
  feedback: string;
  conditions?: string[];
  reportingRequirements: {
    midTermReport: boolean;
    finalReport: boolean;
    presentationRequired: boolean;
    deadlines: Date[];
  };
  financialDetails?: {
    approvedAmount: number;
    disbursementSchedule: Array<{
      amount: number;
      date: Date;
      description: string;
      status: 'pending' | 'disbursed';
    }>;
  };
  announcedAt: Date;
  acceptanceDeadline: Date;
  applicantResponse?: 'accepted' | 'declined';
  responseDate?: Date;
}

export interface ScholarshipReport {
  id: string;
  applicationId: string;
  scholarshipId: string;
  reportType: 'mid_term' | 'final' | 'presentation';
  content: {
    activities: string;
    achievements: string;
    challenges: string;
    outcomes: string;
    recommendations: string;
  };
  attachments: Array<{
    fileName: string;
    type: string;
    uploadDate: Date;
  }>;
  evaluation: {
    rating: number;
    feedback: string;
    evaluatedBy: string;
    evaluatedAt: Date;
  };
  status: 'draft' | 'submitted' | 'evaluated' | 'approved';
  submissionDate?: Date;
  createdAt: Date;
}