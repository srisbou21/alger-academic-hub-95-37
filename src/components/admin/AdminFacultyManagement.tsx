import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Building2, 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  GraduationCap,
  School,
  BookOpen
} from "lucide-react";
import { Faculty, Department, Filiere, Specialty } from "../../types/academic";
import { academicConfigService } from "../../services/academicConfigService";
import { FacultyForm } from "./forms/FacultyForm";
import { DepartmentForm } from "./forms/DepartmentForm";
import { FiliereForm } from "./forms/FiliereForm";
import { SpecialtyForm } from "./forms/SpecialtyForm";
import { SectionsGroupsManager } from "./SectionsGroupsManager";

export const AdminFacultyManagement = () => {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [filieres, setFilieres] = useState<Filiere[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState("faculties");
  const [facultySubTab, setFacultySubTab] = useState("overview");
  const { toast } = useToast();

  // États pour les dialogs
  const [facultyDialog, setFacultyDialog] = useState({ open: false, selected: null as Faculty | null });
  const [departmentDialog, setDepartmentDialog] = useState({ open: false, selected: null as Department | null });
  const [filiereDialog, setFiliereDialog] = useState({ open: false, selected: null as Filiere | null });
  const [specialtyDialog, setSpecialtyDialog] = useState({ open: false, selected: null as Specialty | null });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [facultiesData, departmentsData, filieresData, specialtiesData] = await Promise.all([
        academicConfigService.getFaculties(),
        academicConfigService.getDepartments(),
        academicConfigService.getFilieres(),
        academicConfigService.getSpecialties()
      ]);
      setFaculties(facultiesData);
      setDepartments(departmentsData);
      setFilieres(filieresData);
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

  const handleCreateFaculty = async (data: Omit<Faculty, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newFaculty = await academicConfigService.createFaculty(data);
      setFaculties(prev => [...prev, newFaculty]);
      toast({
        title: "Succès",
        description: "Faculté créée avec succès"
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer la faculté",
        variant: "destructive"
      });
    }
  };

  const handleUpdateFaculty = async (id: string, data: Partial<Omit<Faculty, 'id' | 'createdAt' | 'updatedAt'>>) => {
    try {
      const updatedFaculty = await academicConfigService.updateFaculty(id, data);
      setFaculties(prev => prev.map(f => f.id === id ? updatedFaculty : f));
      toast({
        title: "Succès",
        description: "Faculté mise à jour avec succès"
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la faculté",
        variant: "destructive"
      });
    }
  };

  const handleDeleteFaculty = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette faculté ?")) {
      try {
        await academicConfigService.deleteFaculty(id);
        setFaculties(prev => prev.filter(f => f.id !== id));
        toast({
          title: "Succès",
          description: "Faculté supprimée avec succès"
        });
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de supprimer la faculté",
          variant: "destructive"
        });
      }
    }
  };

  const handleCreateDepartment = async (data: Omit<Department, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newDepartment = await academicConfigService.createDepartment(data);
      setDepartments(prev => [...prev, newDepartment]);
      toast({
        title: "Succès",
        description: "Département créé avec succès"
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer le département",
        variant: "destructive"
      });
    }
  };

  const handleUpdateDepartment = async (id: string, data: Partial<Omit<Department, 'id' | 'createdAt' | 'updatedAt'>>) => {
    try {
      const updatedDepartment = await academicConfigService.updateDepartment(id, data);
      setDepartments(prev => prev.map(d => d.id === id ? updatedDepartment : d));
      toast({
        title: "Succès",
        description: "Département mis à jour avec succès"
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le département",
        variant: "destructive"
      });
    }
  };

  const handleDeleteDepartment = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce département ?")) {
      try {
        await academicConfigService.deleteDepartment(id);
        setDepartments(prev => prev.filter(d => d.id !== id));
        toast({
          title: "Succès",
          description: "Département supprimé avec succès"
        });
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de supprimer le département",
          variant: "destructive"
        });
      }
    }
  };

  const handleCreateSpecialty = async (
    data: Omit<Specialty, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      const newSpecialty = await academicConfigService.createSpecialty(data);
      setSpecialties(prev => [...prev, newSpecialty]);

      toast({
        title: "Succès",
        description: "Spécialité créée avec succès"
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer la spécialité",
        variant: "destructive"
      });
    }
  };

  const handleUpdateSpecialty = async (id: string, data: Partial<Omit<Specialty, 'id' | 'createdAt' | 'updatedAt'>>) => {
    try {
      const updatedSpecialty = await academicConfigService.updateSpecialty(id, data);
      setSpecialties(prev => prev.map(s => s.id === id ? updatedSpecialty : s));
      toast({
        title: "Succès",
        description: "Spécialité mise à jour avec succès"
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la spécialité",
        variant: "destructive"
      });
    }
  };

  const handleDeleteSpecialty = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette spécialité ?")) {
      try {
        await academicConfigService.deleteSpecialty(id);
        setSpecialties(prev => prev.filter(s => s.id !== id));
        toast({
          title: "Succès",
          description: "Spécialité supprimée avec succès"
        });
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de supprimer la spécialité",
          variant: "destructive"
        });
      }
    }
  };

  const handleCreateFiliere = async (data: Omit<Filiere, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newFiliere = await academicConfigService.createFiliere(data);
      setFilieres(prev => [...prev, newFiliere]);
      toast({
        title: "Succès",
        description: "Filière créée avec succès"
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer la filière",
        variant: "destructive"
      });
    }
  };

  const handleUpdateFiliere = async (id: string, data: Partial<Omit<Filiere, 'id' | 'createdAt' | 'updatedAt'>>) => {
    try {
      const updatedFiliere = await academicConfigService.updateFiliere(id, data);
      setFilieres(prev => prev.map(f => f.id === id ? updatedFiliere : f));
      toast({
        title: "Succès",
        description: "Filière mise à jour avec succès"
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la filière",
        variant: "destructive"
      });
    }
  };

  const handleDeleteFiliere = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette filière ?")) {
      try {
        await academicConfigService.deleteFiliere(id);
        setFilieres(prev => prev.filter(f => f.id !== id));
        toast({
          title: "Succès",
          description: "Filière supprimée avec succès"
        });
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de supprimer la filière",
          variant: "destructive"
        });
      }
    }
  };

  const handleCreateFormation = async (specialtyId: string) => {
    // Logique pour créer le canevas de formation
    toast({
      title: "Information",
      description: "Redirection vers le module de création de formation...",
    });
    // Ici on pourrait rediriger vers le module formation avec l'ID de la spécialité
    console.log("Créer formation pour la spécialité:", specialtyId);
  };

  const getFacultyName = (facultyId: string) => {
    return faculties.find(f => f.id === facultyId)?.name || 'Faculté inconnue';
  };

  const getDepartmentName = (departmentId: string) => {
    return departments.find(d => d.id === departmentId)?.name || 'Département inconnu';
  };

  const getFiliereFromId = (filiereId: string) => {
    return filieres.find(f => f.id === filiereId);
  };

  const getFiliereByDepartment = (departmentId: string) => {
    return filieres.filter(f => f.departmentId === departmentId);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-6 w-6" />
            Gestion des Structures Académiques
          </CardTitle>
          <p className="text-slate-600">
            Configuration complète de la hiérarchie académique
          </p>
        </CardHeader>
      </Card>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="faculties">Facultés</TabsTrigger>
          <TabsTrigger value="departments">Départements</TabsTrigger>
          <TabsTrigger value="filieres">Filières</TabsTrigger>
          <TabsTrigger value="specialties-formations">Spécialités & Formations</TabsTrigger>
          <TabsTrigger value="sections-groups">Sections & Groupes</TabsTrigger>
        </TabsList>

        <TabsContent value="faculties" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Gestion des Facultés
                </CardTitle>
                <Button onClick={() => setFacultyDialog({ open: true, selected: null })}>
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {faculties.map(faculty => (
                  <div key={faculty.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="text-lg font-semibold">{faculty.name}</h3>
                      <p className="text-sm text-gray-500">{faculty.description}</p>
                      {faculty.dean && (
                        <p className="text-sm text-blue-600 mt-1">Doyen: {faculty.dean}</p>
                      )}
                      <Badge variant="outline" className="mt-2">
                        {departments.filter(d => d.facultyId === faculty.id).length} département(s)
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setFacultyDialog({ open: true, selected: faculty })}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteFaculty(faculty.id)}
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

        <TabsContent value="departments" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Gestion des Départements
                </CardTitle>
                <Button onClick={() => setDepartmentDialog({ open: true, selected: null })}>
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departments.map(department => (
                  <div key={department.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold">{department.name}</h3>
                        <Badge variant="outline">{department.code}</Badge>
                      </div>
                      <p className="text-sm text-gray-500">{department.description}</p>
                      <p className="text-sm text-blue-600 mt-1">
                        Faculté: {getFacultyName(department.facultyId)}
                      </p>
                      {department.head && (
                        <p className="text-sm text-green-600 mt-1">Chef: {department.head}</p>
                      )}
                      <Badge variant="outline" className="mt-2">
                        {filieres.filter(f => f.departmentId === department.id).length} filière(s)
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setDepartmentDialog({ open: true, selected: department })}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteDepartment(department.id)}
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

        <TabsContent value="filieres" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Gestion des Filières
                </CardTitle>
                <Button onClick={() => setFiliereDialog({ open: true, selected: null })}>
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filieres.map(filiere => (
                  <div key={filiere.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold">{filiere.name}</h3>
                        <Badge variant="outline">{filiere.code}</Badge>
                      </div>
                      <p className="text-sm text-gray-500">{filiere.description}</p>
                      <p className="text-sm text-blue-600 mt-1">
                        Département: {getDepartmentName(filiere.departmentId)}
                      </p>
                      {filiere.head && (
                        <p className="text-sm text-green-600 mt-1">Responsable: {filiere.head}</p>
                      )}
                      <Badge variant="outline" className="mt-2">
                        {specialties.filter(s => s.filiereId === filiere.id).length} spécialité(s)
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setFiliereDialog({ open: true, selected: filiere })}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteFiliere(filiere.id)}
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

        <TabsContent value="specialties-formations" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <School className="h-5 w-5" />
                  Gestion des Spécialités & Formations
                </CardTitle>
                <Button onClick={() => setSpecialtyDialog({ open: true, selected: null })}>
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter une Spécialité
                </Button>
              </div>
              <p className="text-slate-600">
                Vue organisée des spécialités et formations par filière et faculté
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {filieres.map(filiere => {
                  const filiereSpecialties = specialties.filter(s => s.filiereId === filiere.id);
                  const department = departments.find(d => d.id === filiere.departmentId);
                  const faculty = department ? faculties.find(f => f.id === department.facultyId) : null;
                  
                  if (filiereSpecialties.length === 0) return null;
                  
                  return (
                    <div key={filiere.id} className="border rounded-lg p-4">
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-slate-800">{filiere.name}</h3>
                        <p className="text-sm text-slate-600">
                          {faculty?.name} → {department?.name} → {filiere.name}
                        </p>
                      </div>
                      
                      <div className="grid gap-3">
                        {filiereSpecialties.map(specialty => (
                          <div key={specialty.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border">
                            <div className="flex items-center gap-3">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{specialty.name}</span>
                                  <Badge variant="outline" className="text-xs">{specialty.code}</Badge>
                                  <Badge variant={specialty.level === 'licence' ? 'default' : specialty.level === 'master' ? 'secondary' : 'destructive'} className="text-xs">
                                    {specialty.level}
                                  </Badge>
                                </div>
                                <p className="text-sm text-slate-600 mt-1">{specialty.description}</p>
                                <p className="text-xs text-slate-500 mt-1">Durée: {specialty.duration} ans</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleCreateFormation(specialty.id)}
                              >
                                <GraduationCap className="h-4 w-4 mr-1" />
                                Formation
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setSpecialtyDialog({ open: true, selected: specialty })}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sections-groups" className="space-y-4">
          <SectionsGroupsManager />
        </TabsContent>
      </Tabs>

      {/* Formulaires */}
      <FacultyForm
        faculty={facultyDialog.selected || undefined}
        open={facultyDialog.open}
        onClose={() => setFacultyDialog({ open: false, selected: null })}
        onSave={facultyDialog.selected ? 
          (data) => handleUpdateFaculty(facultyDialog.selected!.id, data) : 
          handleCreateFaculty
        }
      />

      <DepartmentForm
        department={departmentDialog.selected || undefined}
        faculties={faculties}
        open={departmentDialog.open}
        onClose={() => setDepartmentDialog({ open: false, selected: null })}
        onSave={departmentDialog.selected ? 
          (data) => handleUpdateDepartment(departmentDialog.selected!.id, data) : 
          handleCreateDepartment
        }
      />

      <FiliereForm
        filiere={filiereDialog.selected || undefined}
        departments={departments}
        open={filiereDialog.open}
        onClose={() => setFiliereDialog({ open: false, selected: null })}
        onSave={filiereDialog.selected ? 
          (data) => handleUpdateFiliere(filiereDialog.selected!.id, data) : 
          handleCreateFiliere
        }
      />

      <SpecialtyForm
        specialty={specialtyDialog.selected || undefined}
        filieres={filieres}
        open={specialtyDialog.open}
        onClose={() => setSpecialtyDialog({ open: false, selected: null })}
        onSave={specialtyDialog.selected ? 
          (data) => handleUpdateSpecialty(specialtyDialog.selected!.id, data) : 
          handleCreateSpecialty
        }
      />
    </div>
  );
};
