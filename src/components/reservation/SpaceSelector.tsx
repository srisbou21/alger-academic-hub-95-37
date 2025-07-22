
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { useSpaces } from "../../hooks/useSpaces";
import { Space } from "../../types/reservation";
import { Building2, Users, MapPin, Search, Filter, Star, Wifi, Car, Coffee, Monitor, Projector } from 'lucide-react';

interface SpaceSelectorProps {
  spaces: ReturnType<typeof useSpaces>;
  onSpaceSelect: (space: Space) => void;
}

const getEquipmentIcon = (equipment: string) => {
  switch (equipment.toLowerCase()) {
    case 'wifi': return <Wifi className="h-3 w-3" />;
    case 'projecteur': return <Projector className="h-3 w-3" />;
    case 'écran': return <Monitor className="h-3 w-3" />;
    default: return <Star className="h-3 w-3" />;
  }
};

const getSpaceTypeLabel = (type: string) => {
  switch (type) {
    case 'classroom': return 'Salle de classe';
    case 'amphitheater': return 'Amphithéâtre';
    case 'laboratory': return 'Laboratoire';
    case 'computer_room': return 'Salle informatique';
    case 'meeting_room': return 'Salle de réunion';
    default: return type;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'available': return 'bg-green-100 text-green-800 border-green-200';
    case 'occupied': return 'bg-red-100 text-red-800 border-red-200';
    case 'maintenance': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'reserved_free': return 'bg-blue-100 text-blue-800 border-blue-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'available': return 'Disponible';
    case 'occupied': return 'Occupé';
    case 'maintenance': return 'Maintenance';
    case 'reserved_free': return 'Réservé libre';
    case 'out_of_service': return 'Hors service';
    case 'cleaning': return 'Nettoyage';
    default: return status;
  }
};

export const SpaceSelector: React.FC<SpaceSelectorProps> = ({ spaces, onSpaceSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredSpaces = spaces.spaces.filter(space =>
    space.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    space.location.building.toLowerCase().includes(searchTerm.toLowerCase()) ||
    space.location.room.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Rechercher un espace..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filtres
            </Button>
          </div>

          {showFilters && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Type Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Type d'espace</label>
                  <Select value={spaces.filters.type} onValueChange={(value) => spaces.updateFilters({ type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tous les types</SelectItem>
                      <SelectItem value="classroom">Salle de classe</SelectItem>
                      <SelectItem value="amphitheater">Amphithéâtre</SelectItem>
                      <SelectItem value="laboratory">Laboratoire</SelectItem>
                      <SelectItem value="computer_room">Salle informatique</SelectItem>
                      <SelectItem value="meeting_room">Salle de réunion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Building Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Bâtiment</label>
                  <Select value={spaces.filters.building} onValueChange={(value) => spaces.updateFilters({ building: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les bâtiments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tous les bâtiments</SelectItem>
                      {spaces.buildings.map(building => (
                        <SelectItem key={building} value={building}>{building}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Capacity Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Capacité minimale: {spaces.filters.minCapacity}
                  </label>
                  <Slider
                    value={[spaces.filters.minCapacity]}
                    onValueChange={([value]) => spaces.updateFilters({ minCapacity: value })}
                    max={200}
                    step={5}
                    className="mt-2"
                  />
                </div>
              </div>

              {/* Equipment Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">Équipements</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {spaces.equipment.map(eq => (
                    <div key={eq} className="flex items-center space-x-2">
                      <Checkbox
                        id={eq}
                        checked={spaces.filters.equipment.includes(eq)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            spaces.updateFilters({
                              equipment: [...spaces.filters.equipment, eq]
                            });
                          } else {
                            spaces.updateFilters({
                              equipment: spaces.filters.equipment.filter(e => e !== eq)
                            });
                          }
                        }}
                      />
                      <label htmlFor={eq} className="text-sm flex items-center gap-1">
                        {getEquipmentIcon(eq)}
                        {eq}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={spaces.clearFilters}>
                  Réinitialiser
                </Button>
                <Button onClick={() => setShowFilters(false)}>
                  Appliquer
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {filteredSpaces.length} espace(s) trouvé(s)
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            Grille
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            Liste
          </Button>
        </div>
      </div>

      {/* Spaces Grid/List */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-4'}>
        {filteredSpaces.map((space) => (
          <Card key={space.id} className="hover:shadow-elegant transition-all duration-200 hover:scale-[1.02]">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold">{space.name}</h3>
                    <Badge className={getStatusColor(space.status)}>
                      {getStatusLabel(space.status)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {space.capacity} places
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {space.location.building}
                    </div>
                    <div className="text-xs">
                      Type: {getSpaceTypeLabel(space.type)}
                    </div>
                    <div className="text-xs">
                      {space.surface}m² • {space.location.room}
                    </div>
                  </div>

                  {/* Equipment Icons */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {space.equipment.multimedia.slice(0, 3).map((eq, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs px-2 py-1">
                        {getEquipmentIcon(eq)}
                        <span className="ml-1">{eq}</span>
                      </Badge>
                    ))}
                    {(space.equipment.multimedia.length + space.equipment.computer.length + space.equipment.specialized.length) > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{(space.equipment.multimedia.length + space.equipment.computer.length + space.equipment.specialized.length) - 3}
                      </Badge>
                    )}
                  </div>

                  {/* Constraints */}
                  <div className="text-xs text-muted-foreground">
                    Ouvert: {space.constraints.openingHours.start} - {space.constraints.openingHours.end}
                  </div>
                </div>
                
                <Button 
                  onClick={() => onSpaceSelect(space)}
                  className="shrink-0"
                  disabled={space.status === 'occupied' || space.status === 'out_of_service'}
                >
                  Sélectionner
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredSpaces.length === 0 && !spaces.isLoading && (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="font-medium mb-2">Aucun espace trouvé</h3>
            <p className="text-sm">
              {searchTerm || Object.values(spaces.filters).some(f => f && (Array.isArray(f) ? f.length > 0 : true))
                ? 'Essayez de modifier vos critères de recherche'
                : 'Aucun espace disponible pour le moment'
              }
            </p>
            {(searchTerm || Object.values(spaces.filters).some(f => f && (Array.isArray(f) ? f.length > 0 : true))) && (
              <Button variant="outline" className="mt-4" onClick={() => {
                setSearchTerm('');
                spaces.clearFilters();
              }}>
                Réinitialiser les filtres
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {spaces.isLoading && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Chargement des espaces...</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
