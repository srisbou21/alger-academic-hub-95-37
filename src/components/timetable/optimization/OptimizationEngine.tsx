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
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { 
  Zap, 
  Play, 
  Pause, 
  RotateCcw,
  TrendingUp, 
  Target, 
  Settings,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Info,
  Cpu,
  Timer,
  Award
} from "lucide-react";

interface OptimizationModel {
  id: string;
  name: string;
  description: string;
  algorithm: string;
  performance: number;
  isActive: boolean;
}

interface OptimizationResult {
  id: string;
  modelName: string;
  score: number;
  improvements: string[];
  metrics: {
    conflictReduction: number;
    utilizationIncrease: number;
    satisfactionScore: number;
    executionTime: number;
  };
}

export const OptimizationEngine = () => {
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [currentIteration, setCurrentIteration] = useState(0);
  const [maxIterations, setMaxIterations] = useState(1000);
  
  const [models] = useState<OptimizationModel[]>([
    {
      id: '1',
      name: 'Modèle Équilibré',
      description: 'Optimisation équilibrée entre tous les critères',
      algorithm: 'Algorithme génétique hybride',
      performance: 85,
      isActive: true
    },
    {
      id: '2',
      name: 'Maximisation Utilisation',
      description: 'Priorité sur l\'utilisation optimale des infrastructures',
      algorithm: 'Programmation par contraintes',
      performance: 78,
      isActive: true
    },
    {
      id: '3',
      name: 'Satisfaction Étudiants',
      description: 'Optimisation centrée sur la satisfaction des étudiants',
      algorithm: 'Recherche locale guidée',
      performance: 82,
      isActive: true
    },
    {
      id: '4',
      name: 'IA Avancée',
      description: 'Modèle d\'apprentissage automatique avancé',
      algorithm: 'Réseaux de neurones + Optimisation multi-objectifs',
      performance: 94,
      isActive: true
    }
  ]);

  const [results, setResults] = useState<OptimizationResult[]>([
    {
      id: '1',
      modelName: 'Modèle Équilibré',
      score: 87,
      improvements: [
        'Réduction de 23% des conflits horaires',
        'Augmentation de 15% de l\'utilisation des salles',
        'Amélioration de 18% de la répartition des charges'
      ],
      metrics: {
        conflictReduction: 23,
        utilizationIncrease: 15,
        satisfactionScore: 87,
        executionTime: 4.2
      }
    }
  ]);

  const [objectives, setObjectives] = useState([
    { name: 'Minimiser les conflits', weight: 30, enabled: true },
    { name: 'Maximiser l\'utilisation', weight: 25, enabled: true },
    { name: 'Équilibrer les charges', weight: 20, enabled: true },
    { name: 'Satisfaction étudiants', weight: 15, enabled: true },
    { name: 'Optimiser les déplacements', weight: 10, enabled: false }
  ]);

  const handleStartOptimization = () => {
    setIsOptimizing(true);
    setOptimizationProgress(0);
    setCurrentIteration(0);
    
    // Simuler l'optimisation
    simulateOptimization();
  };

  const simulateOptimization = async () => {
    for (let i = 0; i <= maxIterations; i += 50) {
      setCurrentIteration(i);
      setOptimizationProgress((i / maxIterations) * 100);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Ajouter un nouveau résultat
    const newResult: OptimizationResult = {
      id: Date.now().toString(),
      modelName: models.find(m => m.id === selectedModel)?.name || 'Modèle sélectionné',
      score: Math.floor(Math.random() * 20) + 80,
      improvements: [
        `Réduction de ${Math.floor(Math.random() * 15) + 15}% des conflits`,
        `Augmentation de ${Math.floor(Math.random() * 10) + 10}% de l'utilisation`,
        `Amélioration de ${Math.floor(Math.random() * 12) + 8}% de la satisfaction`
      ],
      metrics: {
        conflictReduction: Math.floor(Math.random() * 15) + 15,
        utilizationIncrease: Math.floor(Math.random() * 10) + 10,
        satisfactionScore: Math.floor(Math.random() * 20) + 80,
        executionTime: Math.random() * 3 + 2
      }
    };
    
    setResults([newResult, ...results]);
    setIsOptimizing(false);
  };

  const handleStopOptimization = () => {
    setIsOptimizing(false);
    setOptimizationProgress(0);
    setCurrentIteration(0);
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-orange-600';
    return 'text-red-600';
  };

  const canStartOptimization = selectedModel && !isOptimizing;

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Moteur d'Optimisation Avancé
          </CardTitle>
          <p className="text-muted-foreground">
            Modèles d'optimisation intelligents pour améliorer la qualité des emplois du temps
          </p>
        </CardHeader>
      </Card>

      {/* Sélection du modèle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Sélection du Modèle d'Optimisation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {models.map((model) => (
              <div
                key={model.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedModel === model.id 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setSelectedModel(model.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium">{model.name}</h3>
                  <div className="flex items-center gap-2">
                    <Badge className={getPerformanceColor(model.performance)}>
                      {model.performance}%
                    </Badge>
                    {model.isActive && (
                      <Badge className="bg-emerald-100 text-emerald-800">Actif</Badge>
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{model.description}</p>
                <p className="text-xs text-muted-foreground">{model.algorithm}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleStartOptimization}
              disabled={!canStartOptimization}
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              Lancer l'optimisation
            </Button>
            
            {isOptimizing && (
              <Button 
                variant="outline"
                onClick={handleStopOptimization}
                className="flex items-center gap-2"
              >
                <Pause className="h-4 w-4" />
                Arrêter
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Progrès d'optimisation */}
      {isOptimizing && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="h-5 w-5 animate-pulse" />
              Optimisation en cours
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progression</span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(optimizationProgress)}% ({currentIteration}/{maxIterations} itérations)
                </span>
              </div>
              <Progress value={optimizationProgress} className="h-2" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-lg font-semibold text-primary">{currentIteration}</div>
                <p className="text-xs text-muted-foreground">Itérations</p>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-emerald-600">
                  {Math.floor(Math.random() * 30) + 70}%
                </div>
                <p className="text-xs text-muted-foreground">Score actuel</p>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-blue-600">
                  {Math.floor(Math.random() * 10) + 5}
                </div>
                <p className="text-xs text-muted-foreground">Améliorations</p>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-orange-600">
                  {(optimizationProgress / 100 * 5).toFixed(1)}s
                </div>
                <p className="text-xs text-muted-foreground">Temps écoulé</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Résultats d'optimisation */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Résultats d'Optimisation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {results.map((result) => (
              <div key={result.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">{result.modelName}</h4>
                  <Badge className={getPerformanceColor(result.score)}>
                    Score: {result.score}/100
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-red-600">
                      -{result.metrics.conflictReduction}%
                    </div>
                    <p className="text-xs text-muted-foreground">Conflits</p>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-emerald-600">
                      +{result.metrics.utilizationIncrease}%
                    </div>
                    <p className="text-xs text-muted-foreground">Utilisation</p>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-blue-600">
                      {result.metrics.satisfactionScore}%
                    </div>
                    <p className="text-xs text-muted-foreground">Satisfaction</p>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-purple-600">
                      {result.metrics.executionTime.toFixed(1)}s
                    </div>
                    <p className="text-xs text-muted-foreground">Temps</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <h5 className="font-medium text-sm">Améliorations apportées :</h5>
                  {result.improvements.map((improvement, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-3 w-3 text-emerald-600" />
                      <span>{improvement}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Configuration avancée */}
      <Tabs defaultValue="objectives" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="objectives">Objectifs</TabsTrigger>
          <TabsTrigger value="constraints">Contraintes</TabsTrigger>
          <TabsTrigger value="parameters">Paramètres</TabsTrigger>
        </TabsList>

        <TabsContent value="objectives" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuration des Objectifs</CardTitle>
              <p className="text-muted-foreground">
                Définissez les priorités et pondérations pour l'optimisation
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {objectives.map((objective, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Switch 
                      checked={objective.enabled}
                      onCheckedChange={(checked) => {
                        const newObjectives = [...objectives];
                        newObjectives[index].enabled = checked;
                        setObjectives(newObjectives);
                      }}
                    />
                    <div>
                      <h4 className="font-medium text-sm">{objective.name}</h4>
                    </div>
                  </div>
                  
                  {objective.enabled && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Poids:</span>
                      <div className="w-32">
                        <Slider
                          value={[objective.weight]}
                          onValueChange={(value) => {
                            const newObjectives = [...objectives];
                            newObjectives[index].weight = value[0];
                            setObjectives(newObjectives);
                          }}
                          max={50}
                          min={0}
                          step={5}
                        />
                      </div>
                      <span className="text-sm font-medium w-8">{objective.weight}%</span>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="constraints" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contraintes d'Optimisation</CardTitle>
              <p className="text-muted-foreground">
                Contraintes rigides à respecter durant l'optimisation
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Respecter les préférences enseignants</h4>
                    <p className="text-sm text-muted-foreground">Contrainte rigide</p>
                  </div>
                  <Badge className="bg-red-100 text-red-800">Obligatoire</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Capacité maximale des salles</h4>
                    <p className="text-sm text-muted-foreground">Contrainte rigide</p>
                  </div>
                  <Badge className="bg-red-100 text-red-800">Obligatoire</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Éviter les créneaux du vendredi soir</h4>
                    <p className="text-sm text-muted-foreground">Contrainte souple</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="parameters" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres Algorithmiques</CardTitle>
              <p className="text-muted-foreground">
                Configuration fine des algorithmes d'optimisation
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nombre maximum d'itérations</Label>
                  <Input 
                    type="number" 
                    value={maxIterations}
                    onChange={(e) => setMaxIterations(parseInt(e.target.value))}
                    min="100" 
                    max="10000" 
                  />
                </div>
                <div>
                  <Label>Temps limite (minutes)</Label>
                  <Input type="number" defaultValue="10" min="1" max="60" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Seuil de convergence</Label>
                  <Input type="number" defaultValue="0.001" step="0.001" min="0" max="1" />
                </div>
                <div>
                  <Label>Facteur de mutation (%)</Label>
                  <Input type="number" defaultValue="5" min="0" max="50" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Informations */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Conseil :</strong> L'optimisation peut prendre plusieurs minutes selon la complexité. 
          Les modèles IA avancés offrent de meilleures performances mais nécessitent plus de temps de calcul.
        </AlertDescription>
      </Alert>
    </div>
  );
};