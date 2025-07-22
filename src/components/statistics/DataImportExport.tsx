
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  Download, 
  Database, 
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Settings,
  History
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const DataImportExport = () => {
  const [importProgress, setImportProgress] = useState(0);
  const [exportProgress, setExportProgress] = useState(0);
  const [selectedFormat, setSelectedFormat] = useState("excel");
  const [selectedDataType, setSelectedDataType] = useState("all");
  const { toast } = useToast();

  const dataTypes = [
    { id: 'all', name: 'Toutes les données', count: '12,547 enregistrements' },
    { id: 'students', name: 'Données Étudiantes', count: '2,847 étudiants' },
    { id: 'personnel', name: 'Données Personnel', count: '142 membres' },
    { id: 'academic', name: 'Données Académiques', count: '115 cours' },
    { id: 'financial', name: 'Données Financières', count: '24 budgets' }
  ];

  const recentOperations = [
    { type: 'export', data: 'Données Étudiantes', date: '2024-12-15 14:30', status: 'success', size: '2.4 MB' },
    { type: 'import', data: 'Personnel S1', date: '2024-12-14 09:15', status: 'success', size: '856 KB' },
    { type: 'export', data: 'Rapport Complet', date: '2024-12-13 16:45', status: 'success', size: '5.2 MB' },
    { type: 'import', data: 'Notes Examens', date: '2024-12-12 11:20', status: 'warning', size: '1.1 MB' }
  ];

  const handleImport = () => {
    setImportProgress(0);
    const interval = setInterval(() => {
      setImportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          toast({
            title: "Import terminé",
            description: "Les données ont été importées avec succès"
          });
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleExport = () => {
    setExportProgress(0);
    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          toast({
            title: "Export terminé",
            description: `Fichier ${selectedFormat.toUpperCase()} généré avec succès`
          });
          return 100;
        }
        return prev + 15;
      });
    }, 300);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Gestion des Données</h2>
          <p className="text-slate-600">Import, export et synchronisation des données statistiques</p>
        </div>
        <Badge className="bg-blue-100 text-blue-800">
          <Database className="h-3 w-3 mr-1" />
          12,547 enregistrements
        </Badge>
      </div>

      <Tabs defaultValue="export" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="export">Export de Données</TabsTrigger>
          <TabsTrigger value="import">Import de Données</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="export" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Configuration d'Export
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Type de Données</Label>
                  <Select value={selectedDataType} onValueChange={setSelectedDataType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {dataTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          <div>
                            <div className="font-medium">{type.name}</div>
                            <div className="text-sm text-slate-500">{type.count}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Format d'Export</Label>
                  <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excel">Excel (.xlsx) - Recommandé</SelectItem>
                      <SelectItem value="csv">CSV - Données brutes</SelectItem>
                      <SelectItem value="json">JSON - Format technique</SelectItem>
                      <SelectItem value="pdf">PDF - Rapport imprimable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Options Avancées</Label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">Inclure les métadonnées</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">Compression automatique</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" />
                      <span className="text-sm">Chiffrement des données sensibles</span>
                    </label>
                  </div>
                </div>

                {exportProgress > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progression de l'export</span>
                      <span>{exportProgress}%</span>
                    </div>
                    <Progress value={exportProgress} />
                  </div>
                )}

                <Button onClick={handleExport} className="w-full bg-green-600 hover:bg-green-700" disabled={exportProgress > 0 && exportProgress < 100}>
                  <Download className="h-4 w-4 mr-2" />
                  {exportProgress > 0 && exportProgress < 100 ? 'Export en cours...' : 'Exporter les Données'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Aperçu de l'Export</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <FileSpreadsheet className="h-8 w-8 text-green-600" />
                    <div>
                      <h3 className="font-semibold">
                        {dataTypes.find(t => t.id === selectedDataType)?.name}
                      </h3>
                      <p className="text-sm text-slate-600">
                        Format: {selectedFormat.toUpperCase()}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Enregistrements:</span>
                      <span className="font-medium">
                        {dataTypes.find(t => t.id === selectedDataType)?.count}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Taille estimée:</span>
                      <span className="font-medium">2.1 MB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Temps estimé:</span>
                      <span className="font-medium">&lt; 1 minute</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Colonnes incluses:</h4>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline">ID</Badge>
                      <Badge variant="outline">Nom</Badge>
                      <Badge variant="outline">Date</Badge>
                      <Badge variant="outline">Statut</Badge>
                      <Badge variant="outline">Département</Badge>
                      <Badge variant="outline">+12 autres</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="import" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Import de Données
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Sélectionner un fichier</h3>
                <p className="text-slate-600 mb-4">
                  Formats supportés: Excel (.xlsx), CSV (.csv), JSON (.json)
                </p>
                <Input type="file" className="max-w-xs mx-auto" accept=".xlsx,.csv,.json" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Mode d'Import</Label>
                  <Select defaultValue="append">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="append">Ajouter aux données existantes</SelectItem>
                      <SelectItem value="replace">Remplacer les données existantes</SelectItem>
                      <SelectItem value="update">Mettre à jour les enregistrements</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Validation</Label>
                  <Select defaultValue="strict">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="strict">Validation stricte</SelectItem>
                      <SelectItem value="lenient">Validation souple</SelectItem>
                      <SelectItem value="none">Aucune validation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {importProgress > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progression de l'import</span>
                    <span>{importProgress}%</span>
                  </div>
                  <Progress value={importProgress} />
                </div>
              )}

              <Button onClick={handleImport} className="w-full bg-blue-600 hover:bg-blue-700" disabled={importProgress > 0 && importProgress < 100}>
                <Upload className="h-4 w-4 mr-2" />
                {importProgress > 0 && importProgress < 100 ? 'Import en cours...' : 'Commencer l\'Import'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Historique des Opérations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentOperations.map((operation, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        operation.type === 'import' ? 'bg-blue-100' : 'bg-green-100'
                      }`}>
                        {operation.type === 'import' ? 
                          <Upload className={`h-4 w-4 ${operation.type === 'import' ? 'text-blue-600' : 'text-green-600'}`} /> :
                          <Download className={`h-4 w-4 ${operation.type === 'import' ? 'text-blue-600' : 'text-green-600'}`} />
                        }
                      </div>
                      <div>
                        <h4 className="font-medium">
                          {operation.type === 'import' ? 'Import' : 'Export'}: {operation.data}
                        </h4>
                        <div className="flex items-center gap-4 text-sm text-slate-600">
                          <span>{operation.date}</span>
                          <span>•</span>
                          <span>{operation.size}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {operation.status === 'success' ? (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Réussi
                        </Badge>
                      ) : (
                        <Badge className="bg-amber-100 text-amber-800">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Avertissement
                        </Badge>
                      )}
                      <Button variant="outline" size="sm">
                        Détails
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
