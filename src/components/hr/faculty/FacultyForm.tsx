import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Faculty } from '@/types/academic';

interface FacultyFormProps {
  faculty?: Faculty;
  onClose: () => void;
  onSave: (faculty: Omit<Faculty, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export const FacultyForm: React.FC<FacultyFormProps> = ({ faculty, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: faculty?.name || '',
    description: faculty?.description || '',
    dean: faculty?.dean || '',
    isActive: faculty?.isActive ?? true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom de la faculté est requis';
    }

    if (!formData.dean.trim()) {
      newErrors.dean = 'Le nom du doyen est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave({ ...formData, isValidated: false });
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {faculty ? 'Modifier la faculté' : 'Ajouter une faculté'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nom de la faculté *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Ex: Faculté des Sciences et Technologies"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Description de la faculté"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dean">Doyen *</Label>
            <Input
              id="dean"
              value={formData.dean}
              onChange={(e) => handleInputChange('dean', e.target.value)}
              placeholder="Ex: Prof. Ahmed Benali"
              className={errors.dean ? 'border-red-500' : ''}
            />
            {errors.dean && (
              <p className="text-sm text-red-500">{errors.dean}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => handleInputChange('isActive', checked)}
            />
            <Label htmlFor="isActive">Faculté active</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">
              {faculty ? 'Modifier' : 'Ajouter'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};