
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Group } from "../../../types/academic";

interface GroupFormProps {
  group: Partial<Group>;
  onChange: (group: Partial<Group>) => void;
  onAdd: () => void;
}

export const GroupForm = ({ group, onChange, onAdd }: GroupFormProps) => {
  return (
    <div className="p-4 border rounded-lg bg-slate-50">
      <h4 className="font-medium mb-4">Ajouter un Groupe</h4>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <Label htmlFor="groupName">Nom du groupe *</Label>
          <Input
            id="groupName"
            value={group.name || ''}
            onChange={(e) => onChange({ ...group, name: e.target.value })}
            placeholder="ex: Groupe 1"
          />
        </div>
        <div>
          <Label htmlFor="groupCode">Code groupe *</Label>
          <Input
            id="groupCode"
            value={group.code || ''}
            onChange={(e) => onChange({ ...group, code: e.target.value })}
            placeholder="ex: GRP-1"
          />
        </div>
        <div>
          <Label htmlFor="groupType">Type *</Label>
          <Select 
            value={group.type} 
            onValueChange={(value: 'td' | 'tp') => onChange({ ...group, type: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choisir un type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="td">TD</SelectItem>
              <SelectItem value="tp">TP</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="groupCapacity">Capacité</Label>
          <Input
            id="groupCapacity"
            type="number"
            value={group.capacity || ''}
            onChange={(e) => onChange({ ...group, capacity: parseInt(e.target.value) })}
            min="1"
            placeholder="ex: 20"
          />
        </div>
      </div>
      <Button onClick={onAdd} size="sm" className="bg-blue-600 hover:bg-blue-700">
        <Plus className="h-4 w-4 mr-1" />
        Ajouter le Groupe
      </Button>
    </div>
  );
};
