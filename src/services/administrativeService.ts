
import { AdministrativeStaff, AdministrativeAbsence, AdministrativeTask, AdministrativeStatistics } from "@/types/administrative";

class AdministrativeService {
  // Gestion du personnel administratif
  async getAllStaff(): Promise<AdministrativeStaff[]> {
    // Simulation - remplacer par API réelle
    return [
      {
        id: "admin1",
        personalInfo: {
          firstName: "Fatima",
          lastName: "Benali",
          firstNameArabic: "فاطمة",
          lastNameArabic: "بن علي",
          civility: "Mme",
          email: "f.benali@univ.dz",
          phone: "0555-234-567",
          dateOfBirth: new Date("1985-03-20"),
          placeOfBirth: "Alger",
          nationality: "Algérienne",
          nationalId: "198503201234567",
          familyStatus: "marie",
          numberOfChildren: 1,
          address: {
            street: "Rue de l'Indépendance",
            city: "Alger",
            wilaya: "Alger",
            postalCode: "16000"
          }
        },
        professionalInfo: {
          employeeId: "ADM001",
          position: "Chef de service",
          grade: 'grade_8', // Chef de service - Inspecteur d'administration
          gradeCategory: 'administratif',
          gradeDetails: 'inspecteur_dadministration',
          echelon: 2,
          echelonHistory: [
            {
              echelon: 1,
              acquisitionDate: new Date("2015-09-01"),
              advancementType: "court"
            },
            {
              echelon: 2,
              acquisitionDate: new Date("2018-09-01"),
              advancementType: "moyen"
            }
          ],
          service: "Scolarité",
          hireDate: new Date("2015-09-01"),
          contractType: "titulaire",
          status: "active",
          workSchedule: {
            type: "full_time",
            hoursPerWeek: 40,
            workDays: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi"]
          }
        },
        education: [
          {
            id: "edu1",
            level: "Universitaire",
            diploma: "Licence en Administration",
            institution: "Université d'Alger",
            graduationYear: 2010,
            specialty: "Gestion Administrative",
            isRecognized: true
          }
        ],
        salaryInfo: {
          baseSalary: 45000,
          allowances: {
            transport: 3000,
            meal: 2000,
            responsibility: 5000
          },
          totalSalary: 55000,
          paymentMethod: "bank_transfer",
          bankAccount: "123456789"
        },
        skills: {
          languages: ["Arabe", "Français", "Anglais"],
          certifications: ["Gestion Administrative", "Microsoft Office"],
          computerSkills: ["Word", "Excel", "PowerPoint", "Système de gestion"],
          specialSkills: ["Gestion des dossiers étudiants", "Planification"]
        },
        performance: {
          lastEvaluationDate: new Date("2023-12-15"),
          lastEvaluationScore: 16,
          strengths: ["Organisation", "Communication", "Leadership"],
          areasForImprovement: ["Gestion du temps", "Nouvelles technologies"],
          goals: ["Formation en digitalisation", "Améliorer l'efficacité du service"]
        },
        createdAt: new Date("2015-09-01"),
        updatedAt: new Date()
      },
      {
        id: "admin2",
        personalInfo: {
          firstName: "Mohamed",
          lastName: "Khelifi",
          firstNameArabic: "محمد",
          lastNameArabic: "خليفي",
          civility: "M.",
          email: "m.khelifi@univ.dz",
          phone: "0666-345-678",
          dateOfBirth: new Date("1990-07-10"),
          placeOfBirth: "Oran",
          nationality: "Algérienne",
          nationalId: "199007101234567",
          familyStatus: "celibataire",
          numberOfChildren: 0,
          address: {
            street: "Avenue des Martyrs",
            city: "Alger",
            wilaya: "Alger",
            postalCode: "16001"
          }
        },
        professionalInfo: {
          employeeId: "ADM002",
          position: "Agent administratif",
          grade: 'grade_2', // Agent administratif
          gradeCategory: 'administratif',
          gradeDetails: 'agent_dadministration',
          echelon: 1,
          echelonHistory: [
            {
              echelon: 1,
              acquisitionDate: new Date("2020-01-15"),
              advancementType: "court"
            }
          ],
          service: "Ressources Humaines",
          hireDate: new Date("2020-01-15"),
          contractType: "vacataire",
          status: "active",
          workSchedule: {
            type: "part_time",
            hoursPerWeek: 20,
            workDays: ["Dimanche", "Mardi", "Jeudi"]
          }
        },
        education: [
          {
            id: "edu2",
            level: "Secondaire",
            diploma: "Baccalauréat",
            institution: "Lycée d'Oran",
            graduationYear: 2008,
            isRecognized: true
          }
        ],
        salaryInfo: {
          baseSalary: 25000,
          allowances: {
            transport: 1500,
            meal: 1000
          },
          totalSalary: 27500,
          paymentMethod: "bank_transfer",
          bankAccount: "987654321"
        },
        skills: {
          languages: ["Arabe", "Français"],
          certifications: ["Bureautique"],
          computerSkills: ["Word", "Excel"],
          specialSkills: ["Saisie de données", "Archivage"]
        },
        performance: {
          lastEvaluationDate: new Date("2023-06-30"),
          lastEvaluationScore: 14,
          strengths: ["Ponctualité", "Précision"],
          areasForImprovement: ["Initiative", "Autonomie"],
          goals: ["Développer les compétences techniques"]
        },
        createdAt: new Date("2020-01-15"),
        updatedAt: new Date()
      }
    ];
  }

  async createStaff(staff: Omit<AdministrativeStaff, 'id' | 'createdAt' | 'updatedAt'>): Promise<AdministrativeStaff> {
    const newStaff: AdministrativeStaff = {
      id: Date.now().toString(),
      ...staff,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    console.log("Nouveau personnel administratif créé:", newStaff);
    return newStaff;
  }

  async updateStaff(id: string, updates: Partial<AdministrativeStaff>): Promise<AdministrativeStaff> {
    console.log("Mise à jour personnel administratif:", id, updates);
    const staff = await this.getStaffById(id);
    return { ...staff, ...updates, updatedAt: new Date() };
  }

  async getStaffById(id: string): Promise<AdministrativeStaff> {
    const allStaff = await this.getAllStaff();
    const staff = allStaff.find(s => s.id === id);
    if (!staff) throw new Error("Personnel non trouvé");
    return staff;
  }

  async deleteStaff(id: string): Promise<void> {
    console.log("Suppression du personnel administratif:", id);
    // Simulation - remplacer par API réelle
    return Promise.resolve();
  }

  // Gestion des absences
  async getAbsences(staffId?: string): Promise<AdministrativeAbsence[]> {
    return [
      {
        id: "abs1",
        staffId: "admin1",
        staffName: "Fatima Benali",
        type: "conge_annuel",
        startDate: new Date("2024-02-01"),
        endDate: new Date("2024-02-07"),
        duration: 7,
        reason: "Congé annuel planifié",
        replacement: {
          replacementStaffId: "admin2",
          replacementStaffName: "Mohamed Khelifi",
          tasks: ["Gestion des dossiers étudiants", "Réception du public"]
        },
        status: "approved",
        approvedBy: "direction",
        approvedAt: new Date("2024-01-15"),
        createdAt: new Date("2024-01-10"),
        updatedAt: new Date("2024-01-15")
      }
    ];
  }

  // Gestion des tâches
  async getTasks(assignedTo?: string): Promise<AdministrativeTask[]> {
    return [
      {
        id: "task1",
        title: "Mise à jour des dossiers étudiants",
        description: "Mettre à jour les informations des nouveaux étudiants inscrits",
        assignedTo: ["admin1"],
        assignedBy: "direction",
        priority: "high",
        status: "in_progress",
        dueDate: new Date("2024-02-15"),
        estimatedHours: 8,
        actualHours: 5,
        category: "administrative",
        relatedService: "Scolarité",
        createdAt: new Date("2024-02-01"),
        updatedAt: new Date("2024-02-05")
      }
    ];
  }

  async createTask(task: Omit<AdministrativeTask, 'id' | 'createdAt' | 'updatedAt'>): Promise<AdministrativeTask> {
    const newTask: AdministrativeTask = {
      id: Date.now().toString(),
      ...task,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    console.log("Nouvelle tâche créée:", newTask);
    return newTask;
  }

  // Statistiques
  async getStatistics(): Promise<AdministrativeStatistics> {
    const staff = await this.getAllStaff();
    const absences = await this.getAbsences();
    const tasks = await this.getTasks();

    const totalStaff = staff.length;
    const byContractType = staff.reduce((acc, s) => {
      acc[s.professionalInfo.contractType] = (acc[s.professionalInfo.contractType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byService = staff.reduce((acc, s) => {
      acc[s.professionalInfo.service] = (acc[s.professionalInfo.service] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byStatus = staff.reduce((acc, s) => {
      acc[s.professionalInfo.status] = (acc[s.professionalInfo.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const averageSalary = staff.reduce((sum, s) => sum + s.salaryInfo.totalSalary, 0) / totalStaff;

    const currentYear = new Date().getFullYear();
    const upcomingRetirements = staff
      .filter(s => {
        const age = currentYear - s.personalInfo.dateOfBirth.getFullYear();
        return age >= 58; // Âge proche de la retraite
      })
      .map(s => ({
        staffId: s.id,
        staffName: `${s.personalInfo.firstName} ${s.personalInfo.lastName}`,
        retirementDate: new Date(s.personalInfo.dateOfBirth.getFullYear() + 60, 0, 1) // 60 ans
      }));

    const absenceRate = (absences.length / totalStaff) * 100;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const taskCompletionRate = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

    return {
      totalStaff,
      byContractType,
      byService,
      byStatus,
      averageSalary,
      upcomingRetirements,
      absenceRate,
      taskCompletionRate
    };
  }
}

export const administrativeService = new AdministrativeService();
