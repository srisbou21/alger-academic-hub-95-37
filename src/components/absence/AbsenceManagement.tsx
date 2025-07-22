
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Users, FileText, Clock, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { User } from "../../types/user";
import { RoleBasedAbsenceDashboard } from "./RoleBasedAbsenceDashboard";
import { AbsenceRequestForm } from "./AbsenceRequestForm";
import { ReplacementPlanning } from "./ReplacementPlanning";
import { AbsenceNotifications } from "./AbsenceNotifications";

export const AbsenceManagement = () => {
  // Mock current user - Dans un vrai système, cela viendrait du contexte d'authentification
  const [currentUser] = useState<User>({
    id: "teacher_1",
    name: "Dr. Ahmed Benali",
    email: "ahmed.benali@university.edu",
    role: "teacher", // Changez ça pour tester différents rôles: 'teacher', 'dept_head', 'admin_faculty', etc.
    department: "Informatique",
    permissions: [],
    status: "active"
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Gestion des Absences Enseignants</h2>
          <p className="text-slate-600">Système centralisé de gestion des absences et remplacements</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Système actif
          </Badge>
        </div>
      </div>

      {/* Statistiques rapides globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Demandes en Attente</p>
                <p className="text-2xl font-bold text-blue-800">8</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Approuvées Aujourd'hui</p>
                <p className="text-2xl font-bold text-green-800">12</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-600 text-sm font-medium">Cours Affectés</p>
                <p className="text-2xl font-bold text-amber-800">25</p>
              </div>
              <Calendar className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Remplacements</p>
                <p className="text-2xl font-bold text-purple-800">18</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6 bg-white shadow-sm border border-slate-200">
          <TabsTrigger 
            value="dashboard"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger 
            value="request"
            className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
          >
            <FileText className="h-4 w-4 mr-2" />
            Demande
          </TabsTrigger>
          <TabsTrigger 
            value="replacement"
            className="data-[state=active]:bg-amber-600 data-[state=active]:text-white"
          >
            <Users className="h-4 w-4 mr-2" />
            Remplacements
          </TabsTrigger>
          <TabsTrigger 
            value="notifications"
            className="data-[state=active]:bg-red-600 data-[state=active]:text-white"
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <RoleBasedAbsenceDashboard currentUser={currentUser} />
        </TabsContent>

        <TabsContent value="request" className="space-y-6">
          <AbsenceRequestForm />
        </TabsContent>

        <TabsContent value="replacement" className="space-y-6">
          <ReplacementPlanning />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <AbsenceNotifications />
        </TabsContent>
      </Tabs>
    </div>
  );
};
