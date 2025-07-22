import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Settings } from "lucide-react";
import { Faculty, Department } from "../../../types/academic";
import { academicConfigService } from "../../../services/academicConfigService";

export const AcademicConfigManager: React.FC = () => {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [facultyDialogOpen, setFacultyDialogOpen] = useState(false);
  const [departmentDialogOpen, setDepartmentDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [facultyForm, setFacultyForm] = useState({
    name: '',
    description: '',
    dean: '',
    isActive: true,
    isValidated: false
  });

  const [departmentForm, setDepartmentForm] = useState({
    name: '',
    code: '',
    description: '',
    facultyId: '',
    head: '',
    isActive: true,
    isValidated: false
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [facultiesData, departmentsData] = await Promise.all([
        academicConfigService.getFaculties(),
        academicConfigService.getDepartments()
      ]);
      setFaculties(facultiesData);
      setDepartments(departmentsData);
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

  const handleFacultySave = async () => {
    try {
      if (selectedFaculty) {
        await academicConfigService.updateFaculty(selectedFaculty.id, facultyForm);
        toast({
          title: "Succès",
          description: "Faculté modifiée avec succès"
        });
      } else {
        await academicConfigService.createFaculty(facultyForm);
        toast({
          title: "Succès",
          description: "Faculté créée avec succès"
        });
      }
      
      setFacultyDialogOpen(false);
      setSelectedFaculty(null);
      setFacultyForm({
        name: '',
        description: '',
        dean: '',
        isActive: true,
        isValidated: false
      });
      loadData();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la faculté",
        variant: "destructive"
      });
    }
  };

  const handleDepartmentSave = async () => {
    try {
      if (selectedDepartment) {
        await academicConfigService.updateDepartment(selectedDepartment.id, departmentForm);
        toast({
          title: "Succès",
          description: "Département modifié avec succès"
        });
      } else {
        await academicConfigService.createDepartment(departmentForm);
        toast({
          title: "Succès",
          description: "Département créé avec succès"
        });
      }
      
      setDepartmentDialogOpen(false);
      setSelectedDepartment(null);
      setDepartmentForm({
        name: '',
        code: '',
        description: '',
        facultyId: '',
        head: '',
        isActive: true,
        isValidated: false
      });
      loadData();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le département",
        variant: "destructive"
      });
    }
  };

  const openFacultyDialog = (faculty?: Faculty) => {
    if (faculty) {
      setSelectedFaculty(faculty);
      setFacultyForm({
        name: faculty.name,
        description: faculty.description || '',
        dean: faculty.dean || '',
        isActive: faculty.isActive,
        isValidated: faculty.isValidated
      });
    } else {
      setSelectedFaculty(null);
      setFacultyForm({
        name: '',
        description: '',
        dean: '',
        isActive: true,
        isValidated: false
      });
    }
    setFacultyDialogOpen(true);
  };

  const openDepartmentDialog = (department?: Department) => {
    if (department) {
      setSelectedDepartment(department);
      setDepartmentForm({
        name: department.name,
        code: department.code,
        description: department.description || '',
        facultyId: department.facultyId,
        head: department.head,
        isActive: department.isActive,
        isValidated: department.isValidated
      });
    } else {
      setSelectedDepartment(null);
      setDepartmentForm({
        name: '',
        code: '',
        description: '',
        facultyId: '',
        head: '',
        isActive: true,
        isValidated: false
      });
    }
    setDepartmentDialogOpen(true);
  };

  const getFacultyName = (facultyId: string) => {
    const faculty = faculties.find(f => f.id === facultyId);
    return faculty?.name || 'Faculté inconnue';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Settings className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Configuration Académique</h1>
      </div>

      <Tabs defaultValue="faculties" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="faculties">Facultés</TabsTrigger>
          <TabsTrigger value="departments">Départements</TabsTrigger>
        </TabsList>

        <TabsContent value="faculties" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Gestion des Facultés</CardTitle>
                <Dialog open={facultyDialogOpen} onOpenChange={setFacultyDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => openFacultyDialog()}>
                      <Plus className="h-4 w-4 mr-2" />
                      Nouvelle Faculté
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {selectedFaculty ? 'Modifier la Faculté' : 'Nouvelle Faculté'}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="facultyName">Nom de la faculté</Label>
                        <Input
                          id="facultyName"
                          value={facultyForm.name}
                          onChange={(e) => setFacultyForm(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="facultyDescription">Description</Label>
                        <Input
                          id="facultyDescription"
                          value={facultyForm.description}
                          onChange={(e) => setFacultyForm(prev => ({ ...prev, description: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="facultyDean">Doyen</Label>
                        <Input
                          id="facultyDean"
                          value={facultyForm.dean}
                          onChange={(e) => setFacultyForm(prev => ({ ...prev, dean: e.target.value }))}
                        />
                      </div>
                      <div className="flex gap-4">
                        <Button onClick={handleFacultySave}>
                          {selectedFaculty ? 'Modifier' : 'Créer'}
                        </Button>
                        <Button variant="outline" onClick={() => setFacultyDialogOpen(false)}>
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
                    <div>
                      <h3 className="font-semibold">{faculty.name}</h3>
                      <p className="text-sm text-gray-600">{faculty.description}</p>
                      {faculty.dean && (
                        <p className="text-sm text-blue-600">Doyen: {faculty.dean}</p>
                      )}
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
                        onClick={() => academicConfigService.deleteFaculty(faculty.id)}
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
                <CardTitle>Gestion des Départements</CardTitle>
                <Dialog open={departmentDialogOpen} onOpenChange={setDepartmentDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => openDepartmentDialog()}>
                      <Plus className="h-4 w-4 mr-2" />
                      Nouveau Département
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {selectedDepartment ? 'Modifier le Département' : 'Nouveau Département'}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="departmentName">Nom du département</Label>
                        <Input
                          id="departmentName"
                          value={departmentForm.name}
                          onChange={(e) => setDepartmentForm(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="departmentCode">Code du département</Label>
                        <Input
                          id="departmentCode"
                          value={departmentForm.code}
                          onChange={(e) => setDepartmentForm(prev => ({ ...prev, code: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="departmentDescription">Description</Label>
                        <Input
                          id="departmentDescription"
                          value={departmentForm.description}
                          onChange={(e) => setDepartmentForm(prev => ({ ...prev, description: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="departmentHead">Chef de département</Label>
                        <Input
                          id="departmentHead"
                          value={departmentForm.head}
                          onChange={(e) => setDepartmentForm(prev => ({ ...prev, head: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="departmentFaculty">Faculté</Label>
                        <select
                          id="departmentFaculty"
                          value={departmentForm.facultyId}
                          onChange={(e) => setDepartmentForm(prev => ({ ...prev, facultyId: e.target.value }))}
                          className="w-full p-2 border rounded"
                        >
                          <option value="">Sélectionner une faculté</option>
                          {faculties.map(faculty => (
                            <option key={faculty.id} value={faculty.id}>
                              {faculty.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex gap-4">
                        <Button onClick={handleDepartmentSave}>
                          {selectedDepartment ? 'Modifier' : 'Créer'}
                        </Button>
                        <Button variant="outline" onClick={() => setDepartmentDialogOpen(false)}>
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
                    <div>
                      <h3 className="font-semibold">{department.name}</h3>
                      <p className="text-sm text-gray-600">{department.description}</p>
                      <p className="text-sm text-blue-600">
                        Code: {department.code} | Faculté: {getFacultyName(department.facultyId)}
                      </p>
                      {department.head && (
                        <p className="text-sm text-green-600">Chef: {department.head}</p>
                      )}
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
                        onClick={() => academicConfigService.deleteDepartment(department.id)}
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
