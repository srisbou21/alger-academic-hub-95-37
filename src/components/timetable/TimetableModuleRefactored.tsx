import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TimetableWorkflow } from './core/TimetableWorkflow';
import { Calendar, Brain } from "lucide-react";

export const TimetableModuleRefactored = () => {
  return (
    <div className="space-y-6">
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Brain className="h-8 w-8 text-purple-600" />
            Module Emplois du Temps - Nouvelle Version
          </CardTitle>
          <p className="text-slate-600 text-lg">
            Système complet de gestion d'emplois du temps avec workflow intelligent
          </p>
        </CardHeader>
        <CardContent>
          <div className="bg-white p-4 rounded-lg">
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Fonctionnalités du Système
            </h3>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>• Sélection d'offre de formation avec sections et groupes</li>
              <li>• Allocation intelligente d'infrastructures</li>
              <li>• Génération automatique d'emplois du temps</li>
              <li>• Validation avec modifications manuelles</li>
              <li>• Optimisation optionnelle avancée</li>
              <li>• Réservation automatique avec détection de conflits</li>
              <li>• Gestion des annulations de réservations</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <TimetableWorkflow />
    </div>
  );
};