
import { ADVANCEMENT_DURATIONS, ECHELON_RANGE } from '../../types/advancement';

export class AdvancementCalculations {
  // Calcul de la durée d'avancement selon la notation
  static calculateAdvancementDuration(score: number): 30 | 36 | 42 {
    if (score >= 18) return 30; // Excellent
    if (score >= 14) return 36; // Satisfaisant
    if (score >= 12) return 42; // Passable
    throw new Error('Score insuffisant pour l\'avancement');
  }

  // Calcul de l'ancienneté en mois et jours
  static calculateAnciennete(appointmentDate: Date): { months: number; days: number; totalDays: number } {
    const today = new Date();
    const diffTime = today.getTime() - appointmentDate.getTime();
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const months = Math.floor(totalDays / 30);
    const days = totalDays % 30;
    
    return { months, days, totalDays };
  }

  // Calcul de la date d'éligibilité
  static calculateEligibilityDate(appointmentDate: Date, requiredDuration: 30 | 36 | 42): Date {
    const eligibilityDate = new Date(appointmentDate);
    eligibilityDate.setMonth(eligibilityDate.getMonth() + requiredDuration);
    return eligibilityDate;
  }

  // Déterminer le statut d'avancement
  static determineAdvancementStatus(
    anciennete: { totalDays: number }, 
    requiredDuration: number, 
    currentEchelon: number, 
    score: number
  ): 'pending' | 'eligible' | 'processed' | 'suspended' | 'blocked' {
    if (score < 12) return 'suspended';
    if (currentEchelon >= ECHELON_RANGE.MAX) return 'blocked';
    
    const requiredDays = requiredDuration * 30;
    if (anciennete.totalDays >= requiredDays) return 'eligible';
    if (anciennete.totalDays >= requiredDays * 0.9) return 'pending';
    
    return 'pending';
  }
}
