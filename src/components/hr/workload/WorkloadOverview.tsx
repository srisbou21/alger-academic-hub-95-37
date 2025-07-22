
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Users,
  Clock,
  BarChart3,
  AlertTriangle
} from "lucide-react";
import { WorkloadStatistics } from "../../../types/teacher";

interface WorkloadOverviewProps {
  statistics: WorkloadStatistics;
}

export const WorkloadOverview: React.FC<WorkloadOverviewProps> = ({ statistics }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vue d'ensemble - {statistics.department}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">{statistics.overview.totalTeachers}</p>
            <p className="text-sm text-blue-800">Enseignants</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{statistics.overview.totalHours}</p>
            <p className="text-sm text-green-800">Heures totales</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <BarChart3 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-600">
              {Math.round(statistics.overview.averageLoadPerTeacher)}
            </p>
            <p className="text-sm text-purple-800">Moyenne/enseignant</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-600">{statistics.alerts.length}</p>
            <p className="text-sm text-red-800">Alertes</p>
          </div>
        </div>

        {/* Répartition des types de charge */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Répartition des charges</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Enseignement</span>
                <span className="text-sm text-slate-600">{statistics.distribution.teaching}h</span>
              </div>
              <Progress 
                value={(statistics.distribution.teaching / statistics.overview.totalHours) * 100} 
                className="h-2"
              />
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Encadrement</span>
                <span className="text-sm text-slate-600">{statistics.distribution.supervision}h</span>
              </div>
              <Progress 
                value={(statistics.distribution.supervision / statistics.overview.totalHours) * 100} 
                className="h-2"
              />
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Administratif</span>
                <span className="text-sm text-slate-600">{statistics.distribution.administrative}h</span>
              </div>
              <Progress 
                value={(statistics.distribution.administrative / statistics.overview.totalHours) * 100} 
                className="h-2"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
