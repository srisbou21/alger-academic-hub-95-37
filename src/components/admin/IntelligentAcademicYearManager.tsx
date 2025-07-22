
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, 
  Database, 
  Copy, 
  Archive, 
  Trash2, 
  Download,
  Clock,
  Users,
  BookOpen,
  CheckCircle,
  AlertTriangle,
  Info,
  MoreVertical
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { academicYearService, AcademicYear } from "../../services/academicYearService";
import { useToast } from "@/hooks/use-toast";
import { AcademicYearCreationManager } from "./AcademicYearCreationManager";
import { AcademicYearDeletionDialog } from "./AcademicYearDeletionDialog";

export const IntelligentAcademicYearManager = () => {
  const { toast } = useToast();
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [activeYear, setActiveYear] = useState<AcademicYear | null>(null);
  const [loading, setLoading] = useState(false);
  const [yearStats, setYearStats] = useState<{[key: string]: any}>({});
  const [deletionDialog, setDeletionDialog] = useState<{
    isOpen: boolean;
    year: AcademicYear | null;
  }>({ isOpen: false, year: null });

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
      
      toast({
        title: "Données chargées",
        description: `${years.length} années trouvées, année active: ${active?.year || 'Aucune'}`
      });
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

  const handleExportYear = async (year: string) => {
    try {
      const exportData = await academicYearService.exportYearData(year);
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `export_${year}.json`;
      a.click();
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
    }
  };

  const handleArchiveYear = async (year: AcademicYear) => {
    try {
      await academicYearService.archiveAcademicYear(year.id);
      toast({
        title: "Année archivée",
        description: `L'année ${year.year} a été archivée avec succès`
      });
      await loadData();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'archiver l'année",
        variant: "destructive"
      });
    }
  };

  const openDeletionDialog = (year: AcademicYear) => {
    setDeletionDialog({ isOpen: true, year });
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-blue-600" />
            Gestion Intelligente des Années Universitaires
          </CardTitle>
          <p className="text-slate-600">
            Architecture optimisée - Données permanentes préservées, données annuelles gérées automatiquement
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Button 
              variant="outline"
              onClick={() => academicYearService.cleanupOldData(3)}
              disabled={loading}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Nettoyer (plus de 3 ans)
            </Button>
          </div>

          {/* Architecture Info */}
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Architecture Optimisée:</strong> Les données permanentes (enseignants, échelons, départements) 
              sont partagées entre toutes les années. Seules les données temporelles sont dupliquées.
            </AlertDescription>
          </Alert>

          {/* Classification des Tables */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="border-green-200 bg-green-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Database className="h-4 w-4 text-green-600" />
                  Tables Permanentes
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-xs text-green-700 space-y-1">
                  {tableClassification.permanent.map(table => (
                    <div key={table}>• {table}</div>
                  ))}
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
                  Tables Annuelles
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-xs text-blue-700 space-y-1">
                  {tableClassification.annual.map(table => (
                    <div key={table}>• {table}</div>
                  ))}
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
                  Tables Hybrides
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
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
        </CardContent>
      </Card>

      {/* Composant de création d'année */}
      <AcademicYearCreationManager onYearCreated={loadData} />

      {/* Liste des Années */}
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
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleExportYear(year.year)}>
                        <Download className="h-4 w-4 mr-2" />
                        Exporter
                      </DropdownMenuItem>
                      
                      {!year.isActive && year.status !== 'archived' && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleArchiveYear(year)}>
                            <Archive className="h-4 w-4 mr-2" />
                            Archiver
                          </DropdownMenuItem>
                        </>
                      )}
                      
                      {!year.isActive && (
                        <DropdownMenuItem 
                          onClick={() => openDeletionDialog(year)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Supprimer
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog de suppression */}
      {deletionDialog.year && (
        <AcademicYearDeletionDialog
          year={deletionDialog.year}
          yearStats={yearStats[deletionDialog.year.year]}
          isOpen={deletionDialog.isOpen}
          onOpenChange={(open) => setDeletionDialog({ isOpen: open, year: open ? deletionDialog.year : null })}
          onYearDeleted={loadData}
        />
      )}
    </div>
  );
};
