import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSpaces } from "../../hooks/useSpaces";
import { useReservations } from "../../hooks/useReservations";
import { Space, Reservation } from "../../types/reservation";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Users, MapPin } from 'lucide-react';
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, isToday } from 'date-fns';
import { fr } from 'date-fns/locale';

interface CalendarViewProps {
  onDateSelect: (date: Date) => void;
  onSpaceSelect: (space: Space) => void;
  selectedDate?: Date;
  selectedSpace?: Space | null;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  onDateSelect,
  onSpaceSelect,
  selectedDate = new Date(),
  selectedSpace
}) => {
  const [viewDate, setViewDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week'>('month');
  
  const { spaces } = useSpaces();
  const { reservations, createReservation } = useReservations();

  const availableSpaces = useMemo(() => 
    spaces.filter(space => space.status !== 'maintenance' && space.status !== 'out_of_service'),
    [spaces]
  );

  const reservationsByDate = useMemo(() => {
    const dateMap = new Map<string, Reservation[]>();
    
    reservations.forEach(reservation => {
      if (reservation.status !== 'cancelled') {
        const dateKey = format(reservation.dateTime.start, 'yyyy-MM-dd');
        if (!dateMap.has(dateKey)) {
          dateMap.set(dateKey, []);
        }
        dateMap.get(dateKey)!.push(reservation);
      }
    });
    
    return dateMap;
  }, [reservations]);

  const getReservationsForSpaceAndDate = (space: Space, date: Date): Reservation[] => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const dayReservations = reservationsByDate.get(dateKey) || [];
    return dayReservations.filter(res => res.spaceId === space.id);
  };

  const getDayAvailability = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const dayReservations = reservationsByDate.get(dateKey) || [];
    
    const totalSpaces = availableSpaces.length;
    const occupiedSpaces = new Set(dayReservations.map(res => res.spaceId)).size;
    const availableCount = totalSpaces - occupiedSpaces;
    
    return {
      total: totalSpaces,
      available: availableCount,
      occupied: occupiedSpaces,
      reservations: dayReservations.length
    };
  };

  const getAvailabilityClass = (date: Date) => {
    const { available, total } = getDayAvailability(date);
    const ratio = available / total;
    
    if (ratio > 0.7) return 'bg-green-500';
    if (ratio > 0.3) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const monthDays = useMemo(() => {
    const start = startOfMonth(viewDate);
    const end = endOfMonth(viewDate);
    return eachDayOfInterval({ start, end });
  }, [viewDate]);

  // Fonction pour créer une réservation rapide
  const handleQuickReservation = async (space: Space, date: Date) => {
    console.log('Création d\'une réservation rapide pour:', space.name, 'le', format(date, 'dd/MM/yyyy'));
    
    try {
      const startTime = new Date(date);
      startTime.setHours(9, 0, 0, 0); // 9h00 par défaut
      
      const endTime = new Date(date);
      endTime.setHours(11, 0, 0, 0); // 11h00 par défaut
      
      const newReservation: Partial<Reservation> = {
        spaceId: space.id,
        spaceName: space.name,
        requester: {
          name: 'Utilisateur Connecté',
          contact: 'email@exemple.fr',
          phone: '+33 1 23 45 67 89'
        },
        type: 'course',
        purpose: 'Réservation rapide depuis le calendrier',
        description: `Réservation créée rapidement pour ${space.name}`,
        participants: Math.min(20, space.capacity),
        dateTime: {
          start: startTime,
          end: endTime
        },
        equipment: [],
        priority: 2,
        status: 'pending'
      };

      await createReservation(newReservation);
      console.log('Réservation créée avec succès');
    } catch (error) {
      console.error('Erreur lors de la création de la réservation:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec sélection d'espace */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Calendrier de réservation
            </div>
            <div className="flex items-center gap-2">
              <Select value={view} onValueChange={(value: 'month' | 'week') => setView(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Mois</SelectItem>
                  <SelectItem value="week">Semaine</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <label className="text-sm font-medium mb-2 block">Espace sélectionné</label>
            <Select 
              value={selectedSpace?.id || 'all'} 
              onValueChange={(value) => {
                if (value === 'all') {
                  onSpaceSelect(null as any);
                } else {
                  const space = availableSpaces.find(s => s.id === value);
                  if (space) onSpaceSelect(space);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tous les espaces" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les espaces</SelectItem>
                {availableSpaces.map(space => (
                  <SelectItem key={space.id} value={space.id}>
                    <div className="flex items-center gap-2">
                      <span>{space.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {space.capacity} places
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Calendrier principal */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              {format(viewDate, 'MMMM yyyy', { locale: fr })}
            </h3>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewDate(new Date())}
              >
                Aujourd'hui
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
              <div key={day} className="p-2 text-center font-medium text-muted-foreground">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {monthDays.map(date => {
              const availability = getDayAvailability(date);
              const isSelected = selectedDate && isSameDay(date, selectedDate);
              const isPast = date < new Date();
              
              return (
                <Button
                  key={date.toISOString()}
                  variant={isSelected ? "default" : "ghost"}
                  className={`
                    h-16 p-2 relative flex flex-col items-center justify-center
                    ${isToday(date) ? 'ring-2 ring-primary' : ''}
                    ${isPast ? 'opacity-50' : ''}
                  `}
                  onClick={() => onDateSelect(date)}
                  disabled={isPast}
                >
                  <span className="text-sm font-medium">
                    {format(date, 'd')}
                  </span>
                  
                  {availability.reservations > 0 && (
                    <div className="flex items-center gap-1 mt-1">
                      <div 
                        className={`w-2 h-2 rounded-full ${getAvailabilityClass(date)}`}
                        title={`${availability.available}/${availability.total} espaces libres`}
                      />
                      <span className="text-xs text-muted-foreground">
                        {availability.reservations}
                      </span>
                    </div>
                  )}
                </Button>
              );
            })}
          </div>
          
          {/* Légende */}
          <div className="flex items-center justify-center gap-4 mt-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span>Très disponible (&gt;70%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span>Partiellement occupé</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span>Très occupé (&lt;30%)</span>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
};
