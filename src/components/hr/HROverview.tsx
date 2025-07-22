
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, UserCheck, GraduationCap, Briefcase, FileText } from "lucide-react";
import { TeacherManagement } from "./TeacherManagement";
import { AdministrativeStaffManager } from "./administrative/AdministrativeStaffManager";
import { DocumentFilesTab } from "./documents/DocumentFilesTab";
import { statisticsService, GlobalStatistics } from "@/services/statisticsService";
import { useToast } from "@/hooks/use-toast";

export const HROverview = () => {
  const [statistics, setStatistics] = useState<GlobalStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      const stats = await statisticsService.getGlobalStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les statistiques",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6" />
            Ressources Humaines - Vue d'ensemble
          </CardTitle>
          <p className="text-slate-600">
            Gestion complète du personnel enseignant et administratif
          </p>
        </CardHeader>
        <CardContent>
          {/* Statistiques rapides */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <GraduationCap className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">
                {loading ? "..." : statistics?.totalTeachers || 0}
              </p>
              <p className="text-sm text-blue-800">Enseignants</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Briefcase className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">
                {loading ? "..." : statistics?.totalAdministrative || 0}
              </p>
              <p className="text-sm text-green-800">Personnel Admin</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <UserCheck className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-600">
                {loading ? "..." : statistics?.activeStaff || 0}
              </p>
              <p className="text-sm text-purple-800">Actifs</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <FileText className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-orange-600">
                {loading ? "..." : statistics?.totalStaff || 0}
              </p>
              <p className="text-sm text-orange-800">Total Personnel</p>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
};
