
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { determinePriority, calculateNewSalary, downloadCSV } from './ExportUtils';

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

interface CategoryExporterProps {
  eligibleEchelons: Echelon[];
}

export const CategoryExporter: React.FC<CategoryExporterProps> = ({ eligibleEchelons }) => {
  const { toast } = useToast();

  const exportByDurationCategory = () => {
    const categorizedData = eligibleEchelons.reduce((acc, echelon) => {
      const priorityInfo = determinePriority(echelon);
      if (!acc[priorityInfo.category]) {
        acc[priorityInfo.category] = [];
      }
      acc[priorityInfo.category].push(echelon);
      return acc;
    }, {} as Record<string, Echelon[]>);

    Object.entries(categorizedData).forEach(([category, echelons]) => {
      const csvHeader = [
        'Nom Complet',
        'Grade',
        'Échelon Actuel → Proposé',
        'Années en Excédent',
        'Salaire Actuel',
        'Impact Financier',
        'Recommandation'
      ].join(',');

      const csvRows = echelons.map(echelon => {
        const overdue = echelon.yearsInEchelon - echelon.requiredYears;
        const newSalary = calculateNewSalary(echelon.salary);
        const impact = newSalary - echelon.salary;

        return [
          `"${echelon.teacherName}"`,
          `"${echelon.currentGrade}"`,
          `"${echelon.currentEchelon} → ${echelon.nextEchelon}"`,
          overdue,
          echelon.salary.toLocaleString('fr-FR'),
          `"+${impact.toLocaleString('fr-FR')} DA"`,
          category === 'Courte durée' ? '"URGENT"' : category === 'Moyenne durée' ? '"STANDARD"' : '"NORMAL"'
        ].join(',');
      });

      const csvContent = [csvHeader, ...csvRows].join('\n');
      const filename = `${category.toLowerCase().replace(' ', '_')}_${new Date().toISOString().split('T')[0]}.csv`;
      
      downloadCSV(csvContent, filename);
    });

    toast({
      title: "Exports par Catégorie",
      description: "Fichiers séparés générés pour chaque catégorie de durée",
      duration: 3000
    });
  };

  return (
    <Button 
      onClick={exportByDurationCategory} 
      className="bg-orange-600 hover:bg-orange-700"
      disabled={eligibleEchelons.length === 0}
    >
      <FileText className="h-4 w-4 mr-2" />
      Export par Durée
    </Button>
  );
};
