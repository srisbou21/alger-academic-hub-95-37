
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Module } from "../../../types/academic";

interface ModuleFormProps {
  module: Partial<Module>;
  onChange: (module: Partial<Module>) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const ModuleForm = ({ module, onChange, onSave, onCancel }: ModuleFormProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nom du module *</Label>
          <Input
            id="name"
            value={module.name || ''}
            onChange={(e) => onChange({ ...module, name: e.target.value })}
            placeholder="ex: Programmation Java"
          />
        </div>
        <div>
          <Label htmlFor="code">Code module *</Label>
          <Input
            id="code"
            value={module.code || ''}
            onChange={(e) => onChange({ ...module, code: e.target.value })}
            placeholder="ex: PROG-JAVA"
          />
        </div>
        <div>
          <Label htmlFor="credits">Crédits</Label>
          <Input
            id="credits"
            type="number"
            value={module.credits || ''}
            onChange={(e) => onChange({ ...module, credits: parseInt(e.target.value) })}
            min="1"
          />
        </div>
        <div>
          <Label htmlFor="coefficient">Coefficient</Label>
          <Input
            id="coefficient"
            type="number"
            value={module.coefficient || ''}
            onChange={(e) => onChange({ ...module, coefficient: parseInt(e.target.value) })}
            min="1"
          />
        </div>
        <div>
          <Label htmlFor="teacher">Enseignant</Label>
          <Input
            id="teacher"
            value={module.teacher || ''}
            onChange={(e) => onChange({ ...module, teacher: e.target.value })}
            placeholder="Nom de l'enseignant"
          />
        </div>
        <div>
          <Label htmlFor="type">Type</Label>
          <Select 
            value={module.type} 
            onValueChange={(value: 'presential' | 'distance') => onChange({ ...module, type: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="presential">Présentiel</SelectItem>
              <SelectItem value="distance">À distance</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="semester">Semestre</Label>
          <Select 
            value={module.semester?.toString() || "1"} 
            onValueChange={(value) => onChange({ ...module, semester: parseInt(value) })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Semestre 1</SelectItem>
              <SelectItem value="2">Semestre 2</SelectItem>
              <SelectItem value="3">Semestre 3</SelectItem>
              <SelectItem value="4">Semestre 4</SelectItem>
              <SelectItem value="5">Semestre 5</SelectItem>
              <SelectItem value="6">Semestre 6</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={onSave} className="bg-green-600 hover:bg-green-700">
          Sauvegarder
        </Button>
        <Button onClick={onCancel} variant="outline">
          Annuler
        </Button>
      </div>
    </div>
  );
};
