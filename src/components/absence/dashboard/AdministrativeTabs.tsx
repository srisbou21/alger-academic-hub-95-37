
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, TrendingUp, Shield, Calendar } from "lucide-react";
import { User as UserType } from "../../../types/user";
import { AbsencePermissions } from "../../../services/permissionService";
import { AdvancedAbsenceTracking } from "../AdvancedAbsenceTracking";
import { AdministrativeApproval } from "../AdministrativeApproval";
import { AbsenceStatistics } from "../AbsenceStatistics";
import { FeaturesInfoCard } from "./FeaturesInfoCard";
import { TeacherGraphicsSelector } from "./TeacherGraphicsSelector";
import { TeacherGraphicsView } from "./TeacherGraphicsView";

interface AdministrativeTabsProps {
  currentUser: UserType;
  permissions: AbsencePermissions;
  selectedTeacherForGraphics: string | null;
  onSelectTeacher: (teacherId: string) => void;
  onDeselectTeacher: () => void;
}

export const AdministrativeTabs: React.FC<AdministrativeTabsProps> = ({
  currentUser,
  permissions,
  selectedTeacherForGraphics,
  onSelectTeacher,
  onDeselectTeacher
}) => {
  return (
    <Tabs defaultValue="advanced" className="w-full">
      <TabsList className="grid w-full grid-cols-4 bg-white shadow-sm border border-slate-200">
        <TabsTrigger 
          value="advanced"
          className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white flex items-center gap-2"
        >
          <BarChart3 className="h-4 w-4" />
          Suivi Avancé
        </TabsTrigger>
        <TabsTrigger 
          value="graphics"
          className="data-[state=active]:bg-purple-600 data-[state=active]:text-white flex items-center gap-2"
        >
          <TrendingUp className="h-4 w-4" />
          Analyses Graphiques
        </TabsTrigger>
        <TabsTrigger 
          value="approval"
          className="data-[state=active]:bg-green-600 data-[state=active]:text-white flex items-center gap-2"
          disabled={!permissions.canApproveAbsences}
        >
          <Shield className="h-4 w-4" />
          Approbations
        </TabsTrigger>
        <TabsTrigger 
          value="statistics"
          className="data-[state=active]:bg-orange-600 data-[state=active]:text-white flex items-center gap-2"
        >
          <Calendar className="h-4 w-4" />
          Statistiques
        </TabsTrigger>
      </TabsList>

      <TabsContent value="advanced" className="space-y-6">
        <FeaturesInfoCard />
        <AdvancedAbsenceTracking currentUser={currentUser} />
      </TabsContent>

      <TabsContent value="graphics" className="space-y-6">
        {selectedTeacherForGraphics ? (
          <TeacherGraphicsView 
            selectedTeacherId={selectedTeacherForGraphics}
            currentUser={currentUser}
            onBack={onDeselectTeacher}
          />
        ) : (
          <TeacherGraphicsSelector onSelectTeacher={onSelectTeacher} />
        )}
      </TabsContent>

      {permissions.canApproveAbsences && (
        <TabsContent value="approval" className="space-y-6">
          <AdministrativeApproval />
        </TabsContent>
      )}

      <TabsContent value="statistics" className="space-y-6">
        <AbsenceStatistics />
      </TabsContent>
    </Tabs>
  );
};
