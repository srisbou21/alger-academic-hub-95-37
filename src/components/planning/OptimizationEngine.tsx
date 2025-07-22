
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Cpu, Brain, Zap, TrendingUp, Activity, Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";

interface OptimizationResult {
  algorithm: string;
  score: number;
  constraints_satisfied: number;
  total_constraints: number;
  execution_time: number;
  iterations: number;
  convergence: boolean;
}

interface OptimizationMetrics {
  room_utilization: number;
  teacher_satisfaction: number;
  student_satisfaction: number;
  conflicts_resolved: number;
  time_gaps_minimized: number;
}

export const OptimizationEngine = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("cp-sat");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [currentIteration, setCurrentIteration] = useState(0);
  const [results, setResults] = useState<OptimizationResult[]>([]);
  const [metrics, setMetrics] = useState<OptimizationMetrics | null>(null);

  const algorithms = [
    {
      id: "cp-sat",
      name: "CP-SAT (Google OR-Tools)",
      description: "Programmation par contraintes optimisée",
      complexity: "Élevée",
      performance: "Excellente",
      useCase: "Contraintes complexes"
    },
    {
      id: "genetic",
      name: "Algorithme Génétique",
      description: "Évolution par sélection naturelle",
      complexity: "Moyenne",
      performance: "Bonne",
      useCase: "Optimisation multi-objectifs"
    },
    {
      id: "simulated-annealing",
      name: "Recuit Simulé",
      description: "Optimisation par refroidissement",
      complexity: "Faible",
      performance: "Moyenne",
      useCase: "Solutions locales"
    },
    {
      id: "tabu-search",
      name: "Recherche Tabou",
      description: "Évitement des optima locaux",
      complexity: "Moyenne",
      performance: "Bonne",
      useCase: "Exploration exhaustive"
    }
  ];

  const runOptimization = async () => {
    setIsOptimizing(true);
    setOptimizationProgress(0);
    setCurrentIteration(0);

    // Simulation d'optimisation
    const maxIterations = 1000;
    for (let i = 0; i <= maxIterations; i += 50) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setOptimizationProgress((i / maxIterations) * 100);
      setCurrentIteration(i);
    }

    // Résultats simulés
    const newResult: OptimizationResult = {
      algorithm: selectedAlgorithm,
      score: 0.94 + Math.random() * 0.05,
      constraints_satisfied: 47 + Math.floor(Math.random() * 3),
      total_constraints: 50,
      execution_time: 2.3 + Math.random() * 1.5,
      iterations: maxIterations,
      convergence: true
    };

    const newMetrics: OptimizationMetrics = {
      room_utilization: 0.85 + Math.random() * 0.1,
      teacher_satisfaction: 0.88 + Math.random() * 0.08,
      student_satisfaction: 0.82 + Math.random() * 0.12,
      conflicts_resolved: 23 + Math.floor(Math.random() * 5),
      time_gaps_minimized: 0.76 + Math.random() * 0.15
    };

    setResults(prev => [newResult, ...prev.slice(0, 4)]);
    setMetrics(newMetrics);
    setIsOptimizing(false);
  };

  const getAlgorithmColor = (algorithm: string) => {
    const colors = {
      "cp-sat": "bg-purple-100 text-purple-800 border-purple-200",
      "genetic": "bg-green-100 text-green-800 border-green-200",
      "simulated-annealing": "bg-orange-100 text-orange-800 border-orange-200",
      "tabu-search": "bg-blue-100 text-blue-800 border-blue-200"
    };
    return colors[algorithm as keyof typeof colors] || "bg-slate-100 text-slate-800 border-slate-200";
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.9) return "text-green-600";
    if (score >= 0.8) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Moteur d'Optimisation IA</h2>
          <p className="text-slate-600">Algorithmes avancés pour la génération d'emplois du temps</p>
        </div>
      </div>

      <Tabs defaultValue="engine" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="engine">Moteur</TabsTrigger>
          <TabsTrigger value="algorithms">Algorithmes</TabsTrigger>
          <TabsTrigger value="results">Résultats</TabsTrigger>
        </TabsList>

        <TabsContent value="engine" className="space-y-6">
          {/* Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="h-5 w-5" />
                Configuration d'Optimisation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Algorithme</label>
                  <Select value={selectedAlgorithm} onValueChange={setSelectedAlgorithm}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {algorithms.map((algo) => (
                        <SelectItem key={algo.id} value={algo.id}>
                          {algo.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Mode d'exécution</label>
                  <Select defaultValue="performance">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fast">Rapide (2-5 min)</SelectItem>
                      <SelectItem value="balanced">Équilibré (5-15 min)</SelectItem>
                      <SelectItem value="performance">Performance (15-30 min)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-4">
                <Button 
                  onClick={runOptimization} 
                  disabled={isOptimizing}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {isOptimizing ? (
                    <>
                      <Cpu className="mr-2 h-4 w-4 animate-spin" />
                      Optimisation en cours...
                    </>
                  ) : (
                    <>
                      <Brain className="mr-2 h-4 w-4" />
                      Lancer l'Optimisation
                    </>
                  )}
                </Button>
                <Button variant="outline">
                  <Zap className="mr-2 h-4 w-4" />
                  Test Rapide
                </Button>
              </div>

              {isOptimizing && (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Progression: Itération {currentIteration}/1000</span>
                    <span>{optimizationProgress.toFixed(1)}%</span>
                  </div>
                  <Progress value={optimizationProgress} className="h-3" />
                  <div className="text-xs text-slate-500">
                    Algorithme: {algorithms.find(a => a.id === selectedAlgorithm)?.name}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Métriques en temps réel */}
          {metrics && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-4 text-center">
                  <Activity className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-lg font-bold text-blue-800">
                    {(metrics.room_utilization * 100).toFixed(1)}%
                  </p>
                  <p className="text-sm text-blue-600">Utilisation Salles</p>
                </CardContent>
              </Card>

              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-4 text-center">
                  <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <p className="text-lg font-bold text-green-800">
                    {(metrics.teacher_satisfaction * 100).toFixed(1)}%
                  </p>
                  <p className="text-sm text-green-600">Satisfaction Profs</p>
                </CardContent>
              </Card>

              <Card className="border-purple-200 bg-purple-50">
                <CardContent className="p-4 text-center">
                  <CheckCircle2 className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-lg font-bold text-purple-800">
                    {(metrics.student_satisfaction * 100).toFixed(1)}%
                  </p>
                  <p className="text-sm text-purple-600">Satisfaction Étudiants</p>
                </CardContent>
              </Card>

              <Card className="border-amber-200 bg-amber-50">
                <CardContent className="p-4 text-center">
                  <AlertTriangle className="h-6 w-6 text-amber-600 mx-auto mb-2" />
                  <p className="text-lg font-bold text-amber-800">
                    {metrics.conflicts_resolved}
                  </p>
                  <p className="text-sm text-amber-600">Conflits Résolus</p>
                </CardContent>
              </Card>

              <Card className="border-slate-200 bg-slate-50">
                <CardContent className="p-4 text-center">
                  <Clock className="h-6 w-6 text-slate-600 mx-auto mb-2" />
                  <p className="text-lg font-bold text-slate-800">
                    {(metrics.time_gaps_minimized * 100).toFixed(1)}%
                  </p>
                  <p className="text-sm text-slate-600">Créneaux Optimisés</p>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="algorithms" className="space-y-4">
          {algorithms.map((algorithm) => (
            <Card key={algorithm.id} className="border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Brain className="h-5 w-5 text-slate-600" />
                    <h3 className="text-lg font-medium text-slate-800">{algorithm.name}</h3>
                    <Badge className={getAlgorithmColor(algorithm.id)}>
                      {algorithm.id === selectedAlgorithm ? "Sélectionné" : "Disponible"}
                    </Badge>
                  </div>
                  <Button
                    size="sm"
                    variant={algorithm.id === selectedAlgorithm ? "default" : "outline"}
                    onClick={() => setSelectedAlgorithm(algorithm.id)}
                  >
                    {algorithm.id === selectedAlgorithm ? "Sélectionné" : "Sélectionner"}
                  </Button>
                </div>
                
                <p className="text-slate-600 mb-3">{algorithm.description}</p>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-slate-700">Complexité: </span>
                    <span className="text-slate-600">{algorithm.complexity}</span>
                  </div>
                  <div>
                    <span className="font-medium text-slate-700">Performance: </span>
                    <span className="text-slate-600">{algorithm.performance}</span>
                  </div>
                  <div>
                    <span className="font-medium text-slate-700">Cas d'usage: </span>
                    <span className="text-slate-600">{algorithm.useCase}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          {results.map((result, index) => (
            <Card key={index} className="border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Badge className={getAlgorithmColor(result.algorithm)}>
                      {algorithms.find(a => a.id === result.algorithm)?.name}
                    </Badge>
                    {result.convergence && (
                      <Badge className="bg-green-100 text-green-800">Convergé</Badge>
                    )}
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${getScoreColor(result.score)}`}>
                      {(result.score * 100).toFixed(1)}%
                    </p>
                    <p className="text-sm text-slate-500">Score global</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-slate-700">Contraintes</p>
                    <p className="text-slate-600">
                      {result.constraints_satisfied}/{result.total_constraints}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-slate-700">Temps d'exécution</p>
                    <p className="text-slate-600">{result.execution_time.toFixed(1)}s</p>
                  </div>
                  <div>
                    <p className="font-medium text-slate-700">Itérations</p>
                    <p className="text-slate-600">{result.iterations.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="font-medium text-slate-700">Statut</p>
                    <p className="text-slate-600">
                      {result.convergence ? "Optimal" : "Sous-optimal"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {results.length === 0 && (
            <Card className="border-slate-200">
              <CardContent className="p-12 text-center">
                <Brain className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-500">Aucun résultat d'optimisation disponible</p>
                <p className="text-sm text-slate-400">
                  Lancez une optimisation pour voir les résultats ici
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
