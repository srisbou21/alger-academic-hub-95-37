import { teacherService } from './teacherService';
import { administrativeService } from './administrativeService';

export interface GlobalStatistics {
  totalStaff: number;
  totalTeachers: number;
  totalAdministrative: number;
  activeStaff: number;
  inactiveStaff: number;
  absenceRate: number;
  taskCompletionRate: number;
  upcomingRetirements: number;
  averageSalary: number;
  byGrade: Record<string, number>;
  byDepartment: Record<string, number>;
  byContractType: Record<string, number>;
  teacherStatistics: {
    totalTeachers: number;
    byGrade: Record<string, number>;
    averageEchelon: number;
    averageExperience: number;
    externalTeachers: number;
    promotionsDue: number;
  };
  administrativeStatistics: {
    totalStaff: number;
    byService: Record<string, number>;
    byPosition: Record<string, number>;
    averagePerformanceScore: number;
    skillCoverage: Record<string, number>;
  };
  monthlyTrends: {
    month: string;
    hires: number;
    departures: number;
    promotions: number;
    absences: number;
  }[];
}

class StatisticsService {
  async getGlobalStatistics(): Promise<GlobalStatistics> {
    try {
      // Récupérer les données des deux services
      const [teachers, adminStats] = await Promise.all([
        teacherService.getAllTeachers(),
        administrativeService.getStatistics()
      ]);

      const activeTeachers = teachers.filter(t => t.isActive);
      const inactiveTeachers = teachers.filter(t => !t.isActive);

      // Calculs pour les enseignants
      const teachersByGrade = teachers.reduce((acc, teacher) => {
        acc[teacher.grade] = (acc[teacher.grade] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const teachersByDepartment = teachers.reduce((acc, teacher) => {
        const dept = teacher.departmentId || 'Non assigné';
        acc[dept] = (acc[dept] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const teachersByContract = teachers.reduce((acc, teacher) => {
        const contract = teacher.contractType || 'CDI';
        acc[contract] = (acc[contract] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const currentYear = new Date().getFullYear();
      const averageEchelon = teachers.reduce((sum, t) => sum + t.echelon, 0) / teachers.length;
      const averageExperience = teachers.reduce((sum, t) => {
        const experience = currentYear - t.hiringDate.getFullYear();
        return sum + experience;
      }, 0) / teachers.length;

      const externalTeachers = teachers.filter(t => t.isExternal).length;

      // Promotions dues (enseignants avec plus de 3 ans sans promotion)
      const promotionsDue = teachers.filter(t => {
        if (!t.lastPromotionDate) return true;
        const yearsSincePromotion = currentYear - t.lastPromotionDate.getFullYear();
        return yearsSincePromotion >= 3;
      }).length;

      // Récupérer les données administratives
      const adminStaff = await administrativeService.getAllStaff();
      
      const byService = adminStaff.reduce((acc, staff) => {
        acc[staff.professionalInfo.service] = (acc[staff.professionalInfo.service] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const byPosition = adminStaff.reduce((acc, staff) => {
        acc[staff.professionalInfo.position] = (acc[staff.professionalInfo.position] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const averagePerformanceScore = adminStaff.reduce((sum, staff) => 
        sum + staff.performance.lastEvaluationScore, 0) / adminStaff.length;

      // Couverture des compétences
      const allSkills = adminStaff.flatMap(staff => staff.skills.specialSkills || []);
      const skillCoverage = allSkills.reduce((acc, skill) => {
        acc[skill] = (acc[skill] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Tendances mensuelles (simulation)
      const monthlyTrends = [
        { month: 'Jan', hires: 2, departures: 0, promotions: 1, absences: 5 },
        { month: 'Fév', hires: 1, departures: 1, promotions: 0, absences: 8 },
        { month: 'Mar', hires: 3, departures: 0, promotions: 2, absences: 6 },
        { month: 'Avr', hires: 0, departures: 1, promotions: 1, absences: 4 },
        { month: 'Mai', hires: 1, departures: 0, promotions: 0, absences: 3 },
        { month: 'Juin', hires: 2, departures: 2, promotions: 3, absences: 7 }
      ];

      return {
        totalStaff: teachers.length + adminStaff.length,
        totalTeachers: teachers.length,
        totalAdministrative: adminStaff.length,
        activeStaff: activeTeachers.length + adminStaff.filter(s => s.professionalInfo.status === 'active').length,
        inactiveStaff: inactiveTeachers.length + adminStaff.filter(s => s.professionalInfo.status !== 'active').length,
        absenceRate: adminStats.absenceRate,
        taskCompletionRate: adminStats.taskCompletionRate,
        upcomingRetirements: adminStats.upcomingRetirements.length,
        averageSalary: adminStats.averageSalary,
        byGrade: teachersByGrade,
        byDepartment: teachersByDepartment,
        byContractType: { ...teachersByContract, ...adminStats.byContractType },
        teacherStatistics: {
          totalTeachers: teachers.length,
          byGrade: teachersByGrade,
          averageEchelon,
          averageExperience,
          externalTeachers,
          promotionsDue
        },
        administrativeStatistics: {
          totalStaff: adminStaff.length,
          byService,
          byPosition,
          averagePerformanceScore,
          skillCoverage
        },
        monthlyTrends
      };
    } catch (error) {
      console.error('Erreur lors du calcul des statistiques globales:', error);
      throw error;
    }
  }

  async getTeacherStatistics() {
    const globalStats = await this.getGlobalStatistics();
    return globalStats.teacherStatistics;
  }

  async getAdministrativeStatistics() {
    const globalStats = await this.getGlobalStatistics();
    return globalStats.administrativeStatistics;
  }
}

export const statisticsService = new StatisticsService();