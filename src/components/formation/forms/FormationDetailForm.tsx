
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, Plus, X, Save, Users, BookOpen, Target, Briefcase } from "lucide-react";
import { FormationOffer } from "../../../types/academic";

interface FormationDetailFormProps {
  formation: FormationOffer | null;
  onSave: (formation: FormationOffer) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

export const FormationDetailForm = ({ formation, onSave, onCancel, isEditing = false }: FormationDetailFormProps) => {
  const [formData, setFormData] = useState<Partial<FormationOffer>>({
    name: '',
    code: '',
    diplomaType: 'licence',
    duration: 6,
    modality: 'presential',
    language: 'Français',
    maxCapacity: 100,
    admissionRequirements: '',
    pedagogicalObjectives: [],
    careerProspects: [],
    responsibleName: '',
    academicYear: '2024-2025',
    totalECTS: 180
  });

  const [newObjective, setNewObjective] = useState('');
  const [newProspect, setNewProspect] = useState('');

  useEffect(() => {
    if (formation) {
      setFormData(formation);
    }
  }, [formation]);

  const addObjective = () => {
    if (newObjective.trim()) {
      setFormData(prev => ({
        ...prev,
        pedagogicalObjectives: [...(prev.pedagogicalObjectives || []), newObjective.trim()]
      }));
      setNewObjective('');
    }
  };

  const removeObjective = (index: number) => {
    setFormData(prev => ({
      ...prev,
      pedagogicalObjectives: prev.pedagogicalObjectives?.filter((_, i) => i !== index) || []
    }));
  };

  const addProspect = () => {
    if (newProspect.trim()) {
      setFormData(prev => ({
        ...prev,
        careerProspects: [...(prev.careerProspects || []), newProspect.trim()]
      }));
      setNewProspect('');
    }
  };

  const removeProspect = (index: number) => {
    setFormData(prev => ({
      ...prev,
      careerProspects: prev.careerProspects?.filter((_, i) => i !== index) || []
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.code) {
      const updatedFormation: FormationOffer = {
        id: formation?.id || Date.now().toString(),
        name: formData.name!,
        code: formData.code!,
        specialtyId: formData.specialtyId || "default",
        level: formData.level || "L1",
        academicYear: formData.academicYear!,
        modules: formation?.modules || [],
        sections: formation?.sections || [],
        diplomaType: formData.diplomaType || 'licence',
        duration: formData.duration || 6,
        modality: formData.modality || 'presential',
        language: formData.language || 'Français',
        maxCapacity: formData.maxCapacity || 100,
        admissionRequirements: formData.admissionRequirements || '',
        pedagogicalObjectives: formData.pedagogicalObjectives || [],
        careerProspects: formData.careerProspects || [],
        status: formation?.status || 'draft',
        responsibleId: formData.responsibleId || '',
        responsibleName: formData.responsibleName || '',
        lastModifiedBy: 'current_user',
        validationHistory: formation?.validationHistory || [],
        totalECTS: formData.totalECTS || 180,
        createdAt: formation?.createdAt || new Date(),
        updatedAt: new Date()
      };
      
      onSave(updatedFormation);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          {isEditing ? 'Modifier la Formation' : 'Détails de la Formation'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="structure">Structure</TabsTrigger>
            <TabsTrigger value="objectives">Objectifs</TabsTrigger>
            <TabsTrigger value="prospects">Débouchés</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nom de la formation *</Label>
                <Input
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="ex: Licence Informatique"
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="code">Code formation *</Label>
                <Input
                  id="code"
                  value={formData.code || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                  placeholder="ex: LIC-INFO-24"
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="diplomaType">Type de diplôme</Label>
                <Select 
                  value={formData.diplomaType} 
                  onValueChange={(value: 'licence' | 'master' | 'doctorat') => 
                    setFormData(prev => ({ ...prev, diplomaType: value }))
                  }
                  disabled={!isEditing}
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
              <div>
                <Label htmlFor="duration">Durée (semestres)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration || 6}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                  min="1"
                  max="12"
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="modality">Modalité d'enseignement</Label>
                <Select 
                  value={formData.modality} 
                  onValueChange={(value: 'presential' | 'distance' | 'hybrid') => 
                    setFormData(prev => ({ ...prev, modality: value }))
                  }
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="presential">Présentiel</SelectItem>
                    <SelectItem value="distance">À distance</SelectItem>
                    <SelectItem value="hybrid">Hybride</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="maxCapacity">Effectif maximum</Label>
                <Input
                  id="maxCapacity"
                  type="number"
                  value={formData.maxCapacity || 100}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxCapacity: parseInt(e.target.value) }))}
                  min="1"
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="admissionRequirements">Conditions d'admission</Label>
              <Textarea
                id="admissionRequirements"
                value={formData.admissionRequirements || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, admissionRequirements: e.target.value }))}
                placeholder="Décrivez les prérequis et conditions d'admission..."
                rows={3}
                disabled={!isEditing}
              />
            </div>
          </TabsContent>

          <TabsContent value="structure" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    <h4 className="font-medium">Modules</h4>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">{formation?.modules?.length || 0}</p>
                  <p className="text-sm text-slate-600">modules définis</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-5 w-5 text-green-600" />
                    <h4 className="font-medium">Sections</h4>
                  </div>
                  <p className="text-2xl font-bold text-green-600">{formation?.sections?.length || 0}</p>
                  <p className="text-sm text-slate-600">sections créées</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-5 w-5 text-purple-600" />
                    <h4 className="font-medium">ECTS</h4>
                  </div>
                  <p className="text-2xl font-bold text-purple-600">{formData.totalECTS}</p>
                  <p className="text-sm text-slate-600">crédits totaux</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="objectives" className="space-y-4">
            <div>
              <Label>Objectifs pédagogiques</Label>
              {isEditing && (
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newObjective}
                    onChange={(e) => setNewObjective(e.target.value)}
                    placeholder="Ajouter un objectif pédagogique..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addObjective())}
                  />
                  <Button type="button" onClick={addObjective} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {formData.pedagogicalObjectives?.map((objective, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {objective}
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => removeObjective(index)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="prospects" className="space-y-4">
            <div>
              <Label>Débouchés professionnels</Label>
              {isEditing && (
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newProspect}
                    onChange={(e) => setNewProspect(e.target.value)}
                    placeholder="Ajouter un débouché professionnel..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addProspect())}
                  />
                  <Button type="button" onClick={addProspect} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {formData.careerProspects?.map((prospect, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {prospect}
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => removeProspect(index)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {isEditing && (
          <div className="flex gap-2 mt-6">
            <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
              <Save className="h-4 w-4 mr-2" />
              Enregistrer
            </Button>
            <Button variant="outline" onClick={onCancel}>
              Annuler
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
