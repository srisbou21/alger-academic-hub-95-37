
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, User, Edit, Trash2, Clock } from "lucide-react";
import { Module } from "../../../types/academic";

interface ModuleListProps {
  modules: Module[];
  onEdit: (module: Module) => void;
  onDelete: (moduleId: string) => void;
}

export const ModuleList = ({ modules, onEdit, onDelete }: ModuleListProps) => {
  if (modules.length === 0) {
    return (
      <div className="text-center py-8">
        <BookOpen className="h-12 w-12 text-slate-400 mx-auto mb-4" />
        <p className="text-slate-500">Aucun module défini</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {modules.map((module) => (
        <Card key={module.id}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold">{module.name}</h3>
                <p className="text-sm text-slate-600">{module.code}</p>
              </div>
              <Badge variant="outline">{module.semester}</Badge>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <BookOpen className="h-4 w-4 text-blue-600" />
                <span>{module.credits} crédits • Coeff: {module.coefficient}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-green-600" />
                <span>{module.teacher || 'Non affecté'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-purple-600" />
                <span>{module.type === 'presential' ? 'Présentiel' : 'À distance'}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onEdit(module)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onDelete(module.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
