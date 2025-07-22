
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

interface ExcelExporterProps {
  allEchelons: Echelon[];
  eligibleEchelons: Echelon[];
}

const determineEmployeeType = (grade: string): string => {
  const teachingGrades = [
    'Assistant', 'Maitre Assistant A', 'Maitre Assistant B', 
    'Maitre de Conférences B', 'Maitre de Conférences A', 'Professeur'
  ];
  return teachingGrades.includes(grade) ? 'Personnel Enseignant' : 'Personnel Administratif';
};

const getDurationCategory = (echelon: Echelon): { category: string; priority: string; urgency: string } => {
  const overdue = echelon.yearsInEchelon - echelon.requiredYears;
  
  if (overdue >= 3) {
    return {
      category: 'Courte durée',
      priority: 'Haute',
      urgency: 'URGENT - Traitement immédiat'
    };
  } else if (overdue >= 1) {
    return {
      category: 'Moyenne durée',
      priority: 'Moyenne',
      urgency: 'Standard - Dans les 6 mois'
    };
  } else {
    return {
      category: 'Longue durée',
      priority: 'Normale',
      urgency: 'Normal - Dans l\'année'
    };
  }
};

const calculateFinancialImpact = (echelon: Echelon): { newSalary: number; increase: number; percentage: string } => {
  const newSalary = Math.round(echelon.salary * 1.12); // 12% d'augmentation moyenne
  const increase = newSalary - echelon.salary;
  const percentage = ((increase / echelon.salary) * 100).toFixed(1);
  
  return { newSalary, increase, percentage };
};

const downloadExcel = (csvContent: string, filename: string) => {
  // Ajouter BOM pour l'UTF-8 dans Excel
  const BOM = '\uFEFF';
  const csvWithBOM = BOM + csvContent;
  
  const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const ExcelExporter: React.FC<ExcelExporterProps> = ({ 
  allEchelons, 
  eligibleEchelons 
}) => {
  const { toast } = useToast();

  const exportCompleteReport = () => {
    const csvHeader = [
      'N° Dossier',
      'Nom et Prénom',
      'Type Personnel',
      'Grade',
      'Échelon Actuel',
      'Échelon Proposé',
      'Date Dernière Promotion',
      'Ancienneté (Années)',
      'Durée Requise (Années)',
      'Excédent (Années)',
      'Catégorie Commission',
      'Niveau Priorité',
      'Recommandation Urgence',
      'Salaire Actuel (DA)',
      'Nouveau Salaire (DA)',
      'Augmentation (DA)',
      'Pourcentage Augmentation',
      'Impact Budgétaire Annuel',
      'Statut Éligibilité',
      'Date Prochaine Éligibilité',
      'Observations Commission',
      'Recommandations'
    ].join(';');

    const csvRows = allEchelons.map((echelon, index) => {
      const employeeType = determineEmployeeType(echelon.currentGrade);
      const durationInfo = getDurationCategory(echelon);
      const financialImpact = calculateFinancialImpact(echelon);
      const overdue = echelon.yearsInEchelon - echelon.requiredYears;
      const annualImpact = financialImpact.increase * 12; // Impact annuel
      
      const observations = echelon.isEligible ? 
        (overdue >= 3 ? 'DOSSIER URGENT - Retard significatif' : 
         overdue >= 1 ? 'Dossier standard - Critères remplis' : 
         'Nouvellement éligible - Évaluation recommandée') : 
        'Non éligible actuellement';

      const recommendations = echelon.isEligible ?
        `Promotion recommandée - ${durationInfo.urgency}` :
        'Attendre prochaine période d\'éligibilité';

      return [
        `"DOSS-ECH-${(index + 1).toString().padStart(4, '0')}"`,
        `"${echelon.teacherName}"`,
        `"${employeeType}"`,
        `"${echelon.currentGrade}"`,
        echelon.currentEchelon,
        echelon.nextEchelon,
        `"${echelon.datePromotion.toLocaleDateString('fr-FR')}"`,
        echelon.yearsInEchelon,
        echelon.requiredYears,
        overdue,
        `"${durationInfo.category}"`,
        `"${durationInfo.priority}"`,
        `"${durationInfo.urgency}"`,
        echelon.salary.toLocaleString('fr-FR'),
        financialImpact.newSalary.toLocaleString('fr-FR'),
        financialImpact.increase.toLocaleString('fr-FR'),
        `"${financialImpact.percentage}%"`,
        annualImpact.toLocaleString('fr-FR'),
        echelon.isEligible ? '"Éligible"' : '"Non éligible"',
        `"${echelon.nextPromotionDate.toLocaleDateString('fr-FR')}"`,
        `"${observations}"`,
        `"${recommendations}"`
      ].join(';');
    });

    const csvContent = [csvHeader, ...csvRows].join('\n');
    const filename = `rapport_complet_echelons_commission_${new Date().toISOString().split('T')[0]}.csv`;
    
    downloadExcel(csvContent, filename);

    toast({
      title: "Export Excel Complet",
      description: `Rapport complet pour ${allEchelons.length} employés exporté avec succès`,
      duration: 4000
    });
  };

  const exportEligibleOnly = () => {
    const csvHeader = [
      'N° Dossier',
      'Nom et Prénom',
      'Type Personnel',
      'Grade',
      'Progression Échelon',
      'Catégorie Durée',
      'Priorité',
      'Années Excédent',
      'Impact Financier (DA)',
      'Recommandation Commission'
    ].join(';');

    const csvRows = eligibleEchelons.map((echelon, index) => {
      const employeeType = determineEmployeeType(echelon.currentGrade);
      const durationInfo = getDurationCategory(echelon);
      const financialImpact = calculateFinancialImpact(echelon);
      const overdue = echelon.yearsInEchelon - echelon.requiredYears;

      return [
        `"ELIG-${(index + 1).toString().padStart(3, '0')}"`,
        `"${echelon.teacherName}"`,
        `"${employeeType}"`,
        `"${echelon.currentGrade}"`,
        `"${echelon.currentEchelon} → ${echelon.nextEchelon}"`,
        `"${durationInfo.category}"`,
        `"${durationInfo.priority}"`,
        overdue,
        financialImpact.increase.toLocaleString('fr-FR'),
        `"${durationInfo.urgency}"`
      ].join(';');
    });

    const csvContent = [csvHeader, ...csvRows].join('\n');
    const filename = `employes_eligibles_echelons_${new Date().toISOString().split('T')[0]}.csv`;
    
    downloadExcel(csvContent, filename);

    toast({
      title: "Export Employés Éligibles",
      description: `${eligibleEchelons.length} employés éligibles exportés`,
      duration: 3000
    });
  };

  const exportByCategory = () => {
    // Grouper par catégorie de durée
    const categories = {
      'Courte durée': [],
      'Moyenne durée': [],
      'Longue durée': []
    };

    eligibleEchelons.forEach(echelon => {
      const durationInfo = getDurationCategory(echelon);
      categories[durationInfo.category].push(echelon);
    });

    // Export pour chaque catégorie
    Object.entries(categories).forEach(([categoryName, echelons]) => {
      if (echelons.length === 0) return;

      const csvHeader = [
        'Nom et Prénom',
        'Grade',
        'Échelon Actuel → Proposé',
        'Années Excédent',
        'Salaire Actuel',
        'Nouveau Salaire',
        'Augmentation',
        'Priorité'
      ].join(';');

      const csvRows = echelons.map(echelon => {
        const financialImpact = calculateFinancialImpact(echelon);
        const overdue = echelon.yearsInEchelon - echelon.requiredYears;
        const priority = categoryName === 'Courte durée' ? 'URGENT' : 
                        categoryName === 'Moyenne durée' ? 'STANDARD' : 'NORMAL';

        return [
          `"${echelon.teacherName}"`,
          `"${echelon.currentGrade}"`,
          `"${echelon.currentEchelon} → ${echelon.nextEchelon}"`,
          overdue,
          echelon.salary.toLocaleString('fr-FR'),
          financialImpact.newSalary.toLocaleString('fr-FR'),
          financialImpact.increase.toLocaleString('fr-FR'),
          `"${priority}"`
        ].join(';');
      });

      const csvContent = [csvHeader, ...csvRows].join('\n');
      const filename = `${categoryName.toLowerCase().replace(' ', '_')}_${new Date().toISOString().split('T')[0]}.csv`;
      
      downloadExcel(csvContent, filename);
    });

    toast({
      title: "Export par Catégorie",
      description: "Fichiers séparés générés pour chaque catégorie de durée",
      duration: 3000
    });
  };

  return (
    <div className="flex gap-2 flex-wrap">
      <Button 
        onClick={exportCompleteReport}
        className="bg-green-600 hover:bg-green-700"
      >
        <FileSpreadsheet className="h-4 w-4 mr-2" />
        Export Excel Complet ({allEchelons.length})
      </Button>

      <Button 
        onClick={exportEligibleOnly}
        className="bg-blue-600 hover:bg-blue-700"
        disabled={eligibleEchelons.length === 0}
      >
        <Download className="h-4 w-4 mr-2" />
        Éligibles Seulement ({eligibleEchelons.length})
      </Button>

      <Button 
        onClick={exportByCategory}
        variant="outline"
        className="border-orange-600 text-orange-600 hover:bg-orange-50"
        disabled={eligibleEchelons.length === 0}
      >
        <FileSpreadsheet className="h-4 w-4 mr-2" />
        Export par Catégorie
      </Button>
    </div>
  );
};
