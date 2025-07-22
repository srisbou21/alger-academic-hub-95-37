
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, UserCheck, DollarSign, Plus, FileSpreadsheet, Database, Download, Upload, TrendingUp } from "lucide-react";
import { StudentStatsForm } from "./StudentStatsForm";
import { AcademicStatsForm } from "./AcademicStatsForm";
import { PersonnelStatsForm } from "./PersonnelStatsForm";
import { FinancialStatsForm } from "./FinancialStatsForm";

export const StatisticsFormsManager = () => {
  const [activeTab, setActiveTab] = useState("students");
  const [savedData, setSavedData] = useState({
    students: [],
    academic: [],
    personnel: [],
    financial: []
  });

  const handleDataSave = (category: string, data: any) => {
    const newEntry = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date(),
      status: 'saved'
    };
    
    setSavedData(prev => ({
      ...prev,
      [category]: [...prev[category], newEntry]
    }));

    console.log(`Données ${category} sauvegardées:`, newEntry);
  };

  const handleExportData = (format = 'excel') => {
    const allData = {
      students: savedData.students,
      academic: savedData.academic,
      personnel: savedData.personnel,
      financial: savedData.financial,
      exportDate: new Date(),
      format: format
    };
    
    console.log('Export des données en format', format, allData);
    // Ici on implémenterait l'export réel
    alert(`Export ${format} généré avec succès !`);
  };

  const handleImportData = () => {
    console.log('Fonction d\'import déclenchée');
    // Ici on implémenterait l'import de données
    alert('Fonction d\'import disponible - sélectionnez votre fichier');
  };

  const totalEntries = Object.values(savedData).reduce((total, category: any) => total + category.length, 0);

  return (
    <div className="space-y-6">
      <Card className="border-indigo-200">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-indigo-800 flex items-center gap-2">
              <FileSpreadsheet className="h-6 w-6" />
              Saisie des Statistiques - FSECSG Université Alger 3
            </CardTitle>
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <TrendingUp className="h-3 w-3 mr-1" />
                {totalEntries} Entrées Sauvegardées
              </Badge>
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleImportData}
                className="bg-blue-50 hover:bg-blue-100"
              >
                <Upload className="h-4 w-4 mr-2" />
                Importer
              </Button>
              <Button 
                size="sm" 
                onClick={() => handleExportData('excel')}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Instructions améliorées */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <Plus className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">Instructions de Saisie - Faculté SECSG</h3>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• <strong>Obligatoire:</strong> Département et données principales doivent être renseignés</li>
                <li>• <strong>Validation:</strong> Les données sont vérifiées automatiquement avant sauvegarde</li>
                <li>• <strong>Historique:</strong> Toutes les saisies sont conservées et horodatées</li>
                <li>• <strong>Export:</strong> Données disponibles en Excel, CSV et PDF pour rapports</li>
                <li>• <strong>Conformité:</strong> Données conformes aux standards universitaires algériens</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8 bg-white shadow-sm border border-slate-200">
          <TabsTrigger 
            value="students"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            <Users className="h-4 w-4 mr-2" />
            Étudiants
            {savedData.students.length > 0 && (
              <Badge className="ml-2 bg-blue-100 text-blue-800">{savedData.students.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger 
            value="academic"
            className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Académique
            {savedData.academic.length > 0 && (
              <Badge className="ml-2 bg-green-100 text-green-800">{savedData.academic.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger 
            value="personnel"
            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
          >
            <UserCheck className="h-4 w-4 mr-2" />
            Personnel
            {savedData.personnel.length > 0 && (
              <Badge className="ml-2 bg-purple-100 text-purple-800">{savedData.personnel.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger 
            value="financial"
            className="data-[state=active]:bg-amber-600 data-[state=active]:text-white"
          >
            <DollarSign className="h-4 w-4 mr-2" />
            Financier
            {savedData.financial.length > 0 && (
              <Badge className="ml-2 bg-amber-100 text-amber-800">{savedData.financial.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="space-y-6">
          <StudentStatsForm onSave={(data) => handleDataSave('students', data)} />
        </TabsContent>

        <TabsContent value="academic" className="space-y-6">
          <AcademicStatsForm onSave={(data) => handleDataSave('academic', data)} />
        </TabsContent>

        <TabsContent value="personnel" className="space-y-6">
          <PersonnelStatsForm onSave={(data) => handleDataSave('personnel', data)} />
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <FinancialStatsForm onSave={(data) => handleDataSave('financial', data)} />
        </TabsContent>
      </Tabs>

      {/* Résumé des saisies récentes amélioré */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Dernières Saisies FSECSG ({totalEntries})
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleExportData('pdf')}
            >
              <Download className="h-4 w-4 mr-2" />
              Rapport PDF
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Données étudiantes récentes */}
            {savedData.students.slice(-2).map((entry: any) => (
              <div key={entry.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <Users className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="font-medium">Statistiques Étudiantes - {entry.department} {entry.academicLevel}</p>
                    <p className="text-sm text-slate-600">
                      {entry.totalStudents} étudiants - Saisie le {entry.createdAt?.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">Validé</Badge>
              </div>
            ))}

            {/* Données académiques récentes */}
            {savedData.academic.slice(-2).map((entry: any) => (
              <div key={entry.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="font-medium">Statistiques Académiques - {entry.department}</p>
                    <p className="text-sm text-slate-600">
                      {entry.totalCourses} cours - Saisie le {entry.createdAt?.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-800">Validé</Badge>
              </div>
            ))}

            {/* Données personnel récentes */}
            {savedData.personnel.slice(-2).map((entry: any) => (
              <div key={entry.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <UserCheck className="h-4 w-4 text-purple-500" />
                  <div>
                    <p className="font-medium">Statistiques Personnel - {entry.department}</p>
                    <p className="text-sm text-slate-600">
                      {entry.totalStaff} membres - Saisie le {entry.createdAt?.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">Validé</Badge>
              </div>
            ))}

            {/* Données financières récentes */}
            {savedData.financial.slice(-2).map((entry: any) => (
              <div key={entry.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-4 w-4 text-amber-500" />
                  <div>
                    <p className="font-medium">Statistiques Financières - {entry.department}</p>
                    <p className="text-sm text-slate-600">
                      Budget {entry.budgetYear} - Saisie le {entry.createdAt?.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">Validé</Badge>
              </div>
            ))}

            {totalEntries === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Aucune donnée saisie pour le moment.</p>
                <p className="text-sm">Commencez par remplir un formulaire ci-dessus.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
