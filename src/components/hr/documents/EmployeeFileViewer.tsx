import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileText, Plus, AlertTriangle, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DocumentUploadForm } from './DocumentUploadForm';
import { DocumentsList } from './DocumentsList';
import { DocumentFilters } from './DocumentFilters';

interface EmployeeDocument {
  id: string;
  title: string;
  type: 'personnel' | 'professionnel' | 'carriere' | 'disciplinaire' | 'formation' | 'medical' | 'autre';
  fileName: string;
  uploadDate: Date;
  fileSize: number;
  fileType: string;
  fileUrl: string;
  description?: string;
  isDisciplinary: boolean;
}

interface Employee {
  id: string;
  name: string;
  type: 'enseignant' | 'administratif';
  department?: string;
  position?: string;
  grade?: string;
  service?: string;
  email: string;
  status: 'active' | 'inactive';
}

interface EmployeeFileViewerProps {
  employee: Employee;
}

export const EmployeeFileViewer: React.FC<EmployeeFileViewerProps> = ({ employee }) => {
  const [documents, setDocuments] = useState<EmployeeDocument[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [viewDocument, setViewDocument] = useState<EmployeeDocument | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadDocuments();
  }, [employee.id]);

  const loadDocuments = async () => {
    // Simulation - documents du dossier de l'employé
    const mockDocuments: EmployeeDocument[] = [
      {
        id: "doc1",
        title: "CV Complet",
        type: "personnel",
        fileName: `cv_${employee.id}.pdf`,
        uploadDate: new Date("2023-01-15"),
        fileSize: 2048576,
        fileType: "application/pdf",
        fileUrl: `/documents/cv_${employee.id}.pdf`,
        description: "Curriculum Vitae mis à jour",
        isDisciplinary: false
      },
      {
        id: "doc2",
        title: "Copie CIN",
        type: "personnel",
        fileName: `cin_${employee.id}.pdf`,
        uploadDate: new Date("2022-09-01"),
        fileSize: 1024000,
        fileType: "application/pdf",
        fileUrl: `/documents/cin_${employee.id}.pdf`,
        description: "Carte d'identité nationale",
        isDisciplinary: false
      },
      {
        id: "doc3",
        title: "Contrat de Travail",
        type: "professionnel",
        fileName: `contrat_${employee.id}.pdf`,
        uploadDate: new Date("2022-08-15"),
        fileSize: 1536000,
        fileType: "application/pdf",
        fileUrl: `/documents/contrat_${employee.id}.pdf`,
        description: "Contrat de travail initial",
        isDisciplinary: false
      },
      {
        id: "doc4",
        title: "Évaluation Annuelle 2023",
        type: "carriere",
        fileName: `evaluation_2023_${employee.id}.pdf`,
        uploadDate: new Date("2023-12-20"),
        fileSize: 892000,
        fileType: "application/pdf",
        fileUrl: `/documents/evaluation_2023_${employee.id}.pdf`,
        description: "Évaluation de performance 2023",
        isDisciplinary: false
      }
    ];

    if (employee.id === "2" || employee.id === "5") {
      mockDocuments.push({
        id: "doc_disc",
        title: "Avertissement - Retard répétés",
        type: "disciplinaire",
        fileName: `avertissement_${employee.id}.pdf`,
        uploadDate: new Date("2023-06-10"),
        fileSize: 512000,
        fileType: "application/pdf",
        fileUrl: `/documents/avertissement_${employee.id}.pdf`,
        description: "Avertissement pour retards répétés",
        isDisciplinary: true
      });
    }

    setDocuments(mockDocuments);
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || doc.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleSubmitDocument = async (documentData: Omit<EmployeeDocument, 'id' | 'uploadDate' | 'fileUrl'>) => {
    const newDoc: EmployeeDocument = {
      ...documentData,
      id: `doc_${Date.now()}`,
      uploadDate: new Date(),
      fileUrl: `/documents/${documentData.fileName}`
    };

    setDocuments(prev => [...prev, newDoc]);
    setShowUploadForm(false);

    toast({
      title: "Document ajouté",
      description: "Le document a été ajouté avec succès au dossier"
    });
  };

  const handleViewDocument = (document: EmployeeDocument) => {
    setViewDocument(document);
    toast({
      title: "Visualisation",
      description: `Ouverture du document: ${document.title}`
    });
  };

  const handleDownloadDocument = (documentToDownload: EmployeeDocument) => {
    const link = window.document.createElement('a');
    link.href = documentToDownload.fileUrl;
    link.download = documentToDownload.fileName;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
    
    toast({
      title: "Téléchargement",
      description: `Téléchargement de: ${documentToDownload.title}`
    });
  };

  const handleDeleteDocument = (documentId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== documentId));
    toast({
      title: "Document supprimé",
      description: "Le document a été supprimé du dossier",
      variant: "destructive"
    });
  };

  const disciplinaryCount = documents.filter(doc => doc.isDisciplinary).length;

  return (
    <div className="space-y-6">
      {showUploadForm && (
        <DocumentUploadForm
          employee={employee}
          onClose={() => setShowUploadForm(false)}
          onSubmit={handleSubmitDocument}
        />
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-6 w-6" />
                Dossier Personnel - {employee.name}
              </CardTitle>
              <p className="text-slate-600">
                {employee.type === 'enseignant' ? 'Enseignant' : 'Personnel Administratif'} • 
                Département: {employee.department} • Service: {employee.service} • ID: {employee.id}
              </p>
            </div>
            <Button onClick={() => setShowUploadForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un document
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{documents.length}</p>
              <p className="text-sm text-blue-800">Total documents</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {Math.round((documents.reduce((acc, doc) => acc + doc.fileSize, 0) / 1024 / 1024) * 100) / 100}
              </p>
              <p className="text-sm text-green-800">MB stockés</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">
                {documents.length > 0 ? documents[documents.length - 1].uploadDate.toLocaleDateString() : 'N/A'}
              </p>
              <p className="text-sm text-purple-800">Dernier ajout</p>
            </div>
            <div className={`text-center p-4 rounded-lg ${disciplinaryCount > 0 ? 'bg-red-50' : 'bg-gray-50'}`}>
              <p className={`text-2xl font-bold ${disciplinaryCount > 0 ? 'text-red-600' : 'text-gray-600'}`}>
                {disciplinaryCount}
              </p>
              <p className={`text-sm ${disciplinaryCount > 0 ? 'text-red-800' : 'text-gray-800'}`}>
                Documents disciplinaires
              </p>
              {disciplinaryCount > 0 && (
                <AlertTriangle className="h-4 w-4 text-red-600 mx-auto mt-1" />
              )}
            </div>
          </div>

          <DocumentFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            typeFilter={typeFilter}
            onTypeFilterChange={setTypeFilter}
          />

          <DocumentsList
            documents={filteredDocuments}
            onView={handleViewDocument}
            onDownload={handleDownloadDocument}
            onDelete={handleDeleteDocument}
          />

          {filteredDocuments.length === 0 && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-500">Aucun document trouvé</p>
            </div>
          )}
        </CardContent>
      </Card>

      {viewDocument && (
        <Dialog open={!!viewDocument} onOpenChange={() => setViewDocument(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>{viewDocument.title}</DialogTitle>
            </DialogHeader>
            <div className="p-4 bg-gray-100 rounded-lg text-center">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium">{viewDocument.fileName}</p>
              <p className="text-sm text-gray-600 mt-2">
                Prévisualisation PDF non disponible - utilisez le bouton télécharger pour ouvrir le fichier
              </p>
              <div className="flex gap-2 justify-center mt-4">
                <Button onClick={() => handleDownloadDocument(viewDocument)}>
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger
                </Button>
                <Button variant="outline" onClick={() => setViewDocument(null)}>
                  Fermer
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
