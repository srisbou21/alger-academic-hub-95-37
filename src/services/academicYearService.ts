import { workloadService } from './workloadService';
import { teacherService } from './teacherService';

// Types pour la gestion des années universitaires
export interface AcademicYear {
  id: string;
  year: string; // Format: "2024-2025"
  isActive: boolean;
  startDate: Date;
  endDate: Date;
  status: 'draft' | 'active' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

export interface DataMigrationOptions {
  copyFormationOffers: boolean;
  copySectionConfigurations: boolean;
  createTeacherWorkloads: boolean;
  archivePreviousYear: boolean;
}

export interface TableClassification {
  permanent: string[];
  annual: string[];
  hybrid: string[];
}

// Classification des tables selon leur nature
const TABLE_CLASSIFICATION: TableClassification = {
  // Tables permanentes (pas d'année universitaire)
  permanent: [
    'teachers',
    'administrative_staff', 
    'echelons',
    'academic_grades',
    'departments',
    'specializations',
    'module_types',
    'system_config'
  ],
  
  // Tables annuelles (avec année universitaire)
  annual: [
    'student_enrollments',
    'formation_offers',
    'taught_modules',
    'sections',
    'groups', 
    'teacher_workloads',
    'grades',
    'evaluations',
    'schedules',
    'absences'
  ],
  
  // Tables hybrides (profil permanent + instances annuelles)
  hybrid: [
    'students', // profil permanent
    'modules'   // structure permanente
  ]
};

// Mock data pour les années universitaires
let mockAcademicYears: AcademicYear[] = [
  {
    id: "year_2023_2024",
    year: "2023-2024",
    isActive: false,
    startDate: new Date("2023-09-01"),
    endDate: new Date("2024-08-31"),
    status: 'archived',
    createdAt: new Date("2023-08-01"),
    updatedAt: new Date("2024-08-31")
  },
  {
    id: "year_2024_2025", 
    year: "2024-2025",
    isActive: true,
    startDate: new Date("2024-09-01"),
    endDate: new Date("2025-08-31"),
    status: 'active',
    createdAt: new Date("2024-08-01"),
    updatedAt: new Date()
  }
];

export const academicYearService = {
  // Obtenir toutes les années universitaires
  async getAcademicYears(): Promise<AcademicYear[]> {
    console.log('Récupération de toutes les années universitaires');
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`${mockAcademicYears.length} années trouvées`);
        resolve([...mockAcademicYears]);
      }, 300);
    });
  },

  // Obtenir l'année universitaire active
  async getActiveAcademicYear(): Promise<AcademicYear | null> {
    console.log('Récupération de l\'année universitaire active');
    return new Promise((resolve) => {
      const activeYear = mockAcademicYears.find(year => year.isActive);
      setTimeout(() => {
        console.log(activeYear ? `Année active: ${activeYear.year}` : 'Aucune année active');
        resolve(activeYear || null);
      }, 200);
    });
  },

  // Créer une nouvelle année universitaire
  async createAcademicYear(
    yearString: string,
    migrationOptions?: DataMigrationOptions
  ): Promise<AcademicYear> {
    console.log(`Création de l'année universitaire: ${yearString}`);
    
    return new Promise(async (resolve, reject) => {
      // Vérifier si l'année existe déjà
      const existingYear = mockAcademicYears.find(y => y.year === yearString);
      if (existingYear) {
        reject(new Error('Cette année universitaire existe déjà'));
        return;
      }

      // Créer la nouvelle année
      const [startYear] = yearString.split('-');
      const newYear: AcademicYear = {
        id: `year_${yearString.replace('-', '_')}`,
        year: yearString,
        isActive: false,
        startDate: new Date(`${startYear}-09-01`),
        endDate: new Date(`${parseInt(startYear) + 1}-08-31`),
        status: 'draft',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockAcademicYears.push(newYear);

      // Effectuer la migration si demandée
      if (migrationOptions) {
        await this.migrateDataToNewYear(yearString, migrationOptions);
      }

      console.log(`Année universitaire ${yearString} créée avec succès`);
      setTimeout(() => resolve(newYear), 500);
    });
  },

  // Supprimer une année universitaire
  async deleteAcademicYear(yearId: string): Promise<void> {
    console.log(`Suppression de l'année universitaire: ${yearId}`);
    
    return new Promise((resolve, reject) => {
      const yearIndex = mockAcademicYears.findIndex(y => y.id === yearId);
      if (yearIndex === -1) {
        reject(new Error('Année universitaire non trouvée'));
        return;
      }

      const year = mockAcademicYears[yearIndex];
      
      // Empêcher la suppression de l'année active
      if (year.isActive) {
        reject(new Error('Impossible de supprimer l\'année universitaire active'));
        return;
      }

      // Supprimer l'année
      mockAcademicYears.splice(yearIndex, 1);
      
      // Nettoyer les données associées
      workloadService.deleteYearData(year.year);

      console.log(`Année universitaire ${year.year} supprimée avec succès`);
      setTimeout(() => resolve(), 400);
    });
  },

  // Archiver une année universitaire
  async archiveAcademicYear(yearId: string): Promise<void> {
    console.log(`Archivage de l'année universitaire: ${yearId}`);
    
    return new Promise((resolve, reject) => {
      const yearIndex = mockAcademicYears.findIndex(y => y.id === yearId);
      if (yearIndex === -1) {
        reject(new Error('Année universitaire non trouvée'));
        return;
      }

      const year = mockAcademicYears[yearIndex];
      
      // Empêcher l'archivage de l'année active
      if (year.isActive) {
        reject(new Error('Impossible d\'archiver l\'année universitaire active'));
        return;
      }

      // Archiver l'année
      mockAcademicYears[yearIndex].status = 'archived';
      mockAcademicYears[yearIndex].updatedAt = new Date();

      console.log(`Année universitaire ${year.year} archivée avec succès`);
      setTimeout(() => resolve(), 300);
    });
  },

  // Activer une année universitaire
  async activateAcademicYear(yearId: string): Promise<void> {
    console.log(`Activation de l'année universitaire: ${yearId}`);
    
    return new Promise((resolve, reject) => {
      const yearIndex = mockAcademicYears.findIndex(y => y.id === yearId);
      if (yearIndex === -1) {
        reject(new Error('Année universitaire non trouvée'));
        return;
      }

      // Désactiver toutes les autres années
      mockAcademicYears.forEach(year => {
        year.isActive = false;
        if (year.status === 'active') {
          year.status = 'archived';
        }
      });

      // Activer l'année sélectionnée
      mockAcademicYears[yearIndex].isActive = true;
      mockAcademicYears[yearIndex].status = 'active';
      mockAcademicYears[yearIndex].updatedAt = new Date();

      console.log(`Année ${mockAcademicYears[yearIndex].year} activée`);
      setTimeout(() => resolve(), 300);
    });
  },

  // Migrer les données vers une nouvelle année
  async migrateDataToNewYear(
    targetYear: string,
    options: DataMigrationOptions
  ): Promise<void> {
    console.log(`Migration des données vers l'année: ${targetYear}`);
    console.log('Options de migration:', options);

    return new Promise(async (resolve) => {
      try {
        const currentActiveYear = await this.getActiveAcademicYear();
        if (!currentActiveYear) {
          throw new Error('Aucune année active trouvée pour la migration');
        }

        // Migration des offres de formation
        if (options.copyFormationOffers) {
          console.log('Migration des offres de formation...');
          // Logique de copie des formations
        }

        // Migration des configurations de sections
        if (options.copySectionConfigurations) {
          console.log('Migration des configurations de sections...');
          await workloadService.copyAcademicYearData(currentActiveYear.year, targetYear);
        }

        // Création des charges d'enseignement
        if (options.createTeacherWorkloads) {
          console.log('Création des charges d\'enseignement...');
          await workloadService.ensureTeacherWorkloadsExist(targetYear);
        }

        // Archivage de l'année précédente
        if (options.archivePreviousYear && currentActiveYear) {
          console.log('Archivage de l\'année précédente...');
          const yearIndex = mockAcademicYears.findIndex(y => y.id === currentActiveYear.id);
          if (yearIndex !== -1) {
            mockAcademicYears[yearIndex].status = 'archived';
            mockAcademicYears[yearIndex].isActive = false;
          }
        }

        console.log('Migration terminée avec succès');
        setTimeout(() => resolve(), 1000);
      } catch (error) {
        console.error('Erreur lors de la migration:', error);
        setTimeout(() => resolve(), 1000);
      }
    });
  },

  // Obtenir la classification des tables
  getTableClassification(): TableClassification {
    return TABLE_CLASSIFICATION;
  },

  // Vérifier si une table nécessite une année universitaire
  requiresAcademicYear(tableName: string): boolean {
    return TABLE_CLASSIFICATION.annual.includes(tableName) || 
           TABLE_CLASSIFICATION.hybrid.includes(tableName);
  },

  // Obtenir les statistiques par année
  async getYearStatistics(year: string): Promise<{
    students: number;
    teachers: number;
    formations: number;
    workloads: number;
  }> {
    console.log(`Récupération des statistiques pour l'année: ${year}`);
    
    return new Promise(async (resolve) => {
      try {
        const [workloads] = await Promise.all([
          workloadService.getTeacherWorkloads(year)
        ]);

        const stats = {
          students: Math.floor(Math.random() * 1000) + 500, // Mock data
          teachers: workloads.length,
          formations: Math.floor(Math.random() * 20) + 10, // Mock data
          workloads: workloads.length
        };

        console.log('Statistiques calculées:', stats);
        setTimeout(() => resolve(stats), 400);
      } catch (error) {
        console.error('Erreur lors du calcul des statistiques:', error);
        setTimeout(() => resolve({
          students: 0,
          teachers: 0,
          formations: 0,
          workloads: 0
        }), 400);
      }
    });
  },

  // Nettoyer les données anciennes
  async cleanupOldData(keepYears: number = 3): Promise<void> {
    console.log(`Nettoyage des données (garder ${keepYears} années)`);
    
    return new Promise((resolve) => {
      const currentYear = new Date().getFullYear();
      const cutoffYear = currentYear - keepYears;
      
      // Filtrer les années à conserver
      const yearsToKeep = mockAcademicYears.filter(year => {
        const yearNumber = parseInt(year.year.split('-')[0]);
        return yearNumber >= cutoffYear || year.isActive;
      });

      // Nettoyer les données des services
      workloadService.cleanupOldData(keepYears);
      
      console.log(`Nettoyage terminé - ${yearsToKeep.length} années conservées`);
      setTimeout(() => resolve(), 500);
    });
  },

  // Exporter les données d'une année
  async exportYearData(year: string): Promise<{
    academicYear: AcademicYear;
    workloads: any[];
    configurations: any[];
    statistics: any;
  }> {
    console.log(`Export des données pour l'année: ${year}`);
    
    return new Promise(async (resolve) => {
      try {
        const academicYear = mockAcademicYears.find(y => y.year === year);
        if (!academicYear) {
          throw new Error('Année universitaire non trouvée');
        }

        const [workloads, configurations, statistics] = await Promise.all([
          workloadService.getTeacherWorkloads(year),
          workloadService.getSectionConfigurations(undefined, year),
          this.getYearStatistics(year)
        ]);

        const exportData = {
          academicYear,
          workloads,
          configurations,
          statistics
        };

        console.log('Export terminé');
        setTimeout(() => resolve(exportData), 600);
      } catch (error) {
        console.error('Erreur lors de l\'export:', error);
        setTimeout(() => resolve({
          academicYear: mockAcademicYears[0],
          workloads: [],
          configurations: [],
          statistics: {}
        }), 600);
      }
    });
  }
};
