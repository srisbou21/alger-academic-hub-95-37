import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Building2, Users, GraduationCap } from "lucide-react";
import { Faculty, Department, Specialty } from "../../../types/academic";
import { academicConfigService } from "../../../services/academicConfigService";

export const AcademicStructureManager: React.FC = () => {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // États pour les dialogs
  const [facultyDialog, setFacultyDialog] = useState({ open: false, selected: null as Faculty | null });
  const [departmentDialog, setDepartmentDialog] = useState({ open: false, selected: null as Department | null });
  const [specialtyDialog, setSpecialtyDialog] = useState({ open: false, selected: null as Specialty | null });

  // États pour les formulaires
  const [facultyForm, setFacultyForm] = useState({
    name: '',
    description: '',
    dean: '',
    isActive: true
  });

  const [departmentForm, setDepartmentForm] = useState({
    name: '',
    code: '',
    description: '',
    facultyId: '',
    head: '',
    isActive: true
  });

  const [specialtyForm, setSpecialtyForm] = useState({
    name: '',
    code: '',
    filiereId: '',
    level: 'licence' as 'licence' | 'master' | 'doctorat',
    description: '',
    duration: 3,
    isActive: true
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [facultiesData, departmentsData, specialtiesData] = await Promise.all([
        academicConfigService.getFaculties(),
        academicConfigService.getDepartments(),
        academicConfigService.getSpecialties()
      ]);
      setFaculties(facultiesData);
      setDepartments(departmentsData);
      setSpecialties(specialtiesData);
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

  // Fonctions pour les facultés
  const openFacultyDialog = (faculty?: Faculty) => {
    if (faculty) {
      setFacultyDialog({ open: true, selected: faculty });
      setFacultyForm({
        name: faculty.name,
        description: faculty.description || '',
        dean: faculty.dean || '',
        isActive: faculty.isActive
      });
    } else {
      setFacultyDialog({ open: true, selected: null });
      setFacultyForm({
        name: '',
        description: '',
        dean: '',
        isActive: true
      });
    }
  };

  const handleFacultySave = async () => {
    try {
      if (facultyDialog.selected) {
        await academicConfigService.updateFaculty(facultyDialog.selected.id, facultyForm);
        toast({ title: "Succès", description: "Faculté modifiée avec succès" });
      } else {
        await academicConfigService.createFaculty({...facultyForm, isValidated: false});
        toast({ title: "Succès", description: "Faculté créée avec succès" });
      }
      setFacultyDialog({ open: false, selected: null });
      loadData();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la faculté",
        variant: "destructive"
      });
    }
  };

  // Fonctions pour les départements
  const openDepartmentDialog = (department?: Department) => {
    if (department) {
      setDepartmentDialog({ open: true, selected: department });
      setDepartmentForm({
        name: department.name,
        code: department.code,
        description: department.description || '',
        facultyId: department.facultyId,
        head: department.head,
        isActive: department.isActive
      });
    } else {
      setDepartmentDialog({ open: true, selected: null });
      setDepartmentForm({
        name: '',
        code: '',
        description: '',
        facultyId: '',
        head: '',
        isActive: true
      });
    }
  };

  const handleDepartmentSave = async () => {
    try {
      if (departmentDialog.selected) {
        await academicConfigService.updateDepartment(departmentDialog.selected.id, departmentForm);
        toast({ title: "Succès", description: "Département modifié avec succès" });
      } else {
        await academicConfigService.createDepartment({...departmentForm, isValidated: false});
        toast({ title: "Succès", description: "Département créé avec succès" });
      }
      setDepartmentDialog({ open: false, selected: null });
      loadData();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le département",
        variant: "destructive"
      });
    }
  };

  // Fonctions pour les filières
  const openSpecialtyDialog = (specialty?: Specialty) => {
    if (specialty) {
      setSpecialtyDialog({ open: true, selected: specialty });
      setSpecialtyForm({
        name: specialty.name,
        code: specialty.code,
        filiereId: specialty.filiereId,
        level: specialty.level,
        description: specialty.description || '',
        duration: specialty.duration,
        isActive: specialty.isActive
      });
    } else {
      setSpecialtyDialog({ open: true, selected: null });
      setSpecialtyForm({
        name: '',
        code: '',
        filiereId: '',
        level: 'licence',
        description: '',
        duration: 3,
        isActive: true
      });
    }
  };

  const handleSpecialtySave = async () => {
    try {
      if (specialtyDialog.selected) {
        await academicConfigService.updateSpecialty(specialtyDialog.selected.id, specialtyForm);
        toast({ title: "Succès", description: "Filière modifiée avec succès" });
      } else {
        await academicConfigService.createSpecialty({...specialtyForm, isValidated: false});
        toast({ title: "Succès", description: "Filière créée avec succès" });
      }
      setSpecialtyDialog({ open: false, selected: null });
      loadData();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la filière",
        variant: "destructive"
      });
    }
  };

  // Fonctions utilitaires
  const getFacultyName = (facultyId: string) => {
    return faculties.find(f => f.id === facultyId)?.name || 'Faculté inconnue';
  };

  const getDepartmentName = (departmentId: string) => {
    return departments.find(d => d.id === departmentId)?.name || 'Département inconnu';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Building2 className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Configuration de la Structure Académique</h1>
      </div>

      <Tabs defaultValue="faculties" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="faculties">Facultés</TabsTrigger>
          <TabsTrigger value="departments">Départements</TabsTrigger>
          <TabsTrigger value="specialties">Filières</TabsTrigger>
        </TabsList>

        {/* Onglet Facultés */}
        <TabsContent value="faculties" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Gestion des Facultés
                </CardTitle>
                <Dialog open={facultyDialog.open} onOpenChange={(open) => setFacultyDialog({ open, selected: null })}>
                  <DialogTrigger asChild>
                    <Button onClick={() => openFacultyDialog()}>
                      <Plus className="h-4 w-4 mr-2" />
                      Nouvelle Faculté
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>
                        {facultyDialog.selected ? 'Modifier la Faculté' : 'Nouvelle Faculté'}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="facultyName">Nom de la faculté *</Label>
                        <Input
                          id="facultyName"
                          value={facultyForm.name}
                          onChange={(e) => setFacultyForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Ex: Faculté des Sciences"
                        />
                      </div>
                      <div>
                        <Label htmlFor="facultyDescription">Description</Label>
                        <Textarea
                          id="facultyDescription"
                          value={facultyForm.description}
                          onChange={(e) => setFacultyForm(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Description de la faculté"
                        />
                      </div>
                      <div>
                        <Label htmlFor="facultyDean">Doyen</Label>
                        <Input
                          id="facultyDean"
                          value={facultyForm.dean}
                          onChange={(e) => setFacultyForm(prev => ({ ...prev, dean: e.target.value }))}
                          placeholder="Nom du doyen"
                        />
                      </div>
                      <div className="flex gap-4">
                        <Button onClick={handleFacultySave} className="flex-1">
                          {facultyDialog.selected ? 'Modifier' : 'Créer'}
                        </Button>
                        <Button variant="outline" onClick={() => setFacultyDialog({ open: false, selected: null })} className="flex-1">
                          Annuler
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {faculties.map((faculty) => (
                  <div key={faculty.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{faculty.name}</h3>
                      {faculty.description && (
                        <p className="text-sm text-gray-600 mt-1">{faculty.description}</p>
                      )}
                      {faculty.dean && (
                        <p className="text-sm text-blue-600 mt-1">Doyen: {faculty.dean}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        {departments.filter(d => d.facultyId === faculty.id).length} département(s)
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openFacultyDialog(faculty)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          if (confirm('Êtes-vous sûr de vouloir supprimer cette faculté ?')) {
                            academicConfigService.deleteFaculty(faculty.id).then(() => {
                              toast({ title: "Succès", description: "Faculté supprimée" });
                              loadData();
                            });
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Départements */}
        <TabsContent value="departments" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Gestion des Départements
                </CardTitle>
                <Dialog open={departmentDialog.open} onOpenChange={(open) => setDepartmentDialog({ open, selected: null })}>
                  <DialogTrigger asChild>
                    <Button onClick={() => openDepartmentDialog()}>
                      <Plus className="h-4 w-4 mr-2" />
                      Nouveau Département
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>
                        {departmentDialog.selected ? 'Modifier le Département' : 'Nouveau Département'}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="departmentName">Nom du département *</Label>
                        <Input
                          id="departmentName"
                          value={departmentForm.name}
                          onChange={(e) => setDepartmentForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Ex: Département d'Informatique"
                        />
                      </div>
                      <div>
                        <Label htmlFor="departmentFaculty">Faculté *</Label>
                        <Select
                          value={departmentForm.facultyId || "none"}
                          onValueChange={(value) => setDepartmentForm(prev => ({ ...prev, facultyId: value === "none" ? "" : value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une faculté" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none" disabled>Sélectionner une faculté</SelectItem>
                            {faculties.map(faculty => (
                              <SelectItem key={faculty.id} value={faculty.id}>
                                {faculty.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="departmentDescription">Description</Label>
                        <Textarea
                          id="departmentDescription"
                          value={departmentForm.description}
                          onChange={(e) => setDepartmentForm(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Description du département"
                        />
                      </div>
                      <div>
                        <Label htmlFor="departmentHead">Chef de département</Label>
                        <Input
                          id="departmentHead"
                          value={departmentForm.head}
                          onChange={(e) => setDepartmentForm(prev => ({ ...prev, head: e.target.value }))}
                          placeholder="Nom du chef de département"
                        />
                      </div>
                      <div className="flex gap-4">
                        <Button onClick={handleDepartmentSave} className="flex-1">
                          {departmentDialog.selected ? 'Modifier' : 'Créer'}
                        </Button>
                        <Button variant="outline" onClick={() => setDepartmentDialog({ open: false, selected: null })} className="flex-1">
                          Annuler
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {departments.map((department) => (
                  <div key={department.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{department.name}</h3>
                      {department.description && (
                        <p className="text-sm text-gray-600 mt-1">{department.description}</p>
                      )}
                      <p className="text-sm text-blue-600 mt-1">
                        Faculté: {getFacultyName(department.facultyId)}
                      </p>
                      {department.head && (
                        <p className="text-sm text-green-600 mt-1">Chef: {department.head}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        {specialties.filter(s => s.filiereId === department.id).length} filière(s)
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openDepartmentDialog(department)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          if (confirm('Êtes-vous sûr de vouloir supprimer ce département ?')) {
                            academicConfigService.deleteDepartment(department.id).then(() => {
                              toast({ title: "Succès", description: "Département supprimé" });
                              loadData();
                            });
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Filières */}
        <TabsContent value="specialties" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Gestion des Filières
                </CardTitle>
                <Dialog open={specialtyDialog.open} onOpenChange={(open) => setSpecialtyDialog({ open, selected: null })}>
                  <DialogTrigger asChild>
                    <Button onClick={() => openSpecialtyDialog()}>
                      <Plus className="h-4 w-4 mr-2" />
                      Nouvelle Filière
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>
                        {specialtyDialog.selected ? 'Modifier la Filière' : 'Nouvelle Filière'}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="specialtyName">Nom de la filière *</Label>
                          <Input
                            id="specialtyName"
                            value={specialtyForm.name}
                            onChange={(e) => setSpecialtyForm(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Ex: Informatique"
                          />
                        </div>
                        <div>
                          <Label htmlFor="specialtyCode">Code *</Label>
                          <Input
                            id="specialtyCode"
                            value={specialtyForm.code}
                            onChange={(e) => setSpecialtyForm(prev => ({ ...prev, code: e.target.value }))}
                            placeholder="Ex: INF"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="specialtyDepartment">Département *</Label>
                        <Select
                          value={specialtyForm.filiereId || "none"}
                          onValueChange={(value) => setSpecialtyForm(prev => ({ ...prev, filiereId: value === "none" ? "" : value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un département" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none" disabled>Sélectionner un département</SelectItem>
                            {departments.map(department => (
                              <SelectItem key={department.id} value={department.id}>
                                {department.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="specialtyLevel">Niveau *</Label>
                          <Select
                            value={specialtyForm.level}
                            onValueChange={(value: 'licence' | 'master' | 'doctorat') => setSpecialtyForm(prev => ({ ...prev, level: value }))}
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
                          <Label htmlFor="specialtyDuration">Durée (années) *</Label>
                          <Input
                            id="specialtyDuration"
                            type="number"
                            min="1"
                            max="8"
                            value={specialtyForm.duration}
                            onChange={(e) => setSpecialtyForm(prev => ({ ...prev, duration: parseInt(e.target.value) || 3 }))}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="specialtyDescription">Description</Label>
                        <Textarea
                          id="specialtyDescription"
                          value={specialtyForm.description}
                          onChange={(e) => setSpecialtyForm(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Description de la filière"
                        />
                      </div>
                      <div className="flex gap-4">
                        <Button onClick={handleSpecialtySave} className="flex-1">
                          {specialtyDialog.selected ? 'Modifier' : 'Créer'}
                        </Button>
                        <Button variant="outline" onClick={() => setSpecialtyDialog({ open: false, selected: null })} className="flex-1">
                          Annuler
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {specialties.map((specialty) => (
                  <div key={specialty.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{specialty.name}</h3>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {specialty.code}
                        </span>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded capitalize">
                          {specialty.level}
                        </span>
                      </div>
                      {specialty.description && (
                        <p className="text-sm text-gray-600 mt-1">{specialty.description}</p>
                      )}
                      <p className="text-sm text-blue-600 mt-1">
                        Département: {getDepartmentName(specialty.filiereId)}
                      </p>
                      <div className="flex gap-4 mt-1">
                        <p className="text-sm text-gray-500">Durée: {specialty.duration} ans</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openSpecialtyDialog(specialty)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          if (confirm('Êtes-vous sûr de vouloir supprimer cette filière ?')) {
                            academicConfigService.deleteSpecialty(specialty.id).then(() => {
                              toast({ title: "Succès", description: "Filière supprimée" });
                              loadData();
                            });
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
