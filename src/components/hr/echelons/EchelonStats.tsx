
import React from 'react';

interface Echelon {
  id: string;
  teacherId: string;
  teacherName: string;
  currentGrade: string;
  currentEchelon: number;
  nextEchelon: number;
  datePromotion: Date;
  nextPromotionDate: Date;
  yearsInEchelon: number;
  requiredYears: number;
  isEligible: boolean;
  salary: number;
  status: 'active' | 'pending' | 'promoted';
}

interface EchelonStatsProps {
  echelons: Echelon[];
  eligibleCount: number;
}

export const EchelonStats: React.FC<EchelonStatsProps> = ({
  echelons,
  eligibleCount
}) => {
  const promotedThisYear = echelons.filter(e => e.status === 'promoted').length;
  const totalEchelons = echelons.length;
  const averageSalary = echelons.length > 0 ? 
    echelons.reduce((sum, e) => sum + e.salary, 0) / echelons.length : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="text-center p-4 bg-blue-50 rounded-lg">
        <p className="text-2xl font-bold text-blue-600">{eligibleCount}</p>
        <p className="text-sm text-blue-800">Éligibles</p>
      </div>
      <div className="text-center p-4 bg-green-50 rounded-lg">
        <p className="text-2xl font-bold text-green-600">{promotedThisYear}</p>
        <p className="text-sm text-green-800">Promus cette année</p>
      </div>
      <div className="text-center p-4 bg-purple-50 rounded-lg">
        <p className="text-2xl font-bold text-purple-600">{totalEchelons}</p>
        <p className="text-sm text-purple-800">Total Personnel</p>
      </div>
      <div className="text-center p-4 bg-orange-50 rounded-lg">
        <p className="text-2xl font-bold text-orange-600">{Math.round(averageSalary / 1000)}k</p>
        <p className="text-sm text-orange-800">Salaire Moyen</p>
      </div>
    </div>
  );
};
