
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Space } from "../../types/reservation";
import { MapPin, Users, Monitor, Wifi } from "lucide-react";

interface SpaceCardProps {
  space: Space;
  onEdit: (space: Space) => void;
  onReserve: (spaceId: string) => void;
}

export const SpaceCard = ({ space, onEdit, onReserve }: SpaceCardProps) => {
  const getStatusColor = (status: Space['status']) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'occupied': return 'bg-red-100 text-red-800';
      case 'maintenance': return 'bg-orange-100 text-orange-800';
      case 'out_of_service': return 'bg-gray-100 text-gray-800';
      case 'reserved_free': return 'bg-blue-100 text-blue-800';
      case 'cleaning': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Space['status']) => {
    switch (status) {
      case 'available': return 'Disponible';
      case 'occupied': return 'Occupé';
      case 'maintenance': return 'Maintenance';
      case 'out_of_service': return 'Hors service';
      case 'reserved_free': return 'Réservé libre';
      case 'cleaning': return 'Nettoyage';
      default: return status;
    }
  };

  const getTypeText = (type: Space['type']) => {
    switch (type) {
      case 'classroom': return 'Salle de cours';
      case 'amphitheater': return 'Amphithéâtre';
      case 'laboratory': return 'Laboratoire';
      case 'computer_room': return 'Salle informatique';
      case 'meeting_room': return 'Salle de réunion';
      default: return type;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{space.name}</CardTitle>
            <p className="text-sm text-gray-600">{space.code}</p>
          </div>
          <Badge className={getStatusColor(space.status)}>
            {getStatusText(space.status)}
          </Badge>
        </div>
        <Badge variant="outline" className="w-fit">
          {getTypeText(space.type)}
        </Badge>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {space.location.building} - {space.location.floor} - {space.location.room}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>{space.capacity} places</span>
          </div>
          <div className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            <span>{space.surface} m²</span>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Équipements disponibles :</h4>
          <div className="flex flex-wrap gap-1">
            {space.equipment.multimedia.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                <Monitor className="h-3 w-3 mr-1" />
                Multimédia
              </Badge>
            )}
            {space.equipment.computer.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                <Wifi className="h-3 w-3 mr-1" />
                Informatique
              </Badge>
            )}
            {space.equipment.accessibility && (
              <Badge variant="secondary" className="text-xs">
                <Users className="h-3 w-3 mr-1" />
                PMR
              </Badge>
            )}
            {space.equipment.airConditioning && (
              <Badge variant="secondary" className="text-xs">
                Climatisation
              </Badge>
            )}
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(space)}
            className="flex-1"
          >
            Modifier
          </Button>
          <Button
            size="sm"
            onClick={() => onReserve(space.id)}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            disabled={space.status !== 'available'}
          >
            Réserver
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
