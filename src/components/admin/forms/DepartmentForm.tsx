
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Department, Faculty } from "../../../types/academic";

interface DepartmentFormProps {
  department?: Department;
  faculties: Faculty[];
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<Department, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export const DepartmentForm: React.FC<DepartmentFormProps> = ({
  department,
  faculties,
  open,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState({
    name: department?.name || '',
    code: department?.code || '',
    facultyId: department?.facultyId || '',
    description: department?.description || '',
    head: department?.head || '',
    isActive: department?.isActive ?? true,
    isValidated: department?.isValidated ?? false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.facultyId) return;
    onSave(formData);
    onClose();
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {department ? 'Modifier le Département' : 'Nouveau Département'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nom du département *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Ex: Département d'Informatique"
                required
              />
            </div>
            <div>
              <Label htmlFor="code">Code *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => handleChange('code', e.target.value)}
                placeholder="Ex: DINF"
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="faculty">Faculté *</Label>
            <Select
              value={formData.facultyId}
              onValueChange={(value) => handleChange('facultyId', value)}
            >
              <SelectTrigger>
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
          </div>
          <div>
            <Label htmlFor="head">Chef de département</Label>
            <Input
              id="head"
              value={formData.head}
              onChange={(e) => handleChange('head', e.target.value)}
              placeholder="Nom du chef de département"
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Description du département"
            />
          </div>
          <div className="flex gap-4">
            <Button type="submit" className="flex-1">
              {department ? 'Modifier' : 'Créer'}
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
