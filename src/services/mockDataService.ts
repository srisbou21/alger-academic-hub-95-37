
// Service centralisé pour toutes les données d'exemple de l'application
export interface MockEmployee {
  id: string;
  name: string;
  email: string;
  type: 'enseignant' | 'administratif';
  grade: string;
  currentEchelon: number;
  appointmentDate: Date;
  lastEvaluationScore: number;
  status: 'active' | 'inactive' | 'suspended';
  department: string;
  salary: number;
  phoneNumber: string;
  address: string;
}

export interface MockStudent {
  id: string;
  name: string;
  email: string;
  studentId: string;
  level: string;
  specialization: string;
  department: string;
  enrollmentDate: Date;
  status: 'active' | 'graduated' | 'suspended';
  grades: MockGrade[];
  phoneNumber: string;
  address: string;
}

export interface MockGrade {
  id: string;
  studentId: string;
  subject: string;
  value: number;
  coefficient: number;
  semester: string;
  year: string;
  teacherId: string;
  examType: 'partiel' | 'rattrapage' | 'controle';
}

export interface MockReservation {
  id: string;
  spaceId: string;
  spaceName: string;
  requester: {
    id: string;
    name: string;
    service: string;
    contact: string;
  };
  type: 'course' | 'exam' | 'meeting' | 'event';
  purpose: string;
  description: string;
  participants: number;
  dateTime: {
    start: Date;
    end: Date;
  };
  equipment: string[];
  priority: 1 | 2 | 3 | 4;
  status: 'pending' | 'confirmed' | 'cancelled' | 'approved' | 'rejected';
}

export interface MockSpace {
  id: string;
  name: string;
  code: string;
  type: 'classroom' | 'amphitheater' | 'laboratory' | 'computer_room' | 'meeting_room';
  capacity: number;
  surface: number;
  location: {
    building: string;
    floor: string;
    room: string;
  };
  status: 'available' | 'occupied' | 'maintenance' | 'out_of_service';
  equipment: string[];
}

class MockDataService {
  // Données des employés (enseignants et administratifs)
  getEmployees(): MockEmployee[] {
    return [
      {
        id: 'emp001',
        name: 'Dr. Ahmed Benali',
        email: 'a.benali@fsecsg.dz',
        type: 'enseignant',
        grade: 'Maitre de Conférences A',
        currentEchelon: 3,
        appointmentDate: new Date('2019-09-01'),
        lastEvaluationScore: 18.5,
        status: 'active',
        department: 'Économie',
        salary: 85000,
        phoneNumber: '+213 555 123 456',
        address: 'Alger, Algérie'
      },
      {
        id: 'emp002',
        name: 'Mme. Fatima Khelifi',
        email: 'f.khelifi@fsecsg.dz',
        type: 'administratif',
        grade: 'Attaché Principal',
        currentEchelon: 5,
        appointmentDate: new Date('2018-03-15'),
        lastEvaluationScore: 16.2,
        status: 'active',
        department: 'Administration',
        salary: 65000,
        phoneNumber: '+213 555 234 567',
        address: 'Bab Ezzouar, Alger'
      },
      {
        id: 'emp003',
        name: 'Prof. Mohamed Saidi',
        email: 'm.saidi@fsecsg.dz',
        type: 'enseignant',
        grade: 'Professeur',
        currentEchelon: 8,
        appointmentDate: new Date('2015-01-10'),
        lastEvaluationScore: 19.1,
        status: 'active',
        department: 'Sciences Commerciales',
        salary: 120000,
        phoneNumber: '+213 555 345 678',
        address: 'Hydra, Alger'
      },
      {
        id: 'emp004',
        name: 'M. Karim Boudjemaa',
        email: 'k.boudjemaa@fsecsg.dz',
        type: 'administratif',
        grade: 'Administrateur',
        currentEchelon: 7,
        appointmentDate: new Date('2017-06-20'),
        lastEvaluationScore: 17.3,
        status: 'active',
        department: 'Ressources Humaines',
        salary: 78000,
        phoneNumber: '+213 555 456 789',
        address: 'Bir Mourad Rais, Alger'
      },
      {
        id: 'emp005',
        name: 'Dr. Amina Cherifi',
        email: 'a.cherifi@fsecsg.dz',
        type: 'enseignant',
        grade: 'Maitre Assistant A',
        currentEchelon: 4,
        appointmentDate: new Date('2020-11-12'),
        lastEvaluationScore: 17.8,
        status: 'active',
        department: 'Sciences de Gestion',
        salary: 72000,
        phoneNumber: '+213 555 567 890',
        address: 'Kouba, Alger'
      },
      {
        id: 'emp006',
        name: 'Mme. Leila Brahimi',
        email: 'l.brahimi@fsecsg.dz',
        type: 'administratif',
        grade: 'Secrétaire Principal',
        currentEchelon: 6,
        appointmentDate: new Date('2016-04-08'),
        lastEvaluationScore: 15.9,
        status: 'active',
        department: 'Scolarité',
        salary: 58000,
        phoneNumber: '+213 555 678 901',
        address: 'El Harrach, Alger'
      }
    ];
  }

  // Données des étudiants
  getStudents(): MockStudent[] {
    return [
      {
        id: 'std001',
        name: 'Amina Benali',
        email: 'amina.benali@etudiant.univ-alger3.dz',
        studentId: '20230045',
        level: 'L3',
        specialization: 'Économie',
        department: 'Économie',
        enrollmentDate: new Date('2021-09-15'),
        status: 'active',
        grades: [],
        phoneNumber: '+213 666 123 456',
        address: 'Bab El Oued, Alger'
      },
      {
        id: 'std002',
        name: 'Mohamed Djebbar',
        email: 'mohamed.djebbar@etudiant.univ-alger3.dz',
        studentId: '20230046',
        level: 'M1',
        specialization: 'Commerce International',
        department: 'Sciences Commerciales',
        enrollmentDate: new Date('2020-09-12'),
        status: 'active',
        grades: [],
        phoneNumber: '+213 666 234 567',
        address: 'Birtouta, Alger'
      },
      {
        id: 'std003',
        name: 'Yasmine Khaled',
        email: 'yasmine.khaled@etudiant.univ-alger3.dz',
        studentId: '20230047',
        level: 'L2',
        specialization: 'Sciences de Gestion',
        department: 'Sciences de Gestion',
        enrollmentDate: new Date('2022-09-10'),
        status: 'active',
        grades: [],
        phoneNumber: '+213 666 345 678',
        address: 'Dar El Beida, Alger'
      },
      {
        id: 'std004',
        name: 'Riad Messaoud',
        email: 'riad.messaoud@etudiant.univ-alger3.dz',
        studentId: '20220023',
        level: 'M2',
        specialization: 'Finance',
        department: 'Sciences Commerciales',
        enrollmentDate: new Date('2019-09-08'),
        status: 'active',
        grades: [],
        phoneNumber: '+213 666 456 789',
        address: 'Reghaia, Alger'
      },
      {
        id: 'std005',
        name: 'Sabrina Azouz',
        email: 'sabrina.azouz@etudiant.univ-alger3.dz',
        studentId: '20240012',
        level: 'L1',
        specialization: 'Économie',
        department: 'Économie',
        enrollmentDate: new Date('2024-09-01'),
        status: 'active',
        grades: [],
        phoneNumber: '+213 666 567 890',
        address: 'Bordj El Kiffan, Alger'
      }
    ];
  }

  // Données des notes
  getGrades(): MockGrade[] {
    return [
      {
        id: 'grd001',
        studentId: 'std001',
        subject: 'Microéconomie',
        value: 14.5,
        coefficient: 3,
        semester: 'S5',
        year: '2023-2024',
        teacherId: 'emp001',
        examType: 'partiel'
      },
      {
        id: 'grd002',
        studentId: 'std001',
        subject: 'Macroéconomie',
        value: 16.0,
        coefficient: 3,
        semester: 'S5',
        year: '2023-2024',
        teacherId: 'emp001',
        examType: 'partiel'
      },
      {
        id: 'grd003',
        studentId: 'std002',
        subject: 'Commerce International',
        value: 15.5,
        coefficient: 4,
        semester: 'S1',
        year: '2024-2025',
        teacherId: 'emp003',
        examType: 'partiel'
      },
      {
        id: 'grd004',
        studentId: 'std003',
        subject: 'Gestion des Ressources Humaines',
        value: 13.8,
        coefficient: 2,
        semester: 'S3',
        year: '2023-2024',
        teacherId: 'emp005',
        examType: 'controle'
      },
      {
        id: 'grd005',
        studentId: 'std004',
        subject: 'Finance d\'Entreprise',
        value: 17.2,
        coefficient: 4,
        semester: 'S3',
        year: '2024-2025',
        teacherId: 'emp003',
        examType: 'partiel'
      }
    ];
  }

  // Données des espaces
  getSpaces(): MockSpace[] {
    return [
      {
        id: 'spc001',
        name: 'Amphithéâtre A',
        code: 'AMPH-A',
        type: 'amphitheater',
        capacity: 300,
        surface: 250,
        location: {
          building: 'Bâtiment Principal',
          floor: 'RDC',
          room: 'A001'
        },
        status: 'available',
        equipment: ['Projecteur', 'Micro', 'Climatisation', 'Écran géant']
      },
      {
        id: 'spc002',
        name: 'Salle de Cours 201',
        code: 'SC-201',
        type: 'classroom',
        capacity: 45,
        surface: 60,
        location: {
          building: 'Bâtiment Pédagogique',
          floor: '2ème étage',
          room: '201'
        },
        status: 'available',
        equipment: ['Tableau interactif', 'Projecteur', 'Climatisation']
      },
      {
        id: 'spc003',
        name: 'Laboratoire Informatique',
        code: 'LAB-INFO',
        type: 'computer_room',
        capacity: 30,
        surface: 80,
        location: {
          building: 'Bâtiment Technologique',
          floor: '1er étage',
          room: 'L101'
        },
        status: 'available',
        equipment: ['30 PC', 'Projecteur', 'Tableau numérique', 'Réseau haut débit']
      },
      {
        id: 'spc004',
        name: 'Salle de Réunion Direction',
        code: 'SR-DIR',
        type: 'meeting_room',
        capacity: 15,
        surface: 25,
        location: {
          building: 'Bâtiment Administration',
          floor: '3ème étage',
          room: 'R301'
        },
        status: 'available',
        equipment: ['Écran TV', 'Visioconférence', 'Tableau blanc']
      },
      {
        id: 'spc005',
        name: 'Laboratoire de Recherche',
        code: 'LAB-REC',
        type: 'laboratory',
        capacity: 20,
        surface: 50,
        location: {
          building: 'Bâtiment Recherche',
          floor: '2ème étage',
          room: 'R201'
        },
        status: 'maintenance',
        equipment: ['Équipements de recherche', 'Ordinateurs', 'Matériel d\'analyse']
      }
    ];
  }

  // Données des réservations
  getReservations(): MockReservation[] {
    const now = new Date();
    return [
      {
        id: 'res001',
        spaceId: 'spc001',
        spaceName: 'Amphithéâtre A',
        requester: {
          id: 'emp001',
          name: 'Dr. Ahmed Benali',
          service: 'Département Économie',
          contact: 'a.benali@fsecsg.dz'
        },
        type: 'course',
        purpose: 'Cours de Microéconomie L3',
        description: 'Cours magistral sur les fondements de la microéconomie',
        participants: 120,
        dateTime: {
          start: new Date(now.getTime() + 24 * 60 * 60 * 1000), // Demain
          end: new Date(now.getTime() + 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000) // +2h
        },
        equipment: ['Projecteur', 'Micro'],
        priority: 2,
        status: 'confirmed'
      },
      {
        id: 'res002',
        spaceId: 'spc002',
        spaceName: 'Salle de Cours 201',
        requester: {
          id: 'emp005',
          name: 'Dr. Amina Cherifi',
          service: 'Département Sciences de Gestion',
          contact: 'a.cherifi@fsecsg.dz'
        },
        type: 'course',
        purpose: 'TD Gestion des RH',
        description: 'Travaux dirigés sur la gestion des ressources humaines',
        participants: 35,
        dateTime: {
          start: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // Après-demain
          end: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000 + 1.5 * 60 * 60 * 1000) // +1h30
        },
        equipment: ['Tableau interactif'],
        priority: 3,
        status: 'pending'
      },
      {
        id: 'res003',
        spaceId: 'spc003',
        spaceName: 'Laboratoire Informatique',
        requester: {
          id: 'emp003',
          name: 'Prof. Mohamed Saidi',
          service: 'Département Sciences Commerciales',
          contact: 'm.saidi@fsecsg.dz'
        },
        type: 'course',
        purpose: 'TP Commerce Électronique',
        description: 'Travaux pratiques sur les plateformes e-commerce',
        participants: 25,
        dateTime: {
          start: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // Dans 3 jours
          end: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000) // +3h
        },
        equipment: ['30 PC', 'Projecteur'],
        priority: 1,
        status: 'approved'
      },
      {
        id: 'res004',
        spaceId: 'spc004',
        spaceName: 'Salle de Réunion Direction',
        requester: {
          id: 'emp004',
          name: 'M. Karim Boudjemaa',
          service: 'Ressources Humaines',
          contact: 'k.boudjemaa@fsecsg.dz'
        },
        type: 'meeting',
        purpose: 'Réunion Commission Échelons',
        description: 'Évaluation des dossiers d\'avancement d\'échelons',
        participants: 8,
        dateTime: {
          start: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // Dans une semaine
          end: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000) // +2h
        },
        equipment: ['Visioconférence', 'Écran TV'],
        priority: 1,
        status: 'confirmed'
      }
    ];
  }

  // Méthode pour initialiser toutes les données dans localStorage
  initializeAllMockData(): void {
    const employees = this.getEmployees();
    const students = this.getStudents();
    const grades = this.getGrades();
    const spaces = this.getSpaces();
    const reservations = this.getReservations();

    // Sauvegarder dans localStorage
    localStorage.setItem('fsecsg_employees', JSON.stringify(employees));
    localStorage.setItem('fsecsg_students', JSON.stringify(students));
    localStorage.setItem('fsecsg_grades', JSON.stringify(grades));
    localStorage.setItem('fsecsg_spaces', JSON.stringify(spaces));
    localStorage.setItem('fsecsg_reservations', JSON.stringify(reservations));

    // Ajouter des données d'historique d'échelons
    this.initializeEchelonHistory();
    
    console.log('✅ Toutes les données d\'exemple ont été initialisées');
  }

  // Initialiser l'historique des échelons avec des relations réelles
  private initializeEchelonHistory(): void {
    const employees = this.getEmployees();
    const historyEntries = [];

    // Créer un historique réaliste pour chaque employé
    employees.forEach(employee => {
      if (employee.type === 'enseignant' || employee.type === 'administratif') {
        const appointmentDate = new Date(employee.appointmentDate);
        const monthsSinceAppointment = Math.floor((Date.now() - appointmentDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
        
        // Simuler des promotions passées
        if (monthsSinceAppointment > 36) {
          const lastPromotionDate = new Date(appointmentDate.getTime() + 36 * 30 * 24 * 60 * 60 * 1000);
          historyEntries.push({
            id: `hist_${employee.id}_1`,
            employeeId: employee.id,
            employeeName: employee.name,
            previousEchelon: employee.currentEchelon - 1,
            newEchelon: employee.currentEchelon,
            grade: employee.grade,
            promotionDate: lastPromotionDate,
            acquisitionDate: new Date(lastPromotionDate.getTime() + 36 * 30 * 24 * 60 * 60 * 1000),
            duration: 'moyenne' as const,
            durationMonths: 36 as const,
            reason: 'Promotion régulière - Performance satisfaisante',
            processedBy: 'Commission RH'
          });
        }
      }
    });

    localStorage.setItem('echelon_history', JSON.stringify(historyEntries));
  }

  // Méthode pour récupérer des données avec relations
  getEmployeeWithRelations(employeeId: string) {
    const employees = this.getEmployees();
    const grades = this.getGrades();
    const reservations = this.getReservations();
    
    const employee = employees.find(emp => emp.id === employeeId);
    if (!employee) return null;

    return {
      ...employee,
      taughtGrades: grades.filter(grade => grade.teacherId === employeeId),
      reservations: reservations.filter(res => res.requester.id === employeeId)
    };
  }

  getStudentWithGrades(studentId: string) {
    const students = this.getStudents();
    const grades = this.getGrades();
    
    const student = students.find(std => std.id === studentId);
    if (!student) return null;

    return {
      ...student,
      grades: grades.filter(grade => grade.studentId === studentId)
    };
  }
}

export const mockDataService = new MockDataService();
