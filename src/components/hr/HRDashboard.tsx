
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, CalendarDays, CheckSquare, FileText, Settings } from "lucide-react";
import { HROverview } from './HROverview';
import { TeacherManagement } from './TeacherManagement';
import { AdministrativeManagement } from './AdministrativeManagement';
import { AdvancementManagement } from './AdvancementManagement';
import { EchelonManagement } from './EchelonManagement';
import { HRReports } from './HRReports';
import { HRNotifications } from './HRNotifications';
import { AcademicConfigManager } from './config/AcademicConfigManager';
import { AbsenceManagement } from './teachers/AbsenceManagement';
import { DigitalFacultyManager } from './digital/DigitalFacultyManager';

export const HRDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6">
      {/* En-tête unifié bleu */}
      <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8" />
            Système de Gestion des Ressources Humaines
          </CardTitle>
          <p className="text-blue-100">
            Gestion complète du personnel enseignant et administratif
          </p>
        </CardHeader>
      </Card>

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-9 bg-white border border-blue-200">
          <TabsTrigger value="overview">
            Vue d'ensemble
          </TabsTrigger>
          <TabsTrigger value="teachers">
            Enseignants
          </TabsTrigger>
          <TabsTrigger value="administrative">
            Personnel Administratif
          </TabsTrigger>
          <TabsTrigger value="absences">
            Absences
          </TabsTrigger>
          <TabsTrigger value="advancement">
            Avancements
          </TabsTrigger>
          <TabsTrigger value="echelon">
            Échelons
          </TabsTrigger>
          <TabsTrigger value="reports">
            Rapports
          </TabsTrigger>
          <TabsTrigger value="notifications">
            Notifications
          </TabsTrigger>
          <TabsTrigger value="digital">
            Sans Papier
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <HROverview />
        </TabsContent>

        <TabsContent value="teachers" className="space-y-6">
          <TeacherManagement />
        </TabsContent>

        <TabsContent value="administrative" className="space-y-6">
          <AdministrativeManagement />
        </TabsContent>

        <TabsContent value="absences" className="space-y-6">
          <AbsenceManagement />
        </TabsContent>

        <TabsContent value="advancement" className="space-y-6">
          <AdvancementManagement />
        </TabsContent>

        <TabsContent value="echelon" className="space-y-6">
          <EchelonManagement />
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <HRReports />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <HRNotifications />
        </TabsContent>

        <TabsContent value="digital" className="space-y-6">
          <DigitalFacultyManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};
