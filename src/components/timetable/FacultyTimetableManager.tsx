import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { SemesterManager, Semester } from "./SemesterManager";
import { ConflictDetector } from "./ConflictDetector";
import { academicConfigService } from "../../services/academicConfigService";
import { FormationOffer, Specialty } from "../../types/academic";
import { 
  Calendar, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Users,
  MapPin,
  Clock,
  Save,
  BookOpen,
  Zap,
  Building,
  CheckCircle,
  CalendarDays,
  AlertTriangle
} from "lucide-react";

interface TimetableEvent {
  id: string;
  subject: string;
  type: 'cours' | 'td' | 'tp' | 'examen';
  teacher: string;
  formation: string;
  level: string;
  semester: string;
  group: string;
  room: string;
  day: string;
  startTime: string;
  endTime: string;
  students: number;
  isValidated: boolean;
  hasReservation: boolean;
}

interface TimetableFormation {
  id: string;
  name: string;
  level: string;
  specialtyName: string;
  totalStudents: number;
  semesters: string[];
}

interface OptimizationModel {
  id: string;
  name: string;
  description: string;
  criteria: string[];
}

// Les formations seront chargées dynamiquement depuis le service académique

const optimizationModels: OptimizationModel[] = [
  {
    id: "1",
    name: "Optimisation par disponibilité enseignants",
    description: "Minimise les conflits d'horaires des enseignants",
    criteria: ["Disponibilité enseignants", "Répartition équilibrée"]
  },
  {
    id: "2", 
    name: "Optimisation par capacité salles",
    description: "Maximise l'utilisation des infrastructures",
    criteria: ["Capacité salles", "Équipements requis"]
  },
  {
    id: "3",
    name: "Optimisation équilibrée",
    description: "Balance tous les critères",
    criteria: ["Enseignants", "Salles", "Étudiants", "Horaires"]
  }
];

const mockTimetableEvents: TimetableEvent[] = [
  {
    id: "1",
    subject: "Microéconomie",
    type: "cours",
    teacher: "Dr. Martin",
    formation: "Licence Économie",
    level: "L1",
    semester: "S1",
    group: "Groupe A",
    room: "Amphi 1",
    day: "Lundi",
    startTime: "08:00",
    endTime: "10:00",
    students: 60,
    isValidated: true,
    hasReservation: true
  },
  {
    id: "2",
    subject: "Statistiques",
    type: "td",
    teacher: "Dr. Dubois",
    formation: "Licence Économie", 
    level: "L2",
    semester: "S3",
    group: "Groupe B",
    room: "Salle 201",
    day: "Mardi",
    startTime: "14:00",
    endTime: "16:00",
    students: 25,
    isValidated: false,
    hasReservation: false
  }
];

export const FacultyTimetableManager = () => {
  const [events, setEvents] = useState<TimetableEvent[]>(mockTimetableEvents);
  const [formations, setFormations] = useState<TimetableFormation[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFormation, setSelectedFormation] = useState<string>("all");
  const [selectedSemester, setSelectedSemester] = useState<string>("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TimetableEvent | null>(null);
  const [showOptimization, setShowOptimization] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [activeTab, setActiveTab] = useState("timetables");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Charger les données au montage du composant
  useEffect(() => {
    loadFormationsData();
  }, []);

  const loadFormationsData = async () => {
    setLoading(true);
    try {
      const [formationsData, specialtiesData] = await Promise.all([
        academicConfigService.getFormationsForAssignment(),
        academicConfigService.getSpecialties()
      ]);
      
      // Transformer les données pour le timetable
      const timetableFormations: TimetableFormation[] = formationsData.map(f => ({
        id: f.id,
        name: f.name,
        level: f.level,
        specialtyName: f.specialtyName,
        totalStudents: 30, // valeur par défaut
        semesters: f.semesters
      }));
      
      setFormations(timetableFormations);
      setSpecialties(specialtiesData);
    } catch (error) {
      console.error('Erreur lors du chargement des formations:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les formations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Form states
  const [newEvent, setNewEvent] = useState<Partial<TimetableEvent>>({
    subject: "",
    type: "cours",
    teacher: "",
    formation: "",
    level: "",
    semester: "",
    group: "",
    room: "",
    day: "Lundi",
    startTime: "08:00",
    endTime: "10:00",
    students: 0,
    isValidated: false,
    hasReservation: false
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'cours': return 'bg-blue-100 text-blue-800';
      case 'td': return 'bg-green-100 text-green-800';
      case 'tp': return 'bg-purple-100 text-purple-800';
      case 'examen': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.group.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFormation = selectedFormation === "all" || 
                            `${event.formation} ${event.level}` === selectedFormation;
    const matchesSemester = selectedSemester === "all" || event.semester === selectedSemester;
    return matchesSearch && matchesFormation && matchesSemester;
  });

  const handleSaveEvent = () => {
    if (!newEvent.subject || !newEvent.teacher || !newEvent.formation || !newEvent.semester) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires (y compris le semestre)",
        variant: "destructive"
      });
      return;
    }

    const eventToSave: TimetableEvent = {
      ...newEvent as TimetableEvent,
      id: editingEvent ? editingEvent.id : Date.now().toString()
    };

    if (editingEvent) {
      setEvents(prev => prev.map(e => e.id === editingEvent.id ? eventToSave : e));
      toast({
        title: "Succès",
        description: "Emploi du temps modifié avec succès"
      });
    } else {
      setEvents(prev => [...prev, eventToSave]);
      toast({
        title: "Succès",
        description: "Emploi du temps ajouté avec succès"
      });
    }

    setShowAddDialog(false);
    setEditingEvent(null);
      setNewEvent({
        subject: "",
        type: "cours",
        teacher: "",
        formation: "",
        level: "",
        semester: "",
        group: "",
        room: "",
        day: "Lundi",
        startTime: "08:00",
        endTime: "10:00",
        students: 0,
        isValidated: false,
        hasReservation: false
      });
  };

  const handleValidateEvent = (eventId: string) => {
    setEvents(prev => 
      prev.map(e => 
        e.id === eventId 
          ? { ...e, isValidated: true } 
          : e
      )
    );
    toast({
      title: "Validation",
      description: "Emploi du temps validé"
    });
  };

  const handleCreateReservations = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (!event || !event.isValidated) {
      toast({
        title: "Erreur",
        description: "L'emploi du temps doit être validé avant de créer les réservations",
        variant: "destructive"
      });
      return;
    }

    setEvents(prev => 
      prev.map(e => 
        e.id === eventId 
          ? { ...e, hasReservation: true } 
          : e
      )
    );
    
    toast({
      title: "Réservations créées automatiquement",
      description: `Réservations de ${event.room} créées pour ${event.subject} du début à la fin du semestre actif. Toutes les semaines du semestre sont réservées automatiquement.`
    });
  };

  const handleDeleteReservations = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    setEvents(prev => 
      prev.map(e => 
        e.id === eventId 
          ? { ...e, hasReservation: false } 
          : e
      )
    );
    
    toast({
      title: "Réservations supprimées automatiquement",
      description: `Toutes les réservations semestrielles de ${event?.room} pour ${event?.subject} ont été supprimées automatiquement`
    });
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
    toast({
      title: "Suppression",
      description: "Emploi du temps supprimé"
    });
  };

  const handleOptimizeSchedule = () => {
    if (!selectedModel) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un modèle d'optimisation",
        variant: "destructive"
      });
      return;
    }

    // Simulation d'optimisation
    toast({
      title: "Optimisation lancée",
      description: "L'optimisation de l'emploi du temps est en cours..."
    });

    setTimeout(() => {
      toast({
        title: "Optimisation terminée",
        description: "L'emploi du temps a été optimisé selon le modèle sélectionné"
      });
      setShowOptimization(false);
    }, 2000);
  };

  const EventCard = ({ event }: { event: TimetableEvent }) => (
    <div className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-slate-900">{event.subject}</h4>
          <Badge className={getTypeColor(event.type)}>{event.type.toUpperCase()}</Badge>
        </div>
        <div className="flex items-center gap-1">
          {event.isValidated && <CheckCircle className="h-4 w-4 text-green-600" />}
          {event.hasReservation && <Building className="h-4 w-4 text-blue-600" />}
        </div>
      </div>
      
      <div className="space-y-2 text-sm text-slate-600 mb-4">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span>{event.formation} {event.level} - {event.group}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span>{event.room}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>{event.day} - {event.startTime} à {event.endTime}</span>
        </div>
        <div className="text-slate-500">
          {event.teacher} • {event.students} étudiants
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button size="sm" variant="outline" onClick={() => {
          setEditingEvent(event);
          setNewEvent(event);
          setShowAddDialog(true);
        }}>
          <Edit className="h-4 w-4" />
        </Button>
        
        {!event.isValidated && (
          <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700"
                  onClick={() => handleValidateEvent(event.id)}>
            <CheckCircle className="h-4 w-4" />
          </Button>
        )}
        
        {event.isValidated && !event.hasReservation && (
          <Button size="sm" variant="outline" className="text-blue-600 hover:text-blue-700"
                  onClick={() => handleCreateReservations(event.id)}>
            <Building className="h-4 w-4" />
          </Button>
        )}
        
        {event.hasReservation && (
          <Button size="sm" variant="outline" className="text-orange-600 hover:text-orange-700"
                  onClick={() => handleDeleteReservations(event.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
        
        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700"
                onClick={() => handleDeleteEvent(event.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  // Options pour les formations
  const formationOptions = formations.map(f => ({
    value: `${f.name} ${f.level}`,
    label: `${f.name} ${f.level} - ${f.specialtyName} (${f.totalStudents} étudiants)`
  }));

  // Options pour les semestres (basées sur la formation sélectionnée)
  const getSemesterOptions = () => {
    if (selectedFormation === "all") {
      // Retourner tous les semestres possibles
      const allSemesters = new Set<string>();
      formations.forEach(f => f.semesters.forEach(s => allSemesters.add(s)));
      return Array.from(allSemesters).sort();
    }
    
    const formation = formations.find(f => `${f.name} ${f.level}` === selectedFormation);
    return formation ? formation.semesters : [];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            Gestion des Emplois du Temps - Offres de Formation
          </CardTitle>
          <p className="text-slate-600">
            Saisie des emplois du temps avec gestion des semestres et détection automatique des conflits
          </p>
        </CardHeader>
      </Card>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="timetables" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Emplois du Temps
          </TabsTrigger>
          <TabsTrigger value="semesters" className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            Semestres
          </TabsTrigger>
          <TabsTrigger value="conflicts" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Conflits
          </TabsTrigger>
        </TabsList>

        <TabsContent value="timetables" className="space-y-6">
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{events.length}</p>
                  <p className="text-sm text-slate-600">Total Cours</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {events.filter(e => e.isValidated).length}
                  </p>
                  <p className="text-sm text-slate-600">Validés</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {events.filter(e => e.hasReservation).length}
                  </p>
                  <p className="text-sm text-slate-600">Avec Réservations</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">
                    {new Set(events.map(e => e.teacher)).size}
                  </p>
                  <p className="text-sm text-slate-600">Enseignants</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Actions */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4 items-center flex-wrap">
                <div className="flex items-center gap-2 flex-1 min-w-64">
                  <Search className="h-4 w-4 text-slate-500" />
                  <Input
                    placeholder="Rechercher un cours..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={selectedFormation} onValueChange={setSelectedFormation}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Formation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les formations</SelectItem>
                    {formationOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={() => setShowAddDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter Cours
                </Button>
                <Button variant="outline" onClick={() => setShowOptimization(true)}>
                  <Zap className="h-4 w-4 mr-2" />
                  Optimiser
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Course List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Emplois du Temps des Formations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
              
              {filteredEvents.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  Aucun cours trouvé
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="semesters" className="space-y-6">
          <SemesterManager />
        </TabsContent>

        <TabsContent value="conflicts" className="space-y-6">
          <ConflictDetector 
            events={events} 
            onResolveConflict={(conflictId, resolution) => {
              toast({
                title: "Conflit résolu",
                description: `Conflit ${conflictId} résolu par ${resolution}`
              });
            }}
          />
        </TabsContent>
      </Tabs>

      {/* Add/Edit Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingEvent ? "Modifier" : "Ajouter"} un Cours
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="subject">Matière *</Label>
              <Input
                id="subject"
                value={newEvent.subject}
                onChange={(e) => setNewEvent(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="Ex: Microéconomie"
              />
            </div>
            <div>
              <Label htmlFor="type">Type de cours</Label>
              <Select 
                value={newEvent.type} 
                onValueChange={(value: 'cours' | 'td' | 'tp' | 'examen') => 
                  setNewEvent(prev => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cours">Cours magistral</SelectItem>
                  <SelectItem value="td">Travaux dirigés</SelectItem>
                  <SelectItem value="tp">Travaux pratiques</SelectItem>
                  <SelectItem value="examen">Examen</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="teacher">Enseignant *</Label>
              <Input
                id="teacher"
                value={newEvent.teacher}
                onChange={(e) => setNewEvent(prev => ({ ...prev, teacher: e.target.value }))}
                placeholder="Ex: Dr. Martin"
              />
            </div>
            <div>
              <Label htmlFor="formation">Formation *</Label>
              <Select 
                value={newEvent.formation} 
                onValueChange={(value) => setNewEvent(prev => ({ ...prev, formation: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une formation" />
                </SelectTrigger>
                <SelectContent>
                  {formations.map(formation => (
                    <SelectItem key={formation.id} value={formation.name}>
                      {formation.name} - {formation.specialtyName}
                    </SelectItem>
                  ))}
                </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="semester">Semestre *</Label>
                  <Select 
                    value={newEvent.semester} 
                    onValueChange={(value) => setNewEvent(prev => ({ ...prev, semester: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir un semestre" />
                    </SelectTrigger>
                    <SelectContent>
                      {getSemesterOptions().map(semester => (
                        <SelectItem key={semester} value={semester}>
                          {semester}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="level">Niveau</Label>
              <Select 
                value={newEvent.level} 
                onValueChange={(value) => setNewEvent(prev => ({ ...prev, level: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Niveau" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="L1">L1</SelectItem>
                  <SelectItem value="L2">L2</SelectItem>
                  <SelectItem value="L3">L3</SelectItem>
                  <SelectItem value="M1">M1</SelectItem>
                  <SelectItem value="M2">M2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="group">Groupe</Label>
              <Input
                id="group"
                value={newEvent.group}
                onChange={(e) => setNewEvent(prev => ({ ...prev, group: e.target.value }))}
                placeholder="Ex: Groupe A"
              />
            </div>
            <div>
              <Label htmlFor="room">Salle</Label>
              <Select 
                value={newEvent.room} 
                onValueChange={(value) => setNewEvent(prev => ({ ...prev, room: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une salle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Amphi 1">Amphi 1 (200 places)</SelectItem>
                  <SelectItem value="Amphi 2">Amphi 2 (150 places)</SelectItem>
                  <SelectItem value="Salle 201">Salle 201 (50 places)</SelectItem>
                  <SelectItem value="Salle 202">Salle 202 (40 places)</SelectItem>
                  <SelectItem value="Lab Info 1">Lab Info 1 (30 places)</SelectItem>
                  <SelectItem value="Lab Info 2">Lab Info 2 (25 places)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="day">Jour</Label>
              <Select 
                value={newEvent.day} 
                onValueChange={(value) => setNewEvent(prev => ({ ...prev, day: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Lundi">Lundi</SelectItem>
                  <SelectItem value="Mardi">Mardi</SelectItem>
                  <SelectItem value="Mercredi">Mercredi</SelectItem>
                  <SelectItem value="Jeudi">Jeudi</SelectItem>
                  <SelectItem value="Vendredi">Vendredi</SelectItem>
                  <SelectItem value="Samedi">Samedi</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="startTime">Heure début</Label>
              <Input
                id="startTime"
                type="time"
                value={newEvent.startTime}
                onChange={(e) => setNewEvent(prev => ({ ...prev, startTime: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="endTime">Heure fin</Label>
              <Input
                id="endTime"
                type="time"
                value={newEvent.endTime}
                onChange={(e) => setNewEvent(prev => ({ ...prev, endTime: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="students">Nombre d'étudiants</Label>
              <Input
                id="students"
                type="number"
                value={newEvent.students}
                onChange={(e) => setNewEvent(prev => ({ ...prev, students: parseInt(e.target.value) || 0 }))}
                placeholder="Ex: 25"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="isValidated"
                checked={newEvent.isValidated}
                onCheckedChange={(checked) => setNewEvent(prev => ({ ...prev, isValidated: checked }))}
              />
              <Label htmlFor="isValidated">Cours validé</Label>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleSaveEvent}>
              {editingEvent ? "Modifier" : "Ajouter"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Optimization Dialog */}
      <Dialog open={showOptimization} onOpenChange={setShowOptimization}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Optimisation de l'Emploi du Temps</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Modèle d'optimisation</Label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un modèle" />
                </SelectTrigger>
                <SelectContent>
                  {optimizationModels.map(model => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedModel && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">
                  {optimizationModels.find(m => m.id === selectedModel)?.name}
                </h4>
                <p className="text-sm text-blue-800 mb-3">
                  {optimizationModels.find(m => m.id === selectedModel)?.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {optimizationModels.find(m => m.id === selectedModel)?.criteria.map(criterion => (
                    <Badge key={criterion} variant="secondary" className="text-xs">
                      {criterion}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowOptimization(false)}>
                Annuler
              </Button>
              <Button onClick={handleOptimizeSchedule}>
                <Zap className="h-4 w-4 mr-2" />
                Lancer l'Optimisation
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};