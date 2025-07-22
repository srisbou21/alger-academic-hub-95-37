
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, Trophy, Target, TrendingUp } from "lucide-react";

interface UEGrade {
  subject: string;
  grade: number | null;
  coefficient: number;
  ects: number;
}

interface UE {
  id: string;
  name: string;
  code: string;
  ects: number;
  grades: UEGrade[];
  average: number | null;
  isValidated: boolean;
  status: "acquired" | "compensated" | "failed" | "pending";
}

interface SemesterData {
  id: string;
  name: string;
  ues: UE[];
  average: number | null;
  totalEcts: number;
  acquiredEcts: number;
  isValidated: boolean;
}

export const AutomaticAverages = () => {
  const [selectedYear, setSelectedYear] = useState("2024");
  const [selectedSemester, setSelectedSemester] = useState("S1");

  const semesterData: SemesterData = {
    id: "s1-2024",
    name: "Semestre 1 - 2024",
    ues: [
      {
        id: "ue1",
        name: "UE Économie Fondamentale",
        code: "UE1",
        ects: 8,
        grades: [
          { subject: "Microéconomie", grade: 15.5, coefficient: 3, ects: 4 },
          { subject: "Macroéconomie", grade: 13.0, coefficient: 2, ects: 4 }
        ],
        average: 14.5,
        isValidated: true,
        status: "acquired"
      },
      {
        id: "ue2",
        name: "UE Méthodes Quantitatives",
        code: "UE2",
        ects: 6,
        grades: [
          { subject: "Statistiques", grade: 12.0, coefficient: 2, ects: 3 },
          { subject: "Mathématiques", grade: 11.5, coefficient: 2, ects: 3 }
        ],
        average: 11.75,
        isValidated: true,
        status: "compensated"
      },
      {
        id: "ue3",
        name: "UE Gestion",
        code: "UE3",
        ects: 6,
        grades: [
          { subject: "Comptabilité", grade: 16.0, coefficient: 3, ects: 4 },
          { subject: "Management", grade: null, coefficient: 1, ects: 2 }
        ],
        average: null,
        isValidated: false,
        status: "pending"
      }
    ],
    average: 13.1,
    totalEcts: 20,
    acquiredEcts: 14,
    isValidated: false
  };

  const calculateUEAverage = (ue: UE): number | null => {
    const validGrades = ue.grades.filter(g => g.grade !== null);
    if (validGrades.length === 0) return null;
    
    const totalWeighted = validGrades.reduce((sum, g) => sum + (g.grade! * g.coefficient), 0);
    const totalCoeff = validGrades.reduce((sum, g) => sum + g.coefficient, 0);
    
    return totalWeighted / totalCoeff;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "acquired": return "bg-green-100 text-green-800 border-green-200";
      case "compensated": return "bg-blue-100 text-blue-800 border-blue-200";
      case "failed": return "bg-red-100 text-red-800 border-red-200";
      case "pending": return "bg-amber-100 text-amber-800 border-amber-200";
      default: return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "acquired": return "Acquise";
      case "compensated": return "Compensée";
      case "failed": return "Non acquise";
      case "pending": return "En cours";
      default: return status;
    }
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 16) return "text-purple-600";
    if (grade >= 14) return "text-blue-600";
    if (grade >= 12) return "text-emerald-600";
    if (grade >= 10) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      {/* Sélecteurs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Calcul Automatique des Moyennes
          </CardTitle>
          <CardDescription>
            Moyennes calculées en temps réel selon les coefficients et crédits ECTS
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Année universitaire</label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024-2025</SelectItem>
                  <SelectItem value="2023">2023-2024</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Semestre</label>
              <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="S1">Semestre 1</SelectItem>
                  <SelectItem value="S2">Semestre 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Résumé général */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4 text-center">
            <Trophy className="h-6 w-6 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-800">
              {semesterData.average ? semesterData.average.toFixed(2) : "—"}
            </div>
            <div className="text-sm text-purple-600">Moyenne Semestre</div>
          </CardContent>
        </Card>
        
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4 text-center">
            <Target className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-800">
              {semesterData.acquiredEcts}/{semesterData.totalEcts}
            </div>
            <div className="text-sm text-blue-600">ECTS Acquis</div>
          </CardContent>
        </Card>
        
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-emerald-800">
              {semesterData.ues.filter(ue => ue.isValidated).length}
            </div>
            <div className="text-sm text-emerald-600">UE Validées</div>
          </CardContent>
        </Card>
        
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4 text-center">
            <Calculator className="h-6 w-6 text-amber-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-amber-800">
              {((semesterData.acquiredEcts / semesterData.totalEcts) * 100).toFixed(0)}%
            </div>
            <div className="text-sm text-amber-600">Progression</div>
          </CardContent>
        </Card>
      </div>

      {/* Détail par UE */}
      <Card>
        <CardHeader>
          <CardTitle>Moyennes par Unité d'Enseignement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {semesterData.ues.map((ue) => (
              <div key={ue.id} className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-slate-800">{ue.name}</h3>
                      <Badge variant="outline">{ue.code}</Badge>
                      <Badge className={getStatusColor(ue.status)}>
                        {getStatusText(ue.status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600">{ue.ects} ECTS</p>
                  </div>
                  <div className="text-right">
                    {ue.average !== null ? (
                      <div className={`text-2xl font-bold ${getGradeColor(ue.average)}`}>
                        {ue.average.toFixed(2)}/20
                      </div>
                    ) : (
                      <div className="text-xl text-slate-400">En cours</div>
                    )}
                  </div>
                </div>

                {ue.average !== null && (
                  <div className="mb-4">
                    <Progress value={(ue.average / 20) * 100} className="h-2" />
                  </div>
                )}

                <div className="space-y-2">
                  <h4 className="font-medium text-slate-700 text-sm">Détail des matières :</h4>
                  {ue.grades.map((grade, index) => (
                    <div key={index} className="flex items-center justify-between text-sm p-2 bg-slate-50 rounded">
                      <div className="flex items-center gap-2">
                        <span>{grade.subject}</span>
                        <Badge variant="outline" className="text-xs">
                          Coeff. {grade.coefficient}
                        </Badge>
                      </div>
                      <div className="font-medium">
                        {grade.grade !== null ? (
                          <span className={getGradeColor(grade.grade)}>
                            {grade.grade}/20
                          </span>
                        ) : (
                          <span className="text-slate-400">En attente</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Explication du calcul */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-800">Mode de calcul</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-blue-700">
            <p>• <strong>Moyenne UE :</strong> Moyenne pondérée par les coefficients des matières</p>
            <p>• <strong>Moyenne Semestre :</strong> Moyenne pondérée par les crédits ECTS des UE</p>
            <p>• <strong>Validation UE :</strong> Moyenne UE ≥ 10/20</p>
            <p>• <strong>Compensation :</strong> UE entre 8 et 10 compensée par d'autres UE</p>
            <p>• <strong>Validation Semestre :</strong> Moyenne générale ≥ 10/20 et aucune UE &lt; 8/20</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
