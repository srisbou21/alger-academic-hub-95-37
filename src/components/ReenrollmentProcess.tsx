
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, AlertTriangle, User, BookOpen, CreditCard, Settings, IdCard } from "lucide-react";
import { useState } from "react";
import { EligibilityCheck } from "./EligibilityCheck";
import { PathwaySelection } from "./PathwaySelection";
import { PaymentProcess } from "./PaymentProcess";
import { StudentCardGeneration } from "./StudentCardGeneration";

export const ReenrollmentProcess = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [studentData, setStudentData] = useState({
    id: "ETU-2024-001",
    name: "Sarah Benhamou",
    level: "L3",
    eligible: false,
    informationUpdated: false,
    pathwaySelected: false,
    paymentCompleted: false,
    cardGenerated: false
  });

  const steps = [
    { id: 1, title: "Vérification éligibilité", icon: CheckCircle, component: EligibilityCheck },
    { id: 2, title: "Mise à jour infos", icon: User, component: null },
    { id: 3, title: "Choix parcours", icon: BookOpen, component: PathwaySelection },
    { id: 4, title: "Paiement", icon: CreditCard, component: PaymentProcess },
    { id: 5, title: "Validation admin", icon: Settings, component: null },
    { id: 6, title: "Génération carte", icon: IdCard, component: StudentCardGeneration }
  ];

  const getStepStatus = (stepId: number) => {
    if (completedSteps.includes(stepId)) return "completed";
    if (currentStep === stepId) return "current";
    return "pending";
  };

  const getStepColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800 border-green-200";
      case "current": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  const handleStepComplete = (stepId: number) => {
    setCompletedSteps([...completedSteps, stepId]);
    if (stepId < steps.length) {
      setCurrentStep(stepId + 1);
    }
  };

  const calculateProgress = () => {
    return (completedSteps.length / steps.length) * 100;
  };

  const CurrentStepComponent = steps.find(step => step.id === currentStep)?.component;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Processus de Réinscription</h2>
          <p className="text-slate-600">Année universitaire 2024-2025</p>
        </div>
        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
          Étape {currentStep} sur {steps.length}
        </Badge>
      </div>

      {/* Informations Étudiant */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Informations Étudiant
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-slate-600">Nom complet</p>
              <p className="font-semibold">{studentData.name}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Numéro étudiant</p>
              <p className="font-semibold">{studentData.id}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Niveau actuel</p>
              <p className="font-semibold">{studentData.level} Économie</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Barre de progression */}
      <Card>
        <CardContent className="p-6">
          <div className="mb-4">
            <div className="flex justify-between text-sm text-slate-600 mb-2">
              <span>Progression</span>
              <span>{Math.round(calculateProgress())}%</span>
            </div>
            <Progress value={calculateProgress()} className="h-2" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
            {steps.map((step) => {
              const status = getStepStatus(step.id);
              const IconComponent = step.icon;
              return (
                <div key={step.id} className="text-center">
                  <div className={`p-2 rounded-lg border ${getStepColor(status)} mb-2`}>
                    <IconComponent className="h-6 w-6 mx-auto" />
                  </div>
                  <p className="text-xs font-medium">{step.title}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Étape Actuelle */}
      {CurrentStepComponent && (
        <CurrentStepComponent 
          studentData={studentData}
          onComplete={() => handleStepComplete(currentStep)}
          onUpdate={setStudentData}
        />
      )}

      {/* Étapes sans composant spécifique */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Mise à Jour des Informations Personnelles
            </CardTitle>
            <CardDescription>
              Vérifiez et mettez à jour vos informations personnelles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Adresse domicile</h3>
                  <p className="text-sm text-slate-600">123 Rue de la Liberté, Alger</p>
                  <Button size="sm" variant="outline" className="mt-2">Modifier</Button>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Contact</h3>
                  <p className="text-sm text-slate-600">sarah.benhamou@email.com</p>
                  <Button size="sm" variant="outline" className="mt-2">Modifier</Button>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => handleStepComplete(2)} className="bg-blue-600 hover:bg-blue-700">
                  Confirmer les informations
                </Button>
                <Button variant="outline">Modifier d'autres informations</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 5 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Validation Administrative
            </CardTitle>
            <CardDescription>
              Votre dossier est en cours de validation par l'administration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-amber-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Validation en cours</h3>
              <p className="text-slate-600 mb-4">
                Votre dossier de réinscription est en cours de validation par l'administration.
                Vous recevrez une notification une fois la validation terminée.
              </p>
              <Button onClick={() => handleStepComplete(5)} className="bg-green-600 hover:bg-green-700">
                Simuler validation administrative
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Récapitulatif */}
      {completedSteps.length === steps.length && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Réinscription Terminée !
            </h3>
            <p className="text-green-700 mb-4">
              Votre processus de réinscription est maintenant complet. 
              Vous pouvez télécharger votre nouvelle carte d'étudiant.
            </p>
            <Button className="bg-green-600 hover:bg-green-700">
              Télécharger la carte d'étudiant
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
