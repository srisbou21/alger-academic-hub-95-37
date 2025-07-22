
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
import { Specialty, Filiere } from "../../../types/academic";
import { academicConfigService } from "../../../services/academicConfigService";

interface SpecialtyFormProps {
  specialty?: Specialty;
  filieres: Filiere[];
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<Specialty, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export const SpecialtyForm: React.FC<SpecialtyFormProps> = ({
  specialty,
  filieres,
  open,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState({
    name: specialty?.name || '',
    code: specialty?.code || '',
    filiereId: specialty?.filiereId || '',
    level: specialty?.level || 'licence' as 'licence' | 'master' | 'doctorat',
    description: specialty?.description || '',
    duration: specialty?.duration || 3,
    isActive: specialty?.isActive ?? true,
    isValidated: specialty?.isValidated ?? false
  });


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.filiereId) return;
    
    onSave(formData);
    onClose();
  };

  const handleChange = (field: string, value: string | boolean | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {specialty ? 'Modifier la Spécialité' : 'Nouvelle Spécialité'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nom de la spécialité *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Ex: Informatique"
                required
              />
            </div>
            <div>
              <Label htmlFor="code">Code *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => handleChange('code', e.target.value)}
                placeholder="Ex: INF"
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="filiere">Filière *</Label>
            <Select
              value={formData.filiereId}
              onValueChange={(value) => handleChange('filiereId', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une filière" />
              </SelectTrigger>
              <SelectContent>
                {filieres.map(filiere => (
                  <SelectItem key={filiere.id} value={filiere.id}>
                    {filiere.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="level">Niveau *</Label>
              <Select
                value={formData.level}
                onValueChange={(value: 'licence' | 'master' | 'doctorat') => handleChange('level', value)}
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
              <Label htmlFor="duration">Durée (années) *</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                max="8"
                value={formData.duration}
                onChange={(e) => handleChange('duration', parseInt(e.target.value) || 3)}
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Description de la spécialité"
            />
          </div>


          <div className="flex gap-4">
            <Button type="submit" className="flex-1">
              {specialty ? 'Modifier' : 'Créer'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Annuler
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
