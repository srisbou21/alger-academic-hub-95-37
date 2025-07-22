
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSpaces } from "../../hooks/useSpaces";
import { useReservations } from "../../hooks/useReservations";
import { Clock, Calendar, MapPin, Users, Filter } from 'lucide-react';

export const AvailableTimeSlots = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSpace, setSelectedSpace] = useState<string>('all');
  const [duration, setDuration] = useState(60);
  
  const spaces = useSpaces();
  const reservations = useReservations();

  const timeSlots = useMemo(() => {
    const slots = [];
    const startHour = 8;
    const endHour = 20;
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const startTime = new Date(`${selectedDate}T${time}`);
        const endTime = new Date(startTime.getTime() + duration * 60000);
        
        // Vérifier la disponibilité pour chaque espace
        const availableSpaces = spaces.spaces.filter(space => {
          if (selectedSpace !== 'all' && space.id !== selectedSpace) return false;
          
          // Vérifier les contraintes d'horaires
          const spaceStartHour = parseInt(space.constraints.openingHours.start.split(':')[0]);
          const spaceEndHour = parseInt(space.constraints.openingHours.end.split(':')[0]);
          
          if (hour < spaceStartHour || hour >= spaceEndHour) return false;
          
          // Vérifier les réservations existantes
          const hasConflict = reservations.reservations.some(reservation => {
            if (reservation.spaceId !== space.id) return false;
            if (reservation.status === 'cancelled') return false;
            
            const resStart = reservation.dateTime.start;
            const resEnd = reservation.dateTime.end;
            
            return (
              (startTime >= resStart && startTime < resEnd) ||
              (endTime > resStart && endTime <= resEnd) ||
              (startTime <= resStart && endTime >= resEnd)
            );
          });
          
          return !hasConflict;
        });
        
        if (availableSpaces.length > 0) {
          slots.push({
            time,
            startTime,
            endTime,
            availableSpaces
          });
        }
      }
    }
    
    return slots;
  }, [selectedDate, selectedSpace, duration, spaces.spaces, reservations.reservations]);

  const getAvailabilityColor = (count: number, total: number) => {
    const ratio = count / total;
    if (ratio > 0.7) return 'bg-green-100 text-green-800';
    if (ratio > 0.3) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const handleReserveSlot = (slot: any, space: any) => {
    spaces.setSelectedSpace(space);
    // Logique pour ouvrir le formulaire de réservation avec les données pré-remplies
  };

  return (
    <div className="space-y-6">
      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres de recherche
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Espace</label>
              <Select value={selectedSpace} onValueChange={setSelectedSpace}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les espaces</SelectItem>
                  {spaces.spaces.map(space => (
                    <SelectItem key={space.id} value={space.id}>
                      {space.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Durée (min)</label>
              <Select value={duration.toString()} onValueChange={(value) => setDuration(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 min</SelectItem>
                  <SelectItem value="60">1 heure</SelectItem>
                  <SelectItem value="90">1h30</SelectItem>
                  <SelectItem value="120">2 heures</SelectItem>
                  <SelectItem value="180">3 heures</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button className="w-full">
                <Calendar className="h-4 w-4 mr-2" />
                Rechercher
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Résultats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Créneaux disponibles - {new Date(selectedDate).toLocaleDateString()}
            </div>
            <Badge variant="outline">
              {timeSlots.length} créneaux trouvés
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {timeSlots.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucun créneau disponible pour les critères sélectionnés</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {timeSlots.map((slot, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-4 w-4 text-blue-600" />
                          <span className="font-medium">
                            {slot.time} - {slot.endTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <Badge className={getAvailabilityColor(slot.availableSpaces.length, spaces.spaces.length)}>
                            {slot.availableSpaces.length} espace(s) libre(s)
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-3">
                          {slot.availableSpaces.map((space: any) => (
                            <div key={space.id} className="border rounded-lg p-3 hover:bg-muted/50">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h4 className="font-medium text-sm">{space.name}</h4>
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <MapPin className="h-3 w-3" />
                                    {space.location.building}
                                  </div>
                                </div>
                                <div className="flex items-center gap-1 text-xs">
                                  <Users className="h-3 w-3" />
                                  {space.capacity}
                                </div>
                              </div>
                              <Button
                                size="sm"
                                className="w-full"
                                onClick={() => handleReserveSlot(slot, space)}
                              >
                                Réserver
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
