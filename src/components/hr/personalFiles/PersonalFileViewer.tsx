import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  FileText, 
  GraduationCap,
  Award,
  Calendar,
  Edit,
  Download,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PersonalFile } from "../../../types/personalFile";
import { personalFileService } from "../../../services/personalFileService";

interface PersonalFileViewerProps {
  fileId: string;
  onEdit: (fileId: string) => void;
  onClose: () => void;
}

export const PersonalFileViewer: React.FC<PersonalFileViewerProps> = ({
  fileId,
  onEdit,
  onClose
}) => {
  const [personalFile, setPersonalFile] = useState<PersonalFile | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadPersonalFile();
  }, [fileId]);

  const loadPersonalFile = async () => {
    setLoading(true);
    try {
      const file = await personalFileService.getPersonalFileById(fileId);
      setPersonalFile(file);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger le dossier personnel",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadDocument = (documentId: string) => {
    toast({
      title: "Téléchargement",
      description: "Le document est en cours de téléchargement..."
    });
  };

  const verifyDocument = async (documentId: string) => {
    try {
      await personalFileService.verifyDocument(fileId, documentId, "Service RH");
      await loadPersonalFile();
      toast({
        title: "Document vérifié",
        description: "Le document a été vérifié avec succès"
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de vérifier le document",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-slate-500">Chargement du dossier...</p>
      </div>
    );
  }

  if (!personalFile) {
    return (
      <div className="text-center py-8">
        <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
        <p className="text-slate-500">Dossier introuvable</p>
        <Button onClick={onClose} className="mt-4">Retour</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <User className="h-6 w-6" />
                Dossier Personnel - {personalFile.employeeName}
              </CardTitle>
              <p className="text-slate-600">ID: {personalFile.employeeId}</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => onEdit(fileId)} variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
              <Button onClick={onClose} variant="outline">
                Fermer
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="font-medium">Statut</p>
              <Badge className={personalFile.status.isComplete ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                {personalFile.status.isComplete ? "Complet" : "Incomplet"}
              </Badge>
            </div>
            <div>
              <p className="font-medium">Type d'employé</p>
              <p className="text-slate-600">
                {personalFile.employeeType === 'enseignant' ? 'Enseignant' : 'Personnel Administratif'}
              </p>
            </div>
            <div>
              <p className="font-medium">Dernière mise à jour</p>
              <p className="text-slate-600">{personalFile.updatedAt.toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="personal">Personnel</TabsTrigger>
          <TabsTrigger value="professional">Professionnel</TabsTrigger>
          <TabsTrigger value="education">Formation</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="evaluations">Évaluations</TabsTrigger>
          <TabsTrigger value="leaves">Congés</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informations Personnelles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="font-medium">Nom complet</p>
                    <p className="text-slate-600">
                      {personalFile.personalInfo.firstName} {personalFile.personalInfo.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Date de naissance</p>
                    <p className="text-slate-600">{personalFile.personalInfo.dateOfBirth.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="font-medium">Lieu de naissance</p>
                    <p className="text-slate-600">{personalFile.personalInfo.placeOfBirth}</p>
                  </div>
                  <div>
                    <p className="font-medium">Nationalité</p>
                    <p className="text-slate-600">{personalFile.personalInfo.nationality}</p>
                  </div>
                  <div>
                    <p className="font-medium">État civil</p>
                    <p className="text-slate-600">{personalFile.personalInfo.maritalStatus}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium">Contact</p>
                    <div className="space-y-2 text-slate-600">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {personalFile.personalInfo.contact.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {personalFile.personalInfo.contact.phone}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {personalFile.personalInfo.contact.address.street}, {personalFile.personalInfo.contact.address.city}
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="font-medium">Contact d'urgence</p>
                    <div className="text-slate-600">
                      <p>{personalFile.personalInfo.contact.emergencyContact.name}</p>
                      <p>{personalFile.personalInfo.contact.emergencyContact.relationship}</p>
                      <p>{personalFile.personalInfo.contact.emergencyContact.phone}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="professional" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informations Professionnelles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="font-medium">Poste actuel</p>
                    <p className="text-slate-600">{personalFile.professionalInfo.currentPosition}</p>
                  </div>
                  <div>
                    <p className="font-medium">Département</p>
                    <p className="text-slate-600">{personalFile.professionalInfo.department}</p>
                  </div>
                  <div>
                    <p className="font-medium">Grade</p>
                    <p className="text-slate-600">{personalFile.professionalInfo.grade}</p>
                  </div>
                  <div>
                    <p className="font-medium">Échelon</p>
                    <p className="text-slate-600">{personalFile.professionalInfo.echelon}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium">Type de contrat</p>
                    <p className="text-slate-600">{personalFile.professionalInfo.contractType}</p>
                  </div>
                  <div>
                    <p className="font-medium">Date de début</p>
                    <p className="text-slate-600">{personalFile.professionalInfo.startDate.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="font-medium">Supérieur direct</p>
                    <p className="text-slate-600">{personalFile.professionalInfo.directSupervisor}</p>
                  </div>
                  <div>
                    <p className="font-medium">Lieu de travail</p>
                    <p className="text-slate-600">{personalFile.professionalInfo.workLocation}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="education" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Formation et Qualifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {personalFile.education.map((edu) => (
                  <div key={edu.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">{edu.level} en {edu.field}</h4>
                        <p className="text-slate-600">{edu.institution}, {edu.country}</p>
                        <p className="text-sm text-slate-500">
                          {edu.startYear} - {edu.endYear}
                          {edu.grade && ` • ${edu.grade}`}
                        </p>
                      </div>
                      <Badge className={edu.isRecognized ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                        {edu.isRecognized ? "Reconnu" : "Non reconnu"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {personalFile.documents.map((doc) => (
                  <div key={doc.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold">{doc.title}</h4>
                        <p className="text-slate-600">{doc.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                          <span>Type: {doc.type}</span>
                          <span>Taille: {(doc.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                          <span>Ajouté: {doc.uploadDate.toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {doc.isVerified ? (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Vérifié
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            À vérifier
                          </Badge>
                        )}
                        <Button size="sm" onClick={() => downloadDocument(doc.id)}>
                          <Download className="h-4 w-4" />
                        </Button>
                        {!doc.isVerified && (
                          <Button 
                            size="sm" 
                            onClick={() => verifyDocument(doc.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Vérifier
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evaluations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Évaluations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {personalFile.evaluations.map((evaluation) => (
                  <div key={evaluation.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">Évaluation {evaluation.year}</h4>
                        <p className="text-slate-600">Évaluateur: {evaluation.evaluator}</p>
                        <p className="text-sm text-slate-500">
                          Date: {evaluation.evaluationDate.toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">
                        Score: {evaluation.score}/20
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="font-medium">Commentaires:</p>
                        <p className="text-slate-600">{evaluation.comments}</p>
                      </div>
                      <div>
                        <p className="font-medium">Points forts:</p>
                        <p className="text-slate-600">{evaluation.strengths.join(', ')}</p>
                      </div>
                      <div>
                        <p className="font-medium">Axes d'amélioration:</p>
                        <p className="text-slate-600">{evaluation.improvements.join(', ')}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaves" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Congés et Absences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {personalFile.leaves.length > 0 ? (
                  personalFile.leaves.map((leave) => (
                    <div key={leave.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">{leave.type.replace('_', ' ')}</h4>
                          <p className="text-slate-600">{leave.reason}</p>
                          <p className="text-sm text-slate-500">
                            Du {leave.startDate.toLocaleDateString()} au {leave.endDate.toLocaleDateString()}
                            ({leave.duration} jours)
                          </p>
                        </div>
                        <Badge className={
                          leave.status === 'approved' ? "bg-green-100 text-green-800" :
                          leave.status === 'rejected' ? "bg-red-100 text-red-800" :
                          "bg-yellow-100 text-yellow-800"
                        }>
                          {leave.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 text-center py-4">Aucun congé enregistré</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
