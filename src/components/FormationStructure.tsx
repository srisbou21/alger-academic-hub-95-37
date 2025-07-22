
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { SemesterSelector } from "./formation/SemesterSelector";
import { UECard } from "./formation/UECard";
import { SemesterSummary } from "./formation/SemesterSummary";

interface FormationStructureProps {
  selectedFormation: string;
}

export const FormationStructure = ({ selectedFormation }: FormationStructureProps) => {
  const [selectedSemester, setSelectedSemester] = useState("S1");

  // Structure de la formation Licence Économie
  const formationStructure = {
    "licence-economie": {
      semesters: [
        {
          id: "S1",
          name: "Semestre 1",
          ects: 30,
          ues: [
            {
              code: "UE11",
              name: "Économie générale I",
              ects: 6,
              coefficient: 3,
              type: "fondamentale",
              subjects: [
                { code: "ECON101", name: "Introduction à l'économie", hours: 42, coefficient: 1, teacher: "Dr. Benali" },
                { code: "ECON102", name: "Microéconomie de base", hours: 28, coefficient: 1, teacher: "Pr. Mansouri" }
              ]
            },
            {
              code: "UE12",
              name: "Mathématiques I",
              ects: 6,
              coefficient: 3,
              type: "outil",
              subjects: [
                { code: "MATH101", name: "Analyse I", hours: 42, coefficient: 1.5, teacher: "Dr. Khelifi" },
                { code: "MATH102", name: "Algèbre I", hours: 28, coefficient: 1, teacher: "Dr. Amara" }
              ]
            },
            {
              code: "UE13",
              name: "Langues I",
              ects: 4,
              coefficient: 2,
              type: "transversale",
              subjects: [
                { code: "LANG101", name: "Anglais I", hours: 28, coefficient: 1, teacher: "Ms. Johnson" },
                { code: "LANG102", name: "Français I", hours: 21, coefficient: 0.5, teacher: "Dr. Dubois" }
              ]
            },
            {
              code: "UE14",
              name: "Informatique I",
              ects: 4,
              coefficient: 2,
              type: "outil",
              subjects: [
                { code: "INFO101", name: "Bureautique", hours: 21, coefficient: 0.5, teacher: "Dr. Belkacem" },
                { code: "INFO102", name: "Introduction aux SGBD", hours: 21, coefficient: 0.5, teacher: "Dr. Saadi" }
              ]
            }
          ]
        }
      ]
    }
  };

  const currentStructure = formationStructure[selectedFormation as keyof typeof formationStructure];
  const currentSemester = currentStructure?.semesters.find(s => s.id === selectedSemester);

  if (!currentStructure) {
    return (
      <Card className="border-red-200">
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-700">Structure non disponible pour cette formation</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <SemesterSelector 
        semesters={currentStructure.semesters}
        selectedSemester={selectedSemester}
        onSemesterChange={setSelectedSemester}
        currentSemester={currentSemester}
      />

      {currentSemester && (
        <>
          <div className="space-y-4">
            {currentSemester.ues.map((ue) => (
              <UECard key={ue.code} ue={ue} />
            ))}
          </div>

          <SemesterSummary semester={currentSemester} />
        </>
      )}
    </div>
  );
};
