
import { Specialty, FormationOffer } from '../types/academic';

class SpecialtyService {
  private specialties: Specialty[] = [];
  private formations: FormationOffer[] = [];

  // Méthodes pour les spécialités
  getSpecialties(): Specialty[] {
    return this.specialties.filter(s => s.isActive);
  }

  addSpecialty(specialty: Specialty): void {
    this.specialties.push(specialty);
  }

  updateSpecialty(id: string, updates: Partial<Specialty>): void {
    const index = this.specialties.findIndex(s => s.id === id);
    if (index !== -1) {
      this.specialties[index] = { ...this.specialties[index], ...updates, updatedAt: new Date() };
    }
  }

  deleteSpecialty(id: string): void {
    this.specialties = this.specialties.filter(s => s.id !== id);
  }

  // Méthodes pour les formations
  getFormations(): FormationOffer[] {
    return this.formations.filter(f => f.status !== 'archived');
  }

  getFormationsBySpecialty(specialtyId: string): FormationOffer[] {
    return this.formations.filter(f => f.specialtyId === specialtyId && f.status !== 'archived');
  }

  addFormation(formation: FormationOffer): void {
    this.formations.push(formation);
  }

  updateFormation(id: string, updates: Partial<FormationOffer>): void {
    const index = this.formations.findIndex(f => f.id === id);
    if (index !== -1) {
      this.formations[index] = { ...this.formations[index], ...updates, updatedAt: new Date() };
    }
  }

  deleteFormation(id: string): void {
    this.formations = this.formations.filter(f => f.id !== id);
  }

  // Calcul des semestres selon la durée
  calculateSemesters(durationInYears: number): string[] {
    const semesters: string[] = [];
    for (let year = 1; year <= durationInYears; year++) {
      semesters.push(`S${year * 2 - 1}`, `S${year * 2}`);
    }
    return semesters;
  }

  // Obtenir les formations disponibles pour attribution
  getFormationsForAssignment(): Array<{
    id: string;
    name: string;
    specialtyName: string;
    level: string;
    semesters: string[];
  }> {
    return this.formations
      .filter(f => f.status === 'validated')
      .map(f => {
        const specialty = this.specialties.find(s => s.id === f.specialtyId);
        return {
          id: f.id,
          name: f.name,
          specialtyName: specialty?.name || 'Spécialité inconnue',
          level: f.level,
          semesters: this.calculateSemesters(specialty?.duration || 3)
        };
      });
  }
}

export const specialtyService = new SpecialtyService();
