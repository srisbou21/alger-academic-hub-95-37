
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Eye } from "lucide-react";

interface RoleCardProps {
  role: {
    id: string;
    name: string;
    description: string;
    level: number;
    userCount: number;
    color: string;
  };
  isSelected: boolean;
  canManageRoles: boolean;
  onClick: () => void;
}

export const RoleCard: React.FC<RoleCardProps> = ({
  role,
  isSelected,
  canManageRoles,
  onClick
}) => {
  return (
    <Card 
      className={`border-2 ${isSelected ? 'border-purple-400' : 'border-slate-200'} hover:border-purple-300 transition-colors cursor-pointer`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="font-semibold text-slate-800">{role.name}</h4>
            <p className="text-xs text-slate-500 mt-1">{role.description}</p>
          </div>
          <Badge className={role.color}>
            Niv. {role.level}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Utilisateurs :</span>
            <Badge variant="outline">{role.userCount}</Badge>
          </div>
        </div>

        {canManageRoles && (
          <div className="flex gap-2 mt-3 pt-3 border-t">
            <Button size="sm" variant="outline">
              <Edit className="h-3 w-3 mr-1" />
              Modifier
            </Button>
            <Button size="sm" variant="outline">
              <Eye className="h-3 w-3 mr-1" />
              Détails
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
