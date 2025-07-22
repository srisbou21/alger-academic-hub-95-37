
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Plus, X } from "lucide-react";
import { FormationOffer } from "../../../types/academic";

interface FormationCreationFormProps {
  onSave: (formation: Partial<FormationOffer>) => void;
  onCancel: () => void;
}

export const FormationCreationForm = ({ onSave, onCancel }: FormationCreationFormProps) => {
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
    academicYear: '2024-2025'
  });

  const [newObjective, setNewObjective] = useState('');
  const [newProspect, setNewProspect] = useState('');

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
      onSave(formData);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          Créer une Nouvelle Formation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations générales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nom de la formation *</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="ex: Licence Informatique"
                required
              />
            </div>
            <div>
              <Label htmlFor="code">Code formation *</Label>
              <Input
                id="code"
                value={formData.code || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                placeholder="ex: LIC-INFO-24"
                required
              />
            </div>
            <div>
              <Label htmlFor="diplomaType">Type de diplôme</Label>
              <Select 
                value={formData.diplomaType} 
                onValueChange={(value: 'licence' | 'master' | 'doctorat') => 
                  setFormData(prev => ({ ...prev, diplomaType: value }))
                }
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
              />
            </div>
            <div>
              <Label htmlFor="modality">Modalité d'enseignement</Label>
              <Select 
                value={formData.modality} 
                onValueChange={(value: 'presential' | 'distance' | 'hybrid') => 
                  setFormData(prev => ({ ...prev, modality: value }))
                }
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
              <Label htmlFor="language">Langue d'enseignement</Label>
              <Input
                id="language"
                value={formData.language || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
                placeholder="ex: Français"
              />
            </div>
            <div>
              <Label htmlFor="maxCapacity">Effectif maximum</Label>
              <Input
                id="maxCapacity"
                type="number"
                value={formData.maxCapacity || 100}
                onChange={(e) => setFormData(prev => ({ ...prev, maxCapacity: parseInt(e.target.value) }))}
                min="1"
              />
            </div>
            <div>
              <Label htmlFor="responsibleName">Responsable de formation</Label>
              <Input
                id="responsibleName"
                value={formData.responsibleName || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, responsibleName: e.target.value }))}
                placeholder="ex: Dr. Ahmed Benali"
              />
            </div>
          </div>

          {/* Conditions d'admission */}
          <div>
            <Label htmlFor="admissionRequirements">Conditions d'admission</Label>
            <Textarea
              id="admissionRequirements"
              value={formData.admissionRequirements || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, admissionRequirements: e.target.value }))}
              placeholder="Décrivez les prérequis et conditions d'admission..."
              rows={3}
            />
          </div>

          {/* Objectifs pédagogiques */}
          <div>
            <Label>Objectifs pédagogiques</Label>
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
            <div className="flex flex-wrap gap-2">
              {formData.pedagogicalObjectives?.map((objective, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {objective}
                  <button
                    type="button"
                    onClick={() => removeObjective(index)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Débouchés professionnels */}
          <div>
            <Label>Débouchés professionnels</Label>
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
            <div className="flex flex-wrap gap-2">
              {formData.careerProspects?.map((prospect, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {prospect}
                  <button
                    type="button"
                    onClick={() => removeProspect(index)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Créer la Formation
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
