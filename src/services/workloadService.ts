
import { AcademicYear } from './academicYearService';
import { 
  TeacherWorkload, 
  WorkloadAssignment, 
  SectionConfiguration, 
  SectionDefinition, 
  GroupDefinition, 
  WorkloadStatistics 
} from '../types/workload';

// Types pour la gestion des charges d'enseignement
export interface ModuleWorkload {
  id: string;
  name: string;
  formation: string;
  level: string;
  specialty: string;
  semester: number;
  moduleType: string;
  weeklyHours: number;
  weekCount: number;
  totalVH: number;
  studentCount: number;
  groupType: string;
  coefficient: number;
}

// Mock data pour les charges d'enseignement
let mockWorkloads: TeacherWorkload[] = [
  {
    id: "1",
    teacherId: "teacher_1",
    teacherName: "Dr. Ahmed Benali",
    academicYear: "2024-2025",
    semester: "Année",
    assignments: [],
    totalHours: 180,
    maxHours: 180,
    status: "normal",
    lastUpdated: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Mock data pour les configurations de sections
let mockSectionConfigurations: SectionConfiguration[] = [
  {
    id: "section_1",
    formationOfferId: "formation_1",
    academicYear: "2024-2025",
    sections: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "admin"
  }
];

export const workloadService = {
  // Obtenir toutes les charges d'enseignement pour une année spécifique
  async getTeacherWorkloads(academicYear: string): Promise<TeacherWorkload[]> {
    console.log(`Récupération des charges pour l'année: ${academicYear}`);
    
    return new Promise((resolve) => {
      const workloads = mockWorkloads.filter(workload => workload.academicYear === academicYear);
      setTimeout(() => {
        console.log(`${workloads.length} charges trouvées`);
        resolve(workloads);
      }, 200);
    });
  },

  // S'assurer que chaque enseignant a une charge d'enseignement pour une année donnée
  async ensureTeacherWorkloadsExist(academicYear: string): Promise<void> {
    console.log(`Vérification des charges pour l'année: ${academicYear}`);
    
    return new Promise((resolve) => {
      const mockTeachers = [
        { id: "teacher_1", name: "Dr. Ahmed Benali", grade: "Professeur", specialty: "Informatique", department: "Informatique" },
        { id: "teacher_2", name: "Dr. Fatima Zahra", grade: "MCA", specialty: "Mathématiques", department: "Mathématiques" }
      ];

      mockTeachers.forEach(teacher => {
        const existingWorkload = mockWorkloads.find(
          workload => workload.teacherId === teacher.id && workload.academicYear === academicYear
        );

        if (!existingWorkload) {
          const newWorkload: TeacherWorkload = {
            id: `workload_${teacher.id}_${academicYear.replace('-', '_')}`,
            teacherId: teacher.id,
            teacherName: teacher.name,
            academicYear: academicYear,
            semester: "Année",
            assignments: [],
            totalHours: 0,
            maxHours: 180,
            status: "normal",
            createdAt: new Date(),
            updatedAt: new Date()
          };
          mockWorkloads.push(newWorkload);
          console.log(`Charge créée pour ${teacher.name} en ${academicYear}`);
        }
      });

      console.log('Vérification terminée');
      setTimeout(() => resolve(), 500);
    });
  },

  // Copier les données d'une année à une autre (configurations de sections)
  async copyAcademicYearData(sourceYear: string, targetYear: string): Promise<void> {
    console.log(`Copie des données de ${sourceYear} vers ${targetYear}`);
    
    return new Promise((resolve) => {
      const sourceConfigurations = mockSectionConfigurations.filter(
        config => config.academicYear === sourceYear
      );

      sourceConfigurations.forEach(sourceConfig => {
        const newConfig: SectionConfiguration = {
          ...sourceConfig,
          id: `section_${Math.random().toString(36).substring(7)}`,
          academicYear: targetYear,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        mockSectionConfigurations.push(newConfig);
        console.log(`Configuration copiée vers ${targetYear}`);
      });

      console.log('Copie terminée');
      setTimeout(() => resolve(), 800);
    });
  },

  // Obtenir les configurations de sections
  async getSectionConfigurations(
    formation?: string,
    academicYear?: string
  ): Promise<SectionConfiguration[]> {
    console.log(`Récupération des configurations de sections (année: ${academicYear || 'toutes'})`);
    
    return new Promise((resolve) => {
      let configurations = [...mockSectionConfigurations];
      
      if (academicYear) {
        configurations = configurations.filter(config => config.academicYear === academicYear);
      }

      setTimeout(() => {
        console.log(`${configurations.length} configurations trouvées`);
        resolve(configurations);
      }, 300);
    });
  },

  // Supprimer les données d'une année spécifique
  async deleteYearData(academicYear: string): Promise<void> {
    console.log(`Suppression des données de charge pour l'année: ${academicYear}`);
    
    return new Promise((resolve) => {
      mockWorkloads = mockWorkloads.filter(workload => workload.academicYear !== academicYear);
      
      console.log(`Données de l'année ${academicYear} supprimées`);
      setTimeout(() => resolve(), 200);
    });
  },

  // Nettoyer les données anciennes
  async cleanupOldData(keepYears: number = 3): Promise<void> {
    console.log(`Nettoyage des anciennes données (garder ${keepYears} années)`);
    
    return new Promise((resolve) => {
      const currentYear = new Date().getFullYear();
      const cutoffYear = currentYear - keepYears;

      mockWorkloads = mockWorkloads.filter(workload => {
        const yearNumber = parseInt(workload.academicYear.split('-')[0]);
        return yearNumber >= cutoffYear;
      });

      console.log('Nettoyage terminé');
      setTimeout(() => resolve(), 400);
    });
  },

  async getAvailableAcademicYears(): Promise<string[]> {
    return ["2023-2024", "2024-2025", "2025-2026"];
  },

  async exportAcademicYearData(academicYear: string): Promise<string> {
    const workloads = await this.getTeacherWorkloads(academicYear);
    const configurations = await this.getSectionConfigurations(undefined, academicYear);
    
    const exportData = {
      academicYear,
      workloads,
      configurations,
      exportDate: new Date()
    };
    
    return JSON.stringify(exportData, null, 2);
  },

  async getWorkloadStatistics(department: string, academicYear: string): Promise<WorkloadStatistics> {
    const workloads = await this.getTeacherWorkloads(academicYear);
    
    return {
      department,
      academicYear,
      totalTeachers: workloads.length,
      totalHours: workloads.reduce((sum, w) => sum + w.totalHours, 0),
      averageHours: workloads.length > 0 ? workloads.reduce((sum, w) => sum + w.totalHours, 0) / workloads.length : 0,
      overloadedTeachers: workloads.filter(w => w.status === 'overload').length,
      underloadedTeachers: workloads.filter(w => w.status === 'underload').length,
      normalTeachers: workloads.filter(w => w.status === 'normal').length,
      overloadPercentage: 0,
      underloadPercentage: 0,
      distributionByModule: {},
      distributionBySpecialty: {},
      createdAt: new Date()
    };
  },

  async updateWorkloadAssignment(workloadId: string, assignment: WorkloadAssignment): Promise<void> {
    console.log(`Mise à jour de l'attribution pour la charge: ${workloadId}`);
    const workloadIndex = mockWorkloads.findIndex(w => w.id === workloadId);
    if (workloadIndex !== -1) {
      mockWorkloads[workloadIndex].assignments.push(assignment);
      mockWorkloads[workloadIndex].totalHours += assignment.totalHours;
      mockWorkloads[workloadIndex].updatedAt = new Date();
    }
  },

  async deleteWorkloadAssignment(workloadId: string, assignmentId: string): Promise<void> {
    console.log(`Suppression de l'attribution ${assignmentId} pour la charge: ${workloadId}`);
    const workloadIndex = mockWorkloads.findIndex(w => w.id === workloadId);
    if (workloadIndex !== -1) {
      const assignmentIndex = mockWorkloads[workloadIndex].assignments.findIndex(a => a.id === assignmentId);
      if (assignmentIndex !== -1) {
        const removedAssignment = mockWorkloads[workloadIndex].assignments.splice(assignmentIndex, 1)[0];
        mockWorkloads[workloadIndex].totalHours -= removedAssignment.totalHours;
        mockWorkloads[workloadIndex].updatedAt = new Date();
      }
    }
  },

  async confirmAssignment(workloadId: string, assignmentId: string): Promise<void> {
    console.log(`Confirmation de l'attribution ${assignmentId} pour la charge: ${workloadId}`);
    const workloadIndex = mockWorkloads.findIndex(w => w.id === workloadId);
    if (workloadIndex !== -1) {
      const assignment = mockWorkloads[workloadIndex].assignments.find(a => a.id === assignmentId);
      if (assignment) {
        assignment.isConfirmed = true;
        mockWorkloads[workloadIndex].updatedAt = new Date();
      }
    }
  },

  async createSectionConfiguration(configData: Partial<SectionConfiguration>): Promise<SectionConfiguration> {
    const newConfig: SectionConfiguration = {
      id: `config_${Date.now()}`,
      formationOfferId: configData.formationOfferId || "",
      academicYear: configData.academicYear || "2024-2025",
      sections: configData.sections || [],
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: configData.createdBy || "admin"
    };
    
    mockSectionConfigurations.push(newConfig);
    return newConfig;
  },

  async updateSectionConfiguration(config: SectionConfiguration): Promise<void> {
    const index = mockSectionConfigurations.findIndex(c => c.id === config.id);
    if (index !== -1) {
      mockSectionConfigurations[index] = { ...config, updatedAt: new Date() };
    }
  }
};
