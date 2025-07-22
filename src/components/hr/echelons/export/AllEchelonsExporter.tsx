
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { determineEmployeeType, downloadCSV } from './ExportUtils';

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

interface AllEchelonsExporterProps {
  allEchelons: Echelon[];
}

export const AllEchelonsExporter: React.FC<AllEchelonsExporterProps> = ({ allEchelons }) => {
  const { toast } = useToast();

  const exportAllEchelons = () => {
    const csvHeader = [
      'Nom Complet',
      'Type Employé', 
      'Grade',
      'Échelon Actuel',
      'Années dans Échelon',
      'Années Requises',
      'Salaire (DA)',
      'Statut',
      'Prochaine Éligibilité'
    ].join(',');

    const csvRows = allEchelons.map(echelon => {
      const employeeType = determineEmployeeType(echelon.currentGrade);
      const nextEligibilityDate = new Date(echelon.datePromotion);
      nextEligibilityDate.setFullYear(nextEligibilityDate.getFullYear() + echelon.requiredYears);

      return [
        `"${echelon.teacherName}"`,
        `"${employeeType}"`,
        `"${echelon.currentGrade}"`,
        echelon.currentEchelon,
        echelon.yearsInEchelon,
        echelon.requiredYears,
        echelon.salary.toLocaleString('fr-FR'),
        echelon.isEligible ? 'Éligible' : 'Non éligible',
        `"${nextEligibilityDate.toLocaleDateString('fr-FR')}"`
      ].join(',');
    });

    const csvContent = [csvHeader, ...csvRows].join('\n');
    const filename = `tous_echelons_${new Date().toISOString().split('T')[0]}.csv`;
    
    downloadCSV(csvContent, filename);

    toast({
      title: "Export complet réussi",
      description: `${allEchelons.length} employés exportés`,
      duration: 3000
    });
  };

  return (
    <Button 
      onClick={exportAllEchelons}
      variant="outline"
      className="border-blue-600 text-blue-600 hover:bg-blue-50"
    >
      <Download className="h-4 w-4 mr-2" />
      Export Complet ({allEchelons.length})
    </Button>
  );
};
