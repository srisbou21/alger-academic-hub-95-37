import { mockDataService, MockEmployee } from './mockDataService';
import { echelonHistoryService } from './echelonHistoryService';
import { timetableService } from './timetableService';
import { additionalEmployees } from './mockData/employeeDataService';
import { createExtendedEchelonHistory } from './mockData/echelonHistoryDataService';
import { calculateSystemStats, SystemStats } from './mockData/statisticsService';

// Extension du service de données d'exemple avec plus d'employés pour le suivi automatique
class EnhancedMockDataService {
  
  // Générer des employés supplémentaires avec différents statuts d'échelons
  getExtendedEmployees(): MockEmployee[] {
    const baseEmployees = mockDataService.getEmployees();
    return [...baseEmployees, ...additionalEmployees];
  }

  // Initialiser toutes les données enrichies
  initializeEnhancedData(): void {
    // Initialiser les employés étendus
    const enhancedEmployees = this.getExtendedEmployees();
    localStorage.setItem('fsecsg_employees', JSON.stringify(enhancedEmployees));

    // Initialiser les services de données
    mockDataService.initializeAllMockData();
    echelonHistoryService.initializeExampleHistory();
    timetableService.initializeExampleTimetables();

    // Créer des historiques d'échelons étendus
    this.createExtendedEchelonHistory();

    console.log('🎯 Données enrichies initialisées avec succès!');
    console.log('📊 Employés avec historique d\'échelons:', enhancedEmployees.length);
    console.log('📅 Emplois du temps disponibles');
  }

  private createExtendedEchelonHistory(): void {
    const extendedHistory = createExtendedEchelonHistory();

    // Ajouter les nouvelles entrées à l'historique existant
    const existingHistory = JSON.parse(localStorage.getItem('echelon_history') || '[]');
    const combinedHistory = [...existingHistory, ...extendedHistory];
    localStorage.setItem('echelon_history', JSON.stringify(combinedHistory));
  }

  // Obtenir les statistiques complètes du système
  getSystemStats(): SystemStats {
    const employees = this.getExtendedEmployees();
    return calculateSystemStats(employees);
  }
}

export const enhancedMockDataService = new EnhancedMockDataService();