
import { GradeEchelon, TeacherEchelon } from '../../types/echelon';
import { getDefaultEchelons } from './echelonData';

export class EchelonStorage {
  private gradeStorageKey = 'fsecsg_grade_echelons';
  private teacherEchelonKey = 'fsecsg_teacher_echelons';

  async getAllGradeEchelons(): Promise<GradeEchelon[]> {
    try {
      const stored = localStorage.getItem(this.gradeStorageKey);
      if (stored) {
        return JSON.parse(stored);
      } else {
        const defaultData = getDefaultEchelons();
        localStorage.setItem(this.gradeStorageKey, JSON.stringify(defaultData));
        return defaultData;
      }
    } catch (error) {
      console.error('Erreur lors du chargement des échelons:', error);
      return getDefaultEchelons();
    }
  }

  async saveGradeEchelons(gradeEchelons: GradeEchelon[]): Promise<void> {
    localStorage.setItem(this.gradeStorageKey, JSON.stringify(gradeEchelons));
  }

  async getTeacherEchelons(): Promise<TeacherEchelon[]> {
    try {
      const stored = localStorage.getItem(this.teacherEchelonKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Erreur lors du chargement des affectations:', error);
      return [];
    }
  }

  async saveTeacherEchelons(teacherEchelons: TeacherEchelon[]): Promise<void> {
    localStorage.setItem(this.teacherEchelonKey, JSON.stringify(teacherEchelons));
  }
}
