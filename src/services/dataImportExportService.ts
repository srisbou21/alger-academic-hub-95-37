import { academicYearService, AcademicYear } from './academicYearService';
import { workloadService } from './workloadService';
import { teacherService } from './teacherService';
import { administrativeService } from './administrativeService';
import { formationOfferService } from './formationOfferService';

// Types pour l'import/export
export interface ExportFormat {
  format: 'json' | 'csv' | 'excel';
  includeMetadata: boolean;
  compression?: boolean;
}

export interface ImportOptions {
  skipDuplicates: boolean;
  overwriteExisting: boolean;
  validateData: boolean;
  dryRun: boolean;
}

export interface DataMigrationReport {
  tablesProcessed: string[];
  recordsProcessed: number;
  recordsSkipped: number;
  errors: string[];
  warnings: string[];
  executionTime: number;
}

export interface TableData {
  tableName: string;
  records: any[];
  metadata: {
    exportDate: Date;
    sourceYear?: string;
    recordCount: number;
    dataVersion: string;
  };
}

export interface FullDatabaseExport {
  metadata: {
    exportDate: Date;
    version: string;
    academicYears: AcademicYear[];
    tableClassification: any;
  };
  permanentData: { [tableName: string]: TableData };
  yearlyData: { [year: string]: { [tableName: string]: TableData } };
}

// Service pour l'import/export et la migration des données
export class DataImportExportService {
  
  // === FONCTIONS D'EXPORT GLOBALES ===
  
  /**
   * Exporte toutes les données de l'application
   */
  async exportFullDatabase(format: ExportFormat = { format: 'json', includeMetadata: true }): Promise<FullDatabaseExport> {
    console.log('🚀 Début de l\'export complet de la base de données');
    
    const classification = academicYearService.getTableClassification();
    const academicYears = await academicYearService.getAcademicYears();
    
    // Export des données permanentes
    const permanentData: { [tableName: string]: TableData } = {};
    for (const tableName of classification.permanent) {
      permanentData[tableName] = await this.exportTableData(tableName);
    }
    
    // Export des données annuelles pour chaque année
    const yearlyData: { [year: string]: { [tableName: string]: TableData } } = {};
    for (const academicYear of academicYears) {
      yearlyData[academicYear.year] = {};
      
      for (const tableName of [...classification.annual, ...classification.hybrid]) {
        yearlyData[academicYear.year][tableName] = await this.exportTableData(tableName, academicYear.year);
      }
    }
    
    const fullExport: FullDatabaseExport = {
      metadata: {
        exportDate: new Date(),
        version: '1.0.0',
        academicYears,
        tableClassification: classification
      },
      permanentData,
      yearlyData
    };
    
    console.log('✅ Export complet terminé');
    return fullExport;
  }
  
  /**
   * Exporte les données d'une année universitaire spécifique
   */
  async exportAcademicYearData(year: string, includePermanentData: boolean = false): Promise<{ [tableName: string]: TableData }> {
    console.log(`📤 Export des données pour l'année ${year}`);
    
    const classification = academicYearService.getTableClassification();
    const exportData: { [tableName: string]: TableData } = {};
    
    // Tables à exporter selon les options
    const tablesToExport = [
      ...(includePermanentData ? classification.permanent : []),
      ...classification.annual,
      ...classification.hybrid
    ];
    
    for (const tableName of tablesToExport) {
      const requiresYear = academicYearService.requiresAcademicYear(tableName);
      exportData[tableName] = await this.exportTableData(tableName, requiresYear ? year : undefined);
    }
    
    return exportData;
  }
  
  /**
   * Exporte les données d'une table spécifique
   */
  async exportTableData(tableName: string, academicYear?: string): Promise<TableData> {
    console.log(`📋 Export de la table: ${tableName}${academicYear ? ` (année: ${academicYear})` : ''}`);
    
    let records: any[] = [];
    
    // Récupérer les données selon le type de table
    switch (tableName) {
      case 'teachers':
        records = await Promise.resolve(teacherService.getTeachers());
        break;
      case 'teacher_workloads':
        records = academicYear ? await workloadService.getTeacherWorkloads(academicYear) : [];
        break;
      case 'administrative_staff':
        records = await Promise.resolve([]);
        break;
      case 'formation_offers':
        records = academicYear ? await Promise.resolve([]) : [];
        break;
      // Ajouter d'autres tables selon les besoins
      default:
        console.warn(`⚠️ Table non supportée pour l'export: ${tableName}`);
        records = [];
    }
    
    return {
      tableName,
      records,
      metadata: {
        exportDate: new Date(),
        sourceYear: academicYear,
        recordCount: records.length,
        dataVersion: '1.0.0'
      }
    };
  }
  
  /**
   * Génère et télécharge un fichier d'export
   */
  async downloadExportFile(data: any, filename: string, format: ExportFormat): Promise<void> {
    let content: string;
    let mimeType: string;
    let extension: string;
    
    switch (format.format) {
      case 'json':
        content = JSON.stringify(data, null, 2);
        mimeType = 'application/json';
        extension = 'json';
        break;
      case 'csv':
        content = this.convertToCSV(data);
        mimeType = 'text/csv';
        extension = 'csv';
        break;
      case 'excel':
        // Pour Excel, nous utiliserons CSV pour la simplicité
        content = this.convertToCSV(data);
        mimeType = 'application/vnd.ms-excel';
        extension = 'csv';
        break;
      default:
        throw new Error(`Format non supporté: ${format.format}`);
    }
    
    // Créer et télécharger le fichier
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log(`📥 Fichier téléchargé: ${filename}.${extension}`);
  }
  
  // === FONCTIONS D'IMPORT ===
  
  /**
   * Importe des données depuis un fichier
   */
  async importDataFromFile(file: File, options: ImportOptions): Promise<DataMigrationReport> {
    console.log(`📤 Import depuis le fichier: ${file.name}`);
    const startTime = Date.now();
    
    const report: DataMigrationReport = {
      tablesProcessed: [],
      recordsProcessed: 0,
      recordsSkipped: 0,
      errors: [],
      warnings: [],
      executionTime: 0
    };
    
    try {
      const content = await this.readFileContent(file);
      const data = JSON.parse(content);
      
      // Traiter les données selon leur structure
      if (this.isFullDatabaseExport(data)) {
        await this.importFullDatabase(data, options, report);
      } else if (this.isTableDataArray(data)) {
        await this.importTableDataArray(data, options, report);
      } else {
        throw new Error('Format de fichier non reconnu');
      }
      
    } catch (error: any) {
      report.errors.push(`Erreur lors de l'import: ${error.message}`);
    }
    
    report.executionTime = Date.now() - startTime;
    console.log('📊 Rapport d\'import:', report);
    
    return report;
  }
  
  /**
   * Importe les données d'une année vers une autre
   */
  async importDataFromYear(
    sourceYear: string, 
    targetYear: string, 
    tableSelection: string[], 
    options: ImportOptions
  ): Promise<DataMigrationReport> {
    console.log(`🔄 Migration: ${sourceYear} → ${targetYear}`);
    const startTime = Date.now();
    
    const report: DataMigrationReport = {
      tablesProcessed: [],
      recordsProcessed: 0,
      recordsSkipped: 0,
      errors: [],
      warnings: [],
      executionTime: 0
    };
    
    try {
      // Vérifier que l'année cible existe
      const academicYears = await academicYearService.getAcademicYears();
      const targetYearExists = academicYears.some(y => y.year === targetYear);
      
      if (!targetYearExists) {
        throw new Error(`L'année cible ${targetYear} n'existe pas`);
      }
      
      // Exporter les données de l'année source
      const sourceData = await this.exportAcademicYearData(sourceYear, false);
      
      // Importer vers l'année cible
      for (const tableName of tableSelection) {
        if (sourceData[tableName]) {
          await this.importTableToYear(sourceData[tableName], targetYear, options, report);
          report.tablesProcessed.push(tableName);
        }
      }
      
    } catch (error: any) {
      report.errors.push(`Erreur lors de la migration: ${error.message}`);
    }
    
    report.executionTime = Date.now() - startTime;
    return report;
  }
  
  // === MÉTHODES UTILITAIRES ===
  
  private async readFileContent(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  }
  
  private convertToCSV(data: any): string {
    if (Array.isArray(data) && data.length > 0) {
      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => 
          JSON.stringify(row[header] || '')).join(','))
      ].join('\n');
      return csvContent;
    }
    return '';
  }
  
  private isFullDatabaseExport(data: any): boolean {
    return data && 
           typeof data === 'object' && 
           data.metadata && 
           data.permanentData && 
           data.yearlyData;
  }
  
  private isTableDataArray(data: any): boolean {
    return Array.isArray(data) && 
           data.every(item => 
             item.tableName && 
             item.records && 
             item.metadata
           );
  }
  
  private async importFullDatabase(data: FullDatabaseExport, options: ImportOptions, report: DataMigrationReport): Promise<void> {
    // Importer les données permanentes
    for (const [tableName, tableData] of Object.entries(data.permanentData)) {
      await this.importTableData(tableData, options, report);
    }
    
    // Importer les données annuelles
    for (const [year, yearData] of Object.entries(data.yearlyData)) {
      for (const [tableName, tableData] of Object.entries(yearData)) {
        await this.importTableToYear(tableData, year, options, report);
      }
    }
  }
  
  private async importTableDataArray(data: TableData[], options: ImportOptions, report: DataMigrationReport): Promise<void> {
    for (const tableData of data) {
      await this.importTableData(tableData, options, report);
    }
  }
  
  private async importTableData(tableData: TableData, options: ImportOptions, report: DataMigrationReport): Promise<void> {
    const { tableName, records } = tableData;
    
    if (options.dryRun) {
      report.recordsProcessed += records.length;
      report.warnings.push(`Mode test: ${records.length} enregistrements seraient importés dans ${tableName}`);
      return;
    }
    
    // Logique d'import spécifique par table
    try {
      switch (tableName) {
        case 'teachers':
          await this.importTeachers(records, options);
          break;
        case 'administrative_staff':
          await this.importAdministrativeStaff(records, options);
          break;
        // Ajouter d'autres cas selon les besoins
        default:
          report.warnings.push(`Import non implémenté pour la table: ${tableName}`);
          return;
      }
      
      report.recordsProcessed += records.length;
      report.tablesProcessed.push(tableName);
      
    } catch (error: any) {
      report.errors.push(`Erreur lors de l'import de ${tableName}: ${error.message}`);
    }
  }
  
  private async importTableToYear(tableData: TableData, targetYear: string, options: ImportOptions, report: DataMigrationReport): Promise<void> {
    // Adapter les enregistrements pour l'année cible
    const adaptedRecords = tableData.records.map(record => ({
      ...record,
      academicYear: targetYear,
      // Générer de nouveaux IDs si nécessaire
      id: options.overwriteExisting ? record.id : this.generateNewId()
    }));
    
    const adaptedTableData: TableData = {
      ...tableData,
      records: adaptedRecords,
      metadata: {
        ...tableData.metadata,
        sourceYear: targetYear
      }
    };
    
    await this.importTableData(adaptedTableData, options, report);
  }
  
  private async importTeachers(records: any[], options: ImportOptions): Promise<void> {
    // Logique d'import des enseignants
    console.log(`Importation de ${records.length} enseignants`);
  }
  
  private async importAdministrativeStaff(records: any[], options: ImportOptions): Promise<void> {
    // Logique d'import du personnel administratif
    console.log(`Importation de ${records.length} membres du personnel administratif`);
  }
  
  private generateNewId(): string {
    return `import_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  // === TEMPLATES ET VALIDATION ===
  
  /**
   * Génère un template d'import pour une table
   */
  generateImportTemplate(tableName: string): any[] {
    const templates: { [key: string]: any } = {
      teachers: [{
        id: 'template_id',
        firstName: 'Prénom',
        lastName: 'Nom',
        email: 'email@exemple.com',
        // ... autres champs
      }],
      administrative_staff: [{
        id: 'template_id',
        firstName: 'Prénom',
        lastName: 'Nom',
        service: 'Service',
        // ... autres champs
      }]
    };
    
    return templates[tableName] || [];
  }
  
  /**
   * Valide les données avant import
   */
  validateImportData(tableName: string, records: any[]): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Validation générale
    if (!Array.isArray(records)) {
      errors.push('Les données doivent être un tableau');
      return { isValid: false, errors };
    }
    
    // Validations spécifiques par table
    switch (tableName) {
      case 'teachers':
        records.forEach((record, index) => {
          if (!record.firstName || !record.lastName) {
            errors.push(`Ligne ${index + 1}: Prénom et nom requis`);
          }
          if (!record.email || !record.email.includes('@')) {
            errors.push(`Ligne ${index + 1}: Email valide requis`);
          }
        });
        break;
    }
    
    return { isValid: errors.length === 0, errors };
  }
}

export const dataImportExportService = new DataImportExportService();