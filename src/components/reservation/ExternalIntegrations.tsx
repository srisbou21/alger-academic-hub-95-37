
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from 'lucide-react';

export const ExternalIntegrations = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link className="h-5 w-5" />
          Intégrations Externes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>Intégrations externes en cours de développement...</p>
      </CardContent>
    </Card>
  );
};
