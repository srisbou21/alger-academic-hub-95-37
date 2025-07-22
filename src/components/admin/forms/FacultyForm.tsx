
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Faculty } from "../../../types/academic";

interface FacultyFormProps {
  faculty?: Faculty;
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<Faculty, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export const FacultyForm: React.FC<FacultyFormProps> = ({
  faculty,
  open,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState({
    name: faculty?.name || '',
    description: faculty?.description || '',
    dean: faculty?.dean || '',
    isActive: faculty?.isActive ?? true,
    isValidated: faculty?.isValidated ?? false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
            {faculty ? 'Modifier la Faculté' : 'Nouvelle Faculté'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nom de la faculté *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Ex: Faculté des Sciences"
              required
            />
          </div>
          <div>
            <Label htmlFor="dean">Doyen</Label>
            <Input
              id="dean"
              value={formData.dean}
              onChange={(e) => handleChange('dean', e.target.value)}
              placeholder="Nom du doyen"
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Description de la faculté"
            />
          </div>
          <div className="flex gap-4">
            <Button type="submit" className="flex-1">
              {faculty ? 'Modifier' : 'Créer'}
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
