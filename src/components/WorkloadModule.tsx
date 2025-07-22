
import React from 'react';
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from 'lucide-react';
import { WorkloadMainDashboard } from "./workload/WorkloadMainDashboard";

export const WorkloadModule: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Clock className="h-8 w-8" />
            Système de Gestion des Charges d'Enseignement
          </CardTitle>
          <p className="text-blue-100">
            Gestion complète des charges pédagogiques et emplois du temps
          </p>
        </CardHeader>
      </Card>
      
      <WorkloadMainDashboard />
    </div>
  );
};
