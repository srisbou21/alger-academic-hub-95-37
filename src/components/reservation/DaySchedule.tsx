
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useReservation } from "../../contexts/ReservationContext";
import { Space, Reservation } from "../../types/reservation";
import { Clock, Users, Plus, Edit, Trash, AlertTriangle } from "lucide-react";
import { format, isSameDay } from "date-fns";
import { fr } from "date-fns/locale";

interface DayScheduleProps {
  space: Space;
  date: Date;
  onCreateReservation: (timeSlot: { start: Date; end: Date }) => void;
  onEditReservation: (reservation: Reservation) => void;
  onDeleteReservation: (id: string) => void;
}

export const DaySchedule: React.FC<DayScheduleProps> = ({
  space,
  date,
  onCreateReservation,
  onEditReservation,
  onDeleteReservation
}) => {
  const { reservations, createReservation } = useReservation();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{ start: Date; end: Date } | null>(null);
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [conflictError, setConflictError] = useState<string | null>(null);

  // Filtrer les réservations pour cet espace et cette date
  const dayReservations = reservations.filter(reservation =>
    reservation.spaceId === space.id &&
    isSameDay(new Date(reservation.dateTime.start), date) &&
    reservation.status !== 'cancelled'
  );

  // Générer les créneaux horaires (8h-20h par tranches de 30min)
  const timeSlots = [];
  for (let hour = 8; hour < 20; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const startTime = new Date(date);
      startTime.setHours(hour, minute, 0, 0);
      
      const endTime = new Date(date);
      endTime.setHours(hour, minute + 30, 0, 0);
      if (endTime.getHours() >= 20) break;

      timeSlots.push({ start: startTime, end: endTime });
    }
  }

  // Vérifier si un créneau est occupé
  const isSlotOccupied = (timeSlot: { start: Date; end: Date }) => {
    return dayReservations.some(reservation => {
      const resStart = new Date(reservation.dateTime.start);
      const resEnd = new Date(reservation.dateTime.end);
      return (
        (timeSlot.start >= resStart && timeSlot.start < resEnd) ||
        (timeSlot.end > resStart && timeSlot.end <= resEnd) ||
        (timeSlot.start <= resStart && timeSlot.end >= resEnd)
      );
    });
  };

  // Obtenir la réservation pour un créneau
  const getReservationForSlot = (timeSlot: { start: Date; end: Date }) => {
    return dayReservations.find(reservation => {
      const resStart = new Date(reservation.dateTime.start);
      const resEnd = new Date(reservation.dateTime.end);
      return (
        (timeSlot.start >= resStart && timeSlot.start < resEnd) ||
        (timeSlot.end > resStart && timeSlot.end <= resEnd) ||
        (timeSlot.start <= resStart && timeSlot.end >= resEnd)
      );
    });
  };

  // Générer les options d'heures
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 8; hour < 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        options.push(timeString);
      }
    }
    return options;
  };

  // Vérifier si une période est occupée
  const isPeriodOccupied = (start: string, end: string) => {
    if (!start || !end) return { occupied: false, conflicts: [] };

    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);
    
    const startDate = new Date(date);
    startDate.setHours(startHour, startMin, 0, 0);
    
    const endDate = new Date(date);
    endDate.setHours(endHour, endMin, 0, 0);

    if (startDate >= endDate) {
      return { occupied: true, conflicts: [], error: "L'heure de fin doit être après l'heure de début" };
    }

    const conflicts = dayReservations.filter(reservation => {
      const resStart = new Date(reservation.dateTime.start);
      const resEnd = new Date(reservation.dateTime.end);
      return (
        (startDate >= resStart && startDate < resEnd) ||
        (endDate > resStart && endDate <= resEnd) ||
        (startDate <= resStart && endDate >= resEnd)
      );
    });

    return { occupied: conflicts.length > 0, conflicts };
  };

  // Gérer la réservation rapide avec validation
  const handleQuickReservationWithTime = async () => {
    setConflictError(null);
    
    if (!startTime || !endTime) {
      setConflictError("Veuillez sélectionner une heure de début et de fin");
      return;
    }

    const { occupied, conflicts, error } = isPeriodOccupied(startTime, endTime);
    
    if (error) {
      setConflictError(error);
      return;
    }

    if (occupied && conflicts.length > 0) {
      const conflictDetails = conflicts.map(res => 
        `${res.purpose} (${res.requester.name}) de ${format(new Date(res.dateTime.start), 'HH:mm')} à ${format(new Date(res.dateTime.end), 'HH:mm')}`
      ).join(', ');
      
      setConflictError(`L'espace est déjà occupé pendant cette période: ${conflictDetails}`);
      return;
    }

    // Créer la réservation
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    const startDate = new Date(date);
    startDate.setHours(startHour, startMin, 0, 0);
    
    const endDate = new Date(date);
    endDate.setHours(endHour, endMin, 0, 0);

    try {
      const newReservation: Partial<Reservation> = {
        spaceId: space.id,
        spaceName: space.name,
        requester: {
          name: 'Dr. Sophie Martin',
          contact: 'sophie.martin@universite.fr',
          phone: '+33 1 23 45 67 89'
        },
        type: 'course',
        purpose: 'Réservation rapide',
        description: `Réservation créée rapidement pour ${space.name}`,
        participants: Math.min(20, space.capacity),
        dateTime: {
          start: startDate,
          end: endDate
        },
        equipment: [],
        priority: 2
      };

      await createReservation(newReservation);
      setStartTime('');
      setEndTime('');
      setConflictError(null);
      console.log('Réservation créée avec succès');
    } catch (error) {
      console.error('Erreur lors de la création de la réservation:', error);
      setConflictError('Erreur lors de la création de la réservation');
    }
  };

  // Créer une réservation rapide (ancienne méthode pour les créneaux fixes)
  const handleQuickReservation = async (timeSlot: { start: Date; end: Date }) => {
    console.log('Création d\'une réservation rapide pour le créneau:', timeSlot);
    
    try {
      const newReservation: Partial<Reservation> = {
        spaceId: space.id,
        spaceName: space.name,
        requester: {
          name: 'Dr. Sophie Martin',
          contact: 'sophie.martin@universite.fr',
          phone: '+33 1 23 45 67 89'
        },
        type: 'course',
        purpose: 'Réservation rapide',
        description: `Réservation créée rapidement pour ${space.name}`,
        participants: Math.min(20, space.capacity),
        dateTime: {
          start: timeSlot.start,
          end: timeSlot.end
        },
        equipment: [],
        priority: 2
      };

      await createReservation(newReservation);
      console.log('Réservation créée avec succès');
    } catch (error) {
      console.error('Erreur lors de la création de la réservation:', error);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Planning du {format(date, 'dd MMMM', { locale: fr })}
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          {space.name} - {space.location.building}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1 max-h-96 overflow-y-auto">
          {timeSlots.map((timeSlot, index) => {
            const isOccupied = isSlotOccupied(timeSlot);
            const reservation = getReservationForSlot(timeSlot);
            
            return (
              <div
                key={index}
                className={`
                  flex items-center justify-between p-2 rounded border
                  ${isOccupied 
                    ? 'bg-red-50 border-red-200' 
                    : 'bg-green-50 border-green-200 hover:bg-green-100 cursor-pointer'
                  }
                `}
                onClick={() => !isOccupied && setSelectedTimeSlot(timeSlot)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono">
                    {format(timeSlot.start, 'HH:mm')} - {format(timeSlot.end, 'HH:mm')}
                  </span>
                  
                  {isOccupied && reservation ? (
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive" className="text-xs">
                        Occupé
                      </Badge>
                      <span className="text-sm text-gray-600">
                        {reservation.purpose}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Users className="h-3 w-3" />
                        {reservation.participants}
                      </div>
                    </div>
                  ) : (
                    <Badge variant="outline" className="text-xs text-green-600">
                      Libre
                    </Badge>
                  )}
                </div>
                
                {!isOccupied && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-6 px-2 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuickReservation(timeSlot);
                    }}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Réserver
                  </Button>
                )}
                
                {isOccupied && reservation && (
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 px-2 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditReservation(reservation);
                      }}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 px-2 text-xs text-red-600 hover:text-red-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteReservation(reservation.id);
                      }}
                    >
                      <Trash className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {selectedTimeSlot && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <strong>Créneau sélectionné:</strong><br />
                {format(selectedTimeSlot.start, 'HH:mm')} - {format(selectedTimeSlot.end, 'HH:mm')}
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => {
                    onCreateReservation(selectedTimeSlot);
                    setSelectedTimeSlot(null);
                  }}
                >
                  Réservation détaillée
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    handleQuickReservation(selectedTimeSlot);
                    setSelectedTimeSlot(null);
                  }}
                >
                  Réservation rapide
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Section de réservation rapide avec sélection d'heure */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Réservation rapide personnalisée
          </h4>
          
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Heure de début
              </label>
              <Select value={startTime} onValueChange={setStartTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Début" />
                </SelectTrigger>
                <SelectContent>
                  {generateTimeOptions().map(time => (
                    <SelectItem key={time} value={time}>{time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Heure de fin
              </label>
              <Select value={endTime} onValueChange={setEndTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Fin" />
                </SelectTrigger>
                <SelectContent>
                  {generateTimeOptions().map(time => (
                    <SelectItem key={time} value={time}>{time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {conflictError && (
            <Alert className="mb-3">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{conflictError}</AlertDescription>
            </Alert>
          )}
          
          <Button 
            onClick={handleQuickReservationWithTime}
            disabled={!startTime || !endTime}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Créer la réservation
          </Button>
        </div>
        
        {dayReservations.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Aucune réservation pour cette journée</p>
            <p className="text-sm">Utilisez la section ci-dessus pour réserver</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
