
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, X } from "lucide-react";

interface FormationSearchFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  diplomaTypeFilter: string;
  onDiplomaTypeChange: (value: string) => void;
  modalityFilter: string;
  onModalityChange: (value: string) => void;
  yearFilter: string;
  onYearChange: (value: string) => void;
  onResetFilters: () => void;
  activeFiltersCount: number;
}

export const FormationSearchFilters = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  diplomaTypeFilter,
  onDiplomaTypeChange,
  modalityFilter,
  onModalityChange,
  yearFilter,
  onYearChange,
  onResetFilters,
  activeFiltersCount
}: FormationSearchFiltersProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher une formation..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            {activeFiltersCount > 0 && (
              <Button variant="outline" onClick={onResetFilters}>
                <X className="h-4 w-4 mr-2" />
                Réinitialiser ({activeFiltersCount})
              </Button>
            )}
          </div>
          
          <div className="flex gap-4 items-center">
            <Filter className="h-4 w-4 text-muted-foreground" />
            
            <Select value={statusFilter} onValueChange={onStatusChange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous statuts</SelectItem>
                <SelectItem value="draft">Brouillon</SelectItem>
                <SelectItem value="validation">En validation</SelectItem>
                <SelectItem value="validated">Validée</SelectItem>
                <SelectItem value="archived">Archivée</SelectItem>
              </SelectContent>
            </Select>

            <Select value={diplomaTypeFilter} onValueChange={onDiplomaTypeChange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous types</SelectItem>
                <SelectItem value="licence">Licence</SelectItem>
                <SelectItem value="master">Master</SelectItem>
                <SelectItem value="doctorat">Doctorat</SelectItem>
              </SelectContent>
            </Select>

            <Select value={modalityFilter} onValueChange={onModalityChange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Modalité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes modalités</SelectItem>
                <SelectItem value="presential">Présentiel</SelectItem>
                <SelectItem value="distance">À distance</SelectItem>
                <SelectItem value="hybrid">Hybride</SelectItem>
              </SelectContent>
            </Select>

            <Select value={yearFilter} onValueChange={onYearChange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Année" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes années</SelectItem>
                <SelectItem value="2024-2025">2024-2025</SelectItem>
                <SelectItem value="2023-2024">2023-2024</SelectItem>
                <SelectItem value="2022-2023">2022-2023</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
