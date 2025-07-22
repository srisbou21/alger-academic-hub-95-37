import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Space, Reservation } from "../../types/reservation";
import { Clock, Calendar, Building2, Users } from "lucide-react";

interface AvailabilityDetectorProps {
  spaces: Space[];
  reservations: Reservation[];
}

interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
}

interface DayAvailability {
  date: string;
  timeSlots: TimeSlot[];
  fullyAvailable: boolean;
}

export const AvailabilityDetector = ({ spaces, reservations }: AvailabilityDetectorProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSpace, setSelectedSpace] = useState<string>('all');
  const [selectedDuration, setSelectedDuration] = useState<number>(60);
  const [availabilities, setAvailabilities] = useState<Record<string, DayAvailability>>({});

  // Générer les créneaux horaires (par exemple de 8h à 20h par tranches de 30min)
  const generateTimeSlots = (): string[] => {
    const slots: string[] = [];
    for (let hour = 8; hour < 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeStr);
      }
    }
    return slots;
  };

  // Vérifier si un créneau est disponible
  const isTimeSlotAvailable = (spaceId: string, date: string, startTime: string, endTime: string): boolean => {
    const space = spaces.find(s => s.id === spaceId);
    if (!space) return false;

    // Vérifier les contraintes d'ouverture
    const openingStart = space.constraints.openingHours.start;
    const openingEnd = space.constraints.openingHours.end;
    
    if (startTime < openingStart || endTime > openingEnd) {
      return false;
    }

    // Vérifier les réservations existantes
    const spaceReservations = reservations.filter(r => 
      r.spaceId === spaceId && 
      r.status !== 'cancelled' &&
      r.dateTime.start.toISOString().split('T')[0] === date
    );

    for (const reservation of spaceReservations) {
      const resStart = reservation.dateTime.start.toTimeString().substring(0, 5);
      const resEnd = reservation.dateTime.end.toTimeString().substring(0, 5);
      
      // Vérifier s'il y a chevauchement
      if ((startTime >= resStart && startTime < resEnd) || 
          (endTime > resStart && endTime <= resEnd) ||
          (startTime <= resStart && endTime >= resEnd)) {
        return false;
      }
    }

    return true;
  };

  // Calculer les créneaux libres pour une journée
  const calculateDayAvailability = (spaceId: string, date: string): DayAvailability => {
    const timeSlots = generateTimeSlots();
    const slots: TimeSlot[] = [];
    
    for (let i = 0; i < timeSlots.length - 1; i++) {
      const start = timeSlots[i];
      const endIndex = Math.min(i + Math.ceil(selectedDuration / 30), timeSlots.length - 1);
      const end = timeSlots[endIndex];
      
      const available = isTimeSlotAvailable(spaceId, date, start, end);
      
      slots.push({
        start,
        end,
        available
      });
    }

    const fullyAvailable = !reservations.some(r => 
      r.spaceId === spaceId && 
      r.status !== 'cancelled' &&
      r.dateTime.start.toISOString().split('T')[0] === date
    );

    return {
      date,
      timeSlots: slots,
      fullyAvailable
    };
  };

  // Recalculer les disponibilités quand les paramètres changent
  useEffect(() => {
    const newAvailabilities: Record<string, DayAvailability> = {};
    
    // Calculer pour les 7 prochains jours
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      if (selectedSpace === 'all') {
        // Calculer pour tous les espaces
        spaces.forEach(space => {
          newAvailabilities[`${space.id}-${dateStr}`] = calculateDayAvailability(space.id, dateStr);
        });
      } else {
        // Calculer pour l'espace sélectionné
        newAvailabilities[`${selectedSpace}-${dateStr}`] = calculateDayAvailability(selectedSpace, dateStr);
      }
    }
    
    setAvailabilities(newAvailabilities);
  }, [selectedSpace, selectedDuration, spaces, reservations]);

  // Obtenir les créneaux libres pour une date spécifique
  const getAvailableSlotsForDate = (date: string) => {
    const availableSlots: Array<{space: Space, slots: TimeSlot[]}> = [];
    
    if (selectedSpace === 'all') {
      spaces.forEach(space => {
        const availability = availabilities[`${space.id}-${date}`];
        if (availability) {
          const freeSlots = availability.timeSlots.filter(slot => slot.available);
          if (freeSlots.length > 0) {
            availableSlots.push({ space, slots: freeSlots });
          }
        }
      });
    } else {
      const space = spaces.find(s => s.id === selectedSpace);
      const availability = availabilities[`${selectedSpace}-${date}`];
      if (space && availability) {
        const freeSlots = availability.timeSlots.filter(slot => slot.available);
        if (freeSlots.length > 0) {
          availableSlots.push({ space, slots: freeSlots });
        }
      }
    }
    
    return availableSlots;
  };

  // Obtenir les journées complètement libres
  const getFullyAvailableDays = () => {
    const fullyAvailableDays: Array<{date: string, spaces: Space[]}> = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      const availableSpaces: Space[] = [];
      
      if (selectedSpace === 'all') {
        spaces.forEach(space => {
          const availability = availabilities[`${space.id}-${dateStr}`];
          if (availability?.fullyAvailable) {
            availableSpaces.push(space);
          }
        });
      } else {
        const space = spaces.find(s => s.id === selectedSpace);
        const availability = availabilities[`${selectedSpace}-${dateStr}`];
        if (space && availability?.fullyAvailable) {
          availableSpaces.push(space);
        }
      }
      
      if (availableSpaces.length > 0) {
        fullyAvailableDays.push({ date: dateStr, spaces: availableSpaces });
      }
    }
    
    return fullyAvailableDays;
  };

  return (
    <div className="space-y-6">
      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Paramètres de recherche
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="space-select">Espace</Label>
              <Select value={selectedSpace} onValueChange={setSelectedSpace}>
                <SelectTrigger id="space-select">
                  <SelectValue placeholder="Sélectionner un espace" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les espaces</SelectItem>
                  {spaces.map(space => (
                    <SelectItem key={space.id} value={space.id}>
                      {space.name} ({space.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="duration">Durée souhaitée (minutes)</Label>
              <Select value={selectedDuration.toString()} onValueChange={(value) => setSelectedDuration(parseInt(value))}>
                <SelectTrigger id="duration">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 heure</SelectItem>
                  <SelectItem value="90">1h30</SelectItem>
                  <SelectItem value="120">2 heures</SelectItem>
                  <SelectItem value="180">3 heures</SelectItem>
                  <SelectItem value="240">4 heures</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="date-select">Date</Label>
              <Input
                id="date-select"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Journées complètement libres */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Journées complètement libres (7 prochains jours)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {getFullyAvailableDays().map(({ date, spaces: availableSpaces }) => (
              <div key={date} className="p-4 border rounded-lg bg-green-50 border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-green-800">
                    {new Date(date).toLocaleDateString('fr-FR', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </h4>
                  <Badge className="bg-green-100 text-green-800">
                    {availableSpaces.length} espace{availableSpaces.length > 1 ? 's' : ''} libre{availableSpaces.length > 1 ? 's' : ''}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  {availableSpaces.map(space => (
                    <Badge key={space.id} variant="outline" className="bg-white">
                      <Building2 className="h-3 w-3 mr-1" />
                      {space.name}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
            {getFullyAvailableDays().length === 0 && (
              <p className="text-slate-500 text-center py-4">
                Aucune journée complètement libre trouvée
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Créneaux libres pour la date sélectionnée */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Créneaux libres pour le {new Date(selectedDate).toLocaleDateString('fr-FR')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {getAvailableSlotsForDate(selectedDate).map(({ space, slots }) => (
              <div key={space.id} className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">{space.name}</span>
                  <Badge variant="outline">
                    <Users className="h-3 w-3 mr-1" />
                    {space.capacity} places
                  </Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {slots.map((slot, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs bg-green-50 border-green-200 text-green-800 hover:bg-green-100"
                    >
                      {slot.start} - {slot.end}
                    </Button>
                  ))}
                </div>
                {slots.length === 0 && (
                  <p className="text-slate-500 text-sm">Aucun créneau libre</p>
                )}
              </div>
            ))}
            {getAvailableSlotsForDate(selectedDate).length === 0 && (
              <p className="text-slate-500 text-center py-4">
                Aucun créneau libre trouvé pour cette date
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};