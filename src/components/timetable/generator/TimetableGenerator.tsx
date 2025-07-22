import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Calendar, 
  Play, 
  Pause, 
  Square, 
  RefreshCw,
  Clock, 
  Users, 
  Building,
  CheckCircle,
  AlertTriangle,
  Zap,
  Settings,
  Download,
  Eye
} from "lucide-react";

interface GenerationStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  progress: number;
  duration?: number;
  details?: string;
}

export const TimetableGenerator = () => {
  const [selectedFormation, setSelectedFormation] = useState<string>('');
  const [selectedSemester, setSelectedSemester] = useState<string>('');
  const [generationMode, setGenerationMode] = useState<'auto' | 'manual'>('auto');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  
  const [steps, setSteps] = useState<GenerationStep[]>([
    {
      id: '1',
      name: 'Analyse des contraintes',
      description: 'Analyse des contraintes de formation et d\'infrastructure',
      status: 'pending',
      progress: 0
    },
    {
      id: '2',
      name: 'Allocation des ressources',
      description: 'Attribution des salles et équipements requis',
      status: 'pending',
      progress: 0
    },
    {
      id: '3',
      name: 'Génération initiale',
      description: 'Création d\'un emploi du temps de base',
      status: 'pending',
      progress: 0
    },
    {
      id: '4',
      name: 'Optimisation',
      description: 'Application des algorithmes d\'optimisation',
      status: 'pending',
      progress: 0
    },
    {
      id: '5',
      name: 'Validation',
      description: 'Vérification des contraintes et conflits',
      status: 'pending',
      progress: 0
    },
    {
      id: '6',
      name: 'Finalisation',
      description: 'Préparation pour validation manuelle',
      status: 'pending',
      progress: 0
    }
  ]);

  const formations = [
    { id: '1', name: 'Licence Informatique', code: 'L-INFO' },
    { id: '2', name: 'Master Informatique', code: 'M-INFO' },
    { id: '3', name: 'Licence Mathématiques', code: 'L-MATH' }
  ];

  const semesters = [
    { id: '2024-1', name: 'Semestre 1 - 2024/2025', period: 'Septembre 2024 - Janvier 2025' },
    { id: '2024-2', name: 'Semestre 2 - 2024/2025', period: 'Février 2025 - Juin 2025' }
  ];

  // Mock data with complete properties
  const mockSections = [{
    id: '1',
    name: 'Section A',
    code: 'L-INFO-A',
    capacity: 50,
    currentEnrollment: 45,
    specialtyId: '1',
    groups: [],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }];

  const mockGroups = [
    { 
      id: '1', 
      name: 'Groupe 1', 
      code: 'G1', 
      sectionId: '1', 
      capacity: 25, 
      currentEnrollment: 23,
      type: 'td' as const,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    { 
      id: '2', 
      name: 'TP Lab', 
      code: 'TP1', 
      sectionId: '1', 
      capacity: 15, 
      currentEnrollment: 14,
      type: 'tp' as const,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  const handleStartGeneration = () => {
    setIsGenerating(true);
    setGenerationProgress(0);
    
    // Simuler la génération étape par étape
    simulateGeneration();
  };

  const simulateGeneration = async () => {
    const newSteps = [...steps];
    
    for (let i = 0; i < newSteps.length; i++) {
      // Démarrer l'étape
      newSteps[i].status = 'running';
      setSteps([...newSteps]);
      
      // Simuler le progrès de l'étape
      for (let progress = 0; progress <= 100; progress += 10) {
        newSteps[i].progress = progress;
        setSteps([...newSteps]);
        setGenerationProgress(((i * 100) + progress) / newSteps.length);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // Terminer l'étape
      newSteps[i].status = 'completed';
      newSteps[i].duration = Math.floor(Math.random() * 3000) + 1000; // 1-4 secondes
      setSteps([...newSteps]);
    }
    
    setIsGenerating(false);
    setGenerationProgress(100);
  };

  const handleStopGeneration = () => {
    setIsGenerating(false);
    // Réinitialiser les étapes
    setSteps(steps.map(step => ({ ...step, status: 'pending', progress: 0 })));
    setGenerationProgress(0);
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'running': return <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-emerald-600" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const canStartGeneration = selectedFormation && selectedSemester && !isGenerating;

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Générateur d'Emplois du Temps Intelligent
          </CardTitle>
          <p className="text-muted-foreground">
            Génération automatique d'emplois du temps optimisés avec gestion des contraintes
          </p>
        </CardHeader>
      </Card>

      {/* Configuration de génération */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuration de la Génération
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="formation">Formation à traiter</Label>
              <Select value={selectedFormation} onValueChange={setSelectedFormation}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une formation" />
                </SelectTrigger>
                <SelectContent>
                  {formations.map(formation => (
                    <SelectItem key={formation.id} value={formation.id}>
                      {formation.name} ({formation.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="semester">Semestre</Label>
              <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un semestre" />
                </SelectTrigger>
                <SelectContent>
                  {semesters.map(semester => (
                    <SelectItem key={semester.id} value={semester.id}>
                      <div>
                        <div>{semester.name}</div>
                        <div className="text-xs text-muted-foreground">{semester.period}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="mode">Mode de génération</Label>
              <Select value={generationMode} onValueChange={(value: 'auto' | 'manual') => setGenerationMode(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      Automatique (IA optimisée)
                    </div>
                  </SelectItem>
                  <SelectItem value="manual">
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Manuel (avec assistance)
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleStartGeneration}
              disabled={!canStartGeneration}
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              Démarrer la génération
            </Button>
            
            {isGenerating && (
              <Button 
                variant="outline"
                onClick={handleStopGeneration}
                className="flex items-center gap-2"
              >
                <Square className="h-4 w-4" />
                Arrêter
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Progrès de génération */}
      {(isGenerating || generationProgress > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className={`h-5 w-5 ${isGenerating ? 'animate-spin' : ''}`} />
              Progression de la génération
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progrès global</span>
                <span className="text-sm text-muted-foreground">{Math.round(generationProgress)}%</span>
              </div>
              <Progress value={generationProgress} className="h-2" />
            </div>

            <div className="space-y-3">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="flex-shrink-0">
                    {getStepIcon(step.status)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{step.name}</h4>
                      {step.status === 'completed' && step.duration && (
                        <Badge variant="secondary" className="text-xs">
                          {(step.duration / 1000).toFixed(1)}s
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                    
                    {step.status === 'running' && (
                      <div className="mt-2">
                        <Progress value={step.progress} className="h-1" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Résultats de génération */}
      {generationProgress === 100 && !isGenerating && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
              Génération Terminée
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-emerald-200 bg-emerald-50">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                L'emploi du temps a été généré avec succès ! 
                Vous pouvez maintenant procéder à la validation et aux ajustements manuels.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-background p-4 rounded-lg border text-center">
                <div className="text-2xl font-bold text-primary">156</div>
                <p className="text-sm text-muted-foreground">Créneaux générés</p>
              </div>
              <div className="bg-background p-4 rounded-lg border text-center">
                <div className="text-2xl font-bold text-emerald-600">94%</div>
                <p className="text-sm text-muted-foreground">Score d'optimisation</p>
              </div>
              <div className="bg-background p-4 rounded-lg border text-center">
                <div className="text-2xl font-bold text-orange-600">2</div>
                <p className="text-sm text-muted-foreground">Conflits détectés</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Visualiser l'emploi du temps
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Exporter
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Valider et créer les réservations
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Paramètres avancés */}
      <Tabs defaultValue="constraints" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="constraints">Contraintes</TabsTrigger>
          <TabsTrigger value="preferences">Préférences</TabsTrigger>
          <TabsTrigger value="optimization">Optimisation</TabsTrigger>
        </TabsList>

        <TabsContent value="constraints" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contraintes de Génération</CardTitle>
              <p className="text-muted-foreground">
                Configuration des contraintes obligatoires pour la génération
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Heures max par jour</Label>
                  <Input type="number" defaultValue="8" min="1" max="12" />
                </div>
                <div>
                  <Label>Heures max consécutives</Label>
                  <Input type="number" defaultValue="4" min="1" max="8" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Pause minimum (minutes)</Label>
                  <Input type="number" defaultValue="15" min="5" max="60" />
                </div>
                <div>
                  <Label>Début des cours (heure)</Label>
                  <Input type="time" defaultValue="08:00" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Préférences de Génération</CardTitle>
              <p className="text-muted-foreground">
                Paramètres optionnels pour améliorer la qualité des emplois du temps
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Éviter les créneaux du vendredi après-midi</h4>
                    <p className="text-sm text-muted-foreground">Privilégier les autres jours</p>
                  </div>
                  <Badge>Activé</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Grouper les matières similaires</h4>
                    <p className="text-sm text-muted-foreground">Optimiser les déplacements</p>
                  </div>
                  <Badge>Activé</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Équilibrer la charge hebdomadaire</h4>
                    <p className="text-sm text-muted-foreground">Répartir uniformément</p>
                  </div>
                  <Badge>Activé</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres d'Optimisation</CardTitle>
              <p className="text-muted-foreground">
                Configuration des algorithmes d'optimisation
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Algorithme d'optimisation</Label>
                <Select defaultValue="genetic">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="genetic">Algorithme génétique</SelectItem>
                    <SelectItem value="simulated">Recuit simulé</SelectItem>
                    <SelectItem value="tabu">Recherche taboue</SelectItem>
                    <SelectItem value="ai">IA avancée</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nombre d'itérations</Label>
                  <Input type="number" defaultValue="1000" min="100" max="10000" />
                </div>
                <div>
                  <Label>Temps limite (minutes)</Label>
                  <Input type="number" defaultValue="10" min="1" max="60" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
