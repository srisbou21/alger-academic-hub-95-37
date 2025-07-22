
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Lock, AlertTriangle } from "lucide-react";
import { useRBAC } from '../../hooks/useRBAC';
import { SystemModule, PermissionAction } from '../../types/rbac';

interface ProtectedRouteProps {
  children: React.ReactNode;
  module: SystemModule;
  action?: PermissionAction;
  tabId?: string;
  fallback?: React.ReactNode;
  showAccessDenied?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  module,
  action = PermissionAction.READ,
  tabId,
  fallback,
  showAccessDenied = true
}) => {
  const { hasPermission, getUserRole } = useRBAC();

  const hasAccess = hasPermission(module, action, tabId);
  const userRole = getUserRole();

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (!showAccessDenied) {
    return null;
  }

  return (
    <Card className="border-red-200 bg-red-50">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <Lock className="h-6 w-6 text-red-600" />
        </div>
        <CardTitle className="text-red-800 flex items-center justify-center gap-2">
          <Shield className="h-5 w-5" />
          Accès Refusé
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 text-red-700">
          <AlertTriangle className="h-4 w-4" />
          <p>Vous n'avez pas les permissions nécessaires pour accéder à cette section.</p>
        </div>
        
        <div className="bg-white border border-red-200 rounded-lg p-4 text-sm">
          <p className="font-medium text-red-800 mb-2">Détails de l'accès requis :</p>
          <div className="space-y-1 text-red-700">
            <p><strong>Module :</strong> {module}</p>
            <p><strong>Action :</strong> {action}</p>
            {tabId && <p><strong>Onglet :</strong> {tabId}</p>}
            {userRole && <p><strong>Votre rôle :</strong> {userRole.name}</p>}
          </div>
        </div>

        <p className="text-sm text-red-600">
          Contactez votre administrateur système pour obtenir les permissions nécessaires.
        </p>
        
        <Button 
          variant="outline" 
          onClick={() => window.history.back()}
          className="border-red-300 text-red-700 hover:bg-red-100"
        >
          Retour
        </Button>
      </CardContent>
    </Card>
  );
};
