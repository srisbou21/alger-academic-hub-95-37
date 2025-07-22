
import React from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, TrendingUp, Filter, Users } from "lucide-react";

interface EchelonFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  employeeTypeFilter: string;
  onEmployeeTypeFilterChange: (value: string) => void;
  gradeFilter: string;
  onGradeFilterChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  eligibilityFilter: string;
  onEligibilityFilterChange: (value: string) => void;
  onAnalyze?: () => void;
  onReset?: () => void;
}

export const EchelonFilters: React.FC<EchelonFiltersProps> = ({
  searchTerm,
  onSearchChange,
  employeeTypeFilter,
  onEmployeeTypeFilterChange,
  gradeFilter,
  onGradeFilterChange,
  statusFilter,
  onStatusFilterChange,
  eligibilityFilter,
  onEligibilityFilterChange,
  onAnalyze,
  onReset
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-5 w-5 text-slate-600" />
        <h3 className="text-lg font-semibold">Filtres de Recherche</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher par nom..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={employeeTypeFilter} onValueChange={onEmployeeTypeFilterChange}>
          <SelectTrigger>
            <SelectValue placeholder="Type d'employé" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            <SelectItem value="enseignant">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Personnel Enseignant
              </div>
            </SelectItem>
            <SelectItem value="administratif">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Personnel Administratif
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

        <Select value={gradeFilter} onValueChange={onGradeFilterChange}>
          <SelectTrigger>
            <SelectValue placeholder="Grade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les grades</SelectItem>
            {/* Grades Enseignants */}
            <SelectItem value="Assistant">Assistant</SelectItem>
            <SelectItem value="Maitre Assistant A">Maitre Assistant A</SelectItem>
            <SelectItem value="Maitre Assistant B">Maitre Assistant B</SelectItem>
            <SelectItem value="Maitre de Conférences B">Maitre de Conférences B</SelectItem>
            <SelectItem value="Maitre de Conférences A">Maitre de Conférences A</SelectItem>
            <SelectItem value="Professeur">Professeur</SelectItem>
            {/* Grades Administratifs */}
            <SelectItem value="Attaché">Attaché</SelectItem>
            <SelectItem value="Attaché Principal">Attaché Principal</SelectItem>
            <SelectItem value="Attaché d'Administration">Attaché d'Administration</SelectItem>
            <SelectItem value="Administrateur">Administrateur</SelectItem>
          </SelectContent>
        </Select>

        <Select value={eligibilityFilter} onValueChange={onEligibilityFilterChange}>
          <SelectTrigger>
            <SelectValue placeholder="Éligibilité" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="eligible">Éligibles</SelectItem>
            <SelectItem value="courte">Courte durée (urgent)</SelectItem>
            <SelectItem value="moyenne">Moyenne durée</SelectItem>
            <SelectItem value="longue">Longue durée</SelectItem>
            <SelectItem value="non-eligible">Non éligibles</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger>
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="active">Actif</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="promoted">Récemment promu</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onAnalyze}>
            <TrendingUp className="h-4 w-4 mr-2" />
            Analyser
          </Button>
          <Button variant="outline" onClick={onReset}>
            Réinitialiser
          </Button>
        </div>
      </div>
    </div>
  );
};
