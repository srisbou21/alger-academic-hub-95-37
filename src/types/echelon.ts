
export interface Echelon {
  id: string;
  grade: string;
  echelon: number;
  indice: number;
  salaire_base: number;
  prime_rendement: number;
  indemnite_experience: number;
  anciennete_requise: number; // en années
  description: string;
  statut: 'actif' | 'inactif';
  date_creation: Date;
  date_modification?: Date;
}

export interface GradeEchelon {
  grade: string;
  echelons: Echelon[];
  statut_grade: 'actif' | 'suspendu';
}

export interface TeacherEchelon {
  teacher_id: string;
  echelon_id: string;
  date_affectation: Date;
  date_fin?: Date;
  motif_changement?: string;
  statut: 'actuel' | 'historique';
}

export const GRADES_FONCTION_PUBLIQUE = [
  'Professeur',
  'Maitre de Conférences A',
  'Maitre de Conférences B', 
  'Maitre Assistant A',
  'Maitre Assistant B',
  'Assistant',
  'Attaché d\'Enseignement',
  'Vacataire'
] as const;

export type GradeFonctionPublique = typeof GRADES_FONCTION_PUBLIQUE[number];
