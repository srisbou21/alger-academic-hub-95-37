import { mockDataService } from './mockDataService';

// Simulated API service for managing application data
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

interface Student {
  id: string;
  name: string;
  email: string;
  studentId: string;
  level: string;
  specialization: string;
  grades: Grade[];
}

interface Grade {
  id: string;
  studentId: string; // Added missing studentId property
  subject: string;
  value: number;
  coefficient: number;
  semester: string;
  year: string;
}

interface Company {
  id: string;
  name: string;
  sector: string;
  contact: string;
  email: string;
  partnerships: number;
  rating: number;
}

class ApiService {
  private storage = {
    students: 'fsecsg_students',
    grades: 'fsecsg_grades',
    companies: 'fsecsg_companies',
    defenses: 'fsecsg_defenses'
  };

  // Initialiser toutes les données d'exemple au premier chargement
  constructor() {
    this.initializeExampleData();
  }

  private initializeExampleData(): void {
    const studentsStored = localStorage.getItem(this.storage.students);
    if (!studentsStored) {
      mockDataService.initializeAllMockData();
    }
  }

  private getStoredData<T>(key: string, defaultValue: T): T {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private setStoredData<T>(key: string, data: T): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // Students API
  async getStudents(): Promise<ApiResponse<Student[]>> {
    await this.simulateDelay();
    const students = this.getStoredData(this.storage.students, mockDataService.getStudents());
    return { data: students, success: true };
  }

  async getStudentById(id: string): Promise<ApiResponse<Student | null>> {
    await this.simulateDelay();
    const students = this.getStoredData(this.storage.students, mockDataService.getStudents());
    const student = students.find((s: Student) => s.id === id) || null;
    return { data: student, success: true };
  }

  // Grades API
  async getGrades(studentId?: string): Promise<ApiResponse<Grade[]>> {
    await this.simulateDelay();
    const grades = this.getStoredData(this.storage.grades, mockDataService.getGrades());
    const filteredGrades = studentId 
      ? grades.filter((g: Grade) => g.studentId === studentId)
      : grades;
    return { data: filteredGrades, success: true };
  }

  async saveGrade(grade: Omit<Grade, 'id'>): Promise<ApiResponse<Grade>> {
    await this.simulateDelay();
    const grades = this.getStoredData(this.storage.grades, []);
    const newGrade = { ...grade, id: `grade_${Date.now()}` };
    grades.push(newGrade);
    this.setStoredData(this.storage.grades, grades);
    return { data: newGrade, success: true };
  }

  // Companies API
  async getCompanies(): Promise<ApiResponse<Company[]>> {
    await this.simulateDelay();
    const companies = this.getStoredData(this.storage.companies, this.getMockCompanies());
    return { data: companies, success: true };
  }

  async saveCompany(company: Omit<Company, 'id'>): Promise<ApiResponse<Company>> {
    await this.simulateDelay();
    const companies = this.getStoredData(this.storage.companies, []);
    const newCompany = { ...company, id: `company_${Date.now()}` };
    companies.push(newCompany);
    this.setStoredData(this.storage.companies, companies);
    return { data: newCompany, success: true };
  }

  // Mock data generators
  private getMockStudents(): Student[] {
    return [
      {
        id: 'student_1',
        name: 'Amina Benali',
        email: 'amina.benali@etudiant.univ-alger3.dz',
        studentId: '20230045',
        level: 'L3',
        specialization: 'Économie',
        grades: []
      },
      {
        id: 'student_2',
        name: 'Mohamed Djebbar',
        email: 'mohamed.djebbar@etudiant.univ-alger3.dz',
        studentId: '20230046',
        level: 'M1',
        specialization: 'Commerce International',
        grades: []
      }
    ];
  }

  private getMockGrades(): Grade[] {
    return [
      {
        id: 'student_1_grade_1',
        studentId: 'student_1', // Added missing studentId
        subject: 'Microéconomie',
        value: 14.5,
        coefficient: 3,
        semester: 'S5',
        year: '2023-2024'
      },
      {
        id: 'student_1_grade_2',
        studentId: 'student_1', // Added missing studentId
        subject: 'Macroéconomie',
        value: 16.0,
        coefficient: 3,
        semester: 'S5',
        year: '2023-2024'
      }
    ];
  }

  private getMockCompanies(): Company[] {
    return [
      {
        id: 'company_1',
        name: 'Sonatrach',
        sector: 'Énergie',
        contact: 'Ahmed Meziane',
        email: 'a.meziane@sonatrach.dz',
        partnerships: 15,
        rating: 4.8
      },
      {
        id: 'company_2',
        name: 'Banque d\'Algérie',
        sector: 'Finance',
        contact: 'Fatima Belkacem',
        email: 'f.belkacem@bank-of-algeria.dz',
        partnerships: 8,
        rating: 4.5
      },
      {
        id: 'company_3',
        name: 'Cevital',
        sector: 'Agroalimentaire',
        contact: 'Youcef Benaissa',
        email: 'y.benaissa@cevital.dz',
        partnerships: 12,
        rating: 4.3
      },
      {
        id: 'company_4',
        name: 'Djezzy',
        sector: 'Télécommunications',
        contact: 'Samira Kaci',
        email: 's.kaci@djezzy.dz',
        partnerships: 6,
        rating: 4.1
      }
    ];
  }

  private simulateDelay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const apiService = new ApiService();
export type { Student, Grade, Company, ApiResponse };
