
export const determineEmployeeType = (grade: string): string => {
  const teachingGrades = [
    'Assistant', 'Maitre Assistant A', 'Maitre Assistant B', 
    'Maitre de Conférences B', 'Maitre de Conférences A', 'Professeur'
  ];
  return teachingGrades.includes(grade) ? 'Personnel Enseignant' : 'Personnel Administratif';
};

export const determinePriority = (echelon: any): { category: string; duration: string; priority: string } => {
  const overdue = echelon.yearsInEchelon - echelon.requiredYears;
  
  if (overdue >= 3) {
    return {
      category: 'Courte durée',
      duration: 'Immédiate',
      priority: 'Priorité haute'
    };
  } else if (overdue >= 1) {
    return {
      category: 'Moyenne durée',
      duration: 'Dans les 6 mois',
      priority: 'Priorité moyenne'
    };
  } else {
    return {
      category: 'Longue durée',
      duration: 'Dans l\'année',
      priority: 'Priorité normale'
    };
  }
};

export const calculateNewSalary = (currentSalary: number): number => {
  return Math.round(currentSalary * 1.1);
};

export const generateRecommendations = (echelon: any): string => {
  const overdue = echelon.yearsInEchelon - echelon.requiredYears;
  const recommendations = [];

  if (overdue >= 3) {
    recommendations.push('RECOMMANDATION FORTE : Promotion immédiate recommandée');
    recommendations.push('Retard significatif dans la progression de carrière');
  } else if (overdue >= 1) {
    recommendations.push('Candidat standard pour promotion');
    recommendations.push('Répond aux critères réglementaires');
  } else {
    recommendations.push('Nouvellement éligible - Évaluation détaillée nécessaire');
  }

  if (echelon.salary < 60000) {
    recommendations.push('Salaire en dessous de la moyenne du grade');
  }

  const employeeType = determineEmployeeType(echelon.currentGrade);
  if (employeeType === 'Personnel Enseignant') {
    recommendations.push('Personnel enseignant - Vérifier charge pédagogique');
  } else {
    recommendations.push('Personnel administratif - Vérifier performance administrative');
  }

  return recommendations.join(' | ');
};

export const downloadCSV = (csvContent: string, filename: string) => {
  const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
