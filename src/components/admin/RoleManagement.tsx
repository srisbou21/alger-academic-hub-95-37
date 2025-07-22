
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRBAC } from '../../hooks/useRBAC';
import { UserPermissionsDisplay } from '../rbac/UserPermissionsDisplay';
import { UserRoleAssignment } from '../rbac/UserRoleAssignment';
import { ProtectedRoute } from '../rbac/ProtectedRoute';
import { RoleManagementHeader } from './roles/RoleManagementHeader';
import { RolesList } from './roles/RolesList';
import { CustomProfileManager } from './CustomProfileManager';
import { SystemModule, PermissionAction } from '../../types/rbac';

export const RoleManagement: React.FC = () => {
  const { canEditInModule } = useRBAC();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const canManageRoles = canEditInModule(SystemModule.ADMIN, 'permissions');

  return (
    <ProtectedRoute 
      module={SystemModule.ADMIN} 
      action={PermissionAction.READ}
      tabId="permissions"
    >
      <div className="space-y-6">
        <RoleManagementHeader />

        <Tabs defaultValue="roles" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="roles">Rôles Système</TabsTrigger>
            <TabsTrigger value="permissions">Mes Permissions</TabsTrigger>
            <TabsTrigger value="users">Gestion Utilisateurs</TabsTrigger>
            <TabsTrigger value="custom">Profils Mixtes</TabsTrigger>
          </TabsList>

          <TabsContent value="roles" className="space-y-6">
            <RolesList 
              selectedRole={selectedRole}
              setSelectedRole={setSelectedRole}
              canManageRoles={canManageRoles}
            />
          </TabsContent>

          <TabsContent value="permissions">
            <UserPermissionsDisplay />
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <UserRoleAssignment />
          </TabsContent>

          <TabsContent value="custom" className="space-y-6">
            <CustomProfileManager />
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  );
};
