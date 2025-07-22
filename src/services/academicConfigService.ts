
import { Department, Faculty, Filiere, Specialty, Section, Group, FormationOffer, UniteEnseignement, Subject } from "../types/academic";

interface FormationWithDetails {
  formation: FormationOffer;
  specialty: Specialty;
  filiere: Filiere;
  department: Department;
  faculty: Faculty;
}

class AcademicConfigService {
  private readonly STORAGE_KEYS = {
    FACULTIES: 'fsecsg_faculties',
    DEPARTMENTS: 'fsecsg_departments', 
    FILIERES: 'fsecsg_filieres',
    SPECIALTIES: 'fsecsg_specialties',
    SECTIONS: 'fsecsg_sections',
    GROUPS: 'fsecsg_groups',
    FORMATIONS: 'fsecsg_formations'
  };

  // Configuration des jours de travail universitaires
  getUniversityWorkingDays(): string[] {
    return ['Samedi', 'Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi'];
  }

  getUniversityWorkingHours(): { start: string; end: string } {
    return { start: '08:00', end: '23:00' };
  }

  private getStoredData<T>(key: string, defaultData: T[] = []): T[] {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultData;
    } catch (error) {
      console.error(`Erreur lors de la récupération de ${key}:`, error);
      return defaultData;
    }
  }

  private saveData<T>(key: string, data: T[]): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Erreur lors de la sauvegarde de ${key}:`, error);
    }
  }

  // Initialize example data
  initializeExampleData(): void {
    console.log('🔄 Initialisation des données d\'exemple...');
    
    // Vérifier si les données existent déjà
    const existingFaculties = this.getStoredData<Faculty>(this.STORAGE_KEYS.FACULTIES);
    if (existingFaculties.length > 0) {
      console.log('✅ Données déjà initialisées');
      return;
    }

    // Données d'exemple
    const faculties: Faculty[] = [
      {
        id: '1',
        name: 'Faculté des Sciences Économiques',
        description: 'Faculté spécialisée en sciences économiques et gestion',
        dean: 'Prof. Ahmed Benali',
        isActive: true,
        isValidated: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        name: 'Faculté des Sciences et Technologies',
        description: 'Faculté de sciences exactes et informatique',
        dean: 'Prof. Fatima Zohra',
        isActive: true,
        isValidated: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '3',
        name: 'Faculté des Lettres et Sciences Humaines',
        description: 'Faculté de langues et sciences sociales',
        dean: 'Prof. Karim Messaoudi',
        isActive: true,
        isValidated: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const departments: Department[] = [
      {
        id: '1',
        name: 'Département Sciences Économiques',
        code: 'ECO',
        facultyId: '1',
        head: 'Dr. Mohamed Alami',
        description: 'Département spécialisé en sciences économiques',
        isActive: true,
        isValidated: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        name: 'Département Sciences de Gestion',
        code: 'GEST',
        facultyId: '1',
        head: 'Dr. Amina Cherifi',
        description: 'Département de management et gestion',
        isActive: true,
        isValidated: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '3',
        name: 'Département Informatique',
        code: 'INFO',
        facultyId: '2',
        head: 'Dr. Youcef Benhamad',
        description: 'Département informatique et technologies',
        isActive: true,
        isValidated: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '4',
        name: 'Département Mathématiques',
        code: 'MATH',
        facultyId: '2',
        head: 'Dr. Nadia Khelifi',
        description: 'Département mathématiques et statistiques',
        isActive: true,
        isValidated: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '5',
        name: 'Département Français',
        code: 'FR',
        facultyId: '3',
        head: 'Dr. Sarah Mokrani',
        description: 'Département langue et littérature française',
        isActive: true,
        isValidated: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const filieres: Filiere[] = [
      {
        id: '1',
        name: 'Sciences Économiques',
        code: 'ECO',
        departmentId: '1',
        description: 'Filière en sciences économiques',
        head: 'Dr. Amina Cherifi',
        isActive: true,
        isValidated: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const specialties: Specialty[] = [
      {
        id: '1',
        name: 'Économie Quantitative',
        code: 'EQ',
        filiereId: '1',
        level: 'licence',
        description: 'Spécialité en économie quantitative et analyse des données',
        duration: 3,
        isActive: true,
        isValidated: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        name: 'Finance et Commerce International',
        code: 'FCI',
        filiereId: '1',
        level: 'master',
        description: 'Spécialité en finance et commerce international',
        duration: 2,
        isActive: true,
        isValidated: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const formations: FormationOffer[] = [
      {
        id: '1',
        name: 'Licence en Économie Quantitative',
        code: 'LIC-EQ',
        level: 'licence',
        duration: 3,
        totalECTS: 180,
        specialtyId: '1',
        responsibleName: 'Dr. Martin Dubois',
        responsibleId: 'teacher_1',
        academicYear: '2024-2025',
        status: 'validated',
        diplomaType: 'licence',
        modality: 'presential',
        language: 'fr',
        maxCapacity: 100,
        admissionRequirements: 'Baccalauréat série S ou ES',
        pedagogicalObjectives: ['Maîtriser les outils quantitatifs', 'Analyser les données économiques'],
        careerProspects: ['Analyste économique', 'Chargé d\'études'],
        modules: [
          {
            id: 'module_1',
            name: 'Microéconomie',
            code: 'MICRO',
            credits: 6,
            coefficient: 2,
            teacher: 'Dr. Ahmed Benali',
            teacherId: 'teacher_1',
            type: 'presential',
            semester: 1,
            moduleType: 'cours',
            pedagogicalAtoms: [
              {
                id: 'atom_1',
                type: 'cours',
                hours: 21, // 14 séances de 1.5h
                totalWeeks: 14,
                groupSize: 50,
                requiresReservation: false,
                location: 'internal',
                description: 'Cours magistraux de microéconomie'
              },
              {
                id: 'atom_2',
                type: 'td',
                hours: 14, // 7 séances de 2h
                totalWeeks: 7,
                groupSize: 25,
                requiresReservation: false,
                location: 'internal',
                description: 'Travaux dirigés de microéconomie'
              }
            ]
          },
          {
            id: 'module_2',
            name: 'Mathématiques Appliquées',
            code: 'MATH',
            credits: 6,
            coefficient: 2,
            teacher: 'Dr. Fatima Zohra',
            teacherId: 'teacher_2',
            type: 'presential',
            semester: 1,
            moduleType: 'cours',
            pedagogicalAtoms: [
              {
                id: 'atom_3',
                type: 'cours',
                hours: 24, // 16 séances de 1.5h
                totalWeeks: 16,
                groupSize: 50,
                requiresReservation: false,
                location: 'internal',
                description: 'Cours de mathématiques appliquées'
              },
              {
                id: 'atom_4',
                type: 'tp',
                hours: 18, // 9 séances de 2h
                totalWeeks: 9,
                groupSize: 15,
                requiresReservation: true,
                location: 'internal',
                description: 'Travaux pratiques informatiques'
              }
            ]
          },
          {
            id: 'module_3',
            name: 'Statistiques Descriptives',
            code: 'STAT',
            credits: 4,
            coefficient: 1,
            teacher: 'Dr. Karim Messaoudi',
            teacherId: 'teacher_3',
            type: 'presential',
            semester: 1,
            moduleType: 'cours',
            pedagogicalAtoms: [
              {
                id: 'atom_5',
                type: 'cours',
                hours: 15, // 10 séances de 1.5h
                totalWeeks: 10,
                groupSize: 50,
                requiresReservation: false,
                location: 'internal',
                description: 'Cours de statistiques descriptives'
              }
            ]
          }
        ],
        sections: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        lastModifiedBy: 'Admin',
        validationHistory: []
      }
    ];

    const sections: Section[] = [
      {
        id: '1',
        name: 'Section 01',
        code: 'SEC-01',
        capacity: 50,
        currentEnrollment: 0,
        specialtyId: '1',
        semester: 'S1',
        groups: [],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const groups: Group[] = [
      {
        id: '1',
        name: 'Groupe 01',
        code: 'G01',
        sectionId: '1',
        capacity: 25,
        currentEnrollment: 0,
        type: 'td',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Sauvegarder toutes les données
    this.saveData(this.STORAGE_KEYS.FACULTIES, faculties);
    this.saveData(this.STORAGE_KEYS.DEPARTMENTS, departments);
    this.saveData(this.STORAGE_KEYS.FILIERES, filieres);
    this.saveData(this.STORAGE_KEYS.SPECIALTIES, specialties);
    this.saveData(this.STORAGE_KEYS.FORMATIONS, formations);
    this.saveData(this.STORAGE_KEYS.SECTIONS, sections);
    this.saveData(this.STORAGE_KEYS.GROUPS, groups);

    console.log('✅ Données d\'exemple initialisées avec succès');
  }

  async getFaculties(): Promise<Faculty[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const faculties = this.getStoredData<Faculty>(this.STORAGE_KEYS.FACULTIES);
        resolve(faculties);
      }, 100);
    });
  }

  async createFaculty(facultyData: Omit<Faculty, 'id' | 'createdAt' | 'updatedAt'>): Promise<Faculty> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const faculties = this.getStoredData<Faculty>(this.STORAGE_KEYS.FACULTIES);
        const newFaculty: Faculty = {
          id: Date.now().toString(),
          ...facultyData,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        faculties.push(newFaculty);
        this.saveData(this.STORAGE_KEYS.FACULTIES, faculties);
        resolve(newFaculty);
      }, 100);
    });
  }

  async updateFaculty(id: string, updates: Partial<Omit<Faculty, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Faculty> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const faculties = this.getStoredData<Faculty>(this.STORAGE_KEYS.FACULTIES);
        const index = faculties.findIndex(f => f.id === id);
        if (index !== -1) {
          faculties[index] = { ...faculties[index], ...updates, updatedAt: new Date() };
          this.saveData(this.STORAGE_KEYS.FACULTIES, faculties);
          resolve(faculties[index]);
        } else {
          throw new Error('Faculty not found');
        }
      }, 100);
    });
  }

  async deleteFaculty(id: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const faculties = this.getStoredData<Faculty>(this.STORAGE_KEYS.FACULTIES);
        const filtered = faculties.filter(f => f.id !== id);
        this.saveData(this.STORAGE_KEYS.FACULTIES, filtered);
        resolve();
      }, 100);
    });
  }

  async getDepartments(): Promise<Department[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const departments = this.getStoredData<Department>(this.STORAGE_KEYS.DEPARTMENTS);
        resolve(departments);
      }, 100);
    });
  }

  async createDepartment(departmentData: Omit<Department, 'id' | 'createdAt' | 'updatedAt'>): Promise<Department> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const departments = this.getStoredData<Department>(this.STORAGE_KEYS.DEPARTMENTS);
        const newDepartment: Department = {
          id: Date.now().toString(),
          ...departmentData,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        departments.push(newDepartment);
        this.saveData(this.STORAGE_KEYS.DEPARTMENTS, departments);
        resolve(newDepartment);
      }, 100);
    });
  }

  async updateDepartment(id: string, updates: Partial<Omit<Department, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Department> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const departments = this.getStoredData<Department>(this.STORAGE_KEYS.DEPARTMENTS);
        const index = departments.findIndex(d => d.id === id);
        if (index !== -1) {
          departments[index] = { ...departments[index], ...updates, updatedAt: new Date() };
          this.saveData(this.STORAGE_KEYS.DEPARTMENTS, departments);
          resolve(departments[index]);
        } else {
          throw new Error('Department not found');
        }
      }, 100);
    });
  }

  async deleteDepartment(id: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const departments = this.getStoredData<Department>(this.STORAGE_KEYS.DEPARTMENTS);
        const filtered = departments.filter(d => d.id !== id);
        this.saveData(this.STORAGE_KEYS.DEPARTMENTS, filtered);
        resolve();
      }, 100);
    });
  }

  async getFilieres(): Promise<Filiere[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filieres = this.getStoredData<Filiere>(this.STORAGE_KEYS.FILIERES);
        resolve(filieres);
      }, 100);
    });
  }

  async createFiliere(filiereData: Omit<Filiere, 'id' | 'createdAt' | 'updatedAt'>): Promise<Filiere> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filieres = this.getStoredData<Filiere>(this.STORAGE_KEYS.FILIERES);
        const newFiliere: Filiere = {
          id: Date.now().toString(),
          ...filiereData,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        filieres.push(newFiliere);
        this.saveData(this.STORAGE_KEYS.FILIERES, filieres);
        resolve(newFiliere);
      }, 100);
    });
  }

  async updateFiliere(id: string, updates: Partial<Omit<Filiere, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Filiere> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filieres = this.getStoredData<Filiere>(this.STORAGE_KEYS.FILIERES);
        const index = filieres.findIndex(f => f.id === id);
        if (index !== -1) {
          filieres[index] = { ...filieres[index], ...updates, updatedAt: new Date() };
          this.saveData(this.STORAGE_KEYS.FILIERES, filieres);
          resolve(filieres[index]);
        } else {
          throw new Error('Filiere not found');
        }
      }, 100);
    });
  }

  async deleteFiliere(id: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filieres = this.getStoredData<Filiere>(this.STORAGE_KEYS.FILIERES);
        const filtered = filieres.filter(f => f.id !== id);
        this.saveData(this.STORAGE_KEYS.FILIERES, filtered);
        resolve();
      }, 100);
    });
  }

  async getSpecialties(): Promise<Specialty[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const specialties = this.getStoredData<Specialty>(this.STORAGE_KEYS.SPECIALTIES);
        resolve(specialties);
      }, 100);
    });
  }

  async createSpecialty(specialtyData: Omit<Specialty, 'id' | 'createdAt' | 'updatedAt'>): Promise<Specialty> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const specialties = this.getStoredData<Specialty>(this.STORAGE_KEYS.SPECIALTIES);
        const newSpecialty: Specialty = {
          id: Date.now().toString(),
          ...specialtyData,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        specialties.push(newSpecialty);
        this.saveData(this.STORAGE_KEYS.SPECIALTIES, specialties);
        resolve(newSpecialty);
      }, 100);
    });
  }

  async updateSpecialty(id: string, updates: Partial<Omit<Specialty, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Specialty> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const specialties = this.getStoredData<Specialty>(this.STORAGE_KEYS.SPECIALTIES);
        const index = specialties.findIndex(s => s.id === id);
        if (index !== -1) {
          specialties[index] = { ...specialties[index], ...updates, updatedAt: new Date() };
          this.saveData(this.STORAGE_KEYS.SPECIALTIES, specialties);
          resolve(specialties[index]);
        } else {
          throw new Error('Specialty not found');
        }
      }, 100);
    });
  }

  async deleteSpecialty(id: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const specialties = this.getStoredData<Specialty>(this.STORAGE_KEYS.SPECIALTIES);
        const filtered = specialties.filter(s => s.id !== id);
        this.saveData(this.STORAGE_KEYS.SPECIALTIES, filtered);
        resolve();
      }, 100);
    });
  }

  async addSpecialty(specialty: Specialty): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const specialties = this.getStoredData<Specialty>(this.STORAGE_KEYS.SPECIALTIES);
        specialties.push(specialty);
        this.saveData(this.STORAGE_KEYS.SPECIALTIES, specialties);
        resolve();
      }, 100);
    });
  }

  async getSections(): Promise<Section[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const sections = this.getStoredData<Section>(this.STORAGE_KEYS.SECTIONS);
        resolve(sections);
      }, 100);
    });
  }

  async getSectionsAndGroups(): Promise<{ sections: Section[]; groups: Group[] }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const sections = this.getStoredData<Section>(this.STORAGE_KEYS.SECTIONS);
        const groups = this.getStoredData<Group>(this.STORAGE_KEYS.GROUPS);
        resolve({ sections, groups });
      }, 100);
    });
  }

  async getGroups(): Promise<Group[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const groups = this.getStoredData<Group>(this.STORAGE_KEYS.GROUPS);
        resolve(groups);
      }, 100);
    });
  }

  async createGroup(groupData: Omit<Group, 'id' | 'createdAt' | 'updatedAt'>): Promise<Group> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const groups = this.getStoredData<Group>(this.STORAGE_KEYS.GROUPS);
        const newGroup: Group = {
          id: Date.now().toString(),
          ...groupData,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        groups.push(newGroup);
        this.saveData(this.STORAGE_KEYS.GROUPS, groups);
        resolve(newGroup);
      }, 100);
    });
  }

  async createSectionsAndGroupsForSpecialty(specialtyId: string, config: any): Promise<{ sections: Section[]; groups: Group[]; }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const sections: Section[] = [];
        const groups: Group[] = [];
        
        for (let i = 1; i <= config.sectionsCount; i++) {
          const sectionId = `${Date.now()}_${i}`;
          const sectionNumber = i.toString().padStart(2, '0');
          const newSection: Section = {
            id: sectionId,
            name: `Section ${sectionNumber}`,
            code: `SEC-${sectionNumber}`,
            capacity: 50,
            currentEnrollment: 0,
            specialtyId: specialtyId,
            groups: [],
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          };
          sections.push(newSection);

          const groupsPerSection = Math.floor(Math.random() * (config.groupsPerSection.max - config.groupsPerSection.min + 1)) + config.groupsPerSection.min;
          for (let j = 1; j <= groupsPerSection; j++) {
            const groupId = `${Date.now()}_${i}_${j}`;
            const groupNumber = j.toString().padStart(2, '0');
            const newGroup: Group = {
              id: groupId,
              name: `Groupe ${groupNumber}`,
              code: `G${groupNumber}`,
              sectionId: sectionId,
              capacity: config.groupCapacity,
              currentEnrollment: 0,
              type: 'td',
              isActive: true,
              createdAt: new Date(),
              updatedAt: new Date()
            };
            groups.push(newGroup);
          }
        }

        // Sauvegarder les nouvelles sections et groupes
        const existingSections = this.getStoredData<Section>(this.STORAGE_KEYS.SECTIONS);
        const existingGroups = this.getStoredData<Group>(this.STORAGE_KEYS.GROUPS);
        
        this.saveData(this.STORAGE_KEYS.SECTIONS, [...existingSections, ...sections]);
        this.saveData(this.STORAGE_KEYS.GROUPS, [...existingGroups, ...groups]);
        
        resolve({ sections, groups });
      }, 200);
    });
  }

  async createSection(sectionData: any): Promise<Section> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const sections = this.getStoredData<Section>(this.STORAGE_KEYS.SECTIONS);
        const newSection: Section = {
          id: Date.now().toString(),
          name: sectionData.name,
          code: sectionData.code,
          capacity: sectionData.capacity || 50,
          currentEnrollment: 0,
          specialtyId: sectionData.specialtyId,
          semester: sectionData.semester,
          groups: [],
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        sections.push(newSection);
        this.saveData(this.STORAGE_KEYS.SECTIONS, sections);
        resolve(newSection);
      }, 100);
    });
  }

  async updateSection(sectionId: string, updates: Partial<Section>): Promise<Section> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const sections = this.getStoredData<Section>(this.STORAGE_KEYS.SECTIONS);
        const index = sections.findIndex(s => s.id === sectionId);
        if (index !== -1) {
          sections[index] = { ...sections[index], ...updates, updatedAt: new Date() };
          this.saveData(this.STORAGE_KEYS.SECTIONS, sections);
          resolve(sections[index]);
        } else {
          throw new Error('Section not found');
        }
      }, 100);
    });
  }

  async deleteSection(sectionId: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const sections = this.getStoredData<Section>(this.STORAGE_KEYS.SECTIONS);
        const filtered = sections.filter(s => s.id !== sectionId);
        this.saveData(this.STORAGE_KEYS.SECTIONS, filtered);
        resolve();
      }, 100);
    });
  }

  async deleteGroup(groupId: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const groups = this.getStoredData<Group>(this.STORAGE_KEYS.GROUPS);
        const filtered = groups.filter(g => g.id !== groupId);
        this.saveData(this.STORAGE_KEYS.GROUPS, filtered);
        resolve();
      }, 100);
    });
  }

  // Formation methods
  async getFormations(): Promise<FormationOffer[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const formations = this.getStoredData<FormationOffer>(this.STORAGE_KEYS.FORMATIONS);
        resolve(formations);
      }, 100);
    });
  }

  async getFormationOffers(): Promise<FormationOffer[]> {
    return this.getFormations();
  }

  async getFormationsWithDetails(): Promise<FormationWithDetails[]> {
    return new Promise(async (resolve) => {
      setTimeout(async () => {
        const formations = await this.getFormations();
        const specialties = await this.getSpecialities();
        const filieres = await this.getFilieres();
        const departments = await this.getDepartments();
        const faculties = await this.getFaculties();

        const formationsWithDetails: FormationWithDetails[] = formations.map(formation => {
          const specialty = specialties.find(s => s.id === formation.specialtyId)!;
          const filiere = filieres.find(f => f.id === specialty?.filiereId)!;
          const department = departments.find(d => d.id === filiere?.departmentId)!;
          const faculty = faculties.find(f => f.id === department?.facultyId)!;

          return {
            formation,
            specialty,
            filiere,
            department,
            faculty
          };
        });

        resolve(formationsWithDetails);
      }, 200);
    });
  }

  async getFormationsForAssignment(): Promise<any[]> {
    return new Promise(async (resolve) => {
      setTimeout(async () => {
        const formations = await this.getFormations();
        const specialties = await this.getSpecialties();
        
        const formationsForAssignment = formations.map(formation => {
          const specialty = specialties.find(s => s.id === formation.specialtyId);
          return {
            id: formation.id,
            name: formation.name,
            level: formation.level,
            specialtyName: specialty?.name || 'Spécialité inconnue',
            semesters: this.calculateSemesters(specialty?.duration || 3)
          };
        });
        
        resolve(formationsForAssignment);
      }, 100);
    });
  }

  async addFormation(formation: FormationOffer): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const formations = this.getStoredData<FormationOffer>(this.STORAGE_KEYS.FORMATIONS);
        formations.push(formation);
        this.saveData(this.STORAGE_KEYS.FORMATIONS, formations);
        resolve();
      }, 100);
    });
  }

  async updateFormation(id: string, updates: Partial<FormationOffer>): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const formations = this.getStoredData<FormationOffer>(this.STORAGE_KEYS.FORMATIONS);
        const index = formations.findIndex(f => f.id === id);
        if (index !== -1) {
          formations[index] = { ...formations[index], ...updates, updatedAt: new Date() };
          this.saveData(this.STORAGE_KEYS.FORMATIONS, formations);
        }
        resolve();
      }, 100);
    });
  }

  async deleteFormation(id: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const formations = this.getStoredData<FormationOffer>(this.STORAGE_KEYS.FORMATIONS);
        const filtered = formations.filter(f => f.id !== id);
        this.saveData(this.STORAGE_KEYS.FORMATIONS, filtered);
        resolve();
      }, 100);
    });
  }

  async getFormationsBySpecialty(specialtyId: string): Promise<FormationOffer[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const formations = this.getStoredData<FormationOffer>(this.STORAGE_KEYS.FORMATIONS);
        const filtered = formations.filter(f => f.specialtyId === specialtyId);
        resolve(filtered);
      }, 100);
    });
  }

  calculateSemesters(durationInYears: number): string[] {
    const semesters = [];
    for (let i = 1; i <= durationInYears * 2; i++) {
      semesters.push(`S${i}`);
    }
    return semesters;
  }

  // Alias method for compatibility
  async getSpecialities(): Promise<Specialty[]> {
    return this.getSpecialties();
  }

  // Nouvelles méthodes pour la gestion des UE et Subjects
  private readonly UE_STORAGE_KEY = 'fsecsg_unite_enseignements';
  private readonly SUBJECTS_STORAGE_KEY = 'fsecsg_subjects';

  async getUniteEnseignements(specialtyId: string, semester: number): Promise<UniteEnseignement[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const allUEs = this.getStoredData<UniteEnseignement>(this.UE_STORAGE_KEY);
        const filteredUEs = allUEs.filter(ue => 
          ue.formationId === specialtyId && ue.semester === semester
        );
        
        // Pour chaque UE, charger ses subjects
        const uesWithSubjects = filteredUEs.map(ue => {
          const allSubjects = this.getStoredData<Subject>(this.SUBJECTS_STORAGE_KEY);
          const ueSubjects = allSubjects.filter(subject => subject.ueId === ue.id);
          return { ...ue, subjects: ueSubjects };
        });
        
        resolve(uesWithSubjects);
      }, 100);
    });
  }

  async saveUniteEnseignement(ue: UniteEnseignement): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const allUEs = this.getStoredData<UniteEnseignement>(this.UE_STORAGE_KEY);
        const existingIndex = allUEs.findIndex(existingUE => existingUE.id === ue.id);
        
        if (existingIndex >= 0) {
          allUEs[existingIndex] = ue;
        } else {
          allUEs.push(ue);
        }
        
        this.saveData(this.UE_STORAGE_KEY, allUEs);
        resolve();
      }, 100);
    });
  }

  async saveSubject(subject: Subject): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const allSubjects = this.getStoredData<Subject>(this.SUBJECTS_STORAGE_KEY);
        const existingIndex = allSubjects.findIndex(existingSubject => existingSubject.id === subject.id);
        
        if (existingIndex >= 0) {
          allSubjects[existingIndex] = subject;
        } else {
          allSubjects.push(subject);
        }
        
        this.saveData(this.SUBJECTS_STORAGE_KEY, allSubjects);
        resolve();
      }, 100);
    });
  }

  async getAllSubjects(): Promise<Subject[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const subjects = this.getStoredData<Subject>(this.SUBJECTS_STORAGE_KEY);
        resolve(subjects);
      }, 100);
    });
  }

  async getSubjectsForSpecialtyAndSemester(specialtyId: string, semester: number): Promise<Subject[]> {
    return new Promise(async (resolve) => {
      setTimeout(async () => {
        // D'abord récupérer les UEs pour cette spécialité et ce semestre
        const ues = await this.getUniteEnseignements(specialtyId, semester);
        const ueIds = ues.map(ue => ue.id);
        
        // Ensuite récupérer tous les subjects qui appartiennent à ces UEs
        const allSubjects = this.getStoredData<Subject>(this.SUBJECTS_STORAGE_KEY);
        const filteredSubjects = allSubjects.filter(subject => ueIds.includes(subject.ueId));
        
        resolve(filteredSubjects);
      }, 100);
    });
  }

  async deleteUniteEnseignement(ueId: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Supprimer l'UE
        const allUEs = this.getStoredData<UniteEnseignement>(this.UE_STORAGE_KEY);
        const filteredUEs = allUEs.filter(ue => ue.id !== ueId);
        this.saveData(this.UE_STORAGE_KEY, filteredUEs);
        
        // Supprimer aussi tous les subjects de cette UE
        const allSubjects = this.getStoredData<Subject>(this.SUBJECTS_STORAGE_KEY);
        const filteredSubjects = allSubjects.filter(subject => subject.ueId !== ueId);
        this.saveData(this.SUBJECTS_STORAGE_KEY, filteredSubjects);
        
        resolve();
      }, 100);
    });
  }

  async deleteSubject(subjectId: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const allSubjects = this.getStoredData<Subject>(this.SUBJECTS_STORAGE_KEY);
        const filteredSubjects = allSubjects.filter(subject => subject.id !== subjectId);
        this.saveData(this.SUBJECTS_STORAGE_KEY, filteredSubjects);
        resolve();
      }, 100);
    });
  }
}

export const academicConfigService = new AcademicConfigService();
