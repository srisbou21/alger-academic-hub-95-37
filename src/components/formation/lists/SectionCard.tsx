
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Edit, Trash2, Eye } from "lucide-react";
import { Section } from "../../../types/academic";

interface SectionCardProps {
  section: Section;
  onEdit: (section: Section) => void;
  onDelete: (sectionId: string) => void;
  onSelectForGroups: (sectionId: string) => void;
  isSelected: boolean;
}

export const SectionCard = ({ 
  section, 
  onEdit, 
  onDelete, 
  onSelectForGroups, 
  isSelected 
}: SectionCardProps) => {
  return (
    <Card className={`transition-all ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold">{section.name}</h3>
            <p className="text-sm text-slate-600">{section.code}</p>
          </div>
          <Badge variant="outline">Capacité: {section.capacity}</Badge>
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-blue-600" />
            <span>{section.groups.length} groupe(s)</span>
          </div>
          
          {section.groups.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {section.groups.map((group) => (
                <Badge key={group.id} variant="secondary" className="text-xs">
                  {group.name} ({group.type.toUpperCase()})
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onEdit(section)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onSelectForGroups(section.id)}
            className={isSelected ? 'bg-blue-100' : ''}
          >
            <Eye className="h-4 w-4" />
            Groupes
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onDelete(section.id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
