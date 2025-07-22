import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useReservation } from '../../contexts/ReservationContext';
import { AlertTriangle } from 'lucide-react';

export const ConflictManager = () => {
  const { conflicts } = useReservation();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Conflits ({conflicts.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>Gestion des conflits en cours de développement...</p>
      </CardContent>
    </Card>
  );
};