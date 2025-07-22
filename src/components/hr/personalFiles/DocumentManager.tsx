
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Upload, 
  FileText, 
  Download, 
  Eye, 
  Trash2, 
  CheckCircle, 
  AlertTriangle,
  Plus
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PersonalDocument } from "../../../types/personalFile";
import { personalFileService } from "../../../services/personalFileService";

interface DocumentManagerProps {
  fileId: string;
  documents: PersonalDocument[];
  onDocumentsUpdate: () => void;
}

export const DocumentManager: React.FC<DocumentManagerProps> = ({
  fileId,
  documents,
  onDocumentsUpdate
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newDocument, setNewDocument] = useState({
    type: 'diplome' as PersonalDocument['type'],
    title: '',
    description: '',
    isRequired: false
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const documentTypes = [
    { value: 'diplome', label: 'Diplôme' },
    { value: 'certificat', label: 'Certificat' },
    { value: 'contrat', label: 'Contrat' },
    { value: 'evaluation', label: 'Évaluation' },
    { value: 'medical', label: 'Médical' },
    { value: 'administrative', label: 'Administratif' },
    { value: 'autre', label: 'Autre' }
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleAddDocument = async () => {
    if (!selectedFile) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fichier",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    try {
      // Simulation d'upload - en réalité, il faudrait uploader vers un service de stockage
      const mockFileUrl = `/documents/${selectedFile.name}`;
      
      const documentData = {
        type: newDocument.type,
        title: newDocument.title || selectedFile.name,
        description: newDocument.description,
        uploadDate: new Date(),
        fileUrl: mockFileUrl,
        fileSize: selectedFile.size,
        fileType: selectedFile.type,
        isRequired: newDocument.isRequired,
        isVerified: false
      };

      await personalFileService.addDocumentToFile(fileId, documentData);
      
      toast({
        title: "Succès",
        description: "Document ajouté avec succès"
      });

      setIsAddDialogOpen(false);
      setNewDocument({
        type: 'diplome',
        title: '',
        description: '',
        isRequired: false
      });
      setSelectedFile(null);
      onDocumentsUpdate();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le document",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    try {
      await personalFileService.removeDocumentFromFile(fileId, documentId);
      toast({
        title: "Succès",
        description: "Document supprimé avec succès"
      });
      onDocumentsUpdate();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le document",
        variant: "destructive"
      });
    }
  };

  const handleVerifyDocument = async (documentId: string) => {
    try {
      await personalFileService.verifyDocument(fileId, documentId, "Service RH");
      toast({
        title: "Succès",
        description: "Document vérifié avec succès"
      });
      onDocumentsUpdate();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de vérifier le document",
        variant: "destructive"
      });
    }
  };

  const handleDownload = (document: PersonalDocument) => {
    toast({
      title: "Téléchargement",
      description: `Téléchargement de ${document.title}...`
    });
    // Simulation de téléchargement
  };

  const getDocumentTypeLabel = (type: PersonalDocument['type']) => {
    return documentTypes.find(dt => dt.value === type)?.label || type;
  };

  const getStatusBadge = (document: PersonalDocument) => {
    if (document.isVerified) {
      return (
        <Badge className="bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Vérifié
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-yellow-100 text-yellow-800">
          <AlertTriangle className="h-3 w-3 mr-1" />
          À vérifier
        </Badge>
      );
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Gestion des Documents</CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un document
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Ajouter un nouveau document</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="docType">Type de document</Label>
                  <Select
                    value={newDocument.type}
                    onValueChange={(value: PersonalDocument['type']) => 
                      setNewDocument(prev => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {documentTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="docTitle">Titre du document</Label>
                  <Input
                    id="docTitle"
                    value={newDocument.title}
                    onChange={(e) => setNewDocument(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Titre du document"
                  />
                </div>

                <div>
                  <Label htmlFor="docDescription">Description</Label>
                  <Textarea
                    id="docDescription"
                    value={newDocument.description}
                    onChange={(e) => setNewDocument(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Description du document"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="docFile">Fichier</Label>
                  <Input
                    id="docFile"
                    type="file"
                    onChange={handleFileSelect}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                  {selectedFile && (
                    <p className="text-sm text-slate-600 mt-1">
                      Fichier sélectionné: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </div>

                <div className="flex justify-end gap-2">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Annuler
                  </Button>
                  <Button 
                    onClick={handleAddDocument}
                    disabled={uploading || !selectedFile}
                  >
                    {uploading ? 'Upload...' : 'Ajouter'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {documents.length > 0 ? (
            documents.map((document) => (
              <div key={document.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-5 w-5 text-slate-500" />
                      <h4 className="font-semibold">{document.title}</h4>
                      {getStatusBadge(document)}
                    </div>
                    
                    <p className="text-slate-600 mb-2">{document.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span>Type: {getDocumentTypeLabel(document.type)}</span>
                      <span>Taille: {(document.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                      <span>Ajouté: {document.uploadDate.toLocaleDateString()}</span>
                      {document.isVerified && document.verifiedAt && (
                        <span>Vérifié: {document.verifiedAt.toLocaleDateString()}</span>
                      )}
                    </div>

                    {document.validUntil && (
                      <div className="mt-2">
                        <span className="text-sm text-amber-600">
                          Valide jusqu'au: {document.validUntil.toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownload(document)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>

                    {!document.isVerified && (
                      <Button
                        size="sm"
                        onClick={() => handleVerifyDocument(document.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteDocument(document.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-500">Aucun document ajouté</p>
              <p className="text-sm text-slate-400">Cliquez sur "Ajouter un document" pour commencer</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
