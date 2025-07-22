
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Zap, 
  Settings, 
  Calendar, 
  Clock, 
  Users, 
  MapPin,
  AlertTriangle,
  CheckCircle,
  Play,
  Pause,
  RotateCcw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GenerationConfig {
  semester: string;
  department: string;
  optimizationLevel: 'basic' | 'advanced' | 'expert';
  considerPreferences: boolean;
  avoidConflicts: boolean;
  balanceWorkload: boolean;
  prioritizePopularSlots: boolean;
  maxIterations: number;
  minBreakDuration: number;
}

interface GenerationProgress {
  step: string;
  progress: number;
  status: 'running' | 'completed' | 'error' | 'paused';
  conflicts: number;
  optimizationScore: number;
}

export const AITimetableGenerator = () => {
  const [config, setConfig] = useState<GenerationConfig>({
    semester: '',
    department: '',
    optimizationLevel: 'advanced',
    considerPreferences: true,
    avoidConflicts: true,
    balanceWorkload: true,
    prioritizePopularSlots: false,
    maxIterations: 1000,
    minBreakDuration: 15
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState<GenerationProgress>({
    step: 'Initialisation',
    progress: 0,
    status: 'running',
    conflicts: 0,
    optimizationScore: 0
  });

  const [generationResults, setGenerationResults] = useState<any>(null);
  const { toast } = useToast();

  const handleStartGeneration = async () => {
    if (!config.semester || !config.department) {
      toast({
        title: "Configuration incomplète",
        description: "Veuillez sélectionner un semestre et un département",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setProgress({ ...progress, status: 'running', progress: 0 });

    // Simulation de la génération IA
    const steps = [
      { name: 'Analyse des contraintes', duration: 2000 },
      { name: 'Collecte des données', duration: 1500 },
      { name: 'Optimisation initiale', duration: 3000 },
      { name: 'Résolution des conflits', duration: 2500 },
      { name: 'Optimisation avancée', duration: 4000 },
      { name: 'Validation finale', duration: 1000 }
    ];

    let currentProgress = 0;
    const totalDuration = steps.reduce((sum, step) => sum + step.duration, 0);

    for (const step of steps) {
      setProgress(prev => ({
        ...prev,
        step: step.name,
        progress: currentProgress
      }));

      await new Promise(resolve => setTimeout(resolve, step.duration));
      currentProgress += (step.duration / totalDuration) * 100;
    }

    // Résultats simulés
    setGenerationResults({
      totalSlots: 240,
      scheduledSlots: 228,
      conflicts: 3,
      optimizationScore: 87,
      teacherSatisfaction: 92,
      roomUtilization: 78,
      recommendations: [
        "3 conflits détectés - résolution manuelle recommandée",
        "Taux d'utilisation des salles acceptable",
        "Distribution des charges équilibrée"
      ]
    });

    setProgress(prev => ({
      ...prev,
      progress: 100,
      status: 'completed',
      conflicts: 3,
      optimizationScore: 87
    }));

    setIsGenerating(false);
    
    toast({
      title: "Génération terminée",
      description: "L'emploi du temps a été généré avec succès"
    });
  };

  const handlePauseGeneration = () => {
    setProgress(prev => ({ ...prev, status: 'paused' }));
    toast({
      title: "Génération mise en pause",
      description: "Le processus peut être repris à tout moment"
    });
  };

  const handleResetGeneration = () => {
    setIsGenerating(false);
    setProgress({
      step: 'Initialisation',
      progress: 0,
      status: 'running',
      conflicts: 0,
      optimizationScore: 0
    });
    setGenerationResults(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6" />
            Générateur IA d'Emplois du Temps
          </CardTitle>
          <p className="text-slate-600">
            Génération automatique optimisée avec intelligence artificielle
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Configuration de base */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Semestre</Label>
                <Select value={config.semester} onValueChange={(value) => 
                  setConfig({...config, semester: value})
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un semestre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="S1-2024">Semestre 1 - 2024/2025</SelectItem>
                    <SelectItem value="S2-2024">Semestre 2 - 2024/2025</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Département</Label>
                <Select value={config.department} onValueChange={(value) => 
                  setConfig({...config, department: value})
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un département" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="informatique">Informatique</SelectItem>
                    <SelectItem value="mathematiques">Mathématiques</SelectItem>
                    <SelectItem value="physique">Physique</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Niveau d'optimisation</Label>
                <Select value={config.optimizationLevel} onValueChange={(value: any) => 
                  setConfig({...config, optimizationLevel: value})
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basique - Rapide</SelectItem>
                    <SelectItem value="advanced">Avancé - Équilibré</SelectItem>
                    <SelectItem value="expert">Expert - Optimal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Considérer les préférences enseignants</Label>
                  <Switch
                    checked={config.considerPreferences}
                    onCheckedChange={(checked) => 
                      setConfig({...config, considerPreferences: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Éviter les conflits automatiquement</Label>
                  <Switch
                    checked={config.avoidConflicts}
                    onCheckedChange={(checked) => 
                      setConfig({...config, avoidConflicts: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Équilibrer la charge de travail</Label>
                  <Switch
                    checked={config.balanceWorkload}
                    onCheckedChange={(checked) => 
                      setConfig({...config, balanceWorkload: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Prioriser créneaux populaires</Label>
                  <Switch
                    checked={config.prioritizePopularSlots}
                    onCheckedChange={(checked) => 
                      setConfig({...config, prioritizePopularSlots: checked})
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Paramètres avancés */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Paramètres Avancés</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nombre max d'itérations</Label>
                <Input
                  type="number"
                  value={config.maxIterations}
                  onChange={(e) => setConfig({...config, maxIterations: parseInt(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label>Durée min des pauses (minutes)</Label>
                <Input
                  type="number"
                  value={config.minBreakDuration}
                  onChange={(e) => setConfig({...config, minBreakDuration: parseInt(e.target.value)})}
                />
              </div>
            </div>
          </div>

          {/* Contrôles de génération */}
          <div className="border-t pt-6">
            <div className="flex items-center gap-4">
              {!isGenerating && !generationResults && (
                <Button onClick={handleStartGeneration} className="bg-blue-600 hover:bg-blue-700">
                  <Play className="h-4 w-4 mr-2" />
                  Lancer la génération
                </Button>
              )}
              
              {isGenerating && (
                <>
                  <Button onClick={handlePauseGeneration} variant="outline">
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </Button>
                  <Button onClick={handleResetGeneration} variant="outline">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Arrêter
                  </Button>
                </>
              )}

              {generationResults && (
                <Button onClick={handleResetGeneration} variant="outline">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Nouvelle génération
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progression */}
      {(isGenerating || generationResults) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-6 w-6" />
              Progression de la Génération
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{progress.step}</span>
                <span className="text-sm text-slate-500">{Math.round(progress.progress)}%</span>
              </div>
              <Progress value={progress.progress} className="h-2" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{progress.conflicts}</p>
                <p className="text-sm text-blue-800">Conflits détectés</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{progress.optimizationScore}%</p>
                <p className="text-sm text-green-800">Score d'optimisation</p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <Badge 
                  className={
                    progress.status === 'completed' ? 'bg-green-100 text-green-800' :
                    progress.status === 'error' ? 'bg-red-100 text-red-800' :
                    progress.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }
                >
                  {progress.status === 'completed' ? 'Terminé' :
                   progress.status === 'error' ? 'Erreur' :
                   progress.status === 'paused' ? 'En pause' : 'En cours'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Résultats */}
      {generationResults && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
              Résultats de la Génération
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{generationResults.scheduledSlots}</p>
                <p className="text-sm text-blue-800">Créneaux planifiés</p>
                <p className="text-xs text-slate-500">sur {generationResults.totalSlots}</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{generationResults.teacherSatisfaction}%</p>
                <p className="text-sm text-green-800">Satisfaction enseignants</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">{generationResults.roomUtilization}%</p>
                <p className="text-sm text-purple-800">Utilisation salles</p>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded-lg">
                <p className="text-2xl font-bold text-amber-600">{generationResults.conflicts}</p>
                <p className="text-sm text-amber-800">Conflits restants</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Recommandations IA</h4>
              {generationResults.recommendations.map((rec: string, index: number) => (
                <div key={index} className="flex items-start gap-2 p-3 bg-slate-50 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
                  <span className="text-sm">{rec}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <Button className="bg-green-600 hover:bg-green-700">
                Valider et appliquer
              </Button>
              <Button variant="outline">
                Exporter le planning
              </Button>
              <Button variant="outline">
                Afficher les détails
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
