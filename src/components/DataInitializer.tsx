
import { useEffect } from 'react';
import { enhancedMockDataService } from '../services/enhancedMockDataService';
import { reservationService } from '../services/reservationService';
import { academicConfigService } from '../services/academicConfigService';

export const DataInitializer = () => {
  useEffect(() => {
    // Initialiser toutes les données d'exemple enrichies au chargement de l'application
    const initializeData = () => {
      try {
        // Vérifier si les données sont déjà initialisées
        const existingData = localStorage.getItem('fsecsg_data_initialized');
        
        if (!existingData) {
          console.log('🔄 Initialisation des données d\'exemple enrichies...');
          
          // Initialiser toutes les données enrichies
          enhancedMockDataService.initializeEnhancedData();
          
          // Initialiser les données académiques
          academicConfigService.initializeExampleData();
          
          // Marquer comme initialisé
          localStorage.setItem('fsecsg_data_initialized', 'true');
          localStorage.setItem('fsecsg_data_version', '3.0.0');
          
          console.log('✅ Données d\'exemple enrichies initialisées avec succès!');
          console.log('📊 Données disponibles:');
          console.log('- Employés étendus (12 employés avec historique)');
          console.log('- Étudiants avec notes complètes');
          console.log('- Espaces et salles détaillés');
          console.log('- Emplois du temps validés (L3 et M1)');
          console.log('- Réservations automatiques des cours');
          console.log('- Historique complet des échelons');
          console.log('- Suivi automatique des promotions');
          console.log('- Relations entre tous les modules');
          console.log('- Structures académiques complètes (facultés, départements, filières, spécialités)');
          console.log('- Offres de formation validées');
          
          // Afficher les statistiques du système
          const stats = enhancedMockDataService.getSystemStats();
          console.log('📈 Statistiques du système:');
          console.log(`- Total employés actifs: ${stats.totalEmployees}`);
          console.log(`- Enseignants: ${stats.teachers}`);
          console.log(`- Personnel administratif: ${stats.administrative}`);
          console.log(`- Éligibles au suivi automatique: ${stats.eligibleForAutoTracking}`);
          console.log(`- Échelon moyen: ${stats.averageEchelon}`);
          
        } else {
          console.log('✅ Données d\'exemple déjà initialisées');
          
          // Vérifier si nous devons mettre à jour vers la version enrichie
          const version = localStorage.getItem('fsecsg_data_version');
          if (version !== '3.0.0') {
            console.log('🔄 Mise à jour vers les données enrichies v3.0.0...');
            enhancedMockDataService.initializeEnhancedData();
            academicConfigService.initializeExampleData();
            localStorage.setItem('fsecsg_data_version', '3.0.0');
          }
        }
      } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation des données:', error);
      }
    };

    initializeData();
  }, []);

  // Ce composant ne rend rien, il sert juste à initialiser les données
  return null;
};
