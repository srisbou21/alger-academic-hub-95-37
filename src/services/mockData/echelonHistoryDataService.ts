export interface ExtendedEchelonHistory {
  id: string;
  employeeId: string;
  employeeName: string;
  previousEchelon: number;
  newEchelon: number;
  grade: string;
  promotionDate: Date;
  acquisitionDate: Date;
  duration: 'moyenne';
  durationMonths: 36;
  reason: string;
  processedBy: string;
}

export const createExtendedEchelonHistory = (): ExtendedEchelonHistory[] => {
  const now = new Date();
  
  return [
    {
      id: 'hist_ext_001',
      employeeId: 'emp007',
      employeeName: 'Dr. Youcef Hamidi',
      previousEchelon: 5,
      newEchelon: 6,
      grade: 'Maitre de Conférences B',
      promotionDate: new Date(now.getTime() - 35 * 30 * 24 * 60 * 60 * 1000),
      acquisitionDate: new Date(now.getTime() + 1 * 30 * 24 * 60 * 60 * 1000),
      duration: 'moyenne' as const,
      durationMonths: 36 as const,
      reason: 'Recherche et publications de qualité',
      processedBy: 'Conseil Scientifique'
    },
    {
      id: 'hist_ext_002',
      employeeId: 'emp008',
      employeeName: 'Mme. Soraya Mansouri',
      previousEchelon: 3,
      newEchelon: 4,
      grade: 'Secrétaire Principal',
      promotionDate: new Date(now.getTime() - 32 * 30 * 24 * 60 * 60 * 1000),
      acquisitionDate: new Date(now.getTime() + 4 * 30 * 24 * 60 * 60 * 1000),
      duration: 'moyenne' as const,
      durationMonths: 36 as const,
      reason: 'Efficacité administrative remarquable',
      processedBy: 'Service RH'
    },
    {
      id: 'hist_ext_003',
      employeeId: 'emp010',
      employeeName: 'M. Omar Zidane',
      previousEchelon: 7,
      newEchelon: 8,
      grade: 'Ingénieur d\'Application',
      promotionDate: new Date(now.getTime() - 31 * 30 * 24 * 60 * 60 * 1000),
      acquisitionDate: new Date(now.getTime() + 5 * 30 * 24 * 60 * 60 * 1000),
      duration: 'moyenne' as const,
      durationMonths: 36 as const,
      reason: 'Innovation technologique et support technique',
      processedBy: 'Direction Technique'
    },
    {
      id: 'hist_ext_004',
      employeeId: 'emp011',
      employeeName: 'Dr. Nabila Bouchenak',
      previousEchelon: 4,
      newEchelon: 5,
      grade: 'Maitre de Conférences A',
      promotionDate: new Date(now.getTime() - 38 * 30 * 24 * 60 * 60 * 1000),
      acquisitionDate: new Date(now.getTime() - 2 * 30 * 24 * 60 * 60 * 1000),
      duration: 'moyenne' as const,
      durationMonths: 36 as const,
      reason: 'Excellence pédagogique et recherche',
      processedBy: 'Commission Pédagogique'
    }
  ];
};