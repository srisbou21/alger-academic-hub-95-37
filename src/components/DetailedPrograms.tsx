
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { useState } from "react";
import { ProgramSelector } from "./programs/ProgramSelector";
import { ProgramHeader } from "./programs/ProgramHeader";
import { ObjectivesTab } from "./programs/ObjectivesTab";
import { SyllabusTab } from "./programs/SyllabusTab";
import { EvaluationTab } from "./programs/EvaluationTab";
import { BibliographyTab } from "./programs/BibliographyTab";

interface DetailedProgramsProps {
  selectedFormation: string;
}

export const DetailedPrograms = ({ selectedFormation }: DetailedProgramsProps) => {
  const [selectedSubject, setSelectedSubject] = useState("ECON101");

  // Programmes détaillés des matières
  const detailedPrograms = {
    "ECON101": {
      code: "ECON101",
      name: "Introduction à l'économie",
      ue: "UE11 - Économie générale I",
      semester: "S1",
      hours: 42,
      ects: 3,
      coefficient: 1,
      teacher: "Dr. Benali",
      objectives: [
        "Comprendre les concepts fondamentaux de l'économie",
        "Maîtriser les mécanismes de base du marché",
        "Analyser les comportements des agents économiques",
        "Distinguer microéconomie et macroéconomie"
      ],
      syllabus: {
        chapters: [
          {
            title: "Introduction générale à l'économie",
            duration: "6h",
            content: [
              "Définition et objet de l'économie",
              "Les grands courants de pensée économique",
              "Méthodologie de l'analyse économique"
            ]
          },
          {
            title: "Les agents économiques",
            duration: "8h",
            content: [
              "Les ménages et la consommation",
              "Les entreprises et la production",
              "L'État et les politiques économiques",
              "Les relations avec l'extérieur"
            ]
          },
          {
            title: "Les marchés et la formation des prix",
            duration: "10h",
            content: [
              "Le mécanisme de l'offre et de la demande",
              "L'équilibre de marché",
              "Les différentes structures de marché",
              "Les défaillances du marché"
            ]
          },
          {
            title: "Introduction à la macroéconomie",
            duration: "8h",
            content: [
              "Les agrégats macroéconomiques",
              "Le circuit économique",
              "La croissance économique",
              "L'inflation et le chômage"
            ]
          }
        ]
      },
      evaluation: {
        methods: [
          { type: "Contrôle Continu 1", coefficient: 0.3, description: "QCM + Questions courtes" },
          { type: "Contrôle Continu 2", coefficient: 0.2, description: "Étude de cas" },
          { type: "Examen Final", coefficient: 0.5, description: "Épreuve écrite 2h" }
        ],
        skills: [
          "Maîtrise du vocabulaire économique de base",
          "Capacité d'analyse des phénomènes économiques simples",
          "Compréhension des mécanismes de marché",
          "Initiation à l'analyse graphique"
        ]
      },
      bibliography: {
        required: [
          "Mankiw, G. (2019). Principes de l'économie. De Boeck, 4e édition",
          "Samuelson, P. & Nordhaus, W. (2018). Économie. Economica, 20e édition"
        ],
        recommended: [
          "Stiglitz, J. (2017). L'économie du secteur public. De Boeck",
          "Krugman, P. & Wells, R. (2019). Microéconomie. De Boeck, 5e édition",
          "Beitone, A. et al. (2020). Dictionnaire des sciences économiques. Armand Colin"
        ]
      }
    }
  };

  const availableSubjects = [
    { code: "ECON101", name: "Introduction à l'économie", ue: "UE11" },
    { code: "ECON102", name: "Microéconomie de base", ue: "UE11" },
    { code: "MATH101", name: "Analyse I", ue: "UE12" },
    { code: "MATH102", name: "Algèbre I", ue: "UE12" },
    { code: "LANG101", name: "Anglais I", ue: "UE13" },
    { code: "INFO101", name: "Bureautique", ue: "UE14" }
  ];

  const currentProgram = detailedPrograms[selectedSubject as keyof typeof detailedPrograms];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-8 w-8" />
            Système de Gestion des Programmes Détaillés
          </CardTitle>
          <p className="text-blue-100">
            Consultation et gestion des programmes pédagogiques détaillés par matière
          </p>
        </CardHeader>
      </Card>

      <ProgramSelector 
        availableSubjects={availableSubjects}
        selectedSubject={selectedSubject}
        onSubjectChange={setSelectedSubject}
      />

      {currentProgram && (
        <div className="space-y-6">
          <ProgramHeader program={currentProgram} />

          <Tabs defaultValue="objectives" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="objectives">Objectifs</TabsTrigger>
              <TabsTrigger value="syllabus">Programme</TabsTrigger>
              <TabsTrigger value="evaluation">Évaluation</TabsTrigger>
              <TabsTrigger value="bibliography">Bibliographie</TabsTrigger>
            </TabsList>

            <TabsContent value="objectives" className="space-y-4">
              <ObjectivesTab objectives={currentProgram.objectives} />
            </TabsContent>

            <TabsContent value="syllabus" className="space-y-4">
              <SyllabusTab chapters={currentProgram.syllabus.chapters} />
            </TabsContent>

            <TabsContent value="evaluation" className="space-y-4">
              <EvaluationTab 
                methods={currentProgram.evaluation.methods}
                skills={currentProgram.evaluation.skills}
              />
            </TabsContent>

            <TabsContent value="bibliography" className="space-y-4">
              <BibliographyTab 
                required={currentProgram.bibliography.required}
                recommended={currentProgram.bibliography.recommended}
              />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};
