
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, BookOpen, Building } from "lucide-react";

export const IntegrationFeaturesCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fonctionnalités d'Intégration</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <h4 className="font-medium">Génération Automatique</h4>
            </div>
            <p className="text-sm text-slate-600">
              Création automatique des emplois du temps avec allocation intelligente des ressources
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-5 w-5 text-green-600" />
              <h4 className="font-medium">Réservation Intégrée</h4>
            </div>
            <p className="text-sm text-slate-600">
              Réservation automatique des salles lors de la génération des emplois du temps
            </p>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Building className="h-5 w-5 text-orange-600" />
              <h4 className="font-medium">Gestion des Conflits</h4>
            </div>
            <p className="text-sm text-slate-600">
              Détection et résolution automatique des conflits de réservation
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
