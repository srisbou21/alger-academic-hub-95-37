
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { RoleCard } from './RoleCard';
import { RoleHierarchy } from './RoleHierarchy';

interface RolesListProps {
  selectedRole: string | null;
  setSelectedRole: (roleId: string | null) => void;
  canManageRoles: boolean;
}

export const RolesList: React.FC<RolesListProps> = ({
  selectedRole,
  setSelectedRole,
  canManageRoles
}) => {
  const mockRoles = [
    {
      id: 'super_admin',
      name: 'Super Administrateur',
      description: 'Accès complet à tout le système',
      level: 100,
      userCount: 2,
      color: 'bg-red-100 text-red-800 border-red-200'
    },
    {
      id: 'admin_faculty',
      name: 'Administrateur Faculté',
      description: 'Gestion complète de la faculté',
      level: 90,
      userCount: 5,
      color: 'bg-purple-100 text-purple-800 border-purple-200'
    },
    {
      id: 'dept_head',
      name: 'Chef de Département',
      description: 'Gestion du département',
      level: 80,
      userCount: 12,
      color: 'bg-blue-100 text-blue-800 border-blue-200'
    },
    {
      id: 'teacher',
      name: 'Enseignant',
      description: 'Accès enseignant standard',
      level: 50,
      userCount: 156,
      color: 'bg-green-100 text-green-800 border-green-200'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Rôles Disponibles</h3>
        {canManageRoles && (
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Rôle
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockRoles.map((role) => (
          <RoleCard
            key={role.id}
            role={role}
            isSelected={selectedRole === role.id}
            canManageRoles={canManageRoles}
            onClick={() => setSelectedRole(role.id)}
          />
        ))}
      </div>

      <RoleHierarchy roles={mockRoles} />
    </div>
  );
};
