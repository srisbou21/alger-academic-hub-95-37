
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { useSpaces } from "../../hooks/useSpaces";
import { Filter, X, Search } from 'lucide-react';

export const SpaceFilters = () => {
  const spaces = useSpaces();

  const handleFilterChange = (key: string, value: any) => {
    spaces.updateFilters({ [key]: value });
  };

  const activeFiltersCount = Object.values(spaces.filters).filter(value => {
    if (typeof value === 'string') return value !== '';
    if (typeof value === 'number') return value > 0;
    if (Array.isArray(value)) return value.length > 0;
    return false;
  }).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">{activeFiltersCount}</Badge>
            )}
          </CardTitle>
          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="sm" onClick={spaces.clearFilters}>
              <X className="h-4 w-4 mr-1" />
              Effacer
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Type d'espace */}
        <div>
          <label className="text-sm font-medium mb-2 block">Type d'espace</label>
          <Select value={spaces.filters.type} onValueChange={(value) => handleFilterChange('type', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tous les types</SelectItem>
              <SelectItem value="classroom">Salle de cours</SelectItem>
              <SelectItem value="amphitheater">Amphithéâtre</SelectItem>
              <SelectItem value="laboratory">Laboratoire</SelectItem>
              <SelectItem value="computer_room">Salle informatique</SelectItem>
              <SelectItem value="meeting_room">Salle de réunion</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Capacité minimale */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Capacité minimale: {spaces.filters.minCapacity} personnes
          </label>
          <Slider
            value={[spaces.filters.minCapacity]}
            onValueChange={([value]) => handleFilterChange('minCapacity', value)}
            max={200}
            step={5}
            className="w-full"
          />
        </div>

        {/* Bâtiment */}
        <div>
          <label className="text-sm font-medium mb-2 block">Bâtiment</label>
          <Select value={spaces.filters.building} onValueChange={(value) => handleFilterChange('building', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un bâtiment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tous les bâtiments</SelectItem>
              {spaces.buildings.map(building => (
                <SelectItem key={building} value={building}>
                  {building}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Équipements */}
        <div>
          <label className="text-sm font-medium mb-2 block">Équipements</label>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {spaces.equipment.map(eq => (
              <div key={eq} className="flex items-center space-x-2">
                <Checkbox
                  id={eq}
                  checked={spaces.filters.equipment.includes(eq)}
                  onCheckedChange={(checked) => {
                    const newEquipment = checked
                      ? [...spaces.filters.equipment, eq]
                      : spaces.filters.equipment.filter(e => e !== eq);
                    handleFilterChange('equipment', newEquipment);
                  }}
                />
                <label htmlFor={eq} className="text-sm">
                  {eq}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Statistiques */}
        <div className="pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            <p>{spaces.spaces.length} espace(s) trouvé(s)</p>
            <p>sur {spaces.allSpaces.length} au total</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
