import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Building, 
  Calendar, 
  CheckCircle, 
  AlertTriangle, 
  X, 
  RefreshCw,
  Clock,
  MapPin
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Reservation {
  id: string;
  scheduleId: string;
  subject: string;
  room: string;
  day: string;
  time: string;
  status: 'pending' | 'confirmed' | 'conflict' | 'cancelled';
  conflictReason?: string;
}

interface Conflict {
  id: string;
  type: 'room_occupied' | 'teacher_conflict' | 'capacity_exceeded';
  room: string;
  time: string;
  conflictingReservation?: string;
}

export const ReservationManager = () => {
  const { toast } = useToast();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [isReserving, setIsReserving] = useState(false);
  const [reservationProgress, setReservationProgress] = useState(0);
  const [selectedFormation, setSelectedFormation] = useState("Licence Informatique L3");

  // Mock validated schedules
  const validatedSchedules = [
    {
      id: '1',
      subject: 'Algorithmes et Structures de Données',
      teacher: 'Dr. Martin',
      room: 'Amphithéâtre A',
      day: 'Lundi',
      time: '08:30-10:00',
      type: 'lecture'
    },
    {
      id: '2',
      subject: 'Algorithmes - TD',
      teacher: 'Mme. Dubois',
      room: 'Salle 201',
      day: 'Mardi',
      time: '10:15-11:45',
      type: 'td'
    },
    {
      id: '3',
      subject: 'Programmation - TP',
      teacher: 'M. Bernard',
      room: 'Lab Info 1',
      day: 'Mercredi',
      time: '14:00-16:00',
      type: 'tp'
    }
  ];

  const handleAutomaticReservation = async () => {
    setIsReserving(true);
    setReservationProgress(0);
    setReservations([]);
    setConflicts([]);

    try {
      const newReservations: Reservation[] = [];
      const detectedConflicts: Conflict[] = [];

      for (let i = 0; i < validatedSchedules.length; i++) {
        const schedule = validatedSchedules[i];
        
        // Simulate reservation process
        await new Promise(resolve => setTimeout(resolve, 1000));
        setReservationProgress(((i + 1) / validatedSchedules.length) * 100);

        // Simulate conflict detection (25% chance of conflict)
        const hasConflict = Math.random() < 0.25;
        
        if (hasConflict && i === 1) {
          // Create a conflict for demonstration
          const conflict: Conflict = {
            id: `conflict_${i}`,
            type: 'room_occupied',
            room: schedule.room,
            time: `${schedule.day} ${schedule.time}`,
            conflictingReservation: 'Réunion direction'
          };
          detectedConflicts.push(conflict);

          newReservations.push({
            id: `res_${i}`,
            scheduleId: schedule.id,
            subject: schedule.subject,
            room: schedule.room,
            day: schedule.day,
            time: schedule.time,
            status: 'conflict',
            conflictReason: 'Salle déjà occupée'
          });
        } else {
          newReservations.push({
            id: `res_${i}`,
            scheduleId: schedule.id,
            subject: schedule.subject,
            room: schedule.room,
            day: schedule.day,
            time: schedule.time,
            status: 'confirmed'
          });
        }
      }

      setReservations(newReservations);
      setConflicts(detectedConflicts);

      const successCount = newReservations.filter(r => r.status === 'confirmed').length;
      const conflictCount = detectedConflicts.length;

      if (conflictCount > 0) {
        toast({
          title: "Réservation terminée avec conflits",
          description: `${successCount} réservations confirmées, ${conflictCount} conflits détectés`,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Réservation terminée",
          description: `Toutes les ${successCount} réservations ont été confirmées`
        });
      }

    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la réservation automatique",
        variant: "destructive"
      });
    } finally {
      setIsReserving(false);
    }
  };

  const handleCancelAllReservations = () => {
    setReservations(reservations.map(r => ({ ...r, status: 'cancelled' as const })));
    setConflicts([]);
    
    toast({
      title: "Réservations annulées",
      description: `Toutes les réservations pour ${selectedFormation} ont été annulées`
    });
  };

  const resolveConflict = (conflictId: string, reservationId: string) => {
    setConflicts(conflicts.filter(c => c.id !== conflictId));
    setReservations(reservations.map(r => 
      r.id === reservationId 
        ? { ...r, status: 'confirmed' as const, conflictReason: undefined }
        : r
    ));
    
    toast({
      title: "Conflit résolu",
      description: "La réservation a été confirmée"
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'conflict': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmée';
      case 'conflict': return 'Conflit';
      case 'pending': return 'En attente';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  };

  const confirmedCount = reservations.filter(r => r.status === 'confirmed').length;
  const conflictCount = conflicts.length;
  const cancelledCount = reservations.filter(r => r.status === 'cancelled').length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-6 w-6" />
            Gestion des Réservations d'Infrastructure
          </CardTitle>
          <p className="text-slate-600">
            Réservation automatique des salles pour les emplois du temps validés
          </p>
        </CardHeader>
      </Card>

      {/* Sélection de la formation */}
      <Card>
        <CardHeader>
          <CardTitle>Formation Sélectionnée</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="font-medium text-blue-900">{selectedFormation}</p>
            <p className="text-sm text-blue-600">{validatedSchedules.length} emplois du temps validés</p>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques des réservations */}
      {reservations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4 text-center">
              <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <p className="text-lg font-bold text-green-800">{confirmedCount}</p>
              <p className="text-sm text-green-600">Confirmées</p>
            </CardContent>
          </Card>
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-4 text-center">
              <AlertTriangle className="h-6 w-6 text-red-600 mx-auto mb-2" />
              <p className="text-lg font-bold text-red-800">{conflictCount}</p>
              <p className="text-sm text-red-600">Conflits</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="p-4 text-center">
              <X className="h-6 w-6 text-gray-600 mx-auto mb-2" />
              <p className="text-lg font-bold text-gray-800">{cancelledCount}</p>
              <p className="text-sm text-gray-600">Annulées</p>
            </CardContent>
          </Card>
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4 text-center">
              <Calendar className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <p className="text-lg font-bold text-blue-800">{reservations.length}</p>
              <p className="text-sm text-blue-600">Total</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Actions principales */}
      <Card>
        <CardHeader>
          <CardTitle>Actions de Réservation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button 
              onClick={handleAutomaticReservation}
              disabled={isReserving}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isReserving ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Réservation en cours...
                </>
              ) : (
                <>
                  <Building className="mr-2 h-4 w-4" />
                  Réserver Tous les Emplois du Temps
                </>
              )}
            </Button>
            
            {reservations.length > 0 && (
              <Button 
                onClick={handleCancelAllReservations}
                variant="destructive"
              >
                <X className="mr-2 h-4 w-4" />
                Annuler Toutes les Réservations
              </Button>
            )}
          </div>

          {isReserving && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Réservation en cours...</span>
                <span className="text-sm font-medium">{Math.round(reservationProgress)}%</span>
              </div>
              <Progress value={reservationProgress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Conflits détectés */}
      {conflicts.length > 0 && (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              Conflits de Réservation Détectés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {conflicts.map((conflict) => (
                <Alert key={conflict.id} className="border-red-200">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Conflit de salle: {conflict.room}</p>
                        <p className="text-sm text-slate-600">
                          {conflict.time} • {conflict.conflictingReservation && `Conflit avec: ${conflict.conflictingReservation}`}
                        </p>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => {
                          const reservation = reservations.find(r => r.room === conflict.room);
                          if (reservation) {
                            resolveConflict(conflict.id, reservation.id);
                          }
                        }}
                      >
                        Résoudre
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Liste des réservations */}
      {reservations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>État des Réservations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reservations.map((reservation) => (
                <div key={reservation.id} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Badge className={getStatusColor(reservation.status)}>
                        {getStatusLabel(reservation.status)}
                      </Badge>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Clock className="h-4 w-4" />
                        {reservation.day} • {reservation.time}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <MapPin className="h-4 w-4" />
                        {reservation.room}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-slate-800">{reservation.subject}</p>
                      {reservation.conflictReason && (
                        <p className="text-sm text-red-600">{reservation.conflictReason}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};