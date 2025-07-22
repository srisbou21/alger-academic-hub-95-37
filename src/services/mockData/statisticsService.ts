import { MockEmployee } from '../mockDataService';
import { echelonHistoryService } from '../echelonHistoryService';

export interface SystemStats {
  totalEmployees: number;
  teachers: number;
  administrative: number;
  eligibleForAutoTracking: number;
  averageEchelon: number;
  departmentBreakdown: Record<string, number>;
}

export const calculateSystemStats = (employees: MockEmployee[]): SystemStats => {
  const activeEmployees = employees.filter(emp => emp.status === 'active');
  const teachers = activeEmployees.filter(emp => emp.type === 'enseignant');
  const admin = activeEmployees.filter(emp => emp.type === 'administratif');
  
  // Calculer les employés éligibles au suivi automatique
  const eligibleForTracking = activeEmployees.filter(emp => {
    const monthsSincePromotion = echelonHistoryService.calculateMonthsSinceLastPromotion(emp.id);
    return monthsSincePromotion >= 30;
  });

  return {
    totalEmployees: activeEmployees.length,
    teachers: teachers.length,
    administrative: admin.length,
    eligibleForAutoTracking: eligibleForTracking.length,
    averageEchelon: Math.round(
      activeEmployees.reduce((sum, emp) => sum + emp.currentEchelon, 0) / activeEmployees.length
    ),
    departmentBreakdown: getDepartmentBreakdown(activeEmployees)
  };
};

const getDepartmentBreakdown = (employees: MockEmployee[]): Record<string, number> => {
  const breakdown: Record<string, number> = {};
  employees.forEach(emp => {
    breakdown[emp.department] = (breakdown[emp.department] || 0) + 1;
  });
  return breakdown;
};