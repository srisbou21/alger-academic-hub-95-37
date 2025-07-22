
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Department, Specialty } from '@/types/academic';
import { academicConfigService } from '../../../services/academicConfigService';

interface SpecialtyFormProps {
  specialty?: Specialty;
  departments: Department[];
  onClose: () => void;
  onSave: (specialty: Omit<Specialty, 'id' | 'createdAt' | 'updatedAt'>, sectionsConfig?: {
    sectionsCount: number;
    groupsPerSection: { min: number; max: number };
    groupCapacity: number;
  }) => void;
}

export const SpecialtyForm: React.FC<SpecialtyFormProps> = ({ specialty, departments, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: specialty?.name || '',
    code: specialty?.code || '',
    filiereId: specialty?.filiereId || '',
    level: specialty?.level || 'licence' as 'licence' | 'master' | 'doctorat',
    description: specialty?.description || '',
    duration: specialty?.duration || 3,
    isActive: specialty?.isActive ?? true
  });

  const [sectionsConfig, setSectionsConfig] = useState({
    enabled: !specialty, // Activé par défaut pour une nouvelle spécialité
    sectionsCount: 2,
    minGroupsPerSection: 2,
    maxGroupsPerSection: 3,
    groupCapacity: 25
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom de la spécialité est requis';
    }

    if (!formData.code.trim()) {
      newErrors.code = 'Le code de la spécialité est requis';
    }

    if (!formData.filiereId) {
      newErrors.filiereId = 'La filière est requise';
    }

    if (formData.duration < 1 || formData.duration > 8) {
      newErrors.duration = 'La durée doit être entre 1 et 8 ans';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const sectionsConfigToSave = sectionsConfig.enabled ? {
        sectionsCount: sectionsConfig.sectionsCount,
        groupsPerSection: {
          min: sectionsConfig.minGroupsPerSection,
          max: sectionsConfig.maxGroupsPerSection
        },
        groupCapacity: sectionsConfig.groupCapacity
      } : undefined;

      onSave({ ...formData, isValidated: false }, sectionsConfigToSave);
    }
  };

  const handleInputChange = (field: string, value: string | boolean | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {specialty ? 'Modifier la spécialité' : 'Ajouter une spécialité'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom de la spécialité *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Ex: Génie Logiciel"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">Code *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => handleInputChange('code', e.target.value.toUpperCase())}
                placeholder="Ex: GL"
                className={errors.code ? 'border-red-500' : ''}
              />
              {errors.code && (
                <p className="text-sm text-red-500">{errors.code}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="filiereId">Filière *</Label>
            <Select
              value={formData.filiereId}
              onValueChange={(value) => handleInputChange('filiereId', value)}
            >
              <SelectTrigger className={errors.filiereId ? 'border-red-500' : ''}>
                <SelectValue placeholder="Sélectionner une filière" />
              </SelectTrigger>
              <SelectContent>
                {departments.map(department => (
                  <SelectItem key={department.id} value={department.id}>
                    {department.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.filiereId && (
              <p className="text-sm text-red-500">{errors.filiereId}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="level">Niveau *</Label>
              <Select
                value={formData.level}
                onValueChange={(value: 'licence' | 'master' | 'doctorat') => handleInputChange('level', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="licence">Licence</SelectItem>
                  <SelectItem value="master">Master</SelectItem>
                  <SelectItem value="doctorat">Doctorat</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Durée (années) *</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                max="8"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 3)}
                className={errors.duration ? 'border-red-500' : ''}
              />
              {errors.duration && (
                <p className="text-sm text-red-500">{errors.duration}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Description de la spécialité"
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => handleInputChange('isActive', checked)}
            />
            <Label htmlFor="isActive">Spécialité active</Label>
          </div>

          {!specialty && (
            <>
              <Separator className="my-6" />
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Configuration des Sections et Groupes</CardTitle>
                  <p className="text-sm text-slate-600">
                    Créer automatiquement les sections et groupes basés sur la durée de la spécialité
                    ({formData.duration} {formData.duration > 1 ? 'années' : 'année'} = {formData.duration * 2} semestres)
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="createSections"
                      checked={sectionsConfig.enabled}
                      onCheckedChange={(checked) => setSectionsConfig(prev => ({ ...prev, enabled: checked }))}
                    />
                    <Label htmlFor="createSections">
                      Créer automatiquement les sections et groupes
                    </Label>
                  </div>

                  {sectionsConfig.enabled && (
                    <div className="space-y-4 pl-6 border-l-2 border-blue-200">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="sectionsCount">Nombre de sections</Label>
                          <Input
                            id="sectionsCount"
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

                        <div className="space-y-2">
                          <Label htmlFor="groupCapacity">Capacité par groupe</Label>
                          <Input
                            id="groupCapacity"
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
                        <div className="space-y-2">
                          <Label htmlFor="minGroups">Min groupes/section</Label>
                          <Input
                            id="minGroups"
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

                        <div className="space-y-2">
                          <Label htmlFor="maxGroups">Max groupes/section</Label>
                          <Input
                            id="maxGroups"
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

                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-blue-700">
                          <strong>Résumé:</strong> {sectionsConfig.sectionsCount} section(s) • 
                          {sectionsConfig.minGroupsPerSection}-{sectionsConfig.maxGroupsPerSection} groupes par section • 
                          Capacité: {sectionsConfig.groupCapacity} étudiants/groupe
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                          Chaque section aura des groupes TD et TP créés automatiquement
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">
              {specialty ? 'Modifier' : 'Ajouter'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
