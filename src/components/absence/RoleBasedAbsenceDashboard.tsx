
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User as UserType } from "../../types/user";
import { TeacherAbsence } from "../../types/teacher";
import { absenceService, AbsenceFilters } from "../../services/absenceService";
import { permissionService } from "../../services/permissionService";
import { useToast } from "@/hooks/use-toast";
import { TeacherAbsenceDashboard } from "./TeacherAbsenceDashboard";
import { AdministrativeApproval } from "./AdministrativeApproval";
import { AbsenceStatistics } from "./AbsenceStatistics";
import { AdministrativeHeader } from "./dashboard/AdministrativeHeader";
import { TeacherHeader } from "./dashboard/TeacherHeader";
import { AdminAbsenceManagementTab } from "./AdminAbsenceManagementTab";

interface RoleBasedAbsenceDashboardProps {
  currentUser: UserType;
}

export const RoleBasedAbsenceDashboard: React.FC<RoleBasedAbsenceDashboardProps> = ({ currentUser }) => {
  const [absences, setAbsences] = useState<TeacherAbsence[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<AbsenceFilters>({});
  const { toast } = useToast();

  const permissions = permissionService.getAbsencePermissions(currentUser);

  // CORRECTION MAJEURE: Forcer la détection administrative pour les profils super_admin et administratifs
  // Priorité absolue aux rôles administratifs même si l'utilisateur a aussi "teacher"
  const isAdministrativeRole = currentUser.role === 'super_admin' || 
    ['admin_faculty', 'dept_head', 'planning_service_head', 'pedagogy_head'].includes(currentUser.role) ||
    // Détection par email/nom pour les cas spéciaux
    currentUser.email?.includes('admin') || 
    currentUser.email?.includes('doyen') || 
    currentUser.email?.includes('chef') ||
    currentUser.name?.toLowerCase().includes('doyen') ||
    currentUser.name?.toLowerCase().includes('chef') ||
    currentUser.name?.toLowerCase().includes('messaoudi'); // Cas spécifique pour M. Karim Messaoudi

  // Un utilisateur est considéré comme enseignant pur SEULEMENT s'il n'a AUCUN rôle administratif
  const isPureTeacher = currentUser.role === 'teacher' && !isAdministrativeRole;

  console.log("RoleBasedAbsenceDashboard - currentUser:", currentUser);
  console.log("RoleBasedAbsenceDashboard - isAdministrativeRole:", isAdministrativeRole);
  console.log("RoleBasedAbsenceDashboard - isPureTeacher:", isPureTeacher);
  console.log("RoleBasedAbsenceDashboard - permissions:", permissions);

  useEffect(() => {
    loadAbsences();
  }, [currentUser, filters]);

  const loadAbsences = async () => {
    setLoading(true);
    try {
      const data = await absenceService.getAbsences(currentUser, filters);
      setAbsences(data);
    } catch (error) {
      console.error("Erreur lors du chargement des absences:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les absences",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-slate-500">Chargement des absences...</p>
      </div>
    );
  }

  // Interface Administrative PRIORITAIRE pour tous les rôles administratifs
  if (isAdministrativeRole) {
    return (
      <div className="space-y-6">
        <AdministrativeHeader currentUser={currentUser} />
        <Tabs defaultValue="gestion-absences" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="gestion-absences" className="bg-blue-600 text-white data-[state=active]:bg-blue-700">
              Gestion des Absences
            </TabsTrigger>
            <TabsTrigger value="approbation" disabled={!permissions.canApproveAbsences} className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Approbation
            </TabsTrigger>
            <TabsTrigger value="statistiques" disabled={!permissions.canViewStatistics} className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              Statistiques
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="gestion-absences" className="mt-6">
            <AdminAbsenceManagementTab currentUser={currentUser} />
          </TabsContent>
          
          {permissions.canApproveAbsences && (
            <TabsContent value="approbation" className="mt-6">
              <AdministrativeApproval />
            </TabsContent>
          )}
          
          {permissions.canViewStatistics && (
            <TabsContent value="statistiques" className="mt-6">
              <AbsenceStatistics />
            </TabsContent>
          )}
        </Tabs>
      </div>
    );
  }

  // Vue Enseignant UNIQUEMENT pour les enseignants purs sans rôle administratif
  if (isPureTeacher) {
    return (
      <div className="space-y-6">
        <TeacherHeader currentUser={currentUser} />
        <TeacherAbsenceDashboard />
      </div>
    );
  }

  // Vue par défaut - FORCER L'INTERFACE ADMINISTRATIVE pour tous les autres cas
  return (
    <div className="space-y-6">
      <AdministrativeHeader currentUser={currentUser} />
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <p className="text-yellow-800">
          ⚠️ Rôle détecté: {currentUser.role} - Interface administrative forcée
        </p>
      </div>
      <Tabs defaultValue="gestion-absences" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="gestion-absences" className="bg-blue-600 text-white data-[state=active]:bg-blue-700">
            Gestion des Absences
          </TabsTrigger>
          <TabsTrigger value="approbation" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
            Approbation
          </TabsTrigger>
          <TabsTrigger value="statistiques" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
            Statistiques
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="gestion-absences" className="mt-6">
          <AdminAbsenceManagementTab currentUser={currentUser} />
        </TabsContent>
        
        <TabsContent value="approbation" className="mt-6">
          <AdministrativeApproval />
        </TabsContent>
        
        <TabsContent value="statistiques" className="mt-6">
          <AbsenceStatistics />
        </TabsContent>
      </Tabs>
    </div>
  );
};
