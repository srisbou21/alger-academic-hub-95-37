
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Calculator, Trophy, AlertTriangle, CheckCircle, Download, RefreshCw } from "lucide-react";

interface StudentGrade {
  id: string;
  studentId: string;
  studentName: string;
  subject: string;
  grade: number;
  coefficient: number;
  isEliminatory: boolean;
}

interface StudentResult {
  studentId: string;
  studentName: string;
  weightedAverage: number;
  totalCoefficients: number;
  finalAverage: number;
  isEliminated: boolean;
  eliminatorySubjects: string[];
  mention: string;
  rank: number;
  canPass: boolean;
}

export const GradeCalculations = () => {
  const { toast } = useToast();
  const [selectedPromotion, setSelectedPromotion] = useState("");
  const [selectedSession, setSelectedSession] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculationProgress, setCalculationProgress] = useState(0);
  const [results, setResults] = useState<StudentResult[]>([]);
  
  // Données de test
  const [grades] = useState<StudentGrade[]>([
    { id: "1", studentId: "20230001", studentName: "Amina Benali", subject: "Microéconomie", grade: 15.5, coefficient: 3, isEliminatory: false },
    { id: "2", studentId: "20230001", studentName: "Amina Benali", subject: "Statistiques", grade: 12.0, coefficient: 2, isEliminatory: true },
    { id: "3", studentId: "20230001", studentName: "Amina Benali", subject: "Management", grade: 16.0, coefficient: 2, isEliminatory: false },
    { id: "4", studentId: "20230002", studentName: "Karim Meziani", subject: "Microéconomie", grade: 11.0, coefficient: 3, isEliminatory: false },
    { id: "5", studentId: "20230002", studentName: "Karim Meziani", subject: "Statistiques", grade: 8.0, coefficient: 2, isEliminatory: true },
    { id: "6", studentId: "20230002", studentName: "Karim Meziani", subject: "Management", grade: 14.0, coefficient: 2, isEliminatory: false },
    { id: "7", studentId: "20230003", studentName: "Fatima Ouali", subject: "Microéconomie", grade: 18.0, coefficient: 3, isEliminatory: false },
    { id: "8", studentId: "20230003", studentName: "Fatima Ouali", subject: "Statistiques", grade: 16.5, coefficient: 2, isEliminatory: true },
    { id: "9", studentId: "20230003", studentName: "Fatima Ouali", subject: "Management", grade: 17.0, coefficient: 2, isEliminatory: false }
  ]);

  const promotions = ["L3 Économie", "L3 Gestion", "M1 Finance", "M1 Marketing"];
  const sessions = ["Session 1 - 2024", "Session 2 - 2024", "Rattrapage - 2024"];

  const calculateMention = (average: number): string => {
    if (average >= 16) return "Très Bien";
    if (average >= 14) return "Bien";
    if (average >= 12) return "Assez Bien";
    if (average >= 10) return "Passable";
    return "Ajourné";
  };

  const getMentionColor = (mention: string): string => {
    switch (mention) {
      case "Très Bien": return "bg-purple-100 text-purple-800 border-purple-200";
      case "Bien": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Assez Bien": return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Passable": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default: return "bg-red-100 text-red-800 border-red-200";
    }
  };

  const calculateResults = () => {
    setIsCalculating(true);
    setCalculationProgress(0);

    const interval = setInterval(() => {
      setCalculationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsCalculating(false);
          performCalculations();
          return 100;
        }
        return prev + 20;
      });
    }, 300);
  };

  const performCalculations = () => {
    // Grouper les notes par étudiant
    const studentGroups = grades.reduce((acc, grade) => {
      if (!acc[grade.studentId]) {
        acc[grade.studentId] = {
          studentName: grade.studentName,
          grades: []
        };
      }
      acc[grade.studentId].grades.push(grade);
      return acc;
    }, {} as Record<string, { studentName: string; grades: StudentGrade[] }>);

    // Calculer les résultats pour chaque étudiant
    const calculatedResults: StudentResult[] = Object.entries(studentGroups).map(([studentId, data]) => {
      const studentGrades = data.grades;
      
      // Vérifier les matières éliminatoires
      const eliminatorySubjects = studentGrades
        .filter(g => g.isEliminatory && g.grade < 8)
        .map(g => g.subject);
      
      const isEliminated = eliminatorySubjects.length > 0;
      
      // Calculer la moyenne pondérée
      const totalWeightedGrades = studentGrades.reduce((sum, grade) => sum + (grade.grade * grade.coefficient), 0);
      const totalCoefficients = studentGrades.reduce((sum, grade) => sum + grade.coefficient, 0);
      const weightedAverage = totalWeightedGrades / totalCoefficients;
      
      // Moyenne finale (0 si éliminé)
      const finalAverage = isEliminated ? 0 : weightedAverage;
      
      // Mention
      const mention = calculateMention(finalAverage);
      
      // Règles de passage
      const canPass = !isEliminated && finalAverage >= 10;

      return {
        studentId,
        studentName: data.studentName,
        weightedAverage,
        totalCoefficients,
        finalAverage,
        isEliminated,
        eliminatorySubjects,
        mention,
        rank: 0, // Sera calculé après tri
        canPass
      };
    });

    // Trier par moyenne décroissante et attribuer les rangs
    calculatedResults.sort((a, b) => b.finalAverage - a.finalAverage);
    calculatedResults.forEach((result, index) => {
      result.rank = index + 1;
    });

    setResults(calculatedResults);
    
    toast({
      title: "Calculs terminés",
      description: `Résultats calculés pour ${calculatedResults.length} étudiants`
    });
  };

  const exportResults = () => {
    toast({
      title: "Export en cours",
      description: "Les résultats sont en cours d'export vers Excel"
    });
  };

  const getStats = () => {
    const total = results.length;
    const passed = results.filter(r => r.canPass).length;
    const eliminated = results.filter(r => r.isEliminated).length;
    const mentions = {
      "Très Bien": results.filter(r => r.mention === "Très Bien").length,
      "Bien": results.filter(r => r.mention === "Bien").length,
      "Assez Bien": results.filter(r => r.mention === "Assez Bien").length,
      "Passable": results.filter(r => r.mention === "Passable").length,
      "Ajourné": results.filter(r => r.mention === "Ajourné").length
    };
    
    return { total, passed, eliminated, mentions, successRate: total > 0 ? (passed / total) * 100 : 0 };
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Calculs Automatiques</h2>
        <p className="text-slate-600">
          Calcul des moyennes, classements et mentions avec application des règles académiques
        </p>
      </div>

      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Configuration des Calculs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Promotion</label>
              <Select value={selectedPromotion} onValueChange={setSelectedPromotion}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une promotion" />
                </SelectTrigger>
                <SelectContent>
                  {promotions.map(promotion => (
                    <SelectItem key={promotion} value={promotion}>{promotion}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Session</label>
              <Select value={selectedSession} onValueChange={setSelectedSession}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner la session" />
                </SelectTrigger>
                <SelectContent>
                  {sessions.map(session => (
                    <SelectItem key={session} value={session}>{session}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={calculateResults}
              disabled={isCalculating || !selectedPromotion || !selectedSession}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isCalculating ? 'animate-spin' : ''}`} />
              {isCalculating ? 'Calcul en cours...' : 'Lancer les Calculs'}
            </Button>
            
            {results.length > 0 && (
              <Button onClick={exportResults} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exporter Résultats
              </Button>
            )}
          </div>

          {isCalculating && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Calcul des moyennes et classements...</span>
                <span>{calculationProgress}%</span>
              </div>
              <Progress value={calculationProgress} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistiques */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Statistiques de la Promotion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-800">{stats.total}</div>
                <div className="text-sm text-slate-600">Total étudiants</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">{stats.passed}</div>
                <div className="text-sm text-slate-600">Admis</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{stats.eliminated}</div>
                <div className="text-sm text-slate-600">Éliminés</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.successRate.toFixed(1)}%</div>
                <div className="text-sm text-slate-600">Taux de réussite</div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-slate-700">Répartition des mentions :</h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {Object.entries(stats.mentions).map(([mention, count]) => (
                  <div key={mention} className="text-center p-2 rounded-lg border">
                    <div className="font-bold">{count}</div>
                    <div className="text-xs text-slate-600">{mention}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tableau des Résultats */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Classement et Résultats</CardTitle>
            <CardDescription>
              Résultats détaillés avec moyennes pondérées et mentions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rang</TableHead>
                    <TableHead>Étudiant</TableHead>
                    <TableHead>Moyenne</TableHead>
                    <TableHead>Mention</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Observations</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((result) => (
                    <TableRow key={result.studentId} className={result.isEliminated ? "bg-red-50" : result.canPass ? "bg-emerald-50" : ""}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold">
                            {result.rank}
                          </div>
                          {result.rank <= 3 && result.canPass && (
                            <Trophy className={`h-4 w-4 ${result.rank === 1 ? 'text-yellow-500' : result.rank === 2 ? 'text-slate-400' : 'text-amber-600'}`} />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{result.studentName}</div>
                          <div className="text-sm text-slate-500">{result.studentId}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-lg font-bold">
                          {result.finalAverage.toFixed(2)}/20
                        </div>
                        <div className="text-xs text-slate-500">
                          Coefficients: {result.totalCoefficients}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getMentionColor(result.mention)}>
                          {result.mention}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {result.isEliminated ? (
                          <Badge variant="destructive">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Éliminé
                          </Badge>
                        ) : result.canPass ? (
                          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Admis
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            Ajourné
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {result.eliminatorySubjects.length > 0 ? (
                          <div className="text-sm text-red-600">
                            Note éliminatoire: {result.eliminatorySubjects.join(", ")}
                          </div>
                        ) : (
                          <div className="text-sm text-slate-500">-</div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
