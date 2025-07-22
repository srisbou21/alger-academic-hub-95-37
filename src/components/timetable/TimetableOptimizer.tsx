import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  Zap, 
  Settings, 
  BarChart3, 
  CheckCircle, 
  AlertTriangle,
  Brain,
  Target,
  Clock,
  Users,
  Building,
  Play
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OptimizationConfig {
  roomUtilization: boolean;
  teacherPreferences: boolean;
  conflictAvoidance: boolean;
  timeDistribution: boolean;
  groupBalancing: boolean;
  priority: {
    conflicts: number;
    efficiency: number;
    preferences: number;
  };
}

interface OptimizationResult {
  score: number;
  improvements: string[];
  conflicts: number;
  efficiency: number;
  duration: number;
  recommendations: string[];
}

interface Props {
  onOptimizationComplete: (score: number) => void;
}

export const TimetableOptimizer = ({ onOptimizationComplete }: Props) => {
  const { toast } = useToast();
  
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  
  const [config, setConfig] = useState<OptimizationConfig>({
    roomUtilization: true,
    teacherPreferences: true,
    conflictAvoidance: true,
    timeDistribution: true,
    groupBalancing: false,
    priority: {
      conflicts: 90,
      efficiency: 75,
      preferences: 60
    }
  });

  const [lastResult, setLastResult] = useState<OptimizationResult | null>(null);
  
  const [optimizationModels] = useState([
    {
      id: "standard",
      name: "Optimisation Standard",
      description: "Modèle équilibré pour la plupart des cas d'usage",
      features: ["Évitement de conflits", "Utilisation des salles", "Préférences enseignants"],
      complexity: "Moyenne",
      duration: "2-4 minutes"
    },
    {
      id: "advanced", 
      name: "Optimisation Avancée IA",
      description: "Algorithmes d'apprentissage automatique pour optimisation poussée",
      features: ["ML adaptatif", "Prédiction de conflits", "Optimisation multi-objectifs", "Apprentissage historique"],
      complexity: "Élevée",
      duration: "5-8 minutes"
    },
    {
      id: "rapid",
      name: "Optimisation Rapide",
      description: "Optimisation basique pour résultats immédiats",
      features: ["Résolution conflits", "Distribution temporelle"],
      complexity: "Faible", 
      duration: "30-60 secondes"
    }
  ]);

  const [selectedModel, setSelectedModel] = useState("standard");

  const runOptimization = async () => {
    setIsOptimizing(true);
    setOptimizationProgress(0);
    
    const steps = [
      "Analyse de l'emploi du temps actuel...",
      "Détection des conflits...",
      "Calcul des optimisations possibles...",
      "Application des améliorations...",
      "Validation des résultats...",
      "Génération du rapport..."
    ];

    try {
      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(steps[i]);
        setOptimizationProgress((i + 1) * (100 / steps.length));
        
        // Simulation du traitement
        await new Promise(resolve => setTimeout(resolve, 
          selectedModel === "rapid" ? 200 : 
          selectedModel === "advanced" ? 800 : 500
        ));
      }

      // Génération des résultats simulés
      const baseScore = selectedModel === "rapid" ? 75 : 
                       selectedModel === "advanced" ? 95 : 85;
      
      const result: OptimizationResult = {
        score: baseScore + Math.floor(Math.random() * 10),
        improvements: [
          "3 conflits de salles résolus",
          "Utilisation des amphithéâtres optimisée (+12%)",
          "Répartition horaire améliorée",
          selectedModel === "advanced" ? "Préférences enseignants intégrées" : "Distribution basique appliquée"
        ],
        conflicts: Math.floor(Math.random() * 3),
        efficiency: baseScore + Math.floor(Math.random() * 8),
        duration: selectedModel === "rapid" ? 45 : 
                 selectedModel === "advanced" ? 420 : 180,
        recommendations: [
          "Envisager l'ajout de créneaux en soirée",
          "Regrouper les cours par spécialité",
          selectedModel === "advanced" ? "Mise en place d'algorithmes prédictifs" : "Optimisation manuelle recommandée"
        ]
      };

      setLastResult(result);
      onOptimizationComplete(result.score);
      
      toast({
        title: "Optimisation terminée",
        description: `Score d'optimisation: ${result.score}% - ${result.improvements.length} améliorations appliquées`
      });

    } catch (error) {
      toast({
        title: "Erreur d'optimisation",
        description: "Une erreur est survenue pendant le processus",
        variant: "destructive"
      });
    } finally {
      setIsOptimizing(false);
      setCurrentStep("");
      setOptimizationProgress(0);
    }
  };

  const getModelBadge = (complexity: string) => {
    switch (complexity) {
      case "Élevée":
        return <Badge className="bg-red-100 text-red-800">Complexe</Badge>;
      case "Moyenne": 
        return <Badge className="bg-yellow-100 text-yellow-800">Standard</Badge>;
      default:
        return <Badge className="bg-green-100 text-green-800">Rapide</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-6 w-6" />
            Moteur d'Optimisation IA des Emplois du Temps
          </CardTitle>
          <p className="text-muted-foreground">
            Modèles avancés d'optimisation pour améliorer l'organisation et l'utilisation des ressources
          </p>
        </CardHeader>
      </Card>

      <Tabs defaultValue="models" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="models">Modèles d'IA</TabsTrigger>
          <TabsTrigger value="config">Configuration</TabsTrigger>
          <TabsTrigger value="execution">Exécution</TabsTrigger>
          <TabsTrigger value="results">Résultats</TabsTrigger>
        </TabsList>

        <TabsContent value="models" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Sélection du Modèle d'Optimisation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {optimizationModels.map((model) => (
                  <div 
                    key={model.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedModel === model.id ? 'border-primary bg-primary/5' : 'hover:border-muted-foreground'
                    }`}
                    onClick={() => setSelectedModel(model.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{model.name}</h3>
                      <div className="flex gap-2">
                        {getModelBadge(model.complexity)}
                        <Badge variant="outline">{model.duration}</Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{model.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {model.features.map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configuration des Paramètres d'Optimisation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Options d'optimisation */}
              <div>
                <h4 className="font-medium mb-4">Critères d'Optimisation</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="room-util">Optimisation de l'utilisation des salles</Label>
                      <p className="text-sm text-muted-foreground">Maximise l'occupation des salles et évite le gaspillage</p>
                    </div>
                    <Switch
                      id="room-util"
                      checked={config.roomUtilization}
                      onCheckedChange={(checked) => 
                        setConfig(prev => ({...prev, roomUtilization: checked}))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="teacher-pref">Prise en compte des préférences enseignants</Label>
                      <p className="text-sm text-muted-foreground">Intègre les créneaux préférés des enseignants</p>
                    </div>
                    <Switch
                      id="teacher-pref"
                      checked={config.teacherPreferences}
                      onCheckedChange={(checked) => 
                        setConfig(prev => ({...prev, teacherPreferences: checked}))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="conflict-avoid">Évitement automatique des conflits</Label>
                      <p className="text-sm text-muted-foreground">Détecte et résout les conflits de planning</p>
                    </div>
                    <Switch
                      id="conflict-avoid"
                      checked={config.conflictAvoidance}
                      onCheckedChange={(checked) => 
                        setConfig(prev => ({...prev, conflictAvoidance: checked}))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="time-dist">Distribution temporelle équilibrée</Label>
                      <p className="text-sm text-muted-foreground">Répartit les cours sur la semaine de façon optimale</p>
                    </div>
                    <Switch
                      id="time-dist"
                      checked={config.timeDistribution}
                      onCheckedChange={(checked) => 
                        setConfig(prev => ({...prev, timeDistribution: checked}))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="group-balance">Équilibrage des groupes</Label>
                      <p className="text-sm text-muted-foreground">Optimise la répartition des étudiants par groupe</p>
                    </div>
                    <Switch
                      id="group-balance"
                      checked={config.groupBalancing}
                      onCheckedChange={(checked) => 
                        setConfig(prev => ({...prev, groupBalancing: checked}))
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Priorités */}
              <div>
                <h4 className="font-medium mb-4">Pondération des Priorités</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label>Résolution des conflits</Label>
                      <span className="text-sm text-muted-foreground">{config.priority.conflicts}%</span>
                    </div>
                    <Slider
                      value={[config.priority.conflicts]}
                      onValueChange={([value]) => 
                        setConfig(prev => ({
                          ...prev, 
                          priority: {...prev.priority, conflicts: value}
                        }))
                      }
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <Label>Efficacité d'utilisation</Label>
                      <span className="text-sm text-muted-foreground">{config.priority.efficiency}%</span>
                    </div>
                    <Slider
                      value={[config.priority.efficiency]}
                      onValueChange={([value]) => 
                        setConfig(prev => ({
                          ...prev, 
                          priority: {...prev.priority, efficiency: value}
                        }))
                      }
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <Label>Préférences utilisateurs</Label>
                      <span className="text-sm text-muted-foreground">{config.priority.preferences}%</span>
                    </div>
                    <Slider
                      value={[config.priority.preferences]}
                      onValueChange={([value]) => 
                        setConfig(prev => ({
                          ...prev, 
                          priority: {...prev.priority, preferences: value}
                        }))
                      }
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="execution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                Lancement de l'Optimisation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isOptimizing ? (
                <>
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Configuration sélectionnée</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Modèle:</span> 
                        {optimizationModels.find(m => m.id === selectedModel)?.name}
                      </div>
                      <div>
                        <span className="font-medium">Durée estimée:</span>
                        {optimizationModels.find(m => m.id === selectedModel)?.duration}
                      </div>
                      <div>
                        <span className="font-medium">Critères actifs:</span>
                        {Object.values(config).slice(0, 5).filter(Boolean).length}/5
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={runOptimization} 
                    className="w-full" 
                    size="lg"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Lancer l'Optimisation IA
                  </Button>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-lg font-medium mb-2">Optimisation en cours...</div>
                    <div className="text-sm text-muted-foreground mb-4">{currentStep}</div>
                    <Progress value={optimizationProgress} className="w-full" />
                    <div className="text-xs text-muted-foreground mt-2">
                      {Math.round(optimizationProgress)}% terminé
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          {lastResult ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Résultats de l'Optimisation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-4 bg-primary/5 rounded-lg">
                      <div className="text-3xl font-bold text-primary mb-1">{lastResult.score}%</div>
                      <div className="text-sm text-muted-foreground">Score global</div>
                    </div>
                    <div className="text-center p-4 bg-emerald-50 rounded-lg">
                      <div className="text-3xl font-bold text-emerald-600 mb-1">{lastResult.conflicts}</div>
                      <div className="text-sm text-muted-foreground">Conflits restants</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600 mb-1">{lastResult.efficiency}%</div>
                      <div className="text-sm text-muted-foreground">Efficacité</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-3xl font-bold text-purple-600 mb-1">{Math.floor(lastResult.duration / 60)}min</div>
                      <div className="text-sm text-muted-foreground">Durée traitement</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-600" />
                        Améliorations Appliquées
                      </h4>
                      <ul className="space-y-2">
                        {lastResult.improvements.map((improvement, index) => (
                          <li key={index} className="text-sm p-2 bg-emerald-50 rounded">
                            {improvement}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Target className="h-4 w-4 text-blue-600" />
                        Recommandations
                      </h4>
                      <ul className="space-y-2">
                        {lastResult.recommendations.map((recommendation, index) => (
                          <li key={index} className="text-sm p-2 bg-blue-50 rounded">
                            {recommendation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Optimisation réussie!</strong> Les améliorations ont été appliquées à l'emploi du temps. 
                  Vous pouvez maintenant procéder à la validation et aux réservations automatiques.
                </AlertDescription>
              </Alert>
            </>
          ) : (
            <Card>
              <CardContent className="text-center p-8">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">Aucune optimisation n'a encore été exécutée</p>
                <p className="text-sm text-muted-foreground">Configurez et lancez une optimisation pour voir les résultats</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};