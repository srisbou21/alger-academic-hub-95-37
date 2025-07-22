import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Upload, CheckCircle, AlertTriangle, X, Eye, FolderOpen } from "lucide-react";

interface DocumentManagerProps {
  studentId: string;
}

export const DocumentManager = ({ studentId }: DocumentManagerProps) => {
  const documents = [
    {
      id: "1",
      name: "Photo d'identité",
      type: "photo",
      required: true,
      status: "provided",
      fileName: "photo_identite.jpg",
      uploadDate: "2023-09-15",
      size: "245 KB"
    },
    {
      id: "2", 
      name: "Pièce d'identité (CIN)",
      type: "identity",
      required: true,
      status: "provided",
      fileName: "carte_identite.pdf",
      uploadDate: "2023-09-15",
      size: "1.2 MB"
    },
    {
      id: "3",
      name: "Diplôme de Baccalauréat",
      type: "diploma",
      required: true,
      status: "provided",
      fileName: "diplome_bac.pdf",
      uploadDate: "2023-09-15",
      size: "892 KB"
    },
    {
      id: "4",
      name: "Relevé de notes du BAC",
      type: "transcript",
      required: true,
      status: "provided",
      fileName: "releve_notes_bac.pdf",
      uploadDate: "2023-09-15",
      size: "654 KB"
    },
    {
      id: "5",
      name: "Certificat médical",
      type: "medical",
      required: true,
      status: "missing",
      fileName: null,
      uploadDate: null,
      size: null
    },
    {
      id: "6",
      name: "Certificat de naissance",
      type: "birth",
      required: false,
      status: "provided",
      fileName: "acte_naissance.pdf",
      uploadDate: "2023-09-16",
      size: "723 KB"
    },
    {
      id: "7",
      name: "Attestation de bourse",
      type: "scholarship",
      required: false,
      status: "missing",
      fileName: null,
      uploadDate: null,
      size: null
    },
    {
      id: "8",
      name: "Attestation d'assurance",
      type: "insurance",
      required: true,
      status: "rejected",
      fileName: "assurance_ancienne.pdf",
      uploadDate: "2023-09-10",
      size: "456 KB",
      rejectionReason: "Document expiré - Validité jusqu'au 31/08/2023"
    }
  ];

  const getStatusColor = (status: string, required: boolean) => {
    switch (status) {
      case "provided":
        return required 
          ? "bg-green-100 text-green-800 border-green-200"
          : "bg-blue-100 text-blue-800 border-blue-200";
      case "missing":
        return required
          ? "bg-red-100 text-red-800 border-red-200"
          : "bg-slate-100 text-slate-600 border-slate-200";
      case "rejected":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "provided": return "Fourni";
      case "missing": return "Manquant";
      case "rejected": return "Rejeté";
      default: return "Inconnu";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "provided": return <CheckCircle className="h-4 w-4" />;
      case "missing": return <AlertTriangle className="h-4 w-4" />;
      case "rejected": return <X className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const requiredDocuments = documents.filter(doc => doc.required);
  const optionalDocuments = documents.filter(doc => !doc.required);
  const missingRequired = requiredDocuments.filter(doc => doc.status === "missing" || doc.status === "rejected").length;
  const providedRequired = requiredDocuments.filter(doc => doc.status === "provided").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <FolderOpen className="h-8 w-8" />
            Système de Gestion Documentaire
          </CardTitle>
          <p className="text-blue-100">
            Gestion complète des documents étudiants et pièces justificatives
          </p>
        </CardHeader>
      </Card>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Total documents</p>
                <p className="text-2xl font-bold text-blue-800">{documents.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Fournis</p>
                <p className="text-2xl font-bold text-green-800">
                  {documents.filter(doc => doc.status === "provided").length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-gradient-to-br from-red-50 to-red-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 text-sm font-medium">Manquants</p>
                <p className="text-2xl font-bold text-red-800">{missingRequired}</p>
                <p className="text-xs text-red-500">Documents obligatoires</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-600 text-sm font-medium">Progression</p>
                <p className="text-2xl font-bold text-amber-800">
                  {Math.round((providedRequired / requiredDocuments.length) * 100)}%
                </p>
                <p className="text-xs text-amber-500">Documents obligatoires</p>
              </div>
              <FileText className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Documents Obligatoires */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Documents Obligatoires ({providedRequired}/{requiredDocuments.length})
          </CardTitle>
          <CardDescription>
            Ces documents sont indispensables pour finaliser l'inscription
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {requiredDocuments.map((doc) => (
              <Card key={doc.id} className="border-slate-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(doc.status)}
                      <div>
                        <h4 className="font-medium text-slate-800">{doc.name}</h4>
                        {doc.fileName && (
                          <p className="text-sm text-slate-600">
                            {doc.fileName} • {doc.size} • {new Date(doc.uploadDate!).toLocaleDateString('fr-FR')}
                          </p>
                        )}
                        {doc.rejectionReason && (
                          <p className="text-sm text-orange-600 mt-1">
                            Motif de rejet: {doc.rejectionReason}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(doc.status, doc.required)}>
                        {getStatusText(doc.status)}
                      </Badge>
                      
                      <div className="flex gap-1">
                        {doc.status === "provided" && (
                          <>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <Upload className="h-4 w-4 mr-1" />
                          {doc.status === "provided" ? "Remplacer" : "Télécharger"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Documents Optionnels */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Documents Optionnels
          </CardTitle>
          <CardDescription>
            Documents complémentaires qui peuvent être utiles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {optionalDocuments.map((doc) => (
              <Card key={doc.id} className="border-slate-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(doc.status)}
                      <div>
                        <h4 className="font-medium text-slate-800">{doc.name}</h4>
                        {doc.fileName && (
                          <p className="text-sm text-slate-600">
                            {doc.fileName} • {doc.size} • {new Date(doc.uploadDate!).toLocaleDateString('fr-FR')}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(doc.status, doc.required)}>
                        {getStatusText(doc.status)}
                      </Badge>
                      
                      <div className="flex gap-1">
                        {doc.status === "provided" && (
                          <>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        <Button size="sm" variant="outline">
                          <Upload className="h-4 w-4 mr-1" />
                          {doc.status === "provided" ? "Remplacer" : "Télécharger"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions Globales */}
      <Card>
        <CardHeader>
          <CardTitle>Actions sur les Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="h-4 w-4 mr-2" />
              Valider tous les documents
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Télécharger le dossier complet
            </Button>
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Générer liste des documents manquants
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
