
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap } from "lucide-react";
import { useState } from "react";
import { TeacherMessaging } from "./TeacherMessaging";
import { PerformanceDashboard } from "./PerformanceDashboard";
import { TeacherProfiles } from "./TeacherProfiles";
import { OverviewTab } from "./teacher/OverviewTab";
import { ModificationHistory } from "./ModificationHistory";
import { CourseForums } from "./CourseForums";
import { TeacherAbsenceRequest } from "./teacher/TeacherAbsenceRequest";
import { RealTimeAbsenceTracking } from "./teacher/RealTimeAbsenceTracking";
import { QuestionnaireGenerator } from "./teacher/QuestionnaireGenerator";
import { IntegratedCommunication } from "./teacher/IntegratedCommunication";
import { TeacherWorkloadManager } from "./teacher/TeacherWorkloadManager";
import { AdminAbsenceManagement } from "./admin/AdminAbsenceManagement";
import { WorkloadAdministration } from "./teacher/WorkloadAdministration";
import { useAuth } from "../contexts/AuthContext";
import { useRBAC } from "../hooks/useRBAC";

export const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { user } = useAuth();
  const { isAdmin, isSuperAdmin } = useRBAC();

  const currentUser = {
    id: user?.id || "1",
    name: user?.name || "Enseignant",
    email: user?.email || "teacher@fsecsg.dz",
    role: user?.role as any || "teacher",
    department: "Informatique",
    permissions: [],
    status: "active" as const
  };

  const showAdminFeatures = isAdmin() || isSuperAdmin();

  return (
    <div className="space-y-6">
      {/* En-tête unifié bleu */}
      <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <GraduationCap className="h-8 w-8" />
            Système de Gestion des Enseignants
          </CardTitle>
          <p className="text-blue-100">
            Interface complète pour la gestion des charges, absences et communications
          </p>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-white border border-blue-200">
          <TabsTrigger value="overview">
            Vue d'ensemble
          </TabsTrigger>
          <TabsTrigger value="workload">
            Charges
          </TabsTrigger>
          <TabsTrigger value="absence">
            Absences
          </TabsTrigger>
          <TabsTrigger value="communication">
            Communication
          </TabsTrigger>
          <TabsTrigger value="profile">
            Profil
          </TabsTrigger>
        </TabsList>

      <TabsContent value="overview" className="space-y-6">
        <OverviewTab />
      </TabsContent>

      <TabsContent value="workload" className="space-y-6">
        <Tabs defaultValue="my-workload" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="my-workload">Mes Charges</TabsTrigger>
            {showAdminFeatures && (
              <TabsTrigger value="administration">Administration</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="my-workload">
            <TeacherWorkloadManager />
          </TabsContent>
          
          {showAdminFeatures && (
            <TabsContent value="administration">
              <WorkloadAdministration />
            </TabsContent>
          )}
        </Tabs>
      </TabsContent>

      <TabsContent value="absence" className="space-y-6">
        <Tabs defaultValue="my-requests" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="my-requests">Mes Demandes</TabsTrigger>
            {showAdminFeatures && (
              <TabsTrigger value="management">Gestion Administrative</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="my-requests">
            <TeacherAbsenceRequest />
          </TabsContent>
          
          {showAdminFeatures && (
            <TabsContent value="management">
              <AdminAbsenceManagement currentUser={currentUser} />
            </TabsContent>
          )}
        </Tabs>
      </TabsContent>

      <TabsContent value="communication" className="space-y-6">
        <Tabs defaultValue="integrated" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="integrated">Messagerie Intégrée</TabsTrigger>
            <TabsTrigger value="questionnaire">Questionnaires</TabsTrigger>
            <TabsTrigger value="forums">Forums</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="integrated">
            <IntegratedCommunication />
          </TabsContent>
          
          <TabsContent value="questionnaire">
            <QuestionnaireGenerator />
          </TabsContent>
          
          <TabsContent value="forums">
            <CourseForums />
          </TabsContent>
          
          <TabsContent value="performance">
            <PerformanceDashboard />
          </TabsContent>
        </Tabs>
      </TabsContent>

      <TabsContent value="profile" className="space-y-6">
        <TeacherProfiles />
      </TabsContent>
    </Tabs>
    </div>
  );
};
