
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, Check, X, Eye, Edit, Trash2, CheckCircle, Download } from "lucide-react";
import { useRBAC } from '../../hooks/useRBAC';
import { SystemModule, PermissionAction } from '../../types/rbac';

export const PermissionMatrix: React.FC = () => {
  const { getUserRole, getAccessibleModules, getAccessibleTabs } = useRBAC();
  
  const userRole = getUserRole();
  const accessibleModules = getAccessibleModules();

  if (!userRole) {
    return (
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-6 text-center">
          <Shield className="h-8 w-8 text-amber-600 mx-auto mb-2" />
          <p className="text-amber-800">Aucun rôle défini</p>
        </CardContent>
      </Card>
    );
  }

  const getPermissionIcon = (hasPermission: boolean, actionType: string) => {
    if (!hasPermission) {
      return <X className="h-3 w-3 text-red-500" />;
    }

    switch (actionType) {
      case 'view': return <Eye className="h-3 w-3 text-green-500" />;
      case 'edit': return <Edit className="h-3 w-3 text-blue-500" />;
      case 'delete': return <Trash2 className="h-3 w-3 text-red-500" />;
      case 'approve': return <CheckCircle className="h-3 w-3 text-purple-500" />;
      case 'export': return <Download className="h-3 w-3 text-orange-500" />;
      default: return <Check className="h-3 w-3 text-green-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Matrice des Permissions - {userRole.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {accessibleModules.map((module) => (
            <Card key={module.moduleId} className="border-slate-200">
              <CardHeader className="bg-slate-50">
                <CardTitle className="text-base flex items-center gap-2">
                  {module.moduleName}
                  <Badge variant="outline">
                    {module.tabs.filter(t => t.canView).length} onglet(s) accessible(s)
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Onglet</TableHead>
                      <TableHead className="text-center">Voir</TableHead>
                      <TableHead className="text-center">Modifier</TableHead>
                      <TableHead className="text-center">Supprimer</TableHead>
                      <TableHead className="text-center">Approuver</TableHead>
                      <TableHead className="text-center">Exporter</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {module.tabs.map((tab) => (
                      <TableRow key={tab.tabId}>
                        <TableCell className="font-medium">{tab.tabName}</TableCell>
                        <TableCell className="text-center">
                          {getPermissionIcon(tab.canView, 'view')}
                        </TableCell>
                        <TableCell className="text-center">
                          {getPermissionIcon(tab.canEdit, 'edit')}
                        </TableCell>
                        <TableCell className="text-center">
                          {getPermissionIcon(tab.canDelete, 'delete')}
                        </TableCell>
                        <TableCell className="text-center">
                          {getPermissionIcon(tab.canApprove || false, 'approve')}
                        </TableCell>
                        <TableCell className="text-center">
                          {getPermissionIcon(tab.canExport || false, 'export')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
