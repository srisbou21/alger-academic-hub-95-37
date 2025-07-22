
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, Users, Calendar, CheckCircle, Clock, AlertTriangle, 
  Upload, Download, BookOpen, GraduationCap, Building2, Star
} from "lucide-react";
import { useState } from "react";

export const StageManagement = () => {
  const [selectedTab, setSelectedTab] = useState("stages");

  const stages = [
    { 
      id: "STG001", 
      student: "Amina Benali", 
      company: "Sonelgaz", 
      supervisor: "Dr. Mansouri", 
      startDate: "2024-02-01", 
      endDate: "2024-04-30",
      status: "en_cours",
      progress: 75,
      reportSubmitted: false
    },
    { 
      id: "STG002", 
      student: "Mohamed Cherif", 
      company: "BNA", 
      supervisor: "Dr. Boudjedra", 
      startDate: "2024-01-15", 
      endDate: "2024-04-15",
      status: "termine",
      progress: 100,
      reportSubmitted: true
    },
    { 
      id: "STG003", 
      student: "Fatima Zohra", 
      company: "Air Algérie", 
      supervisor: "Dr. Mansouri", 
      startDate: "2024-03-01", 
      endDate: "2024-05-31",
      status: "planifie",
      progress: 0,
      reportSubmitted: false
    }
  ];

  const projetsPfe = [
    {
      id: "PFE001",
      student: "Yacine Mansouri",
      title: "Analyse de la performance financière des banques algériennes",
      supervisor: "Prof. Belkacem",
      coSupervisor: "Dr. Hamdani",
      startDate: "2024-01-01",
      defenseDate: "2024-06-15",
      status: "redaction",
      progress: 60,
      grade: null
    },
    {
      id: "PFE002",
      student: "Leila Boudjedra",
      title: "Impact du commerce électronique sur l'économie algérienne",
      supervisor: "Dr. Benali",
      coSupervisor: null,
      startDate: "2023-12-01",
      defenseDate: "2024-06-20",
      status: "soutenu",
      progress: 100,
      grade: 16
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "en_cours": case "redaction": return "bg-blue-100 text-blue-800 border-blue-200";
      case "termine": case "soutenu": return "bg-green-100 text-green-800 border-green-200";
      case "planifie": return "bg-amber-100 text-amber-800 border-amber-200";
      case "retard": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "en_cours": return "En cours";
      case "termine": return "Terminé";
      case "planifie": return "Planifié";
      case "redaction": return "Rédaction";
      case "soutenu": return "Soutenu";
      case "retard": return "En retard";
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Gestion des Stages et PFE</h2>
          <p className="text-slate-600">Suivi des stages et projets de fin d'études</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Upload className="mr-2 h-4 w-4" />
            Nouveau stage
          </Button>
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Nouveau PFE
          </Button>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="stages" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Stages
          </TabsTrigger>
          <TabsTrigger value="pfe" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Projets de Fin d'Études
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stages" className="space-y-6">
          {/* Statistiques des stages */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-medium">Stages actifs</p>
                    <p className="text-2xl font-bold text-blue-800">12</p>
                  </div>
                  <Clock className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-medium">Stages terminés</p>
                    <p className="text-2xl font-bold text-green-800">8</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-amber-600 text-sm font-medium">Rapports en attente</p>
                    <p className="text-2xl font-bold text-amber-800">5</p>
                  </div>
                  <FileText className="h-8 w-8 text-amber-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-600 text-sm font-medium">Entreprises partenaires</p>
                    <p className="text-2xl font-bold text-purple-800">45</p>
                  </div>
                  <Building2 className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Liste des stages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Stages en cours et planifiés
              </CardTitle>
              <CardDescription>Suivi des stages des étudiants</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Étudiant</TableHead>
                      <TableHead>Entreprise</TableHead>
                      <TableHead>Encadrant</TableHead>
                      <TableHead>Période</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Progression</TableHead>
                      <TableHead>Rapport</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stages.map((stage) => (
                      <TableRow key={stage.id}>
                        <TableCell className="font-medium">{stage.student}</TableCell>
                        <TableCell>{stage.company}</TableCell>
                        <TableCell>{stage.supervisor}</TableCell>
                        <TableCell className="text-sm">
                          {new Date(stage.startDate).toLocaleDateString('fr-FR')} - 
                          {new Date(stage.endDate).toLocaleDateString('fr-FR')}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(stage.status)}>
                            {getStatusText(stage.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={stage.progress} className="w-16 h-2" />
                            <span className="text-sm text-slate-600">{stage.progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {stage.reportSubmitted ? (
                            <Badge className="bg-green-100 text-green-800">
                              <Download className="mr-1 h-3 w-3" />
                              Rendu
                            </Badge>
                          ) : (
                            <Badge className="bg-amber-100 text-amber-800">
                              <Clock className="mr-1 h-3 w-3" />
                              En attente
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline">
                              <FileText className="h-3 w-3" />
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
        </TabsContent>

        <TabsContent value="pfe" className="space-y-6">
          {/* Statistiques des PFE */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-600 text-sm font-medium">PFE en cours</p>
                    <p className="text-2xl font-bold text-purple-800">24</p>
                  </div>
                  <BookOpen className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-medium">Soutenances programmées</p>
                    <p className="text-2xl font-bold text-blue-800">8</p>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-medium">PFE soutenus</p>
                    <p className="text-2xl font-bold text-green-800">156</p>
                  </div>
                  <GraduationCap className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-amber-600 text-sm font-medium">Note moyenne</p>
                    <p className="text-2xl font-bold text-amber-800">14.2/20</p>
                  </div>
                  <Star className="h-8 w-8 text-amber-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Liste des PFE */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Projets de Fin d'Études Master
              </CardTitle>
              <CardDescription>Suivi des mémoires de fin d'études</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Étudiant</TableHead>
                      <TableHead>Titre du projet</TableHead>
                      <TableHead>Encadrant</TableHead>
                      <TableHead>Co-encadrant</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Progression</TableHead>
                      <TableHead>Soutenance</TableHead>
                      <TableHead>Note</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projetsPfe.map((projet) => (
                      <TableRow key={projet.id}>
                        <TableCell className="font-medium">{projet.student}</TableCell>
                        <TableCell className="max-w-xs">
                          <div className="truncate" title={projet.title}>
                            {projet.title}
                          </div>
                        </TableCell>
                        <TableCell>{projet.supervisor}</TableCell>
                        <TableCell>{projet.coSupervisor || "—"}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(projet.status)}>
                            {getStatusText(projet.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={projet.progress} className="w-16 h-2" />
                            <span className="text-sm text-slate-600">{projet.progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(projet.defenseDate).toLocaleDateString('fr-FR')}
                        </TableCell>
                        <TableCell>
                          {projet.grade ? (
                            <Badge className="bg-blue-100 text-blue-800">
                              {projet.grade}/20
                            </Badge>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline">
                              <FileText className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Calendar className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Users className="h-3 w-3" />
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
        </TabsContent>
      </Tabs>
    </div>
  );
};
