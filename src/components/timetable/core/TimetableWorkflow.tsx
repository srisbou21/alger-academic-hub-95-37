import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { FormationOfferSelection } from './FormationOfferSelection';
import { InfrastructureSelection } from './InfrastructureSelection';
import { TimetableGeneration } from './TimetableGeneration';
import { TimetableValidation } from './TimetableValidation';
import { TimetableOptimization } from './TimetableOptimization';
import { InfrastructureReservation } from './InfrastructureReservation';
import { 
  GraduationCap, 
  Building, 
  Calendar, 
  CheckCircle, 
  Zap, 
  BookOpen,
  ArrowRight
} from "lucide-react";

export interface FormationOffer {
  id: string;
  name: string;
  level: string;
  domain: string;
  totalStudents: number;
  sections: Section[];
}

export interface Section {
  id: string;
  name: string;
  number: number;
  groups: Group[];
}

export interface Group {
  id: string;
  number: number;
  capacity: number;
  firstGroupNumber: number;
  lastGroupNumber: number;
}

export interface Infrastructure {
  id: string;
  name: string;
  type: 'amphitheater' | 'classroom' | 'laboratory';
  capacity: number;
  equipment: string[];
  isSelected: boolean;
}

export interface GeneratedTimetable {
  id: string;
  type: 'lecture' | 'td' | 'tp';
  subject: string;
  teacher: string;
  targetId: string; // section or group id
  targetName: string;
  day: string;
  startTime: string;
  endTime: string;
  room: string;
  isValidated: boolean;
}

export interface WorkflowData {
  selectedFormation: FormationOffer | null;
  selectedInfrastructures: Infrastructure[];
  generatedTimetables: GeneratedTimetable[];
  isOptimized: boolean;
  reservations: any[];
}

export const TimetableWorkflow = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [workflowData, setWorkflowData] = useState<WorkflowData>({
    selectedFormation: null,
    selectedInfrastructures: [],
    generatedTimetables: [],
    isOptimized: false,
    reservations: []
  });

  const steps = [
    {
      id: 0,
      title: "Sélection Formation",
      description: "Choisir l'offre de formation",
      icon: GraduationCap,
      component: FormationOfferSelection
    },
    {
      id: 1,
      title: "Infrastructure",
      description: "Allouer les infrastructures",
      icon: Building,
      component: InfrastructureSelection
    },
    {
      id: 2,
      title: "Génération",
      description: "Générer les emplois du temps",
      icon: Calendar,
      component: TimetableGeneration
    },
    {
      id: 3,
      title: "Validation",
      description: "Valider et modifier",
      icon: CheckCircle,
      component: TimetableValidation
    },
    {
      id: 4,
      title: "Optimisation",
      description: "Optimiser (optionnel)",
      icon: Zap,
      component: TimetableOptimization
    },
    {
      id: 5,
      title: "Réservation",
      description: "Réserver les infrastructures",
      icon: BookOpen,
      component: InfrastructureReservation
    }
  ];

  const canProceedToStep = (stepIndex: number) => {
    switch (stepIndex) {
      case 1:
        return workflowData.selectedFormation !== null;
      case 2:
        return workflowData.selectedInfrastructures.length > 0;
      case 3:
        return workflowData.generatedTimetables.length > 0;
      case 4:
        return workflowData.generatedTimetables.every(t => t.isValidated);
      case 5:
        return workflowData.generatedTimetables.every(t => t.isValidated);
      default:
        return true;
    }
  };

  const updateWorkflowData = (updates: Partial<WorkflowData>) => {
    setWorkflowData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1 && canProceedToStep(currentStep + 1)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            Système de Gestion d'Emplois du Temps
          </CardTitle>
          <p className="text-slate-600">
            Workflow complet de création et gestion des emplois du temps
          </p>
        </CardHeader>
      </Card>

      {/* Progress Stepper */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                  index === currentStep 
                    ? 'bg-blue-100 text-blue-800' 
                    : index < currentStep 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-slate-100 text-slate-600'
                }`}>
                  <step.icon className="h-4 w-4" />
                  <div>
                    <p className="font-medium text-sm">{step.title}</p>
                    <p className="text-xs opacity-75">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight className="h-4 w-4 mx-2 text-slate-400" />
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <Button 
              variant="outline" 
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              Précédent
            </Button>
            <Button 
              onClick={nextStep}
              disabled={!canProceedToStep(currentStep + 1) || currentStep === steps.length - 1}
            >
              Suivant
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Step Component */}
      <CurrentStepComponent 
        workflowData={workflowData}
        updateWorkflowData={updateWorkflowData}
        onNext={nextStep}
        onPrev={prevStep}
      />

      {/* Status Summary */}
      <Card>
        <CardHeader>
          <CardTitle>État du Workflow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-slate-600">Formation</p>
              <Badge variant={workflowData.selectedFormation ? "default" : "secondary"}>
                {workflowData.selectedFormation ? "Sélectionnée" : "Non sélectionnée"}
              </Badge>
            </div>
            <div className="text-center">
              <p className="text-sm text-slate-600">Infrastructures</p>
              <Badge variant={workflowData.selectedInfrastructures.length > 0 ? "default" : "secondary"}>
                {workflowData.selectedInfrastructures.length} allouées
              </Badge>
            </div>
            <div className="text-center">
              <p className="text-sm text-slate-600">Emplois du temps</p>
              <Badge variant={workflowData.generatedTimetables.length > 0 ? "default" : "secondary"}>
                {workflowData.generatedTimetables.length} générés
              </Badge>
            </div>
            <div className="text-center">
              <p className="text-sm text-slate-600">Réservations</p>
              <Badge variant={workflowData.reservations.length > 0 ? "default" : "secondary"}>
                {workflowData.reservations.length} actives
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};