
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings } from "lucide-react";
import { AdministrativeServices } from "./administrative/AdministrativeServices";
import { SystemConfiguration } from "./admin/SystemConfiguration";
import { AuditManagement } from "./admin/AuditManagement";
import { DataProtection } from "./admin/DataProtection";
import { SystemMonitoring } from "./admin/SystemMonitoring";
import { EnhancedAcademicYearManager } from "./admin/EnhancedAcademicYearManager";
import { UserManagement } from "./admin/UserManagement";
import { AdminOverview } from "./admin/AdminOverview";
import { AdminFacultyManagement } from "./admin/AdminFacultyManagement";
import { useAcademicYear } from "../contexts/AcademicYearContext";
import { useAuth } from "../contexts/AuthContext";

export const AdminDashboard = () => {
  const { selectedYear } = useAcademicYear();
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Settings className="h-8 w-8" />
            Système d'Administration Générale
          </CardTitle>
          <p className="text-blue-100">
            Gestion globale du système académique et configuration avancée
          </p>
        </CardHeader>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-8 bg-white border border-blue-200">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="academic-years">Années Universitaires</TabsTrigger>
          <TabsTrigger value="administrative">Administrative</TabsTrigger>
          <TabsTrigger value="faculty">Faculté</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="audit">Audit</TabsTrigger>
          <TabsTrigger value="system">Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <AdminOverview />
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <UserManagement />
        </TabsContent>

          <TabsContent value="academic-years" className="space-y-6">
            <EnhancedAcademicYearManager />
          </TabsContent>

        <TabsContent value="administrative" className="space-y-6">
          <AdministrativeServices />
        </TabsContent>

        <TabsContent value="faculty" className="space-y-6">
          <AdminFacultyManagement />
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <SystemMonitoring />
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <AuditManagement />
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <SystemConfiguration />
        </TabsContent>
      </Tabs>
    </div>
  );
};
