import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Cpu, CheckCircle } from "lucide-react";
import { WorkflowData, GeneratedTimetable } from './TimetableWorkflow';

interface Props {
  workflowData: WorkflowData;
  updateWorkflowData: (updates: Partial<WorkflowData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const TimetableGeneration = ({ workflowData, updateWorkflowData, onNext }: Props) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generatedTimetables, setGeneratedTimetables] = useState<GeneratedTimetable[]>([]);

  const generateTimetables = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);

    // Simulation de génération
    const mockTimetables: GeneratedTimetable[] = [];
    
    if (workflowData.selectedFormation) {
      // Générer cours magistraux pour sections
      workflowData.selectedFormation.sections.forEach((section, index) => {
        mockTimetables.push({
          id: `lecture_${section.id}`,
          type: 'lecture',
          subject: 'Programmation Avancée',
          teacher: 'Dr. Martin',
          targetId: section.id,
          targetName: section.name,
          day: 'Lundi',
          startTime: '08:00',
          endTime: '09:30',
          room: workflowData.selectedInfrastructures[0]?.name || 'Salle TBD',
          isValidated: false
        });

        // Générer TD/TP pour groupes
        section.groups.forEach((group, groupIndex) => {
          mockTimetables.push({
            id: `td_${group.id}`,
            type: 'td',
            subject: 'TD Programmation',
            teacher: 'Mme. Dupont',
            targetId: group.id,
            targetName: `${section.name} - Groupe ${group.number}`,
            day: 'Mardi',
            startTime: '14:00',
            endTime: '15:30',
            room: workflowData.selectedInfrastructures[1]?.name || 'Salle TBD',
            isValidated: false
          });

          mockTimetables.push({
            id: `tp_${group.id}`,
            type: 'tp',
            subject: 'TP Programmation',
            teacher: 'M. Bernard',
            targetId: group.id,
            targetName: `${section.name} - Groupe ${group.number}`,
            day: 'Mercredi',
            startTime: '09:00',
            endTime: '11:00',
            room: workflowData.selectedInfrastructures[2]?.name || 'Lab TBD',
            isValidated: false
          });
        });
      });
    }

    // Animation de progression
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 150));
      setGenerationProgress(i);
    }

    setGeneratedTimetables(mockTimetables);
    updateWorkflowData({ generatedTimetables: mockTimetables });
    setIsGenerating(false);
  };

  const handleContinue = () => {
    onNext();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Génération des Emplois du Temps
          </CardTitle>
          <p className="text-slate-600">
            Génération automatique selon les contraintes pédagogiques
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Summary */}
          {workflowData.selectedFormation && (
            <div className="bg-slate-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Configuration</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-slate-600">Formation:</span>
                  <p className="font-medium">{workflowData.selectedFormation.name}</p>
                </div>
                <div>
                  <span className="text-slate-600">Sections:</span>
                  <p className="font-medium">{workflowData.selectedFormation.sections.length}</p>
                </div>
                <div>
                  <span className="text-slate-600">Groupes:</span>
                  <p className="font-medium">
                    {workflowData.selectedFormation.sections.reduce((total, section) => total + section.groups.length, 0)}
                  </p>
                </div>
                <div>
                  <span className="text-slate-600">Infrastructures:</span>
                  <p className="font-medium">{workflowData.selectedInfrastructures.length}</p>
                </div>
              </div>
            </div>
          )}

          {/* Generation Controls */}
          <div className="flex gap-4">
            <Button 
              onClick={generateTimetables}
              disabled={isGenerating}
              className="bg-green-600 hover:bg-green-700"
            >
              {isGenerating ? (
                <>
                  <Cpu className="mr-2 h-4 w-4 animate-spin" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <Calendar className="mr-2 h-4 w-4" />
                  Générer Emplois du Temps
                </>
              )}
            </Button>
          </div>

          {/* Progress */}
          {isGenerating && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Génération automatique...</span>
                <span>{generationProgress}%</span>
              </div>
              <Progress value={generationProgress} className="h-2" />
            </div>
          )}

          {/* Generated Timetables */}
          {generatedTimetables.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Emplois du Temps Générés
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {generatedTimetables.map((timetable) => (
                    <div key={timetable.id} className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-4">
                        <Badge variant="outline">{timetable.type.toUpperCase()}</Badge>
                        <div>
                          <p className="font-medium">{timetable.subject}</p>
                          <p className="text-sm text-slate-600">{timetable.targetName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{timetable.day}</p>
                        <p className="text-sm text-slate-600">
                          {timetable.startTime} - {timetable.endTime}
                        </p>
                        <p className="text-xs text-slate-500">
                          {timetable.teacher} • {timetable.room}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Button onClick={handleContinue} className="w-full mt-4">
                  Continuer vers la Validation
                </Button>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};