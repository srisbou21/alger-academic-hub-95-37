
import React from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormationOffer } from "../../../types/academic";

interface FormationBasicInfoFormProps {
  offer: Partial<FormationOffer>;
  onChange: (offer: Partial<FormationOffer>) => void;
}

export const FormationBasicInfoForm = ({ offer, onChange }: FormationBasicInfoFormProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-2">Nom de l'offre</label>
        <Input
          value={offer.name || ''}
          onChange={(e) => onChange({ ...offer, name: e.target.value })}
          placeholder="Ex: Licence Informatique"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Code</label>
        <Input
          value={offer.code || ''}
          onChange={(e) => onChange({ ...offer, code: e.target.value.toUpperCase() })}
          placeholder="Ex: L-INFO"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Niveau</label>
        <Select 
          value={offer.level || ''} 
          onValueChange={(value) => onChange({ ...offer, level: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Choisir un niveau" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="L1">Licence 1</SelectItem>
            <SelectItem value="L2">Licence 2</SelectItem>
            <SelectItem value="L3">Licence 3</SelectItem>
            <SelectItem value="M1">Master 1</SelectItem>
            <SelectItem value="M2">Master 2</SelectItem>
            <SelectItem value="D">Doctorat</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Année académique</label>
        <Select 
          value={offer.academicYear || ''} 
          onValueChange={(value) => onChange({ ...offer, academicYear: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Choisir une année" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2024-2025">2024-2025</SelectItem>
            <SelectItem value="2025-2026">2025-2026</SelectItem>
            <SelectItem value="2026-2027">2026-2027</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
