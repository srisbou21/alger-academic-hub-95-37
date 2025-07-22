
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload, Download, Save, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { useState } from "react";

export const GradeManagement = () => {
  const [selectedClass, setSelectedClass] = useState("micro-l3");
  
  const studentsData = [
    {
      id: "001",
      name: "Amina Benali",
      cc1: 14,
      cc2: 12,
      exam: null,
      rattrapage: null,
      average: null,
      absences: 3,
      status: "risk"
    },
    {
      id: "002", 
      name: "Mohamed Cherif",
      cc1: 16,
      cc2: 15,
      exam: 17,
      rattrapage: null,
      average: 16.0,
      absences: 1,
      status: "good"
    },
    {
      id: "003",
      name: "Fatima Zohra", 
      cc1: 13,
      cc2: 11,
      exam: null,
      rattrapage: null,
      average: null,
      absences: 5,
      status: "alert"
    },
    {
      id: "004",
      name: "Yacine Mansouri",
      cc1: 18,
      cc2: 17,
      exam: 19,
      rattrapage: null,
      average: 18.0,
      absences: 0,
      status: "excellent"
    }
  ];

  const getStatusBadge = (status: string, absences: number) => {
    if (absences >= 5) return <Badge className="bg-red-100 text-red-800"><AlertTriangle className="h-3 w-3 mr-1" />Alerte absences</Badge>;
    if (status === "excellent") return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Excellent</Badge>;
    if (status === "good") return <Badge className="bg-blue-100 text-blue-800">Bon niveau</Badge>;
    if (status === "risk") return <Badge className="bg-amber-100 text-amber-800"><Clock className="h-3 w-3 mr-1" />À surveiller</Badge>;
    return <Badge className="bg-gray-100 text-gray-800">En cours</Badge>;
  };

  return (
    <Card className="border-emerald-200">
      <CardHeader className="bg-gradient-to-r from-emerald-50 to-emerald-100">
        <CardTitle className="flex items-center gap-2 text-emerald-800">
          Gestion Avancée des Notes
        </CardTitle>
        <CardDescription>Saisie, import et suivi avec alertes automatiques</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <select 
            className="p-2 border border-emerald-200 rounded-lg bg-white"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="micro-l3">Microéconomie L3 (45 étudiants)</option>
            <option value="stats-l2">Statistiques L2 (38 étudiants)</option>
            <option value="eco-l1">Économie générale L1 (67 étudiants)</option>
          </select>
          
          <div className="flex gap-2">
            <Button variant="outline" className="border-emerald-200">
              <Upload className="h-4 w-4 mr-2" />
              Import Excel
            </Button>
            <Button variant="outline" className="border-emerald-200">
              <Download className="h-4 w-4 mr-2" />
              Export Excel
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Étudiant</TableHead>
                <TableHead className="text-center">CC1</TableHead>
                <TableHead className="text-center">CC2</TableHead>
                <TableHead className="text-center">Examen</TableHead>
                <TableHead className="text-center">Rattrapage</TableHead>
                <TableHead className="text-center">Moyenne</TableHead>
                <TableHead className="text-center">Absences</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {studentsData.map((student) => (
                <TableRow key={student.id} className={student.absences >= 5 ? "bg-red-50" : ""}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell className="text-center">
                    <Input 
                      type="number" 
                      defaultValue={student.cc1} 
                      className="w-16 text-center"
                      min="0" 
                      max="20" 
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Input 
                      type="number" 
                      defaultValue={student.cc2} 
                      className="w-16 text-center"
                      min="0" 
                      max="20" 
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Input 
                      type="number" 
                      defaultValue={student.exam || ""} 
                      className="w-16 text-center"
                      min="0" 
                      max="20" 
                      placeholder="—"
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Input 
                      type="number" 
                      defaultValue={student.rattrapage || ""} 
                      className="w-16 text-center"
                      min="0" 
                      max="20" 
                      placeholder="—"
                    />
                  </TableCell>
                  <TableCell className="text-center font-semibold">
                    {student.average ? `${student.average}/20` : "—"}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={student.absences >= 5 ? "text-red-600 font-bold" : ""}>
                      {student.absences}
                    </span>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(student.status, student.absences)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex gap-2 mt-4">
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Save className="h-4 w-4 mr-2" />
            Sauvegarder les modifications
          </Button>
          <Button variant="outline" className="border-blue-200 text-blue-700">
            Générer liste émargement
          </Button>
          <Button variant="outline" className="border-amber-200 text-amber-700">
            Rapport d'absences
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
