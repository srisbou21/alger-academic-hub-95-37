
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Trash2,
  Calendar,
  MapPin
} from "lucide-react";
import { ManualTimetable } from "../../types/academic";
import { Reservation } from "../../types/reservation";

export const TimetableValidationManager = () => {
  const [timetables, setTimetables] = useState<ManualTimetable[]>([
    {
      id: "tt1",
      name: "Emploi du temps L1 INFO S1",
      formationId: "form1",
      academicYear: "2024-2025",
      semester: "S1",
      status: 'draft',
      schedules: [
        {
          id: "sch1",
          moduleId: "mod1",
          moduleName: "Algorithmique et Programmation",
          atomType: "cours",
          teacherId: "teach1",
          teacherName: "Dr. Amrani",
          targetAudience: { type: "section", id: "sect1", name: "Section A" },
          dayOfWeek: "Lundi",
          startTime: "09:00",
          endTime: "10:30",
          roomId: "amphi-a",
          roomName: "Amphithéâtre A",
          weekFrequency: "weekly",
          startWeek: 1,
          endWeek: 16,
          requiresReservation: true
        },
        {
          id: "sch2",
          moduleId: "mod1",
          moduleName: "Algorithmique et Programmation",
          atomType: "td",
          teacherId: "teach1",
          teacherName: "Dr. Amrani",
          targetAudience: { type: "group", id: "gr1", name: "Groupe 1" },
          dayOfWeek: "Mardi",
          startTime: "14:00",
          endTime: "15:30",
          roomId: "salle-b1",
          roomName: "Salle B1",
          weekFrequency: "weekly",
          startWeek: 1,
          endWeek: 16,
          requiresReservation: true
        }
      ],
      createdBy: "user1",
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);

  const [generatedReservations, setGeneratedReservations] = useState<Record<string, Reservation[]>>({});

  const validateTimetable = async (timetableId: string) => {
    const timetable = timetables.find(tt => tt.id === timetableId);
    if (!timetable) return;

    console.log(`Validation de l'emploi du temps: ${timetable.name}`);

    // Créer les réservations automatiques pour les créneaux qui en ont besoin
    const reservationsToCreate: Reservation[] = [];
    
    timetable.schedules
      .filter(schedule => schedule.requiresReservation)
      .forEach(schedule => {
        // Créer une réservation pour chaque semaine
        for (let week = schedule.startWeek; week <= schedule.endWeek; week++) {
          const reservationDate = calculateDateForWeek(week, schedule.dayOfWeek);
          
          const reservation: Reservation = {
            id: `auto_${schedule.id}_week_${week}`,
            spaceId: schedule.roomId!,
            spaceName: schedule.roomName,
            requester: {
              name: 'Système Emploi du Temps',
              contact: 'system@faculte.edu',
              phone: '+33 1 00 00 00 00'
            },
            type: 'course',
            purpose: `${schedule.moduleName} - ${schedule.atomType.toUpperCase()}`,
            description: `Cours automatique - ${timetable.name}`,
            participants: schedule.targetAudience.type === 'section' ? 120 : 20,
            dateTime: {
              start: new Date(`${reservationDate}T${schedule.startTime}:00`),
              end: new Date(`${reservationDate}T${schedule.endTime}:00`)
            },
            equipment: [],
            priority: 1,
            status: 'approved',
            recurrence: {
              pattern: schedule.weekFrequency === 'weekly' ? 'weekly' : 'biweekly',
              endDate: calculateSemesterEndDate(timetable.academicYear, timetable.semester)
            },
            validationHistory: [{
              id: 'auto_validation',
              validator: 'Système Emploi du Temps',
              action: 'approved',
              date: new Date(),
              comment: 'Validation automatique lors de la validation de l\'emploi du temps'
            }],
            createdAt: new Date(),
            updatedAt: new Date()
          };
          
          reservationsToCreate.push(reservation);
        }
      });

    // Sauvegarder les réservations générées
    setGeneratedReservations(prev => ({
      ...prev,
      [timetableId]: reservationsToCreate
    }));

    // Mettre à jour le statut de l'emploi du temps
    setTimetables(prev => prev.map(tt => 
      tt.id === timetableId 
        ? { ...tt, status: 'validated', validatedAt: new Date(), validatedBy: 'current_user' }
        : tt
    ));

    console.log(`${reservationsToCreate.length} réservations créées automatiquement`);
    alert(`Emploi du temps validé ! ${reservationsToCreate.length} réservations ont été créées automatiquement.`);
  };

  const invalidateTimetable = async (timetableId: string) => {
    const timetable = timetables.find(tt => tt.id === timetableId);
    if (!timetable) return;

    if (confirm(`Êtes-vous sûr de vouloir invalider l'emploi du temps "${timetable.name}" ? Toutes les réservations associées seront supprimées.`)) {
      console.log(`Invalidation de l'emploi du temps: ${timetable.name}`);
      
      // Supprimer les réservations associées
      const reservations = generatedReservations[timetableId] || [];
      console.log(`Suppression de ${reservations.length} réservations automatiques`);
      
      // Mettre à jour le statut
      setTimetables(prev => prev.map(tt => 
        tt.id === timetableId 
          ? { ...tt, status: 'invalidated', updatedAt: new Date() }
          : tt
      ));

      // Supprimer les réservations de la liste
      setGeneratedReservations(prev => {
        const updated = { ...prev };
        delete updated[timetableId];
        return updated;
      });

      alert(`Emploi du temps invalidé ! ${reservations.length} réservations ont été supprimées automatiquement.`);
    }
  };

  const deleteTimetable = async (timetableId: string) => {
    const timetable = timetables.find(tt => tt.id === timetableId);
    if (!timetable) return;

    if (confirm(`Êtes-vous sûr de vouloir supprimer définitivement l'emploi du temps "${timetable.name}" ?`)) {
      // Si l'emploi du temps est validé, supprimer aussi les réservations
      if (timetable.status === 'validated') {
        const reservations = generatedReservations[timetableId] || [];
        console.log(`Suppression de ${reservations.length} réservations automatiques`);
        setGeneratedReservations(prev => {
          const updated = { ...prev };
          delete updated[timetableId];
          return updated;
        });
      }

      setTimetables(prev => prev.filter(tt => tt.id !== timetableId));
      alert("Emploi du temps supprimé avec succès !");
    }
  };

  const calculateDateForWeek = (weekNumber: number, dayOfWeek: string): string => {
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 8, 1);
    const daysToAdd = (weekNumber - 1) * 7 + getDayOffset(dayOfWeek);
    const targetDate = new Date(startOfYear.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
    return targetDate.toISOString().split('T')[0];
  };

  const getDayOffset = (dayOfWeek: string): number => {
    const dayMap = {
      'Lundi': 0, 'Mardi': 1, 'Mercredi': 2, 'Jeudi': 3, 'Vendredi': 4, 'Samedi': 5, 'Dimanche': 6
    };
    return dayMap[dayOfWeek as keyof typeof dayMap] || 0;
  };

  const calculateSemesterEndDate = (academicYear: string, semester: string): string => {
    const year = parseInt(academicYear.split('-')[0]);
    return semester === 'S1' ? `${year}-12-31` : `${year + 1}-05-31`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'validated': return 'bg-green-100 text-green-800 border-green-200';
      case 'published': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'invalidated': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Clock className="h-4 w-4" />;
      case 'validated': return <CheckCircle2 className="h-4 w-4" />;
      case 'published': return <Calendar className="h-4 w-4" />;
      case 'invalidated': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            Gestion et Validation des Emplois du Temps
          </CardTitle>
          <p className="text-slate-600">
            Validez les emplois du temps pour générer automatiquement les réservations
          </p>
        </CardHeader>
      </Card>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Important :</strong> La validation d'un emploi du temps génère automatiquement toutes les réservations de salles pour le semestre. 
          L'invalidation supprime toutes les réservations associées.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        {timetables.map((timetable) => {
          const reservations = generatedReservations[timetable.id] || [];
          const schedulesWithReservation = timetable.schedules.filter(s => s.requiresReservation);
          
          return (
            <Card key={timetable.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">{timetable.name}</h3>
                    <p className="text-sm text-slate-600">
                      {timetable.academicYear} • {timetable.semester} • Créé par {timetable.createdBy}
                    </p>
                    {timetable.validatedAt && (
                      <p className="text-xs text-slate-500">
                        Validé le {timetable.validatedAt.toLocaleDateString()} par {timetable.validatedBy}
                      </p>
                    )}
                  </div>
                  <Badge className={getStatusColor(timetable.status)}>
                    {getStatusIcon(timetable.status)}
                    <span className="ml-1 capitalize">
                      {timetable.status === 'draft' && 'Brouillon'}
                      {timetable.status === 'validated' && 'Validé'}
                      {timetable.status === 'published' && 'Publié'}
                      {timetable.status === 'invalidated' && 'Invalidé'}
                    </span>
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">{timetable.schedules.length} créneaux</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-green-600" />
                    <span className="text-sm">{schedulesWithReservation.length} avec réservation</span>
                  </div>
                  {timetable.status === 'validated' && (
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm">{reservations.length} réservations créées</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2 mb-4">
                  {timetable.schedules.slice(0, 3).map((schedule) => (
                    <div key={schedule.id} className="flex items-center justify-between p-3 bg-slate-50 rounded">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{schedule.dayOfWeek}</Badge>
                        <span className="text-sm font-mono">{schedule.startTime} - {schedule.endTime}</span>
                        <span className="text-sm">{schedule.moduleName}</span>
                        {schedule.requiresReservation && (
                          <Badge className="bg-green-100 text-green-800">
                            <MapPin className="h-3 w-3 mr-1" />
                            {schedule.roomName}
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-slate-500">{schedule.targetAudience.name}</span>
                    </div>
                  ))}
                  {timetable.schedules.length > 3 && (
                    <p className="text-xs text-slate-500 text-center">
                      ... et {timetable.schedules.length - 3} autres créneaux
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  {timetable.status === 'draft' && (
                    <Button 
                      onClick={() => validateTimetable(timetable.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Valider et Créer Réservations
                    </Button>
                  )}
                  
                  {timetable.status === 'validated' && (
                    <Button 
                      onClick={() => invalidateTimetable(timetable.id)}
                      variant="outline"
                      className="border-red-200 text-red-700 hover:bg-red-50"
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Invalider
                    </Button>
                  )}
                  
                  <Button 
                    onClick={() => deleteTimetable(timetable.id)}
                    variant="outline"
                    className="border-slate-200"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Supprimer
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {timetables.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-500">Aucun emploi du temps créé</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
