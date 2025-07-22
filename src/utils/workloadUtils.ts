// Fonctions utilitaires pour la gestion des charges d'enseignement

export const normalizeString = (str: string): string => {
  return str.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
    .trim();
};

export const getWorkloadStatus = (totalHours: number, maxHours: number): 'normal' | 'overload' | 'underload' => {
  if (totalHours > maxHours) return 'overload';
  if (totalHours < maxHours * 0.8) return 'underload';
  return 'normal';
};

export const getMaxHoursByGrade = (grade: string): number => {
  // Définir les heures maximales selon le grade
  const gradeHours: Record<string, number> = {
    'Professeur': 120,
    'Maitre de Conférences': 150,
    'Maitre Assistant': 180,
    'Assistant': 200,
    'Vacataire': 240
  };
  
  return gradeHours[grade] || 180; // Valeur par défaut
};

export const createTeacherWithWorkload = (
  teacher: any, 
  assignments: any[]
) => {
  const teacherAssignments = assignments.filter(a => a.teacherId === teacher.id);
  const totalHours = teacherAssignments.reduce((sum, a) => sum + a.totalHours, 0);
  const maxHours = getMaxHoursByGrade(teacher.grade);
  const status = getWorkloadStatus(totalHours, maxHours);

  return {
    ...teacher,
    assignments: teacherAssignments,
    totalHours,
    maxHours,
    status
  };
};

export const filterTeachersByWorkload = (
  teacher: any,
  assignments: any[],
  filters: {
    searchTerm: string;
    selectedSpecialty: string;
    selectedSemester: string;
    selectedModule: string;
    selectedTarget: string;
  }
) => {
  const { searchTerm, selectedSpecialty, selectedSemester, selectedModule, selectedTarget } = filters;

  // Filtre par terme de recherche (nom/prénom)
  if (searchTerm) {
    const normalizedSearch = normalizeString(searchTerm);
    const normalizedName = normalizeString(teacher.name);
    
    if (!normalizedName.includes(normalizedSearch)) {
      return false;
    }
  }

  // Fonctions de vérification des charges
  const teacherHasWorkloadInSpecialty = (teacherId: string, specialtyId: string): boolean => {
    return assignments.some(assignment => 
      assignment.teacherId === teacherId && assignment.specialtyId === specialtyId
    );
  };

  const teacherHasWorkloadInSemester = (teacherId: string, semester: string): boolean => {
    return assignments.some(assignment => 
      assignment.teacherId === teacherId && assignment.semester === semester
    );
  };

  const teacherHasWorkloadInModule = (teacherId: string, moduleId: string): boolean => {
    return assignments.some(assignment => 
      assignment.teacherId === teacherId && assignment.moduleId === moduleId
    );
  };

  const teacherHasWorkloadForTarget = (teacherId: string, targetId: string): boolean => {
    return assignments.some(assignment => 
      assignment.teacherId === teacherId && assignment.targetAudience.id === targetId
    );
  };

  // Application des filtres
  if (selectedSpecialty && selectedSpecialty !== 'all' && !teacherHasWorkloadInSpecialty(teacher.id, selectedSpecialty)) {
    return false;
  }

  if (selectedSemester && selectedSemester !== 'all' && !teacherHasWorkloadInSemester(teacher.id, selectedSemester)) {
    return false;
  }

  if (selectedModule && selectedModule !== 'all' && !teacherHasWorkloadInModule(teacher.id, selectedModule)) {
    return false;
  }

  if (selectedTarget && selectedTarget !== 'all' && !teacherHasWorkloadForTarget(teacher.id, selectedTarget)) {
    return false;
  }

  return true;
};

export const getWorkloadStatistics = (teachers: any[]) => {
  const totalTeachers = teachers.length;
  const overloadedTeachers = teachers.filter(t => t.status === 'overload').length;
  const underloadedTeachers = teachers.filter(t => t.status === 'underload').length;
  const totalHours = teachers.reduce((sum, t) => sum + t.totalHours, 0);
  
  return { totalTeachers, overloadedTeachers, underloadedTeachers, totalHours };
};