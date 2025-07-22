
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Filter } from "lucide-react";
import { User as UserType } from "../../../types/user";
import { permissionService } from "../../../services/permissionService";

interface AdministrativeHeaderProps {
  currentUser: UserType;
}

export const AdministrativeHeader: React.FC<AdministrativeHeaderProps> = ({ currentUser }) => {
  return (
    <Card className="border-indigo-200 bg-gradient-to-r from-indigo-50 to-indigo-100">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-indigo-800">
          <TrendingUp className="h-6 w-6" />
          Interface Administrative - Suivi Avancé des Absences Enseignantes
        </CardTitle>
        <div className="flex items-center gap-4 text-sm">
          <Badge className="bg-indigo-600 text-white">
            {permissionService.getRoleDisplayName(currentUser.role)}
          </Badge>
          <Badge variant="outline" className="border-indigo-300 text-indigo-700">
            {currentUser.role === 'super_admin' || currentUser.role === 'admin_faculty' ? 
              'Accès Global - Toute la Faculté' : 
              currentUser.role === 'dept_head' ? 
              `Accès Départemental - ${currentUser.department}` : 
              'Accès Spécialisé'}
          </Badge>
          <Badge className="bg-green-600 text-white">
            <Filter className="h-3 w-3 mr-1" />
            Filtres Avancés Disponibles
          </Badge>
        </div>
        <p className="text-indigo-600 text-sm">
          Interface complète de gestion et d'analyse des absences avec filtres par enseignant, département, période et visualisations graphiques détaillées
        </p>
      </CardHeader>
    </Card>
  );
};
