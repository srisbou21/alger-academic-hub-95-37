
import { FormationOffer, Module, Section, PedagogicalAtom } from "../types/academic";
import { SectionConfiguration } from "../types/workload";
import { formationOfferService } from "./formationOfferService";
import { workloadService } from "./workloadService";

export interface FormationModuleInfo {
  id: string;
  name: string;
  code: string;
  credits: number;
  coefficient: number;
  semester: 'S1' | 'S2';
  atoms: PedagogicalAtom[];
  responsibleId?: string;
  responsibleName?: string;
}

export interface FormationSectionInfo {
  id: string;
  name: string;
  code: string;
  capacity: number;
  groups: {
    id: string;
    name: string;
    code: string;
    type: 'td' | 'tp';
    capacity: number;
  }[];
}

export const workloadFormationService = {
  // Obtenir les formations disponibles pour une année académique
  async getAvailableFormations(academicYear: string): Promise<FormationOffer[]> {
    try {
      console.log(`Récupération des formations pour l'année: ${academicYear}`);
      const allFormations = await formationOfferService.getFormationOffers();
      const filteredFormations = allFormations.filter(formation => 
        formation.academicYear === academicYear && 
        formation.status === 'validated'
      );
      console.log(`${filteredFormations.length} formations trouvées`);
      return filteredFormations;
    } catch (error) {
      console.error('Erreur lors de la récupération des formations:', error);
      return [];
    }
  },

  // Obtenir les modules d'une formation avec données enrichies
  async getFormationModules(formationId: string): Promise<FormationModuleInfo[]> {
    try {
      console.log(`Récupération des modules pour la formation: ${formationId}`);
      const formation = await formationOfferService.getFormationOffer(formationId);
      if (!formation) {
        console.warn(`Formation ${formationId} non trouvée`);
        return [];
      }

      // Simuler des modules avec atomes pédagogiques pour la démo
      const mockModules: FormationModuleInfo[] = [
        {
          id: `module_${formationId}_1`,
          name: "Algorithmes et Structures de Données",
          code: "ASD-101",
          credits: 6,
          coefficient: 2,
          semester: 'S1',
          responsibleId: "teacher_1",
          responsibleName: "Dr. Ahmed Benali",
          atoms: [
            {
              id: "atom_1",
              type: "cours",
              hours: 42,
              totalWeeks: 14,
              groupSize: 60,
              description: "Cours magistral ASD"
            },
            {
              id: "atom_2", 
              type: "td",
              hours: 21,
              totalWeeks: 14,
              groupSize: 30,
              description: "Travaux dirigés ASD"
            },
            {
              id: "atom_3",
              type: "tp",
              hours: 21,
              totalWeeks: 14,
              groupSize: 15,
              description: "Travaux pratiques ASD"
            }
          ]
        },
        {
          id: `module_${formationId}_2`,
          name: "Bases de Données",
          code: "BD-102",
          credits: 5,
          coefficient: 1.5,
          semester: 'S1',
          responsibleId: "teacher_2",
          responsibleName: "Dr. Fatima Zohra",
          atoms: [
            {
              id: "atom_4",
              type: "cours",
              hours: 35,
              totalWeeks: 14,
              groupSize: 60,
              description: "Cours magistral BD"
            },
            {
              id: "atom_5",
              type: "tp",
              hours: 28,
              totalWeeks: 14,
              groupSize: 20,
              description: "Travaux pratiques BD"
            }
          ]
        }
      ];

      console.log(`${mockModules.length} modules trouvés pour la formation`);
      return mockModules;
    } catch (error) {
      console.error('Erreur lors de la récupération des modules:', error);
      return [];
    }
  },

  // Obtenir les sections configurées pour une formation
  async getFormationSections(formationId: string, academicYear: string): Promise<FormationSectionInfo[]> {
    try {
      console.log(`Récupération des sections pour formation ${formationId}, année ${academicYear}`);
      const configurations = await workloadService.getSectionConfigurations(formationId, academicYear);
      
      if (configurations.length === 0) {
        console.log('Aucune configuration trouvée, création de sections par défaut');
        // Retourner des sections par défaut si aucune configuration n'existe
        return [{
          id: 'default_section_1',
          name: 'Section A',
          code: 'SEC-A',
          capacity: 40,
          groups: [
            {
              id: 'group_td1',
              name: 'Groupe TD1',
              code: 'TD1',
              type: 'td',
              capacity: 20
            },
            {
              id: 'group_td2',
              name: 'Groupe TD2', 
              code: 'TD2',
              type: 'td',
              capacity: 20
            },
            {
              id: 'group_tp1',
              name: 'Groupe TP1',
              code: 'TP1',
              type: 'tp',
              capacity: 15
            },
            {
              id: 'group_tp2',
              name: 'Groupe TP2',
              code: 'TP2',
              type: 'tp',
              capacity: 15
            }
          ]
        }, {
          id: 'default_section_2',
          name: 'Section B',
          code: 'SEC-B',
          capacity: 35,
          groups: [
            {
              id: 'group_td3',
              name: 'Groupe TD3',
              code: 'TD3',
              type: 'td',
              capacity: 18
            },
            {
              id: 'group_td4',
              name: 'Groupe TD4',
              code: 'TD4',
              type: 'td',
              capacity: 17
            },
            {
              id: 'group_tp3',
              name: 'Groupe TP3',
              code: 'TP3',
              type: 'tp',
              capacity: 12
            },
            {
              id: 'group_tp4',
              name: 'Groupe TP4',
              code: 'TP4',
              type: 'tp',
              capacity: 12
            }
          ]
        }];
      }

      // Convertir les configurations en format simplifié
      const sections: FormationSectionInfo[] = [];
      configurations.forEach(config => {
        config.sections.forEach(section => {
          sections.push({
            id: section.id,
            name: section.name,
            code: section.code,
            capacity: section.capacity,
            groups: section.groups.map(group => ({
              id: group.id,
              name: group.name,
              code: group.code,
              type: group.type,
              capacity: group.capacity
            }))
          });
        });
      });

      console.log(`${sections.length} sections trouvées`);
      return sections;
    } catch (error) {
      console.error('Erreur lors de la récupération des sections:', error);
      // Retourner des sections par défaut en cas d'erreur
      return [{
        id: 'fallback_section',
        name: 'Section par Défaut',
        code: 'SEC-DEFAULT',
        capacity: 30,
        groups: [
          {
            id: 'fallback_group',
            name: 'Groupe 1',
            code: 'G1',
            type: 'td',
            capacity: 15
          }
        ]
      }];
    }
  },

  // Obtenir les atomes pédagogiques d'un module
  getModuleAtoms(module: FormationModuleInfo): PedagogicalAtom[] {
    console.log(`Récupération des atomes pour le module: ${module.name}`);
    return module.atoms || [];
  },

  // Calculer les heures totales d'un atome pour un public donné
  calculateAtomHours(atom: PedagogicalAtom, targetCapacity: number): {
    hoursPerWeek: number;
    totalWeeks: number;
    totalHours: number;
    groupsNeeded: number;
  } {
    console.log(`Calcul des heures pour l'atome ${atom.type}, capacité cible: ${targetCapacity}`);
    
    const hoursPerWeek = atom.hours / atom.totalWeeks;
    let groupsNeeded = 1;
    let adjustedHoursPerWeek = hoursPerWeek;
    
    // Ajuster selon le type d'atome et la capacité
    if (atom.type === 'td' || atom.type === 'tp') {
      // Pour TD/TP, diviser par groupes si nécessaire
      groupsNeeded = Math.ceil(targetCapacity / atom.groupSize);
      adjustedHoursPerWeek = hoursPerWeek * groupsNeeded;
    }

    const result = {
      hoursPerWeek: adjustedHoursPerWeek,
      totalWeeks: atom.totalWeeks,
      totalHours: adjustedHoursPerWeek * atom.totalWeeks,
      groupsNeeded
    };

    console.log(`Résultat du calcul:`, result);
    return result;
  },

  // Valider qu'une attribution est possible
  validateAssignment(
    module: FormationModuleInfo,
    atom: PedagogicalAtom,
    section: FormationSectionInfo,
    targetType: 'section' | 'group',
    targetId?: string
  ): { valid: boolean; message?: string } {
    console.log(`Validation de l'attribution pour ${atom.type} du module ${module.name}`);

    // Vérifier que l'atome existe dans le module
    if (!module.atoms.find(a => a.id === atom.id)) {
      const message = "Cet atome n'appartient pas au module sélectionné";
      console.warn(message);
      return { valid: false, message };
    }

    // Vérifier la compatibilité section/groupe
    if (targetType === 'group') {
      if (!targetId || !section.groups.find(g => g.id === targetId)) {
        const message = "Groupe invalide pour cette section";
        console.warn(message);
        return { valid: false, message };
      }
      
      const group = section.groups.find(g => g.id === targetId);
      if (group && atom.type !== 'cours' && group.type !== atom.type) {
        const message = `Type d'atome incompatible: ${atom.type} ne peut pas être assigné à un groupe ${group.type}`;
        console.warn(message);
        return { valid: false, message };
      }
    }

    // Vérifier la capacité pour les TP
    if (atom.type === 'tp' && section.capacity > atom.groupSize * 4) {
      const message = "Capacité de la section trop importante pour ce type de TP";
      console.warn(message);
      return { valid: false, message };
    }

    // Vérification des contraintes logiques supplémentaires
    if (atom.type === 'cours' && targetType === 'group') {
      const message = "Un cours magistral ne peut pas être assigné à un groupe spécifique";
      console.warn(message);
      return { valid: false, message };
    }

    console.log('Validation réussie');
    return { valid: true };
  },

  // Nouvelle méthode: Obtenir les statistiques d'une formation
  async getFormationStatistics(formationId: string, academicYear: string): Promise<{
    totalModules: number;
    totalAtoms: number;
    totalHours: number;
    sectionCount: number;
    groupCount: number;
  }> {
    try {
      const [modules, sections] = await Promise.all([
        this.getFormationModules(formationId),
        this.getFormationSections(formationId, academicYear)
      ]);

      const totalAtoms = modules.reduce((sum, module) => sum + module.atoms.length, 0);
      const totalHours = modules.reduce((sum, module) => 
        sum + module.atoms.reduce((atomSum, atom) => atomSum + atom.hours, 0), 0
      );
      const groupCount = sections.reduce((sum, section) => sum + section.groups.length, 0);

      return {
        totalModules: modules.length,
        totalAtoms,
        totalHours,
        sectionCount: sections.length,
        groupCount
      };
    } catch (error) {
      console.error('Erreur lors du calcul des statistiques:', error);
      return {
        totalModules: 0,
        totalAtoms: 0,
        totalHours: 0,
        sectionCount: 0,
        groupCount: 0
      };
    }
  }
};
