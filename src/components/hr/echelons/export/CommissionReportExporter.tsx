
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileSpreadsheet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { determineEmployeeType, determinePriority, calculateNewSalary, generateRecommendations, downloadCSV } from './ExportUtils';

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

interface CommissionReportExporterProps {
  eligibleEchelons: Echelon[];
}

export const CommissionReportExporter: React.FC<CommissionReportExporterProps> = ({ eligibleEchelons }) => {
  const { toast } = useToast();

  const exportCommissionReport = () => {
    const csvHeader = [
      'N° Dossier',
      'Nom et Prénom',
      'Type de Personnel',
      'Grade Actuel',
      'Échelon Actuel',
      'Échelon Proposé',
      'Date Dernière Promotion',
      'Années dans Échelon',
      'Années Requises',
      'Excédent (Années)',
      'Catégorie Commission',
      'Délai Recommandé',
      'Priorité',
      'Salaire Actuel (DA)',
      'Nouveau Salaire Proposé (DA)',
      'Augmentation (DA)',
      'Pourcentage Augmentation',
      'Observations',
      'Recommandations de la Commission',
      'Date Éligibilité',
      'Statut Dossier'
    ].join(',');

    const csvRows = eligibleEchelons.map((echelon, index) => {
      const employeeType = determineEmployeeType(echelon.currentGrade);
      const priorityInfo = determinePriority(echelon);
      const newSalary = calculateNewSalary(echelon.salary);
      const salaryIncrease = newSalary - echelon.salary;
      const percentageIncrease = ((salaryIncrease / echelon.salary) * 100).toFixed(1);
      const recommendations = generateRecommendations(echelon);
      const overdue = echelon.yearsInEchelon - echelon.requiredYears;

      return [
        `"DOSS-${(index + 1).toString().padStart(4, '0')}"`,
        `"${echelon.teacherName}"`,
        `"${employeeType}"`,
        `"${echelon.currentGrade}"`,
        echelon.currentEchelon,
        echelon.nextEchelon,
        `"${echelon.datePromotion.toLocaleDateString('fr-FR')}"`,
        echelon.yearsInEchelon,
        echelon.requiredYears,
        overdue,
        `"${priorityInfo.category}"`,
        `"${priorityInfo.duration}"`,
        `"${priorityInfo.priority}"`,
        echelon.salary.toLocaleString('fr-FR'),
        newSalary.toLocaleString('fr-FR'),
        salaryIncrease.toLocaleString('fr-FR'),
        `"${percentageIncrease}%"`,
        `"${recommendations}"`,
        '"À déterminer par la commission"',
        `"${echelon.nextPromotionDate.toLocaleDateString('fr-FR')}"`,
        '"En cours d\'examen"'
      ].join(',');
    });

    const csvContent = [csvHeader, ...csvRows].join('\n');
    const filename = `rapport_commission_echelons_${new Date().toISOString().split('T')[0]}.csv`;
    
    downloadCSV(csvContent, filename);

    toast({
      title: "Rapport Commission Généré",
      description: `Rapport détaillé pour ${eligibleEchelons.length} employés éligibles exporté avec succès`,
      duration: 4000
    });
  };

  return (
    <Button 
      onClick={exportCommissionReport} 
      className="bg-green-600 hover:bg-green-700"
      disabled={eligibleEchelons.length === 0}
    >
      <FileSpreadsheet className="h-4 w-4 mr-2" />
      Rapport Commission ({eligibleEchelons.length})
    </Button>
  );
};
