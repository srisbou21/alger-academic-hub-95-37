
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, X } from "lucide-react";

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

interface DocumentUploadFormProps {
  employee: Employee;
  onClose: () => void;
  onSubmit: (document: Omit<EmployeeDocument, 'id' | 'uploadDate' | 'fileUrl'>) => void;
}

export const DocumentUploadForm: React.FC<DocumentUploadFormProps> = ({
  employee,
  onClose,
  onSubmit
}) => {
  const [newDocument, setNewDocument] = useState({
    title: '',
    type: 'personnel' as EmployeeDocument['type'],
    description: '',
    isDisciplinary: false,
    file: null as File | null
  });

  const documentTypes = [
    { value: 'personnel', label: 'Personnel' },
    { value: 'professionnel', label: 'Professionnel' },
    { value: 'carriere', label: 'Carrière' },
    { value: 'disciplinaire', label: 'Disciplinaire' },
    { value: 'formation', label: 'Formation' },
    { value: 'medical', label: 'Médical' },
    { value: 'autre', label: 'Autre' }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setNewDocument(prev => ({ ...prev, file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newDocument.file || !newDocument.title) {
      return;
    }

    onSubmit({
      title: newDocument.title,
      type: newDocument.type,
      fileName: newDocument.file.name,
      fileSize: newDocument.file.size,
      fileType: newDocument.file.type,
      description: newDocument.description,
      isDisciplinary: newDocument.isDisciplinary || newDocument.type === 'disciplinaire'
    });

    setNewDocument({
      title: '',
      type: 'personnel',
      description: '',
      isDisciplinary: false,
      file: null
    });
  };

  return (
    <Card className="border-2 border-blue-200 bg-blue-50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Ajouter un nouveau document
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-slate-600">
          Importer un document PDF scanné au dossier de {employee.name}
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="documentTitle">Titre du document *</Label>
              <Input
                id="documentTitle"
                value={newDocument.title}
                onChange={(e) => setNewDocument(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Ex: CV, Diplôme, Contrat, Évaluation..."
                required
              />
            </div>

            <div>
              <Label htmlFor="documentType">Type de document *</Label>
              <Select
                value={newDocument.type}
                onValueChange={(value: EmployeeDocument['type']) => 
                  setNewDocument(prev => ({ 
                    ...prev, 
                    type: value,
                    isDisciplinary: value === 'disciplinaire' ? true : prev.isDisciplinary
                  }))
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
          </div>

          <div>
            <Label htmlFor="documentDescription">Description</Label>
            <Textarea
              id="documentDescription"
              value={newDocument.description}
              onChange={(e) => setNewDocument(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Description du document..."
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isDisciplinary"
                checked={newDocument.isDisciplinary || newDocument.type === 'disciplinaire'}
                onCheckedChange={(checked) => 
                  setNewDocument(prev => ({ ...prev, isDisciplinary: checked as boolean }))
                }
                disabled={newDocument.type === 'disciplinaire'}
              />
              <Label htmlFor="isDisciplinary" className="text-sm">
                Document disciplinaire
              </Label>
            </div>

            <div>
              <Label htmlFor="documentFile">Fichier PDF scanné *</Label>
              <Input
                id="documentFile"
                type="file"
                onChange={handleFileUpload}
                accept=".pdf"
                required
              />
              {newDocument.file && (
                <p className="text-xs text-green-600 mt-1">
                  Fichier sélectionné: {newDocument.file.name}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit">
              <Upload className="h-4 w-4 mr-2" />
              Ajouter au dossier
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
