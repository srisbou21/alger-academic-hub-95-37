import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, 
  Clock, 
  Users, 
  BookOpen, 
  CheckCircle, 
  AlertTriangle,
  Building,
  Play
} from "lucide-react";

interface TimeSlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  course: string;
  teacher: string;
  room: string;
  group: string;
  type: 'cours' | 'td' | 'tp';
  status: 'generated' | 'reserved' | 'conflict';
}

interface Formation {
  id: string;
  name: string;
  level: string;
  semester: string;
  students: number;
  groups: number;
}

const FORMATIONS: Formation[] = [
  { id: '1', name: 'Informatique', level: 'L1', semester: 'S1', students: 120, groups: 4 },
  { id: '2', name: 'Mathématiques', level: 'L2', semester: 'S3', students: 80, groups: 3 },
  { id: '3', name: 'Physique', level: 'L3', semester: 'S5', students: 60, groups: 2 },
];

const ROOMS = [
  { id: '1', name: 'Amphi A', capacity: 200, type: 'amphitheater' },
  { id: '2', name: 'Salle 101', capacity: 50, type: 'classroom' },
  { id: '3', name: 'Lab Info 1', capacity: 30, type: 'laboratory' },
  { id: '4', name: 'Salle TD 1', capacity: 25, type: 'classroom' },
];

const TIME_SLOTS = [
  { start: '08:00', end: '09:30' },
  { start: '09:45', end: '11:15' },
  { start: '11:30', end: '13:00' },
  { start: '14:00', end: '15:30' },
  { start: '15:45', end: '17:15' },
];

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];

export const SimpleTimetableGenerator = () => {
  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(null);
  const [selectedWeeks, setSelectedWeeks] = useState<number>(16);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generatedSlots, setGeneratedSlots] = useState<TimeSlot[]>([]);
  const [reservationStatus, setReservationStatus] = useState<'none' | 'processing' | 'completed' | 'partial'>('none');

  const generateTimetable = async () => {
    if (!selectedFormation) return;

    setIsGenerating(true);
    setGenerationProgress(0);
    
    const slots: TimeSlot[] = [];
    let slotId = 1;

    // Génération automatique des créneaux
    for (let week = 1; week <= selectedWeeks; week++) {
      DAYS.forEach(day => {
        // Cours magistral (tous les groupes ensemble)
        if (day === 'Lundi' || day === 'Mercredi') {
          slots.push({
            id: `slot_${slotId++}`,
            day,
            startTime: TIME_SLOTS[0].start,
            endTime: TIME_SLOTS[0].end,
            course: `Cours ${selectedFormation.name}`,
            teacher: 'Dr. Martin',
            room: ROOMS[0].name,
            group: 'Tous groupes',
            type: 'cours',
            status: 'generated'
          });
        }

        // TD par groupe
        if (day === 'Mardi' || day === 'Jeudi') {
          for (let group = 1; group <= selectedFormation.groups; group++) {
            const timeSlot = TIME_SLOTS[group - 1] || TIME_SLOTS[0];
            const room = ROOMS[group] || ROOMS[1];
            
            slots.push({
              id: `slot_${slotId++}`,
              day,
              startTime: timeSlot.start,
              endTime: timeSlot.end,
              course: `TD ${selectedFormation.name}`,
              teacher: `Enseignant ${group}`,
              room: room.name,
              group: `Groupe ${group}`,
              type: 'td',
              status: 'generated'
            });
          }
        }

        // TP par groupe (vendredi)
        if (day === 'Vendredi') {
          for (let group = 1; group <= selectedFormation.groups; group++) {
            const timeSlot = TIME_SLOTS[group - 1] || TIME_SLOTS[0];
            
            slots.push({
              id: `slot_${slotId++}`,
              day,
              startTime: timeSlot.start,
              endTime: timeSlot.end,
              course: `TP ${selectedFormation.name}`,
              teacher: `Enseignant TP ${group}`,
              room: ROOMS[2].name,
              group: `Groupe ${group}`,
              type: 'tp',
              status: 'generated'
            });
          }
        }
      });
    }

    // Animation de progression
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setGenerationProgress(i);
    }

    setGeneratedSlots(slots);
    setIsGenerating(false);
  };

  const reserveAllSlots = async () => {
    setReservationStatus('processing');
    
    // Simulation de réservation avec quelques conflits
    const updatedSlots = generatedSlots.map(slot => {
      // 20% de chance de conflit
      if (Math.random() < 0.2) {
        return { ...slot, status: 'conflict' as const };
      }
      return { ...slot, status: 'reserved' as const };
    });

    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setGeneratedSlots(updatedSlots);
    const hasConflicts = updatedSlots.some(slot => slot.status === 'conflict');
    setReservationStatus(hasConflicts ? 'partial' : 'completed');
  };

  const getStatusBadge = (status: TimeSlot['status']) => {
    switch (status) {
      case 'generated':
        return <Badge variant="secondary">Généré</Badge>;
      case 'reserved':
        return <Badge className="bg-green-100 text-green-800">Réservé</Badge>;
      case 'conflict':
        return <Badge className="bg-red-100 text-red-800">Conflit</Badge>;
    }
  };

  const stats = {
    total: generatedSlots.length,
    reserved: generatedSlots.filter(s => s.status === 'reserved').length,
    conflicts: generatedSlots.filter(s => s.status === 'conflict').length,
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            Générateur d'Emploi du Temps Simplifié
          </CardTitle>
          <p className="text-muted-foreground">
            Génération rapide et réservation automatique des créneaux
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Formation</label>
              <Select value={selectedFormation?.id || ""} onValueChange={(value) => {
                const formation = FORMATIONS.find(f => f.id === value);
                setSelectedFormation(formation || null);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une formation" />
                </SelectTrigger>
                <SelectContent>
                  {FORMATIONS.map(formation => (
                    <SelectItem key={formation.id} value={formation.id}>
                      {formation.name} - {formation.level} {formation.semester}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Nombre de semaines</label>
              <Input
                type="number"
                value={selectedWeeks}
                onChange={(e) => setSelectedWeeks(parseInt(e.target.value) || 16)}
                min="1"
                max="20"
              />
            </div>
          </div>

          {selectedFormation && (
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">Informations Formation</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Étudiants:</span>
                  <p className="font-medium">{selectedFormation.students}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Groupes:</span>
                  <p className="font-medium">{selectedFormation.groups}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Semaines:</span>
                  <p className="font-medium">{selectedWeeks}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Créneaux estimés:</span>
                  <p className="font-medium">{selectedWeeks * 5 * (1 + selectedFormation.groups * 2)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Generation */}
          <div className="flex gap-4">
            <Button 
              onClick={generateTimetable}
              disabled={!selectedFormation || isGenerating}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isGenerating ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Génération...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Générer Emploi du Temps
                </>
              )}
            </Button>

            {generatedSlots.length > 0 && reservationStatus === 'none' && (
              <Button 
                onClick={reserveAllSlots}
                className="bg-green-600 hover:bg-green-700"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Réserver Toutes les Salles
              </Button>
            )}
          </div>

          {isGenerating && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Génération en cours...</span>
                <span>{generationProgress}%</span>
              </div>
              <Progress value={generationProgress} />
            </div>
          )}

          {/* Reservation Status */}
          {reservationStatus === 'processing' && (
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription>
                Réservation des salles en cours...
              </AlertDescription>
            </Alert>
          )}

          {reservationStatus === 'completed' && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Toutes les réservations ont été confirmées avec succès !
              </AlertDescription>
            </Alert>
          )}

          {reservationStatus === 'partial' && (
            <Alert className="border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Réservations partielles - {stats.conflicts} conflit(s) détecté(s)
              </AlertDescription>
            </Alert>
          )}

          {/* Statistics */}
          {generatedSlots.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{stats.total}</div>
                    <p className="text-sm text-muted-foreground">Total créneaux</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{stats.reserved}</div>
                    <p className="text-sm text-muted-foreground">Réservés</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{stats.conflicts}</div>
                    <p className="text-sm text-muted-foreground">Conflits</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Generated Timetable Preview */}
          {generatedSlots.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Aperçu des Créneaux Générés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {generatedSlots.slice(0, 10).map((slot) => (
                    <div key={slot.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Badge variant="outline">{slot.type.toUpperCase()}</Badge>
                        <div>
                          <p className="font-medium">{slot.course}</p>
                          <p className="text-sm text-muted-foreground">{slot.group}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right text-sm">
                          <p className="font-medium">{slot.day}</p>
                          <p className="text-muted-foreground">{slot.startTime} - {slot.endTime}</p>
                          <p className="text-xs text-muted-foreground">{slot.room}</p>
                        </div>
                        {getStatusBadge(slot.status)}
                      </div>
                    </div>
                  ))}
                  {generatedSlots.length > 10 && (
                    <p className="text-center text-sm text-muted-foreground py-2">
                      ... et {generatedSlots.length - 10} autres créneaux
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};