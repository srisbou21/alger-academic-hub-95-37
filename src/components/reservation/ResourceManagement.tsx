
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from 'lucide-react';

export const ResourceManagement = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Gestion des Ressources
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>Gestion des ressources en cours de développement...</p>
      </CardContent>
    </Card>
  );
};
