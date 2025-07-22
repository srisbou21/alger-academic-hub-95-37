
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Users, FileText, BarChart3, MessageSquare, Settings } from "lucide-react";
import { ScholarshipApplications } from "./scholarship/ScholarshipApplications";
import { EvaluationProcess } from "./scholarship/EvaluationProcess";
import { ScholarshipCatalog } from "./scholarship/ScholarshipCatalog";
import { ScholarshipDashboard } from "./scholarship/ScholarshipDashboard";
import { ScholarshipMessaging } from "./scholarship/ScholarshipMessaging";
import { ScholarshipSettings } from "./scholarship/ScholarshipSettings";

export const ScholarshipManagement = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="container mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6" />
            Gestion des Bourses d'Études
          </CardTitle>
          <CardDescription>
            Système automatisé de gestion des bourses universitaires
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Tableau de Bord
          </TabsTrigger>
          <TabsTrigger value="applications" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Candidatures
          </TabsTrigger>
          <TabsTrigger value="evaluation" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Évaluation
          </TabsTrigger>
          <TabsTrigger value="catalog" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Catalogue
          </TabsTrigger>
          <TabsTrigger value="messaging" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Communication
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configuration
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <ScholarshipDashboard />
        </TabsContent>

        <TabsContent value="applications">
          <ScholarshipApplications />
        </TabsContent>

        <TabsContent value="evaluation">
          <EvaluationProcess />
        </TabsContent>

        <TabsContent value="catalog">
          <ScholarshipCatalog />
        </TabsContent>

        <TabsContent value="messaging">
          <ScholarshipMessaging />
        </TabsContent>

        <TabsContent value="settings">
          <ScholarshipSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};
