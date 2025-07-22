
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, Upload, Download, Eye, Trash2, 
  Calendar, User, Search 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Document {
  id: string;
  name: string;
  fileName: string;
  uploadDate: Date;
  fileSize: number;
  fileType: string;
  fileUrl: string;
}

interface DocumentManagerProps {
  employeeId: string;
  employeeName: string;
  employeeType: 'enseignant' | 'administratif';
}

export const DocumentManager: React.FC<DocumentManagerProps> = ({
  employeeId,
  employeeName,
  employeeType
}) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [newDocument, setNewDocument] = useState({
    name: '',
    file: null as File | null
  });
  const { toast } = useToast();

  useEffect(() => {
    loadDocuments();
  }, [employeeId]);

  const loadDocuments = async () => {
    // Simulation - chaque employé a automatiquement un dossier avec ses documents
    const mockDocuments: Document[] = [
      {
        id: "doc1",
        name: "CV",
        fileName: `cv_${employeeId}.pdf`,
        uploadDate: new Date("2023-01-15"),
        fileSize: 2048576,
        fileType: "application/pdf",
        fileUrl: `/documents/cv_${employeeId}.pdf`
      },
      {
        id: "doc2",
        name: "Diplôme",
        fileName: `diplome_${employeeId}.pdf`,
        uploadDate: new Date("2022-09-01"),
        fileSize: 1024000,
        fileType: "application/pdf",
        fileUrl: `/documents/diplome_${employeeId}.pdf`
      }
    ];
    setDocuments(mockDocuments);
  };

  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setNewDocument(prev => ({ ...prev, file }));
    }
  };

  const handleSubmitDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newDocument.file || !newDocument.name) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir le nom du document et sélectionner un fichier",
        variant: "destructive"
      });
      return;
    }

    const newDoc: Document = {
      id: `doc_${Date.now()}`,
      name: newDocument.name,
      fileName: newDocument.file.name,
      uploadDate: new Date(),
      fileSize: newDocument.file.size,
      fileType: newDocument.file.type,
      fileUrl: `/documents/${newDocument.file.name}`
    };

    setDocuments(prev => [...prev, newDoc]);
    setNewDocument({
      name: '',
      file: null
    });
    setShowUploadForm(false);

    toast({
      title: "Document ajouté",
      description: "Le document a été ajouté avec succès au dossier"
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-6 w-6" />
                Dossier de {employeeName}
              </CardTitle>
              <p className="text-slate-600">
                {employeeType === 'enseignant' ? 'Enseignant' : 'Personnel Administratif'} • ID: {employeeId}
              </p>
            </div>
            <Button onClick={() => setShowUploadForm(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Importer un document
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{documents.length}</p>
              <p className="text-sm text-blue-800">Total documents</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {Math.round((documents.reduce((acc, doc) => acc + doc.fileSize, 0) / 1024 / 1024) * 100) / 100}
              </p>
              <p className="text-sm text-green-800">MB utilisés</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">
                {documents.length > 0 ? documents[documents.length - 1].uploadDate.toLocaleDateString() : 'N/A'}
              </p>
              <p className="text-sm text-purple-800">Dernier ajout</p>
            </div>
          </div>

          {/* Recherche */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher un document..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Liste des documents */}
          <div className="space-y-4">
            {filteredDocuments.map((document) => (
              <div key={document.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">📄</div>
                    <div>
                      <h4 className="font-semibold">{document.name}</h4>
                      <p className="text-sm text-slate-600">Fichier: {document.fileName}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs text-slate-500">
                          <Calendar className="h-3 w-3 inline mr-1" />
                          {document.uploadDate.toLocaleDateString()}
                        </span>
                        <span className="text-xs text-slate-500">
                          {formatFileSize(document.fileSize)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline">
                    {document.fileType.includes('pdf') ? 'PDF' : 'Image'}
                  </Badge>
                </div>

                <div className="flex items-center justify-end gap-2">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-1" />
                    Visualiser
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-1" />
                    Télécharger
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {filteredDocuments.length === 0 && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-500">Aucun document trouvé</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Formulaire d'import de document */}
      {showUploadForm && (
        <Card>
          <CardHeader>
            <CardTitle>Importer un nouveau document</CardTitle>
            <p className="text-slate-600">
              Ajouter un document au dossier de {employeeName}
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitDocument} className="space-y-4">
              <div>
                <Label htmlFor="documentName">Nom du document *</Label>
                <Input
                  id="documentName"
                  value={newDocument.name}
                  onChange={(e) => setNewDocument(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: CV, Diplôme, Certificat médical..."
                  required
                />
              </div>

              <div>
                <Label htmlFor="documentFile">Fichier PDF scanné *</Label>
                <Input
                  id="documentFile"
                  type="file"
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  required
                />
                <p className="text-xs text-slate-500 mt-1">
                  Formats acceptés: PDF, DOC, DOCX, JPG, PNG (max 10MB)
                </p>
                {newDocument.file && (
                  <p className="text-xs text-green-600 mt-1">
                    Fichier sélectionné: {newDocument.file.name}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  <Upload className="h-4 w-4 mr-2" />
                  Importer le document
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setShowUploadForm(false)}
                >
                  Annuler
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
