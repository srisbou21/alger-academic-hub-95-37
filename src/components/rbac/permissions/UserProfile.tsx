
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Settings, CheckCircle, User } from "lucide-react";
import { Role } from '../../../types/rbac';

interface UserProfileProps {
  currentUser: {
    name: string;
  };
  userRole: Role;
  accessibleModulesCount: number;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  currentUser,
  userRole,
  accessibleModulesCount
}) => {
  return (
    <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <User className="h-5 w-5" />
          Profil et Permissions - {currentUser.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-white rounded-lg border border-blue-200">
            <Shield className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Rôle</p>
            <p className="font-semibold text-blue-800">{userRole.name}</p>
          </div>
          <div className="text-center p-4 bg-white rounded-lg border border-blue-200">
            <Settings className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Niveau</p>
            <p className="font-semibold text-green-800">{userRole.level}</p>
          </div>
          <div className="text-center p-4 bg-white rounded-lg border border-blue-200">
            <CheckCircle className="h-6 w-6 text-purple-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Modules accessibles</p>
            <p className="font-semibold text-purple-800">{accessibleModulesCount}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-blue-200">
          <p className="text-sm text-gray-600 mb-2">Description du rôle :</p>
          <p className="text-blue-800">{userRole.description}</p>
        </div>
      </CardContent>
    </Card>
  );
};
