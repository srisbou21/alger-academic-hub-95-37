
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { EchelonAdvancement, ADVANCEMENT_DURATIONS } from "../../../types/advancement";

interface AdvancementListProps {
  advancements: EchelonAdvancement[];
}

export const AdvancementList: React.FC<AdvancementListProps> = ({ advancements }) => {
  const getDurationInfo = (duration: 30 | 36 | 42) => {
    return ADVANCEMENT_DURATIONS.find(d => d.duration === duration);
  };

  const getStatusColor = (status: EchelonAdvancement['status']) => {
    switch (status) {
      case 'eligible': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'blocked': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="space-y-4">
      {advancements.map((advancement) => (
        <div key={advancement.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold">{advancement.employeeName || 'Nom non disponible'}</h3>
                <Badge className={getStatusColor(advancement.status)}>
                  {advancement.status === 'eligible' ? 'Éligible' :
                   advancement.status === 'pending' ? 'En attente' :
                   advancement.status === 'suspended' ? 'Suspendu' :
                   advancement.status === 'blocked' ? 'Bloqué' : 'En cours'}
                </Badge>
                <Badge variant="outline">
                  Échelon {advancement.currentEchelon} → {advancement.targetEchelon}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium">Ancienneté:</span>
                  <p className="text-blue-600">{advancement.anciennete.months} mois {advancement.anciennete.days} jours</p>
                </div>
                <div>
                  <span className="font-medium">Durée requise:</span>
                  <p className="text-green-600">{advancement.requiredDuration} mois</p>
                </div>
                <div>
                  <span className="font-medium">Dernière note:</span>
                  <p className="text-purple-600">{advancement.lastEvaluation.score}/20</p>
                </div>
                <div>
                  <span className="font-medium">Éligibilité:</span>
                  <p className="text-orange-600">{advancement.eligibilityDate.toLocaleDateString('fr-FR')}</p>
                </div>
              </div>

              {getDurationInfo(advancement.requiredDuration) && (
                <div className="mt-2 text-sm text-slate-600">
                  <span className="font-medium">Type d'avancement:</span> {getDurationInfo(advancement.requiredDuration)?.label} - {getDurationInfo(advancement.requiredDuration)?.description}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
