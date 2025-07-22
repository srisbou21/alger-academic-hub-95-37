import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, Edit, RotateCcw, AlertTriangle } from "lucide-react";
import { WorkflowData, GeneratedTimetable } from './TimetableWorkflow';

interface Props {
  workflowData: WorkflowData;
  updateWorkflowData: (updates: Partial<WorkflowData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const TimetableValidation = ({ workflowData, updateWorkflowData, onNext }: Props) => {
  const [timetables, setTimetables] = useState<GeneratedTimetable[]>(workflowData.generatedTimetables);
  const [editingTimetable, setEditingTimetable] = useState<GeneratedTimetable | null>(null);
  const [swapMode, setSwapMode] = useState(false);
  const [selectedForSwap, setSelectedForSwap] = useState<string[]>([]);

  const validateTimetable = (timetableId: string) => {
    setTimetables(prev => 
      prev.map(t => 
        t.id === timetableId ? { ...t, isValidated: true } : t
      )
    );
  };

  const invalidateTimetable = (timetableId: string) => {
    setTimetables(prev => 
      prev.map(t => 
        t.id === timetableId ? { ...t, isValidated: false } : t
      )
    );
  };

  const swapTimetables = () => {
    if (selectedForSwap.length === 2) {
      const [id1, id2] = selectedForSwap;
      setTimetables(prev => {
        const t1 = prev.find(t => t.id === id1);
        const t2 = prev.find(t => t.id === id2);
        if (t1 && t2) {
          return prev.map(t => {
            if (t.id === id1) {
              return { ...t, day: t2.day, startTime: t2.startTime, endTime: t2.endTime, room: t2.room, isValidated: false };
            }
            if (t.id === id2) {
              return { ...t, day: t1.day, startTime: t1.startTime, endTime: t1.endTime, room: t1.room, isValidated: false };
            }
            return t;
          });
        }
        return prev;
      });
      setSelectedForSwap([]);
      setSwapMode(false);
    }
  };

  const handleValidateAll = () => {
    const validatedTimetables = timetables.map(t => ({ ...t, isValidated: true }));
    setTimetables(validatedTimetables);
    updateWorkflowData({ generatedTimetables: validatedTimetables });
    onNext();
  };

  const validatedCount = timetables.filter(t => t.isValidated).length;
  const totalCount = timetables.length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Validation des Emplois du Temps
          </CardTitle>
          <p className="text-slate-600">
            Validez et modifiez manuellement les emplois du temps générés
          </p>
        </CardHeader>
        <CardContent>
          {/* Validation Progress */}
          <div className="bg-slate-50 p-4 rounded-lg mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Progression de la validation</span>
              <span className="text-sm text-slate-600">{validatedCount}/{totalCount}</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${(validatedCount / totalCount) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-4 mb-6">
            <Button
              variant={swapMode ? "default" : "outline"}
              onClick={() => setSwapMode(!swapMode)}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Mode Permutation
            </Button>
            
            {swapMode && selectedForSwap.length === 2 && (
              <Button onClick={swapTimetables} className="bg-orange-600 hover:bg-orange-700">
                Permuter les Créneaux
              </Button>
            )}
          </div>

          {/* Timetables List */}
          <div className="space-y-3">
            {timetables.map((timetable) => (
              <div 
                key={timetable.id} 
                className={`p-4 border rounded-lg transition-colors ${
                  timetable.isValidated 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-slate-200 bg-white'
                } ${
                  swapMode 
                    ? selectedForSwap.includes(timetable.id)
                      ? 'ring-2 ring-blue-500'
                      : 'cursor-pointer hover:bg-blue-50'
                    : ''
                }`}
                onClick={() => {
                  if (swapMode) {
                    if (selectedForSwap.includes(timetable.id)) {
                      setSelectedForSwap(prev => prev.filter(id => id !== timetable.id));
                    } else if (selectedForSwap.length < 2) {
                      setSelectedForSwap(prev => [...prev, timetable.id]);
                    }
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Badge variant="outline">{timetable.type.toUpperCase()}</Badge>
                    <div>
                      <p className="font-medium">{timetable.subject}</p>
                      <p className="text-sm text-slate-600">{timetable.targetName}</p>
                      <p className="text-xs text-slate-500">
                        {timetable.teacher} • {timetable.room}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium">{timetable.day}</p>
                      <p className="text-sm text-slate-600">
                        {timetable.startTime} - {timetable.endTime}
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      {!swapMode && (
                        <>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline">
                                <Edit className="h-3 w-3" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Modifier l'emploi du temps</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <p className="text-sm text-slate-600">
                                  Modification de: {timetable.subject} - {timetable.targetName}
                                </p>
                                {/* Ici pourrait être ajouté un formulaire de modification */}
                                <Button onClick={() => invalidateTimetable(timetable.id)}>
                                  Marquer comme modifié
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                          
                          {timetable.isValidated ? (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => invalidateTimetable(timetable.id)}
                            >
                              <AlertTriangle className="h-3 w-3" />
                            </Button>
                          ) : (
                            <Button 
                              size="sm" 
                              onClick={() => validateTimetable(timetable.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-3 w-3" />
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Validation Actions */}
          <div className="flex gap-4 mt-6">
            <Button 
              onClick={handleValidateAll}
              disabled={validatedCount < totalCount}
              className="bg-green-600 hover:bg-green-700"
            >
              Valider Tous les Emplois du Temps
            </Button>
            <Button variant="outline">
              Régénérer les Non-Validés
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};