import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Upload, 
  File, 
  Trash2, 
  Download, 
  Eye,
  Plus,
  FileText,
  Image,
  Archive
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface DigitalDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadDate: Date;
  category: 'academic' | 'professional' | 'personal' | 'administrative';
}

interface DigitalDocumentsManagerProps {
  documents: DigitalDocument[];
  onUpdate: (documents: DigitalDocument[]) => void;
}

const DOCUMENT_CATEGORIES = [
  { value: 'academic', label: 'Académique', color: 'bg-blue-100 text-blue-800' },
  { value: 'professional', label: 'Professionnel', color: 'bg-green-100 text-green-800' },
  { value: 'personal', label: 'Personnel', color: 'bg-purple-100 text-purple-800' },
  { value: 'administrative', label: 'Administratif', color: 'bg-orange-100 text-orange-800' }
];

const getFileIcon = (fileType: string) => {
  if (fileType.includes('image')) return <Image className="h-4 w-4" />;
  if (fileType.includes('pdf') || fileType.includes('document')) return <FileText className="h-4 w-4" />;
  if (fileType.includes('zip') || fileType.includes('archive')) return <Archive className="h-4 w-4" />;
  return <File className="h-4 w-4" />;
};

export const DigitalDocumentsManager: React.FC<DigitalDocumentsManagerProps> = ({
  documents,
  onUpdate
}) => {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState("");
  const [documentCategory, setDocumentCategory] = useState<DigitalDocument['category']>('administrative');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setDocumentName(file.name);
    }
  };

  const handleUpload = () => {
    if (!selectedFile || !documentName) return;

    // Simulation d'upload - dans un vrai système, on uploadrait le fichier vers un serveur
    const newDocument: DigitalDocument = {
      id: Date.now().toString(),
      name: documentName,
      type: selectedFile.type,
      url: URL.createObjectURL(selectedFile), // URL temporaire pour la démo
      uploadDate: new Date(),
      category: documentCategory
    };

    onUpdate([...documents, newDocument]);
    
    // Reset form
    setSelectedFile(null);
    setDocumentName("");
    setDocumentCategory('administrative');
    setShowUploadForm(false);
  };

  const handleDeleteDocument = (id: string) => {
    const updatedDocuments = documents.filter(doc => doc.id !== id);
    onUpdate(updatedDocuments);
  };

  const filteredDocuments = filterCategory === 'all' 
    ? documents 
    : documents.filter(doc => doc.category === filterCategory);

  const getCategoryInfo = (category: string) => {
    return DOCUMENT_CATEGORIES.find(cat => cat.value === category) || DOCUMENT_CATEGORIES[0];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Dossier Numérique</h3>
          <p className="text-sm text-slate-600">
            {documents.length} document{documents.length > 1 ? 's' : ''} archivé{documents.length > 1 ? 's' : ''}
          </p>
        </div>
        <Button 
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un document
        </Button>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={filterCategory === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterCategory('all')}
        >
          Tous ({documents.length})
        </Button>
        {DOCUMENT_CATEGORIES.map(category => {
          const count = documents.filter(doc => doc.category === category.value).length;
          return (
            <Button
              key={category.value}
              variant={filterCategory === category.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterCategory(category.value)}
            >
              {category.label} ({count})
            </Button>
          );
        })}
      </div>

      {/* Formulaire d'upload */}
      {showUploadForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Ajouter un document
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file">Fichier *</Label>
              <Input
                id="file"
                type="file"
                onChange={handleFileSelect}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.zip,.rar"
              />
              {selectedFile && (
                <p className="text-sm text-slate-600">
                  Fichier sélectionné: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="documentName">Nom du document *</Label>
              <Input
                id="documentName"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                placeholder="Nom descriptif du document"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Catégorie *</Label>
              <Select value={documentCategory} onValueChange={(value: any) => setDocumentCategory(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {DOCUMENT_CATEGORIES.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowUploadForm(false)}>
                Annuler
              </Button>
              <Button 
                onClick={handleUpload}
                disabled={!selectedFile || !documentName}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Upload className="h-4 w-4 mr-2" />
                Télécharger
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Liste des documents */}
      <div className="space-y-3">
        {filteredDocuments.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <File className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600">
                {filterCategory === 'all' 
                  ? 'Aucun document archivé' 
                  : `Aucun document dans la catégorie ${getCategoryInfo(filterCategory).label.toLowerCase()}`
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredDocuments.map((document) => {
            const categoryInfo = getCategoryInfo(document.category);
            return (
              <Card key={document.id} className="hover:shadow-sm transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="p-2 bg-slate-100 rounded-lg">
                        {getFileIcon(document.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium truncate">{document.name}</h4>
                          <Badge className={categoryInfo.color}>
                            {categoryInfo.label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-600">
                          <span>Type: {document.type}</span>
                          <span>Ajouté: {format(document.uploadDate, "dd/MM/yyyy", { locale: fr })}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(document.url, '_blank')}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const link = window.document.createElement('a');
                          link.href = document.url;
                          link.download = document.name;
                          link.click();
                        }}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteDocument(document.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};