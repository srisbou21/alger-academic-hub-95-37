
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { Calendar } from "lucide-react";
import { AcademicConsultationHeader } from "./academic/AcademicConsultationHeader";
import { AcademicTabsList } from "./academic/AcademicTabsList";
import { AcademicTabsContent } from "./academic/AcademicTabsContent";

export const AcademicConsultation = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="h-8 w-8" />
            Système de Consultation Académique
          </CardTitle>
          <p className="text-blue-100">
            Gestion des rendez-vous et consultations pédagogiques
          </p>
        </CardHeader>
      </Card>

      <AcademicConsultationHeader />

      <Tabs defaultValue="schedule" className="w-full">
        <AcademicTabsList />
        <AcademicTabsContent />
      </Tabs>
    </div>
  );
};
