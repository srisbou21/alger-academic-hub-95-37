
import { EchelonAdvancement, AdvancementEvaluation, AdvancementProposal } from '../types/advancement';
import { AdvancementStorage } from './advancement/advancementStorage';
import { AdvancementCalculations } from './advancement/advancementCalculations';

interface Employee {
  id: string;
  name: string;
  type: 'enseignant' | 'administratif';
  grade: string;
  currentEchelon: number;
  appointmentDate: Date;
  lastEvaluationScore: number;
  status: 'active' | 'inactive' | 'suspended';
}

export class AdvancementService {
  // Charger tous les avancements
  async getAllAdvancements(): Promise<EchelonAdvancement[]> {
    return await AdvancementStorage.getAdvancements();
  }

  // Détecter automatiquement l'éligibilité
  async detectEligibility(employees: Employee[]): Promise<EchelonAdvancement[]> {
    const advancements: EchelonAdvancement[] = [];
    
    for (const employee of employees) {
      if (employee.status !== 'active') continue;
      
      try {
        // Calculer la durée d'avancement basée sur la notation
        const requiredDuration = AdvancementCalculations.calculateAdvancementDuration(employee.lastEvaluationScore);
        
        // Calculer l'ancienneté
        const anciennete = AdvancementCalculations.calculateAnciennete(employee.appointmentDate);
        
        // Calculer la date d'éligibilité
        const eligibilityDate = AdvancementCalculations.calculateEligibilityDate(employee.appointmentDate, requiredDuration);
        
        // Déterminer le statut d'avancement
        const status = AdvancementCalculations.determineAdvancementStatus(
          anciennete, 
          requiredDuration, 
          employee.currentEchelon, 
          employee.lastEvaluationScore
        );

        const advancement: EchelonAdvancement = {
          id: `adv_${employee.id}_${Date.now()}`,
          employeeId: employee.id,
          employeeName: employee.name,
          currentEchelon: employee.currentEchelon,
          targetEchelon: employee.currentEchelon + 1,
          appointmentDate: employee.appointmentDate,
          eligibilityDate,
          requiredDuration,
          anciennete,
          lastEvaluation: {
            score: employee.lastEvaluationScore,
            year: new Date().getFullYear(),
            duration: requiredDuration
          },
          status,
          suspensionReason: employee.lastEvaluationScore < 12 ? 'Score insuffisant pour avancement' : undefined
        };

        advancements.push(advancement);
      } catch (error) {
        console.error(`Erreur lors du calcul pour ${employee.name}:`, error);
      }
    }

    // Sauvegarder les avancements calculés
    await AdvancementStorage.saveAdvancements(advancements);
    return advancements;
  }

  // Traiter un avancement automatique
  async processAdvancement(advancementId: string): Promise<boolean> {
    try {
      const advancements = await this.getAllAdvancements();
      const advancement = advancements.find(a => a.id === advancementId);
      
      if (!advancement) return false;

      // Marquer comme traité
      advancement.status = 'processed';
      advancement.processedAt = new Date();
      advancement.processedBy = 'Système automatique';
      advancement.decisionType = 'automatic';

      // Sauvegarder les modifications
      await AdvancementStorage.saveAdvancements(advancements);
      return true;
    } catch (error) {
      console.error('Erreur lors du traitement de l\'avancement:', error);
      return false;
    }
  }

  // Suspendre un avancement
  async suspendAdvancement(advancementId: string, reason: string): Promise<boolean> {
    try {
      const advancements = await this.getAllAdvancements();
      const advancement = advancements.find(a => a.id === advancementId);
      
      if (!advancement) return false;

      advancement.status = 'suspended';
      advancement.suspensionReason = reason;

      await AdvancementStorage.saveAdvancements(advancements);
      return true;
    } catch (error) {
      console.error('Erreur lors de la suspension:', error);
      return false;
    }
  }

  // Générer des alertes pour les avancements
  async generateAlerts(): Promise<Array<{
    type: 'eligible' | 'approaching' | 'overdue';
    employeeId: string;
    employeeName: string;
    message: string;
    priority: 'high' | 'medium' | 'low';
    daysUntilEligible: number;
  }>> {
    const advancements = await this.getAllAdvancements();
    const alerts = [];
    const today = new Date();

    for (const advancement of advancements) {
      const daysUntilEligible = Math.ceil(
        (advancement.eligibilityDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (advancement.status === 'eligible') {
        alerts.push({
          type: 'eligible' as const,
          employeeId: advancement.employeeId,
          employeeName: advancement.employeeName,
          message: `Éligible pour avancement depuis ${Math.abs(daysUntilEligible)} jours`,
          priority: 'high' as const,
          daysUntilEligible
        });
      } else if (daysUntilEligible <= 0 && advancement.status === 'pending') {
        alerts.push({
          type: 'overdue' as const,
          employeeId: advancement.employeeId,
          employeeName: advancement.employeeName,
          message: `Avancement en retard de ${Math.abs(daysUntilEligible)} jours`,
          priority: 'high' as const,
          daysUntilEligible
        });
      } else if (daysUntilEligible <= 30 && daysUntilEligible > 0) {
        alerts.push({
          type: 'approaching' as const,
          employeeId: advancement.employeeId,
          employeeName: advancement.employeeName,
          message: `Éligible dans ${daysUntilEligible} jours`,
          priority: 'medium' as const,
          daysUntilEligible
        });
      }
    }

    return alerts;
  }

  // Simuler la carrière d'un employé
  async simulateCareer(employeeId: string, yearsAhead: number = 10): Promise<Array<{
    year: number;
    echelon: number;
    estimatedScore: number;
    duration: 30 | 36 | 42;
  }>> {
    const advancements = await this.getAllAdvancements();
    const advancement = advancements.find(a => a.employeeId === employeeId);
    
    if (!advancement) return [];

    const simulation = [];
    let currentEchelon = advancement.currentEchelon;
    let currentYear = new Date().getFullYear();
    
    for (let i = 0; i < yearsAhead; i++) {
      // Estimation du score basée sur la tendance historique
      const estimatedScore = Math.min(20, advancement.lastEvaluation.score + Math.random() * 2 - 1);
      const duration = AdvancementCalculations.calculateAdvancementDuration(estimatedScore);
      
      // Avancement possible tous les 3 ans en moyenne
      if (i > 0 && i % 3 === 0 && currentEchelon < 12) {
        currentEchelon++;
      }

      simulation.push({
        year: currentYear + i,
        echelon: currentEchelon,
        estimatedScore: Math.round(estimatedScore * 10) / 10,
        duration
      });
    }

    return simulation;
  }
}

export const advancementService = new AdvancementService();
