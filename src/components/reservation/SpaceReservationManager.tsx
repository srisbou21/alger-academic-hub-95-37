import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useReservation } from '../../contexts/ReservationContext';
import { Building2 } from 'lucide-react';

export const SpaceReservationManager = () => {
  const { spaces, isLoading } = useReservation();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Gestion des Espaces ({spaces.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Chargement des espaces...</p>
        ) : (
          <div className="grid gap-4">
            {spaces.map((space) => (
              <Card key={space.id} className="border-blue-200">
                <CardContent className="p-4">
                  <h3 className="font-semibold">{space.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {space.capacity} places • {space.location.room}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};