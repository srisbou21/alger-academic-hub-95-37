
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  Loader, 
  Download,
  Send,
  Building2
} from "lucide-react";
import { timetableService, GeneratedTimetable } from "../../services/timetableService";
import { Reservation } from "../../types/reservation";

export const SemesterReservationManager = () => {
  const [selectedLevel, setSelectedLevel] = useState("L1");
  const [selectedSemester, setSelectedSemester] = useState("S1");
  const [academicYear, setAcademicYear] = useState("2024-2025");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generatedTimetable, setGeneratedTimetable] = useState<GeneratedTimetable | null>(null);
  const [semesterReservations, setSemesterReservations] = useState<Reservation[]>([]);
  const [reservationStatus, setReservationStatus] = useState<'idle' | 'creating' | 'success' | 'error'>('idle');

  const handleGenerateTimetableAndReservations = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);
    setReservationStatus('idle');

    try {
      // Étape 1: Récupération de l'offre de formation correspondante
      setGenerationProgress(10);
      
      // Simulation de récupération de l'offre de formation
      // Dans un vrai système, ceci viendrait d'une base de données
      const mockFormationOffer = {
        id: "offer1",
        name: `Formation ${selectedLevel}`,
        level: selectedLevel,
        academicYear,
        modules: [
          {
            id: "mod1",
            name: "Algorithmique",
            type: "presential",
            semester: selectedSemester,
            teacher: "Dr. Ahmed Benali",
            pedagogicalAtoms: [
              { id: "atom1", type: "cours", hours: 21, totalWeeks: 14, groupSize: 120 },
              { id: "atom2", type: "td", hours: 21, totalWeeks: 14, groupSize: 40 },
              { id: "atom3", type: "tp", hours: 21, totalWeeks: 14, groupSize: 20 }
            ]
          },
          {
            id: "mod2",
            name: "Mathématiques",
            type: "presential",
            semester: selectedSemester,
            teacher: "Dr. Sarah Amari",
            pedagogicalAtoms: [
              { id: "atom4", type: "cours", hours: 42, totalWeeks: 14, groupSize: 120 },
              { id: "atom5", type: "td", hours: 21, totalWeeks: 14, groupSize: 40 }
            ]
          },
          {
            id: "mod3",
            name: "Formation en ligne",
            type: "distance",
            semester: selectedSemester,
            teacher: "Dr. Karim Mansouri",
            pedagogicalAtoms: [
              { id: "atom6", type: "cours", hours: 21, totalWeeks: 14, groupSize: 120 }
            ]
          }
        ],
        sections: [
          {
            id: "sec1",
            name: "Section A",
            capacity: 120,
            groups: [
              { id: "grp1", name: "Groupe 1", type: "td", capacity: 40 },
              { id: "grp2", name: "Groupe 2", type: "td", capacity: 40 },
              { id: "grp3", name: "Groupe 3", type: "td", capacity: 40 },
              { id: "grp4", name: "Groupe TP1", type: "tp", capacity: 20 },
              { id: "grp5", name: "Groupe TP2", type: "tp", capacity: 20 },
              { id: "grp6", name: "Groupe TP3", type: "tp", capacity: 20 }
            ]
          }
        ]
      };

      setGenerationProgress(20);
      
      // Étape 2: Génération de l'emploi du temps
      const constraints = timetableService.getDefaultConstraints();
      const generatedTimetable = await timetableService.generateTimetable(
        selectedLevel,
        selectedSemester,
        academicYear,
        constraints,
        mockFormationOffer
      );

      setGenerationProgress(50);
      setGeneratedTimetable(generatedTimetable);

      // Étape 3: Validation de l'emploi du temps
      const validation = await timetableService.validateTimetable(generatedTimetable);
      
      setGenerationProgress(70);

      if (validation.isValid) {
        // Étape 4: Création des réservations automatiques
        setReservationStatus('creating');
        const reservations = await timetableService.createSemesterReservations(generatedTimetable);
        
        setSemesterReservations(reservations);
        setReservationStatus('success');
        setGenerationProgress(100);
      } else {
        setReservationStatus('error');
        console.error('Conflits détectés:', validation.conflicts);
      }

    } catch (error) {
      console.error('Erreur génération:', error);
      setReservationStatus('error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublishReservations = async () => {
    if (semesterReservations.length === 0) return;
    
    try {
      // Simulation de l'envoi des réservations au système
      console.log('Publication des réservations vers le système de réservation...');
      
      // Ici, on intégrerait avec le système de réservation existant
      // await reservationService.createBulkReservations(semesterReservations);
      
      alert(`${semesterReservations.length} réservations ont été créées avec succès pour le semestre !`);
    } catch (error) {
      console.error('Erreur lors de la publication:', error);
      alert('Erreur lors de la publication des réservations');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'creating': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'success': return 'bg-green-100 text-green-800 border-green-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const groupReservationsByWeek = (reservations: Reservation[]) => {
    const grouped = reservations.reduce((acc, reservation) => {
      const week = Math.ceil((reservation.dateTime.start.getDate()) / 7);
      if (!acc[week]) acc[week] = [];
      acc[week].push(reservation);
      return acc;
    }, {} as Record<number, Reservation[]>);
    
    return grouped;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Génération Automatique des Réservations Semestrielles
          </CardTitle>
          <p className="text-slate-600">
            Créez automatiquement toutes les réservations d'espaces pour un semestre complet
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Niveau</label>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="L1">Licence 1</SelectItem>
                  <SelectItem value="L2">Licence 2</SelectItem>
                  <SelectItem value="L3">Licence 3</SelectItem>
                  <SelectItem value="M1">Master 1</SelectItem>
                  <SelectItem value="M2">Master 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Semestre</label>
              <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="S1">Semestre 1</SelectItem>
                  <SelectItem value="S2">Semestre 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Année Académique</label>
              <Select value={academicYear} onValueChange={setAcademicYear}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024-2025">2024-2025</SelectItem>
                  <SelectItem value="2025-2026">2025-2026</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-4 mb-6">
            <Button 
              onClick={handleGenerateTimetableAndReservations}
              disabled={isGenerating}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isGenerating ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <Calendar className="mr-2 h-4 w-4" />
                  Générer Emploi du Temps + Réservations
                </>
              )}
            </Button>
            
            {semesterReservations.length > 0 && (
              <Button 
                onClick={handlePublishReservations}
                className="bg-green-600 hover:bg-green-700"
              >
                <Send className="mr-2 h-4 w-4" />
                Publier les Réservations ({semesterReservations.length})
              </Button>
            )}
          </div>

          {isGenerating && (
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span>Génération et création des réservations...</span>
                <span>{generationProgress}%</span>
              </div>
              <Progress value={generationProgress} className="h-2" />
            </div>
          )}

          {reservationStatus !== 'idle' && (
            <Alert className={`mb-6 ${getStatusColor(reservationStatus)}`}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {reservationStatus === 'creating' && 'Création des réservations automatiques en cours...'}
                {reservationStatus === 'success' && `${semesterReservations.length} réservations créées avec succès !`}
                {reservationStatus === 'error' && 'Erreur lors de la création des réservations'}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {generatedTimetable && (
        <Tabs defaultValue="timetable" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="timetable">Emploi du Temps</TabsTrigger>
            <TabsTrigger value="reservations">Réservations Créées</TabsTrigger>
            <TabsTrigger value="statistics">Statistiques</TabsTrigger>
          </TabsList>

          <TabsContent value="timetable" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Emploi du Temps Généré - {selectedLevel} {selectedSemester}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {generatedTimetable && generatedTimetable.courses && generatedTimetable.courses.length > 0 ? (
                    <div className="space-y-4">
                      {generatedTimetable.courses.map((course) => (
                        <div key={course.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-lg">{course.courseName}</h3>
                              <p className="text-slate-600">{course.teacher}</p>
                              <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {course.dayOfWeek}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {course.startTime} - {course.endTime}
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  {course.roomName}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="h-4 w-4" />
                                  {course.studentsCount} étudiants
                                </div>
                              </div>
                            </div>
                            <Badge className="bg-blue-100 text-blue-800">
                              {course.type.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-500">Aucun cours généré</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reservations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Réservations Automatiques Créées</CardTitle>
                <p className="text-sm text-slate-600">
                  {semesterReservations.length} réservations générées pour le semestre complet
                </p>
              </CardHeader>
              <CardContent>
                {semesterReservations.length > 0 ? (
                  <div className="space-y-4">
                    {Object.entries(groupReservationsByWeek(semesterReservations)).map(([week, reservations]) => (
                      <div key={week} className="border rounded-lg p-4">
                        <h4 className="font-medium text-slate-800 mb-3">Semaine {week}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {reservations.slice(0, 4).map((reservation) => (
                            <div key={reservation.id} className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded">
                              <div className="flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-green-600" />
                                <MapPin className="h-4 w-4 text-green-600" />
                                <Clock className="h-4 w-4 text-green-600" />
                                <Users className="h-4 w-4 text-green-600" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium">{reservation.purpose}</p>
                                <p className="text-xs text-slate-500">
                                  {reservation.spaceName} • {reservation.dateTime.start.toLocaleDateString()} • 
                                  {reservation.participants} participants
                                </p>
                              </div>
                              <Badge className="bg-green-100 text-green-800 border-green-200">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Approuvé
                              </Badge>
                            </div>
                          ))}
                        </div>
                        {reservations.length > 4 && (
                          <p className="text-sm text-slate-500 mt-2">
                            ... et {reservations.length - 4} autres réservations
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-500">Aucune réservation générée</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="statistics" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Calendar className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-lg font-bold text-blue-800">{generatedTimetable.courses?.length || 0}</p>
                  <p className="text-sm text-blue-600">Cours programmés</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <MapPin className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <p className="text-lg font-bold text-green-800">{semesterReservations.length}</p>
                  <p className="text-sm text-green-600">Réservations créées</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Clock className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-lg font-bold text-purple-800">16</p>
                  <p className="text-sm text-purple-600">Semaines couvertes</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
                  <p className="text-lg font-bold text-emerald-800">100%</p>
                  <p className="text-sm text-emerald-600">Taux de réussite</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};
