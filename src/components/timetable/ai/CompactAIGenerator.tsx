
import React, { useState } from 'react';
import { Brain } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { GenerationConfig } from './GenerationConfig';
import { GenerationProgressComponent } from './GenerationProgress';
import { GenerationResultsComponent } from './GenerationResults';

interface GenerationConfigData {
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

interface GenerationProgressData {
  step: string;
  progress: number;
  status: 'running' | 'completed' | 'error' | 'paused';
  conflicts: number;
  optimizationScore: number;
}

export const CompactAIGenerator = () => {
  const [config, setConfig] = useState<GenerationConfigData>({
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
  const [progress, setProgress] = useState<GenerationProgressData>({
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
    setGenerationResults(null);
    setProgress({ ...progress, status: 'running', progress: 0 });

    // Simulation de génération IA
    const steps = [
      { name: 'Analyse des contraintes', duration: 1000 },
      { name: 'Collecte des données', duration: 800 },
      { name: 'Optimisation initiale', duration: 1500 },
      { name: 'Résolution des conflits', duration: 1200 },
      { name: 'Optimisation avancée', duration: 2000 },
      { name: 'Validation finale', duration: 500 }
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
            Générateur IA d'Emplois du Temps - Version Compacte
          </CardTitle>
          <p className="text-slate-600">
            Génération automatique optimisée avec intelligence artificielle
          </p>
        </CardHeader>
      </Card>

      <GenerationConfig
        config={config}
        onConfigChange={setConfig}
        onStartGeneration={handleStartGeneration}
        disabled={isGenerating}
      />

      {(isGenerating || generationResults) && (
        <GenerationProgressComponent
          progress={progress}
          onPause={handlePauseGeneration}
          onReset={handleResetGeneration}
          isGenerating={isGenerating}
        />
      )}

      {generationResults && (
        <GenerationResultsComponent
          results={generationResults}
          onNewGeneration={handleResetGeneration}
          onValidate={() => toast({ title: "Validation", description: "Planning validé avec succès" })}
          onExport={() => toast({ title: "Export", description: "Planning exporté avec succès" })}
          onShowDetails={() => toast({ title: "Détails", description: "Affichage des détails détaillés" })}
        />
      )}
    </div>
  );
};
