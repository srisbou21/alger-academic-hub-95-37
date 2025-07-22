
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Clock, CheckCircle, Users } from "lucide-react";

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

interface ReportTemplate {
  id: string;
  name: string;
  type: 'attendance' | 'workload' | 'performance' | 'financial' | 'custom';
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom';
  isActive: boolean;
  lastGenerated?: Date;
  nextScheduled?: Date;
}

interface ReportStatsProps {
  reports: Report[];
  templates: ReportTemplate[];
}

export const ReportStats: React.FC<ReportStatsProps> = ({ reports, templates }) => {
  const totalReports = reports.length;
  const completedReports = reports.filter(r => r.status === 'completed').length;
  const activeTemplates = templates.filter(t => t.isActive).length;
  const totalDownloads = reports.reduce((sum, r) => sum + r.downloadCount, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card className="border-blue-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-blue-600 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Rapports Générés
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-700">{totalReports}</div>
          <p className="text-xs text-blue-600 mt-1">Ce mois</p>
        </CardContent>
      </Card>

      <Card className="border-green-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-green-600 flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Terminés
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-700">{completedReports}</div>
          <p className="text-xs text-green-600 mt-1">Prêts à télécharger</p>
        </CardContent>
      </Card>

      <Card className="border-purple-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-purple-600 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Modèles Actifs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-700">{activeTemplates}</div>
          <p className="text-xs text-purple-600 mt-1">Génération automatique</p>
        </CardContent>
      </Card>

      <Card className="border-orange-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-orange-600 flex items-center gap-2">
            <Users className="h-4 w-4" />
            Téléchargements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-700">{totalDownloads}</div>
          <p className="text-xs text-orange-600 mt-1">Total ce mois</p>
        </CardContent>
      </Card>
    </div>
  );
};
