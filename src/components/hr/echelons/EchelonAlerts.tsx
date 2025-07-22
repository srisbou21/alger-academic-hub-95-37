
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock, Bell, Users } from "lucide-react";

interface Echelon {
  id: string;
  teacherId: string;
  teacherName: string;
  currentGrade: string;
  currentEchelon: number;
  nextEchelon: number;
  datePromotion: Date;
  nextPromotionDate: Date;
  yearsInEchelon: number;
  requiredYears: number;
  isEligible: boolean;
  salary: number;
  status: 'active' | 'pending' | 'promoted';
}

interface EchelonAlertsProps {
  eligibleEchelons: Echelon[];
}

export const EchelonAlerts: React.FC<EchelonAlertsProps> = ({ eligibleEchelons }) => {
  const urgentCases = eligibleEchelons.filter(e => (e.yearsInEchelon - e.requiredYears) >= 3);
  const upcomingEligible = eligibleEchelons.filter(e => (e.requiredYears - e.yearsInEchelon) <= 1);
  const longOverdue = eligibleEchelons.filter(e => (e.yearsInEchelon - e.requiredYears) >= 5);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Alertes et Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Cas urgents */}
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <h3 className="font-semibold text-red-800">Cas Urgents</h3>
              </div>
              <p className="text-2xl font-bold text-red-600">{urgentCases.length}</p>
              <p className="text-sm text-red-700">+3 ans de retard</p>
              {urgentCases.slice(0, 3).map(echelon => (
                <div key={echelon.id} className="mt-2 p-2 bg-white rounded text-xs">
                  <p className="font-medium">{echelon.teacherName}</p>
                  <p className="text-gray-600">{echelon.yearsInEchelon - echelon.requiredYears} ans de retard</p>
                </div>
              ))}
              {urgentCases.length > 3 && (
                <p className="text-xs text-red-600 mt-2">+{urgentCases.length - 3} autres cas</p>
              )}
            </div>

            {/* Prochainement éligibles */}
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                <h3 className="font-semibold text-yellow-800">Prochainement Éligibles</h3>
              </div>
              <p className="text-2xl font-bold text-yellow-600">{upcomingEligible.length}</p>
              <p className="text-sm text-yellow-700">Dans l'année</p>
              {upcomingEligible.slice(0, 3).map(echelon => (
                <div key={echelon.id} className="mt-2 p-2 bg-white rounded text-xs">
                  <p className="font-medium">{echelon.teacherName}</p>
                  <p className="text-gray-600">Éligible dans {echelon.requiredYears - echelon.yearsInEchelon} an(s)</p>
                </div>
              ))}
            </div>

            {/* Cas critiques */}
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-purple-600" />
                <h3 className="font-semibold text-purple-800">Cas Critiques</h3>
              </div>
              <p className="text-2xl font-bold text-purple-600">{longOverdue.length}</p>
              <p className="text-sm text-purple-700">+5 ans de retard</p>
              {longOverdue.map(echelon => (
                <div key={echelon.id} className="mt-2 p-2 bg-white rounded text-xs">
                  <p className="font-medium">{echelon.teacherName}</p>
                  <Badge className="bg-red-100 text-red-800 text-xs">
                    CRITIQUE
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
