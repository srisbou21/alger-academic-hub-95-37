import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Filiere, Department } from "../../../types/academic";

interface FiliereFormProps {
  filiere?: Filiere;
  departments: Department[];
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<Filiere, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}

export const FiliereForm: React.FC<FiliereFormProps> = ({
  filiere,
  departments,
  open,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    departmentId: '',
    description: '',
    head: '',
    isActive: true,
    isValidated: false
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (filiere) {
      setFormData({
        name: filiere.name,
        code: filiere.code,
        departmentId: filiere.departmentId,
        description: filiere.description || '',
        head: filiere.head || '',
        isActive: filiere.isActive,
        isValidated: filiere.isValidated ?? false
      });
    } else {
      setFormData({
        name: '',
        code: '',
        departmentId: '',
        description: '',
        head: '',
        isActive: true,
        isValidated: false
      });
    }
  }, [filiere, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code || !formData.departmentId) return;

    setSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {filiere ? 'Modifier la filière' : 'Ajouter une filière'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nom de la filière</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="code">Code</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => handleChange('code', e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="department">Département</Label>
            <Select
              value={formData.departmentId}
              onValueChange={(value) => handleChange('departmentId', value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un département" />
              </SelectTrigger>
              <SelectContent>
                {departments.map(department => (
                  <SelectItem key={department.id} value={department.id}>
                    {department.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="head">Responsable de filière</Label>
            <Input
              id="head"
              value={formData.head}
              onChange={(e) => handleChange('head', e.target.value)}
              placeholder="Nom du responsable"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Description de la filière..."
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => handleChange('isActive', checked)}
            />
            <Label htmlFor="isActive">Filière active</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Sauvegarde...' : filiere ? 'Modifier' : 'Ajouter'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};