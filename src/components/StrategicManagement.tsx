
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Clock, AlertTriangle, Users, Shield, FileText, Mail, Settings, UserCheck, Building2, Target, Calendar } from "lucide-react";

export const StrategicManagement = () => {
  const pendingDecisions = [
    { 
      id: "DEC-2024-001", 
      title: "Création nouvelle filière Finance Islamique", 
      type: "Création programme", 
      priority: "high", 
      deadline: "2024-07-15",
      status: "pending"
    },
    { 
      id: "DEC-2024-002", 
      title: "Partenariat Université Paris Dauphine", 
      type: "Partenariat international", 
      priority: "medium", 
      deadline: "2024-07-30",
      status: "review"
    },
    { 
      id: "DEC-2024-003", 
      title: "Budget formation continue 2024-2025", 
      type: "Budget", 
      priority: "high", 
      deadline: "2024-06-30",
      status: "approved"
    },
    { 
      id: "DEC-2024-004", 
      title: "Réforme système d'évaluation", 
      type: "Réforme pédagogique", 
      priority: "medium", 
      deadline: "2024-08-15",
      status: "pending"
    }
  ];

  const facultyProjects = [
    {
      id: "PROJ-001",
      title: "Digitalisation des cours",
      manager: "Dr. Amina Belaidi",
      progress: 75,
      budget: 150000,
      deadline: "2024-09-30",
      status: "active"
    },
    {
      id: "PROJ-002", 
      title: "Centre d'entrepreneuriat",
      manager: "Prof. Karim Mansouri",
      progress: 45,
      budget: 300000,
      deadline: "2024-12-15",
      status: "active"
    },
    {
      id: "PROJ-003",
      title: "Laboratoire FinTech",
      manager: "Dr. Sarah Benali",
      progress: 90,
      budget: 200000,
      deadline: "2024-07-31",
      status: "completing"
    },
    {
      id: "PROJ-004",
      title: "Programme double diplôme",
      manager: "Prof. Omar Khaldi",
      progress: 25,
      budget: 180000,
      deadline: "2025-02-28",
      status: "planning"
    }
  ];

  const accessRoles = [
    { role: "Directeur Faculté", users: 1, permissions: ["Toutes"], status: "active" },
    { role: "Vice-Doyen Pédagogie", users: 1, permissions: ["Gestion académique", "Validation"], status: "active" },
    { role: "Vice-Doyen Recherche", users: 1, permissions: ["Projets recherche", "Publications"], status: "active" },
    { role: "Responsable Département", users: 4, permissions: ["Pilotage département", "Équipes"], status: "active" },
    { role: "Secrétaire Général", users: 1, permissions: ["Administration", "Budget"], status: "active" },
    { role: "Coordinateur Pédagogique", users: 8, permissions: ["Programmes", "Emplois du temps"], status: "active" }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-amber-100 text-amber-800 border-amber-200";
      case "low": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "pending": return "bg-amber-100 text-amber-800 border-amber-200";
      case "review": return "bg-blue-100 text-blue-800 border-blue-200";
      case "active": return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "completing": return "bg-purple-100 text-purple-800 border-purple-200";
      case "planning": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved": return "Approuvé";
      case "pending": return "En attente";
      case "review": return "En révision";
      case "active": return "Actif";
      case "completing": return "Finalisation";
      case "planning": return "Planification";
      default: return "Inconnu";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved": return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
      case "pending": return <Clock className="h-4 w-4 text-amber-600" />;
      case "review": return <AlertTriangle className="h-4 w-4 text-blue-600" />;
      case "active": return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
      case "completing": return <CheckCircle2 className="h-4 w-4 text-purple-600" />;
      case "planning": return <Clock className="h-4 w-4 text-blue-600" />;
      default: return <Clock className="h-4 w-4 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="decisions" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="decisions">Validation Décisions</TabsTrigger>
          <TabsTrigger value="access">Habilitations</TabsTrigger>
          <TabsTrigger value="projects">Projets Faculté</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
        </TabsList>

        <TabsContent value="decisions" className="space-y-6">
          {/* Statistiques des décisions */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-amber-600 text-sm font-medium">En attente</p>
                    <p className="text-2xl font-bold text-amber-800">8</p>
                  </div>
                  <Clock className="h-8 w-8 text-amber-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-medium">En révision</p>
                    <p className="text-2xl font-bold text-blue-800">3</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-600 text-sm font-medium">Approuvées</p>
                    <p className="text-2xl font-bold text-emerald-800">24</p>
                  </div>
                  <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-600 text-sm font-medium">Ce mois</p>
                    <p className="text-2xl font-bold text-purple-800">12</p>
                  </div>
                  <Calendar className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Liste des décisions en attente */}
          <Card className="border-slate-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-slate-600" />
                Décisions en Attente de Validation
              </CardTitle>
              <CardDescription>Décisions nécessitant une validation de la direction</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {pendingDecisions.map((decision, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(decision.status)}
                      <h4 className="font-semibold text-slate-800">{decision.title}</h4>
                      <Badge className={getPriorityColor(decision.priority)}>
                        {decision.priority === "high" ? "Priorité haute" : 
                         decision.priority === "medium" ? "Priorité moyenne" : "Priorité basse"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <span>ID: {decision.id}</span>
                      <span>Type: {decision.type}</span>
                      <span>Échéance: {new Date(decision.deadline).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(decision.status)}>
                      {getStatusText(decision.status)}
                    </Badge>
                    {decision.status === "pending" && (
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                          Approuver
                        </Button>
                        <Button size="sm" variant="outline" className="border-red-200 text-red-700 hover:bg-red-50">
                          Rejeter
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="access" className="space-y-6">
          {/* Gestion des habilitations */}
          <Card className="border-slate-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-slate-600" />
                Gestion des Habilitations et Accès
              </CardTitle>
              <CardDescription>Contrôle des permissions et rôles utilisateurs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {accessRoles.map((role, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <UserCheck className="h-5 w-5 text-slate-600" />
                      <h4 className="font-semibold text-slate-800">{role.role}</h4>
                      <Badge className="bg-blue-100 text-blue-800">
                        {role.users} utilisateur{role.users > 1 ? 's' : ''}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {role.permissions.map((perm, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {perm}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(role.status)}>
                      {getStatusText(role.status)}
                    </Badge>
                    <Button size="sm" variant="outline">
                      Modifier
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Formulaire nouveau rôle */}
          <Card className="border-emerald-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-t-lg">
              <CardTitle className="text-emerald-800">Créer Nouveau Rôle</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nom du rôle</label>
                  <Input placeholder="Ex: Coordinateur International" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Niveau d'accès</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le niveau" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrateur</SelectItem>
                      <SelectItem value="manager">Gestionnaire</SelectItem>
                      <SelectItem value="user">Utilisateur</SelectItem>
                      <SelectItem value="readonly">Lecture seule</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea placeholder="Description des responsabilités et permissions" />
              </div>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                Créer le rôle
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          {/* Suivi des projets */}
          <Card className="border-slate-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-slate-600" />
                Projets Stratégiques de la Faculté
              </CardTitle>
              <CardDescription>Suivi et pilotage des grands projets</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {facultyProjects.map((project, index) => (
                <div key={index} className="p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-slate-600" />
                      <h4 className="font-semibold text-slate-800">{project.title}</h4>
                      <Badge className={getStatusColor(project.status)}>
                        {getStatusText(project.status)}
                      </Badge>
                    </div>
                    <div className="text-sm text-slate-600">
                      {project.budget.toLocaleString()}€
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div>
                      <span className="text-xs text-slate-500">Responsable</span>
                      <p className="font-medium">{project.manager}</p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500">Progression</span>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{project.progress}%</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500">Échéance</span>
                      <p className="font-medium">{new Date(project.deadline).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Détails</Button>
                    <Button size="sm" variant="outline">Rapports</Button>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">Piloter</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communication" className="space-y-6">
          {/* Communication institutionnelle */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-slate-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-slate-600" />
                  Communications Récentes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
                  <h4 className="font-medium text-blue-800">Conseil d'Administration</h4>
                  <p className="text-sm text-blue-600">Présentation budget 2025 - 28/06/2024</p>
                </div>
                <div className="p-3 bg-emerald-50 border-l-4 border-emerald-500 rounded">
                  <h4 className="font-medium text-emerald-800">Presse Nationale</h4>
                  <p className="text-sm text-emerald-600">Article sur innovation pédagogique - 25/06/2024</p>
                </div>
                <div className="p-3 bg-purple-50 border-l-4 border-purple-500 rounded">
                  <h4 className="font-medium text-purple-800">Newsletter Alumni</h4>
                  <p className="text-sm text-purple-600">Mise à jour mensuelle - 20/06/2024</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-slate-600" />
                  Nouvelle Communication
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Type de communication</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="internal">Communication interne</SelectItem>
                      <SelectItem value="university">Vers l'université</SelectItem>
                      <SelectItem value="press">Communiqué de presse</SelectItem>
                      <SelectItem value="alumni">Newsletter Alumni</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Objet</label>
                  <Input placeholder="Sujet de la communication" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <Textarea placeholder="Contenu de la communication" rows={4} />
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Envoyer la communication
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
