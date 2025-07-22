import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { 
  Users, Calendar, FileText, MessageCircle, Clock, 
  CheckCircle, AlertTriangle, Eye, Download, Upload
} from "lucide-react";
import { useState } from "react";

export const SupervisionDashboard = () => {
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  const mySupervisions = [
    {
      id: "SUP001",
      student: "Amina Benali",
      type: "Stage",
      title: "Analyse financière - Sonelgaz",
      startDate: "2024-02-01",
      endDate: "2024-04-30",
      lastMeeting: "2024-06-10",
      nextMeeting: "2024-06-17",
      progress: 75,
      status: "en_cours",
      documents: ["Convention", "Rapport intermédiaire"],
      notes: "Bon travail, continue sur l'analyse des ratios"
    },
    {
      id: "SUP002",
      student: "Yacine Mansouri",
      type: "PFE",
      title: "Performance financière des banques algériennes",
      startDate: "2024-01-01",
      endDate: "2024-06-15",
      lastMeeting: "2024-06-08",
      nextMeeting: "2024-06-15",
      progress: 85,
      status: "redaction",
      documents: ["Plan détaillé", "Chapitre 1", "Chapitre 2"],
      notes: "Prêt pour la soutenance, réviser la conclusion"
    },
    {
      id: "SUP003",
      student: "Fatima Zohra",
      type: "Stage",
      title: "Marketing digital - Air Algérie",
      startDate: "2024-03-01",
      endDate: "2024-05-31",
      lastMeeting: "2024-06-05",
      nextMeeting: "2024-06-19",
      progress: 60,
      status: "en_cours",
      documents: ["Convention"],
      notes: "Doit approfondir l'analyse des résultats"
    }
  ];

  const upcomingMeetings = [
    { student: "Yacine Mansouri", date: "2024-06-15", time: "10:00", type: "PFE", topic: "Révision finale" },
    { student: "Amina Benali", date: "2024-06-17", time: "14:00", type: "Stage", topic: "Suivi progression" },
    { student: "Fatima Zohra", date: "2024-06-19", time: "09:00", type: "Stage", topic: "Méthodologie" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "en_cours": return "bg-blue-100 text-blue-800 border-blue-200";
      case "redaction": return "bg-purple-100 text-purple-800 border-purple-200";
      case "termine": return "bg-green-100 text-green-800 border-green-200";
      case "retard": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "en_cours": return "En cours";
      case "redaction": return "Rédaction";
      case "termine": return "Terminé";
      case "retard": return "En retard";
      default: return status;
    }
  };

  const getTypeColor = (type: string) => {
    return type === "PFE" ? "bg-purple-600" : "bg-blue-600";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Mes Encadrements</h2>
          <p className="text-slate-600">Suivi des étudiants sous ma supervision</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Calendar className="mr-2 h-4 w-4" />
            Planifier RDV
          </Button>
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Rapport d'encadrement
          </Button>
        </div>
      </div>

      {/* Statistiques d'encadrement */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Étudiants encadrés</p>
                <p className="text-2xl font-bold text-blue-800">{mySupervisions.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">PFE en cours</p>
                <p className="text-2xl font-bold text-purple-800">
                  {mySupervisions.filter(s => s.type === "PFE").length}
                </p>
              </div>
              <FileText className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-600 text-sm font-medium">Stages encadrés</p>
                <p className="text-2xl font-bold text-emerald-800">
                  {mySupervisions.filter(s => s.type === "Stage").length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-600 text-sm font-medium">RDV cette semaine</p>
                <p className="text-2xl font-bold text-amber-800">{upcomingMeetings.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Liste des encadrements */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Mes Encadrements Actifs
            </CardTitle>
            <CardDescription>Liste de tous les étudiants sous votre supervision</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Étudiant</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Titre</TableHead>
                    <TableHead>Progression</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Dernier RDV</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mySupervisions.map((supervision) => (
                    <TableRow key={supervision.id}>
                      <TableCell className="font-medium">{supervision.student}</TableCell>
                      <TableCell>
                        <Badge className={`text-white ${getTypeColor(supervision.type)}`}>
                          {supervision.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate" title={supervision.title}>
                          {supervision.title}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={supervision.progress} className="w-16 h-2" />
                          <span className="text-sm text-slate-600">{supervision.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(supervision.status)}>
                          {getStatusText(supervision.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(supervision.lastMeeting).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setSelectedStudent(supervision.id)}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <MessageCircle className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Prochains rendez-vous */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Prochains Rendez-vous
          </CardTitle>
          <CardDescription>Planning des rencontres programmées</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingMeetings.map((meeting, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-sm font-mono text-blue-700 bg-blue-200 px-3 py-1 rounded">
                      {new Date(meeting.date).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="text-sm font-mono text-blue-600 mt-1">
                      {meeting.time}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800">{meeting.student}</h4>
                    <p className="text-sm text-slate-600">{meeting.topic}</p>
                    <Badge className={`text-white ${getTypeColor(meeting.type)} mt-1`}>
                      {meeting.type}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <MessageCircle className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Calendar className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
