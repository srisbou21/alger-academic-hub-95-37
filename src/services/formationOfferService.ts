
import { FormationOffer, Module } from '../types/academic';
import { specialtyService } from './specialtyService';

class FormationOfferService {
  private formations: FormationOffer[] = [];

  async getFormationOffers(): Promise<FormationOffer[]> {
    // Simulation d'un appel API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.formations);
      }, 100);
    });
  }

  async getFormationOffer(id: string): Promise<FormationOffer | null> {
    // Simulation d'un appel API pour obtenir une formation spécifique
    return new Promise((resolve) => {
      setTimeout(() => {
        const formation = this.formations.find(f => f.id === id);
        resolve(formation || null);
      }, 100);
    });
  }

  async createFormationOffer(formation: Omit<FormationOffer, 'id' | 'createdAt' | 'updatedAt'>): Promise<FormationOffer> {
    const newFormation: FormationOffer = {
      ...formation,
      id: `formation_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.formations.push(newFormation);
    specialtyService.addFormation(newFormation);
    
    return newFormation;
  }

  async updateFormationOffer(id: string, updates: Partial<FormationOffer>): Promise<FormationOffer | null> {
    const index = this.formations.findIndex(f => f.id === id);
    if (index === -1) return null;

    const updatedFormation = {
      ...this.formations[index],
      ...updates,
      updatedAt: new Date()
    };

    this.formations[index] = updatedFormation;
    specialtyService.updateFormation(id, updates);
    
    return updatedFormation;
  }

  async deleteFormationOffer(id: string): Promise<boolean> {
    const index = this.formations.findIndex(f => f.id === id);
    if (index === -1) return false;

    this.formations.splice(index, 1);
    specialtyService.deleteFormation(id);
    
    return true;
  }

  // Obtenir les formations avec leurs semestres calculés
  async getFormationsWithSemesters(): Promise<Array<FormationOffer & { availableSemesters: string[] }>> {
    const formations = await this.getFormationOffers();
    
    return formations.map(formation => {
      // Calculer les semestres selon la durée de la spécialité
      const specialty = specialtyService.getSpecialties().find(s => s.id === formation.specialtyId);
      const durationInYears = specialty?.duration || 3;
      const availableSemesters = specialtyService.calculateSemesters(durationInYears);
      
      return {
        ...formation,
        availableSemesters
      };
    });
  }

  // Obtenir les modules d'une formation pour un semestre donné
  getModulesForSemester(formationId: string, semester: string): Module[] {
    const formation = this.formations.find(f => f.id === formationId);
    if (!formation) return [];

    return formation.modules.filter(module => module.semester.toString() === semester);
  }

  // Nouvelle méthode: Obtenir les semestres disponibles depuis les canevas
  async getAvailableSemesters(): Promise<string[]> {
    const formations = await this.getFormationOffers();
    const semestersSet = new Set<string>();
    
    formations.forEach(formation => {
      if (formation.modules) {
        formation.modules.forEach(module => {
          semestersSet.add(`S${module.semester}`);
        });
      }
    });
    
    return Array.from(semestersSet).sort();
  }

  // Nouvelle méthode: Obtenir tous les modules depuis les canevas
  async getAllModulesFromCanvas(): Promise<Array<Module & { formationName: string; specialtyId: string }>> {
    const formations = await this.getFormationOffers();
    const modules: Array<Module & { formationName: string; specialtyId: string }> = [];
    
    formations.forEach(formation => {
      if (formation.modules) {
        formation.modules.forEach(module => {
          modules.push({
            ...module,
            formationName: formation.name,
            specialtyId: formation.specialtyId
          });
        });
      }
    });
    
    return modules;
  }

  // Nouvelle méthode: Obtenir les formations avec les données enrichies pour l'attribution
  async getFormationsForAssignment(): Promise<Array<{
    id: string;
    name: string;
    level: string;
    department: string;
    semester: 'S1' | 'S2' | 'Année';
    specialtyName: string;
    semesters: string[];
  }>> {
    const formations = await this.getFormationOffers();
    
    return formations
      .filter(f => f.status === 'validated')
      .map(formation => {
        const specialty = specialtyService.getSpecialties().find(s => s.id === formation.specialtyId);
        const availableSemesters = specialty ? specialtyService.calculateSemesters(specialty.duration) : ['S1', 'S2'];
        
        return {
          id: formation.id,
          name: formation.name,
          level: formation.level,
          department: specialty?.name || 'Département inconnu',
          semester: 'Année' as const,
          specialtyName: specialty?.name || 'Spécialité inconnue',
          semesters: availableSemesters
        };
      });
  }
}

export const formationOfferService = new FormationOfferService();
