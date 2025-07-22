import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Building } from "lucide-react";
import { WorkflowData, Infrastructure } from './TimetableWorkflow';

interface Props {
  workflowData: WorkflowData;
  updateWorkflowData: (updates: Partial<WorkflowData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const mockInfrastructures: Infrastructure[] = [
  { id: "1", name: "Amphithéâtre A", type: "amphitheater", capacity: 200, equipment: ["Projecteur", "Micro", "Tableau"], isSelected: false },
  { id: "2", name: "Salle 201", type: "classroom", capacity: 50, equipment: ["Projecteur", "Tableau"], isSelected: false },
  { id: "3", name: "Lab Info 1", type: "laboratory", capacity: 30, equipment: ["Ordinateurs", "Projecteur"], isSelected: false },
  { id: "4", name: "Salle 305", type: "classroom", capacity: 40, equipment: ["Projecteur"], isSelected: false }
];

export const InfrastructureSelection = ({ workflowData, updateWorkflowData, onNext }: Props) => {
  const [infrastructures, setInfrastructures] = useState<Infrastructure[]>(mockInfrastructures);

  const toggleInfrastructure = (infraId: string) => {
    setInfrastructures(prev => 
      prev.map(infra => 
        infra.id === infraId ? { ...infra, isSelected: !infra.isSelected } : infra
      )
    );
  };

  const handleValidateSelection = () => {
    const selectedInfrastructures = infrastructures.filter(infra => infra.isSelected);
    updateWorkflowData({ selectedInfrastructures });
    onNext();
  };

  const selectedCount = infrastructures.filter(infra => infra.isSelected).length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Allocation des Infrastructures
          </CardTitle>
          <p className="text-slate-600">
            Sélectionnez les infrastructures à allouer à l'offre de formation
          </p>
        </CardHeader>
        <CardContent>
          {workflowData.selectedFormation && (
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h4 className="font-medium text-blue-900 mb-2">Formation: {workflowData.selectedFormation.name}</h4>
              <p className="text-sm text-blue-700">
                {workflowData.selectedFormation.sections.length} sections, {' '}
                {workflowData.selectedFormation.sections.reduce((total, section) => total + section.groups.length, 0)} groupes
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {infrastructures.map((infra) => (
              <div 
                key={infra.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  infra.isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
                onClick={() => toggleInfrastructure(infra.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{infra.name}</h4>
                  {infra.isSelected && (
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                  )}
                </div>
                <div className="space-y-1 text-sm text-slate-600">
                  <p>Type: {infra.type}</p>
                  <p>Capacité: {infra.capacity} places</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {infra.equipment.map((eq, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {eq}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-600">
              {selectedCount} infrastructure(s) sélectionnée(s)
            </p>
            <Button 
              onClick={handleValidateSelection}
              disabled={selectedCount === 0}
            >
              Valider la Sélection
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};