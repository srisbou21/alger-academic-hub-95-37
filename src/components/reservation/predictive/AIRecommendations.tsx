
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, Brain } from "lucide-react";

export const AIRecommendations = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          Recommandations Intelligentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-800">Optimisation Énergétique</h4>
                <p className="text-sm text-green-700 mt-1">
                  Regrouper les cours du département Informatique dans le bâtiment A pourrait 
                  réduire la consommation énergétique de 23% cette semaine.
                </p>
                <Button size="sm" className="mt-2 bg-green-600 hover:bg-green-700">
                  Appliquer automatiquement
                </Button>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-orange-800">Maintenance Préventive</h4>
                <p className="text-sm text-orange-700 mt-1">
                  Le vidéoprojecteur de l'Amphithéâtre A montre des signes de défaillance imminente. 
                  Planifier une maintenance préventive dans les 7 jours.
                </p>
                <Button size="sm" variant="outline" className="mt-2">
                  Programmer maintenance
                </Button>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Brain className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-800">Amélioration Satisfaction</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Les utilisateurs du laboratoire C3 rapportent régulièrement des problèmes de température. 
                  Ajuster la climatisation pourrait améliorer la satisfaction de 15%.
                </p>
                <Button size="sm" variant="outline" className="mt-2">
                  Voir détails
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
