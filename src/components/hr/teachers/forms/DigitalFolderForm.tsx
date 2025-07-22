import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, Download, Trash2, Plus } from "lucide-react";
import { DigitalDocument, DigitalFolder } from "@/types/teacher";

interface DigitalFolderFormProps {
  digitalFolder?: DigitalFolder;
  onUpdate: (digitalFolder: DigitalFolder) => void;
}

export const DigitalFolderForm: React.FC<DigitalFolderFormProps> = ({
  digitalFolder,
  onUpdate
}) => {
  const [newDocument, setNewDocument] = useState<Partial<DigitalDocument>>({
    name: "",
    type: "",
    category: "autre",
    description: ""
  });

  const currentFolder: DigitalFolder = digitalFolder || {
    id: Date.now().toString(),
    teacherId: "",
    documents: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const addDocument = () => {
    if (!newDocument.name) return;

    const document: DigitalDocument = {
      id: Date.now().toString(),
      name: newDocument.name!,
      type: newDocument.type || "pdf",
      fileUrl: "",
      uploadDate: new Date(),
      category: newDocument.category as any,
      description: newDocument.description
    };

    const updatedFolder: DigitalFolder = {
      ...currentFolder,
      documents: [...currentFolder.documents, document],
      updatedAt: new Date()
    };

    onUpdate(updatedFolder);
    
    // Reset form
    setNewDocument({
      name: "",
      type: "",
      category: "autre",
      description: ""
    });
  };

  const removeDocument = (documentId: string) => {
    const updatedFolder: DigitalFolder = {
      ...currentFolder,
      documents: currentFolder.documents.filter(doc => doc.id !== documentId),
      updatedAt: new Date()
    };
    onUpdate(updatedFolder);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setNewDocument(prev => ({
        ...prev,
        name: file.name,
        type: file.type || "application/pdf"
      }));
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      'diplome': 'Diplôme',
      'cv': 'CV',
      'decision': 'Décision administrative',
      'medical': 'Document médical',
      'autre': 'Autre'
    };
    return labels[category] || category;
  };

  const getCategoryIcon = (category: string) => {
    return <FileText className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Dossier Numérique</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Gestion des documents numérisés de l'enseignant
        </p>
      </div>

      {/* Ajouter un nouveau document */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Ajouter un document
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="documentFile">Fichier</Label>
              <Input
                id="documentFile"
                type="file"
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="documentName">Nom du document</Label>
              <Input
                id="documentName"
                value={newDocument.name || ""}
                onChange={(e) => setNewDocument(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nom du document"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="documentCategory">Catégorie</Label>
              <Select 
                value={newDocument.category || "autre"} 
                onValueChange={(value) => setNewDocument(prev => ({ ...prev, category: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="diplome">Diplôme</SelectItem>
                  <SelectItem value="cv">CV</SelectItem>
                  <SelectItem value="decision">Décision administrative</SelectItem>
                  <SelectItem value="medical">Document médical</SelectItem>
                  <SelectItem value="autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="documentType">Type de fichier</Label>
              <Input
                id="documentType"
                value={newDocument.type || ""}
                onChange={(e) => setNewDocument(prev => ({ ...prev, type: e.target.value }))}
                placeholder="ex: application/pdf"
                disabled
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="documentDescription">Description</Label>
            <Textarea
              id="documentDescription"
              value={newDocument.description || ""}
              onChange={(e) => setNewDocument(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Description du document (optionnel)"
              rows={3}
            />
          </div>

          <Button onClick={addDocument} disabled={!newDocument.name}>
            <Upload className="h-4 w-4 mr-2" />
            Ajouter le document
          </Button>
        </CardContent>
      </Card>

      {/* Liste des documents */}
      <div className="space-y-4">
        <h4 className="font-medium">Documents du dossier ({currentFolder.documents.length})</h4>
        
        {currentFolder.documents.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucun document dans le dossier</p>
            <p className="text-sm">Ajoutez des documents pour commencer</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentFolder.documents.map((document) => (
              <Card key={document.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(document.category)}
                      <span className="font-medium truncate">{document.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDocument(document.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>Catégorie: {getCategoryLabel(document.category)}</p>
                    <p>Type: {document.type}</p>
                    <p>Ajouté: {document.uploadDate.toLocaleDateString('fr-FR')}</p>
                    {document.description && (
                      <p className="text-xs mt-2">{document.description}</p>
                    )}
                  </div>

                  <Button variant="outline" size="sm" className="w-full mt-3">
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};