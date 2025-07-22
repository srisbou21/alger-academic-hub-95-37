
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

export const RoleManagementHeader: React.FC = () => {
  return (
    <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-purple-100">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-800">
          <Shield className="h-5 w-5" />
          Gestion des Rôles et Permissions
        </CardTitle>
        <p className="text-purple-600">
          Configuration des accès et autorisations du système
        </p>
      </CardHeader>
    </Card>
  );
};
