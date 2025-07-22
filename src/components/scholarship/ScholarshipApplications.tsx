
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Search, Filter, Plus, Eye, Download, Send } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { NewScholarshipApplicationForm } from "./NewScholarshipApplicationForm";

interface Application {
  id: string;
  studentName: string;
  studentId: string;
  scholarshipType: string;
  status: string;
  submissionDate: string;
  amount: number;
  evaluator?: string;
}

const mockApplications: Application[] = [
  {
    id: "APP001",
    studentName: "Amina Benali",
    studentId: "20240001",
    scholarshipType: "Mérite Académique",
    status: "en_evaluation",
    submissionDate: "2024-01-15",
    amount: 3000,
    evaluator: "Prof. Martin"
  },
  {
    id: "APP002",
    studentName: "Karim Meziane",
    studentId: "20240002",
    scholarshipType: "Besoin Social",
    status: "acceptee",
    submissionDate: "2024-01-10",
    amount: 2500
  },
  {
    id: "APP003",
    studentName: "Fatima Ouali",
    studentId: "20240003",
    scholarshipType: "Excellence Sportive",
    status: "en_attente",
    submissionDate: "2024-01-20",
    amount: 2000
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "en_attente":
      return <Badge variant="secondary">En Attente</Badge>;
    case "en_evaluation":
      return <Badge variant="outline">En Évaluation</Badge>;
    case "acceptee":
      return <Badge variant="default">Acceptée</Badge>;
    case "refusee":
      return <Badge variant="destructive">Refusée</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export const ScholarshipApplications = () => {
  const { toast } = useToast();
  const [applications, setApplications] = useState<Application[]>(mockApplications);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Nouveau : gestion affichage modal
  const [showModal, setShowModal] = useState(false);

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.studentId.includes(searchTerm);
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    const matchesType = typeFilter === "all" || app.scholarshipType === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleAction = (action: string, applicationId?: string) => {
    if (action === "Exporter") {
      toast({ title: "Export fictif", description: "Export Excel en cours (fictif)" });
      return;
    }
    toast({
      title: "Action effectuée",
      description: `${action} pour la candidature ${applicationId}`
    });
  };

  function handleAddNewApplication(data: any) {
    setApplications(current => [
      {
        id: `APP${1000+current.length+1}`,
        studentName: data.studentName,
        studentId: data.studentId,
        scholarshipType: data.scholarshipType,
        status: "en_attente",
        submissionDate: new Date().toISOString(),
        amount: data.amount,
        evaluator: "-",
        // Ajoutez documents au besoin ou ignorez-les en frontend seul
      },
      ...current
    ]);
    setShowModal(false);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Gestion des Candidatures</CardTitle>
              <CardDescription>
                Suivi et traitement des demandes de bourses
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleAction("Exporter")}>
                Exporter (Excel)
              </Button>
              <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogTrigger asChild>
                  <Button data-testid="nouvelle-candidature-btn">
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvelle Candidature
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Nouvelle Candidature</DialogTitle>
                  </DialogHeader>
                  <NewScholarshipApplicationForm
                    onSubmit={handleAddNewApplication}
                    onCancel={() => setShowModal(false)}
                  />
                </DialogContent>
              </Dialog>
              <Button variant="ghost" onClick={() => window.open("/faq", "_blank")}>
                FAQ
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filtres */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom ou numéro étudiant..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="en_attente">En Attente</SelectItem>
                <SelectItem value="en_evaluation">En Évaluation</SelectItem>
                <SelectItem value="acceptee">Acceptée</SelectItem>
                <SelectItem value="refusee">Refusée</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Type de bourse" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="Mérite Académique">Mérite Académique</SelectItem>
                <SelectItem value="Besoin Social">Besoin Social</SelectItem>
                <SelectItem value="Excellence Sportive">Excellence Sportive</SelectItem>
                <SelectItem value="Recherche">Recherche</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tableau des candidatures */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Étudiant</TableHead>
                <TableHead>Type de Bourse</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Date Soumission</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Évaluateur</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium">{app.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{app.studentName}</div>
                      <div className="text-sm text-muted-foreground">{app.studentId}</div>
                    </div>
                  </TableCell>
                  <TableCell>{app.scholarshipType}</TableCell>
                  <TableCell>€{app.amount.toLocaleString()}</TableCell>
                  <TableCell>{new Date(app.submissionDate).toLocaleDateString('fr-FR')}</TableCell>
                  <TableCell>{getStatusBadge(app.status)}</TableCell>
                  <TableCell>{app.evaluator || "-"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleAction("Consulter", app.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleAction("Télécharger", app.id)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleAction("Notifier", app.id)}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{applications.length}</div>
            <div className="text-sm text-muted-foreground">Total Candidatures</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {applications.filter(app => app.status === "en_attente").length}
            </div>
            <div className="text-sm text-muted-foreground">En Attente</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {applications.filter(app => app.status === "en_evaluation").length}
            </div>
            <div className="text-sm text-muted-foreground">En Évaluation</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {applications.filter(app => app.status === "acceptee").length}
            </div>
            <div className="text-sm text-muted-foreground">Acceptées</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
