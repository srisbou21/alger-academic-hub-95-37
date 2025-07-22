
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Faculty, Department } from '@/types/academic';

interface DepartmentFormProps {
  department?: Department;
  faculties: Faculty[];
  onClose: () => void;
  onSave: (department: Omit<Department, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export const DepartmentForm: React.FC<DepartmentFormProps> = ({ department, faculties, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: department?.name || '',
    code: department?.code || '',
    description: department?.description || '',
    facultyId: department?.facultyId || '',
    head: department?.head || '',
    isActive: department?.isActive ?? true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom du département est requis';
    }

    if (!formData.code.trim()) {
      newErrors.code = 'Le code du département est requis';
    }

    if (!formData.facultyId) {
      newErrors.facultyId = 'La faculté est requise';
    }

    if (!formData.head.trim()) {
      newErrors.head = 'Le chef de département est requis';
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {department ? 'Modifier le département' : 'Ajouter un département'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du département *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Ex: Département d'Informatique"
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
                placeholder="Ex: INFO"
                className={errors.code ? 'border-red-500' : ''}
              />
              {errors.code && (
                <p className="text-sm text-red-500">{errors.code}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="facultyId">Faculté *</Label>
            <Select
              value={formData.facultyId}
              onValueChange={(value) => handleInputChange('facultyId', value)}
            >
              <SelectTrigger className={errors.facultyId ? 'border-red-500' : ''}>
                <SelectValue placeholder="Sélectionner une faculté" />
              </SelectTrigger>
              <SelectContent>
                {faculties.map(faculty => (
                  <SelectItem key={faculty.id} value={faculty.id}>
                    {faculty.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.facultyId && (
              <p className="text-sm text-red-500">{errors.facultyId}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="head">Chef de département *</Label>
            <Input
              id="head"
              value={formData.head}
              onChange={(e) => handleInputChange('head', e.target.value)}
              placeholder="Ex: Dr. Mohamed Alami"
              className={errors.head ? 'border-red-500' : ''}
            />
            {errors.head && (
              <p className="text-sm text-red-500">{errors.head}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Description du département"
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => handleInputChange('isActive', checked)}
            />
            <Label htmlFor="isActive">Département actif</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">
              {department ? 'Modifier' : 'Ajouter'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
