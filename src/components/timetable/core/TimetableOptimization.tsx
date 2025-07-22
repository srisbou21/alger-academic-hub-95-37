import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Zap, BarChart3, TrendingUp, Clock } from "lucide-react";
import { WorkflowData } from './TimetableWorkflow';

interface Props {
  workflowData: WorkflowData;
  updateWorkflowData: (updates: Partial<WorkflowData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

interface OptimizationMetrics {
  timeEfficiency: number;
  roomUtilization: number;
  conflictReduction: number;
  workloadBalance: number;
}

export const TimetableOptimization = ({ workflowData, updateWorkflowData, onNext }: Props) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [optimizationEnabled, setOptimizationEnabled] = useState(false);
  const [metrics, setMetrics] = useState<OptimizationMetrics>({
    timeEfficiency: 78,
    roomUtilization: 65,
    conflictReduction: 92,
    workloadBalance: 71
  });
  const [optimizedMetrics, setOptimizedMetrics] = useState<OptimizationMetrics | null>(null);

  const runOptimization = async () => {
    setIsOptimizing(true);
    setOptimizationProgress(0);

    // Simulation d'optimisation
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setOptimizationProgress(i);
    }

    // Résultats simulés d'optimisation
    const newMetrics: OptimizationMetrics = {
      timeEfficiency: Math.min(95, metrics.timeEfficiency + Math.random() * 15),
      roomUtilization: Math.min(95, metrics.roomUtilization + Math.random() * 20),
      conflictReduction: Math.min(98, metrics.conflictReduction + Math.random() * 6),
      workloadBalance: Math.min(90, metrics.workloadBalance + Math.random() * 15)
    };

    setOptimizedMetrics(newMetrics);
    updateWorkflowData({ isOptimized: true });
    setIsOptimizing(false);
  };

  const skipOptimization = () => {
    updateWorkflowData({ isOptimized: false });
    onNext();
  };

  const applyOptimization = () => {
    if (optimizedMetrics) {
      setMetrics(optimizedMetrics);
    }
    onNext();
  };

  const getMetricColor = (value: number) => {
    if (value >= 90) return "text-green-600";
    if (value >= 75) return "text-blue-600";
    if (value >= 60) return "text-orange-600";
    return "text-red-600";
  };

  const getMetricBadgeColor = (value: number) => {
    if (value >= 90) return "bg-green-100 text-green-800";
    if (value >= 75) return "bg-blue-100 text-blue-800";
    if (value >= 60) return "bg-orange-100 text-orange-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Optimisation des Emplois du Temps
          </CardTitle>
          <p className="text-slate-600">
            Amélioration optionnelle des emplois du temps validés
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Optimization Toggle */}
          <div className="flex items-center space-x-2">
            <Switch 
              id="optimization" 
              checked={optimizationEnabled}
              onCheckedChange={setOptimizationEnabled}
            />
            <Label htmlFor="optimization">Activer l'optimisation automatique</Label>
          </div>

          {/* Current Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Métriques Actuelles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getMetricColor(metrics.timeEfficiency)}`}>
                    {metrics.timeEfficiency.toFixed(1)}%
                  </div>
                  <p className="text-sm text-slate-600">Efficacité Temporelle</p>
                  <Badge className={getMetricBadgeColor(metrics.timeEfficiency)}>
                    {metrics.timeEfficiency >= 75 ? "Bon" : "À améliorer"}
                  </Badge>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getMetricColor(metrics.roomUtilization)}`}>
                    {metrics.roomUtilization.toFixed(1)}%
                  </div>
                  <p className="text-sm text-slate-600">Utilisation Salles</p>
                  <Badge className={getMetricBadgeColor(metrics.roomUtilization)}>
                    {metrics.roomUtilization >= 75 ? "Bon" : "À améliorer"}
                  </Badge>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getMetricColor(metrics.conflictReduction)}`}>
                    {metrics.conflictReduction.toFixed(1)}%
                  </div>
                  <p className="text-sm text-slate-600">Réduction Conflits</p>
                  <Badge className={getMetricBadgeColor(metrics.conflictReduction)}>
                    {metrics.conflictReduction >= 90 ? "Excellent" : "Bon"}
                  </Badge>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getMetricColor(metrics.workloadBalance)}`}>
                    {metrics.workloadBalance.toFixed(1)}%
                  </div>
                  <p className="text-sm text-slate-600">Équilibrage Charge</p>
                  <Badge className={getMetricBadgeColor(metrics.workloadBalance)}>
                    {metrics.workloadBalance >= 75 ? "Bon" : "À améliorer"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Optimization Controls */}
          {optimizationEnabled && (
            <div className="space-y-4">
              <Button 
                onClick={runOptimization}
                disabled={isOptimizing}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isOptimizing ? (
                  <>
                    <Zap className="mr-2 h-4 w-4 animate-spin" />
                    Optimisation en cours...
                  </>
                ) : (
                  <>
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Lancer l'Optimisation
                  </>
                )}
              </Button>

              {isOptimizing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Algorithme d'optimisation...</span>
                    <span>{optimizationProgress}%</span>
                  </div>
                  <Progress value={optimizationProgress} className="h-2" />
                </div>
              )}

              {/* Optimized Results */}
              {optimizedMetrics && (
                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-800">
                      <TrendingUp className="h-5 w-5" />
                      Résultats d'Optimisation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {optimizedMetrics.timeEfficiency.toFixed(1)}%
                        </div>
                        <div className="text-xs text-green-700">
                          +{(optimizedMetrics.timeEfficiency - metrics.timeEfficiency).toFixed(1)}%
                        </div>
                        <p className="text-sm text-slate-600">Efficacité Temporelle</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {optimizedMetrics.roomUtilization.toFixed(1)}%
                        </div>
                        <div className="text-xs text-green-700">
                          +{(optimizedMetrics.roomUtilization - metrics.roomUtilization).toFixed(1)}%
                        </div>
                        <p className="text-sm text-slate-600">Utilisation Salles</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {optimizedMetrics.conflictReduction.toFixed(1)}%
                        </div>
                        <div className="text-xs text-green-700">
                          +{(optimizedMetrics.conflictReduction - metrics.conflictReduction).toFixed(1)}%
                        </div>
                        <p className="text-sm text-slate-600">Réduction Conflits</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {optimizedMetrics.workloadBalance.toFixed(1)}%
                        </div>
                        <div className="text-xs text-green-700">
                          +{(optimizedMetrics.workloadBalance - metrics.workloadBalance).toFixed(1)}%
                        </div>
                        <p className="text-sm text-slate-600">Équilibrage Charge</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button onClick={applyOptimization} className="bg-green-600 hover:bg-green-700">
                        Appliquer l'Optimisation
                      </Button>
                      <Button variant="outline" onClick={skipOptimization}>
                        Ignorer l'Optimisation
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Skip Option */}
          {!optimizationEnabled && (
            <div className="text-center">
              <p className="text-slate-600 mb-4">
                L'optimisation est optionnelle. Vous pouvez continuer sans optimiser.
              </p>
              <Button onClick={skipOptimization} variant="outline">
                Continuer sans Optimisation
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};