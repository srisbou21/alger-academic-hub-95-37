import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Minus, GraduationCap } from "lucide-react";
import { WorkflowData, FormationOffer, Section, Group } from './TimetableWorkflow';

interface Props {
  workflowData: WorkflowData;
  updateWorkflowData: (updates: Partial<WorkflowData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const mockFormations = [
  { id: "1", name: "Licence Informatique", level: "L3", domain: "Sciences", totalStudents: 180 },
  { id: "2", name: "Master Réseaux", level: "M1", domain: "Informatique", totalStudents: 60 },
  { id: "3", name: "Licence Mathématiques", level: "L2", domain: "Sciences", totalStudents: 120 }
];

export const FormationOfferSelection = ({ workflowData, updateWorkflowData, onNext }: Props) => {
  const [selectedFormationId, setSelectedFormationId] = useState("");
  const [sections, setSections] = useState<Section[]>([]);

  const addSection = () => {
    const newSection: Section = {
      id: `section_${sections.length + 1}`,
      name: `Section ${sections.length + 1}`,
      number: sections.length + 1,
      groups: []
    };
    setSections([...sections, newSection]);
  };

  const removeSection = (sectionId: string) => {
    setSections(sections.filter(s => s.id !== sectionId));
  };

  const addGroup = (sectionId: string) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        const newGroup: Group = {
          id: `group_${section.groups.length + 1}`,
          number: section.groups.length + 1,
          capacity: 30,
          firstGroupNumber: 1,
          lastGroupNumber: section.groups.length + 1
        };
        return { ...section, groups: [...section.groups, newGroup] };
      }
      return section;
    }));
  };

  const removeGroup = (sectionId: string, groupId: string) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        return { ...section, groups: section.groups.filter(g => g.id !== groupId) };
      }
      return section;
    }));
  };

  const updateGroup = (sectionId: string, groupId: string, updates: Partial<Group>) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          groups: section.groups.map(group =>
            group.id === groupId ? { ...group, ...updates } : group
          )
        };
      }
      return section;
    }));
  };

  const handleValidateSelection = () => {
    const baseFormation = mockFormations.find(f => f.id === selectedFormationId);
    if (baseFormation && sections.length > 0) {
      const formation: FormationOffer = {
        ...baseFormation,
        sections
      };
      updateWorkflowData({ selectedFormation: formation });
      onNext();
    }
  };

  const selectedFormationData = mockFormations.find(f => f.id === selectedFormationId);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Sélection de l'Offre de Formation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Formation Selection */}
          <div>
            <Label>Offre de Formation</Label>
            <Select value={selectedFormationId} onValueChange={setSelectedFormationId}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir une formation" />
              </SelectTrigger>
              <SelectContent>
                {mockFormations.map((formation) => (
                  <SelectItem key={formation.id} value={formation.id}>
                    {formation.name} - {formation.level} ({formation.totalStudents} étudiants)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedFormationData && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Formation Sélectionnée</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-blue-600">Nom:</span>
                  <p className="font-medium">{selectedFormationData.name}</p>
                </div>
                <div>
                  <span className="text-blue-600">Niveau:</span>
                  <p className="font-medium">{selectedFormationData.level}</p>
                </div>
                <div>
                  <span className="text-blue-600">Domaine:</span>
                  <p className="font-medium">{selectedFormationData.domain}</p>
                </div>
                <div>
                  <span className="text-blue-600">Étudiants:</span>
                  <p className="font-medium">{selectedFormationData.totalStudents}</p>
                </div>
              </div>
            </div>
          )}

          {/* Sections Configuration */}
          {selectedFormationId && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <Label>Configuration des Sections et Groupes</Label>
                <Button onClick={addSection} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter Section
                </Button>
              </div>

              {sections.map((section) => (
                <div key={section.id} className="border border-slate-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">{section.name}</h4>
                    <div className="flex gap-2">
                      <Button onClick={() => addGroup(section.id)} size="sm" variant="outline">
                        <Plus className="h-3 w-3 mr-1" />
                        Groupe
                      </Button>
                      {sections.length > 1 && (
                        <Button onClick={() => removeSection(section.id)} size="sm" variant="destructive">
                          <Minus className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {section.groups.map((group) => (
                      <div key={group.id} className="bg-slate-50 p-3 rounded border">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">Groupe {group.number}</span>
                          {section.groups.length > 1 && (
                            <Button 
                              onClick={() => removeGroup(section.id, group.id)}
                              size="sm" 
                              variant="ghost"
                              className="h-6 w-6 p-0"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                        <div className="space-y-2">
                          <div>
                            <Label className="text-xs">Capacité</Label>
                            <Input 
                              type="number" 
                              value={group.capacity}
                              onChange={(e) => updateGroup(section.id, group.id, { capacity: parseInt(e.target.value) || 0 })}
                              className="h-8 text-sm"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-1">
                            <div>
                              <Label className="text-xs">Premier n°</Label>
                              <Input 
                                type="number" 
                                value={group.firstGroupNumber}
                                onChange={(e) => updateGroup(section.id, group.id, { firstGroupNumber: parseInt(e.target.value) || 1 })}
                                className="h-8 text-sm"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Dernier n°</Label>
                              <Input 
                                type="number" 
                                value={group.lastGroupNumber}
                                onChange={(e) => updateGroup(section.id, group.id, { lastGroupNumber: parseInt(e.target.value) || 1 })}
                                className="h-8 text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {selectedFormationId && sections.length > 0 && (
                <Button onClick={handleValidateSelection} className="w-full">
                  Valider et Continuer
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};