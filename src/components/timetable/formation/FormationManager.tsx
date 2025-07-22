import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  GraduationCap, 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  BookOpen, 
  Clock,
  Info,
  Search,
  Filter,
  Settings
} from "lucide-react";
import { FormationOffer, Section, Group, Subject } from '../types/TimetableTypes';

export const FormationManager = () => {
  const [formations, setFormations] = useState<FormationOffer[]>([
    {
      id: '1',
      name: 'Licence Informatique',
      code: 'L-INFO',
      level: 'licence',
      domain: 'Sciences et Technologie',
      description: 'Formation en informatique générale couvrant programmation, bases de données, réseaux',
      duration: 6,
      totalStudents: 180,
      sections: [],
      subjects: [],
      constraints: {
        maxDailyHours: 8,
        maxWeeklyHours: 30,
        preferredTimeSlots: [],
        blockedTimeSlots: [],
        minBreakDuration: 15,
        maxConsecutiveHours: 4
      },
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedFormation, setSelectedFormation] = useState<FormationOffer | null>(null);
  
  const [newFormation, setNewFormation] = useState<Partial<FormationOffer>>({
    name: '',
    code: '',
    level: 'licence',
    domain: '',
    description: '',
    duration: 6,
    totalStudents: 0
  });

  const filteredFormations = formations.filter(formation => {
    const matchesSearch = formation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         formation.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === 'all' || formation.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  const handleCreateFormation = () => {
    const formation: FormationOffer = {
      id: Date.now().toString(),
      name: newFormation.name || '',
      code: newFormation.code || '',
      level: newFormation.level as 'licence' | 'master' | 'doctorat',
      domain: newFormation.domain || '',
      description: newFormation.description,
      duration: newFormation.duration || 6,
      totalStudents: newFormation.totalStudents || 0,
      sections: [],
      subjects: [],
      constraints: {
        maxDailyHours: 8,
        maxWeeklyHours: 30,
        preferredTimeSlots: [],
        blockedTimeSlots: [],
        minBreakDuration: 15,
        maxConsecutiveHours: 4
      },
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setFormations([...formations, formation]);
    setNewFormation({
      name: '',
      code: '',
      level: 'licence',
      domain: '',
      description: '',
      duration: 6,
      totalStudents: 0
    });
    setIsCreateDialogOpen(false);
  };

  const handleDeleteFormation = (id: string) => {
    setFormations(formations.filter(f => f.id !== id));
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'licence': return 'bg-blue-100 text-blue-800';
      case 'master': return 'bg-emerald-100 text-emerald-800';
      case 'doctorat': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Gestion des Offres de Formation
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                Configuration et gestion des formations, sections et groupes
              </p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Nouvelle Formation
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Créer une nouvelle offre de formation</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nom de la formation</Label>
                      <Input
                        id="name"
                        value={newFormation.name}
                        onChange={(e) => setNewFormation({...newFormation, name: e.target.value})}
                        placeholder="ex: Licence Informatique"
                      />
                    </div>
                    <div>
                      <Label htmlFor="code">Code formation</Label>
                      <Input
                        id="code"
                        value={newFormation.code}
                        onChange={(e) => setNewFormation({...newFormation, code: e.target.value})}
                        placeholder="ex: L-INFO"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="level">Niveau</Label>
                      <Select 
                        value={newFormation.level} 
                        onValueChange={(value) => setNewFormation({...newFormation, level: value as any})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="licence">Licence</SelectItem>
                          <SelectItem value="master">Master</SelectItem>
                          <SelectItem value="doctorat">Doctorat</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="domain">Domaine</Label>
                      <Input
                        id="domain"
                        value={newFormation.domain}
                        onChange={(e) => setNewFormation({...newFormation, domain: e.target.value})}
                        placeholder="ex: Sciences et Technologie"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="duration">Durée (semestres)</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={newFormation.duration}
                        onChange={(e) => setNewFormation({...newFormation, duration: parseInt(e.target.value)})}
                        min="1"
                        max="12"
                      />
                    </div>
                    <div>
                      <Label htmlFor="students">Nombre d'étudiants</Label>
                      <Input
                        id="students"
                        type="number"
                        value={newFormation.totalStudents}
                        onChange={(e) => setNewFormation({...newFormation, totalStudents: parseInt(e.target.value)})}
                        min="0"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newFormation.description}
                      onChange={(e) => setNewFormation({...newFormation, description: e.target.value})}
                      placeholder="Description détaillée de la formation..."
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button onClick={handleCreateFormation}>
                      Créer la formation
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher une formation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous niveaux</SelectItem>
                  <SelectItem value="licence">Licence</SelectItem>
                  <SelectItem value="master">Master</SelectItem>
                  <SelectItem value="doctorat">Doctorat</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{formations.length}</div>
              <p className="text-sm text-muted-foreground">Formations totales</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">
                {formations.filter(f => f.isActive).length}
              </div>
              <p className="text-sm text-muted-foreground">Formations actives</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {formations.reduce((sum, f) => sum + f.totalStudents, 0)}
              </div>
              <p className="text-sm text-muted-foreground">Étudiants inscrits</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {formations.reduce((sum, f) => sum + f.sections.length, 0)}
              </div>
              <p className="text-sm text-muted-foreground">Sections configurées</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des formations */}
      <div className="space-y-4">
        {filteredFormations.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Aucune formation trouvée</p>
                <p className="text-sm text-muted-foreground">
                  Essayez de modifier vos critères de recherche
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredFormations.map((formation) => (
            <Card key={formation.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{formation.name}</h3>
                      <Badge className={getLevelColor(formation.level)}>
                        {formation.level.charAt(0).toUpperCase() + formation.level.slice(1)}
                      </Badge>
                      <Badge variant="outline">{formation.code}</Badge>
                      {formation.isActive && (
                        <Badge className="bg-emerald-100 text-emerald-800">Actif</Badge>
                      )}
                    </div>
                    
                    <p className="text-muted-foreground mb-3">{formation.domain}</p>
                    
                    {formation.description && (
                      <p className="text-sm text-muted-foreground mb-3">{formation.description}</p>
                    )}
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{formation.duration} semestres</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{formation.totalStudents} étudiants</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span>{formation.sections.length} sections</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Info className="h-4 w-4 text-muted-foreground" />
                        <span>{formation.subjects.length} matières</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedFormation(formation)}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {/* Ouvrir dialog d'édition */}}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteFormation(formation.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Informations système */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Information :</strong> Les modifications des formations nécessitent une 
          régénération des emplois du temps associés. Les réservations existantes seront 
          automatiquement mises à jour.
        </AlertDescription>
      </Alert>
    </div>
  );
};