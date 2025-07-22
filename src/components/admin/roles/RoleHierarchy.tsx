
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Settings } from "lucide-react";

interface Role {
  id: string;
  name: string;
  description: string;
  level: number;
  userCount: number;
  color: string;
}

interface RoleHierarchyProps {
  roles: Role[];
}

export const RoleHierarchy: React.FC<RoleHierarchyProps> = ({ roles }) => {
  const sortedRoles = roles.sort((a, b) => b.level - a.level);

  return (
    <Card className="border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <Settings className="h-5 w-5" />
          Hiérarchie des Rôles
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedRoles.map((role, index) => (
            <div key={role.id} className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-800 font-bold text-sm">
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{role.name}</span>
                  <Badge variant="outline">Niveau {role.level}</Badge>
                </div>
                <p className="text-sm text-slate-600">{role.description}</p>
              </div>
              <Badge className={role.color}>
                {role.userCount} utilisateurs
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
