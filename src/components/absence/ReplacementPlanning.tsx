
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Calendar, Search, Plus, CheckCircle2, Clock } from "lucide-react";
import { useState } from "react";

interface ReplacementAssignment {
  id: string;
  absentTeacher: string;
  course: string;
  date: string;
  time: string;
  replacementTeacher: string | null;
  status: "pending" | "assigned" | "confirmed" | "completed";
  urgency: "low" | "normal" | "high";
}

export const ReplacementPlanning = () => {
  const [filter, setFilter] = useState("all");
  
  const [assignments] = useState<ReplacementAssignment[]>([
    {
      id: "REP001",
      absentTeacher: "Dr. Sarah Benali",
      course: "Microéconomie L3 - Groupe A",
      date: "2024-06-20",
      time: "08:00-10:00",
      replacementTeacher: "Prof. Ahmed Mansouri",
      status: "assigned",
      urgency: "high"
    },
    {
      id: "REP002",
      absentTeacher: "Dr. Sarah Benali",
      course: "Statistiques L2 - Groupe B",
      date: "2024-06-20",
      time: "14:00-16:00",
      replacementTeacher: null,
      status: "pending",
      urgency: "high"
    },
    {
      id: "REP003",
      absentTeacher: "Prof. Karim Meziani",
      course: "Économie générale L1",
      date: "2024-06-25",
      time: "10:00-12:00",
      replacementTeacher: "Dr. Fatima Ouali",
      status: "confirmed",
      urgency: "normal"
    }
  ]);

  const availableTeachers = [
    { id: "T001", name: "Prof. Ahmed Mansouri", speciality: "Microéconomie", availability: "Disponible" },
    { id: "T002", name: "Dr. Fatima Ouali", speciality: "Macroéconomie", availability: "Disponible" },
    { id: "T003", name: "Prof. Yacine Mansouri", speciality: "Statistiques", availability: "Limité" },
    { id: "T004", name: "Dr. Amina Benali", speciality: "Gestion", availability: "Disponible" }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-amber-100 text-amber-800">En attente</Badge>;
      case "assigned":
        return <Badge className="bg-blue-100 text-blue-800">Assigné</Badge>;
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800">Confirmé</Badge>;
      case "completed":
        return <Badge className="bg-gray-100 text-gray-800">Terminé</Badge>;
      default:
        return <Badge>-</Badge>;
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case "high":
        return <Badge className="bg-red-100 text-red-800">Urgent</Badge>;
      case "normal":
        return <Badge className="bg-blue-100 text-blue-800">Normal</Badge>;
      case "low":
        return <Badge className="bg-gray-100 text-gray-800">Faible</Badge>;
      default:
        return <Badge>-</Badge>;
    }
  };

  const assignReplacement = (assignmentId: string, teacherId: string) => {
    console.log(`Assigner ${teacherId} pour ${assignmentId}`);
  };

  const filteredAssignments = assignments.filter(assignment => {
    if (filter === "all") return true;
    return assignment.status === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Planification des Remplacements</h2>
          <p className="text-slate-600">Gestion automatique et manuelle des remplacements</p>
        </div>
        <div className="flex gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les remplacements</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="assigned">Assignés</SelectItem>
              <SelectItem value="confirmed">Confirmés</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Attribution Manuelle
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-600 text-sm font-medium">En Attente</p>
                <p className="text-2xl font-bold text-amber-800">
                  {assignments.filter(a => a.status === "pending").length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Assignés</p>
                <p className="text-2xl font-bold text-blue-800">
                  {assignments.filter(a => a.status === "assigned").length}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Confirmés</p>
                <p className="text-2xl font-bold text-green-800">
                  {assignments.filter(a => a.status === "confirmed").length}
                </p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Taux de Couverture</p>
                <p className="text-2xl font-bold text-purple-800">85%</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des remplacements */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Remplacements à Organiser
            </CardTitle>
            <CardDescription>
              {filteredAssignments.length} remplacement(s) {filter !== "all" && `(${filter})`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Enseignant Absent</TableHead>
                  <TableHead>Cours</TableHead>
                  <TableHead>Date/Heure</TableHead>
                  <TableHead>Remplaçant</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssignments.map((assignment) => (
                  <TableRow key={assignment.id}>
                    <TableCell className="font-medium">{assignment.absentTeacher}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{assignment.course}</p>
                        {getUrgencyBadge(assignment.urgency)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p>{new Date(assignment.date).toLocaleDateString('fr-FR')}</p>
                        <p className="text-sm text-slate-600">{assignment.time}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {assignment.replacementTeacher ? (
                        <span className="font-medium">{assignment.replacementTeacher}</span>
                      ) : (
                        <span className="text-slate-500 italic">Non assigné</span>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(assignment.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {assignment.status === "pending" && (
                          <Button size="sm" variant="outline">
                            <Search className="h-3 w-3 mr-1" />
                            Chercher
                          </Button>
                        )}
                        {assignment.status === "assigned" && (
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Confirmer
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

        {/* Enseignants disponibles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Enseignants Disponibles
            </CardTitle>
            <CardDescription>Pool de remplaçants potentiels</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {availableTeachers.map((teacher) => (
              <div key={teacher.id} className="p-3 border border-slate-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{teacher.name}</h4>
                  <Badge 
                    className={
                      teacher.availability === "Disponible" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-amber-100 text-amber-800"
                    }
                  >
                    {teacher.availability}
                  </Badge>
                </div>
                <p className="text-sm text-slate-600 mb-2">{teacher.speciality}</p>
                <Button size="sm" variant="outline" className="w-full">
                  <Plus className="h-3 w-3 mr-1" />
                  Assigner
                </Button>
              </div>
            ))}

            <div className="pt-4 border-t">
              <Button variant="outline" className="w-full">
                <Search className="h-4 w-4 mr-2" />
                Rechercher Plus
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
