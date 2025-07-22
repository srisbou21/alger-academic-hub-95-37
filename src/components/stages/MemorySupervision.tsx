
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { 
  Users, Calendar, FileText, MessageCircle, BookOpen, 
  CheckCircle, Clock, AlertTriangle, Plus, Filter
} from "lucide-react";
import { useState } from "react";

export const MemorySupervision = () => {
  const [selectedTab, setSelectedTab] = useState("supervision");

  const supervisedMemories = [
    {
      id: "MEM001",
      student: "Amina Benali",
      title: "Impact du commerce électronique sur l'économie algérienne",
      supervisor: "Prof. Mansouri",
      coSupervisor: "Dr. Belkacem",
      startDate: "2024-01-15",
      defenseDate: "2024-06-20",
      progress: 75,
      lastMeeting: "2024-06-08",
      nextMeeting: "2024-06-15",
      status: "redaction",
      milestones: [
        { name: "Choix du sujet", completed: true, date: "2024-01-15" },
        { name: "Problématique validée", completed: true, date: "2024-02-10" },
        { name: "Plan détaillé", completed: true, date: "2024-03-05" },
        { name: "Premier chapitre", completed: true, date: "2024-04-15" },
        { name: "Deuxième chapitre", completed: false, date: "2024-05-20" },
        { name: "Chapitre final", completed: false, date: "2024-06-10" }
      ]
    },
    {
      id: "MEM002", 
      student: "Yacine Boudjedra",
      title: "Analyse de la performance financière des banques islamiques",
      supervisor: "Prof. Mansouri",
      coSupervisor: null,
      startDate: "2024-02-01",
      defenseDate: "2024-06-25",
      progress: 60,
      lastMeeting: "2024-06-05",
      nextMeeting: "2024-06-12",
      status: "recherche",
      milestones: [
        { name: "Choix du sujet", completed: true, date: "2024-02-01" },
        { name: "Problématique validée", completed: true, date: "2024-02-20" },
        { name: "Plan détaillé", completed: true, date: "2024-03-15" },
        { name: "Premier chapitre", completed: false, date: "2024-04-30" },
        { name: "Deuxième chapitre", completed: false, date: "2024-05-30" },
        { name: "Chapitre final", completed: false, date: "2024-06-15" }
      ]
    }
  ];

  const upcomingMeetings = [
    {
      id: "RDV001",
      student: "Amina Benali",
      date: "2024-06-15",
      time: "10:00",
      type: "Suivi régulier",
      location: "Bureau 205",
      agenda: "Validation chapitre 2, discussion méthodologie"
    },
    {
      id: "RDV002",
      student: "Yacine Boudjedra", 
      date: "2024-06-12",
      time: "14:30",
      type: "Validation problématique",
      location: "Bureau 205",
      agenda: "Révision de la problématique et du plan"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "recherche": return "bg-blue-100 text-blue-800 border-blue-200";
      case "redaction": return "bg-purple-100 text-purple-800 border-purple-200";
      case "revision": return "bg-amber-100 text-amber-800 border-amber-200";
      case "pret": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "recherche": return "Recherche";
      case "redaction": return "Rédaction";
      case "revision": return "Révision";
      case "pret": return "Prêt";
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-slate-800">Encadrement des Mémoires</h3>
          <p className="text-slate-600">Suivi des étudiants et gestion des soutenances</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="mr-2 h-4 w-4" />
            Nouvel encadrement
          </Button>
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Planifier RDV
          </Button>
        </div>
      </div>

      {/* Statistiques d'encadrement */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Mémoires encadrés</p>
                <p className="text-2xl font-bold text-purple-800">{supervisedMemories.length}</p>
              </div>
              <BookOpen className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">En recherche</p>
                <p className="text-2xl font-bold text-blue-800">
                  {supervisedMemories.filter(m => m.status === "recherche").length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-600 text-sm font-medium">En rédaction</p>
                <p className="text-2xl font-bold text-amber-800">
                  {supervisedMemories.filter(m => m.status === "redaction").length}
                </p>
              </div>
              <FileText className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">RDV cette semaine</p>
                <p className="text-2xl font-bold text-green-800">{upcomingMeetings.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des mémoires encadrés */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Mémoires sous ma supervision
          </CardTitle>
          <CardDescription>Suivi détaillé de l'avancement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Étudiant</TableHead>
                  <TableHead>Titre</TableHead>
                  <TableHead>Co-encadrant</TableHead>
                  <TableHead>Progression</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Dernier RDV</TableHead>
                  <TableHead>Soutenance</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {supervisedMemories.map((memory) => (
                  <TableRow key={memory.id}>
                    <TableCell className="font-medium">{memory.student}</TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={memory.title}>
                        {memory.title}
                      </div>
                    </TableCell>
                    <TableCell>{memory.coSupervisor || "—"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={memory.progress} className="w-16 h-2" />
                        <span className="text-sm text-slate-600">{memory.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(memory.status)}>
                        {getStatusText(memory.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(memory.lastMeeting).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(memory.defenseDate).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline">
                          <FileText className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <MessageCircle className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Calendar className="h-3 w-3" />
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

      {/* Prochains rendez-vous */}  
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Prochains Rendez-vous
          </CardTitle>
          <CardDescription>Planning des rencontres d'encadrement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingMeetings.map((meeting) => (
              <div key={meeting.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-sm font-mono text-purple-700 bg-purple-200 px-3 py-1 rounded">
                      {new Date(meeting.date).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="text-sm font-mono text-purple-600 mt-1">
                      {meeting.time}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800">{meeting.student}</h4>
                    <p className="text-sm text-slate-600">{meeting.type}</p>
                    <p className="text-xs text-slate-500">{meeting.location}</p>
                    <p className="text-xs text-slate-500 mt-1">{meeting.agenda}</p>
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
