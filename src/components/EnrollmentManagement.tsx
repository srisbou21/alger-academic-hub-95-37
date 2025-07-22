import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCheck, FileText, CreditCard, Users, CheckCircle, Clock, AlertTriangle, Search, UserPlus } from "lucide-react";
import { useState } from "react";

export const EnrollmentManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const pendingApplications = [
    {
      id: "INS-2024-001",
      name: "Sarah Benhamou",
      type: "Nouvelle inscription L1",
      status: "pending_docs",
      submitted: "2024-06-10",
      documents: {
        bac: true,
        identity: true,
        photo: false,
        medical: true,
        payment: false
      }
    },
    {
      id: "INS-2024-002", 
      name: "Karim Meziane",
      type: "Transfert L2",
      status: "review",
      submitted: "2024-06-08",
      documents: {
        bac: true,
        identity: true,
        photo: true,
        medical: true,
        payment: true,
        transcript: true
      }
    },
    {
      id: "INS-2024-003",
      name: "Nadia Ouali", 
      type: "Équivalence M1",
      status: "approved",
      submitted: "2024-06-05",
      documents: {
        diploma: true,
        transcript: true,
        identity: true,
        photo: true,
        payment: true
      }
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-green-100 text-green-800 border-green-200";
      case "pending_docs": return "bg-amber-100 text-amber-800 border-amber-200";
      case "review": return "bg-blue-100 text-blue-800 border-blue-200";
      case "rejected": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved": return "Approuvé";
      case "pending_docs": return "Documents manquants";
      case "review": return "En révision";
      case "rejected": return "Rejeté";
      default: return "Inconnu";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <UserPlus className="h-8 w-8" />
            Système de Gestion des Inscriptions
          </CardTitle>
          <p className="text-blue-100">
            Traitement complet des demandes d'inscription et validation des dossiers
          </p>
        </CardHeader>
      </Card>

      <Tabs defaultValue="applications" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="applications">Demandes d'inscription</TabsTrigger>
          <TabsTrigger value="validation">Validation dossiers</TabsTrigger>
          <TabsTrigger value="cards">Cartes étudiants</TabsTrigger>
        </TabsList>

        <TabsContent value="applications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                Demandes d'Inscription en Attente
              </CardTitle>
              <CardDescription>
                Traitement des nouvelles demandes et transferts
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
                  Nouvelle inscription
                </Button>
              </div>

              <div className="space-y-4">
                {pendingApplications.map((app) => (
                  <Card key={app.id} className="border-slate-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-slate-800">{app.name}</h3>
                          <p className="text-sm text-slate-600">{app.type}</p>
                          <p className="text-xs text-slate-500">ID: {app.id}</p>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(app.status)}>
                            {getStatusText(app.status)}
                          </Badge>
                          <p className="text-xs text-slate-500 mt-1">
                            {new Date(app.submitted).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                        {Object.entries(app.documents).map(([doc, status]) => (
                          <div key={doc} className="flex items-center gap-2">
                            {status ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <AlertTriangle className="h-4 w-4 text-amber-600" />
                            )}
                            <span className="text-xs capitalize">{doc}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Voir dossier
                        </Button>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          Valider
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 border-red-200">
                          Rejeter
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="validation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Contrôle des Pièces Justificatives
              </CardTitle>
              <CardDescription>
                Validation détaillée des documents fournis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Documents obligatoires</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                      <span className="text-sm">Diplôme de Baccalauréat</span>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                      <span className="text-sm">Pièce d'identité</span>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                      <span className="text-sm">Photo d'identité</span>
                      <Clock className="h-4 w-4 text-amber-600" />
                    </div>
                    <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                      <span className="text-sm">Certificat médical</span>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Actions de validation</h3>
                  <div className="space-y-2">
                    <Button className="w-full" variant="outline">
                      Demander document manquant
                    </Button>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Attribuer numéro d'inscription
                    </Button>
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      Finaliser inscription
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cards" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Édition des Cartes d'Étudiants
              </CardTitle>
              <CardDescription>
                Génération et impression des cartes d'étudiants
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="p-4 text-center">
                    <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-800">127</p>
                    <p className="text-sm text-blue-600">En attente</p>
                  </CardContent>
                </Card>
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="p-4 text-center">
                    <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-800">342</p>
                    <p className="text-sm text-green-600">Imprimées</p>
                  </CardContent>
                </Card>
                <Card className="border-purple-200 bg-purple-50">
                  <CardContent className="p-4 text-center">
                    <CreditCard className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-purple-800">89</p>
                    <p className="text-sm text-purple-600">Distribuées</p>
                  </CardContent>
                </Card>
              </div>

              <div className="flex gap-4">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Générer lot de cartes
                </Button>
                <Button variant="outline">
                  Impression de masse
                </Button>
                <Button variant="outline">
                  Suivi distribution
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
