import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Plus, Settings } from "lucide-react";
import { Specialty, Section, Group } from "../../types/academic";
import { academicConfigService } from "../../services/academicConfigService";
import { useToast } from "@/hooks/use-toast";

interface SectionGroupsTabProps {
  specialties: Specialty[];
}

export const SectionGroupsTab: React.FC<SectionGroupsTabProps> = ({ specialties }) => {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
  const [sections, setSections] = useState<Section[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [sectionsConfig, setSectionsConfig] = useState({
    sectionsCount: 2,
    minGroupsPerSection: 2,
    maxGroupsPerSection: 3,
    groupCapacity: 25
  });
  const { toast } = useToast();

  const handleCreateSectionsGroups = async () => {
    if (!selectedSpecialty) return;

    try {
      const result = await academicConfigService.createSectionsAndGroupsForSpecialty(
        selectedSpecialty, 
        {
          sectionsCount: sectionsConfig.sectionsCount,
          groupsPerSection: {
            min: sectionsConfig.minGroupsPerSection,
            max: sectionsConfig.maxGroupsPerSection
          },
          groupCapacity: sectionsConfig.groupCapacity
        }
      );

      setSections(result.sections);
      setGroups(result.groups);
      
      toast({
        title: "Succès",
        description: `${result.sections.length} sections et ${result.groups.length} groupes créés`
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer les sections et groupes",
        variant: "destructive"
      });
    }
  };

  const specialty = specialties.find(s => s.id === selectedSpecialty);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Gestion des Sections et Groupes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>Spécialité</Label>
            <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une spécialité" />
              </SelectTrigger>
              <SelectContent>
                {specialties.map(specialty => (
                  <SelectItem key={specialty.id} value={specialty.id}>
                    {specialty.name} ({specialty.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedSpecialty && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Configuration automatique
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Créer automatiquement les sections et groupes pour {specialty?.name}
                  ({specialty?.duration} an{specialty?.duration && specialty.duration > 1 ? 's' : ''})
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Nombre de sections</Label>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={sectionsConfig.sectionsCount}
                      onChange={(e) => setSectionsConfig(prev => ({ 
                        ...prev, 
                        sectionsCount: parseInt(e.target.value) || 1 
                      }))}
                    />
                  </div>
                  <div>
                    <Label>Capacité par groupe</Label>
                    <Input
                      type="number"
                      min="10"
                      max="50"
                      value={sectionsConfig.groupCapacity}
                      onChange={(e) => setSectionsConfig(prev => ({ 
                        ...prev, 
                        groupCapacity: parseInt(e.target.value) || 25 
                      }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Min groupes par section</Label>
                    <Input
                      type="number"
                      min="1"
                      max="5"
                      value={sectionsConfig.minGroupsPerSection}
                      onChange={(e) => setSectionsConfig(prev => ({ 
                        ...prev, 
                        minGroupsPerSection: parseInt(e.target.value) || 1 
                      }))}
                    />
                  </div>
                  <div>
                    <Label>Max groupes par section</Label>
                    <Input
                      type="number"
                      min={sectionsConfig.minGroupsPerSection}
                      max="8"
                      value={sectionsConfig.maxGroupsPerSection}
                      onChange={(e) => setSectionsConfig(prev => ({ 
                        ...prev, 
                        maxGroupsPerSection: parseInt(e.target.value) || 2 
                      }))}
                    />
                  </div>
                </div>

                <Button onClick={handleCreateSectionsGroups} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Créer Sections et Groupes
                </Button>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};