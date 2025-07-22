
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Zap, Pause, RotateCcw } from "lucide-react";

interface GenerationProgress {
  step: string;
  progress: number;
  status: 'running' | 'completed' | 'error' | 'paused';
  conflicts: number;
  optimizationScore: number;
}

interface GenerationProgressProps {
  progress: GenerationProgress;
  onPause: () => void;
  onReset: () => void;
  isGenerating: boolean;
}

export const GenerationProgressComponent: React.FC<GenerationProgressProps> = ({
  progress,
  onPause,
  onReset,
  isGenerating
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Terminé';
      case 'error': return 'Erreur';
      case 'paused': return 'En pause';
      default: return 'En cours';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
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
            <Badge className={getStatusColor(progress.status)}>
              {getStatusLabel(progress.status)}
            </Badge>
          </div>
        </div>

        {isGenerating && (
          <div className="flex gap-2">
            <Button onClick={onPause} variant="outline" size="sm">
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </Button>
            <Button onClick={onReset} variant="outline" size="sm">
              <RotateCcw className="h-4 w-4 mr-2" />
              Arrêter
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
