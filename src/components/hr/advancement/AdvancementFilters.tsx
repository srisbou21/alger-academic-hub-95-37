
import React from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { ECHELON_RANGE } from "../../../types/advancement";

interface AdvancementFiltersProps {
  searchTerm: string;
  statusFilter: string;
  echelonFilter: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onEchelonChange: (value: string) => void;
  onReset: () => void;
}

export const AdvancementFilters: React.FC<AdvancementFiltersProps> = ({
  searchTerm,
  statusFilter,
  echelonFilter,
  onSearchChange,
  onStatusChange,
  onEchelonChange,
  onReset
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Rechercher un employé..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select value={statusFilter || "all"} onValueChange={onStatusChange}>
        <SelectTrigger>
          <SelectValue placeholder="Filtrer par statut" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les statuts</SelectItem>
          <SelectItem value="eligible">Éligible</SelectItem>
          <SelectItem value="pending">En attente</SelectItem>
          <SelectItem value="suspended">Suspendu</SelectItem>
          <SelectItem value="blocked">Bloqué</SelectItem>
        </SelectContent>
      </Select>
      <Select value={echelonFilter || "all"} onValueChange={onEchelonChange}>
        <SelectTrigger>
          <SelectValue placeholder="Filtrer par échelon" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les échelons</SelectItem>
          {Array.from({ length: ECHELON_RANGE.MAX }, (_, i) => i + 1).map(echelon => (
            <SelectItem key={echelon} value={echelon.toString()}>
              Échelon {echelon}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button variant="outline" onClick={onReset}>
        <Filter className="h-4 w-4 mr-2" />
        Réinitialiser
      </Button>
    </div>
  );
};
