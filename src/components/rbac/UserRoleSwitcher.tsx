
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, User, RefreshCw } from "lucide-react";
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { useRBAC } from '../../hooks/useRBAC';

export const UserRoleSwitcher: React.FC = () => {
  const { currentUser, switchUser } = useCurrentUser();
  const { getUserRole } = useRBAC();

  const userRole = getUserRole();

  const mockUsers = [
    { index: 0, name: "Dr. Ahmed Benali", role: "Enseignant", roleId: "teacher" },
    { index: 1, name: "Mme. Fatima Zahra", role: "Chef de Département", roleId: "dept_head" },
    { index: 2, name: "M. Karim Messaoudi", role: "Super Administrateur", roleId: "super_admin" }
  ];

  const handleUserSwitch = (userIndex: string) => {
    switchUser(parseInt(userIndex));
  };

  const getCurrentUserIndex = () => {
    if (!currentUser) return "0";
    return mockUsers.findIndex(user => user.name === currentUser.name).toString();
  };

  if (!currentUser) {
    return null;
  }

  return (
    <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-amber-800 text-sm">
          <RefreshCw className="h-4 w-4" />
          Simulateur de Rôles (Démo)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-amber-600" />
          <span className="text-sm font-medium">Utilisateur actuel :</span>
        </div>
        
        <div className="bg-white p-3 rounded-lg border border-amber-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium text-sm">{currentUser.name}</span>
            {userRole && (
              <Badge variant="outline" className="text-xs">
                <Shield className="h-3 w-3 mr-1" />
                {userRole.name}
              </Badge>
            )}
          </div>
          <p className="text-xs text-gray-600">{currentUser.email}</p>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-amber-700">
            Changer d'utilisateur pour tester les permissions :
          </label>
          <Select value={getCurrentUserIndex()} onValueChange={handleUserSwitch}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {mockUsers.map((user) => (
                <SelectItem key={user.index} value={user.index.toString()}>
                  <div className="flex items-center gap-2">
                    <span>{user.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {user.role}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <p className="text-xs text-amber-600 italic">
          Utilisez ce sélecteur pour tester les différents niveaux d'accès du système RBAC.
        </p>
      </CardContent>
    </Card>
  );
};
