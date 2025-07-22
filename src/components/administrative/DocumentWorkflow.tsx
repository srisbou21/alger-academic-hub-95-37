
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Clock, AlertTriangle, User, FileText, Send } from "lucide-react";

interface WorkflowStep {
  id: string;
  name: string;
  status: "completed" | "current" | "pending";
  assignee?: string;
  completedAt?: string;
  estimatedDuration?: string;
}

interface DocumentWorkflowProps {
  documentId: string;
  documentType: string;
  student: string;
}

export const DocumentWorkflow = ({ documentId, documentType, student }: DocumentWorkflowProps) => {
  const workflowSteps: WorkflowStep[] = [
    {
      id: "request",
      name: "Demande initiée",
      status: "completed",
      assignee: "Système",
      completedAt: "2024-06-10 09:30"
    },
    {
      id: "eligibility", 
      name: "Vérification d'éligibilité",
      status: "completed",
      assignee: "Système",
      completedAt: "2024-06-10 09:31",
      estimatedDuration: "Instantané"
    },
    {
      id: "validation",
      name: "Validation hiérarchique",
      status: "current",
      assignee: "Mme. Benaissa",
      estimatedDuration: "24h"
    },
    {
      id: "generation",
      name: "Génération du document",
      status: "pending",
      estimatedDuration: "2h"
    },
    {
      id: "signature",
      name: "Signature électronique",
      status: "pending",
      estimatedDuration: "Instantané"
    },
    {
      id: "delivery",
      name: "Envoi/Mise à disposition",
      status: "pending",
      estimatedDuration: "Instantané"
    }
  ];

  const getStepIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "current": return <Clock className="h-5 w-5 text-blue-600" />;
      case "pending": return <AlertTriangle className="h-5 w-5 text-slate-400" />;
      default: return <FileText className="h-5 w-5 text-slate-400" />;
    }
  };

  const getStepColor = (status: string) => {
    switch (status) {
      case "completed": return "text-green-800 bg-green-50 border-green-200";
      case "current": return "text-blue-800 bg-blue-50 border-blue-200";
      case "pending": return "text-slate-600 bg-slate-50 border-slate-200";
      default: return "text-slate-600 bg-slate-50 border-slate-200";
    }
  };

  const completedSteps = workflowSteps.filter(step => step.status === "completed").length;
  const progressPercentage = (completedSteps / workflowSteps.length) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Workflow de Validation
        </CardTitle>
        <CardDescription>
          Suivi détaillé du processus pour {documentType} - {student}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progression globale</span>
            <span className="text-sm text-slate-600">{completedSteps}/{workflowSteps.length} étapes</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <div className="space-y-4">
          {workflowSteps.map((step, index) => (
            <div key={step.id}>
              <div className={`flex items-start gap-4 p-4 rounded-lg border ${getStepColor(step.status)}`}>
                <div className="mt-0.5">
                  {getStepIcon(step.status)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium">{step.name}</h3>
                    <Badge variant="outline" className="text-xs">
                      Étape {index + 1}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-slate-600 space-y-1">
                    {step.assignee && (
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>Assigné à: {step.assignee}</span>
                      </div>
                    )}
                    
                    {step.completedAt && (
                      <div className="text-green-600 font-medium">
                        Complété le {new Date(step.completedAt).toLocaleString('fr-FR')}
                      </div>
                    )}
                    
                    {step.estimatedDuration && step.status !== "completed" && (
                      <div className="text-amber-600">
                        Durée estimée: {step.estimatedDuration}
                      </div>
                    )}
                  </div>
                </div>
                
                {step.status === "current" && (
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      Valider
                    </Button>
                    <Button size="sm" variant="outline">
                      Rejeter
                    </Button>
                  </div>
                )}
              </div>
              
              {index < workflowSteps.length - 1 && (
                <div className="flex justify-center py-2">
                  <div className="w-0.5 h-4 bg-slate-200"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        <Separator className="my-6" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4 text-center">
              <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-blue-800">Temps écoulé</p>
              <p className="text-lg font-bold text-blue-900">2h 15min</p>
            </CardContent>
          </Card>
          
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-4 text-center">
              <AlertTriangle className="h-6 w-6 text-amber-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-amber-800">Temps restant estimé</p>
              <p className="text-lg font-bold text-amber-900">26h</p>
            </CardContent>
          </Card>
          
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4 text-center">
              <Send className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-green-800">Livraison prévue</p>
              <p className="text-lg font-bold text-green-900">11 Juin</p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};
