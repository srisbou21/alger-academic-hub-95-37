
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export const FeaturesInfoCard: React.FC = () => {
  return (
    <Card className="border-green-200 bg-gradient-to-r from-green-50 to-green-100">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 text-green-800">
          <BarChart3 className="h-5 w-5" />
          <span className="font-semibold">Fonctionnalités Administratives Disponibles:</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 text-sm text-green-700">
          <div>✓ Vue globale faculté</div>
          <div>✓ Filtrage par enseignant</div>
          <div>✓ Filtrage par département</div>
          <div>✓ Filtrage par période</div>
          <div>✓ Analyses par semestre</div>
          <div>✓ Analyses par année académique</div>
          <div>✓ Période personnalisée (date début/fin)</div>
          <div>✓ Export des données</div>
          <div>✓ Visualisations graphiques détaillées</div>
          <div>✓ Métriques par enseignant</div>
          <div>✓ Analyses temporelles</div>
          <div>✓ Rapports automatisés</div>
        </div>
      </CardContent>
    </Card>
  );
};
