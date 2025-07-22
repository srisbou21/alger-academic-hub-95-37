
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Database, FileText, Users, AlertTriangle, Download, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const AdvancementAdministration: React.FC = () => {
  const [settings, setSettings] = useState({
    automaticGeneration: true,
    alertThreshold: 90,
    emailNotifications: true,
    batchProcessing: false,
    validationRequired: true
  });

  const [bulkOperation, setBulkOperation] = useState({
    operation: '',
    criteria: '',
    value: ''
  });

  const { toast } = useToast();

  const handleSettingSave = () => {
    toast({
      title: "Paramètres sauvegardés",
      description: "Les paramètres système ont été mis à jour"
    });
  };

  const handleBulkOperation = () => {
    toast({
      title: "Opération en lot lancée",
      description: `Opération ${bulkOperation.operation} en cours d'exécution`
    });
  };

  const handleDataExport = () => {
    toast({
      title: "Export en cours",
      description: "Les données sont en cours d'exportation"
    });
  };

  const handleDataImport = () => {
    toast({
      title: "Import en cours",
      description: "Les données sont en cours d'importation"
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-6 w-6" />
            Administration des Avancements
          </CardTitle>
          <p className="text-slate-600">
            Configuration et gestion avancée du système d'avancements
          </p>
        </CardHeader>
      </Card>

      <Tabs defaultValue="settings" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Paramètres
          </TabsTrigger>
          <TabsTrigger value="bulk">
            <Database className="h-4 w-4 mr-2" />
            Opérations en lot
          </TabsTrigger>
          <TabsTrigger value="reports">
            <FileText className="h-4 w-4 mr-2" />
            Rapports
          </TabsTrigger>
          <TabsTrigger value="maintenance">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Maintenance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres Généraux</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Génération automatique des propositions</Label>
                    <Switch
                      checked={settings.automaticGeneration}
                      onCheckedChange={(checked) => 
                        setSettings({...settings, automaticGeneration: checked})
                      }
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Seuil d'alerte (jours avant échéance)</Label>
                    <Input
                      type="number"
                      value={settings.alertThreshold}
                      onChange={(e) => 
                        setSettings({...settings, alertThreshold: parseInt(e.target.value)})
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Notifications par email</Label>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => 
                        setSettings({...settings, emailNotifications: checked})
                      }
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Traitement par lot</Label>
                    <Switch
                      checked={settings.batchProcessing}
                      onCheckedChange={(checked) => 
                        setSettings({...settings, batchProcessing: checked})
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Validation hiérarchique requise</Label>
                    <Switch
                      checked={settings.validationRequired}
                      onCheckedChange={(checked) => 
                        setSettings({...settings, validationRequired: checked})
                      }
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleSettingSave} className="w-full">
                Sauvegarder les paramètres
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Durées d'Avancement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Durée rapide (score ≥ 18/20)</Label>
                  <Input type="number" defaultValue="30" disabled />
                  <p className="text-sm text-slate-500">30 mois - Performance exceptionnelle</p>
                </div>
                <div className="space-y-2">
                  <Label>Durée normale (score 14-17/20)</Label>
                  <Input type="number" defaultValue="36" disabled />
                  <p className="text-sm text-slate-500">36 mois - Performance satisfaisante</p>
                </div>
                <div className="space-y-2">
                  <Label>Durée lente (score 12-13/20)</Label>
                  <Input type="number" defaultValue="42" disabled />
                  <p className="text-sm text-slate-500">42 mois - Performance minimale</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bulk" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Opérations en Lot</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Type d'opération</Label>
                  <Select value={bulkOperation.operation} onValueChange={(value) => 
                    setBulkOperation({...bulkOperation, operation: value})
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une opération" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recalculate">Recalculer les anciennetés</SelectItem>
                      <SelectItem value="generate">Générer les propositions</SelectItem>
                      <SelectItem value="validate">Valider en masse</SelectItem>
                      <SelectItem value="suspend">Suspendre les avancements</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Critères de sélection</Label>
                  <Select value={bulkOperation.criteria} onValueChange={(value) => 
                    setBulkOperation({...bulkOperation, criteria: value})
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner des critères" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="echelon">Par échelon</SelectItem>
                      <SelectItem value="service">Par service</SelectItem>
                      <SelectItem value="status">Par statut</SelectItem>
                      <SelectItem value="date">Par date d'éligibilité</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Valeur</Label>
                  <Input
                    value={bulkOperation.value}
                    onChange={(e) => setBulkOperation({...bulkOperation, value: e.target.value})}
                    placeholder="Valeur du critère"
                  />
                </div>
              </div>

              <Button onClick={handleBulkOperation} className="w-full">
                <Database className="h-4 w-4 mr-2" />
                Exécuter l'opération en lot
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Import/Export de Données</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button onClick={handleDataExport} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Exporter les données
                </Button>
                <Button onClick={handleDataImport} variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Importer les données
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Rapports Personnalisés</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Rapport mensuel des avancements
                </Button>
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Statistiques par échelon
                </Button>
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Prévisions budgétaires
                </Button>
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Rapport de performance
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-600">
                <AlertTriangle className="h-5 w-5" />
                Maintenance Système
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-amber-800 text-sm mb-4">
                  Les opérations de maintenance peuvent affecter les performances du système.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="text-amber-600 border-amber-300">
                    Nettoyer les données temporaires
                  </Button>
                  <Button variant="outline" className="text-amber-600 border-amber-300">
                    Reconstruire les index
                  </Button>
                  <Button variant="outline" className="text-amber-600 border-amber-300">
                    Vérifier la cohérence des données
                  </Button>
                  <Button variant="outline" className="text-amber-600 border-amber-300">
                    Archiver les anciens dossiers
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
