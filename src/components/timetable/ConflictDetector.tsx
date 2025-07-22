import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  AlertTriangle,
  CheckCircle,
  Users,
  MapPin,
  Clock,
  Calendar,
  Zap,
  AlertCircle
} from "lucide-react";

export interface TimetableEvent {
  id: string;
  subject: string;
  type: 'cours' | 'td' | 'tp' | 'examen';
  teacher: string;
  formation: string;
  level: string;
  group: string;
  room: string;
  day: string;
  startTime: string;
  endTime: string;
  students: number;
  isValidated: boolean;
  hasReservation: boolean;
}

export interface Conflict {
  id: string;
  type: 'room' | 'teacher' | 'group' | 'capacity';
  severity: 'high' | 'medium' | 'low';
  events: TimetableEvent[];
  description: string;
  suggestion: string;
}

interface ConflictDetectorProps {
  events: TimetableEvent[];
  onResolveConflict?: (conflictId: string, resolution: string) => void;
}

export const ConflictDetector: React.FC<ConflictDetectorProps> = ({ 
  events, 
  onResolveConflict 
}) => {
  const [autoResolve, setAutoResolve] = useState(false);

  // Fonction pour vérifier si deux créneaux se chevauchent
  const timeOverlap = (start1: string, end1: string, start2: string, end2: string): boolean => {
    const s1 = new Date(`2024-01-01 ${start1}`);
    const e1 = new Date(`2024-01-01 ${end1}`);
    const s2 = new Date(`2024-01-01 ${start2}`);
    const e2 = new Date(`2024-01-01 ${end2}`);
    
    return s1 < e2 && s2 < e1;
  };

  // Détection des conflits
  const conflicts = useMemo(() => {
    const detectedConflicts: Conflict[] = [];

    // Conflit de salle
    for (let i = 0; i < events.length; i++) {
      for (let j = i + 1; j < events.length; j++) {
        const event1 = events[i];
        const event2 = events[j];

        // Même jour et même salle
        if (event1.day === event2.day && event1.room === event2.room) {
          if (timeOverlap(event1.startTime, event1.endTime, event2.startTime, event2.endTime)) {
            detectedConflicts.push({
              id: `room-${event1.id}-${event2.id}`,
              type: 'room',
              severity: 'high',
              events: [event1, event2],
              description: `Conflit de salle ${event1.room} entre "${event1.subject}" et "${event2.subject}"`,
              suggestion: `Changer la salle d'un des cours ou modifier les horaires`
            });
          }
        }

        // Conflit d'enseignant
        if (event1.day === event2.day && event1.teacher === event2.teacher) {
          if (timeOverlap(event1.startTime, event1.endTime, event2.startTime, event2.endTime)) {
            detectedConflicts.push({
              id: `teacher-${event1.id}-${event2.id}`,
              type: 'teacher',
              severity: 'high',
              events: [event1, event2],
              description: `Conflit d'enseignant: ${event1.teacher} programmé simultanément`,
              suggestion: `Modifier les horaires ou assigner un autre enseignant`
            });
          }
        }

        // Conflit de groupe
        if (event1.day === event2.day && 
            event1.formation === event2.formation && 
            event1.level === event2.level && 
            event1.group === event2.group) {
          if (timeOverlap(event1.startTime, event1.endTime, event2.startTime, event2.endTime)) {
            detectedConflicts.push({
              id: `group-${event1.id}-${event2.id}`,
              type: 'group',
              severity: 'high',
              events: [event1, event2],
              description: `Conflit de groupe: ${event1.formation} ${event1.level} ${event1.group}`,
              suggestion: `Modifier les horaires ou diviser le groupe`
            });
          }
        }
      }
    }

    // Vérification de la capacité des salles
    const roomCapacities: { [key: string]: number } = {
      'Amphi 1': 200,
      'Amphi 2': 150,
      'Salle 201': 50,
      'Salle 202': 40,
      'Lab Info 1': 30,
      'Lab Info 2': 25
    };

    events.forEach(event => {
      const roomCapacity = roomCapacities[event.room];
      if (roomCapacity && event.students > roomCapacity) {
        detectedConflicts.push({
          id: `capacity-${event.id}`,
          type: 'capacity',
          severity: 'medium',
          events: [event],
          description: `Capacité insuffisante: ${event.students} étudiants pour ${roomCapacity} places en ${event.room}`,
          suggestion: `Changer pour une salle plus grande ou diviser le groupe`
        });
      }
    });

    return detectedConflicts;
  }, [events]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getConflictIcon = (type: string) => {
    switch (type) {
      case 'room': return <MapPin className="h-4 w-4" />;
      case 'teacher': return <Users className="h-4 w-4" />;
      case 'group': return <Users className="h-4 w-4" />;
      case 'capacity': return <AlertCircle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const conflictsByType = {
    high: conflicts.filter(c => c.severity === 'high'),
    medium: conflicts.filter(c => c.severity === 'medium'),
    low: conflicts.filter(c => c.severity === 'low')
  };

  const handleResolveConflict = (conflictId: string) => {
    if (onResolveConflict) {
      onResolveConflict(conflictId, 'manual');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header et Statistiques */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6" />
            Détecteur de Conflits
          </CardTitle>
          <p className="text-slate-600">
            Analyse automatique des conflits dans les emplois du temps
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{conflictsByType.high.length}</div>
              <p className="text-sm text-slate-600">Conflits Critiques</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{conflictsByType.medium.length}</div>
              <p className="text-sm text-slate-600">Avertissements</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{conflictsByType.low.length}</div>
              <p className="text-sm text-slate-600">Optimisations</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {events.length - conflicts.reduce((acc, c) => acc + c.events.length, 0)}
              </div>
              <p className="text-sm text-slate-600">Sans Conflit</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* État Global */}
      {conflicts.length === 0 ? (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Aucun conflit détecté</strong> - Tous les emplois du temps sont compatibles.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>{conflicts.length} conflit(s) détecté(s)</strong> - Une résolution est nécessaire avant validation.
          </AlertDescription>
        </Alert>
      )}

      {/* Actions Rapides */}
      {conflicts.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h3 className="font-medium">Actions de Résolution</h3>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Zap className="h-4 w-4 mr-2" />
                  Résolution Auto
                </Button>
                <Button size="sm">
                  Proposer Solutions
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Liste des Conflits */}
      <div className="space-y-4">
        {conflicts.map(conflict => (
          <Card key={conflict.id} className={`border-l-4 ${getSeverityColor(conflict.severity)}`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getConflictIcon(conflict.type)}
                  <div>
                    <CardTitle className="text-lg">{conflict.description}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getSeverityColor(conflict.severity)}>
                        {conflict.severity === 'high' ? 'Critique' : 
                         conflict.severity === 'medium' ? 'Moyen' : 'Faible'}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {conflict.type === 'room' ? 'Salle' :
                         conflict.type === 'teacher' ? 'Enseignant' :
                         conflict.type === 'group' ? 'Groupe' : 'Capacité'}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button size="sm" onClick={() => handleResolveConflict(conflict.id)}>
                  Résoudre
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Suggestion */}
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Suggestion:</strong> {conflict.suggestion}
                </p>
              </div>

              {/* Événements en conflit */}
              <div>
                <p className="font-medium text-slate-700 mb-2">Événements concernés:</p>
                <div className="space-y-2">
                  {conflict.events.map(event => (
                    <div key={event.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-medium">{event.subject}</p>
                          <div className="flex items-center gap-4 text-sm text-slate-600">
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {event.teacher}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {event.room}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {event.day} {event.startTime}-{event.endTime}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Badge className="text-xs">
                        {event.formation} {event.level}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Résumé des Types de Conflits */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Analyse par Type de Conflit</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <MapPin className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <p className="font-medium text-red-800">Conflits de Salle</p>
              <p className="text-2xl font-bold text-red-600">
                {conflicts.filter(c => c.type === 'room').length}
              </p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <Users className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <p className="font-medium text-orange-800">Conflits Enseignant</p>
              <p className="text-2xl font-bold text-orange-600">
                {conflicts.filter(c => c.type === 'teacher').length}
              </p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <Users className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <p className="font-medium text-yellow-800">Conflits de Groupe</p>
              <p className="text-2xl font-bold text-yellow-600">
                {conflicts.filter(c => c.type === 'group').length}
              </p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <AlertCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="font-medium text-blue-800">Problèmes Capacité</p>
              <p className="text-2xl font-bold text-blue-600">
                {conflicts.filter(c => c.type === 'capacity').length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};