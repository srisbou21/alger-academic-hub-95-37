import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Building2, 
  Calendar, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  MapPin,
  Play,
  Pause,
  RotateCcw,
  Settings,
  Target
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Semester {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

interface ReservationJob {
  id: string;
  formationName: string;
  semester: string;
  totalSlots: number;
  processedSlots: number;
  status: 'pending' | 'running' | 'completed' | 'failed';
  conflicts: number;
  duration: number;
}

interface AutoReservationStats {
  totalReservations: number;
  successRate: number;
  conflictsDetected: number;
  averageProcessingTime: number;
}

interface Props {
  onReservationsUpdate: (count: number) => void;
}

export const AutoReservationEngine = ({ onReservationsUpdate }: Props) => {
  const { toast } = useToast();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentJob, setCurrentJob] = useState<ReservationJob | null>(null);
  
  const [semesters] = useState<Semester[]>([
    {
      id: "1",
      name: "Semestre Automne 2024",
      startDate: "2024-09-01",
      endDate: "2024-12-20",
      isActive: true
    },
    {
      id: "2", 
      name: "Semestre Printemps 2025",
      startDate: "2025-01-15",
      endDate: "2025-05-30",
      isActive: false
    }
  ]);

  const [selectedSemester, setSelectedSemester] = useState("1");
  const [selectedFormations, setSelectedFormations] = useState<string[]>([]);
  
  const formations = [
    { id: "1", name: "Licence Informatique", validated: true, slots: 156 },
    { id: "2", name: "Master IA", validated: true, slots: 98 },
    { id: "3", name: "Licence Mathématiques", validated: false, slots: 124 }
  ];

  const [stats, setStats] = useState<AutoReservationStats>({
    totalReservations: 2847,
    successRate: 99.2,
    conflictsDetected: 8,
    averageProcessingTime: 3.4
  });

  const [reservationHistory, setReservationHistory] = useState<ReservationJob[]>([
    {
      id: "1",
      formationName: "Master IA", 
      semester: "Automne 2024",
      totalSlots: 98,
      processedSlots: 98,
      status: "completed",
      conflicts: 2,
      duration: 187
    },
    {
      id: "2",
      formationName: "Licence Informatique",
      semester: "Automne 2024", 
      totalSlots: 156,
      processedSlots: 156,
      status: "completed",
      conflicts: 0,
      duration: 234
    }
  ]);

  const startAutoReservation = async () => {
    if (selectedFormations.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner au moins une formation",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    for (const formationId of selectedFormations) {
      const formation = formations.find(f => f.id === formationId);
      if (!formation) continue;

      const job: ReservationJob = {
        id: Date.now().toString(),
        formationName: formation.name,
        semester: semesters.find(s => s.id === selectedSemester)?.name || "",
        totalSlots: formation.slots,
        processedSlots: 0,
        status: "running",
        conflicts: 0,
        duration: 0
      };

      setCurrentJob(job);

      // Simulation du processus de réservation
      const startTime = Date.now();
      for (let i = 0; i <= formation.slots; i += 5) {
        setCurrentJob(prev => prev ? {
          ...prev,
          processedSlots: Math.min(i, formation.slots)
        } : null);
        
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      const endTime = Date.now();
      const finalJob: ReservationJob = {
        ...job,
        processedSlots: formation.slots,
        status: "completed",
        conflicts: Math.floor(Math.random() * 3),
        duration: endTime - startTime
      };

      setReservationHistory(prev => [finalJob, ...prev]);
      
      // Mise à jour des stats
      setStats(prev => ({
        ...prev,
        totalReservations: prev.totalReservations + formation.slots
      }));
      
      onReservationsUpdate(stats.totalReservations + formation.slots);

      toast({
        title: "Réservations créées",
        description: `${formation.slots} réservations créées pour ${formation.name}`
      });
    }

    setIsProcessing(false);
    setCurrentJob(null);
    setSelectedFormations([]);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-emerald-100 text-emerald-800">Terminé</Badge>;
      case 'running':
        return <Badge className="bg-blue-100 text-blue-800">En cours</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Échec</Badge>;
      default:
        return <Badge variant="outline">En attente</Badge>;
    }
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    return minutes > 0 ? `${minutes}min ${seconds % 60}s` : `${seconds}s`;
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-6 w-6" />
            Moteur de Réservation Automatique
          </CardTitle>
          <p className="text-muted-foreground">
            Création automatique de toutes les réservations de salles pour la durée complète du semestre
          </p>
        </CardHeader>
      </Card>

      {/* Statistiques globales */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Statistiques du Système</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-primary/5 rounded-lg">
              <div className="text-2xl font-bold text-primary mb-1">
                {stats.totalReservations.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total réservations</div>
            </div>
            <div className="text-center p-4 bg-emerald-50 rounded-lg">
              <div className="text-2xl font-bold text-emerald-600 mb-1">{stats.successRate}%</div>
              <div className="text-sm text-muted-foreground">Taux de succès</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600 mb-1">{stats.conflictsDetected}</div>
              <div className="text-sm text-muted-foreground">Conflits détectés</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">{stats.averageProcessingTime}s</div>
              <div className="text-sm text-muted-foreground">Temps moyen</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="create">Nouvelle Réservation</TabsTrigger>
          <TabsTrigger value="monitor">Monitoring</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                Lancement des Réservations Automatiques
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="semester">Semestre cible</Label>
                  <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {semesters.map((semester) => (
                        <SelectItem key={semester.id} value={semester.id}>
                          {semester.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="text-xs text-muted-foreground mt-1">
                    {semesters.find(s => s.id === selectedSemester)?.startDate} - {semesters.find(s => s.id === selectedSemester)?.endDate}
                  </div>
                </div>
              </div>

              <div>
                <Label>Formations à traiter</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                  {formations.map((formation) => (
                    <div 
                      key={formation.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedFormations.includes(formation.id) ? 'border-primary bg-primary/5' : 'hover:border-muted-foreground'
                      } ${!formation.validated ? 'opacity-50' : ''}`}
                      onClick={() => {
                        if (!formation.validated) return;
                        setSelectedFormations(prev => 
                          prev.includes(formation.id) 
                            ? prev.filter(id => id !== formation.id)
                            : [...prev, formation.id]
                        );
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{formation.name}</span>
                        <div className="flex items-center gap-2">
                          {formation.validated ? (
                            <Badge className="bg-emerald-100 text-emerald-800">Validé</Badge>
                          ) : (
                            <Badge variant="outline">Non validé</Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formation.slots} créneaux à réserver
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Important:</strong> Cette opération créera automatiquement toutes les réservations de salles 
                  pour la durée complète du semestre. Assurez-vous que les emplois du temps sont validés.
                </AlertDescription>
              </Alert>

              <Button 
                onClick={startAutoReservation}
                disabled={isProcessing || selectedFormations.length === 0}
                className="w-full"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Réservation en cours...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Lancer les Réservations Automatiques
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitor" className="space-y-4">
          {currentJob ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Réservation en Cours
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{currentJob.formationName}</h4>
                    <p className="text-sm text-muted-foreground">{currentJob.semester}</p>
                  </div>
                  {getStatusBadge(currentJob.status)}
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Progression</span>
                    <span className="text-sm">{currentJob.processedSlots}/{currentJob.totalSlots}</span>
                  </div>
                  <Progress 
                    value={(currentJob.processedSlots / currentJob.totalSlots) * 100} 
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-2 bg-muted rounded">
                    <div className="text-lg font-bold">{currentJob.processedSlots}</div>
                    <div className="text-xs text-muted-foreground">Traités</div>
                  </div>
                  <div className="p-2 bg-muted rounded">
                    <div className="text-lg font-bold">{currentJob.totalSlots - currentJob.processedSlots}</div>
                    <div className="text-xs text-muted-foreground">Restants</div>
                  </div>
                  <div className="p-2 bg-muted rounded">
                    <div className="text-lg font-bold">{currentJob.conflicts}</div>
                    <div className="text-xs text-muted-foreground">Conflits</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center p-8">
                <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">Aucune réservation en cours</p>
                <p className="text-sm text-muted-foreground">Lancez une nouvelle réservation pour voir la progression</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5" />
                Historique des Réservations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reservationHistory.length === 0 ? (
                  <div className="text-center p-8 text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Aucun historique disponible</p>
                  </div>
                ) : (
                  reservationHistory.map((job) => (
                    <div key={job.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-medium">{job.formationName}</h4>
                          <p className="text-sm text-muted-foreground">{job.semester}</p>
                        </div>
                        {getStatusBadge(job.status)}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Créneaux:</span>
                          <div className="font-medium">{job.totalSlots}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Conflits:</span>
                          <div className="font-medium">{job.conflicts}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Durée:</span>
                          <div className="font-medium">{formatDuration(job.duration)}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Succès:</span>
                          <div className="font-medium">
                            {Math.round(((job.totalSlots - job.conflicts) / job.totalSlots) * 100)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};