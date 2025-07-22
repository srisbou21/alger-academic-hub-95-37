
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Download, Archive, BookOpen, Search, Clock, CheckCircle } from "lucide-react";
import { useState } from "react";

export const StudentServices = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const attestationRequests = [
    {
      id: "ATT-2024-001",
      student: "Amina Benali",
      studentId: "20210045",
      type: "Attestation de scolarité",
      requestDate: "2024-06-10",
      status: "ready",
      urgency: "normal"
    },
    {
      id: "ATT-2024-002",
      student: "Omar Cherif", 
      studentId: "20210067",
      type: "Relevé de notes S5",
      requestDate: "2024-06-08",
      status: "processing",
      urgency: "urgent"
    },
    {
      id: "ATT-2024-003",
      student: "Sarah Benaissa",
      studentId: "20210089", 
      type: "Attestation de réussite",
      requestDate: "2024-06-05",
      status: "completed",
      urgency: "normal"
    }
  ];

  const internshipData = [
    {
      id: "STG-2024-001",
      student: "Karim Meziane",
      studentId: "20200123",
      company: "Banque d'Algérie",
      supervisor: "Dr. Benali",
      startDate: "2024-07-01",
      endDate: "2024-08-31",
      status: "active",
      documents: {
        convention: true,
        insurance: true,
        report: false
      }
    },
    {
      id: "STG-2024-002", 
      student: "Nadia Ouali",
      studentId: "20200156",
      company: "Sonatrach",
      supervisor: "Pr. Cherif",
      startDate: "2024-06-15",
      endDate: "2024-08-15",
      status: "validated",
      documents: {
        convention: true,
        insurance: true,
        report: true
      }
    }
  ];

  const thesesData = [
    {
      id: "PFE-2024-001",
      student: "Mohamed Benaissa",
      studentId: "20190234",
      title: "Impact de la digitalisation sur les PME algériennes",
      supervisor: "Dr. Ouali",
      coSupervisor: "Pr. Meziane",
      defense: "2024-07-15",
      status: "submitted"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": case "validated": return "bg-green-100 text-green-800 border-green-200";
      case "ready": return "bg-blue-100 text-blue-800 border-blue-200";
      case "processing": case "active": return "bg-amber-100 text-amber-800 border-amber-200";
      case "submitted": return "bg-purple-100 text-purple-800 border-purple-200";
      default: return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed": return "Terminé";
      case "ready": return "Prêt";
      case "processing": return "En cours";
      case "active": return "En cours";
      case "validated": return "Validé";
      case "submitted": return "Soumis";
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="attestations" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="attestations">Attestations</TabsTrigger>
          <TabsTrigger value="transcripts">Relevés de notes</TabsTrigger>
          <TabsTrigger value="internships">Stages</TabsTrigger>
          <TabsTrigger value="theses">Mémoires PFE</TabsTrigger>
        </TabsList>

        <TabsContent value="attestations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Demandes d'Attestations
              </CardTitle>
              <CardDescription>
                Traitement des demandes d'attestations de scolarité
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Rechercher par nom ou numéro..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Nouvelle demande
                </Button>
              </div>

              <div className="space-y-4">
                {attestationRequests.map((request) => (
                  <Card key={request.id} className="border-slate-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-slate-800">{request.student}</h3>
                          <p className="text-sm text-slate-600">{request.type}</p>
                          <p className="text-xs text-slate-500">ID: {request.studentId}</p>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(request.status)}>
                            {getStatusText(request.status)}
                          </Badge>
                          {request.urgency === "urgent" && (
                            <Badge className="bg-red-100 text-red-800 border-red-200 ml-2">
                              Urgent
                            </Badge>
                          )}
                          <p className="text-xs text-slate-500 mt-1">
                            {new Date(request.requestDate).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Voir détails
                        </Button>
                        {request.status === "ready" && (
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <Download className="h-4 w-4 mr-1" />
                            Télécharger
                          </Button>
                        )}
                        {request.status === "processing" && (
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            Finaliser
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transcripts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Édition des Relevés de Notes
              </CardTitle>
              <CardDescription>
                Génération automatique des relevés officiels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="p-4 text-center">
                    <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-800">45</p>
                    <p className="text-sm text-blue-600">En attente</p>
                  </CardContent>
                </Card>
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="p-4 text-center">
                    <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-800">128</p>
                    <p className="text-sm text-green-600">Générés</p>
                  </CardContent>
                </Card>
                <Card className="border-amber-200 bg-amber-50">
                  <CardContent className="p-4 text-center">
                    <Clock className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-amber-800">23</p>
                    <p className="text-sm text-amber-600">En cours</p>
                  </CardContent>
                </Card>
              </div>

              <div className="flex gap-4">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Générer relevés en lot
                </Button>
                <Button variant="outline">
                  Modèles de relevés
                </Button>
                <Button variant="outline">
                  Historique
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="internships" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Gestion des Stages
              </CardTitle>
              <CardDescription>
                Suivi des conventions et validation des stages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {internshipData.map((internship) => (
                  <Card key={internship.id} className="border-slate-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-slate-800">{internship.student}</h3>
                          <p className="text-sm text-slate-600">{internship.company}</p>
                          <p className="text-xs text-slate-500">Encadrant: {internship.supervisor}</p>
                        </div>
                        <Badge className={getStatusColor(internship.status)}>
                          {getStatusText(internship.status)}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-slate-500">Début</p>
                          <p className="font-medium">{new Date(internship.startDate).toLocaleDateString('fr-FR')}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Fin</p>
                          <p className="font-medium">{new Date(internship.endDate).toLocaleDateString('fr-FR')}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Documents</p>
                          <div className="flex gap-1">
                            {Object.entries(internship.documents).map(([doc, status]) => (
                              <div key={doc} className={`w-2 h-2 rounded-full ${status ? 'bg-green-500' : 'bg-slate-300'}`} />
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Convention
                        </Button>
                        <Button size="sm" variant="outline">
                          Suivi
                        </Button>
                        {internship.status === "active" && (
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            Valider
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="theses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Archive className="h-5 w-5" />
                Suivi des Mémoires de Fin d'Études
              </CardTitle>
              <CardDescription>
                Gestion des PFE et archivage numérique
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {thesesData.map((thesis) => (
                  <Card key={thesis.id} className="border-slate-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-slate-800">{thesis.student}</h3>
                          <p className="text-sm text-slate-600 font-medium">{thesis.title}</p>
                          <p className="text-xs text-slate-500">
                            Encadrant: {thesis.supervisor} • Co-encadrant: {thesis.coSupervisor}
                          </p>
                        </div>
                        <Badge className={getStatusColor(thesis.status)}>
                          {getStatusText(thesis.status)}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-slate-500">Date de soutenance</p>
                          <p className="font-medium">{new Date(thesis.defense).toLocaleDateString('fr-FR')}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">ID Étudiant</p>
                          <p className="font-medium">{thesis.studentId}</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Voir mémoire
                        </Button>
                        <Button size="sm" variant="outline">
                          Planning soutenance
                        </Button>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          Archiver
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
