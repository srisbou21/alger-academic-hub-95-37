import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Calendar, 
  Database, 
  Copy, 
  Archive, 
  Download,
  Upload,
  Clock,
  Users,
  BookOpen,
  CheckCircle,
  Info,
  Settings,
  RefreshCw
} from "lucide-react";
import { academicYearService, AcademicYear } from "../../services/academicYearService";
import { useToast } from "@/hooks/use-toast";
import { AcademicYearCreationManager } from "./AcademicYearCreationManager";
import { DataImportExportManager } from "./DataImportExportManager";

export const EnhancedAcademicYearManager = () => {
  const { toast } = useToast();
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [activeYear, setActiveYear] = useState<AcademicYear | null>(null);
  const [loading, setLoading] = useState(false);
  const [yearStats, setYearStats] = useState<{[key: string]: any}>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [years, active] = await Promise.all([
        academicYearService.getAcademicYears(),
        academicYearService.getActiveAcademicYear()
      ]);
      
      setAcademicYears(years);
      setActiveYear(active);

      // Charger les statistiques pour chaque année
      const stats: {[key: string]: any} = {};
      for (const year of years) {
        stats[year.year] = await academicYearService.getYearStatistics(year.year);
      }
      setYearStats(stats);
      
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleActivateYear = async (yearId: string) => {
    setLoading(true);
    try {
      await academicYearService.activateAcademicYear(yearId);
      
      toast({
        title: "Année activée",
        description: "L'année universitaire a été activée avec succès"
      });
      
      await loadData();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'activer l'année universitaire",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Actif</Badge>;
      case 'draft':
        return <Badge variant="secondary">Brouillon</Badge>;
      case 'archived':
        return <Badge variant="outline">Archivé</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const tableClassification = academicYearService.getTableClassification();

  return (
    <div className="space-y-6">
      {/* En-tête principal */}
      <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="h-8 w-8" />
            Gestionnaire Intelligent des Années Universitaires
          </CardTitle>
          <p className="text-blue-100">
            Gestion complète avec détection automatique des données liées aux années
          </p>
        </CardHeader>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-6 bg-white border border-blue-200">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="create">Création</TabsTrigger>
          <TabsTrigger value="management">Gestion</TabsTrigger>
          <TabsTrigger value="import-export">Import/Export</TabsTrigger>
          <TabsTrigger value="classification">Classification</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        {/* Vue d'ensemble */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Statistiques générales */}
            <Card className="border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Années Universitaires
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Total:</span>
                    <Badge variant="outline">{academicYears.length}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Active:</span>
                    <Badge className="bg-green-600">{activeYear?.year || 'Aucune'}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Archivées:</span>
                    <Badge variant="secondary">
                      {academicYears.filter(y => y.status === 'archived').length}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statistiques de l'année active */}
            {activeYear && yearStats[activeYear.year] && (
              <Card className="border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Année Active: {activeYear.year}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">Étudiants</span>
                      </div>
                      <Badge>{yearStats[activeYear.year].students}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Enseignants</span>
                      </div>
                      <Badge>{yearStats[activeYear.year].teachers}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-orange-600" />
                        <span className="text-sm">Charges</span>
                      </div>
                      <Badge>{yearStats[activeYear.year].workloads}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions rapides */}
            <Card className="border-purple-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="h-5 w-5 text-purple-600" />
                  Actions Rapides
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => academicYearService.cleanupOldData(3)}
                >
                  <Database className="h-4 w-4 mr-2" />
                  Nettoyer anciennes données
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                >
                  <Archive className="h-4 w-4 mr-2" />
                  Archiver années terminées
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export complet
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Architecture et Classification */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Architecture Intelligente:</strong> L'application détecte automatiquement les données 
              liées aux années (workloads, formations, évaluations) et les données permanentes (enseignants, 
              départements, échelons) qui ne sont jamais réinitialisées.
            </AlertDescription>
          </Alert>

          {/* Classification visuelle */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-green-200 bg-green-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Database className="h-4 w-4 text-green-600" />
                  Données Permanentes
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-green-700 mb-2">
                  Partagées entre toutes les années
                </p>
                <div className="text-xs text-green-700 space-y-1">
                  {tableClassification.permanent.slice(0, 4).map(table => (
                    <div key={table}>• {table}</div>
                  ))}
                  {tableClassification.permanent.length > 4 && (
                    <div>• ... et {tableClassification.permanent.length - 4} autres</div>
                  )}
                </div>
                <Badge variant="outline" className="mt-2 text-green-700">
                  {tableClassification.permanent.length} tables
                </Badge>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-blue-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  Données Annuelles
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-blue-700 mb-2">
                  Spécifiques à chaque année
                </p>
                <div className="text-xs text-blue-700 space-y-1">
                  {tableClassification.annual.slice(0, 4).map(table => (
                    <div key={table}>• {table}</div>
                  ))}
                  {tableClassification.annual.length > 4 && (
                    <div>• ... et {tableClassification.annual.length - 4} autres</div>
                  )}
                </div>
                <Badge variant="outline" className="mt-2 text-blue-700">
                  {tableClassification.annual.length} tables
                </Badge>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-purple-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Copy className="h-4 w-4 text-purple-600" />
                  Données Hybrides
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-purple-700 mb-2">
                  Structure permanente + instances annuelles
                </p>
                <div className="text-xs text-purple-700 space-y-1">
                  {tableClassification.hybrid.map(table => (
                    <div key={table}>• {table}</div>
                  ))}
                </div>
                <Badge variant="outline" className="mt-2 text-purple-700">
                  {tableClassification.hybrid.length} tables
                </Badge>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Création d'années */}
        <TabsContent value="create" className="space-y-6">
          <AcademicYearCreationManager onYearCreated={loadData} />
        </TabsContent>

        {/* Gestion des années */}
        <TabsContent value="management" className="space-y-6">
          <div className="grid gap-4">
            {academicYears.map((year) => (
              <Card key={year.id} className={`${year.isActive ? 'border-green-400 bg-green-50' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{year.year}</h3>
                        {getStatusBadge(year.status)}
                        {year.isActive && (
                          <Badge className="bg-green-600 text-white">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Année Active
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex gap-6 text-sm text-slate-600 mb-4">
                        <span>Début: {year.startDate.toLocaleDateString()}</span>
                        <span>Fin: {year.endDate.toLocaleDateString()}</span>
                      </div>

                      {/* Statistiques */}
                      {yearStats[year.year] && (
                        <div className="grid grid-cols-4 gap-4">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-blue-600" />
                            <span className="text-sm">{yearStats[year.year].students} étudiants</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-green-600" />
                            <span className="text-sm">{yearStats[year.year].teachers} enseignants</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-purple-600" />
                            <span className="text-sm">{yearStats[year.year].formations} formations</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-orange-600" />
                            <span className="text-sm">{yearStats[year.year].workloads} charges</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {!year.isActive && year.status !== 'archived' && (
                        <Button
                          size="sm"
                          onClick={() => handleActivateYear(year.id)}
                          disabled={loading}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Activer
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Import/Export */}
        <TabsContent value="import-export" className="space-y-6">
          <DataImportExportManager />
        </TabsContent>

        {/* Classification détaillée */}
        <TabsContent value="classification" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-6 w-6 text-blue-600" />
                Classification Détaillée des Tables
              </CardTitle>
              <p className="text-slate-600">
                Comprendre quelles données sont liées aux années universitaires
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Tables Permanentes */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-green-600" />
                    <h3 className="text-lg font-semibold text-green-700">Tables Permanentes</h3>
                  </div>
                  <Alert className="border-green-200 bg-green-50">
                    <Info className="h-4 w-4" />
                    <AlertDescription className="text-green-700">
                      Ces données ne changent pas d'une année à l'autre. Elles sont partagées 
                      entre toutes les années universitaires.
                    </AlertDescription>
                  </Alert>
                  <div className="space-y-2">
                    {tableClassification.permanent.map(table => (
                      <div key={table} className="flex items-center gap-2 p-2 bg-green-50 rounded">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">{table}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tables Annuelles */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-blue-700">Tables Annuelles</h3>
                  </div>
                  <Alert className="border-blue-200 bg-blue-50">
                    <Info className="h-4 w-4" />
                    <AlertDescription className="text-blue-700">
                      Ces données sont spécifiques à chaque année universitaire et 
                      sont réinitialisées à chaque nouvelle année.
                    </AlertDescription>
                  </Alert>
                  <div className="space-y-2">
                    {tableClassification.annual.map(table => (
                      <div key={table} className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">{table}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tables Hybrides */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Copy className="h-5 w-5 text-purple-600" />
                    <h3 className="text-lg font-semibold text-purple-700">Tables Hybrides</h3>
                  </div>
                  <Alert className="border-purple-200 bg-purple-50">
                    <Info className="h-4 w-4" />
                    <AlertDescription className="text-purple-700">
                      Ces données ont une structure permanente mais des instances 
                      spécifiques à chaque année (ex: étudiants, modules).
                    </AlertDescription>
                  </Alert>
                  <div className="space-y-2">
                    {tableClassification.hybrid.map(table => (
                      <div key={table} className="flex items-center gap-2 p-2 bg-purple-50 rounded">
                        <Copy className="h-4 w-4 text-purple-600" />
                        <span className="text-sm font-medium">{table}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Maintenance */}
        <TabsContent value="maintenance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-6 w-6 text-orange-600" />
                Maintenance et Optimisation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  variant="outline"
                  onClick={() => academicYearService.cleanupOldData(3)}
                  disabled={loading}
                  className="justify-start"
                >
                  <Database className="h-4 w-4 mr-2" />
                  Nettoyer données anciennes (&gt;3 ans)
                </Button>
                
                <Button 
                  variant="outline"
                  disabled={loading}
                  className="justify-start"
                >
                  <Archive className="h-4 w-4 mr-2" />
                  Archiver années terminées
                </Button>
                
                <Button 
                  variant="outline"
                  disabled={loading}
                  className="justify-start"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Vérifier intégrité des données
                </Button>
                
                <Button 
                  variant="outline"
                  disabled={loading}
                  className="justify-start"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Optimiser la base de données
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};