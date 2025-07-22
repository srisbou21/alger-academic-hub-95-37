
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, TrendingUp, Clock, Award, AlertTriangle, Search, Filter, FileSpreadsheet, Download, UserCheck, GraduationCap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Employee {
  id: string;
  name: string;
  title: string;
  department: string;
  currentEchelon: number;
  maxEchelon: number;
  advancementDuration: 'Rapide (30 mois)' | 'Standard (36 mois)' | 'Lente (42 mois)';
  nextEligibilityDate: string;
  lastPromotion: string;
  progressPercentage: number;
  status: 'Excellent' | 'Satisfaisant' | 'En attente';
  isEligible: boolean;
  salary: number;
  employeeType: 'enseignant' | 'administratif';
  grade: string;
}

const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'Dr. Ahmed Benali',
    title: 'Maitre de Conférences A - Enseignant',
    department: 'Informatique',
    currentEchelon: 3,
    maxEchelon: 12,
    advancementDuration: 'Rapide (30 mois)',
    nextEligibilityDate: '15/01/2024',
    lastPromotion: '15/01/2021',
    progressPercentage: 100,
    status: 'Excellent',
    isEligible: true,
    salary: 85000,
    employeeType: 'enseignant',
    grade: 'Maitre de Conférences A'
  },
  {
    id: '2',
    name: 'Mme. Fatima Khelifi',
    title: 'Attaché Principal - Administratif',
    department: 'Administration',
    currentEchelon: 5,
    maxEchelon: 10,
    advancementDuration: 'Standard (36 mois)',
    nextEligibilityDate: '20/03/2024',
    lastPromotion: '20/03/2021',
    progressPercentage: 85,
    status: 'Satisfaisant',
    isEligible: true,
    salary: 65000,
    employeeType: 'administratif',
    grade: 'Attaché Principal'
  },
  {
    id: '3',
    name: 'Dr. Mohamed Saidi',
    title: 'Professeur - Enseignant',
    department: 'Mathématiques',
    currentEchelon: 8,
    maxEchelon: 12,
    advancementDuration: 'Lente (42 mois)',
    nextEligibilityDate: '10/06/2025',
    lastPromotion: '10/06/2021',
    progressPercentage: 60,
    status: 'En attente',
    isEligible: false,
    salary: 120000,
    employeeType: 'enseignant',
    grade: 'Professeur'
  },
  {
    id: '4',
    name: 'M. Karim Boudjemaa',
    title: 'Administrateur - Administratif',
    department: 'Scolarité',
    currentEchelon: 7,
    maxEchelon: 12,
    advancementDuration: 'Rapide (30 mois)',
    nextEligibilityDate: '05/09/2024',
    lastPromotion: '05/09/2021',
    progressPercentage: 100,
    status: 'Excellent',
    isEligible: true,
    salary: 78000,
    employeeType: 'administratif',
    grade: 'Administrateur'
  },
  {
    id: '5',
    name: 'Dr. Amina Cherifi',
    title: 'Maitre Assistant A - Enseignant',
    department: 'Physique',
    currentEchelon: 4,
    maxEchelon: 10,
    advancementDuration: 'Standard (36 mois)',
    nextEligibilityDate: '12/11/2024',
    lastPromotion: '12/11/2020',
    progressPercentage: 95,
    status: 'Excellent',
    isEligible: true,
    salary: 72000,
    employeeType: 'enseignant',
    grade: 'Maitre Assistant A'
  }
];

export const AutomaticEchelonTracking: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'suivi' | 'promotions' | 'statistiques'>('suivi');
  const [searchTerm, setSearchTerm] = useState('');
  const [employeeTypeFilter, setEmployeeTypeFilter] = useState('all');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [eligibilityFilter, setEligibilityFilter] = useState('all');
  const [durationFilter, setDurationFilter] = useState('all');
  const { toast } = useToast();

  // Fonction pour déterminer la catégorie de durée selon les règles de la commission
  const getDurationCategory = (employee: Employee) => {
    const lastPromotionDate = new Date(employee.lastPromotion.split('/').reverse().join('-'));
    const today = new Date();
    const monthsDiff = (today.getFullYear() - lastPromotionDate.getFullYear()) * 12 + 
                      (today.getMonth() - lastPromotionDate.getMonth());
    
    if (employee.advancementDuration === 'Rapide (30 mois)') {
      if (monthsDiff >= 30) return 'courte'; // Éligible maintenant
      if (monthsDiff >= 24) return 'moyenne'; // Bientôt éligible
      return 'longue'; // Pas encore éligible
    } else if (employee.advancementDuration === 'Standard (36 mois)') {
      if (monthsDiff >= 36) return 'courte';
      if (monthsDiff >= 30) return 'moyenne';
      return 'longue';
    } else { // Lente (42 mois)
      if (monthsDiff >= 42) return 'courte';
      if (monthsDiff >= 36) return 'moyenne';
      return 'longue';
    }
  };

  // Filtrage des employés avec le nouveau filtre de durée
  const filteredEmployees = mockEmployees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = employeeTypeFilter === 'all' || employee.employeeType === employeeTypeFilter;
    const matchesGrade = gradeFilter === 'all' || employee.grade === gradeFilter;
    const matchesEligibility = eligibilityFilter === 'all' || 
      (eligibilityFilter === 'eligible' && employee.isEligible) ||
      (eligibilityFilter === 'non-eligible' && !employee.isEligible);
    
    const durationCategory = getDurationCategory(employee);
    const matchesDuration = durationFilter === 'all' || durationCategory === durationFilter;
    
    return matchesSearch && matchesType && matchesGrade && matchesEligibility && matchesDuration;
  });

  // Statistiques calculées
  const stats = {
    promotionsEnAttente: filteredEmployees.filter(e => e.isEligible).length,
    enseignantsSuivis: filteredEmployees.filter(e => e.employeeType === 'enseignant').length,
    personnelAdministratif: filteredEmployees.filter(e => e.employeeType === 'administratif').length,
    echelonMoyen: Math.round(filteredEmployees.reduce((sum, e) => sum + e.currentEchelon, 0) / filteredEmployees.length) || 0
  };

  const handlePromote = (employeeId: string) => {
    console.log(`Promoting employee ${employeeId}`);
    toast({
      title: "Promotion initiée",
      description: "La demande de promotion a été transmise à la commission.",
      duration: 3000
    });
  };

  const exportCommissionReport = (category: 'all' | 'courte' | 'moyenne' | 'longue' = 'all') => {
    let dataToExport = filteredEmployees;
    let categoryLabel = 'tous';

    if (category !== 'all') {
      dataToExport = filteredEmployees.filter(employee => getDurationCategory(employee) === category);
      categoryLabel = category === 'courte' ? 'courte_duree' : 
                    category === 'moyenne' ? 'moyenne_duree' : 'longue_duree';
    }

    // En-tête CSV avec tous les détails pour la commission
    const csvHeader = [
      'N° Dossier',
      'Nom et Prénom',
      'Type Personnel',
      'Grade',
      'Département/Faculté',
      'Échelon Actuel',
      'Échelon Proposé',
      'Date Dernier Échelon Obtenu',
      'Durée d\'Avancement',
      'Mois Écoulés',
      'Catégorie Commission',
      'Statut Éligibilité',
      'Prochaine Date Éligibilité',
      'Salaire Actuel (DA)',
      'Nouveau Salaire Estimé (DA)',
      'Augmentation (DA)',
      'Pourcentage Augmentation',
      'Statut Performance',
      'Priorité Commission',
      'Recommandation',
      'Observations'
    ].join(';');

    const csvRows = dataToExport.map((employee, index) => {
      const lastPromotionDate = new Date(employee.lastPromotion.split('/').reverse().join('-'));
      const today = new Date();
      const monthsElapsed = (today.getFullYear() - lastPromotionDate.getFullYear()) * 12 + 
                           (today.getMonth() - lastPromotionDate.getMonth());
      
      const durationCategory = getDurationCategory(employee);
      const categoryLabels = {
        'courte': 'Courte durée (Urgent)',
        'moyenne': 'Moyenne durée (Standard)',
        'longue': 'Longue durée (Préparation)'
      };

      const estimatedNewSalary = Math.round(employee.salary * 1.12); // Estimation 12% d'augmentation
      const salaryIncrease = estimatedNewSalary - employee.salary;
      const increasePercentage = ((salaryIncrease / employee.salary) * 100).toFixed(1);

      const priority = durationCategory === 'courte' ? 'HAUTE' : 
                      durationCategory === 'moyenne' ? 'MOYENNE' : 'NORMALE';

      const recommendation = employee.isEligible ? 
        (durationCategory === 'courte' ? 'Promotion immédiate recommandée' :
         durationCategory === 'moyenne' ? 'Promotion dans les 6 mois' :
         'Préparation pour prochaine session') :
        'En attente de critères requis';

      const observations = employee.isEligible ?
        `Critères remplis - ${employee.status} - ${monthsElapsed} mois d'ancienneté` :
        `En cours - ${employee.status} - Prochaine éligibilité: ${employee.nextEligibilityDate}`;

      return [
        `"ECH-${(index + 1).toString().padStart(4, '0')}"`,
        `"${employee.name}"`,
        `"${employee.employeeType === 'enseignant' ? 'Personnel Enseignant' : 'Personnel Administratif'}"`,
        `"${employee.grade}"`,
        `"${employee.department}"`,
        employee.currentEchelon,
        employee.currentEchelon + 1,
        `"${employee.lastPromotion}"`,
        `"${employee.advancementDuration}"`,
        monthsElapsed,
        `"${categoryLabels[durationCategory]}"`,
        employee.isEligible ? '"Éligible"' : '"Non éligible"',
        `"${employee.nextEligibilityDate}"`,
        employee.salary.toLocaleString('fr-FR'),
        estimatedNewSalary.toLocaleString('fr-FR'),
        salaryIncrease.toLocaleString('fr-FR'),
        `"${increasePercentage}%"`,
        `"${employee.status}"`,
        `"${priority}"`,
        `"${recommendation}"`,
        `"${observations}"`
      ].join(';');
    });

    const csvContent = [csvHeader, ...csvRows].join('\n');
    const filename = `rapport_commission_echelons_${categoryLabel}_${new Date().toISOString().split('T')[0]}.csv`;
    
    // Téléchargement avec BOM pour Excel
    const BOM = '\uFEFF';
    const csvWithBOM = BOM + csvContent;
    const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Export Commission Réussi",
      description: `Rapport détaillé pour ${dataToExport.length} employés (${categoryLabel}) exporté avec succès`,
      duration: 4000
    });
  };

  const exportToExcel = (type: 'all' | 'eligible' | 'commission') => {
    let data: Employee[] = [];
    let filename = '';

    switch (type) {
      case 'all':
        data = filteredEmployees;
        filename = `tous_echelons_${new Date().toISOString().split('T')[0]}.csv`;
        break;
      case 'eligible':
        data = filteredEmployees.filter(e => e.isEligible);
        filename = `employes_eligibles_${new Date().toISOString().split('T')[0]}.csv`;
        break;
      case 'commission':
        exportCommissionReport('all');
        return;
    }

    // Création du contenu CSV
    const csvHeader = [
      'Nom',
      'Type',
      'Grade',
      'Échelon Actuel',
      'Département',
      'Durée Avancement',
      'Prochaine Éligibilité',
      'Statut',
      'Salaire (DA)',
      'Éligible'
    ].join(';');

    const csvRows = data.map(employee => [
      `"${employee.name}"`,
      `"${employee.employeeType === 'enseignant' ? 'Personnel Enseignant' : 'Personnel Administratif'}"`,
      `"${employee.grade}"`,
      employee.currentEchelon,
      `"${employee.department}"`,
      `"${employee.advancementDuration}"`,
      `"${employee.nextEligibilityDate}"`,
      `"${employee.status}"`,
      employee.salary.toLocaleString('fr-FR'),
      employee.isEligible ? 'Oui' : 'Non'
    ].join(';'));

    const csvContent = [csvHeader, ...csvRows].join('\n');
    
    // Téléchargement du fichier
    const BOM = '\uFEFF';
    const csvWithBOM = BOM + csvContent;
    const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Export Excel réussi",
      description: `${data.length} employés exportés vers ${filename}`,
      duration: 3000
    });
  };

  const resetFilters = () => {
    setSearchTerm('');
    setEmployeeTypeFilter('all');
    setGradeFilter('all');
    setEligibilityFilter('all');
    setDurationFilter('all');
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec titre et indicateur système */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-slate-800">Système de Suivi Automatique des Échelons</h2>
          </div>
          <p className="text-slate-600">Suivi automatisé des promotions d'échelons pour les enseignants et le personnel administratif</p>
        </div>
        <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 px-3 py-2 rounded-lg">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <span className="text-sm font-medium text-yellow-800">Système Automatique Actif</span>
        </div>
      </div>

      {/* Filtres de recherche améliorés */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres de Recherche Avancés
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher par nom..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={employeeTypeFilter} onValueChange={setEmployeeTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Type d'employé" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="enseignant">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Personnel Enseignant
                  </div>
                </SelectItem>
                <SelectItem value="administratif">
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4" />
                    Personnel Administratif
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            <Select value={gradeFilter} onValueChange={setGradeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les grades</SelectItem>
                <SelectItem value="Assistant">Assistant</SelectItem>
                <SelectItem value="Maitre Assistant A">Maitre Assistant A</SelectItem>
                <SelectItem value="Maitre Assistant B">Maitre Assistant B</SelectItem>
                <SelectItem value="Maitre de Conférences A">Maitre de Conférences A</SelectItem>
                <SelectItem value="Maitre de Conférences B">Maitre de Conférences B</SelectItem>
                <SelectItem value="Professeur">Professeur</SelectItem>
                <SelectItem value="Attaché">Attaché</SelectItem>
                <SelectItem value="Attaché Principal">Attaché Principal</SelectItem>
                <SelectItem value="Administrateur">Administrateur</SelectItem>
              </SelectContent>
            </Select>

            <Select value={durationFilter} onValueChange={setDurationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Catégorie Commission" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes catégories</SelectItem>
                <SelectItem value="courte">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    Courte durée (Urgent)
                  </div>
                </SelectItem>
                <SelectItem value="moyenne">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    Moyenne durée (Standard)
                  </div>
                </SelectItem>
                <SelectItem value="longue">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Longue durée (Préparation)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            <Select value={eligibilityFilter} onValueChange={setEligibilityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Éligibilité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="eligible">Éligibles</SelectItem>
                <SelectItem value="non-eligible">Non éligibles</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={resetFilters}>
              Réinitialiser
            </Button>
          </div>

          {/* Boutons d'export améliorés pour la commission */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-sm font-medium text-slate-700">Exports Standards :</h3>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button 
                onClick={() => exportToExcel('all')}
                className="bg-green-600 hover:bg-green-700"
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Export Complet ({filteredEmployees.length})
              </Button>

              <Button 
                onClick={() => exportToExcel('eligible')}
                className="bg-blue-600 hover:bg-blue-700"
                disabled={filteredEmployees.filter(e => e.isEligible).length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Éligibles Seulement ({filteredEmployees.filter(e => e.isEligible).length})
              </Button>
            </div>

            <div className="flex items-center gap-2 mb-2 mt-4">
              <h3 className="text-sm font-medium text-slate-700">Rapports Commission des Échelons :</h3>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button 
                onClick={() => exportCommissionReport('all')}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Rapport Commission Complet ({filteredEmployees.length})
              </Button>

              <Button 
                onClick={() => exportCommissionReport('courte')}
                className="bg-red-600 hover:bg-red-700"
                disabled={filteredEmployees.filter(e => getDurationCategory(e) === 'courte').length === 0}
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Courte Durée ({filteredEmployees.filter(e => getDurationCategory(e) === 'courte').length})
              </Button>

              <Button 
                onClick={() => exportCommissionReport('moyenne')}
                className="bg-yellow-600 hover:bg-yellow-700"
                disabled={filteredEmployees.filter(e => getDurationCategory(e) === 'moyenne').length === 0}
              >
                <Clock className="h-4 w-4 mr-2" />
                Moyenne Durée ({filteredEmployees.filter(e => getDurationCategory(e) === 'moyenne').length})
              </Button>

              <Button 
                onClick={() => exportCommissionReport('longue')}
                className="bg-green-600 hover:bg-green-700"
                disabled={filteredEmployees.filter(e => getDurationCategory(e) === 'longue').length === 0}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Longue Durée ({filteredEmployees.filter(e => getDurationCategory(e) === 'longue').length})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-red-600 mb-1">{stats.promotionsEnAttente}</div>
            <div className="text-sm text-red-800">Promotions en attente</div>
          </CardContent>
        </Card>
        
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">{stats.enseignantsSuivis}</div>
            <div className="text-sm text-blue-800">Enseignants suivis</div>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">{stats.personnelAdministratif}</div>
            <div className="text-sm text-green-800">Personnel administratif</div>
          </CardContent>
        </Card>
        
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-1">{stats.echelonMoyen}</div>
            <div className="text-sm text-purple-800">Échelon moyen</div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation par onglets */}
      <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
        <Button
          variant={selectedTab === 'suivi' ? 'default' : 'ghost'}
          onClick={() => setSelectedTab('suivi')}
          className="flex-1"
        >
          Suivi Échelons
        </Button>
        <Button
          variant={selectedTab === 'promotions' ? 'default' : 'ghost'}
          onClick={() => setSelectedTab('promotions')}
          className="flex-1"
        >
          Promotions Automatiques
        </Button>
        <Button
          variant={selectedTab === 'statistiques' ? 'default' : 'ghost'}
          onClick={() => setSelectedTab('statistiques')}
          className="flex-1"
        >
          Statistiques
        </Button>
      </div>

      {/* Section Suivi Individual des Échelons */}
      {selectedTab === 'suivi' && (
        <Card>
          <CardHeader>
            <CardTitle>Suivi Individual des Échelons ({filteredEmployees.length} employés)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredEmployees.map((employee) => {
                const durationCategory = getDurationCategory(employee);
                const categoryColors = {
                  'courte': 'bg-red-100 text-red-800',
                  'moyenne': 'bg-yellow-100 text-yellow-800',
                  'longue': 'bg-green-100 text-green-800'
                };
                const categoryLabels = {
                  'courte': 'Courte durée',
                  'moyenne': 'Moyenne durée',
                  'longue': 'Longue durée'
                };

                return (
                  <div key={employee.id} className="border rounded-lg p-6 bg-white">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800">{employee.name}</h3>
                        <p className="text-sm text-slate-600">{employee.title}</p>
                        <p className="text-sm text-slate-500">{employee.department}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {employee.employeeType === 'enseignant' ? (
                            <GraduationCap className="h-4 w-4 text-blue-600" />
                          ) : (
                            <UserCheck className="h-4 w-4 text-green-600" />
                          )}
                          <span className="text-xs text-slate-600">
                            {employee.employeeType === 'enseignant' ? 'Personnel Enseignant' : 'Personnel Administratif'}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Badge className="bg-green-100 text-green-800">
                          {employee.status}
                        </Badge>
                        <Badge className={categoryColors[durationCategory]}>
                          {categoryLabels[durationCategory]}
                        </Badge>
                        {employee.isEligible && (
                          <Badge className="bg-red-100 text-red-800">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Éligible
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-slate-700">Échelon Actuel</p>
                        <p className="text-lg font-bold text-slate-800">{employee.currentEchelon} / {employee.maxEchelon}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-700">Durée d'Avancement</p>
                        <p className="text-sm text-blue-600">{employee.advancementDuration}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-700">Prochaine Éligibilité</p>
                        <p className="text-sm text-slate-800">{employee.nextEligibilityDate}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700">Progression vers prochaine promotion</span>
                        <span className="text-sm font-bold text-blue-600">{employee.progressPercentage}%</span>
                      </div>
                      <Progress value={employee.progressPercentage} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-slate-600">
                        Dernière promotion: {employee.lastPromotion}
                      </div>
                      {employee.isEligible && (
                        <Button 
                          onClick={() => handlePromote(employee.id)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Award className="h-4 w-4 mr-2" />
                          Promouvoir
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}

              {filteredEmployees.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-slate-500">Aucun employé trouvé avec les filtres sélectionnés</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Section Promotions Automatiques */}
      {selectedTab === 'promotions' && (
        <Card>
          <CardHeader>
            <CardTitle>Système de Promotions Automatiques</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <TrendingUp className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-500">Fonctionnalité de promotions automatiques en développement</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Section Statistiques */}
      {selectedTab === 'statistiques' && (
        <Card>
          <CardHeader>
            <CardTitle>Statistiques Détaillées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-500">Statistiques détaillées en développement</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
