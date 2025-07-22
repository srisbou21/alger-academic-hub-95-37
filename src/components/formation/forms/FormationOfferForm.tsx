
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, Plus, X, Save } from "lucide-react";
import { FormationOffer, Faculty, Department, Specialty } from "../../../types/academic";

interface FormationOfferFormProps {
  offer: FormationOffer | null;
  faculties: Faculty[];
  departments: Department[];
  specialties: Specialty[];
  onSave: (offer: FormationOffer) => void;
  onCancel: () => void;
}

export const FormationOfferForm = ({ 
  offer, 
  faculties, 
  departments, 
  specialties, 
  onSave, 
  onCancel 
}: FormationOfferFormProps) => {
  const [formData, setFormData] = useState<Partial<FormationOffer>>({
    name: '',
    code: '',
    specialtyId: '',
    level: 'L1',
    academicYear: '2024-2025',
    diplomaType: 'licence',
    duration: 6,
    modality: 'presential',
    language: 'Français',
    maxCapacity: 100,
    admissionRequirements: '',
    pedagogicalObjectives: [],
    careerProspects: [],
    responsibleName: '',
    totalECTS: 180,
    status: 'draft'
  });

  const [selectedFaculty, setSelectedFaculty] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [newObjective, setNewObjective] = useState('');
  const [newProspect, setNewProspect] = useState('');

  useEffect(() => {
    if (offer) {
      setFormData(offer);
      
      // Récupérer la hiérarchie pour pré-sélectionner les dropdowns
      const specialty = specialties.find(s => s.id === offer.specialtyId);
      if (specialty) {
        const department = departments.find(d => d.id === specialty.filiereId);
        if (department) {
          setSelectedDepartment(department.id);
          const faculty = faculties.find(f => f.id === department.facultyId);
          if (faculty) {
            setSelectedFaculty(faculty.id);
          }
        }
      }
    }
  }, [offer, specialties, departments, faculties]);

  // Filtrer les départements selon la faculté sélectionnée
  const filteredDepartments = selectedFaculty 
    ? departments.filter(d => d.facultyId === selectedFaculty)
    : [];

  // Filtrer les filières selon le département sélectionné
  const filteredSpecialties = selectedDepartment 
    ? specialties.filter(s => s.filiereId === selectedDepartment)
    : [];

  const handleFacultyChange = (facultyId: string) => {
    setSelectedFaculty(facultyId);
    setSelectedDepartment('');
    setFormData(prev => ({ ...prev, specialtyId: '' }));
  };

  const handleDepartmentChange = (departmentId: string) => {
    setSelectedDepartment(departmentId);
    setFormData(prev => ({ ...prev, specialtyId: '' }));
  };

  const addObjective = () => {
    if (newObjective.trim()) {
      setFormData(prev => ({
        ...prev,
        pedagogicalObjectives: [...(prev.pedagogicalObjectives || []), newObjective.trim()]
      }));
      setNewObjective('');
    }
  };

  const removeObjective = (index: number) => {
    setFormData(prev => ({
      ...prev,
      pedagogicalObjectives: prev.pedagogicalObjectives?.filter((_, i) => i !== index) || []
    }));
  };

  const addProspect = () => {
    if (newProspect.trim()) {
      setFormData(prev => ({
        ...prev,
        careerProspects: [...(prev.careerProspects || []), newProspect.trim()]
      }));
      setNewProspect('');
    }
  };

  const removeProspect = (index: number) => {
    setFormData(prev => ({
      ...prev,
      careerProspects: prev.careerProspects?.filter((_, i) => i !== index) || []
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.code && formData.specialtyId) {
      const offerData: FormationOffer = {
        id: offer?.id || Date.now().toString(),
        name: formData.name!,
        code: formData.code!,
        specialtyId: formData.specialtyId!,
        level: formData.level || 'L1',
        academicYear: formData.academicYear || '2024-2025',
        modules: offer?.modules || [],
        sections: offer?.sections || [],
        diplomaType: formData.diplomaType || 'licence',
        duration: formData.duration || 6,
        modality: formData.modality || 'presential',
        language: formData.language || 'Français',
        maxCapacity: formData.maxCapacity || 100,
        admissionRequirements: formData.admissionRequirements || '',
        pedagogicalObjectives: formData.pedagogicalObjectives || [],
        careerProspects: formData.careerProspects || [],
        status: formData.status || 'draft',
        responsibleId: formData.responsibleId || '',
        responsibleName: formData.responsibleName || '',
        lastModifiedBy: 'current_user',
        validationHistory: offer?.validationHistory || [],
        totalECTS: formData.totalECTS || 180,
        createdAt: offer?.createdAt || new Date(),
        updatedAt: new Date()
      };
      
      onSave(offerData);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          {offer ? 'Modifier l\'Offre de Formation' : 'Nouvelle Offre de Formation'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">Général</TabsTrigger>
              <TabsTrigger value="hierarchy">Hiérarchie</TabsTrigger>
              <TabsTrigger value="objectives">Objectifs</TabsTrigger>
              <TabsTrigger value="prospects">Débouchés</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nom de l'offre *</Label>
                  <Input
                    id="name"
                    value={formData.name || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Licence Informatique"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="code">Code *</Label>
                  <Input
                    id="code"
                    value={formData.code || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                    placeholder="Ex: LIC-INFO-24"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="level">Niveau</Label>
                  <Select 
                    value={formData.level || ''} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, level: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir un niveau" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="L1">Licence 1</SelectItem>
                      <SelectItem value="L2">Licence 2</SelectItem>
                      <SelectItem value="L3">Licence 3</SelectItem>
                      <SelectItem value="M1">Master 1</SelectItem>
                      <SelectItem value="M2">Master 2</SelectItem>
                      <SelectItem value="D">Doctorat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="academicYear">Année académique</Label>
                  <Select 
                    value={formData.academicYear || ''} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, academicYear: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir une année" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024-2025">2024-2025</SelectItem>
                      <SelectItem value="2025-2026">2025-2026</SelectItem>
                      <SelectItem value="2026-2027">2026-2027</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="maxCapacity">Effectif maximum</Label>
                  <Input
                    id="maxCapacity"
                    type="number"
                    value={formData.maxCapacity || 100}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxCapacity: parseInt(e.target.value) }))}
                    min="1"
                  />
                </div>
                <div>
                  <Label htmlFor="responsibleName">Responsable</Label>
                  <Input
                    id="responsibleName"
                    value={formData.responsibleName || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, responsibleName: e.target.value }))}
                    placeholder="Nom du responsable"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="hierarchy" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="faculty">Faculté *</Label>
                  <Select value={selectedFaculty} onValueChange={handleFacultyChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une faculté" />
                    </SelectTrigger>
                    <SelectContent>
                      {faculties.map(faculty => (
                        <SelectItem key={faculty.id} value={faculty.id}>
                          {faculty.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="department">Département *</Label>
                  <Select 
                    value={selectedDepartment} 
                    onValueChange={handleDepartmentChange}
                    disabled={!selectedFaculty}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un département" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredDepartments.map(department => (
                        <SelectItem key={department.id} value={department.id}>
                          {department.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="specialty">Filière *</Label>
                  <Select 
                    value={formData.specialtyId || ''} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, specialtyId: value }))}
                    disabled={!selectedDepartment}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une filière" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredSpecialties.map(specialty => (
                        <SelectItem key={specialty.id} value={specialty.id}>
                          {specialty.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="admissionRequirements">Conditions d'admission</Label>
                <Textarea
                  id="admissionRequirements"
                  value={formData.admissionRequirements || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, admissionRequirements: e.target.value }))}
                  placeholder="Décrivez les prérequis et conditions d'admission..."
                  rows={3}
                />
              </div>
            </TabsContent>

            <TabsContent value="objectives" className="space-y-4">
              <div>
                <Label>Objectifs pédagogiques</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newObjective}
                    onChange={(e) => setNewObjective(e.target.value)}
                    placeholder="Ajouter un objectif pédagogique..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addObjective())}
                  />
                  <Button type="button" onClick={addObjective} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.pedagogicalObjectives?.map((objective, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {objective}
                      <button
                        type="button"
                        onClick={() => removeObjective(index)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="prospects" className="space-y-4">
              <div>
                <Label>Débouchés professionnels</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newProspect}
                    onChange={(e) => setNewProspect(e.target.value)}
                    placeholder="Ajouter un débouché professionnel..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addProspect())}
                  />
                  <Button type="button" onClick={addProspect} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.careerProspects?.map((prospect, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {prospect}
                      <button
                        type="button"
                        onClick={() => removeProspect(index)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              <Save className="h-4 w-4 mr-2" />
              {offer ? 'Modifier' : 'Créer'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
