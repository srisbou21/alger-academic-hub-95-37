
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, TrendingUp, Users, Clock } from "lucide-react";
import { WorkloadStatistics } from "../../types/workload";

interface WorkloadStatisticsViewProps {
  statistics: WorkloadStatistics;
}

export const WorkloadStatisticsView = ({ statistics }: WorkloadStatisticsViewProps) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'overload': return '⚠️';
      case 'underload': return '📉';
      case 'conflict': return '⚡';
      default: return '📋';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Enseignants</p>
                <p className="text-2xl font-bold text-blue-900">{statistics.overview.totalTeachers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Heures Totales</p>
                <p className="text-2xl font-bold text-green-900">{statistics.overview.totalHours}</p>
              </div>
              <Clock className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Charge Moyenne</p>
                <p className="text-2xl font-bold text-purple-900">{statistics.overview.averageLoad}h</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 font-medium">Alertes</p>
                <p className="text-2xl font-bold text-red-900">{statistics.alerts.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Répartition par Grade</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(statistics.byGrade).map(([grade, data]) => (
              <div key={grade} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{grade}</span>
                  <Badge variant="outline">{data.count} enseignants</Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm text-slate-600">
                  <div>Moy: {data.averageHours}h</div>
                  <div>Min: {data.minHours}h</div>
                  <div>Max: {data.maxHours}h</div>
                </div>
                <Progress 
                  value={(data.averageHours / 250) * 100} 
                  className="h-2"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Alertes et Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            {statistics.alerts.length > 0 ? (
              <div className="space-y-3">
                {statistics.alerts.map((alert) => (
                  <div 
                    key={alert.id} 
                    className={`p-3 rounded-lg border ${getSeverityColor(alert.severity)}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-lg">{getAlertIcon(alert.type)}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{alert.teacherName}</span>
                          <Badge variant="outline" className="text-xs">
                            {alert.type.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm">{alert.message}</p>
                        <p className="text-xs opacity-75 mt-1">
                          {alert.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">✅</div>
                <p className="text-slate-600">Aucune alerte active</p>
                <p className="text-sm text-slate-500">
                  Toutes les charges sont dans les normes
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Analyse Détaillée</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-green-700">✅ Points Positifs</h4>
              <ul className="space-y-1 text-sm">
                <li>• {statistics.overview.totalTeachers - statistics.overview.overloadedCount - statistics.overview.underloadedCount} enseignants avec charge optimale</li>
                <li>• Charge moyenne équilibrée ({statistics.overview.averageLoad}h)</li>
                <li>• Répartition homogène entre les grades</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-yellow-700">⚠️ Points d'Attention</h4>
              <ul className="space-y-1 text-sm">
                <li>• {statistics.overview.overloadedCount} enseignants en surcharge</li>
                <li>• {statistics.overview.underloadedCount} enseignants en sous-charge</li>
                <li>• {statistics.alerts.length} alertes à traiter</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-blue-700">📋 Recommandations</h4>
              <ul className="space-y-1 text-sm">
                <li>• Redistribuer certains modules</li>
                <li>• Optimiser les créneaux horaires</li>
                <li>• Prévoir des remplaçants</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
