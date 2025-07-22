import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  GraduationCap, 
  Plus, 
  Calendar, 
  Clock, 
  MapPin, 
  User,
  Save,
  Eye,
  Settings,
  BookOpen
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Formation {
  id: string;
  name: string;
  level: 'licence' | 'master' | 'doctorat';
  specialties: string[];
  semester: string;
  totalHours: number;
  status: 'draft' | 'active' | 'validated';
}

interface TimetableEntry {
  id: string;
  formationId: string;
  subject: string;
  teacher: string;
  type: 'cours' | 'td' | 'tp' | 'exam';
  day: string;
  startTime: string;
  endTime: string;
  room: string;
  group?: string;
  duration: number;
}

interface Props {
  onStatsUpdate: (stats: any) => void;
  systemStatus: any;
}

export const FormationTimetableManager = ({ onStatsUpdate, systemStatus }: Props) => {
  const { toast } = useToast();
  const [selectedFormation, setSelectedFormation] = useState<string>("");
  const [activeTab, setActiveTab] = useState("overview");
  
  const [formations] = useState<Formation[]>([
    {
      id: "1",
      name: "Licence Informatique",
      level: "licence",
      specialties: ["Développement", "Réseaux", "Sécurité"],
      semester: "S1-2024",
      totalHours: 540,
      status: "active"
    },
    {
      id: "2", 
      name: "Master Intelligence Artificielle",
      level: "master",
      specialties: ["Machine Learning", "Deep Learning", "NLP"],
      semester: "S1-2024",
      totalHours: 420,
      status: "validated"
    },
    {
      id: "3",
      name: "Licence Mathématiques",
      level: "licence", 
      specialties: ["Analyse", "Algèbre", "Probabilités"],
      semester: "S1-2024",
      totalHours: 480,
      status: "draft"
    }
  ]);

  const [timetableEntries, setTimetableEntries] = useState<TimetableEntry[]>([
    {
      id: "1",
      formationId: "1",
      subject: "Programmation Java",
      teacher: "Dr. Bernard",
      type: "cours",
      day: "Lundi",
      startTime: "08:00",
      endTime: "10:00",
      room: "Amphi A",
      duration: 2
    },
    {
      id: "2",
      formationId: "1", 
      subject: "Base de Données",
      teacher: "Prof. Durand",
      type: "tp",
      day: "Mardi",
      startTime: "14:00",
      endTime: "16:00",
      room: "Lab Info 1",
      group: "Groupe A",
      duration: 2
    }
  ]);

  const [newEntry, setNewEntry] = useState<Partial<TimetableEntry>>({
    subject: "",
    teacher: "",
    type: "cours",
    day: "",
    startTime: "",
    endTime: "",
    room: "",
    group: ""
  });

  const handleAddTimetableEntry = () => {
    if (!selectedFormation || !newEntry.subject || !newEntry.teacher || !newEntry.day) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    const entry: TimetableEntry = {
      id: Date.now().toString(),
      formationId: selectedFormation,
      subject: newEntry.subject || "",
      teacher: newEntry.teacher || "",
      type: newEntry.type as any || "cours",
      day: newEntry.day || "",
      startTime: newEntry.startTime || "",
      endTime: newEntry.endTime || "",
      room: newEntry.room || "",
      group: newEntry.group,
      duration: calculateDuration(newEntry.startTime || "", newEntry.endTime || "")
    };

    setTimetableEntries(prev => [...prev, entry]);
    setNewEntry({
      subject: "",
      teacher: "",
      type: "cours",
      day: "",
      startTime: "",
      endTime: "",
      room: "",
      group: ""
    });

    toast({
      title: "Succès",
      description: "Créneau ajouté à l'emploi du temps"
    });
  };

  const calculateDuration = (start: string, end: string): number => {
    if (!start || !end) return 0;
    const startTime = new Date(`2024-01-01 ${start}`);
    const endTime = new Date(`2024-01-01 ${end}`);
    return (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
  };

  const getFormationEntries = (formationId: string) => {
    return timetableEntries.filter(entry => entry.formationId === formationId);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'validated':
        return <Badge className="bg-emerald-100 text-emerald-800">Validé</Badge>;
      case 'active':
        return <Badge className="bg-blue-100 text-blue-800">Actif</Badge>;
      default:
        return <Badge variant="outline">Brouillon</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      cours: "bg-purple-100 text-purple-800",
      td: "bg-blue-100 text-blue-800", 
      tp: "bg-emerald-100 text-emerald-800",
      exam: "bg-red-100 text-red-800"
    };
    return <Badge className={colors[type as keyof typeof colors]}>{type.toUpperCase()}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6" />
            Gestion des Emplois du Temps par Formation
          </CardTitle>
          <p className="text-muted-foreground">
            Saisie et organisation des emplois du temps pour chaque offre de formation
          </p>
        </CardHeader>
      </Card>

      {/* Sélection de formation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sélection de l'Offre de Formation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="formation-select">Formation</Label>
              <Select value={selectedFormation} onValueChange={setSelectedFormation}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une formation..." />
                </SelectTrigger>
                <SelectContent>
                  {formations.map((formation) => (
                    <SelectItem key={formation.id} value={formation.id}>
                      {formation.name} - {formation.semester}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedFormation && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label>Statut:</Label>
                  {getStatusBadge(formations.find(f => f.id === selectedFormation)?.status || "")}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total heures: {formations.find(f => f.id === selectedFormation)?.totalHours}h
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedFormation && (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="create">Saisie d'emploi du temps</TabsTrigger>
            <TabsTrigger value="manage">Gestion avancée</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Emploi du Temps Actuel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getFormationEntries(selectedFormation).length === 0 ? (
                    <div className="text-center p-8 text-muted-foreground">
                      <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Aucun créneau défini pour cette formation</p>
                      <p className="text-sm">Utilisez l'onglet "Saisie" pour commencer</p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {getFormationEntries(selectedFormation).map((entry) => (
                        <div key={entry.id} className="p-4 border rounded-lg bg-background">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{entry.subject}</h4>
                            {getTypeBadge(entry.type)}
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {entry.teacher}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {entry.day}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {entry.startTime} - {entry.endTime}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {entry.room}
                            </div>
                            {entry.group && (
                              <div className="col-span-2 md:col-span-4">
                                <Badge variant="outline" className="text-xs">{entry.group}</Badge>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Saisie d'un Nouveau Créneau
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="subject">Matière *</Label>
                    <Input
                      id="subject"
                      value={newEntry.subject || ""}
                      onChange={(e) => setNewEntry(prev => ({...prev, subject: e.target.value}))}
                      placeholder="Ex: Programmation Java"
                    />
                  </div>
                  <div>
                    <Label htmlFor="teacher">Enseignant *</Label>
                    <Input
                      id="teacher"
                      value={newEntry.teacher || ""}
                      onChange={(e) => setNewEntry(prev => ({...prev, teacher: e.target.value}))}
                      placeholder="Ex: Dr. Bernard"
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Type de cours</Label>
                    <Select 
                      value={newEntry.type || "cours"} 
                      onValueChange={(value) => setNewEntry(prev => ({...prev, type: value as any}))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cours">Cours</SelectItem>
                        <SelectItem value="td">TD</SelectItem>
                        <SelectItem value="tp">TP</SelectItem>
                        <SelectItem value="exam">Examen</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="day">Jour *</Label>
                    <Select 
                      value={newEntry.day || ""} 
                      onValueChange={(value) => setNewEntry(prev => ({...prev, day: value}))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir un jour" />
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
                    <Label htmlFor="startTime">Heure de début</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={newEntry.startTime || ""}
                      onChange={(e) => setNewEntry(prev => ({...prev, startTime: e.target.value}))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endTime">Heure de fin</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={newEntry.endTime || ""}
                      onChange={(e) => setNewEntry(prev => ({...prev, endTime: e.target.value}))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="room">Salle</Label>
                    <Input
                      id="room"
                      value={newEntry.room || ""}
                      onChange={(e) => setNewEntry(prev => ({...prev, room: e.target.value}))}
                      placeholder="Ex: Amphi A, Lab Info 1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="group">Groupe (optionnel)</Label>
                    <Input
                      id="group"
                      value={newEntry.group || ""}
                      onChange={(e) => setNewEntry(prev => ({...prev, group: e.target.value}))}
                      placeholder="Ex: Groupe A, TD1"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleAddTimetableEntry} className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Ajouter le créneau
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manage" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Gestion Avancée de la Formation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4">
                    <div className="text-center">
                      <BookOpen className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                      <h4 className="font-medium mb-2">Créneaux Total</h4>
                      <div className="text-2xl font-bold text-blue-600">
                        {getFormationEntries(selectedFormation).length}
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="p-4">
                    <div className="text-center">
                      <Clock className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                      <h4 className="font-medium mb-2">Heures Total</h4>
                      <div className="text-2xl font-bold text-purple-600">
                        {getFormationEntries(selectedFormation).reduce((total, entry) => total + entry.duration, 0)}h
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="p-4">
                    <div className="text-center">
                      <User className="h-8 w-8 mx-auto mb-2 text-emerald-600" />
                      <h4 className="font-medium mb-2">Enseignants</h4>
                      <div className="text-2xl font-bold text-emerald-600">
                        {new Set(getFormationEntries(selectedFormation).map(entry => entry.teacher)).size}
                      </div>
                    </div>
                  </Card>
                </div>
                
                <div className="pt-4 space-y-2">
                  <Button variant="outline" className="w-full">
                    Exporter l'emploi du temps
                  </Button>
                  <Button variant="outline" className="w-full">
                    Dupliquer vers un autre semestre
                  </Button>
                  <Button variant="outline" className="w-full">
                    Générer un rapport de charge
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};