import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, FileText, AlertTriangle, Users, UserCheck } from "lucide-react";
import { useState } from "react";

export const AttendanceManagement = () => {
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const courses = [
    { id: "micro-l3", name: "Microéconomie L3", students: 45 },
    { id: "stats-l2", name: "Statistiques L2", students: 38 },
    { id: "eco-l1", name: "Économie générale L1", students: 67 }
  ];

  const attendanceData = [
    {
      studentId: "20230001",
      name: "Amina Benali",
      absences: 2,
      lastAbsence: "2024-06-10",
      status: "normal"
    },
    {
      studentId: "20230002",
      name: "Karim Meziani",
      absences: 6,
      lastAbsence: "2024-06-12",
      status: "alert"
    },
    {
      studentId: "20230003",
      name: "Fatima Ouali",
      absences: 4,
      lastAbsence: "2024-06-08",
      status: "warning"
    },
    {
      studentId: "20230004",
      name: "Yacine Mansouri",
      absences: 1,
      lastAbsence: "2024-05-15",
      status: "normal"
    }
  ];

  const getStatusBadge = (status: string, absences: number) => {
    if (absences >= 6) return <Badge className="bg-red-100 text-red-800"><AlertTriangle className="h-3 w-3 mr-1" />Alerte</Badge>;
    if (absences >= 4) return <Badge className="bg-amber-100 text-amber-800">Vigilance</Badge>;
    return <Badge className="bg-green-100 text-green-800">Normal</Badge>;
  };

  const generateAttendanceSheet = () => {
    console.log(`Génération liste d'émargement pour ${selectedCourse} - ${selectedDate}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <UserCheck className="h-8 w-8" />
            Système de Gestion des Présences
          </CardTitle>
          <p className="text-blue-100">
            Suivi des absences et génération automatique des listes d'émargement
          </p>
        </CardHeader>
      </Card>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Gestion des Présences</h2>
          <p className="text-slate-600">Suivi des absences et génération des listes d'émargement</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-blue-200">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <FileText className="h-5 w-5" />
              Listes d'Émargement
            </CardTitle>
            <CardDescription>Génération automatique des feuilles de présence</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Cours</label>
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un cours" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.name} ({course.students} étudiants)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Date du cours</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg"
              />
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={generateAttendanceSheet}
                disabled={!selectedCourse || !selectedDate}
                className="bg-blue-600 hover:bg-blue-700 flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                Générer PDF
              </Button>
              <Button variant="outline" className="border-blue-200">
                <FileText className="h-4 w-4 mr-2" />
                Aperçu
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200">
          <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100">
            <CardTitle className="flex items-center gap-2 text-amber-800">
              <AlertTriangle className="h-5 w-5" />
              Alertes Absences
            </CardTitle>
            <CardDescription>Seuils d'alerte automatiques</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                <div>
                  <p className="font-medium text-red-800">Seuil critique</p>
                  <p className="text-sm text-red-600">≥ 6 absences</p>
                </div>
                <Badge className="bg-red-600 text-white">2 étudiants</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div>
                  <p className="font-medium text-amber-800">Seuil vigilance</p>
                  <p className="text-sm text-amber-600">4-5 absences</p>
                </div>
                <Badge className="bg-amber-600 text-white">3 étudiants</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div>
                  <p className="font-medium text-green-800">Situation normale</p>
                  <p className="text-sm text-green-600">&lt; 4 absences</p>
                </div>
                <Badge className="bg-green-600 text-white">40 étudiants</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Suivi Détaillé des Absences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Étudiant</TableHead>
                <TableHead className="text-center">Nb Absences</TableHead>
                <TableHead className="text-center">Dernière Absence</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceData.map((student) => (
                <TableRow key={student.studentId}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell className="text-center">{student.absences}</TableCell>
                  <TableCell className="text-center">
                    {new Date(student.lastAbsence).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(student.status, student.absences)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Détails</Button>
                      {student.absences >= 4 && (
                        <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                          Notifier
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
