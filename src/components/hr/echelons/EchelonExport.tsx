
import React from 'react';
import { ExcelExporter } from './export/ExcelExporter';
import { CommissionReportExporter } from './export/CommissionReportExporter';

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

interface EchelonExportProps {
  eligibleEchelons: Echelon[];
  allEchelons?: Echelon[];
}

export const EchelonExport: React.FC<EchelonExportProps> = ({ 
  eligibleEchelons, 
  allEchelons = [] 
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-sm font-medium text-slate-600">Exportations Excel :</h3>
      </div>
      <ExcelExporter 
        allEchelons={allEchelons} 
        eligibleEchelons={eligibleEchelons} 
      />
      
      <div className="flex items-center gap-2 mb-2 mt-4">
        <h3 className="text-sm font-medium text-slate-600">Rapports Commission :</h3>
      </div>
      <CommissionReportExporter eligibleEchelons={eligibleEchelons} />
    </div>
  );
};
