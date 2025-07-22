import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Pencil, Trash2, Building, MapPin, Users, Monitor, Wifi, Volume2, Settings, CheckCircle, AlertTriangle } from "lucide-react";
import { Space } from "../../types/reservation";
import { useSpaces } from "../../hooks/useSpaces";
import { useToast } from "@/hooks/use-toast";

interface SpaceFormData {
  name: string;
  code: string;
  type: 'classroom' | 'amphitheater' | 'laboratory' | 'computer_room' | 'meeting_room';
  capacity: number;
  surface: number;
  building: string;
  floor: string;
  multimedia: string[];
  computer: string[];
  accessibility: boolean;
  airConditioning: boolean;
  naturalLight: boolean;
  openingStart: string;
  openingEnd: string;
  closedDays: string[];
  cleaningTime: number;
  restrictions: string[];
}

export const SpaceManagement = () => {
  const { allSpaces, loadSpaces } = useSpaces();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSpace, setEditingSpace] = useState<Space | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [formData, setFormData] = useState<SpaceFormData>({
    name: '',
    code: '',
    type: 'classroom',
    capacity: 0,
    surface: 0,
    building: '',
    floor: '',
    multimedia: [],
    computer: [],
    accessibility: false,
    airConditioning: false,
    naturalLight: false,
    openingStart: '08:00',
    openingEnd: '18:00',
    closedDays: [],
    cleaningTime: 15,
    restrictions: []
  });

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      type: 'classroom',
      capacity: 0,
      surface: 0,
      building: '',
      floor: '',
      multimedia: [],
      computer: [],
      accessibility: false,
      airConditioning: false,
      naturalLight: false,
      openingStart: '08:00',
      openingEnd: '18:00',
      closedDays: [],
      cleaningTime: 15,
      restrictions: []
    });
    setEditingSpace(null);
  };

  const handleEdit = (space: Space) => {
    setEditingSpace(space);
    setFormData({
      name: space.name,
      code: space.code,
      type: space.type,
      capacity: space.capacity,
      surface: space.surface,
      building: space.location.building,
      floor: space.location.floor,
      multimedia: space.equipment.multimedia,
      computer: space.equipment.computer,
      accessibility: space.equipment.accessibility,
      airConditioning: space.equipment.airConditioning,
      naturalLight: space.equipment.naturalLight,
      openingStart: space.constraints.openingHours.start,
      openingEnd: space.constraints.openingHours.end,
      closedDays: space.constraints.closedDays,
      cleaningTime: space.constraints.cleaningTime,
      restrictions: space.constraints.restrictions
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const spaceData = {
      id: editingSpace?.id || `space_${Date.now()}`,
      name: formData.name,
      code: formData.code,
      type: formData.type,
      capacity: formData.capacity,
      surface: formData.surface,
      location: {
        building: formData.building,
        floor: formData.floor
      },
      status: 'available' as const,
      equipment: {
        multimedia: formData.multimedia,
        computer: formData.computer,
        accessibility: formData.accessibility,
        airConditioning: formData.airConditioning,
        naturalLight: formData.naturalLight
      },
      constraints: {
        openingHours: {
          start: formData.openingStart,
          end: formData.openingEnd
        },
        closedDays: formData.closedDays,
        cleaningTime: formData.cleaningTime,
        restrictions: formData.restrictions
      }
    };

    console.log(editingSpace ? 'Modification espace:' : 'Création espace:', spaceData);
    
    toast({
      title: editingSpace ? "Espace modifié" : "Espace créé",
      description: `L'espace ${formData.name} a été ${editingSpace ? 'modifié' : 'créé'} avec succès.`,
    });

    setIsDialogOpen(false);
    resetForm();
    loadSpaces();
  };

  const handleDelete = (space: Space) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'espace "${space.name}" ?`)) {
      console.log('Suppression espace:', space.id);
      toast({
        title: "Espace supprimé",
        description: `L'espace ${space.name} a été supprimé avec succès.`,
        variant: "destructive"
      });
      loadSpaces();
    }
  };

  const handleStatusChange = (space: Space, newStatus: string) => {
    console.log(`Changement de statut pour l'espace ${space.name}: ${space.status} -> ${newStatus}`);
    
    const statusLabels = {
      available: 'disponible',
      maintenance: 'en maintenance',
      out_of_service: 'hors service'
    };

    toast({
      title: "Statut modifié",
      description: `L'espace ${space.name} est maintenant ${statusLabels[newStatus as keyof typeof statusLabels]}.`,
    });
    loadSpaces();
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      classroom: 'Salle de classe',
      amphitheater: 'Amphithéâtre',
      laboratory: 'Laboratoire',
      computer_room: 'Salle informatique',
      meeting_room: 'Salle de réunion'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      available: { label: 'Disponible', variant: 'default' as const },
      occupied: { label: 'Occupé', variant: 'secondary' as const },
      maintenance: { label: 'Maintenance', variant: 'destructive' as const },
      out_of_service: { label: 'Hors service', variant: 'destructive' as const }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.available;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getEquipmentList = (space: Space) => {
    const allEquipment = [
      ...space.equipment.multimedia,
      ...space.equipment.computer
    ];
    
    const features = [];
    if (space.equipment.accessibility) features.push('Accessible PMR');
    if (space.equipment.airConditioning) features.push('Climatisé');
    if (space.equipment.naturalLight) features.push('Lumière naturelle');
    
    return [...allEquipment, ...features];
  };
  const filteredSpaces = allSpaces.filter(space =>
    space.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    space.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    space.location.building.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Gestion des Espaces
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvel Espace
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="pb-6">
                  <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Building className="h-6 w-6 text-primary" />
                    </div>
                    {editingSpace ? 'Modifier l\'espace' : 'Créer un nouvel espace'}
                  </DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Informations générales */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-6 rounded-xl border border-blue-200/50 dark:border-blue-800/50">
                    <h3 className="text-xl font-semibold mb-6 flex items-center gap-3 text-blue-900 dark:text-blue-100">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                        <Building className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      Informations générales
                    </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">Nom de l'espace</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Ex: Amphithéâtre A"
                        className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="code" className="text-sm font-medium text-gray-700 dark:text-gray-300">Code de l'espace</Label>
                      <Input
                        id="code"
                        value={formData.code}
                        onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                        placeholder="Ex: AMPH-A"
                        className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="type" className="text-sm font-medium text-gray-700 dark:text-gray-300">Type d'espace</Label>
                      <Select value={formData.type} onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}>
                        <SelectTrigger className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="classroom">🏫 Salle de classe</SelectItem>
                          <SelectItem value="amphitheater">🎭 Amphithéâtre</SelectItem>
                          <SelectItem value="laboratory">🔬 Laboratoire</SelectItem>
                          <SelectItem value="computer_room">💻 Salle informatique</SelectItem>
                          <SelectItem value="meeting_room">👥 Salle de réunion</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="capacity" className="text-sm font-medium text-gray-700 dark:text-gray-300">Capacité</Label>
                      <div className="relative">
                        <Input
                          id="capacity"
                          type="number"
                          value={formData.capacity || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) || 0 }))}
                          min="1"
                          className="h-11 pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="Nombre de places"
                          required
                        />
                        <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="surface" className="text-sm font-medium text-gray-700 dark:text-gray-300">Surface (m²)</Label>
                      <Input
                        id="surface"
                        type="number"
                        value={formData.surface || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, surface: parseInt(e.target.value) || 0 }))}
                        min="1"
                        className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Surface en m²"
                        required
                      />
                    </div>
                  </div>
                  </div>

                  {/* Localisation */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 p-6 rounded-xl border border-green-200/50 dark:border-green-800/50">
                    <h3 className="text-xl font-semibold mb-6 flex items-center gap-3 text-green-900 dark:text-green-100">
                      <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                        <MapPin className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      Localisation
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="building" className="text-sm font-medium text-gray-700 dark:text-gray-300">Bâtiment</Label>
                        <Input
                          id="building"
                          value={formData.building}
                          onChange={(e) => setFormData(prev => ({ ...prev, building: e.target.value }))}
                          placeholder="Ex: Bâtiment Principal"
                          className="h-11 border-gray-300 focus:border-green-500 focus:ring-green-500"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="floor" className="text-sm font-medium text-gray-700 dark:text-gray-300">Étage</Label>
                        <Input
                          id="floor"
                          value={formData.floor}
                          onChange={(e) => setFormData(prev => ({ ...prev, floor: e.target.value }))}
                          placeholder="Ex: RDC, 1er étage"
                          className="h-11 border-gray-300 focus:border-green-500 focus:ring-green-500"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Équipements et Caractéristiques */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 p-6 rounded-xl border border-purple-200/50 dark:border-purple-800/50">
                    <h3 className="text-xl font-semibold mb-6 flex items-center gap-3 text-purple-900 dark:text-purple-100">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                        <Settings className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      Équipements et Caractéristiques
                    </h3>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700">
                          <Label className="text-base font-medium text-gray-800 dark:text-gray-200 mb-4 block">Options disponibles</Label>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded">
                                  <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <Label htmlFor="accessibility" className="font-medium">Accessibilité PMR</Label>
                              </div>
                              <Switch
                                id="accessibility"
                                checked={formData.accessibility}
                                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, accessibility: checked }))}
                              />
                            </div>
                            
                            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-cyan-100 dark:bg-cyan-900/50 rounded">
                                  <Wifi className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                                </div>
                                <Label htmlFor="airConditioning" className="font-medium">Climatisation</Label>
                              </div>
                              <Switch
                                id="airConditioning"
                                checked={formData.airConditioning}
                                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, airConditioning: checked }))}
                              />
                            </div>
                            
                            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/50 rounded">
                                  <Monitor className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                                </div>
                                <Label htmlFor="naturalLight" className="font-medium">Lumière naturelle</Label>
                              </div>
                              <Switch
                                id="naturalLight"
                                checked={formData.naturalLight}
                                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, naturalLight: checked }))}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700">
                          <Label className="text-base font-medium text-gray-800 dark:text-gray-200 mb-4 block flex items-center gap-2">
                            <Volume2 className="h-4 w-4" />
                            Équipements multimédia
                          </Label>
                          <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                            {[
                              'Vidéoprojecteur', 'Écran géant', 'Tableau blanc interactif', 
                              'Tableau noir', 'Micro sans fil', 'Haut-parleurs', 
                              'Webcam', 'Système de visioconférence'
                            ].map((equipment) => (
                              <div key={equipment} className="flex items-center space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors">
                                <Checkbox
                                  id={`multimedia-${equipment}`}
                                  checked={formData.multimedia.includes(equipment)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setFormData(prev => ({
                                        ...prev,
                                        multimedia: [...prev.multimedia, equipment]
                                      }));
                                    } else {
                                      setFormData(prev => ({
                                        ...prev,
                                        multimedia: prev.multimedia.filter(item => item !== equipment)
                                      }));
                                    }
                                  }}
                                />
                                <Label htmlFor={`multimedia-${equipment}`} className="text-sm font-medium cursor-pointer">{equipment}</Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-6">
                        <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700">
                          <Label className="text-base font-medium text-gray-800 dark:text-gray-200 mb-4 block flex items-center gap-2">
                            <Monitor className="h-4 w-4" />
                            Équipements informatiques
                          </Label>
                          <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                            {[
                              'Ordinateurs fixes', 'Ordinateurs portables', 'Tablettes', 
                              'Imprimante', 'Scanner', 'Serveur local', 
                              'Wifi haute vitesse', 'Prises électriques multiples'
                            ].map((equipment) => (
                              <div key={equipment} className="flex items-center space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors">
                                <Checkbox
                                  id={`computer-${equipment}`}
                                  checked={formData.computer.includes(equipment)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setFormData(prev => ({
                                        ...prev,
                                        computer: [...prev.computer, equipment]
                                      }));
                                    } else {
                                      setFormData(prev => ({
                                        ...prev,
                                        computer: prev.computer.filter(item => item !== equipment)
                                      }));
                                    }
                                  }}
                                />
                                <Label htmlFor={`computer-${equipment}`} className="text-sm font-medium cursor-pointer">{equipment}</Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Horaires */}
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 p-6 rounded-xl border border-orange-200/50 dark:border-orange-800/50">
                    <h3 className="text-xl font-semibold mb-6 flex items-center gap-3 text-orange-900 dark:text-orange-100">
                      <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-lg">
                        <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                      </div>
                      Contraintes horaires
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="openingStart" className="text-sm font-medium text-gray-700 dark:text-gray-300">Heure d'ouverture</Label>
                        <Input
                          id="openingStart"
                          type="time"
                          value={formData.openingStart}
                          onChange={(e) => setFormData(prev => ({ ...prev, openingStart: e.target.value }))}
                          className="h-11 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="openingEnd" className="text-sm font-medium text-gray-700 dark:text-gray-300">Heure de fermeture</Label>
                        <Input
                          id="openingEnd"
                          type="time"
                          value={formData.openingEnd}
                          onChange={(e) => setFormData(prev => ({ ...prev, openingEnd: e.target.value }))}
                          className="h-11 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cleaningTime" className="text-sm font-medium text-gray-700 dark:text-gray-300">Temps de nettoyage (min)</Label>
                        <Input
                          id="cleaningTime"
                          type="number"
                          value={formData.cleaningTime || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, cleaningTime: parseInt(e.target.value) || 0 }))}
                          min="0"
                          className="h-11 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                          placeholder="15"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="px-6">
                      Annuler
                    </Button>
                    <Button type="submit" className="px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
                      <Building className="mr-2 h-4 w-4" />
                      {editingSpace ? 'Modifier l\'espace' : 'Créer l\'espace'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Rechercher un espace..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>
          
          <div className="space-y-4">
            {filteredSpaces.map((space) => (
              <Card key={space.id} className="border">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{space.name}</h3>
                        <Badge variant="outline">{space.code}</Badge>
                        {getStatusBadge(space.status)}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{space.location.building} - {space.location.floor}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>{space.capacity} personnes</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          <span>{getTypeLabel(space.type)} - {space.surface}m²</span>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <p className="text-xs font-medium text-muted-foreground mb-2">Équipements disponibles:</p>
                        <div className="flex flex-wrap gap-1">
                          {getEquipmentList(space).map((equipment, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {equipment}
                            </Badge>
                          ))}
                          {getEquipmentList(space).length === 0 && (
                            <span className="text-xs text-muted-foreground">Aucun équipement spécifié</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Select
                        value={space.status}
                        onValueChange={(newStatus) => handleStatusChange(space, newStatus)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="available">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-3 w-3 text-green-600" />
                              Disponible
                            </div>
                          </SelectItem>
                          <SelectItem value="maintenance">
                            <div className="flex items-center gap-2">
                              <Settings className="h-3 w-3 text-orange-600" />
                              Maintenance
                            </div>
                          </SelectItem>
                          <SelectItem value="out_of_service">
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="h-3 w-3 text-red-600" />
                              Hors service
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(space)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(space)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};