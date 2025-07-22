
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brain } from "lucide-react";

interface PredictiveAnalyticsHeaderProps {
  selectedPeriod: string;
  setSelectedPeriod: (period: string) => void;
  analysisType: string;
  setAnalysisType: (type: string) => void;
}

export const PredictiveAnalyticsHeader = ({ 
  selectedPeriod, 
  setSelectedPeriod, 
  analysisType, 
  setAnalysisType 
}: PredictiveAnalyticsHeaderProps) => {
  return (
    <Card className="border-purple-200">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50">
        <CardTitle className="text-purple-800 flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Analytics Prédictifs & Intelligence Artificielle
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Période d'analyse</label>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Aujourd'hui</SelectItem>
                <SelectItem value="week">Cette semaine</SelectItem>
                <SelectItem value="month">Ce mois</SelectItem>
                <SelectItem value="semester">Ce semestre</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Type d'analyse</label>
            <Select value={analysisType} onValueChange={setAnalysisType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="occupancy">Taux d'occupation</SelectItem>
                <SelectItem value="demand">Prévision demande</SelectItem>
                <SelectItem value="optimization">Optimisation</SelectItem>
                <SelectItem value="behavior">Comportement utilisateurs</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
