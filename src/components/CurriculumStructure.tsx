
import { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { FormationSelector } from "./curriculum/FormationSelector";
import { CurriculumTabs } from "./curriculum/CurriculumTabs";

export const CurriculumStructure = () => {
  const [activeTab, setActiveTab] = useState("canevas");
  const [selectedFormation, setSelectedFormation] = useState("licence-economie");

  // Données des formations disponibles
  const formations = [
    { id: "licence-economie", name: "Licence Économie", level: "L", duration: 6 },
    { id: "licence-gestion", name: "Licence Gestion", level: "L", duration: 6 },
    { id: "master-finance", name: "Master Finance", level: "M", duration: 4 },
    { id: "master-marketing", name: "Master Marketing", level: "M", duration: 4 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="h-8 w-8" />
            Système de Gestion des Structures Curriculaires
          </CardTitle>
          <p className="text-blue-100">
            Organisation et structuration des programmes d'études et formations
          </p>
        </CardHeader>
      </Card>

      <FormationSelector 
        formations={formations}
        selectedFormation={selectedFormation}
        onFormationChange={setSelectedFormation}
      />
      
      <CurriculumTabs 
        selectedFormation={selectedFormation}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
};
