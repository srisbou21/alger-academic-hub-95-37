
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2 } from 'lucide-react';

export const SpaceCatalog = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Catalogue des Espaces
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>Catalogue des espaces en cours de développement...</p>
      </CardContent>
    </Card>
  );
};
