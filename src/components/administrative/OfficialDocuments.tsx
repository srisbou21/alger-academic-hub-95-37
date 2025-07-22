import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileText, Download, Send, Eye, CheckCircle, Clock, Search, Shield, QrCode, Plus } from "lucide-react";
import { useState } from "react";
import { DocumentRequest } from "./DocumentRequest";
import { DocumentPreview } from "./DocumentPreview";

export const OfficialDocuments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);

  const documentRequests = [
    {
      id: "DOC-2024-001",
      student: "Amina Benali",
      studentId: "20210045",
      type: "Attestation de scolarité",
      status: "pending_validation",
      requestDate: "2024-06-10",
      deadline: "2024-06-15",
      validator: "Mme. Benaissa",
      urgency: "normal"
    },
    {
      id: "DOC-2024-002", 
      student: "Omar Cherif",
      studentId: "20210067",
      type: "Relevé de notes définitif",
      status: "ready",
      requestDate: "2024-06-08",
      generatedDate: "2024-06-12",
      urgency: "urgent"
    },
    {
      id: "DOC-2024-003",
      student: "Sarah Benaissa",
      studentId: "20210089",
      type: "Certificat de réussite",
      status: "sent",
      requestDate: "2024-06-05",
      sentDate: "2024-06-11",
      urgency: "normal"
    }
  ];

  const documentTypes = [
    {
      id: "attestation_scolarite",
      name: "Attestation de scolarité",
      description: "Document certifiant l'inscription",
      template: "template_attestation.docx",
      autoGenerate: true,
      requiresValidation: false,
      avgProcessingTime: "2 heures"
    },
    {
      id: "releve_notes",
      name: "Relevé de notes",
      description: "Notes officielles par semestre",
      template: "template_releve.docx", 
      autoGenerate: false,
      requiresValidation: true,
      avgProcessingTime: "24 heures"
    },
    {
      id: "certificat_reussite",
      name: "Certificat de réussite",
      description: "Validation de l'obtention du diplôme",
      template: "template_certificat.docx",
      autoGenerate: false,
      requiresValidation: true,
      avgProcessingTime: "48 heures"
    },
    {
      id: "convention_stage",
      name: "Convention de stage",
      description: "Accord tripartite pour les stages",
      template: "template_convention.docx",
      autoGenerate: true,
      requiresValidation: true,
      avgProcessingTime: "72 heures"
    },
    {
      id: "diplome",
      name: "Diplôme",
      description: "Diplôme officiel avec supplément",
      template: "template_diplome.docx",
      autoGenerate: false,
      requiresValidation: true,
      avgProcessingTime: "1 semaine"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending_validation": return "bg-amber-100 text-amber-800 border-amber-200";
      case "ready": return "bg-blue-100 text-blue-800 border-blue-200";
      case "sent": return "bg-green-100 text-green-800 border-green-200";
      case "rejected": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending_validation": return "En attente de validation";
      case "ready": return "Prêt à télécharger";
      case "sent": return "Envoyé";
      case "rejected": return "Rejeté";
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending_validation": return <Clock className="h-4 w-4" />;
      case "ready": return <FileText className="h-4 w-4" />;
      case "sent": return <CheckCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const handleNewRequest = (requestData: any) => {
    console.log("Nouvelle demande:", requestData);
    setShowNewRequest(false);
    // Ici on ajouterait la logique pour créer la demande
  };

  const handlePreviewDocument = (doc: any) => {
    setSelectedDocument({
      id: doc.id,
      type: doc.type,
      studentName: doc.student,
      studentId: doc.studentId,
      generatedDate: doc.generatedDate || new Date().toISOString(),
      qrCode: `QR-${doc.id}`,
      securityLevel: "Élevé"
    });
    setShowPreview(true);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="requests" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="requests">Demandes en cours</TabsTrigger>
          <TabsTrigger value="generate">Génération</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Demandes de Documents Officiels
              </CardTitle>
              <CardDescription>
                Suivi et traitement des demandes de documents
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
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filtrer par statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="pending_validation">En attente</SelectItem>
                    <SelectItem value="ready">Prêts</SelectItem>
                    <SelectItem value="sent">Envoyés</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => setShowNewRequest(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle demande
                </Button>
              </div>

              <div className="space-y-4">
                {documentRequests.map((request) => (
                  <Card key={request.id} className="border-slate-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-slate-800">{request.student}</h3>
                          <p className="text-sm text-slate-600">{request.type}</p>
                          <p className="text-xs text-slate-500">ID: {request.studentId} • {request.id}</p>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(request.status)}>
                            {getStatusIcon(request.status)}
                            <span className="ml-1">{getStatusText(request.status)}</span>
                          </Badge>
                          {request.urgency === "urgent" && (
                            <Badge className="bg-red-100 text-red-800 border-red-200 ml-2">
                              Urgent
                            </Badge>
                          )}
                          <p className="text-xs text-slate-500 mt-1">
                            Demandé le {new Date(request.requestDate).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handlePreviewDocument(request)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Détails
                        </Button>
                        {request.status === "ready" && (
                          <>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              <Download className="h-4 w-4 mr-1" />
                              Télécharger
                            </Button>
                            <Button size="sm" variant="outline">
                              <Send className="h-4 w-4 mr-1" />
                              Envoyer
                            </Button>
                          </>
                        )}
                        {request.status === "pending_validation" && (
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
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

        <TabsContent value="generate" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Génération de Documents
              </CardTitle>
              <CardDescription>
                Types de documents disponibles et leurs paramètres
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {documentTypes.map((docType) => (
                  <Card key={docType.id} className="border-slate-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-slate-800">{docType.name}</h3>
                          <p className="text-sm text-slate-600">{docType.description}</p>
                          <p className="text-xs text-slate-500 mt-1">
                            Temps moyen: {docType.avgProcessingTime}
                          </p>
                        </div>
                        <div className="flex flex-col gap-1">
                          {docType.autoGenerate && (
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              Auto
                            </Badge>
                          )}
                          {docType.requiresValidation && (
                            <Badge className="bg-amber-100 text-amber-800 text-xs">
                              Validation
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          Générer
                        </Button>
                        <Button size="sm" variant="outline">
                          Template
                        </Button>
                        <Button size="sm" variant="outline">
                          Paramètres
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Gestion des Templates
              </CardTitle>
              <CardDescription>
                Templates personnalisables pour tous les documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Button className="bg-green-600 hover:bg-green-700">
                    Nouveau template
                  </Button>
                  <Button variant="outline">
                    Importer template
                  </Button>
                  <Button variant="outline">
                    Variables système
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {documentTypes.map((docType) => (
                    <Card key={docType.id} className="border-slate-200">
                      <CardContent className="p-4">
                        <div className="text-center mb-4">
                          <FileText className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                          <h3 className="font-semibold text-slate-800">{docType.name}</h3>
                          <p className="text-xs text-slate-500">{docType.template}</p>
                        </div>
                        
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            Modifier
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Sécurité et Authentification
              </CardTitle>
              <CardDescription>
                Signature électronique, QR codes et anti-falsification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Shield className="h-8 w-8 text-blue-600" />
                      <div>
                        <h3 className="font-semibold text-blue-800">Signature Électronique</h3>
                        <p className="text-sm text-blue-600">Certificats numériques</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Certificats actifs</span>
                        <Badge className="bg-green-100 text-green-800">3</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Validité</span>
                        <span className="text-sm">Valid jusqu'en 2025</span>
                      </div>
                    </div>
                    <Button size="sm" className="w-full mt-3">
                      Gérer certificats
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-green-200 bg-green-50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <QrCode className="h-8 w-8 text-green-600" />
                      <div>
                        <h3 className="font-semibold text-green-800">QR Code Vérification</h3>
                        <p className="text-sm text-green-600">Authentification rapide</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Documents sécurisés</span>
                        <Badge className="bg-blue-100 text-blue-800">1,247</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Vérifications ce mois</span>
                        <span className="text-sm">89</span>
                      </div>
                    </div>
                    <Button size="sm" className="w-full mt-3">
                      Paramètres QR
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Paramètres de Sécurité</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <h4 className="font-medium">Watermark automatique</h4>
                        <p className="text-sm text-slate-600">Filigrane sur tous les documents</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Activé</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <h4 className="font-medium">Horodatage</h4>
                        <p className="text-sm text-slate-600">Timestamp cryptographique</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Activé</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <h4 className="font-medium">Archivage sécurisé</h4>
                        <p className="text-sm text-slate-600">Sauvegarde chiffrée</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Activé</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <Dialog open={showNewRequest} onOpenChange={setShowNewRequest}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nouvelle Demande de Document</DialogTitle>
          </DialogHeader>
          <DocumentRequest 
            onSubmit={handleNewRequest}
            onCancel={() => setShowNewRequest(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Aperçu du Document</DialogTitle>
          </DialogHeader>
          {selectedDocument && (
            <DocumentPreview
              document={selectedDocument}
              onDownload={() => console.log("Téléchargement...")}
              onSend={() => console.log("Envoi...")}
              onClose={() => setShowPreview(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
