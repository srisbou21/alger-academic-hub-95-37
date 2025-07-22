import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  Upload, 
  FileDown, 
  FileUp, 
  Database,
  Copy,
  AlertTriangle,
  CheckCircle,
  Info,
  Settings
} from "lucide-react";
import { dataImportExportService, ExportFormat, ImportOptions, DataMigrationReport } from "../../services/dataImportExportService";
import { academicYearService } from "../../services/academicYearService";
import { useToast } from "@/hooks/use-toast";
import { useAcademicYear } from "../../contexts/AcademicYearContext";

export const DataImportExportManager: React.FC = () => {
  const { toast } = useToast();
  const { availableYears, selectedYear } = useAcademicYear();
  
  // États pour l'export
  const [exportFormat, setExportFormat] = useState<ExportFormat>({
    format: 'json',
    includeMetadata: true,
    compression: false
  });
  const [exportType, setExportType] = useState<'full' | 'year' | 'table'>('full');
  const [selectedYearForExport, setSelectedYearForExport] = useState<string>(selectedYear);
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [exportLoading, setExportLoading] = useState(false);
  
  // États pour l'import
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importOptions, setImportOptions] = useState<ImportOptions>({
    skipDuplicates: true,
    overwriteExisting: false,
    validateData: true,
    dryRun: false
  });
  const [importLoading, setImportLoading] = useState(false);
  const [importReport, setImportReport] = useState<DataMigrationReport | null>(null);
  
  // États pour la migration entre années
  const [migrationSourceYear, setMigrationSourceYear] = useState<string>("");
  const [migrationTargetYear, setMigrationTargetYear] = useState<string>("");
  const [migrationTables, setMigrationTables] = useState<string[]>([]);
  const [migrationLoading, setMigrationLoading] = useState(false);
  
  // Classification des tables
  const tableClassification = academicYearService.getTableClassification();
  const allTables = [
    ...tableClassification.permanent,
    ...tableClassification.annual,
    ...tableClassification.hybrid
  ];

  // === FONCTIONS D'EXPORT ===
  
  const handleFullDatabaseExport = async () => {
    setExportLoading(true);
    try {
      const data = await dataImportExportService.exportFullDatabase(exportFormat);
      const filename = `database_export_${new Date().toISOString().split('T')[0]}`;
      await dataImportExportService.downloadExportFile(data, filename, exportFormat);
      
      toast({
        title: "Export réussi",
        description: "La base de données complète a été exportée avec succès",
      });
    } catch (error: any) {
      toast({
        title: "Erreur d'export",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setExportLoading(false);
    }
  };

  const handleYearExport = async () => {
    if (!selectedYearForExport) {
      toast({
        title: "Année requise",
        description: "Veuillez sélectionner une année universitaire",
        variant: "destructive"
      });
      return;
    }

    setExportLoading(true);
    try {
      const data = await dataImportExportService.exportAcademicYearData(
        selectedYearForExport, 
        true
      );
      const filename = `year_export_${selectedYearForExport}_${new Date().toISOString().split('T')[0]}`;
      await dataImportExportService.downloadExportFile(data, filename, exportFormat);
      
      toast({
        title: "Export réussi",
        description: `Les données de l'année ${selectedYearForExport} ont été exportées`,
      });
    } catch (error: any) {
      toast({
        title: "Erreur d'export",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setExportLoading(false);
    }
  };

  const handleTableExport = async () => {
    if (selectedTables.length === 0) {
      toast({
        title: "Tables requises",
        description: "Veuillez sélectionner au moins une table",
        variant: "destructive"
      });
      return;
    }

    setExportLoading(true);
    try {
      const data: any[] = [];
      for (const tableName of selectedTables) {
        const requiresYear = academicYearService.requiresAcademicYear(tableName);
        const tableData = await dataImportExportService.exportTableData(
          tableName, 
          requiresYear ? selectedYearForExport : undefined
        );
        data.push(tableData);
      }
      
      const filename = `tables_export_${selectedTables.join('_')}_${new Date().toISOString().split('T')[0]}`;
      await dataImportExportService.downloadExportFile(data, filename, exportFormat);
      
      toast({
        title: "Export réussi",
        description: `${selectedTables.length} table(s) exportée(s)`,
      });
    } catch (error: any) {
      toast({
        title: "Erreur d'export",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setExportLoading(false);
    }
  };

  // === FONCTIONS D'IMPORT ===

  const handleFileImport = async () => {
    if (!importFile) {
      toast({
        title: "Fichier requis",
        description: "Veuillez sélectionner un fichier à importer",
        variant: "destructive"
      });
      return;
    }

    setImportLoading(true);
    try {
      const report = await dataImportExportService.importDataFromFile(importFile, importOptions);
      setImportReport(report);
      
      if (report.errors.length === 0) {
        toast({
          title: "Import réussi",
          description: `${report.recordsProcessed} enregistrements traités`,
        });
      } else {
        toast({
          title: "Import avec erreurs",
          description: `${report.errors.length} erreur(s) détectée(s)`,
          variant: "destructive"
        });
      }
    } catch (error: any) {
      toast({
        title: "Erreur d'import",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setImportLoading(false);
    }
  };

  // === FONCTIONS DE MIGRATION ===

  const handleYearMigration = async () => {
    if (!migrationSourceYear || !migrationTargetYear) {
      toast({
        title: "Années requises",
        description: "Veuillez sélectionner les années source et cible",
        variant: "destructive"
      });
      return;
    }

    if (migrationTables.length === 0) {
      toast({
        title: "Tables requises",
        description: "Veuillez sélectionner au moins une table à migrer",
        variant: "destructive"
      });
      return;
    }

    setMigrationLoading(true);
    try {
      const report = await dataImportExportService.importDataFromYear(
        migrationSourceYear,
        migrationTargetYear,
        migrationTables,
        {
          skipDuplicates: true,
          overwriteExisting: false,
          validateData: true,
          dryRun: false
        }
      );
      
      toast({
        title: "Migration réussie",
        description: `${report.recordsProcessed} enregistrements migrés`,
      });
    } catch (error: any) {
      toast({
        title: "Erreur de migration",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setMigrationLoading(false);
    }
  };

  const toggleTableSelection = (tableName: string) => {
    setSelectedTables(prev => 
      prev.includes(tableName) 
        ? prev.filter(t => t !== tableName)
        : [...prev, tableName]
    );
  };

  const toggleMigrationTable = (tableName: string) => {
    setMigrationTables(prev => 
      prev.includes(tableName) 
        ? prev.filter(t => t !== tableName)
        : [...prev, tableName]
    );
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <Card className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Database className="h-8 w-8" />
            Gestion des Données - Import/Export
          </CardTitle>
          <p className="text-indigo-100">
            Importation, exportation et migration des données académiques
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section Export */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-green-600" />
              Exportation des Données
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Sélection du type d'export */}
            <div className="space-y-2">
              <Label>Type d'Export</Label>
              <Select value={exportType} onValueChange={(value: any) => setExportType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">Base de données complète</SelectItem>
                  <SelectItem value="year">Année universitaire</SelectItem>
                  <SelectItem value="table">Tables spécifiques</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Format d'export */}
            <div className="space-y-2">
              <Label>Format</Label>
              <Select 
                value={exportFormat.format} 
                onValueChange={(value: any) => setExportFormat(prev => ({ ...prev, format: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sélection d'année pour export */}
            {(exportType === 'year' || exportType === 'table') && (
              <div className="space-y-2">
                <Label>Année Universitaire</Label>
                <Select 
                  value={selectedYearForExport} 
                  onValueChange={setSelectedYearForExport}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une année" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableYears.map(year => (
                      <SelectItem key={year.id} value={year.year}>
                        {year.year} {year.isActive && <Badge className="ml-2">Active</Badge>}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Sélection des tables */}
            {exportType === 'table' && (
              <div className="space-y-2">
                <Label>Tables à Exporter</Label>
                <div className="max-h-40 overflow-y-auto border rounded p-2 space-y-2">
                  {Object.entries(tableClassification).map(([category, tables]) => (
                    <div key={category}>
                      <Label className="text-sm font-semibold text-blue-600 capitalize">
                        {category === 'permanent' ? 'Permanentes' : 
                         category === 'annual' ? 'Annuelles' : 'Hybrides'}
                      </Label>
                      {tables.map(table => (
                        <div key={table} className="flex items-center space-x-2 ml-4">
                          <Checkbox
                            id={`export-${table}`}
                            checked={selectedTables.includes(table)}
                            onCheckedChange={() => toggleTableSelection(table)}
                          />
                          <Label htmlFor={`export-${table}`} className="text-sm">
                            {table}
                          </Label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Options d'export */}
            <div className="space-y-2">
              <Label>Options</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="include-metadata"
                    checked={exportFormat.includeMetadata}
                    onCheckedChange={(checked) => 
                      setExportFormat(prev => ({ ...prev, includeMetadata: !!checked }))
                    }
                  />
                  <Label htmlFor="include-metadata" className="text-sm">
                    Inclure les métadonnées
                  </Label>
                </div>
              </div>
            </div>

            {/* Boutons d'export */}
            <div className="flex gap-2">
              {exportType === 'full' && (
                <Button 
                  onClick={handleFullDatabaseExport}
                  disabled={exportLoading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {exportLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  ) : (
                    <FileDown className="h-4 w-4 mr-2" />
                  )}
                  Exporter Base Complète
                </Button>
              )}
              
              {exportType === 'year' && (
                <Button 
                  onClick={handleYearExport}
                  disabled={exportLoading || !selectedYearForExport}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {exportLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  ) : (
                    <FileDown className="h-4 w-4 mr-2" />
                  )}
                  Exporter Année
                </Button>
              )}
              
              {exportType === 'table' && (
                <Button 
                  onClick={handleTableExport}
                  disabled={exportLoading || selectedTables.length === 0}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {exportLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  ) : (
                    <FileDown className="h-4 w-4 mr-2" />
                  )}
                  Exporter Tables
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Section Import */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-blue-600" />
              Importation des Données
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Sélection de fichier */}
            <div className="space-y-2">
              <Label htmlFor="import-file">Fichier à Importer</Label>
              <Input
                id="import-file"
                type="file"
                accept=".json,.csv"
                onChange={(e) => setImportFile(e.target.files?.[0] || null)}
              />
              <p className="text-sm text-slate-500">
                Formats supportés: JSON, CSV
              </p>
            </div>

            {/* Options d'import */}
            <div className="space-y-2">
              <Label>Options d'Import</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="skip-duplicates"
                    checked={importOptions.skipDuplicates}
                    onCheckedChange={(checked) => 
                      setImportOptions(prev => ({ ...prev, skipDuplicates: !!checked }))
                    }
                  />
                  <Label htmlFor="skip-duplicates" className="text-sm">
                    Ignorer les doublons
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="overwrite-existing"
                    checked={importOptions.overwriteExisting}
                    onCheckedChange={(checked) => 
                      setImportOptions(prev => ({ ...prev, overwriteExisting: !!checked }))
                    }
                  />
                  <Label htmlFor="overwrite-existing" className="text-sm">
                    Écraser les données existantes
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="validate-data"
                    checked={importOptions.validateData}
                    onCheckedChange={(checked) => 
                      setImportOptions(prev => ({ ...prev, validateData: !!checked }))
                    }
                  />
                  <Label htmlFor="validate-data" className="text-sm">
                    Valider les données
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="dry-run"
                    checked={importOptions.dryRun}
                    onCheckedChange={(checked) => 
                      setImportOptions(prev => ({ ...prev, dryRun: !!checked }))
                    }
                  />
                  <Label htmlFor="dry-run" className="text-sm">
                    Mode test (simulation)
                  </Label>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleFileImport}
              disabled={importLoading || !importFile}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {importLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Import en cours...
                </>
              ) : (
                <>
                  <FileUp className="h-4 w-4 mr-2" />
                  Importer le Fichier
                </>
              )}
            </Button>

            {/* Rapport d'import */}
            {importReport && (
              <Alert className={importReport.errors.length > 0 ? "border-red-200" : "border-green-200"}>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-1">
                    <p><strong>Rapport d'Import:</strong></p>
                    <p>• Tables traitées: {importReport.tablesProcessed.length}</p>
                    <p>• Enregistrements: {importReport.recordsProcessed}</p>
                    <p>• Temps d'exécution: {importReport.executionTime}ms</p>
                    {importReport.errors.length > 0 && (
                      <p className="text-red-600">• Erreurs: {importReport.errors.length}</p>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Section Migration entre Années */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Copy className="h-5 w-5 text-orange-600" />
            Migration entre Années Universitaires
          </CardTitle>
          <p className="text-slate-600">
            Copier des données d'une année universitaire vers une autre
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Année Source</Label>
              <Select value={migrationSourceYear} onValueChange={setMigrationSourceYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Année source" />
                </SelectTrigger>
                <SelectContent>
                  {availableYears.map(year => (
                    <SelectItem key={year.id} value={year.year}>
                      {year.year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Année Cible</Label>
              <Select value={migrationTargetYear} onValueChange={setMigrationTargetYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Année cible" />
                </SelectTrigger>
                <SelectContent>
                  {availableYears.map(year => (
                    <SelectItem key={year.id} value={year.year}>
                      {year.year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tables à Migrer</Label>
              <div className="max-h-32 overflow-y-auto border rounded p-2">
                {[...tableClassification.annual, ...tableClassification.hybrid].map(table => (
                  <div key={table} className="flex items-center space-x-2">
                    <Checkbox
                      id={`migrate-${table}`}
                      checked={migrationTables.includes(table)}
                      onCheckedChange={() => toggleMigrationTable(table)}
                    />
                    <Label htmlFor={`migrate-${table}`} className="text-sm">
                      {table}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <Button 
              onClick={handleYearMigration}
              disabled={migrationLoading || !migrationSourceYear || !migrationTargetYear || migrationTables.length === 0}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {migrationLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Migration en cours...
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Migrer les Données
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Informations sur la Classification des Tables */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-600" />
            Classification des Tables
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-green-700">Tables Permanentes</h4>
              <p className="text-sm text-slate-600">
                Données partagées entre toutes les années (enseignants, départements, etc.)
              </p>
              <div className="space-y-1">
                {tableClassification.permanent.map(table => (
                  <Badge key={table} variant="outline" className="mr-1 mb-1">
                    {table}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-blue-700">Tables Annuelles</h4>
              <p className="text-sm text-slate-600">
                Données spécifiques à chaque année universitaire
              </p>
              <div className="space-y-1">
                {tableClassification.annual.map(table => (
                  <Badge key={table} variant="outline" className="mr-1 mb-1">
                    {table}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-purple-700">Tables Hybrides</h4>
              <p className="text-sm text-slate-600">
                Structure permanente avec instances annuelles
              </p>
              <div className="space-y-1">
                {tableClassification.hybrid.map(table => (
                  <Badge key={table} variant="outline" className="mr-1 mb-1">
                    {table}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};