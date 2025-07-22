
export interface EchelonHistoryEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  previousEchelon: number;
  newEchelon: number;
  grade: string;
  promotionDate: Date;
  acquisitionDate: Date;
  duration: 'courte' | 'moyenne' | 'longue';
  durationMonths: 30 | 36 | 42;
  reason: string;
  processedBy: string;
}

class EchelonHistoryService {
  private readonly STORAGE_KEY = 'echelon_history';

  // Initialiser avec des données d'exemple d'historique
  initializeExampleHistory(): void {
    const existing = localStorage.getItem(this.STORAGE_KEY);
    if (!existing) {
      const exampleHistory = this.generateExampleHistory();
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(exampleHistory));
      console.log('📈 Historique des échelons d\'exemple initialisé');
    }
  }

  private generateExampleHistory(): EchelonHistoryEntry[] {
    const now = new Date();
    return [
      {
        id: 'hist_001',
        employeeId: 'emp001',
        employeeName: 'Dr. Ahmed Benali',
        previousEchelon: 2,
        newEchelon: 3,
        grade: 'Maitre de Conférences A',
        promotionDate: new Date(now.getTime() - 18 * 30 * 24 * 60 * 60 * 1000), // il y a 18 mois
        acquisitionDate: new Date(now.getTime() + 18 * 30 * 24 * 60 * 60 * 1000), // dans 18 mois
        duration: 'moyenne',
        durationMonths: 36,
        reason: 'Promotion régulière - Performance satisfaisante',
        processedBy: 'Commission RH'
      },
      {
        id: 'hist_002',
        employeeId: 'emp002',
        employeeName: 'Mme. Fatima Khelifi',
        previousEchelon: 4,
        newEchelon: 5,
        grade: 'Attaché Principal',
        promotionDate: new Date(now.getTime() - 24 * 30 * 24 * 60 * 60 * 1000), // il y a 24 mois
        acquisitionDate: new Date(now.getTime() + 12 * 30 * 24 * 60 * 60 * 1000), // dans 12 mois
        duration: 'moyenne',
        durationMonths: 36,
        reason: 'Évaluation positive - Avancement normal',
        processedBy: 'Service RH'
      },
      {
        id: 'hist_003',
        employeeId: 'emp003',
        employeeName: 'Prof. Mohamed Saidi',
        previousEchelon: 7,
        newEchelon: 8,
        grade: 'Professeur',
        promotionDate: new Date(now.getTime() - 42 * 30 * 24 * 60 * 60 * 1000), // il y a 42 mois
        acquisitionDate: new Date(now.getTime() - 6 * 30 * 24 * 60 * 60 * 1000), // il y a 6 mois (acquis)
        duration: 'longue',
        durationMonths: 42,
        reason: 'Promotion après évaluation approfondie',
        processedBy: 'Commission Scientifique'
      },
      {
        id: 'hist_004',
        employeeId: 'emp004',
        employeeName: 'M. Karim Boudjemaa',
        previousEchelon: 6,
        newEchelon: 7,
        grade: 'Administrateur',
        promotionDate: new Date(now.getTime() - 30 * 30 * 24 * 60 * 60 * 1000), // il y a 30 mois
        acquisitionDate: new Date(now.getTime() + 6 * 30 * 24 * 60 * 60 * 1000), // dans 6 mois
        duration: 'moyenne',
        durationMonths: 36,
        reason: 'Performance administrative excellente',
        processedBy: 'Direction des Ressources Humaines'
      },
      {
        id: 'hist_005',
        employeeId: 'emp005',
        employeeName: 'Dr. Amina Cherifi',
        previousEchelon: 3,
        newEchelon: 4,
        grade: 'Maitre Assistant A',
        promotionDate: new Date(now.getTime() - 36 * 30 * 24 * 60 * 60 * 1000), // il y a 36 mois
        acquisitionDate: new Date(now.getTime()), // maintenant (vient d'acquérir)
        duration: 'moyenne',
        durationMonths: 36,
        reason: 'Recherche et enseignement de qualité',
        processedBy: 'Conseil Scientifique'
      },
      // Employés éligibles au suivi automatique (30+ mois sans promotion)
      {
        id: 'hist_006',
        employeeId: 'emp006',
        employeeName: 'Mme. Leila Brahimi',
        previousEchelon: 5,
        newEchelon: 6,
        grade: 'Secrétaire Principal',
        promotionDate: new Date(now.getTime() - 33 * 30 * 24 * 60 * 60 * 1000), // il y a 33 mois
        acquisitionDate: new Date(now.getTime() + 3 * 30 * 24 * 60 * 60 * 1000), // dans 3 mois
        duration: 'moyenne',
        durationMonths: 36,
        reason: 'Service administratif exemplaire',
        processedBy: 'Service RH'
      }
    ];
  }

  // Récupérer tout l'historique
  getAllHistory(): EchelonHistoryEntry[] {
    this.initializeExampleHistory();
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) return [];
    
    return JSON.parse(stored).map((entry: any) => ({
      ...entry,
      promotionDate: new Date(entry.promotionDate),
      acquisitionDate: new Date(entry.acquisitionDate)
    }));
  }

  // Récupérer l'historique d'un employé
  async getEmployeeHistory(employeeId: string): Promise<EchelonHistoryEntry[]> {
    const allHistory = this.getAllHistory();
    return allHistory
      .filter(entry => entry.employeeId === employeeId)
      .sort((a, b) => b.promotionDate.getTime() - a.promotionDate.getTime());
  }

  // Ajouter une nouvelle entrée d'historique
  async addHistoryEntry(entry: Omit<EchelonHistoryEntry, 'id'>): Promise<void> {
    const allHistory = this.getAllHistory();
    const newEntry: EchelonHistoryEntry = {
      ...entry,
      id: `hist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    
    allHistory.push(newEntry);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allHistory));
  }

  // Calculer les mois depuis la dernière promotion
  calculateMonthsSinceLastPromotion(employeeId: string): number {
    const history = this.getAllHistory().filter(entry => entry.employeeId === employeeId);
    if (history.length === 0) {
      // Si pas d'historique, utiliser la date de nomination fictive (il y a 3-5 ans)
      const appointmentMonthsAgo = Math.floor(Math.random() * 24) + 36; // entre 36 et 60 mois
      return appointmentMonthsAgo;
    }
    
    const latestPromotion = history.sort((a, b) => b.promotionDate.getTime() - a.promotionDate.getTime())[0];
    const now = new Date();
    const monthsDiff = Math.floor((now.getTime() - latestPromotion.promotionDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
    
    return monthsDiff;
  }

  // Obtenir la dernière date d'acquisition pour le calcul des promotions
  getLastAcquisitionDate(employeeId: string): Date | null {
    const history = this.getAllHistory().filter(entry => entry.employeeId === employeeId);
    if (history.length === 0) return null;
    
    const latestEntry = history.sort((a, b) => b.acquisitionDate.getTime() - a.acquisitionDate.getTime())[0];
    return latestEntry.acquisitionDate;
  }

  // Statistiques globales
  getGlobalStats() {
    const allHistory = this.getAllHistory();
    const now = new Date();
    
    return {
      totalPromotions: allHistory.length,
      averageDuration: Math.round(
        allHistory.reduce((sum, entry) => sum + entry.durationMonths, 0) / allHistory.length
      ),
      recentPromotions: allHistory.filter(
        entry => (now.getTime() - entry.promotionDate.getTime()) < (6 * 30 * 24 * 60 * 60 * 1000)
      ).length,
      byDuration: {
        courte: allHistory.filter(e => e.duration === 'courte').length,
        moyenne: allHistory.filter(e => e.duration === 'moyenne').length,
        longue: allHistory.filter(e => e.duration === 'longue').length
      }
    };
  }
}

export const echelonHistoryService = new EchelonHistoryService();
