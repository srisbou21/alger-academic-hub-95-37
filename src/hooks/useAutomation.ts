import { useState } from 'react';
import { automationService } from '@/services/automationService';
import { FormationOffer } from '@/types/academic';
import { useToast } from '@/hooks/use-toast';

export const useAutomation = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const autoGenerateAll = async (formationOffer: FormationOffer, semester: 'S1' | 'S2') => {
    setIsProcessing(true);
    try {
      toast({
        title: "🤖 Automatisation en cours",
        description: "Génération automatique de l'emploi du temps et des réservations..."
      });

      const result = await automationService.autoGenerateTimetableWithReservations(
        formationOffer,
        semester,
        '2024-2025'
      );

      if (result.conflicts.length === 0) {
        toast({
          title: "✅ Génération automatique réussie",
          description: `Emploi du temps généré avec ${result.reservations.length} réservations automatiques`
        });
      } else {
        toast({
          title: "⚠️ Génération avec conflits",
          description: `${result.conflicts.length} conflits détectés à résoudre`,
          variant: "destructive"
        });
      }

      return result;
    } catch (error) {
      toast({
        title: "❌ Erreur d'automatisation",
        description: "Impossible de générer automatiquement l'emploi du temps",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const autoSync = async () => {
    setIsProcessing(true);
    try {
      const result = await automationService.syncModules();
      
      toast({
        title: "🔄 Synchronisation terminée",
        description: `${result.syncedEntities.length} modules synchronisés`
      });

      return result;
    } catch (error) {
      toast({
        title: "❌ Erreur de synchronisation",
        description: "Impossible de synchroniser les modules",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    autoGenerateAll,
    autoSync
  };
};