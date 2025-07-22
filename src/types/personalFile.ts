
export interface PersonalDocument {
  id: string;
  type: 'diplome' | 'certificat' | 'contrat' | 'evaluation' | 'medical' | 'administrative' | 'autre';
  title: string;
  description: string;
  uploadDate: Date;
  validUntil?: Date;
  fileUrl: string;
  fileSize: number;
  fileType: string;
  isRequired: boolean;
  isVerified: boolean;
  verifiedBy?: string;
  verifiedAt?: Date;
}

export interface PersonalFile {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeType: 'enseignant' | 'administratif';
  createdAt: Date;
  updatedAt: Date;
  
  // Informations personnelles étendues
  personalInfo: {
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    placeOfBirth: string;
    nationality: string;
    maritalStatus: 'celibataire' | 'marie' | 'divorce' | 'veuf';
    children: number;
    nationalId: string;
    passportNumber?: string;
    drivingLicense?: string;
    socialSecurityNumber?: string;
    bloodType?: string;
    
    contact: {
      email: string;
      personalEmail?: string;
      phone: string;
      emergencyContact: {
        name: string;
        relationship: string;
        phone: string;
      };
      address: {
        street: string;
        city: string;
        wilaya: string;
        postalCode: string;
        country: string;
      };
    };
  };

  // Informations professionnelles
  professionalInfo: {
    employeeId: string;
    startDate: Date;
    endDate?: Date;
    currentPosition: string;
    department: string;
    grade: string;
    echelon: number;
    contractType: 'permanent' | 'temporary' | 'vacation' | 'titulaire' | 'vacataire' | 'contractuel' | 'stagiaire';
    workSchedule: string;
    directSupervisor: string;
    workLocation: string;
  };

  // Formation et qualifications
  education: Array<{
    id: string;
    level: 'Licence' | 'Master' | 'Doctorat' | 'HDR' | 'Diplome technique' | 'Autre';
    field: string;
    institution: string;
    country: string;
    startYear: number;
    endYear: number;
    grade?: string;
    isRecognized: boolean;
  }>;

  // Expérience professionnelle
  experience: Array<{
    id: string;
    employer: string;
    position: string;
    startDate: Date;
    endDate?: Date;
    description: string;
    location: string;
  }>;

  // Compétences et certifications
  skills: {
    languages: Array<{
      language: string;
      level: 'débutant' | 'intermédiaire' | 'avancé' | 'natif';
      certifications?: string[];
    }>;
    technical: string[];
    certifications: Array<{
      name: string;
      issuingOrganization: string;
      issueDate: Date;
      expiryDate?: Date;
      credentialId?: string;
    }>;
  };

  // Historique des évaluations
  evaluations: Array<{
    id: string;
    year: number;
    score: number;
    evaluator: string;
    comments: string;
    strengths: string[];
    improvements: string[];
    goals: string[];
    evaluationDate: Date;
  }>;

  // Formations suivies
  trainings: Array<{
    id: string;
    title: string;
    provider: string;
    startDate: Date;
    endDate: Date;
    duration: number; // en heures
    type: 'formation' | 'séminaire' | 'conférence' | 'atelier';
    certificate?: string;
    grade?: string;
  }>;

  // Documents administratifs
  documents: PersonalDocument[];

  // Congés et absences
  leaves: Array<{
    id: string;
    type: 'conge_annuel' | 'maladie' | 'maternite' | 'paternite' | 'formation' | 'autre';
    startDate: Date;
    endDate: Date;
    duration: number;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    approvedBy?: string;
  }>;

  // Sanctions et récompenses
  disciplinary: Array<{
    id: string;
    type: 'sanction' | 'recompense' | 'avertissement' | 'blame';
    date: Date;
    reason: string;
    authority: string;
    documents?: string[];
  }>;

  // Statut du dossier
  status: {
    isComplete: boolean;
    missingDocuments: string[];
    lastReview: Date;
    reviewedBy: string;
    nextReviewDue: Date;
  };
}

export interface PersonalFileStatistics {
  total: number;
  complete: number;
  incomplete: number;
  pendingReview: number;
  byDepartment: Record<string, number>;
  byContractType: Record<string, number>;
  documentTypes: Record<string, { total: number; verified: number }>;
}
