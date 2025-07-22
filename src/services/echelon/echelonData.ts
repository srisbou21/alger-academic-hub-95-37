
import { GradeEchelon } from '../../types/echelon';

export const getDefaultEchelons = (): GradeEchelon[] => {
  return [
    {
      grade: 'Professeur',
      statut_grade: 'actif',
      echelons: [
        { id: 'prof_1', grade: 'Professeur', echelon: 1, indice: 1050, salaire_base: 126000, prime_rendement: 15000, indemnite_experience: 8000, anciennete_requise: 0, description: 'Professeur - Échelon 1', statut: 'actif', date_creation: new Date() },
        { id: 'prof_2', grade: 'Professeur', echelon: 2, indice: 1100, salaire_base: 132000, prime_rendement: 16000, indemnite_experience: 9000, anciennete_requise: 3, description: 'Professeur - Échelon 2', statut: 'actif', date_creation: new Date() },
        { id: 'prof_3', grade: 'Professeur', echelon: 3, indice: 1150, salaire_base: 138000, prime_rendement: 17000, indemnite_experience: 10000, anciennete_requise: 6, description: 'Professeur - Échelon 3', statut: 'actif', date_creation: new Date() }
      ]
    },
    {
      grade: 'Maitre de Conférences A',
      statut_grade: 'actif',
      echelons: [
        { id: 'mca_1', grade: 'Maitre de Conférences A', echelon: 1, indice: 900, salaire_base: 108000, prime_rendement: 12000, indemnite_experience: 6000, anciennete_requise: 0, description: 'MCF A - Échelon 1', statut: 'actif', date_creation: new Date() },
        { id: 'mca_2', grade: 'Maitre de Conférences A', echelon: 2, indice: 950, salaire_base: 114000, prime_rendement: 13000, indemnite_experience: 7000, anciennete_requise: 3, description: 'MCF A - Échelon 2', statut: 'actif', date_creation: new Date() },
        { id: 'mca_3', grade: 'Maitre de Conférences A', echelon: 3, indice: 1000, salaire_base: 120000, prime_rendement: 14000, indemnite_experience: 8000, anciennete_requise: 6, description: 'MCF A - Échelon 3', statut: 'actif', date_creation: new Date() }
      ]
    },
    {
      grade: 'Maitre de Conférences B',
      statut_grade: 'actif',
      echelons: [
        { id: 'mcb_1', grade: 'Maitre de Conférences B', echelon: 1, indice: 750, salaire_base: 90000, prime_rendement: 10000, indemnite_experience: 5000, anciennete_requise: 0, description: 'MCF B - Échelon 1', statut: 'actif', date_creation: new Date() },
        { id: 'mcb_2', grade: 'Maitre de Conférences B', echelon: 2, indice: 800, salaire_base: 96000, prime_rendement: 11000, indemnite_experience: 6000, anciennete_requise: 3, description: 'MCF B - Échelon 2', statut: 'actif', date_creation: new Date() },
        { id: 'mcb_3', grade: 'Maitre de Conférences B', echelon: 3, indice: 850, salaire_base: 102000, prime_rendement: 12000, indemnite_experience: 7000, anciennete_requise: 6, description: 'MCF B - Échelon 3', statut: 'actif', date_creation: new Date() }
      ]
    },
    {
      grade: 'Maitre Assistant A',
      statut_grade: 'actif',
      echelons: [
        { id: 'maa_1', grade: 'Maitre Assistant A', echelon: 1, indice: 600, salaire_base: 72000, prime_rendement: 8000, indemnite_experience: 4000, anciennete_requise: 0, description: 'MA A - Échelon 1', statut: 'actif', date_creation: new Date() },
        { id: 'maa_2', grade: 'Maitre Assistant A', echelon: 2, indice: 650, salaire_base: 78000, prime_rendement: 9000, indemnite_experience: 5000, anciennete_requise: 3, description: 'MA A - Échelon 2', statut: 'actif', date_creation: new Date() },
        { id: 'maa_3', grade: 'Maitre Assistant A', echelon: 3, indice: 700, salaire_base: 84000, prime_rendement: 10000, indemnite_experience: 6000, anciennete_requise: 6, description: 'MA A - Échelon 3', statut: 'actif', date_creation: new Date() }
      ]
    },
    {
      grade: 'Maitre Assistant B',
      statut_grade: 'actif',
      echelons: [
        { id: 'mab_1', grade: 'Maitre Assistant B', echelon: 1, indice: 500, salaire_base: 60000, prime_rendement: 6000, indemnite_experience: 3000, anciennete_requise: 0, description: 'MA B - Échelon 1', statut: 'actif', date_creation: new Date() },
        { id: 'mab_2', grade: 'Maitre Assistant B', echelon: 2, indice: 550, salaire_base: 66000, prime_rendement: 7000, indemnite_experience: 4000, anciennete_requise: 3, description: 'MA B - Échelon 2', statut: 'actif', date_creation: new Date() },
        { id: 'mab_3', grade: 'Maitre Assistant B', echelon: 3, indice: 600, salaire_base: 72000, prime_rendement: 8000, indemnite_experience: 5000, anciennete_requise: 6, description: 'MA B - Échelon 3', statut: 'actif', date_creation: new Date() }
      ]
    },
    {
      grade: 'Assistant',
      statut_grade: 'actif',
      echelons: [
        { id: 'ass_1', grade: 'Assistant', echelon: 1, indice: 400, salaire_base: 48000, prime_rendement: 4000, indemnite_experience: 2000, anciennete_requise: 0, description: 'Assistant - Échelon 1', statut: 'actif', date_creation: new Date() },
        { id: 'ass_2', grade: 'Assistant', echelon: 2, indice: 450, salaire_base: 54000, prime_rendement: 5000, indemnite_experience: 3000, anciennete_requise: 3, description: 'Assistant - Échelon 2', statut: 'actif', date_creation: new Date() },
        { id: 'ass_3', grade: 'Assistant', echelon: 3, indice: 500, salaire_base: 60000, prime_rendement: 6000, indemnite_experience: 4000, anciennete_requise: 6, description: 'Assistant - Échelon 3', statut: 'actif', date_creation: new Date() }
      ]
    }
  ];
};
