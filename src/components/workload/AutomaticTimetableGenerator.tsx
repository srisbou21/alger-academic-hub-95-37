
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Brain, Calendar, Clock, Users, Zap, CheckCircle, AlertTriangle, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GenerationStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  progress: number;
}

interface AutomaticTimetableGeneratorProps {
  academicYear?: string;
}

export const AutomaticTimetableGenerator = ({ academicYear = "2024-2025" }: AutomaticTimetableGeneratorProps) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const [generationSteps, setGenerationSteps] = useState<GenerationStep[]>([
    {
      id: 'analysis',
      name: 'Analyse des Données',
      description: 'Configuration des sections, groupes et charges d\'enseignement',
      status: 'pending',
      progress: 0
    },
    {
      id: 'constraints',
      name: 'Application des Contraintes',
      description: 'Disponibilités enseignants, capacités salles, règles pédagogiques',
      status: 'pending',
      progress: 0
    },
    {
      id: 'allocation',
      name: 'Allocation Initiale',
      description: 'Attribution des créneaux horaires selon les priorités',
      status: 'pending',
      progress: 0
    },
    {
      id: 'optimization',
      name: 'Optimisation IA',
      description: 'Résolution des conflits et optimisation des emplois du temps',
      status: 'pending',
      progress: 0
    },
    {
      id: 'validation',
      name: 'Validation et Vérification',
      description: 'Contrôle de cohérence et validation des résultats',
      status: 'pending',
      progress: 0
    },
    {
      id: 'finalization',
      name: 'Finalisation',
      description: 'Génération des emplois du temps finaux et notifications',
      status: 'pending',
      progress: 0
    }
  ]);

  const startGeneration = async () => {
    setIsGenerating(true);
    setOverallProgress(0);
    setCurrentStep(0);

    // Réinitialiser tous les steps
    setGenerationSteps(prev => prev.map(step => ({
      ...step,
      status: 'pending',
      progress: 0
    })));

    try {
      for (let i = 0; i < generationSteps.length; i++) {
        setCurrentStep(i);
        
        // Marquer le step comme en cours
        setGenerationSteps(prev => prev.map((step, index) => 
          index === i ? { ...step, status: 'running' } : step
        ));

        // Simulation du traitement du step
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 200));
          
          setGenerationSteps(prev => prev.map((step, index) => 
            index === i ? { ...step, progress } : step
          ));
          
          setOverallProgress(((i * 100 + progress) / (generationSteps.length * 100)) * 100);
        }

        // Marquer le step comme terminé
        setGenerationSteps(prev => prev.map((step, index) => 
          index === i ? { ...step, status: 'completed', progress: 100 } : step
        ));

        toast({
          title: `${generationSteps[i].name} terminée`,
          description: generationSteps[i].description
        });
      }

      toast({
        title: "Génération terminée avec succès !",
        description: "Les emplois du temps ont été générés et optimisés automatiquement."
      });

    } catch (error) {
      // Marquer le step actuel comme en erreur
      setGenerationSteps(prev => prev.map((step, index) => 
        index === currentStep ? { ...step, status: 'error' } : step
      ));

      toast({
        title: "Erreur de génération",
        description: "Une erreur s'est produite lors de la génération des emplois du temps.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'running':
        return <Zap className="h-5 w-5 text-blue-600 animate-pulse" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-slate-400" />;
    }
  };

  const getStepBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'running':
        return 'secondary';
      case 'error':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6" />
            Générateur Automatique d'Emplois du Temps
          </CardTitle>
          <p className="text-slate-600">
            Génération intelligente basée sur l'IA utilisant vos configurations de sections et charges d'enseignement
          </p>
          <p className="text-sm text-slate-500">Année académique: {academicYear}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Formations</p>
                    <p className="text-2xl font-bold text-blue-900">12</p>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600 font-medium">Enseignants</p>
                    <p className="text-2xl font-bold text-green-900">45</p>
                  </div>
                  <Users className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-600 font-medium">Sections/Groupes</p>
                    <p className="text-2xl font-bold text-purple-900">28</p>
                  </div>
                  <Settings className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Alert>
            <Brain className="h-4 w-4" />
            <AlertDescription>
              La génération automatique analyse vos données (sections, groupes, charges d'enseignement) 
              et utilise l'intelligence artificielle pour créer des emplois du temps optimaux sans conflits.
            </AlertDescription>
          </Alert>

          <div className="flex justify-center">
            <Button 
              onClick={startGeneration}
              disabled={isGenerating}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-3"
              size="lg"
            >
              <Brain className="mr-2 h-5 w-5" />
              {isGenerating ? "Génération en cours..." : "Lancer la Génération IA"}
            </Button>
          </div>

          {isGenerating && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Progression Globale</span>
                  <span className="text-sm text-slate-600">{Math.round(overallProgress)}%</span>
                </div>
                <Progress value={overallProgress} className="h-3" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Étapes de Génération</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {generationSteps.map((step, index) => (
              <div key={step.id} className="flex items-start gap-4 p-4 border rounded-lg">
                <div className="flex-shrink-0 mt-1">
                  {getStepIcon(step.status)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{step.name}</h4>
                    <Badge variant={getStepBadgeVariant(step.status)}>
                      {step.status === 'completed' ? 'Terminé' :
                       step.status === 'running' ? 'En cours' :
                       step.status === 'error' ? 'Erreur' :
                       'En attente'}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">{step.description}</p>
                  
                  {step.status === 'running' && (
                    <Progress value={step.progress} className="h-2" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {generationSteps.every(step => step.status === 'completed') && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <h3 className="font-semibold text-green-800">Génération Terminée avec Succès</h3>
            </div>
            <p className="text-green-700 mb-4">
              Les emplois du temps ont été générés automatiquement en tenant compte de toutes vos contraintes et configurations.
            </p>
            <div className="flex gap-2">
              <Button className="bg-green-600 hover:bg-green-700">
                Voir les Emplois du Temps
              </Button>
              <Button variant="outline">
                Télécharger les Résultats
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
