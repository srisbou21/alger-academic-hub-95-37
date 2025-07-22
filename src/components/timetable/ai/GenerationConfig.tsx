
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Settings, Play } from "lucide-react";

interface GenerationConfigProps {
  config: {
    semester: string;
    department: string;
    optimizationLevel: 'basic' | 'advanced' | 'expert';
    considerPreferences: boolean;
    avoidConflicts: boolean;
    balanceWorkload: boolean;
    prioritizePopularSlots: boolean;
    maxIterations: number;
    minBreakDuration: number;
  };
  onConfigChange: (config: any) => void;
  onStartGeneration: () => void;
  disabled: boolean;
}

export const GenerationConfig: React.FC<GenerationConfigProps> = ({
  config,
  onConfigChange,
  onStartGeneration,
  disabled
}) => {
  const semesters = [
    { id: 'semester_1', name: 'Semestre 1' },
    { id: 'semester_2', name: 'Semestre 2' },
    { id: 'semester_3', name: 'Semestre 3' },
    { id: 'semester_4', name: 'Semestre 4' }
  ];

  const departments = [
    { id: 'dept_info', name: 'Informatique' },
    { id: 'dept_math', name: 'Mathématiques' },
    { id: 'dept_phy', name: 'Physique' },
    { id: 'dept_eco', name: 'Économie' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Configuration de la Génération
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Semestre</Label>
            <Select 
              value={config.semester || undefined} 
              onValueChange={(value) => onConfigChange({ ...config, semester: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un semestre" />
              </SelectTrigger>
              <SelectContent>
                {semesters.map((semester) => (
                  <SelectItem key={semester.id} value={semester.id}>
                    {semester.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Département</Label>
            <Select 
              value={config.department || undefined} 
              onValueChange={(value) => onConfigChange({ ...config, department: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un département" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Niveau d'optimisation</Label>
          <Select 
            value={config.optimizationLevel} 
            onValueChange={(value: 'basic' | 'advanced' | 'expert') => 
              onConfigChange({ ...config, optimizationLevel: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="basic">Basique</SelectItem>
              <SelectItem value="advanced">Avancé</SelectItem>
              <SelectItem value="expert">Expert</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        <div className="space-y-4">
          <h4 className="font-semibold">Options d'optimisation</h4>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="preferences">Considérer les préférences enseignants</Label>
            <Switch
              id="preferences"
              checked={config.considerPreferences}
              onCheckedChange={(checked) => 
                onConfigChange({ ...config, considerPreferences: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="conflicts">Éviter les conflits</Label>
            <Switch
              id="conflicts"
              checked={config.avoidConflicts}
              onCheckedChange={(checked) => 
                onConfigChange({ ...config, avoidConflicts: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="workload">Équilibrer la charge de travail</Label>
            <Switch
              id="workload"
              checked={config.balanceWorkload}
              onCheckedChange={(checked) => 
                onConfigChange({ ...config, balanceWorkload: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="popular">Prioriser les créneaux populaires</Label>
            <Switch
              id="popular"
              checked={config.prioritizePopularSlots}
              onCheckedChange={(checked) => 
                onConfigChange({ ...config, prioritizePopularSlots: checked })
              }
            />
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="iterations">Nombre max d'itérations</Label>
            <Input
              id="iterations"
              type="number"
              value={config.maxIterations}
              onChange={(e) => 
                onConfigChange({ ...config, maxIterations: parseInt(e.target.value) })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="break">Durée min des pauses (min)</Label>
            <Input
              id="break"
              type="number"
              value={config.minBreakDuration}
              onChange={(e) => 
                onConfigChange({ ...config, minBreakDuration: parseInt(e.target.value) })
              }
            />
          </div>
        </div>

        <Button 
          onClick={onStartGeneration} 
          disabled={disabled}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          <Play className="h-4 w-4 mr-2" />
          Lancer la génération
        </Button>
      </CardContent>
    </Card>
  );
};
