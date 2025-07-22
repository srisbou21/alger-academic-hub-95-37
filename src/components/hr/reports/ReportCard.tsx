
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Share, Calendar, User } from "lucide-react";

interface Report {
  id: string;
  title: string;
  type: 'attendance' | 'workload' | 'performance' | 'financial' | 'custom';
  description: string;
  generatedDate: Date;
  period: {
    start: Date;
    end: Date;
  };
  status: 'draft' | 'completed' | 'sent';
  createdBy: string;
  recipients: string[];
  fileSize?: string;
  downloadCount: number;
}

interface ReportCardProps {
  report: Report;
  onDownload: (reportId: string) => void;
}

export const ReportCard: React.FC<ReportCardProps> = ({ report, onDownload }) => {
  const getStatusBadge = (status: string) => {
    const variants = {
      draft: "bg-gray-100 text-gray-800",
      completed: "bg-green-100 text-green-800",
      sent: "bg-blue-100 text-blue-800"
    };
    const labels = {
      draft: "Brouillon",
      completed: "Terminé",
      sent: "Envoyé"
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const variants = {
      attendance: "bg-red-100 text-red-800",
      workload: "bg-blue-100 text-blue-800",
      performance: "bg-green-100 text-green-800",
      financial: "bg-purple-100 text-purple-800",
      custom: "bg-orange-100 text-orange-800"
    };
    const labels = {
      attendance: "Absences",
      workload: "Charges",
      performance: "Performance",
      financial: "Financier",
      custom: "Personnalisé"
    };
    
    return (
      <Badge variant="outline" className={variants[type as keyof typeof variants]}>
        {labels[type as keyof typeof labels]}
      </Badge>
    );
  };

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-lg">{report.title}</h3>
            {getStatusBadge(report.status)}
            {getTypeBadge(report.type)}
          </div>
          
          <p className="text-sm text-slate-600 mb-3">{report.description}</p>
          
          <div className="space-y-1 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Généré le {report.generatedDate.toLocaleDateString('fr-FR')}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Par {report.createdBy}</span>
            </div>
            {report.fileSize && (
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Taille: {report.fileSize}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t">
        <div className="text-sm text-slate-500">
          <span>{report.downloadCount} téléchargements</span>
          {report.recipients.length > 0 && (
            <span className="ml-3">• {report.recipients.length} destinataires</span>
          )}
        </div>
        
        <div className="flex gap-2">
          {report.status === 'completed' && (
            <Button size="sm" onClick={() => onDownload(report.id)} className="bg-green-600 hover:bg-green-700">
              <Download className="h-4 w-4 mr-1" />
              Télécharger
            </Button>
          )}
          <Button size="sm" variant="outline">
            <Share className="h-4 w-4 mr-1" />
            Partager
          </Button>
        </div>
      </div>
    </div>
  );
};
