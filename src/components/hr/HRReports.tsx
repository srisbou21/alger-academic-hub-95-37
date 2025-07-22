import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { FileText, Download, Plus } from "lucide-react";

export const HRReports = () => {
  const { toast } = useToast();

  const reports = [
    {
      id: '1',
      title: 'Rapport mensuel des absences - Janvier 2024',
      type: 'attendance',
      status: 'completed',
      size: '2.3 MB',
      format: 'PDF'
    },
    {
      id: '2', 
      title: 'Charge de travail par enseignant - S1 2024',
      type: 'workload',
      status: 'completed',
      size: '1.8 MB',
      format: 'Excel'
    }
  ];

  const handleDownload = (reportId: string) => {
    toast({
      title: "Téléchargement en cours",
      description: "Le rapport est en cours de téléchargement.",
    });
  };

  const handleCreateReport = () => {
    toast({
      title: "Nouveau rapport",
      description: "Fonctionnalité de création de rapport à venir.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-6 w-6" />
              Rapports RH
            </CardTitle>
            <Button onClick={handleCreateReport}>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau rapport
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4">
        {reports.map((report) => (
          <Card key={report.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{report.title}</h3>
                  <p className="text-sm text-muted-foreground">{report.size} - {report.format}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="default">Terminé</Badge>
                  <Button size="sm" onClick={() => handleDownload(report.id)}>
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};