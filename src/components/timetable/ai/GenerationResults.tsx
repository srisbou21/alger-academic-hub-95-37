
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, RotateCcw } from "lucide-react";

interface GenerationResults {
  totalSlots: number;
  scheduledSlots: number;
  conflicts: number;
  optimizationScore: number;
  teacherSatisfaction: number;
  roomUtilization: number;
  recommendations: string[];
}

interface GenerationResultsProps {
  results: GenerationResults;
  onNewGeneration: () => void;
  onValidate: () => void;
  onExport: () => void;
  onShowDetails: () => void;
}

export const GenerationResultsComponent: React.FC<GenerationResultsProps> = ({
  results,
  onNewGeneration,
  onValidate,
  onExport,
  onShowDetails
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-6 w-6 text-green-600" />
          Résultats de la Génération
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{results.scheduledSlots}</p>
            <p className="text-sm text-blue-800">Créneaux planifiés</p>
            <p className="text-xs text-slate-500">sur {results.totalSlots}</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{results.teacherSatisfaction}%</p>
            <p className="text-sm text-green-800">Satisfaction enseignants</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">{results.roomUtilization}%</p>
            <p className="text-sm text-purple-800">Utilisation salles</p>
          </div>
          <div className="text-center p-4 bg-amber-50 rounded-lg">
            <p className="text-2xl font-bold text-amber-600">{results.conflicts}</p>
            <p className="text-sm text-amber-800">Conflits restants</p>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold">Recommandations IA</h4>
          {results.recommendations.map((rec, index) => (
            <div key={index} className="flex items-start gap-2 p-3 bg-slate-50 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
              <span className="text-sm">{rec}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <Button onClick={onValidate} className="bg-green-600 hover:bg-green-700">
            Valider et appliquer
          </Button>
          <Button onClick={onExport} variant="outline">
            Exporter le planning
          </Button>
          <Button onClick={onShowDetails} variant="outline">
            Afficher les détails
          </Button>
          <Button onClick={onNewGeneration} variant="outline">
            <RotateCcw className="h-4 w-4 mr-2" />
            Nouvelle génération
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
