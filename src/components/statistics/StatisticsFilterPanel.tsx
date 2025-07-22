
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, Download, RefreshCw, TrendingUp } from "lucide-react";

interface StatisticsFilterPanelProps {
  selectedYear: string;
  selectedDepartment: string;
  selectedLevel: string;
  selectedFormation: string;
  onYearChange: (year: string) => void;
  onDepartmentChange: (dept: string) => void;
  onLevelChange: (level: string) => void;
  onFormationChange: (formation: string) => void;
  onApplyFilters: () => void;
  onExportData: () => void;
  totalRecords: number;
}

export const StatisticsFilterPanel = ({
  selectedYear,
  selectedDepartment,
  selectedLevel,
  selectedFormation,
  onYearChange,
  onDepartmentChange,
  onLevelChange,
  onFormationChange,
  onApplyFilters,
  onExportData,
  totalRecords
}: StatisticsFilterPanelProps) => {
  const formations = {
    'Économie': ['Économie Générale', 'Économie Internationale', 'Économie du Développement'],
    'Gestion': ['Gestion des Entreprises', 'Comptabilité', 'Finance d\'Entreprise', 'GRH'],
    'Commerce': ['Marketing', 'Commerce International', 'E-Commerce']
  };

  const getFormationOptions = () => {
    if (selectedDepartment === 'all') return [];
    return formations[selectedDepartment as keyof typeof formations] || [];
  };

  return (
    <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-blue-600" />
            Filtres Statistiques Avancés
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <TrendingUp className="h-3 w-3 mr-1" />
              {totalRecords} Enregistrements
            </Badge>
            <Button size="sm" variant="outline" onClick={onExportData}>
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-700">
              Année Universitaire
            </label>
            <Select value={selectedYear} onValueChange={onYearChange}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Sélectionner l'année" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les années</SelectItem>
                <SelectItem value="2024-2025">2024-2025</SelectItem>
                <SelectItem value="2023-2024">2023-2024</SelectItem>
                <SelectItem value="2022-2023">2022-2023</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-slate-700">
              Département
            </label>
            <Select value={selectedDepartment} onValueChange={onDepartmentChange}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Sélectionner le département" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les départements</SelectItem>
                <SelectItem value="Économie">Sciences Économiques</SelectItem>
                <SelectItem value="Gestion">Sciences de Gestion</SelectItem>
                <SelectItem value="Commerce">Sciences Commerciales</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-slate-700">
              Niveau d'Étude
            </label>
            <Select value={selectedLevel} onValueChange={onLevelChange}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Sélectionner le niveau" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les niveaux</SelectItem>
                <SelectItem value="L1">Licence 1ère année</SelectItem>
                <SelectItem value="L2">Licence 2ème année</SelectItem>
                <SelectItem value="L3">Licence 3ème année</SelectItem>
                <SelectItem value="M1">Master 1ère année</SelectItem>
                <SelectItem value="M2">Master 2ème année</SelectItem>
                <SelectItem value="D">Doctorat</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-slate-700">
              Offre de Formation
            </label>
            <Select 
              value={selectedFormation} 
              onValueChange={onFormationChange}
              disabled={selectedDepartment === 'all'}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Sélectionner la formation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les formations</SelectItem>
                {getFormationOptions().map((formation) => (
                  <SelectItem key={formation} value={formation}>
                    {formation}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-center">
          <Button onClick={onApplyFilters} className="bg-blue-600 hover:bg-blue-700">
            <RefreshCw className="h-4 w-4 mr-2" />
            Appliquer les Filtres
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
