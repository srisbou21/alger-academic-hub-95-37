
import { AdvancementEvaluation, AdvancementProposal, EchelonAdvancement } from '../../types/advancement';

export class AdvancementStorage {
  private static readonly STORAGE_KEY = 'fsecsg_advancements';
  private static readonly EVALUATIONS_KEY = 'fsecsg_evaluations';
  private static readonly PROPOSALS_KEY = 'fsecsg_proposals';

  // Gestion des évaluations
  static async saveEvaluation(evaluation: AdvancementEvaluation): Promise<void> {
    const evaluations = await this.getEvaluations();
    evaluations.push(evaluation);
    localStorage.setItem(this.EVALUATIONS_KEY, JSON.stringify(evaluations));
  }

  static async getEvaluations(employeeId?: string): Promise<AdvancementEvaluation[]> {
    try {
      const stored = localStorage.getItem(this.EVALUATIONS_KEY);
      const evaluations: AdvancementEvaluation[] = stored ? JSON.parse(stored) : [];
      
      if (employeeId) {
        return evaluations.filter(e => e.employeeId === employeeId);
      }
      
      return evaluations;
    } catch (error) {
      console.error('Erreur lors du chargement des évaluations:', error);
      return [];
    }
  }

  // Gestion des propositions
  static async saveProposal(proposal: AdvancementProposal): Promise<void> {
    const proposals = await this.getProposals();
    proposals.push(proposal);
    localStorage.setItem(this.PROPOSALS_KEY, JSON.stringify(proposals));
  }

  static async getProposals(status?: AdvancementProposal['finalStatus']): Promise<AdvancementProposal[]> {
    try {
      const stored = localStorage.getItem(this.PROPOSALS_KEY);
      const proposals: AdvancementProposal[] = stored ? JSON.parse(stored) : [];
      
      if (status) {
        return proposals.filter(p => p.finalStatus === status);
      }
      
      return proposals;
    } catch (error) {
      console.error('Erreur lors du chargement des propositions:', error);
      return [];
    }
  }

  // Gestion des avancements
  static async saveAdvancements(advancements: EchelonAdvancement[]): Promise<void> {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(advancements));
  }

  static async getAdvancements(): Promise<EchelonAdvancement[]> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Erreur lors du chargement des avancements:', error);
      return [];
    }
  }
}
