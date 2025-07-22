import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  UserCheck,
  UserPlus,
  Calendar
} from "lucide-react";
import { Specialty, Section, Group } from "../../types/academic";
import { academicConfigService } from "../../services/academicConfigService";
import { getAvailableSemestersForSpecialty } from "../../utils/semesterUtils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export const SectionsGroupsManager = () => {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
  const [selectedSemester, setSelectedSemester] = useState<string>('');
  const [sectionsCount, setSectionsCount] = useState<number>(1);
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [firstGroupNumber, setFirstGroupNumber] = useState<number>(1);
  const [lastGroupNumber, setLastGroupNumber] = useState<number>(1);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [specialtiesData, sectionsData, groupsData] = await Promise.all([
        academicConfigService.getSpecialties(),
        academicConfigService.getSections(),
        academicConfigService.getGroups()
      ]);
      setSpecialties(specialtiesData);
      setSections(sectionsData);
      setGroups(groupsData);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les données",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSections = async () => {
    if (!selectedSpecialty || !selectedSemester || sectionsCount < 1) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une spécialité, un semestre et un nombre de sections valide",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const specialty = specialties.find(s => s.id === selectedSpecialty);
      if (!specialty) return;

      const createdSections: Section[] = [];

      // Créer les sections avec numérotation 01, 02, 03...
      for (let i = 1; i <= sectionsCount; i++) {
        const sectionNumber = i.toString().padStart(2, '0'); // 01, 02, 03...
        const sectionData = {
          name: `Section ${sectionNumber} - ${selectedSemester}`,
          code: `${specialty.code}-${selectedSemester}-${sectionNumber}`,
          specialtyId: selectedSpecialty,
          semester: selectedSemester,
          capacity: 50,
          currentEnrollment: 0,
          groups: [],
          isActive: true
        };

        const newSection = await academicConfigService.createSection(sectionData);
        createdSections.push(newSection);
      }

      setSections(prev => [...prev, ...createdSections]);
      
      toast({
        title: "Succès",
        description: `${sectionsCount} section(s) créée(s) pour ${selectedSemester} avec succès`
      });

      // Reset
      setSectionsCount(1);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la création des sections",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditSection = (section: Section) => {
    setEditingSection(section);
    setShowEditDialog(true);
  };

  const handleUpdateSection = async () => {
    if (!editingSection) return;

    try {
      const updatedSection = await academicConfigService.updateSection(editingSection.id, {
        name: editingSection.name,
        code: editingSection.code,
        capacity: editingSection.capacity
      });

      setSections(prev => prev.map(s => s.id === editingSection.id ? updatedSection : s));
      setShowEditDialog(false);
      setEditingSection(null);
      
      toast({
        title: "Succès",
        description: "Section mise à jour avec succès"
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour de la section",
        variant: "destructive"
      });
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette section et tous ses groupes ?")) {
      try {
        await academicConfigService.deleteSection(sectionId);
        setSections(prev => prev.filter(s => s.id !== sectionId));
        setGroups(prev => prev.filter(g => g.sectionId !== sectionId));
        
        toast({
          title: "Succès",
          description: "Section supprimée avec succès"
        });
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Erreur lors de la suppression de la section",
          variant: "destructive"
        });
      }
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce groupe ?")) {
      try {
        await academicConfigService.deleteGroup(groupId);
        setGroups(prev => prev.filter(g => g.id !== groupId));
        
        toast({
          title: "Succès",
          description: "Groupe supprimé avec succès"
        });
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Erreur lors de la suppression du groupe",
          variant: "destructive"
        });
      }
    }
  };

  const handleCreateGroups = async () => {
    if (!selectedSection || firstGroupNumber < 1 || lastGroupNumber < firstGroupNumber) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une section et des numéros de groupes valides",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const section = sections.find(s => s.id === selectedSection);
      if (!section) return;

      const createdGroups: Group[] = [];

      // Créer UN SEUL groupe par numéro (pas TD+TP automatiquement)
      for (let i = firstGroupNumber; i <= lastGroupNumber; i++) {
        const groupData = {
          name: `Groupe ${i}`,
          code: `${section.code}-G${i}`,
          sectionId: selectedSection,
          capacity: 25,
          currentEnrollment: 0,
          type: 'td' as const, // Type par défaut, peut être modifié plus tard
          isActive: true
        };

        const group = await academicConfigService.createGroup(groupData);
        createdGroups.push(group);
      }

      setGroups(prev => [...prev, ...createdGroups]);
      
      toast({
        title: "Succès",
        description: `${createdGroups.length} groupe(s) créé(s) avec succès`
      });

      // Reset
      setFirstGroupNumber(1);
      setLastGroupNumber(1);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la création des groupes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getSpecialtyName = (specialtyId: string) => {
    return specialties.find(s => s.id === specialtyId)?.name || 'Spécialité inconnue';
  };

  const getSectionsBySpecialtyAndSemester = (specialtyId: string, semester: string) => {
    return sections.filter(s => s.specialtyId === specialtyId && s.semester === semester);
  };

  const getGroupsBySection = (sectionId: string) => {
    return groups.filter(g => g.sectionId === sectionId);
  };

  const selectedSpecialtyData = specialties.find(s => s.id === selectedSpecialty);
  const availableSemesters = selectedSpecialtyData ? getAvailableSemestersForSpecialty(selectedSpecialtyData.duration) : [];
  const specialtySections = selectedSpecialty && selectedSemester ? getSectionsBySpecialtyAndSemester(selectedSpecialty, selectedSemester) : [];
  const sectionGroups = selectedSection ? getGroupsBySection(selectedSection) : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6" />
            Gestion des Sections et Groupes par Semestre
          </CardTitle>
          <p className="text-slate-600">
            Créez et gérez les sections et groupes pour chaque spécialité et semestre
          </p>
        </CardHeader>
      </Card>

      {/* Création de sections */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Création de Sections par Semestre
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Spécialité</Label>
              <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une spécialité" />
                </SelectTrigger>
                <SelectContent>
                  {specialties.map(specialty => (
                    <SelectItem key={specialty.id} value={specialty.id}>
                      {specialty.name} ({specialty.code}) - {specialty.level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Semestre</Label>
              <Select 
                value={selectedSemester} 
                onValueChange={setSelectedSemester}
                disabled={!selectedSpecialty}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un semestre" />
                </SelectTrigger>
                <SelectContent>
                  {availableSemesters.map(semester => (
                    <SelectItem key={semester.value} value={semester.value}>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {semester.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Nombre de sections</Label>
              <Input
                type="number"
                min="1"
                max="10"
                value={sectionsCount}
                onChange={(e) => setSectionsCount(parseInt(e.target.value) || 1)}
                placeholder="1"
              />
            </div>
          </div>

          {selectedSpecialtyData && selectedSemester && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Spécialité sélectionnée:</strong> {selectedSpecialtyData.name} ({selectedSpecialtyData.level})
              </p>
              <p className="text-sm text-blue-600 mt-1">
                <strong>Semestre:</strong> {availableSemesters.find(s => s.value === selectedSemester)?.label}
              </p>
              <p className="text-sm text-blue-600">
                Sections existantes pour ce semestre: {specialtySections.length}
              </p>
            </div>
          )}

          <Button 
            onClick={handleCreateSections}
            disabled={!selectedSpecialty || !selectedSemester || sectionsCount < 1}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Créer {sectionsCount} Section(s) pour {selectedSemester}
          </Button>
        </CardContent>
      </Card>

      {/* Création de groupes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Création de Groupes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Section</Label>
            <Select value={selectedSection} onValueChange={setSelectedSection}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une section" />
              </SelectTrigger>
              <SelectContent>
                {specialtySections.map(section => (
                  <SelectItem key={section.id} value={section.id}>
                    {section.name} ({section.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Premier groupe (numéro)</Label>
              <Input
                type="number"
                min="1"
                value={firstGroupNumber}
                onChange={(e) => setFirstGroupNumber(parseInt(e.target.value) || 1)}
                placeholder="1"
              />
            </div>

            <div className="space-y-2">
              <Label>Dernier groupe (numéro)</Label>
              <Input
                type="number"
                min={firstGroupNumber}
                value={lastGroupNumber}
                onChange={(e) => setLastGroupNumber(parseInt(e.target.value) || 1)}
                placeholder="1"
              />
            </div>
          </div>

          {selectedSection && (
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-700">
                <strong>Section sélectionnée:</strong> {sections.find(s => s.id === selectedSection)?.name}
              </p>
              <p className="text-sm text-green-600 mt-1">
                Groupes existants: {sectionGroups.length}
              </p>
              <p className="text-sm text-green-600">
                Nouveaux groupes à créer: {lastGroupNumber - firstGroupNumber + 1}
              </p>
            </div>
          )}

          <Button 
            onClick={handleCreateGroups}
            disabled={!selectedSection || firstGroupNumber < 1 || lastGroupNumber < firstGroupNumber}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Créer Groupes {firstGroupNumber} à {lastGroupNumber}
          </Button>
        </CardContent>
      </Card>

      {/* Vue d'ensemble avec options de modification/suppression */}
      <Card>
        <CardHeader>
          <CardTitle>Vue d'ensemble des Sections et Groupes par Semestre</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {specialties.map(specialty => {
              const specialtyAllSections = sections.filter(s => s.specialtyId === specialty.id);
              if (specialtyAllSections.length === 0) return null;

              const sectionsBySemester = specialtyAllSections.reduce((acc, section) => {
                const semester = section.semester || 'Non défini';
                if (!acc[semester]) acc[semester] = [];
                acc[semester].push(section);
                return acc;
              }, {} as Record<string, typeof specialtyAllSections>);

              return (
                <div key={specialty.id} className="border rounded-lg p-4">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-slate-800">{specialty.name}</h3>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline">{specialty.code}</Badge>
                      <Badge variant={specialty.level === 'licence' ? 'default' : 'secondary'}>
                        {specialty.level}
                      </Badge>
                      <Badge variant="outline">
                        {specialtyAllSections.length} section(s) total
                      </Badge>
                    </div>
                  </div>

                  {Object.entries(sectionsBySemester).map(([semester, sectionsInSemester]) => (
                    <div key={semester} className="mb-4">
                      <h4 className="text-md font-medium text-slate-700 mb-2 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {availableSemesters.find(s => s.value === semester)?.label || semester}
                        <Badge variant="outline" className="text-xs">
                          {sectionsInSemester.length} section(s)
                        </Badge>
                      </h4>
                      
                      <div className="grid gap-3 ml-6">
                        {sectionsInSemester.map(section => {
                          const sectionGroups = getGroupsBySection(section.id);
                          
                          return (
                            <div key={section.id} className="bg-slate-50 p-3 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <span className="font-medium">{section.name}</span>
                                  <Badge variant="outline" className="ml-2 text-xs">{section.code}</Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs">
                                    {sectionGroups.length} groupe(s)
                                  </Badge>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => handleEditSection(section)}
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => handleDeleteSection(section.id)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                              
                              {sectionGroups.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {sectionGroups.map(group => (
                                    <div key={group.id} className="flex items-center gap-1">
                                      <Badge 
                                        variant={group.type === 'td' ? 'default' : 'secondary'}
                                        className="text-xs"
                                      >
                                        {group.name}
                                      </Badge>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleDeleteGroup(group.id)}
                                        className="h-4 w-4 p-0 text-red-600 hover:text-red-700"
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Dialog de modification de section */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier la Section</DialogTitle>
          </DialogHeader>
          {editingSection && (
            <div className="space-y-4">
              <div>
                <Label>Nom de la section</Label>
                <Input
                  value={editingSection.name}
                  onChange={(e) => setEditingSection({...editingSection, name: e.target.value})}
                />
              </div>
              <div>
                <Label>Code</Label>
                <Input
                  value={editingSection.code}
                  onChange={(e) => setEditingSection({...editingSection, code: e.target.value})}
                />
              </div>
              <div>
                <Label>Capacité</Label>
                <Input
                  type="number"
                  value={editingSection.capacity}
                  onChange={(e) => setEditingSection({...editingSection, capacity: parseInt(e.target.value) || 0})}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleUpdateSection} className="bg-green-600 hover:bg-green-700">
                  Mettre à jour
                </Button>
                <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                  Annuler
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
