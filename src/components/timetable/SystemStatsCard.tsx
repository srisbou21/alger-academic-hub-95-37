
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

interface SystemStats {
  totalTimetables: number;
  activeReservations: number;
  conflictsResolved: number;
  utilizationRate: number;
}

interface SystemStatsCardProps {
  stats: SystemStats;
}

export const SystemStatsCard: React.FC<SystemStatsCardProps> = ({ stats }) => {
  return (
    <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl">
          <Calendar className="h-8 w-8 text-blue-600" />
          Système Intégré d'Emploi du Temps et Réservations
        </CardTitle>
        <p className="text-slate-600 text-lg">
          Solution complète pour la gestion des emplois du temps et des réservations de salles
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.totalTimetables}</div>
            <p className="text-sm text-slate-600">Créneaux générés</p>
          </div>
          <div className="bg-white p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">{stats.activeReservations}</div>
            <p className="text-sm text-slate-600">Réservations actives</p>
          </div>
          <div className="bg-white p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.conflictsResolved}</div>
            <p className="text-sm text-slate-600">Conflits résolus</p>
          </div>
          <div className="bg-white p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.utilizationRate}%</div>
            <p className="text-sm text-slate-600">Taux d'utilisation</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
