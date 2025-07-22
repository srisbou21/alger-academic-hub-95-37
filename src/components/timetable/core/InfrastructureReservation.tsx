import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  AlertTriangle, 
  CheckCircle, 
  Calendar, 
  MapPin,
  Clock,
  X
} from "lucide-react";
import { WorkflowData } from './TimetableWorkflow';

interface Props {
  workflowData: WorkflowData;
  updateWorkflowData: (updates: Partial<WorkflowData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

interface Conflict {
  id: string;
  type: 'overlap' | 'capacity' | 'equipment';
  message: string;
  affectedTimetables: string[];
  severity: 'low' | 'medium' | 'high';
  suggestion?: string;
}

interface Reservation {
  id: string;
  timetableId: string;
  room: string;
  day: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'conflict';
}

export const InfrastructureReservation = ({ workflowData, updateWorkflowData }: Props) => {
  const [isReserving, setIsReserving] = useState(false);
  const [reservationProgress, setReservationProgress] = useState(0);
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [showConflictResolution, setShowConflictResolution] = useState(false);

  const startReservation = async () => {
    setIsReserving(true);
    setReservationProgress(0);

    // Simulation de la réservation avec détection de conflits
    const newReservations: Reservation[] = [];
    const detectedConflicts: Conflict[] = [];

    workflowData.generatedTimetables.forEach((timetable, index) => {
      const reservation: Reservation = {
        id: `res_${timetable.id}`,
        timetableId: timetable.id,
        room: timetable.room,
        day: timetable.day,
        startTime: timetable.startTime,
        endTime: timetable.endTime,
        status: 'pending'
      };

      // Simulation de conflit (25% de chance)
      if (Math.random() < 0.25) {
        reservation.status = 'conflict';
        detectedConflicts.push({
          id: `conflict_${index}`,
          type: 'overlap',
          message: `Conflit de créneaux détecté pour ${timetable.room}`,
          affectedTimetables: [timetable.id],
          severity: 'medium',
          suggestion: `Proposer une salle alternative ou modifier l'horaire`
        });
      } else {
        reservation.status = 'confirmed';
      }

      newReservations.push(reservation);
    });

    // Animation de progression
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setReservationProgress(i);
    }

    setReservations(newReservations);
    setConflicts(detectedConflicts);
    
    if (detectedConflicts.length > 0) {
      setShowConflictResolution(true);
    }

    updateWorkflowData({ reservations: newReservations });
    setIsReserving(false);
  };

  const resolveConflict = (conflictId: string) => {
    setConflicts(prev => prev.filter(c => c.id !== conflictId));
    // Ici on pourrait implémenter la résolution automatique
  };

  const cancelAllReservations = () => {
    setReservations([]);
    setConflicts([]);
    updateWorkflowData({ reservations: [] });
    setShowConflictResolution(false);
  };

  const confirmedCount = reservations.filter(r => r.status === 'confirmed').length;
  const conflictCount = reservations.filter(r => r.status === 'conflict').length;
  const totalCount = reservations.length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Réservation des Infrastructures
          </CardTitle>
          <p className="text-slate-600">
            Réservation automatique avec détection et résolution de conflits
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Summary */}
          {workflowData.selectedFormation && (
            <div className="bg-slate-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Récapitulatif</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-slate-600">Formation:</span>
                  <p className="font-medium">{workflowData.selectedFormation.name}</p>
                </div>
                <div>
                  <span className="text-slate-600">Emplois du temps:</span>
                  <p className="font-medium">{workflowData.generatedTimetables.length}</p>
                </div>
                <div>
                  <span className="text-slate-600">Infrastructures:</span>
                  <p className="font-medium">{workflowData.selectedInfrastructures.length}</p>
                </div>
                <div>
                  <span className="text-slate-600">Optimisé:</span>
                  <p className="font-medium">{workflowData.isOptimized ? "Oui" : "Non"}</p>
                </div>
              </div>
            </div>
          )}

          {/* Reservation Controls */}
          {reservations.length === 0 && (
            <div className="space-y-4">
              <Button 
                onClick={startReservation}
                disabled={isReserving}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isReserving ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    Réservation en cours...
                  </>
                ) : (
                  <>
                    <BookOpen className="mr-2 h-4 w-4" />
                    Réserver Tous les Emplois du Temps
                  </>
                )}
              </Button>

              {isReserving && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Traitement des réservations...</span>
                    <span>{reservationProgress}%</span>
                  </div>
                  <Progress value={reservationProgress} className="h-2" />
                </div>
              )}
            </div>
          )}

          {/* Conflicts Alert */}
          {conflicts.length > 0 && (
            <Alert className="border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>{conflicts.length} conflit(s) détecté(s)</strong>
                <p className="mt-1">Des conflits de réservation ont été identifiés et nécessitent votre attention.</p>
              </AlertDescription>
            </Alert>
          )}

          {/* Reservation Status */}
          {reservations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>État des Réservations</span>
                  <Button 
                    onClick={cancelAllReservations}
                    variant="destructive"
                    size="sm"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Annuler Toutes
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Progress Summary */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{confirmedCount}</div>
                    <p className="text-sm text-slate-600">Confirmées</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{conflictCount}</div>
                    <p className="text-sm text-slate-600">En conflit</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-600">{totalCount}</div>
                    <p className="text-sm text-slate-600">Total</p>
                  </div>
                </div>

                {/* Reservations List */}
                <div className="space-y-3">
                  {reservations.map((reservation) => {
                    const timetable = workflowData.generatedTimetables.find(t => t.id === reservation.timetableId);
                    return (
                      <div 
                        key={reservation.id}
                        className={`p-4 border rounded-lg ${
                          reservation.status === 'confirmed' 
                            ? 'border-green-200 bg-green-50' 
                            : reservation.status === 'conflict'
                              ? 'border-orange-200 bg-orange-50'
                              : 'border-slate-200 bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Badge 
                              variant="outline"
                              className={
                                reservation.status === 'confirmed' 
                                  ? 'border-green-500 text-green-700'
                                  : 'border-orange-500 text-orange-700'
                              }
                            >
                              {reservation.status === 'confirmed' ? 'Confirmée' : 'Conflit'}
                            </Badge>
                            <div>
                              <p className="font-medium">{timetable?.subject}</p>
                              <p className="text-sm text-slate-600">{timetable?.targetName}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="font-medium flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {reservation.room}
                              </p>
                              <p className="text-sm text-slate-600 flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {reservation.day} {reservation.startTime}-{reservation.endTime}
                              </p>
                            </div>
                            
                            {reservation.status === 'confirmed' && (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Conflict Resolution */}
          {showConflictResolution && conflicts.length > 0 && (
            <Card className="border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-800">
                  <AlertTriangle className="h-5 w-5" />
                  Résolution des Conflits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {conflicts.map((conflict) => (
                    <div key={conflict.id} className="border border-orange-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge 
                          className={
                            conflict.severity === 'high' 
                              ? 'bg-red-100 text-red-800'
                              : conflict.severity === 'medium'
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-yellow-100 text-yellow-800'
                          }
                        >
                          {conflict.severity === 'high' ? 'Critique' : 
                           conflict.severity === 'medium' ? 'Moyen' : 'Faible'}
                        </Badge>
                        <Button 
                          size="sm" 
                          onClick={() => resolveConflict(conflict.id)}
                          className="bg-orange-600 hover:bg-orange-700"
                        >
                          Résoudre
                        </Button>
                      </div>
                      <p className="text-sm text-slate-800 mb-2">{conflict.message}</p>
                      {conflict.suggestion && (
                        <p className="text-xs text-slate-600 italic">{conflict.suggestion}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Success State */}
          {reservations.length > 0 && conflicts.length === 0 && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Toutes les réservations ont été confirmées !</strong>
                <p className="mt-1">L'ensemble des emplois du temps ont été réservés avec succès.</p>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};