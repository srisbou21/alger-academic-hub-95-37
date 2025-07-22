
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, 
  Plus, 
  Copy, 
  Database, 
  CheckCircle, 
  AlertCircle,
  Download,
  Upload,
  RefreshCw,
  Trash2
} from "lucide-react";
import { academicYearService, AcademicYear } from "../../services/academicYearService";
import { useToast } from "@/hooks/use-toast";

export const AcademicYearManager = () => {
  const { toast } = useToast();
  const [availableYears, setAvailableYears] = useState<AcademicYear[]>([]);
  const [yearStats, setYearStats] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newYearValue, setNewYearValue] = useState("");
  const [sourceYear, setSourceYear] = useState("");
  const [importWithData, setImportWithData] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const years = await academicYearService.getAcademicYears();
      setAvailableYears(years);

      // Charger les statistiques pour chaque année
      const stats: Record<string, any> = {};
      for (const year of years) {
        try {
          const yearStat = await academicYearService.getYearStatistics(year.year);
          stats[year.year] = yearStat;
        } catch (error) {
          stats[year.year] = {
            totalWorkloads: 0,
            totalConfigurations: 0,
            lastUpdated: new Date()
          };
        }
      }
      setYearStats(stats);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les données des années universitaires",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNewYear = async () => {
    if (!newYearValue) {
      toast({
        title: "Erreur",
        description: "Veuillez spécifier l'année universitaire",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const migrationOptions = {
        copyFormationOffers: importWithData,
        copySectionConfigurations: importWithData,
        createTeacherWorkloads: true,
        archivePreviousYear: false
      };

      await academicYearService.createAcademicYear(newYearValue, migrationOptions);
      
      toast({
        title: "Succès",
        description: `Année universitaire ${newYearValue} créée avec succès`,
      });
      
      setShowCreateDialog(false);
      setNewYearValue("");
      setSourceYear("");
      setImportWithData(false);
      await loadData();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer la nouvelle année",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportYear = async (year: string) => {
    setLoading(true);
    try {
      const data = await academicYearService.exportYearData(year);
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `academic-year-${year}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export réussi",
        description: `Données de l'année ${year} exportées`
      });
    } catch (error) {
      toast({
        title: "Erreur d'export",
        description: "Impossible d'exporter les données",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const options = [];
    
    for (let i = currentYear - 1; i <= currentYear + 3; i++) {
      const yearString = `${i}-${i + 1}`;
      options.push(yearString);
    }
    
    return options;
  };

  const getYearStatus = (year: AcademicYear) => {
    const stats = yearStats[year.year];
    if (!stats) return "inactive";
    
    if (stats.totalWorkloads > 0 || stats.workloads > 0) {
      return "active";
    }
    return "empty";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Actif</Badge>;
      case "empty":
        return <Badge variant="outline"><AlertCircle className="h-3 w-3 mr-1" />Vide</Badge>;
      default:
        return <Badge variant="secondary">Inactif</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Calendar className="h-8 w-8 text-blue-600" />
            Gestionnaire des Années Universitaires
          </CardTitle>
          <p className="text-slate-600">
            Créez, gérez et administrez les années universitaires du système
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle Année Universitaire
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Créer une Nouvelle Année Universitaire</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="newYear">Année Universitaire</Label>
                    <Select value={newYearValue} onValueChange={setNewYearValue}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner l'année universitaire" />
                      </SelectTrigger>
                      <SelectContent>
                        {generateYearOptions().map(year => (
                          <SelectItem key={year} value={year}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="importData"
                        checked={importWithData}
                        onChange={(e) => setImportWithData(e.target.checked)}
                        className="rounded"
                      />
                      <Label htmlFor="importData">
                        Importer les données depuis une année existante
                      </Label>
                    </div>

                    {importWithData && (
                      <div>
                        <Label htmlFor="sourceYear">Année source</Label>
                        <Select value={sourceYear} onValueChange={setSourceYear}>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner l'année source" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableYears.map(year => (
                              <SelectItem key={year.id} value={year.year}>{year.year}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        {importWithData 
                          ? "Les configurations des sections et groupes seront copiées. Les charges d'enseignement devront être attribuées manuellement."
                          : "Une année vide sera créée. Vous devrez configurer les sections, groupes et charges d'enseignement."
                        }
                      </AlertDescription>
                    </Alert>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={handleCreateNewYear} 
                      disabled={loading || !newYearValue || (importWithData && !sourceYear)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {loading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                      Créer l'Année
                    </Button>
                    <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                      Annuler
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="outline" onClick={loadData} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Liste des années universitaires */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableYears.map(year => {
          const stats = yearStats[year.year];
          const status = getYearStatus(year);
          
          return (
            <Card key={year.id} className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{year.year}</CardTitle>
                  {getStatusBadge(status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {stats && (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Charges d'enseignement:</span>
                      <span className="font-medium">{stats.workloads || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Enseignants:</span>
                      <span className="font-medium">{stats.teachers || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Étudiants:</span>
                      <span className="font-medium">{stats.students || 0}</span>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleExportYear(year.year)}
                    disabled={loading}
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Export
                  </Button>
                  
                  {status === "active" && (
                    <Button size="sm" variant="outline">
                      <Database className="h-3 w-3 mr-1" />
                      Gérer
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Section d'informations */}
      <Card>
        <CardHeader>
          <CardTitle>Informations Système</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Database className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="font-semibold">{availableYears.length}</p>
                <p className="text-sm text-slate-600">Années disponibles</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="font-semibold">
                  {availableYears.filter(year => getYearStatus(year) === "active").length}
                </p>
                <p className="text-sm text-slate-600">Années actives</p>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded-lg">
                <AlertCircle className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                <p className="font-semibold">
                  {availableYears.filter(year => getYearStatus(year) === "empty").length}
                </p>
                <p className="text-sm text-slate-600">Années vides</p>
              </div>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Les données des années universitaires sont stockées localement. 
                Pensez à exporter régulièrement vos données importantes.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
