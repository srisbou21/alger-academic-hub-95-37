
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Section } from "../../../types/academic";

interface SectionFormProps {
  section: Partial<Section>;
  onChange: (section: Partial<Section>) => void;
  onSave: () => void;
  onCancel: () => void;
  isEditing: boolean;
}

export const SectionForm = ({ section, onChange, onSave, onCancel, isEditing }: SectionFormProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="name">Nom de la section *</Label>
          <Input
            id="name"
            value={section.name || ''}
            onChange={(e) => onChange({ ...section, name: e.target.value })}
            placeholder="ex: Section A"
          />
        </div>
        <div>
          <Label htmlFor="code">Code section *</Label>
          <Input
            id="code"
            value={section.code || ''}
            onChange={(e) => onChange({ ...section, code: e.target.value })}
            placeholder="ex: SEC-A"
          />
        </div>
        <div>
          <Label htmlFor="capacity">Capacité</Label>
          <Input
            id="capacity"
            type="number"
            value={section.capacity || ''}
            onChange={(e) => onChange({ ...section, capacity: parseInt(e.target.value) })}
            min="1"
            placeholder="ex: 40"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={onSave} className="bg-green-600 hover:bg-green-700">
          {isEditing ? 'Mettre à jour' : 'Créer'} la Section
        </Button>
        <Button onClick={onCancel} variant="outline">
          Annuler
        </Button>
      </div>
    </div>
  );
};
