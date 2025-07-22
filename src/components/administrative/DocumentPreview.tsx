
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FileText, Download, Send, Eye, QrCode, Shield, Calendar } from "lucide-react";

interface DocumentPreviewProps {
  document: {
    id: string;
    type: string;
    studentName: string;
    studentId: string;
    generatedDate: string;
    qrCode: string;
    securityLevel: string;
  };
  onDownload: () => void;
  onSend: () => void;
  onClose: () => void;
}

export const DocumentPreview = ({ document, onDownload, onSend, onClose }: DocumentPreviewProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Aperçu du Document
          </CardTitle>
          <CardDescription>
            Prévisualisation avant envoi ou téléchargement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Aperçu du document */}
            <div className="lg:col-span-2">
              <Card className="border-2 border-dashed border-slate-300 min-h-[600px] bg-white">
                <CardContent className="p-6">
                  {/* En-tête officiel */}
                  <div className="text-center mb-8">
                    <div className="text-blue-800 font-bold text-lg mb-2">
                      UNIVERSITÉ ALGER 3
                    </div>
                    <div className="text-blue-700 font-semibold">
                      Faculté des Sciences Économiques, Commerciales et des Sciences de Gestion
                    </div>
                    <div className="text-sm text-slate-600 mt-2">
                      Dély Brahim - Alger, Algérie
                    </div>
                  </div>

                  <Separator className="my-6" />

                  {/* Corps du document */}
                  <div className="space-y-6">
                    <div className="text-center">
                      <h2 className="text-xl font-bold text-slate-800 mb-4">
                        ATTESTATION DE SCOLARITÉ
                      </h2>
                      <p className="text-sm text-slate-600">
                        Année Universitaire 2023-2024
                      </p>
                    </div>

                    <div className="text-justify space-y-4 text-slate-700">
                      <p>
                        Le Doyen de la Faculté des Sciences Économiques, Commerciales et des Sciences de Gestion 
                        de l'Université Alger 3 atteste par la présente que :
                      </p>

                      <div className="bg-slate-50 p-4 rounded-lg border-l-4 border-blue-500">
                        <p className="font-semibold text-slate-800">
                          M./Mme. {document.studentName}
                        </p>
                        <p className="text-sm text-slate-600">
                          Numéro d'inscription : {document.studentId}
                        </p>
                      </div>

                      <p>
                        Est régulièrement inscrit(e) en 3ème année Licence en Économie pour l'année universitaire 2023-2024.
                      </p>

                      <p>
                        Cette attestation est délivrée à l'intéressé(e) pour servir et valoir ce que de droit.
                      </p>
                    </div>

                    <div className="flex justify-between items-end mt-12">
                      <div className="text-center">
                        <div className="w-24 h-24 bg-slate-100 border-2 border-slate-300 rounded mb-2 flex items-center justify-center">
                          <QrCode className="h-12 w-12 text-slate-400" />
                        </div>
                        <p className="text-xs text-slate-500">Code de vérification</p>
                      </div>

                      <div className="text-center">
                        <p className="text-sm text-slate-700 mb-4">
                          Alger, le {new Date(document.generatedDate).toLocaleDateString('fr-FR')}
                        </p>
                        <div className="border-b-2 border-slate-300 w-32 mb-2"></div>
                        <p className="text-sm font-semibold text-slate-700">Le Doyen</p>
                      </div>
                    </div>
                  </div>

                  {/* Filigrane */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
                    <div className="text-6xl font-bold text-slate-400 rotate-45">
                      UNIVERSITÉ ALGER 3
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Informations et actions */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informations du Document</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-slate-700">Type</p>
                    <p className="text-sm text-slate-600">{document.type}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-slate-700">Référence</p>
                    <p className="text-sm text-slate-600 font-mono">{document.id}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-slate-700">Date de génération</p>
                    <p className="text-sm text-slate-600">
                      {new Date(document.generatedDate).toLocaleDateString('fr-FR')}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slate-700">Étudiant</p>
                    <p className="text-sm text-slate-600">{document.studentName}</p>
                    <p className="text-xs text-slate-500">{document.studentId}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Sécurité
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Signature électronique</span>
                    <Badge className="bg-green-100 text-green-800">✓ Valide</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">QR Code</span>
                    <Badge className="bg-green-100 text-green-800">✓ Intégré</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Watermark</span>
                    <Badge className="bg-green-100 text-green-800">✓ Appliqué</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Niveau sécurité</span>
                    <Badge className="bg-blue-100 text-blue-800">{document.securityLevel}</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button onClick={onDownload} className="w-full bg-green-600 hover:bg-green-700">
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger PDF
                  </Button>
                  
                  <Button onClick={onSend} variant="outline" className="w-full">
                    <Send className="h-4 w-4 mr-2" />
                    Envoyer par email
                  </Button>
                  
                  <Separator />
                  
                  <Button onClick={onClose} variant="outline" className="w-full">
                    Fermer l'aperçu
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
