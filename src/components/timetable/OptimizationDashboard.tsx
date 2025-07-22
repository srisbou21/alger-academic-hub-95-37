import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart3, 
  Zap, 
  Target, 
  TrendingUp, 
  CheckCircle, 
  AlertTriangle,
  RefreshCw,
  Settings
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OptimizationResult {
  id: string;
  type: 'conflict_resolution' | 'load_balancing' | 'resource_optimization';
  description: string;
  improvement: number;
  status: 'applied' | 'pending' | 'rejected';
}

export const OptimizationDashboard = () => {
  const { toast } = useToast();
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [selectedFormations, setSelectedFormations] = useState<string[]>([]);
  const [optimizationResults, setOptimizationResults] = useState<OptimizationResult[]>([]);

  const formations = [
    { id: '1', name: 'Licence Informatique L3', schedules: 12 },
    { id: '2', name: 'Master Réseaux M1', schedules: 8 },
    { id: '3', name: 'Licence Mathématiques L2', schedules: 10 }
  ];

  const handleOptimization = async () => {
    if (selectedFormations.length === 0) {
      toast({
        title: "Sélection requise",
        description: "Veuillez sélectionner au moins une formation à optimiser",
        variant: "destructive"
      });
      return;
    }

    setIsOptimizing(true);
    setOptimizationProgress(0);
    setOptimizationResults([]);

    const steps = [
      "Analyse des conflits horaires...",
      "Optimisation de la charge enseignante...",
      "Amélioration de l'utilisation des salles...",
      "Application des améliorations...",
      "Validation des changements..."
    ];

    try {
      for (let i = 0; i < steps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setOptimizationProgress(((i + 1) / steps.length) * 100);

        toast({
          title: "Optimisation en cours",
          description: steps[i]
        });
      }

      // Mock optimization results
      const mockResults: OptimizationResult[] = [
        {
          id: '1',
          type: 'conflict_resolution',
          description: 'Résolution de 3 conflits horaires détectés',
          improvement: 15,
          status: 'applied'
        },
        {
          id: '2',
          type: 'load_balancing',
          description: 'Équilibrage de la charge pour 2 enseignants',
          improvement: 8,
          status: 'applied'
        },
        {
          id: '3',
          type: 'resource_optimization',
          description: 'Optimisation de l\'utilisation des salles (+12%)',
          improvement: 12,
          status: 'applied'
        }
      ];

      setOptimizationResults(mockResults);

      toast({
        title: "Optimisation terminée",
        description: `${mockResults.length} améliorations appliquées avec succès`
      });

    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de l'optimisation",
        variant: "destructive"
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  const toggleFormationSelection = (formationId: string) => {
    setSelectedFormations(prev => 
      prev.includes(formationId)
        ? prev.filter(id => id !== formationId)
        : [...prev, formationId]
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'conflict_resolution': return <Target className="h-4 w-4 text-red-600" />;
      case 'load_balancing': return <BarChart3 className="h-4 w-4 text-blue-600" />;
      case 'resource_optimization': return <TrendingUp className="h-4 w-4 text-green-600" />;
      default: return <Settings className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'conflict_resolution': return 'Résolution Conflits';
      case 'load_balancing': return 'Équilibrage Charge';
      case 'resource_optimization': return 'Optimisation Ressources';
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            Moteur d'Optimisation IA
          </CardTitle>
          <p className="text-slate-600">
            Optimisation intelligente des emplois du temps pour améliorer l'efficacité
          </p>
        </CardHeader>
      </Card>

      {/* Sélection des formations */}
      <Card>
        <CardHeader>
          <CardTitle>Sélection des Emplois du Temps à Optimiser</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {formations.map((formation) => (
              <div
                key={formation.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedFormations.includes(formation.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
                onClick={() => toggleFormationSelection(formation.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{formation.name}</h4>
                  {selectedFormations.includes(formation.id) && (
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                  )}
                </div>
                <p className="text-sm text-slate-600">{formation.schedules} emplois du temps</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-4">
            <Button
              onClick={handleOptimization}
              disabled={isOptimizing || selectedFormations.length === 0}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isOptimizing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Optimisation en cours...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Lancer l'Optimisation ({selectedFormations.length})
                </>
              )}
            </Button>
          </div>

          {isOptimizing && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Optimisation en cours...</span>
                <span className="text-sm font-medium">{Math.round(optimizationProgress)}%</span>
              </div>
              <Progress value={optimizationProgress} className="h-3" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Résultats d'optimisation */}
      {optimizationResults.length > 0 && (
        <div className="space-y-6">
          {/* Statistiques d'amélioration */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4 text-center">
                <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <p className="text-lg font-bold text-green-800">
                  {optimizationResults.filter(r => r.status === 'applied').length}
                </p>
                <p className="text-sm text-green-600">Améliorations Appliquées</p>
              </CardContent>
            </Card>
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <p className="text-lg font-bold text-blue-800">
                  +{optimizationResults.reduce((sum, r) => sum + r.improvement, 0)}%
                </p>
                <p className="text-sm text-blue-600">Amélioration Globale</p>
              </CardContent>
            </Card>
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4 text-center">
                <Target className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                <p className="text-lg font-bold text-purple-800">0</p>
                <p className="text-sm text-purple-600">Conflits Restants</p>
              </CardContent>
            </Card>
            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="p-4 text-center">
                <BarChart3 className="h-6 w-6 text-amber-600 mx-auto mb-2" />
                <p className="text-lg font-bold text-amber-800">97%</p>
                <p className="text-sm text-amber-600">Efficacité Globale</p>
              </CardContent>
            </Card>
          </div>

          {/* Détails des optimisations */}
          <Card>
            <CardHeader>
              <CardTitle>Résultats d'Optimisation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {optimizationResults.map((result) => (
                  <div key={result.id} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getTypeIcon(result.type)}
                        <div>
                          <p className="font-medium">{result.description}</p>
                          <Badge variant="outline" className="mt-1">
                            {getTypeLabel(result.type)}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-green-600">
                            +{result.improvement}%
                          </span>
                          <Badge className="bg-green-100 text-green-800">
                            Appliqué
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};