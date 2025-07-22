import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  GraduationCap, 
  Users, 
  Building, 
  Plus, 
  Minus, 
  CheckCircle,
  Settings 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FormationOffer {
  id: string;
  name: string;
  level: string;
  domain: string;
  totalStudents: number;
}

interface Section {
  id: string;
  name: string;
  groups: Group[];
}

interface Group {
  id: string;
  number: number;
  capacity: number;
}

interface Infrastructure {
  id: string;
  name: string;
  type: 'amphitheater' | 'classroom' | 'laboratory';
  capacity: number;
  equipment: string[];
}

export const FormationSelector = () => {
  const { toast } = useToast();
  const [selectedFormation, setSelectedFormation] = useState<string>("");
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedInfrastructures, setSelectedInfrastructures] = useState<string[]>([]);
  const [isConfigured, setIsConfigured] = useState(false);

  // Mock data
  const formations: FormationOffer[] = [
    { id: "1", name: "Licence Informatique", level: "L3", domain: "Sciences", totalStudents: 180 },
    { id: "2", name: "Master Réseaux", level: "M1", domain: "Informatique", totalStudents: 60 },
    { id: "3", name: "Licence Mathématiques", level: "L2", domain: "Sciences", totalStudents: 120 }
  ];

  const infrastructures: Infrastructure[] = [
    { id: "1", name: "Amphithéâtre A", type: "amphitheater", capacity: 200, equipment: ["Projecteur", "Micro", "Tableau"] },
    { id: "2", name: "Salle 201", type: "classroom", capacity: 50, equipment: ["Projecteur", "Tableau"] },
    { id: "3", name: "Lab Info 1", type: "laboratory", capacity: 30, equipment: ["Ordinateurs", "Projecteur"] },
    { id: "4", name: "Salle 305", type: "classroom", capacity: 40, equipment: ["Projecteur"] }
  ];

  const addSection = () => {
    const newSection: Section = {
      id: `section_${sections.length + 1}`,
      name: `Section ${sections.length + 1}`,
      groups: [
        { id: `group_1`, number: 1, capacity: 30 }
      ]
    };
    setSections([...sections, newSection]);
  };

  const removeSection = (sectionId: string) => {
    setSections(sections.filter(s => s.id !== sectionId));
  };

  const addGroup = (sectionId: string) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        const newGroupNumber = section.groups.length + 1;
        const newGroup: Group = {
          id: `group_${newGroupNumber}`,
          number: newGroupNumber,
          capacity: 30
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

  const updateGroupCapacity = (sectionId: string, groupId: string, capacity: number) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          groups: section.groups.map(group =>
            group.id === groupId ? { ...group, capacity } : group
          )
        };
      }
      return section;
    }));
  };

  const toggleInfrastructure = (infraId: string) => {
    setSelectedInfrastructures(prev => 
      prev.includes(infraId) 
        ? prev.filter(id => id !== infraId)
        : [...prev, infraId]
    );
  };

  const validateConfiguration = () => {
    if (!selectedFormation || sections.length === 0 || selectedInfrastructures.length === 0) {
      toast({
        title: "Configuration incomplète",
        description: "Veuillez sélectionner une formation, des sections et des infrastructures",
        variant: "destructive"
      });
      return;
    }

    setIsConfigured(true);
    toast({
      title: "Configuration validée",
      description: "Vous pouvez maintenant générer les emplois du temps"
    });
  };

  const selectedFormationData = formations.find(f => f.id === selectedFormation);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6" />
            Configuration de l'Offre de Formation
          </CardTitle>
          <p className="text-slate-600">
            Sélectionnez l'offre de formation et configurez les sections et groupes
          </p>
        </CardHeader>
      </Card>

      {/* Sélection de la formation */}
      <Card>
        <CardHeader>
          <CardTitle>1. Sélection de l'Offre de Formation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Offre de Formation</Label>
            <Select value={selectedFormation} onValueChange={setSelectedFormation}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir une formation" />
              </SelectTrigger>
              <SelectContent>
                {formations.map((formation) => (
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
        </CardContent>
      </Card>

      {/* Configuration des sections */}
      {selectedFormation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                2. Configuration des Sections et Groupes
              </span>
              <Button onClick={addSection} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter Section
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {sections.map((section, sectionIndex) => (
              <div key={section.id} className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium">{section.name}</h4>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => addGroup(section.id)} 
                      size="sm" 
                      variant="outline"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Groupe
                    </Button>
                    {sections.length > 1 && (
                      <Button 
                        onClick={() => removeSection(section.id)} 
                        size="sm" 
                        variant="destructive"
                      >
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
                      <div>
                        <Label className="text-xs">Capacité</Label>
                        <Input 
                          type="number" 
                          value={group.capacity}
                          onChange={(e) => updateGroupCapacity(section.id, group.id, parseInt(e.target.value) || 0)}
                          className="h-8 text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {sections.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Aucune section configurée</p>
                <p className="text-sm">Cliquez sur "Ajouter Section" pour commencer</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Sélection des infrastructures */}
      {sections.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              3. Sélection des Infrastructures
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {infrastructures.map((infra) => (
                <div 
                  key={infra.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedInfrastructures.includes(infra.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  onClick={() => toggleInfrastructure(infra.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{infra.name}</h4>
                    {selectedInfrastructures.includes(infra.id) && (
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
          </CardContent>
        </Card>
      )}

      {/* Validation de la configuration */}
      {selectedFormation && sections.length > 0 && selectedInfrastructures.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              4. Validation de la Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-lg">
                <h4 className="font-medium mb-3">Résumé de la Configuration</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-slate-600">Formation:</span>
                    <p className="font-medium">{selectedFormationData?.name}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Sections:</span>
                    <p className="font-medium">{sections.length}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Groupes totaux:</span>
                    <p className="font-medium">
                      {sections.reduce((total, section) => total + section.groups.length, 0)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button 
                  onClick={validateConfiguration}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={isConfigured}
                >
                  {isConfigured ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Configuration Validée
                    </>
                  ) : (
                    "Valider la Configuration"
                  )}
                </Button>
                
                {isConfigured && (
                  <Button variant="outline">
                    Passer à la Génération
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};