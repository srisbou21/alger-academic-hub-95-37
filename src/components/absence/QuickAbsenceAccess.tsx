
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Users, Calendar } from "lucide-react";
import { User as UserType } from "../../types/user";

interface QuickAbsenceAccessProps {
  currentUser: UserType;
  onNavigateToAbsences: () => void;
}

export const QuickAbsenceAccess: React.FC<QuickAbsenceAccessProps> = ({ 
  currentUser, 
  onNavigateToAbsences 
}) => {
  const hasAdvancedAccess = ['super_admin', 'admin_faculty', 'dept_head', 'planning_service_head'].includes(currentUser.role);

  if (!hasAdvancedAccess) {
    return null;
  }

  return (
    <Card className="border-2 border-indigo-200 bg-gradient-to-r from-indigo-50 to-indigo-100">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-indigo-800">
          <BarChart3 className="h-6 w-6" />
          Suivi Avancé des Absences
        </CardTitle>
        <p className="text-indigo-600">
          Analyses complètes et graphiques des absences enseignantes
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="text-center p-3 bg-white rounded-lg border border-indigo-200">
            <TrendingUp className="h-6 w-6 text-indigo-600 mx-auto mb-1" />
            <p className="text-xs text-indigo-700">Analyses</p>
          </div>
          <div className="text-center p-3 bg-white rounded-lg border border-indigo-200">
            <Users className="h-6 w-6 text-indigo-600 mx-auto mb-1" />
            <p className="text-xs text-indigo-700">Par Enseignant</p>
          </div>
          <div className="text-center p-3 bg-white rounded-lg border border-indigo-200">
            <Calendar className="h-6 w-6 text-indigo-600 mx-auto mb-1" />
            <p className="text-xs text-indigo-700">Par Période</p>
          </div>
          <div className="text-center p-3 bg-white rounded-lg border border-indigo-200">
            <BarChart3 className="h-6 w-6 text-indigo-600 mx-auto mb-1" />
            <p className="text-xs text-indigo-700">Graphiques</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Badge className="bg-indigo-600 text-white">
              {currentUser.role === 'super_admin' ? 'Super Admin' :
               currentUser.role === 'admin_faculty' ? 'Doyen' :
               currentUser.role === 'dept_head' ? 'Chef Département' :
               'Responsable Planning'}
            </Badge>
            <Badge variant="outline" className="border-indigo-300 text-indigo-700">
              Accès Complet
            </Badge>
          </div>
          
          <Button 
            onClick={onNavigateToAbsences}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Accéder au Suivi
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
