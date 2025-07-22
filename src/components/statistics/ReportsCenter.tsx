
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  Download, 
  Calendar,
  Filter,
  Eye,
  Share2,
  Settings,
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  GraduationCap,
  DollarSign
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const ReportsCenter = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("semester");
  const [selectedFormat, setSelectedFormat] = useState("pdf");
  const [selectedReportType, setSelectedReportType] = useState("executive");
  const [generationProgress, setGenerationProgress] = useState(0);
  const { toast } = useToast();

  const reportTemplates = [
    {
      id: 'executive',
      name: 'Rapport Exécutif',
      description: 'Vue d\'ensemble complète pour la direction',
      icon: TrendingUp,
      color: 'blue',
      sections: ['KPIs Globaux', 'Performance', 'Recommandations'],
      lastGenerated: '2024-12-15'
    },
    {
      id: 'academic',
      name: 'Rapport Académique',
      description: 'Performance pédagogique détaillée',
      icon: GraduationCap,
      color: 'green',
      sections: ['Cours', 'Notes', 'Taux de Réussite'],
      lastGenerated: '2024-12-14'
    },
    {
      id: 'students',
      name: 'Rapport Étudiants',
      description: 'Statistiques des effectifs étudiants',
      icon: Users,
      color: 'purple',
      sections: ['Effectifs', 'Démographie', 'Évolution'],
      lastGenerated: '2024-12-13'
    },
    {
      id: 'financial',
      name: 'Rapport Financier',
      description: 'Analyse budgétaire et financière',
      icon: DollarSign,
      color: 'amber',
      sections: ['Budget', 'Dépenses', 'Efficacité'],
      lastGenerated: '2024-12-12'
    }
  ];

  const recentReports = [
    {
      name: 'Rapport Exécutif Q4 2024',
      type: 'PDF',
      size: '2.4 MB',
      generated: '2024-12-15 14:30',
      status: 'completed'
    },
    {
      name: 'Statistiques Étudiantes S1',
      type: 'Excel',
      size: '1.8 MB',
      generated: '2024-12-14 09:15',
      status: 'completed'
    },
    {
      name: 'Analyse Financière 2024',
      type: 'PDF',
      size: '3.2 MB',
      generated: '2024-12-13 16:45',
      status: 'completed'
    }
  ];

  const handleGenerateReport = () => {
    setGenerationProgress(0);
    const interval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          toast({
            title: "Rapport généré",
            description: `Rapport ${selectedReportType} créé avec succès`
          });
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handlePreviewReport = (reportId: string) => {
    toast({
      title: "Aperçu du rapport",
      description: "Ouverture de l'aperçu..."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Centre de Rapports</h2>
          <p className="text-slate-600">Génération et gestion des rapports statistiques</p>
        </div>
        <Badge className="bg-indigo-100 text-indigo-800">
          <FileText className="h-3 w-3 mr-1" />
          {recentReports.length} rapports récents
        </Badge>
      </div>

      <Tabs defaultValue="generate" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generate">Générer Rapport</TabsTrigger>
          <TabsTrigger value="templates">Modèles</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Configuration du Rapport
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Type de Rapport</Label>
                  <Select value={selectedReportType} onValueChange={setSelectedReportType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {reportTemplates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Période</Label>
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="month">Mois en cours</SelectItem>
                      <SelectItem value="semester">Semestre actuel</SelectItem>
                      <SelectItem value="year">Année universitaire</SelectItem>
                      <SelectItem value="custom">Période personnalisée</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Format de sortie</Label>
                  <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF - Document imprimable</SelectItem>
                      <SelectItem value="excel">Excel - Données analysables</SelectItem>
                      <SelectItem value="powerpoint">PowerPoint - Présentation</SelectItem>
                      <SelectItem value="word">Word - Document éditable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {selectedPeriod === 'custom' && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label>Date de début</Label>
                      <Input type="date" />
                    </div>
                    <div>
                      <Label>Date de fin</Label>
                      <Input type="date" />
                    </div>
                  </div>
                )}

                {generationProgress > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Génération en cours</span>
                      <span>{generationProgress}%</span>
                    </div>
                    <Progress value={generationProgress} />
                  </div>
                )}

                <Button 
                  onClick={handleGenerateReport} 
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                  disabled={generationProgress > 0 && generationProgress < 100}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  {generationProgress > 0 && generationProgress < 100 ? 'Génération...' : 'Générer le Rapport'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Aperçu du Rapport</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedReportType && (
                  <div className="space-y-4">
                    {(() => {
                      const template = reportTemplates.find(t => t.id === selectedReportType);
                      if (!template) return null;
                      
                      const IconComponent = template.icon;
                      return (
                        <>
                          <div className="flex items-center gap-3">
                            <div className={`p-3 bg-${template.color}-100 rounded-full`}>
                              <IconComponent className={`h-6 w-6 text-${template.color}-600`} />
                            </div>
                            <div>
                              <h3 className="font-semibold">{template.name}</h3>
                              <p className="text-sm text-slate-600">{template.description}</p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h4 className="font-medium">Sections incluses:</h4>
                            <div className="space-y-1">
                              {template.sections.map((section, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm">
                                  <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                                  <span>{section}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="pt-4 border-t">
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600">Format:</span>
                              <span className="font-medium">{selectedFormat.toUpperCase()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600">Période:</span>
                              <span className="font-medium">{selectedPeriod}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600">Taille estimée:</span>
                              <span className="font-medium">~2.5 MB</span>
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reportTemplates.map((template) => {
              const IconComponent = template.icon;
              return (
                <Card key={template.id} className={`border-${template.color}-200 hover:shadow-md transition-shadow`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 bg-${template.color}-100 rounded-lg`}>
                          <IconComponent className={`h-5 w-5 text-${template.color}-600`} />
                        </div>
                        <div>
                          <h3 className="font-semibold">{template.name}</h3>
                          <p className="text-sm text-slate-600">{template.description}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <p className="text-xs text-slate-500">Sections:</p>
                      <div className="flex flex-wrap gap-1">
                        {template.sections.map((section, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {section}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                      <span>Dernière génération: {template.lastGenerated}</span>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handlePreviewReport(template.id)}
                        className="flex-1"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Aperçu
                      </Button>
                      <Button 
                        size="sm" 
                        className={`bg-${template.color}-600 hover:bg-${template.color}-700 flex-1`}
                        onClick={() => setSelectedReportType(template.id)}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Générer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Rapports Récents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentReports.map((report, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-slate-500" />
                      <div>
                        <h4 className="font-medium">{report.name}</h4>
                        <div className="flex items-center gap-3 text-sm text-slate-600">
                          <span>{report.generated}</span>
                          <span>•</span>
                          <span>{report.size}</span>
                          <span>•</span>
                          <span>{report.type}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-100 text-green-800">
                        Terminé
                      </Badge>
                      <Button size="sm" variant="outline">
                        <Download className="h-3 w-3 mr-1" />
                        Télécharger
                      </Button>
                      <Button size="sm" variant="outline">
                        <Share2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
