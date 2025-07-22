
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, AlertTriangle, CheckCircle, Clock, FileText, Calculator, TrendingUp, Award, Users } from "lucide-react";
import { useState } from "react";

export const AcademicTracking = () => {
  const [selectedStudent, setSelectedStudent] = useState("all");
  const [selectedUE, setSelectedUE] = useState("all");

  // Données des étudiants avec notes, absences et validation
  const studentsData = [
    {
      id: "20230045",
      name: "Amina Benali",
      class: "L3 Économie",
      ues: [
        {
          code: "UE31",
          name: "Microéconomie Avancée",
          coefficient: 3,
          ects: 6,
          evaluations: [
            { type: "CC1", note: 14, coefficient: 0.3, date: "2024-03-15" },
            { type: "CC2", note: 12, coefficient: 0.2, date: "2024-04-20" },
            { type: "Examen", note: 16, coefficient: 0.5, date: "2024-05-25" }
          ],
          moyenne: 14.4,
          validated: true,
          absences: { total: 32, absents: 3, taux: 9.4 },
          status: "validé"
        },
        {
          code: "UE32",
          name: "Statistiques II",
          coefficient: 2,
          ects: 4,
          evaluations: [
            { type: "CC1", note: 8, coefficient: 0.4, date: "2024-03-10" },
            { type: "CC2", note: 10, coefficient: 0.2, date: "2024-04-15" },
            { type: "Examen", note: null, coefficient: 0.4, date: "2024-06-05" }
          ],
          moyenne: null,
          validated: false,
          absences: { total: 28, absents: 8, taux: 28.6 },
          status: "risque"
        }
      ],
      moyenneGenerale: 13.2,
      ectsValidated: 24,
      ectsTotal: 30,
      progressionCursus: 80
    }
  ];

  const calculateUEAverage = (evaluations: any[]) => {
    const validEvals = evaluations.filter(evaluation => evaluation.note !== null);
    if (validEvals.length === 0) return null;
    
    const total = validEvals.reduce((sum, evaluation) => sum + (evaluation.note * evaluation.coefficient), 0);
    const coeffTotal = validEvals.reduce((sum, evaluation) => sum + evaluation.coefficient, 0);
    
    return coeffTotal > 0 ? (total / coeffTotal).toFixed(1) : null;
  };

  const getAbsenceStatus = (taux: number) => {
    if (taux >= 50) return { color: "red", label: "Exclusion", icon: AlertTriangle };
    if (taux >= 25) return { color: "orange", label: "Alerte critique", icon: AlertTriangle };
    if (taux >= 15) return { color: "yellow", label: "Surveillance", icon: Clock };
    return { color: "green", label: "Normal", icon: CheckCircle };
  };

  const getValidationStatus = (status: string) => {
    switch (status) {
      case "validé": return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Validé</Badge>;
      case "rattrapage": return <Badge className="bg-orange-100 text-orange-800"><Clock className="h-3 w-3 mr-1" />Rattrapage</Badge>;
      case "risque": return <Badge className="bg-red-100 text-red-800"><AlertTriangle className="h-3 w-3 mr-1" />Risque</Badge>;
      default: return <Badge className="bg-gray-100 text-gray-800">En cours</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête et filtres */}
      <Card className="border-blue-200">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <BookOpen className="h-5 w-5" />
            Suivi Pédagogique Avancé
          </CardTitle>
          <CardDescription>Gestion complète des notes, absences et validation des acquis</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex gap-4 mb-4">
            <Select value={selectedStudent} onValueChange={setSelectedStudent}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Sélectionner un étudiant" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les étudiants</SelectItem>
                <SelectItem value="20230045">Amina Benali</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedUE} onValueChange={setSelectedUE}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Filtrer par UE" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les UE</SelectItem>
                <SelectItem value="UE31">UE31 - Microéconomie</SelectItem>
                <SelectItem value="UE32">UE32 - Statistiques</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="notes" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="notes" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
            <Calculator className="h-4 w-4 mr-2" />
            Suivi des Notes
          </TabsTrigger>
          <TabsTrigger value="absences" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
            <Users className="h-4 w-4 mr-2" />
            Suivi des Absences
          </TabsTrigger>
          <TabsTrigger value="validation" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
            <Award className="h-4 w-4 mr-2" />
            Validation des Acquis
          </TabsTrigger>
        </TabsList>

        {/* Onglet Suivi des Notes */}
        <TabsContent value="notes" className="space-y-6">
          {studentsData.map((student) => (
            <Card key={student.id} className="border-emerald-200">
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-emerald-100">
                <CardTitle className="text-emerald-800">
                  {student.name} - {student.class}
                </CardTitle>
                <div className="flex gap-4 text-sm text-emerald-700">
                  <span>Moyenne générale: <strong>{student.moyenneGenerale}/20</strong></span>
                  <span>ECTS validés: <strong>{student.ectsValidated}/{student.ectsTotal}</strong></span>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {student.ues.map((ue) => (
                    <div key={ue.code} className="border border-slate-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h4 className="font-semibold text-slate-800">{ue.code} - {ue.name}</h4>
                          <p className="text-sm text-slate-600">
                            Coefficient: {ue.coefficient} | ECTS: {ue.ects} | 
                            Moyenne: <span className="font-semibold">{ue.moyenne || "—"}/20</span>
                          </p>
                        </div>
                        {getValidationStatus(ue.status)}
                      </div>
                      
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Évaluation</TableHead>
                            <TableHead className="text-center">Note</TableHead>
                            <TableHead className="text-center">Coefficient</TableHead>
                            <TableHead className="text-center">Date</TableHead>  
                            <TableHead className="text-center">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {ue.evaluations.map((evaluation, idx) => (
                            <TableRow key={idx}>
                              <TableCell className="font-medium">{evaluation.type}</TableCell>
                              <TableCell className="text-center">
                                <Input 
                                  type="number" 
                                  value={evaluation.note || ""} 
                                  className="w-16 text-center"
                                  min="0" 
                                  max="20"
                                  placeholder="—"
                                />
                              </TableCell>
                              <TableCell className="text-center">{evaluation.coefficient}</TableCell>
                              <TableCell className="text-center text-sm text-slate-600">
                                {new Date(evaluation.date).toLocaleDateString('fr-FR')}
                              </TableCell>
                              <TableCell className="text-center">
                                <Button size="sm" variant="outline">Modifier</Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Onglet Suivi des Absences */}
        <TabsContent value="absences" className="space-y-6">
          {studentsData.map((student) => (
            <Card key={student.id} className="border-amber-200">
              <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100">
                <CardTitle className="text-amber-800">
                  Absences - {student.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {student.ues.map((ue) => {
                    const absenceStatus = getAbsenceStatus(ue.absences.taux);
                    const StatusIcon = absenceStatus.icon;
                    
                    return (
                      <div key={ue.code} className="border border-slate-200 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-semibold text-slate-800">{ue.code} - {ue.name}</h4>
                          <Badge className={`bg-${absenceStatus.color}-100 text-${absenceStatus.color}-800`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {absenceStatus.label}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="text-center p-3 bg-slate-50 rounded">
                            <p className="text-2xl font-bold text-slate-800">{ue.absences.total}</p>
                            <p className="text-sm text-slate-600">Séances totales</p>
                          </div>
                          <div className="text-center p-3 bg-red-50 rounded">
                            <p className="text-2xl font-bold text-red-700">{ue.absences.absents}</p>
                            <p className="text-sm text-red-600">Absences</p>
                          </div>
                          <div className="text-center p-3 bg-blue-50 rounded">
                            <p className="text-2xl font-bold text-blue-700">{ue.absences.taux.toFixed(1)}%</p>
                            <p className="text-sm text-blue-600">Taux d'absence</p>
                          </div>
                        </div>
                        
                        <Progress 
                          value={ue.absences.taux} 
                          className="h-3"
                        />
                        <div className="flex justify-between text-xs text-slate-500 mt-1">
                          <span>0%</span>
                          <span className="text-yellow-600">25% (Alerte)</span>
                          <span className="text-red-600">50% (Exclusion)</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Onglet Validation des Acquis */}
        <TabsContent value="validation" className="space-y-6">
          {studentsData.map((student) => (
            <Card key={student.id} className="border-purple-200">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100">
                <CardTitle className="text-purple-800">
                  Validation des Acquis - {student.name}
                </CardTitle>
                <CardDescription>
                  Progression dans le cursus: {student.progressionCursus}%
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Synthèse globale */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-3xl font-bold text-green-700">{student.ectsValidated}</p>
                      <p className="text-sm text-green-600">ECTS Validés</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-3xl font-bold text-blue-700">{student.ectsTotal}</p>
                      <p className="text-sm text-blue-600">ECTS Total</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <p className="text-3xl font-bold text-purple-700">{student.moyenneGenerale}</p>
                      <p className="text-sm text-purple-600">Moyenne générale</p>
                    </div>
                  </div>

                  <Progress value={student.progressionCursus} className="h-4" />

                  {/* Détail par UE */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-800">Détail par Unité d'Enseignement</h4>
                    {student.ues.map((ue) => (
                      <div key={ue.code} className="flex justify-between items-center p-4 border border-slate-200 rounded-lg">
                        <div>
                          <h5 className="font-medium text-slate-800">{ue.code} - {ue.name}</h5>
                          <p className="text-sm text-slate-600">
                            Moyenne: {ue.moyenne || "—"}/20 | ECTS: {ue.ects}
                          </p>
                        </div>
                        <div className="text-right">
                          {getValidationStatus(ue.status)}
                          {ue.validated && (
                            <p className="text-xs text-green-600 mt-1">
                              +{ue.ects} ECTS acquis
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t">
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      <FileText className="h-4 w-4 mr-2" />
                      Générer relevé de notes
                    </Button>
                    <Button variant="outline" className="border-purple-200">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Rapport de progression
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};
