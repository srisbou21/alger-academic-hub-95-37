
// Import the correct Teacher interface from types
import { Teacher, AbsenceStatistics, WorkloadStatistics } from '../types/teacher';

// Mock data pour les enseignants - updated to match the Teacher interface from types/teacher.ts
let mockTeachers: Teacher[] = [
  {
    id: "teacher_1",
    firstName: "Ahmed",
    lastName: "Benali",
    email: "ahmed.benali@university.edu",
    phone: "+213 555 0001",
    grade: "Professeur",
    specialty: "Algorithmes et Structures de données",
    departmentId: "dept_informatique",
    isActive: true,
    hiringDate: new Date("2015-09-01"),
    echelon: 5,
    lastPromotionDate: new Date("2020-01-01"),
    nextPromotionDate: new Date("2025-01-01"),
    isExternal: false,
    contractType: "CDI",
    maxWeeklyHours: 14,
    currentWeeklyHours: 12,
    qualifications: ["PhD Informatique", "HDR"],
    researchInterests: ["Intelligence Artificielle", "Algorithmes"],
    createdAt: new Date("2015-09-01"),
    updatedAt: new Date(),
    personalInfo: {
      firstName: "Ahmed",
      lastName: "Benali",
      firstNameArabic: "أحمد",
      lastNameArabic: "بن علي",
      civility: "Dr.",
      email: "ahmed.benali@university.edu",
      phone: "+213 555 0001",
      dateOfBirth: new Date("1975-05-15"),
      placeOfBirth: "Alger",
      nationality: "Algérienne",
      nationalId: "1975051512345",
      socialSecurityNumber: "1975051512345678",
      affiliationDate: new Date("2015-09-01"),
      familyStatus: "Marié",
      numberOfChildren: 2,
      ccpAccount: "0123456789",
      bloodType: "O+",
      rfidCardNumber: "RF001234",
      address: {
        street: "123 Rue de l'Université",
        city: "Alger",
        wilaya: "Alger",
        postalCode: "16000"
      }
    },
    professionalInfo: {
      employeeId: "EMP001",
      currentGrade: "Professeur",
      currentEchelon: 5,
      speciality: "Informatique",
      department: "Informatique",
      faculty: "Sciences",
      hireDate: new Date("2015-09-01"),
      tenureDate: new Date("2018-09-01"),
      contractType: "CDI",
      status: "Actif"
    }
  },
  {
    id: "teacher_2", 
    firstName: "Fatima",
    lastName: "Zohra",
    email: "fatima.zohra@university.edu",
    phone: "+213 555 0002",
    grade: "Maître de Conférences A",
    specialty: "Bases de données et Systèmes d'information",
    departmentId: "dept_informatique",
    isActive: true,
    hiringDate: new Date("2018-09-01"),
    echelon: 3,
    lastPromotionDate: new Date("2021-01-01"),
    nextPromotionDate: new Date("2026-01-01"),
    isExternal: false,
    contractType: "CDI",
    maxWeeklyHours: 14,
    currentWeeklyHours: 13,
    qualifications: ["PhD Informatique"],
    researchInterests: ["Bases de données", "Big Data"],
    createdAt: new Date("2018-09-01"),
    updatedAt: new Date(),
    personalInfo: {
      firstName: "Fatima",
      lastName: "Zohra",
      firstNameArabic: "فاطمة",
      lastNameArabic: "زهرة",
      civility: "Dr.",
      email: "fatima.zohra@university.edu",
      phone: "+213 555 0002",
      dateOfBirth: new Date("1980-03-22"),
      placeOfBirth: "Oran",
      nationality: "Algérienne",
      nationalId: "1980032212345",
      socialSecurityNumber: "1980032212345678",
      affiliationDate: new Date("2018-09-01"),
      familyStatus: "Mariée",
      numberOfChildren: 1,
      ccpAccount: "0123456790",
      bloodType: "A+",
      rfidCardNumber: "RF001235",
      address: {
        street: "456 Avenue des Sciences",
        city: "Oran",
        wilaya: "Oran",
        postalCode: "31000"
      }
    },
    professionalInfo: {
      employeeId: "EMP002",
      currentGrade: "Maître de Conférences A",
      currentEchelon: 3,
      speciality: "Informatique",
      department: "Informatique",
      faculty: "Sciences",
      hireDate: new Date("2018-09-01"),
      tenureDate: new Date("2021-09-01"),
      contractType: "CDI",
      status: "Actif"
    }
  },
  {
    id: "teacher_3",
    firstName: "Karim",
    lastName: "Messaoudi", 
    email: "karim.messaoudi@university.edu",
    phone: "+213 555 0003",
    grade: "Maître Assistant A",
    specialty: "Réseaux et Télécommunications",
    departmentId: "dept_informatique",
    isActive: true,
    hiringDate: new Date("2020-09-01"),
    echelon: 2,
    lastPromotionDate: new Date("2022-01-01"),
    nextPromotionDate: new Date("2027-01-01"),
    isExternal: false,
    contractType: "CDI",
    maxWeeklyHours: 14,
    currentWeeklyHours: 11,
    qualifications: ["Master Réseaux", "PhD en cours"],
    researchInterests: ["Sécurité réseau", "IoT"],
    createdAt: new Date("2020-09-01"),
    updatedAt: new Date(),
    personalInfo: {
      firstName: "Karim",
      lastName: "Messaoudi",
      firstNameArabic: "كريم",
      lastNameArabic: "مسعودي",
      civility: "Mr.",
      email: "karim.messaoudi@university.edu",
      phone: "+213 555 0003",
      dateOfBirth: new Date("1985-09-10"),
      placeOfBirth: "Constantine",
      nationality: "Algérienne",
      nationalId: "1985091012345",
      socialSecurityNumber: "1985091012345678",
      affiliationDate: new Date("2020-09-01"),
      familyStatus: "Célibataire",
      numberOfChildren: 0,
      ccpAccount: "0123456791",
      bloodType: "B+",
      rfidCardNumber: "RF001236",
      address: {
        street: "789 Boulevard de la Technologie",
        city: "Constantine",
        wilaya: "Constantine",
        postalCode: "25000"
      }
    },
    professionalInfo: {
      employeeId: "EMP003",
      currentGrade: "Maître Assistant A",
      currentEchelon: 2,
      speciality: "Informatique",
      department: "Informatique",
      faculty: "Sciences",
      hireDate: new Date("2020-09-01"),
      contractType: "CDI",
      status: "Actif"
    }
  }
];

export const teacherService = {
  // Obtenir tous les enseignants
  async getTeachers(): Promise<Teacher[]> {
    console.log('Récupération de tous les enseignants');
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`${mockTeachers.length} enseignants trouvés`);
        resolve([...mockTeachers]);
      }, 300);
    });
  },

  // Alias pour getAllTeachers (compatibilité)
  async getAllTeachers(): Promise<Teacher[]> {
    console.log('Récupération de tous les enseignants (getAllTeachers)');
    return this.getTeachers();
  },

  // Obtenir un enseignant par ID
  async getTeacher(id: string): Promise<Teacher | null> {
    console.log(`Récupération de l'enseignant: ${id}`);
    return new Promise((resolve) => {
      const teacher = mockTeachers.find(t => t.id === id);
      setTimeout(() => {
        if (teacher) {
          console.log(`Enseignant trouvé: ${teacher.firstName} ${teacher.lastName}`);
        } else {
          console.warn(`Enseignant non trouvé: ${id}`);
        }
        resolve(teacher || null);
      }, 200);
    });
  },

  // Créer un nouvel enseignant
  async createTeacher(data: Omit<Teacher, 'id' | 'createdAt' | 'updatedAt'>): Promise<Teacher> {
    console.log(`Création d'un nouvel enseignant: ${data.firstName} ${data.lastName}`);
    return new Promise((resolve) => {
      const newTeacher: Teacher = {
        ...data,
        id: `teacher_${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      mockTeachers.push(newTeacher);
      console.log(`Enseignant créé avec l'ID: ${newTeacher.id}`);
      setTimeout(() => resolve(newTeacher), 500);
    });
  },

  // Mettre à jour un enseignant
  async updateTeacher(id: string, data: Partial<Omit<Teacher, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Teacher> {
    console.log(`Mise à jour de l'enseignant: ${id}`);
    return new Promise((resolve, reject) => {
      const index = mockTeachers.findIndex(t => t.id === id);
      if (index === -1) {
        console.error(`Enseignant non trouvé pour mise à jour: ${id}`);
        reject(new Error('Enseignant non trouvé'));
        return;
      }
      
      mockTeachers[index] = {
        ...mockTeachers[index],
        ...data,
        updatedAt: new Date()
      };
      
      console.log(`Enseignant mis à jour: ${mockTeachers[index].firstName} ${mockTeachers[index].lastName}`);
      setTimeout(() => resolve(mockTeachers[index]), 500);
    });
  },

  // Obtenir les statistiques d'absence
  async getAbsenceStatistics(): Promise<AbsenceStatistics[]> {
    console.log('Récupération des statistiques d\'absence');
    return new Promise((resolve) => {
      const mockAbsenceStats: AbsenceStatistics[] = mockTeachers.map(teacher => ({
        teacherId: teacher.id,
        teacherName: `${teacher.firstName} ${teacher.lastName}`,
        period: {
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-12-31')
        },
        absencesSummary: {
          totalAbsences: Math.floor(Math.random() * 10) + 1,
          totalDays: Math.floor(Math.random() * 20) + 1,
          byType: {
            maladie: { count: 3, days: 5, percentage: 45 },
            formation: { count: 2, days: 3, percentage: 30 },
            conge_annuel: { count: 1, days: 2, percentage: 25 }
          },
          justified: Math.floor(Math.random() * 8) + 1,
          unjustified: Math.floor(Math.random() * 3)
        },
        impact: {
          coursesImpacted: Math.floor(Math.random() * 15) + 1,
          studentsAffected: Math.floor(Math.random() * 100) + 10,
          hoursLost: Math.floor(Math.random() * 30) + 5,
          replacementRate: Math.random() * 100
        },
        trend: {
          comparedToPreviousPeriod: Math.random() * 20 - 10,
          averageAbsenceRate: Math.random() * 10,
          riskLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high'
        }
      }));
      
      setTimeout(() => {
        console.log(`${mockAbsenceStats.length} statistiques d'absence générées`);
        resolve(mockAbsenceStats);
      }, 400);
    });
  },

  async getWorkloadStatistics(department: string, semester: 'S1' | 'S2', academicYear: string): Promise<WorkloadStatistics> {
    console.log(`Récupération des statistiques de charge pour ${department}, ${semester}, ${academicYear}`);
    return new Promise((resolve) => {
      const departmentTeachers = mockTeachers.filter(t => t.isActive);
      const totalTeachers = departmentTeachers.length;
      const totalHours = departmentTeachers.reduce((sum, t) => sum + (Math.random() * (t.maxWeeklyHours * 14)), 0);
      
      const mockWorkloadStats: WorkloadStatistics = {
        department,
        period: {
          semester,
          academicYear
        },
        overview: {
          totalTeachers,
          totalHours: Math.round(totalHours),
          averageLoadPerTeacher: Math.round(totalHours / totalTeachers),
          overloadedTeachers: Math.floor(totalTeachers * 0.15),
          underloadedTeachers: Math.floor(totalTeachers * 0.25)
        },
        byGrade: {
          'Professeur': {
            count: 1,
            averageHours: 180,
            maxHours: 200,
            minHours: 160,
            overloadedCount: 0
          },
          'Maître de Conférences A': {
            count: 1,
            averageHours: 175,
            maxHours: 195,
            minHours: 155,
            overloadedCount: 1
          },
          'Maître Assistant A': {
            count: 1,
            averageHours: 170,
            maxHours: 190,
            minHours: 150,
            overloadedCount: 0
          }
        },
        distribution: {
          teaching: 70,
          supervision: 20,
          administrative: 10
        },
        alerts: [
          {
            type: 'overload',
            teacherId: 'teacher_2',
            teacherName: 'Dr. Fatima Zohra',
            currentHours: 210,
            recommendedHours: 192,
            severity: 'high'
          }
        ]
      };
      
      setTimeout(() => {
        console.log(`Statistiques de charge générées pour ${department}`);
        resolve(mockWorkloadStats);
      }, 500);
    });
  }
};
