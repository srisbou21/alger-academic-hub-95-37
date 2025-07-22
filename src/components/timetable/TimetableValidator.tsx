import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Clock,
  Users,
  MapPin,
  Calendar,
  Target,
  Settings,
  FileCheck
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ValidationRule {
  id: string;
  name: string;
  description: string;
  severity: 'error' | 'warning' | 'info';
  enabled: boolean;
}

interface ValidationResult {
  ruleId: string;
  status: 'passed' | 'failed' | 'warning';
  message: string;
  details?: string;
  affectedItems: number;
}

interface TimetableValidation {
  formationId: string;
  formationName: string;
  status: 'pending' | 'validating' | 'validated' | 'rejected';
  score: number;
  results: ValidationResult[];
  validatedAt?: Date;
  validatedBy?: string;
}

interface Props {
  onValidationComplete: (count: number) => void;
}

export const TimetableValidator = ({ onValidationComplete }: Props) => {
  const { toast } = useToast();
  
  const [isValidating, setIsValidating] = useState(false);
  const [validationProgress, setValidationProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");

  const [validationRules] = useState<ValidationRule[]>([
    {
      id: "conflicts",
      name: "Détection des conflits",
      description: "Vérifie qu'aucun enseignant ou salle n'est réservé(e) à deux endroits simultanément",
      severity: "error",
      enabled: true
    },
    {
      id: "room_capacity",
      name: "Capacité des salles",
      description: "Vérifie que la capacité des salles est suffisante pour les groupes",
      severity: "error", 
      enabled: true
    },
    {
      id: "time_distribution",
      name: "Distribution temporelle",
      description: "Vérifie la répartition équilibrée des cours sur la semaine",
      severity: "warning",
      enabled: true
    },
    {
      id: "teacher_availability",
      name: "Disponibilité enseignants",
      description: "Vérifie que les créneaux respectent les disponibilités des enseignants",
      severity: "error",
      enabled: true
    },
    {
      id: "curriculum_coherence",
      name: "Cohérence pédagogique", 
      description: "Vérifie l'ordre logique des matières et la charge horaire",
      severity: "warning",
      enabled: false
    },
    {
      id: "resource_optimization",
      name: "Optimisation des ressources",
      description: "Vérifie l'utilisation optimale des salles et équipements",
      severity: "info",
      enabled: true
    }
  ]);

  const [timetableValidations, setTimetableValidations] = useState<TimetableValidation[]>([
    {
      formationId: "1",
      formationName: "Licence Informatique",
      status: "validated",
      score: 92,
      results: [
        {
          ruleId: "conflicts",
          status: "passed",
          message: "Aucun conflit détecté",
          affectedItems: 0
        },
        {
          ruleId: "room_capacity", 
          status: "warning",
          message: "Capacité limite atteinte",
          details: "2 salles utilisées à plus de 90%",
          affectedItems: 2
        }
      ],
      validatedAt: new Date(),
      validatedBy: "Dr. Martin"
    },
    {
      formationId: "2",
      formationName: "Master IA",
      status: "pending",
      score: 0,
      results: []
    },
    {
      formationId: "3", 
      formationName: "Licence Mathématiques",
      status: "rejected",
      score: 45,
      results: [
        {
          ruleId: "conflicts",
          status: "failed", 
          message: "3 conflits détectés",
          details: "Prof. Dubois programmé simultanément en salle A et B",
          affectedItems: 3
        }
      ]
    }
  ]);

  const runValidation = async (formationId: string) => {
    setIsValidating(true);
    setValidationProgress(0);
    
    const steps = [
      "Analyse de l'emploi du temps...",
      "Vérification des conflits...",
      "Contrôle des capacités...",
      "Validation des disponibilités...",
      "Calcul du score de qualité...",
      "Génération du rapport..."
    ];

    const enabledRules = validationRules.filter(rule => rule.enabled);
    
    try {
      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(steps[i]);
        setValidationProgress((i + 1) * (100 / steps.length));
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      // Simulation des résultats de validation
      const mockResults: ValidationResult[] = enabledRules.map(rule => {
        const outcomes = ['passed', 'warning', 'failed'];
        const weights = rule.severity === 'error' ? [0.7, 0.2, 0.1] : 
                       rule.severity === 'warning' ? [0.8, 0.15, 0.05] : 
                       [0.9, 0.08, 0.02];
        
        const rand = Math.random();
        let status: 'passed' | 'warning' | 'failed' = 'passed';
        
        if (rand < weights[2]) status = 'failed';
        else if (rand < weights[1] + weights[2]) status = 'warning';
        
        return {
          ruleId: rule.id,
          status,
          message: status === 'passed' ? 'Validation réussie' :
                  status === 'warning' ? 'Attention requise' : 'Erreur détectée',
          details: status !== 'passed' ? 'Détails de la validation...' : undefined,
          affectedItems: status === 'passed' ? 0 : Math.floor(Math.random() * 5) + 1
        };
      });

      const score = Math.round(
        (mockResults.filter(r => r.status === 'passed').length / mockResults.length) * 100
      );

      const validationStatus = score >= 80 ? 'validated' : 
                             score >= 60 ? 'pending' : 'rejected';

      setTimetableValidations(prev => 
        prev.map(validation => 
          validation.formationId === formationId ? {
            ...validation,
            status: validationStatus,
            score,
            results: mockResults,
            validatedAt: new Date(),
            validatedBy: "Système automatique"
          } : validation
        )
      );

      if (validationStatus === 'validated') {
        onValidationComplete(timetableValidations.filter(v => v.status === 'validated').length + 1);
      }

      toast({
        title: validationStatus === 'validated' ? "Validation réussie" : 
               validationStatus === 'pending' ? "Validation partielle" : "Validation échouée",
        description: `Score de qualité: ${score}% - ${mockResults.length} règles vérifiées`,
        variant: validationStatus === 'rejected' ? "destructive" : "default"
      });

    } catch (error) {
      toast({
        title: "Erreur de validation",
        description: "Une erreur est survenue pendant la validation",
        variant: "destructive"
      });
    } finally {
      setIsValidating(false);
      setCurrentStep("");
      setValidationProgress(0);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'validated':
        return <Badge className="bg-emerald-100 text-emerald-800">Validé</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejeté</Badge>;
      default:
        return <Badge variant="outline">À valider</Badge>;
    }
  };

  const getResultIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-4 w-4 text-emerald-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Critique</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800">Avertissement</Badge>;
      default:
        return <Badge className="bg-blue-100 text-blue-800">Info</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-6 w-6" />
            Système de Validation des Emplois du Temps
          </CardTitle>
          <p className="text-muted-foreground">
            Validation automatique et manuelle avec contrôles de qualité avancés
          </p>
        </CardHeader>
      </Card>

      <Tabs defaultValue="validation" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="validation">Validation</TabsTrigger>
          <TabsTrigger value="rules">Règles</TabsTrigger>
          <TabsTrigger value="reports">Rapports</TabsTrigger>
        </TabsList>

        <TabsContent value="validation" className="space-y-4">
          {isValidating && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Validation en cours...
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground mb-2">{currentStep}</div>
                    <Progress value={validationProgress} className="w-full" />
                    <div className="text-xs text-muted-foreground mt-2">
                      {Math.round(validationProgress)}% terminé
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4">
            {timetableValidations.map((validation) => (
              <Card key={validation.formationId}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{validation.formationName}</CardTitle>
                      {validation.validatedAt && (
                        <p className="text-sm text-muted-foreground">
                          Validé le {validation.validatedAt.toLocaleDateString()} par {validation.validatedBy}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      {validation.status !== 'pending' && (
                        <div className="text-center">
                          <div className="text-2xl font-bold">{validation.score}%</div>
                          <div className="text-xs text-muted-foreground">Score</div>
                        </div>
                      )}
                      {getStatusBadge(validation.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {validation.results.length > 0 && (
                    <div className="space-y-3 mb-4">
                      {validation.results.map((result, index) => {
                        const rule = validationRules.find(r => r.id === result.ruleId);
                        return (
                          <div key={index} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                            {getResultIcon(result.status)}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium">{rule?.name}</span>
                                {rule && getSeverityBadge(rule.severity)}
                              </div>
                              <p className="text-sm text-muted-foreground">{result.message}</p>
                              {result.details && (
                                <p className="text-xs text-muted-foreground mt-1">{result.details}</p>
                              )}
                              {result.affectedItems > 0 && (
                                <div className="text-xs text-orange-600 mt-1">
                                  {result.affectedItems} élément(s) concerné(s)
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={() => runValidation(validation.formationId)}
                      disabled={isValidating}
                      variant={validation.status === 'validated' ? 'outline' : 'default'}
                    >
                      <FileCheck className="h-4 w-4 mr-2" />
                      {validation.status === 'validated' ? 'Re-valider' : 'Valider'}
                    </Button>
                    
                    {validation.status === 'validated' && (
                      <Button variant="outline">
                        Générer Rapport
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configuration des Règles de Validation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {validationRules.map((rule) => (
                  <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{rule.name}</span>
                        {getSeverityBadge(rule.severity)}
                      </div>
                      <p className="text-sm text-muted-foreground">{rule.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={rule.enabled ? "default" : "outline"}>
                        {rule.enabled ? "Activé" : "Désactivé"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Rapports de Validation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center p-4 bg-emerald-50 rounded-lg">
                  <div className="text-2xl font-bold text-emerald-600 mb-1">
                    {timetableValidations.filter(v => v.status === 'validated').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Emplois du temps validés</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600 mb-1">
                    {timetableValidations.filter(v => v.status === 'pending').length}
                  </div>
                  <div className="text-sm text-muted-foreground">En attente</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600 mb-1">
                    {timetableValidations.filter(v => v.status === 'rejected').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Rejetés</div>
                </div>
              </div>

              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Système opérationnel</strong> - {validationRules.filter(r => r.enabled).length} règles actives 
                  sur {validationRules.length}. Taux de validation global: {
                    Math.round((timetableValidations.filter(v => v.status === 'validated').length / 
                    timetableValidations.length) * 100)
                  }%
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};