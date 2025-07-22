
import { teacherService } from './teacherService';

export interface TeacherForAssignment {
  id: string;
  name: string;
  grade: string;
  specialty: string;
  department: string;
  isActive: boolean;
}

class TeacherDataService {
  // Récupérer les enseignants depuis le module GRH
  async getTeachersFromHR(): Promise<TeacherForAssignment[]> {
    try {
      console.log('Récupération des enseignants depuis le module GRH...');
      
      // Récupérer tous les enseignants depuis le service GRH (teacherService)
      const allTeachers = await teacherService.getAllTeachers();
      
      // Transformer les enseignants pour correspondre à l'interface TeacherForAssignment
      const teachers = allTeachers.map(teacher => ({
        id: teacher.id,
        name: `${teacher.firstName} ${teacher.lastName}`,
        grade: teacher.grade,
        specialty: teacher.specialty,
        department: teacher.professionalInfo?.department || teacher.departmentId || 'Non défini',
        isActive: teacher.isActive
      }));
      
      console.log(`${teachers.length} enseignants trouvés dans le module GRH (actifs et inactifs)`);
      return teachers;
    } catch (error) {
      console.error('Erreur lors de la récupération des enseignants:', error);
      return [];
    }
  }

  // Récupérer un enseignant spécifique
  async getTeacherById(id: string): Promise<TeacherForAssignment | null> {
    const teachers = await this.getTeachersFromHR();
    return teachers.find(teacher => teacher.id === id) || null;
  }
}

export const teacherDataService = new TeacherDataService();
