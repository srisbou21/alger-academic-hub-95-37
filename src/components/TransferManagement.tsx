
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowLeftRight, FileText, CheckCircle, AlertTriangle, University, Calendar, User } from "lucide-react";
import { useState } from "react";

interface TransferManagementProps {
  caseId: string;
  onBack: () => void;
}

export const TransferManagement = ({ caseId, onBack }: TransferManagementProps) => {
  const [validationStep, setValidationStep] = useState(1);

  const transferData = {
    id: caseId,
    studentName: "Ahmed Benali",
    studentId: "ETU-2023-456",
    type: "transfer_in",
    currentUniversity: "Université d'Oran",
    targetDepartment: "Économie",
    requestedLevel: "L2",
    currentLevel: "L2",
    submittedDate: "2024-06-10",
    status: "pending",
    documents: [
      { name: "Relevé de notes L1", status: "validated", mandatory: true },
      { name: "Relevé de notes S1-L2", status: "validated", mandatory: true },
      { name: "Attestation d'inscription", status: "validated", mandatory: true },
      { name: "Certificat de scolarité", status: "validated", mandatory: true },
      { name: "Programme des matières", status: "pending", mandatory: true },
      { name: "Lettre de motivation", status: "validated", mandatory: false },
      { name: "Pièce d'identité", status: "validated", mandatory: true },
      { name: "Photos d'identité", status: "validated", mandatory: true }
    ],
    academicRecord: {
      totalCredits: 87,
      requiredCredits: 90,
      gpa: 14.2,
      minGpa: 12.0,
      completedSemesters: 3,
      failedSubjects: 1
    }
  };

  const getDocumentStatusColor = (status: string) => {
    switch (status) {
      case "validated": return "text-green-600";
      case "pending": return "text-amber-600";
      case "rejected": return "text-red-600";
      default: return "text-slate-600";
    }
  };

  const getDocumentStatusIcon = (status: string) => {
    switch (status) {
      case "validated": return CheckCircle;
      case "pending": return AlertTriangle;
      case "rejected": return AlertTriangle;
      default: return FileText;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Dossier de Transfert</h2>
          <p className="text-slate-600">{transferData.id} - {transferData.studentName}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Student Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informations Étudiant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-700">Nom complet</p>
                  <p className="text-slate-900">{transferData.studentName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Numéro étudiant</p>
                  <p className="text-slate-900">{transferData.studentId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Université d'origine</p>
                  <p className="text-slate-900">{transferData.currentUniversity}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Département demandé</p>
                  <p className="text-slate-900">{transferData.targetDepartment}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Niveau actuel</p>
                  <p className="text-slate-900">{transferData.currentLevel}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Niveau demandé</p>
                  <p className="text-slate-900">{transferData.requestedLevel}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Academic Evaluation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <University className="h-5 w-5" />
                Évaluation Académique
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-700">Crédits ECTS</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {transferData.academicRecord.totalCredits}/{transferData.academicRecord.requiredCredits}
                    </p>
                    <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(transferData.academicRecord.totalCredits / transferData.academicRecord.requiredCredits) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium text-green-700">Moyenne générale</p>
                    <p className="text-2xl font-bold text-green-900">
                      {transferData.academicRecord.gpa}/20
                    </p>
                    <p className="text-xs text-green-600">
                      (Minimum requis: {transferData.academicRecord.minGpa}/20)
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-sm font-medium text-slate-700">Semestres validés</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {transferData.academicRecord.completedSemesters}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-amber-50 rounded-lg">
                    <p className="text-sm font-medium text-amber-700">Matières en échec</p>
                    <p className="text-2xl font-bold text-amber-900">
                      {transferData.academicRecord.failedSubjects}
                    </p>
                  </div>
                </div>
              </div>

              {/* Validation Status */}
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-800">Conditions académiques remplies</span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  L'étudiant satisfait aux exigences académiques pour le transfert.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Documents Check */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Contrôle des Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transferData.documents.map((doc, index) => {
                  const StatusIcon = getDocumentStatusIcon(doc.status);
                  return (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <StatusIcon className={`h-4 w-4 ${getDocumentStatusColor(doc.status)}`} />
                        <span className="font-medium">{doc.name}</span>
                        {doc.mandatory && <Badge variant="outline" className="text-xs">Obligatoire</Badge>}
                      </div>
                      <Badge className={
                        doc.status === "validated" ? "bg-green-100 text-green-800" :
                        doc.status === "pending" ? "bg-amber-100 text-amber-800" :
                        "bg-red-100 text-red-800"
                      }>
                        {doc.status === "validated" ? "Validé" :
                         doc.status === "pending" ? "En attente" : "Rejeté"}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowLeftRight className="h-5 w-5" />
                Statut du Transfert
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <Badge className="bg-amber-100 text-amber-800 text-lg px-4 py-2">
                    En cours de traitement
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Documents reçus</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Évaluation académique</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <span className="text-sm">Validation commission</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-400">Décision finale</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approuver le transfert
                </Button>
                <Button variant="outline" className="w-full">
                  Demander documents
                </Button>
                <Button variant="outline" className="w-full text-red-600 border-red-200">
                  Rejeter la demande
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Historique
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Demande soumise</p>
                    <p className="text-slate-600">10 juin 2024</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Documents validés</p>
                    <p className="text-slate-600">12 juin 2024</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">En attente commission</p>
                    <p className="text-slate-600">14 juin 2024</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
