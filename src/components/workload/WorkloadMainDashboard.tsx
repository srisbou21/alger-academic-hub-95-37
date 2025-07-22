
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  Users, 
  Settings, 
  BookOpen, 
  Calendar, 
  TrendingUp, 
  Brain,
  Database,
  School,
  Copy,
  Download,
  Upload,
  RefreshCw
} from "lucide-react";
import { WorkloadManagement } from "./WorkloadManagement";
import { SectionConfigurationManager } from "./SectionConfigurationManager";
import { TimetableIntegrationManager } from "./TimetableIntegrationManager";
import { workloadService } from "../../services/workloadService";
import { useToast } from "@/hooks/use-toast";
import { useAcademicYear } from "../../contexts/AcademicYearContext";

export const WorkloadMainDashboard = () => {
  const { toast } = useToast();
  const { selectedYear: globalSelectedYear } = useAcademicYear();
  const [selectedAcademicYear, setSelectedAcademicYear] = useState(globalSelectedYear || "2024-2025");
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (globalSelectedYear && globalSelectedYear !== selectedAcademicYear) {
      setSelectedAcademicYear(globalSelectedYear);
    }
  }, [globalSelectedYear]);

  const handleExportData = async () => {
    setLoading(true);
    try {
      const data = await workloadService.exportAcademicYearData(selectedAcademicYear);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `workload-data-${selectedAcademicYear}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export réussi",
        description: `Données exportées pour l'année ${selectedAcademicYear}`
      });
    } catch (error) {
      toast({
        title: "Erreur d'export",
        description: "Impossible d'exporter les données",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportData} disabled={loading}>
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="workloads">Charges</TabsTrigger>
          <TabsTrigger value="sections">Sections</TabsTrigger>
          <TabsTrigger value="timetables">Emplois du temps</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Charges d'Enseignement</p>
                    <p className="text-2xl font-bold text-blue-900">Gestion complète</p>
                  </div>
                  <Clock className="h-12 w-12 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600 font-medium">Configuration</p>
                    <p className="text-2xl font-bold text-green-900">Sections & Groupes</p>
                  </div>
                  <Settings className="h-12 w-12 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-600 font-medium">Génération</p>
                    <p className="text-2xl font-bold text-purple-900">Emplois du temps</p>
                  </div>
                  <Calendar className="h-12 w-12 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="workloads" className="space-y-4">
          <WorkloadManagement academicYear={selectedAcademicYear} />
        </TabsContent>

        <TabsContent value="sections" className="space-y-4">
          <SectionConfigurationManager academicYear={selectedAcademicYear} />
        </TabsContent>

        <TabsContent value="timetables" className="space-y-4">
          <TimetableIntegrationManager academicYear={selectedAcademicYear} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
