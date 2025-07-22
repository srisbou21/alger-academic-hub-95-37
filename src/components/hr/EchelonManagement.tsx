
import React from 'react';
import { AutomaticTrackingDashboard } from './advancement/AutomaticTrackingDashboard';

// Données d'exemple d'employés pour le système
const mockEmployees = [
  {
    id: '1',
    name: 'Dr. Ahmed Benali',
    type: 'enseignant' as const,
    grade: 'Maitre de Conférences A',
    currentEchelon: 3,
    appointmentDate: new Date('2021-01-15'),
    lastEvaluationScore: 18.5,
    status: 'active' as const
  },
  {
    id: '2',
    name: 'Mme. Fatima Khelifi',
    type: 'administratif' as const,
    grade: 'Attaché Principal',
    currentEchelon: 5,
    appointmentDate: new Date('2021-03-20'),
    lastEvaluationScore: 16.2,
    status: 'active' as const
  },
  {
    id: '3',
    name: 'Dr. Mohamed Saidi',
    type: 'enseignant' as const,
    grade: 'Professeur',
    currentEchelon: 8,
    appointmentDate: new Date('2021-06-10'),
    lastEvaluationScore: 14.8,
    status: 'active' as const
  },
  {
    id: '4',
    name: 'M. Karim Boudjemaa',
    type: 'administratif' as const,
    grade: 'Administrateur',
    currentEchelon: 7,
    appointmentDate: new Date('2021-09-05'),
    lastEvaluationScore: 17.3,
    status: 'active' as const
  },
  {
    id: '5',
    name: 'Dr. Amina Cherifi',
    type: 'enseignant' as const,
    grade: 'Maitre Assistant A',
    currentEchelon: 4,
    appointmentDate: new Date('2020-11-12'),
    lastEvaluationScore: 19.1,
    status: 'active' as const
  }
];

export const EchelonManagement = () => {
  return <AutomaticTrackingDashboard employees={mockEmployees} />;
};
