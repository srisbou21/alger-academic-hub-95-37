export interface AdministrativeStaff {
  id: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    firstNameArabic?: string;
    lastNameArabic?: string;
    civility: 'M.' | 'Mme' | 'Mlle';
    email: string;
    phone: string;
    dateOfBirth: Date;
    placeOfBirth: string;
    placeOfBirthArabic?: string;
    nationality: string;
    nationalId: string;
    socialSecurityNumber?: string;
    ccpAccount?: string;
    bloodType?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
    rfidCardNumber?: string;
    photo?: string;
    affiliationDate?: Date;
    familyStatus: 'celibataire' | 'marie' | 'divorce' | 'veuf';
    numberOfChildren: number;
    nationalService?: {
      status: 'effectue' | 'exempte' | 'reporte' | 'en_cours';
      startDate?: Date;
      endDate?: Date;
      militaryNumber?: string;
    };
    address: {
      street: string;
      city: string;
      wilaya: string;
      postalCode: string;
    };
  };
  professionalInfo: {
    employeeId: string;
    position: string;
    grade: 'hors_grade' | 'grade_1' | 'grade_2' | 'grade_3' | 'grade_4' | 'grade_5' | 'grade_6' | 'grade_7' | 'grade_8' | 'grade_9' | 'grade_10' | 'grade_11' | 'grade_12' | 'grade_13' | 'grade_14' | 'grade_15' | 'grade_16' | 'grade_17' | 'grade_18' | 'grade_19' | 'grade_20';
    gradeCategory: 'administratif' | 'technique' | 'service' | 'medical' | 'enseignement_superieur';
    gradeDetails: 
      // Grades administratifs
      | 'secretaire_darchives_documentaliste' // Grade 1
      | 'agent_dadministration' // Grade 2
      | 'secretaire_dadministration' // Grade 3
      | 'adjoint_dadministration' // Grade 4
      | 'adjoint_dadministration_principal' // Grade 5
      | 'controleur_dadministration' // Grade 6
      | 'controleur_dadministration_principal' // Grade 7
      | 'inspecteur_dadministration' // Grade 8
      | 'inspecteur_dadministration_principal' // Grade 9
      | 'inspecteur_dadministration_central' // Grade 10
      | 'administrateur' // Grade 11
      | 'administrateur_principal' // Grade 12
      | 'administrateur_en_chef' // Grade 13
      
      // Grades techniques
      | 'agent_technique' // Grade 1
      | 'ouvrier_professionnel_1ere_categorie' // Grade 2
      | 'ouvrier_professionnel_2eme_categorie' // Grade 3
      | 'ouvrier_professionnel_3eme_categorie' // Grade 4
      | 'conducteur_de_travaux' // Grade 5
      | 'technicien' // Grade 6
      | 'technicien_principal' // Grade 7
      | 'technicien_en_chef' // Grade 8
      | 'ingenieur_dapplication' // Grade 9
      | 'ingenieur_detudes' // Grade 10
      | 'ingenieur_principal' // Grade 11
      | 'ingenieur_en_chef' // Grade 12
      
      // Grades de service
      | 'agent_de_service' // Grade 1
      | 'agent_de_service_principal' // Grade 2
      | 'chef_dequipe' // Grade 3
      | 'surveillant_general' // Grade 4
      | 'surveillant_general_principal' // Grade 5
      
      // Grades médicaux
      | 'aide_soignant' // Grade 3
      | 'infirmier' // Grade 6
      | 'infirmier_principal' // Grade 7
      | 'infirmier_major' // Grade 8
      | 'medecin_generaliste' // Grade 11
      | 'medecin_specialiste' // Grade 12
      | 'medecin_professeur' // Grade 13
      
      // Grades enseignement supérieur (personnel administratif des universités)
      | 'adjoint_technique_de_recherche' // Grade 4
      | 'technicien_de_recherche' // Grade 6
      | 'assistant_de_recherche' // Grade 8
      | 'ingenieur_de_recherche' // Grade 10
      | 'ingenieur_de_recherche_principal' // Grade 11
      | 'directeur_de_recherche'; // Grade 13
    echelon: number; // 0 à 12
    echelonHistory: Array<{
      echelon: number;
      acquisitionDate: Date;
      advancementType: 'court' | 'moyen' | 'long';
      decision?: string;
    }>;
    service: string;
    hireDate: Date;
    tenureDate?: Date; // Date de titularisation
    contractType: 'titulaire' | 'vacataire' | 'contractuel' | 'stagiaire';
    status: 'active' | 'inactive' | 'suspended' | 'retired' | 'terminated';
    supervisor?: string;
    workSchedule: {
      type: 'full_time' | 'part_time' | 'flexible';
      hoursPerWeek: number;
      workDays: string[];
    };
  };
  education: Array<{
    id: string;
    level: 'Primaire' | 'Moyen' | 'Secondaire' | 'Universitaire' | 'Post-universitaire';
    diploma: string;
    institution: string;
    graduationYear: number;
    specialty?: string;
    isRecognized: boolean;
  }>;
  salaryInfo: {
    baseSalary: number;
    allowances: {
      transport?: number;
      meal?: number;
      responsibility?: number;
      overtime?: number;
      other?: number;
    };
    totalSalary: number;
    paymentMethod: 'bank_transfer' | 'cash' | 'check';
    bankAccount?: string;
  };
  skills: {
    languages: string[];
    certifications: string[];
    computerSkills: string[];
    specialSkills: string[];
  };
  performance: {
    lastEvaluationDate?: Date;
    lastEvaluationScore?: number;
    strengths: string[];
    areasForImprovement: string[];
    goals: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface AdministrativeAbsence {
  id: string;
  staffId: string;
  staffName: string;
  type: 'maladie' | 'conge_annuel' | 'conge_maternite' | 'conge_paternite' | 'conge_sans_solde' | 'mission_officielle' | 'formation' | 'autre';
  startDate: Date;
  endDate: Date;
  duration: number;
  reason: string;
  justification?: {
    hasDocument: boolean;
    documentType?: 'certificat_medical' | 'autorisation_administrative' | 'ordre_mission' | 'autre';
    documentUrl?: string;
    verified: boolean;
  };
  replacement?: {
    replacementStaffId?: string;
    replacementStaffName?: string;
    tasks: string[];
  };
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  approvedBy?: string;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdministrativeTask {
  id: string;
  title: string;
  description: string;
  assignedTo: string[];
  assignedBy: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  dueDate: Date;
  estimatedHours: number;
  actualHours?: number;
  category: 'administrative' | 'technical' | 'maintenance' | 'security' | 'other';
  relatedService: string;
  attachments?: string[];
  comments?: Array<{
    id: string;
    author: string;
    message: string;
    createdAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdministrativeStatistics {
  totalStaff: number;
  byContractType: Record<string, number>;
  byService: Record<string, number>;
  byStatus: Record<string, number>;
  averageSalary: number;
  upcomingRetirements: Array<{
    staffId: string;
    staffName: string;
    retirementDate: Date;
  }>;
  absenceRate: number;
  taskCompletionRate: number;
}

// Configuration des services et postes
export interface ServiceConfiguration {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PositionConfiguration {
  id: string;
  name: string;
  description?: string;
  serviceId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
