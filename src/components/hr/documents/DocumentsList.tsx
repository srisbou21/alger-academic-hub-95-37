
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Eye, Download, Trash2, AlertTriangle } from "lucide-react";

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

interface DocumentsListProps {
  documents: EmployeeDocument[];
  onView: (document: EmployeeDocument) => void;
  onDownload: (document: EmployeeDocument) => void;
  onDelete: (documentId: string) => void;
}

export const DocumentsList: React.FC<DocumentsListProps> = ({
  documents,
  onView,
  onDownload,
  onDelete
}) => {
  const documentTypes = [
    { value: 'personnel', label: 'Personnel', color: 'bg-blue-100 text-blue-800' },
    { value: 'professionnel', label: 'Professionnel', color: 'bg-green-100 text-green-800' },
    { value: 'carriere', label: 'Carrière', color: 'bg-purple-100 text-purple-800' },
    { value: 'disciplinaire', label: 'Disciplinaire', color: 'bg-red-100 text-red-800' },
    { value: 'formation', label: 'Formation', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'medical', label: 'Médical', color: 'bg-pink-100 text-pink-800' },
    { value: 'autre', label: 'Autre', color: 'bg-gray-100 text-gray-800' }
  ];

  const getTypeLabel = (type: EmployeeDocument['type']) => {
    return documentTypes.find(dt => dt.value === type)?.label || type;
  };

  const getTypeColor = (type: EmployeeDocument['type']) => {
    return documentTypes.find(dt => dt.value === type)?.color || 'bg-gray-100 text-gray-800';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {documents.map((document) => (
        <div key={document.id} className="border rounded-lg p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="text-2xl">📄</div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold">{document.title}</h4>
                  <Badge className={getTypeColor(document.type)}>
                    {getTypeLabel(document.type)}
                  </Badge>
                  {document.isDisciplinary && (
                    <Badge className="bg-red-100 text-red-800">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Disciplinaire
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-slate-600">Fichier: {document.fileName}</p>
                {document.description && (
                  <p className="text-sm text-slate-500 mt-1">{document.description}</p>
                )}
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
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onView(document)}
            >
              <Eye className="h-4 w-4 mr-1" />
              Visualiser
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onDownload(document)}
            >
              <Download className="h-4 w-4 mr-1" />
              Télécharger
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="text-red-600"
              onClick={() => onDelete(document.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
