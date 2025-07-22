
import { Echelon, GradeEchelon, TeacherEchelon } from '../types/echelon';
import { EchelonStorage } from './echelon/echelonStorage';

class EchelonService {
  private storage = new EchelonStorage();

  async getAllGradeEchelons(): Promise<GradeEchelon[]> {
    return this.storage.getAllGradeEchelons();
  }

  async getEchelonsByGrade(grade: string): Promise<Echelon[]> {
    const gradeEchelons = await this.getAllGradeEchelons();
    const gradeData = gradeEchelons.find(g => g.grade === grade);
    return gradeData?.echelons || [];
  }

  async saveEchelon(echelon: Omit<Echelon, 'id' | 'date_creation'>): Promise<Echelon> {
    const gradeEchelons = await this.getAllGradeEchelons();
    const newEchelon: Echelon = {
      ...echelon,
      id: `echelon_${Date.now()}`,
      date_creation: new Date()
    };

    const gradeIndex = gradeEchelons.findIndex(g => g.grade === echelon.grade);
    if (gradeIndex !== -1) {
      gradeEchelons[gradeIndex].echelons.push(newEchelon);
    } else {
      gradeEchelons.push({
        grade: echelon.grade,
        statut_grade: 'actif',
        echelons: [newEchelon]
      });
    }

    await this.storage.saveGradeEchelons(gradeEchelons);
    return newEchelon;
  }

  async updateEchelon(id: string, updates: Partial<Echelon>): Promise<Echelon | null> {
    const gradeEchelons = await this.getAllGradeEchelons();
    
    for (const gradeData of gradeEchelons) {
      const echelonIndex = gradeData.echelons.findIndex(e => e.id === id);
      if (echelonIndex !== -1) {
        gradeData.echelons[echelonIndex] = {
          ...gradeData.echelons[echelonIndex],
          ...updates,
          date_modification: new Date()
        };
        await this.storage.saveGradeEchelons(gradeEchelons);
        return gradeData.echelons[echelonIndex];
      }
    }
    return null;
  }

  async deleteEchelon(id: string): Promise<boolean> {
    const gradeEchelons = await this.getAllGradeEchelons();
    
    for (const gradeData of gradeEchelons) {
      const echelonIndex = gradeData.echelons.findIndex(e => e.id === id);
      if (echelonIndex !== -1) {
        gradeData.echelons.splice(echelonIndex, 1);
        await this.storage.saveGradeEchelons(gradeEchelons);
        return true;
      }
    }
    return false;
  }

  async getTeacherCurrentEchelon(teacherId: string): Promise<{ echelon: Echelon; affectation: TeacherEchelon } | null> {
    try {
      const teacherEchelons = await this.storage.getTeacherEchelons();
      
      const currentAffectation = teacherEchelons.find(
        te => te.teacher_id === teacherId && te.statut === 'actuel'
      );

      if (!currentAffectation) return null;

      const gradeEchelons = await this.getAllGradeEchelons();
      for (const gradeData of gradeEchelons) {
        const echelon = gradeData.echelons.find(e => e.id === currentAffectation.echelon_id);
        if (echelon) {
          return { echelon, affectation: currentAffectation };
        }
      }
      return null;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'échelon:', error);
      return null;
    }
  }

  async affectTeacherToEchelon(teacherId: string, echelonId: string, motif?: string): Promise<TeacherEchelon> {
    const teacherEchelons = await this.storage.getTeacherEchelons();

    // Marquer l'ancienne affectation comme historique
    const currentIndex = teacherEchelons.findIndex(
      te => te.teacher_id === teacherId && te.statut === 'actuel'
    );
    
    if (currentIndex !== -1) {
      teacherEchelons[currentIndex].statut = 'historique';
      teacherEchelons[currentIndex].date_fin = new Date();
    }

    // Créer la nouvelle affectation
    const newAffectation: TeacherEchelon = {
      teacher_id: teacherId,
      echelon_id: echelonId,
      date_affectation: new Date(),
      motif_changement: motif,
      statut: 'actuel'
    };

    teacherEchelons.push(newAffectation);
    await this.storage.saveTeacherEchelons(teacherEchelons);
    
    return newAffectation;
  }

  async getTeacherEchelonHistory(teacherId: string): Promise<Array<{ echelon: Echelon; affectation: TeacherEchelon }>> {
    try {
      const teacherEchelons = await this.storage.getTeacherEchelons();
      
      const teacherAffectations = teacherEchelons.filter(te => te.teacher_id === teacherId);
      const gradeEchelons = await this.getAllGradeEchelons();
      
      const history = [];
      for (const affectation of teacherAffectations) {
        for (const gradeData of gradeEchelons) {
          const echelon = gradeData.echelons.find(e => e.id === affectation.echelon_id);
          if (echelon) {
            history.push({ echelon, affectation });
            break;
          }
        }
      }
      
      return history.sort((a, b) => 
        new Date(b.affectation.date_affectation).getTime() - new Date(a.affectation.date_affectation).getTime()
      );
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'historique:', error);
      return [];
    }
  }

  calculateSalaryWithEchelon(echelon: Echelon, anciennete: number = 0): number {
    const ancienneteBonus = Math.floor(anciennete / 2) * (echelon.salaire_base * 0.02);
    return echelon.salaire_base + echelon.prime_rendement + echelon.indemnite_experience + ancienneteBonus;
  }
}

export const echelonService = new EchelonService();
