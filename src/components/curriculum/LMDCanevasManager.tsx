
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  BookOpen, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X,
  School,
  Calendar,
  Clock
} from "lucide-react";
import { Specialty, UniteEnseignement, Subject } from "../../types/academic";
import { academicConfigService } from "../../services/academicConfigService";
import { getAvailableSemestersForSpecialty } from "../../utils/semesterUtils";
import { TimeSlotSelector } from "./TimeSlotSelector";

export const LMDCanevasManager = () => {
  const { toast } = useToast();
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
  const [selectedSemester, setSelectedSemester] = useState<string>('');
  const [uniteEnseignements, setUniteEnseignements] = useState<UniteEnseignement[]>([]);
  const [currentUE, setCurrentUE] = useState<Partial<UniteEnseignement>>({});
  const [currentSubject, setCurrentSubject] = useState<Partial<Subject>>({});
  const [editingUE, setEditingUE] = useState<UniteEnseignement | null>(null);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [showUEDialog, setShowUEDialog] = useState(false);
  const [showSubjectDialog, setShowSubjectDialog] = useState(false);
  const [selectedUEId, setSelectedUEId] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSpecialties();
  }, []);

  useEffect(() => {
    if (selectedSpecialty && selectedSemester) {
      loadCanevas();
    }
  }, [selectedSpecialty, selectedSemester]);

  const loadSpecialties = async () => {
    try {
      const data = await academicConfigService.getSpecialties();
      setSpecialties(data);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les spécialités",
        variant: "destructive"
      });
    }
  };

  const loadCanevas = async () => {
    setLoading(true);
    try {
      // Charger les UE depuis le service academicConfigService
      const uesData = await academicConfigService.getUniteEnseignements(selectedSpecialty, parseInt(selectedSemester.replace('S', '')));
      setUniteEnseignements(uesData);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger le canevas",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveUE = async () => {
    if (!currentUE.name || !currentUE.code || !selectedSpecialty || !selectedSemester) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    try {
      const ueData: UniteEnseignement = {
        id: editingUE?.id || Date.now().toString(),
        code: currentUE.code!,
        name: currentUE.name!,
        ects: currentUE.ects || 0,
        coefficient: currentUE.coefficient || 1,
        semester: parseInt(selectedSemester.replace('S', '')),
        character: currentUE.character || 'obligatoire',
        unitType: currentUE.unitType || 'fondamentale',
        prerequisites: currentUE.prerequisites || [],
        evaluationMethods: currentUE.evaluationMethods || [],
        subjects: editingUE?.subjects || [],
        formationId: selectedSpecialty
      };

      // Sauvegarder dans le service academicConfigService
      await academicConfigService.saveUniteEnseignement(ueData);

      if (editingUE) {
        setUniteEnseignements(prev => prev.map(ue => ue.id === editingUE.id ? ueData : ue));
        toast({
          title: "Succès",
          description: "Unité d'enseignement modifiée avec succès"
        });
      } else {
        setUniteEnseignements(prev => [...prev, ueData]);
        toast({
          title: "Succès",
          description: "Unité d'enseignement créée avec succès"
        });
      }

      setShowUEDialog(false);
      setCurrentUE({});
      setEditingUE(null);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la sauvegarde",
        variant: "destructive"
      });
    }
  };

  const handleDeleteUE = async (ueId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette UE et tous ses modules ?")) {
      try {
        // Supprimer dans le service
        await academicConfigService.deleteUniteEnseignement(ueId);
        
        setUniteEnseignements(prev => prev.filter(ue => ue.id !== ueId));
        toast({
          title: "Succès",
          description: "Unité d'enseignement supprimée avec succès"
        });
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Erreur lors de la suppression",
          variant: "destructive"
        });
      }
    }
  };

  const handleSaveSubject = async () => {
    if (!currentSubject.name || !currentSubject.code || !selectedUEId) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    try {
      const subjectData: Subject = {
        id: editingSubject?.id || Date.now().toString(),
        code: currentSubject.code!,
        name: currentSubject.name!,
        ueId: selectedUEId,
        hours: currentSubject.hours || { cm: 0, td: 0, tp: 0 },
        credits: currentSubject.credits || 0,
        coefficient: currentSubject.coefficient || 1,
        moduleType: currentSubject.moduleType || 'cours',
        responsibleId: currentSubject.responsibleId || '',
        responsibleName: currentSubject.responsibleName || '',
        resources: currentSubject.resources || []
      };

      // Sauvegarder dans le service academicConfigService
      await academicConfigService.saveSubject(subjectData);

      setUniteEnseignements(prev => prev.map(ue => {
        if (ue.id === selectedUEId) {
          const updatedSubjects = editingSubject
            ? ue.subjects.map(s => s.id === editingSubject.id ? subjectData : s)
            : [...ue.subjects, subjectData];
          return { ...ue, subjects: updatedSubjects };
        }
        return ue;
      }));

      setShowSubjectDialog(false);
      setCurrentSubject({});
      setEditingSubject(null);
      
      toast({
        title: "Succès",
        description: editingSubject ? "Module modifié avec succès" : "Module créé avec succès"
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la sauvegarde",
        variant: "destructive"
      });
    }
  };

  const handleDeleteSubject = async (ueId: string, subjectId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce module ?")) {
      try {
        // Supprimer dans le service
        await academicConfigService.deleteSubject(subjectId);
        
        setUniteEnseignements(prev => prev.map(ue => {
          if (ue.id === ueId) {
            return { ...ue, subjects: ue.subjects.filter(s => s.id !== subjectId) };
          }
          return ue;
        }));
        
        toast({
          title: "Succès",
          description: "Module supprimé avec succès"
        });
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Erreur lors de la suppression",
          variant: "destructive"
        });
      }
    }
  };

  const openUEDialog = (ue?: UniteEnseignement) => {
    if (ue) {
      setCurrentUE(ue);
      setEditingUE(ue);
    } else {
      setCurrentUE({});
      setEditingUE(null);
    }
    setShowUEDialog(true);
  };

  const openSubjectDialog = (ueId: string, subject?: Subject) => {
    setSelectedUEId(ueId);
    if (subject) {
      setCurrentSubject(subject);
      setEditingSubject(subject);
    } else {
      setCurrentSubject({});
      setEditingSubject(null);
    }
    setShowSubjectDialog(true);
  };

  const selectedSpecialtyData = specialties.find(s => s.id === selectedSpecialty);
  const availableSemesters = selectedSpecialtyData ? getAvailableSemestersForSpecialty(selectedSpecialtyData.duration) : [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            Gestion des Canevas LMD
          </CardTitle>
          <p className="text-slate-600">
            Créez et gérez les canevas de formation par spécialité et semestre
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Spécialité</Label>
              <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une spécialité" />
                </SelectTrigger>
                <SelectContent>
                  {specialties.map(specialty => (
                    <SelectItem key={specialty.id} value={specialty.id}>
                      <div className="flex items-center gap-2">
                        <School className="h-4 w-4" />
                        {specialty.name} ({specialty.code}) - {specialty.level}
                      </div>
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
          </div>

          {selectedSpecialtyData && selectedSemester && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Canevas pour:</strong> {selectedSpecialtyData.name} - {availableSemesters.find(s => s.value === selectedSemester)?.label}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedSpecialty && selectedSemester && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Unités d'Enseignement</CardTitle>
              <Button onClick={() => openUEDialog()} className="bg-green-600 hover:bg-green-700">
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle UE
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p>Chargement du canevas...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {uniteEnseignements.map((ue) => (
                  <div key={ue.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div>
                          <h3 className="font-semibold text-lg">{ue.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">{ue.code}</Badge>
                            <Badge variant="secondary">{ue.ects} ECTS</Badge>
                            <Badge variant="outline">Coeff: {ue.coefficient}</Badge>
                            <Badge variant={ue.character === 'obligatoire' ? 'default' : 'secondary'}>
                              {ue.character}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => openSubjectDialog(ue.id)}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Module
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => openUEDialog(ue)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDeleteUE(ue.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {ue.subjects.length > 0 && (
                      <div className="ml-4 space-y-2">
                        <h4 className="font-medium text-sm text-slate-700">Modules:</h4>
                        <div className="space-y-2">
                          {ue.subjects.map((subject) => (
                            <div key={subject.id} className="flex items-center justify-between p-3 bg-slate-50 rounded">
                              <div className="flex items-center gap-3">
                                <div>
                                  <span className="font-medium">{subject.name}</span>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="outline" className="text-xs">{subject.code}</Badge>
                                    <Badge variant="secondary" className="text-xs">
                                      Coeff: {subject.coefficient}
                                    </Badge>
                                    <div className="flex items-center gap-1 text-xs">
                                      <Clock className="h-3 w-3" />
                                      <span>CM: {subject.hours.cm}h</span>
                                      <span>TD: {subject.hours.td}h</span>
                                      <span>TP: {subject.hours.tp}h</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => openSubjectDialog(ue.id, subject)}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleDeleteSubject(ue.id, subject.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {uniteEnseignements.length === 0 && (
                  <div className="text-center py-8 text-slate-500">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                    <p>Aucune unité d'enseignement définie</p>
                    <p className="text-sm">Créez une nouvelle UE pour commencer</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Dialog UE */}
      <Dialog open={showUEDialog} onOpenChange={setShowUEDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingUE ? 'Modifier l\'UE' : 'Nouvelle Unité d\'Enseignement'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Code UE *</Label>
                <Input
                  value={currentUE.code || ''}
                  onChange={(e) => setCurrentUE(prev => ({ ...prev, code: e.target.value }))}
                  placeholder="ex: UE1"
                />
              </div>
              <div>
                <Label>Nom UE *</Label>
                <Input
                  value={currentUE.name || ''}
                  onChange={(e) => setCurrentUE(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="ex: Mathématiques 1"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>ECTS</Label>
                <Input
                  type="number"
                  value={currentUE.ects || ''}
                  onChange={(e) => setCurrentUE(prev => ({ ...prev, ects: parseInt(e.target.value) || 0 }))}
                  min="1"
                  max="30"
                />
              </div>
              <div>
                <Label>Coefficient</Label>
                <Input
                  type="number"
                  value={currentUE.coefficient || ''}
                  onChange={(e) => setCurrentUE(prev => ({ ...prev, coefficient: parseInt(e.target.value) || 1 }))}
                  min="1"
                  max="10"
                />
              </div>
              <div>
                <Label>Caractère</Label>
                <Select 
                  value={currentUE.character || 'obligatoire'} 
                  onValueChange={(value) => setCurrentUE(prev => ({ ...prev, character: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="obligatoire">Obligatoire</SelectItem>
                    <SelectItem value="optionnel">Optionnel</SelectItem>
                    <SelectItem value="libre">Libre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Type d'unité</Label>
              <Select 
                value={currentUE.unitType || 'fondamentale'} 
                onValueChange={(value) => setCurrentUE(prev => ({ ...prev, unitType: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fondamentale">Fondamentale</SelectItem>
                  <SelectItem value="methodologique">Méthodologique</SelectItem>
                  <SelectItem value="decouverte">Découverte</SelectItem>
                  <SelectItem value="transversale">Transversale</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSaveUE} className="bg-green-600 hover:bg-green-700">
                <Save className="mr-2 h-4 w-4" />
                {editingUE ? 'Mettre à jour' : 'Créer'}
              </Button>
              <Button variant="outline" onClick={() => setShowUEDialog(false)}>
                <X className="mr-2 h-4 w-4" />
                Annuler
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Subject */}
      <Dialog open={showSubjectDialog} onOpenChange={setShowSubjectDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {editingSubject ? 'Modifier le Module' : 'Nouveau Module'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Code Module *</Label>
                <Input
                  value={currentSubject.code || ''}
                  onChange={(e) => setCurrentSubject(prev => ({ ...prev, code: e.target.value }))}
                  placeholder="ex: MAT101"
                />
              </div>
              <div>
                <Label>Nom Module *</Label>
                <Input
                  value={currentSubject.name || ''}
                  onChange={(e) => setCurrentSubject(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="ex: Algèbre linéaire"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <TimeSlotSelector
                value={currentSubject.hours?.cm || 0}
                onChange={(value) => setCurrentSubject(prev => ({ 
                  ...prev, 
                  hours: { ...prev.hours, cm: value, td: prev.hours?.td || 0, tp: prev.hours?.tp || 0 }
                }))}
                type="cm"
                label="Heures CM"
              />
              <TimeSlotSelector
                value={currentSubject.hours?.td || 0}
                onChange={(value) => setCurrentSubject(prev => ({ 
                  ...prev, 
                  hours: { ...prev.hours, td: value, cm: prev.hours?.cm || 0, tp: prev.hours?.tp || 0 }
                }))}
                type="td"
                label="Heures TD"
              />
              <TimeSlotSelector
                value={currentSubject.hours?.tp || 0}
                onChange={(value) => setCurrentSubject(prev => ({ 
                  ...prev, 
                  hours: { ...prev.hours, tp: value, cm: prev.hours?.cm || 0, td: prev.hours?.td || 0 }
                }))}
                type="tp"
                label="Heures TP"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Crédits</Label>
                <Input
                  type="number"
                  value={currentSubject.credits || ''}
                  onChange={(e) => setCurrentSubject(prev => ({ ...prev, credits: parseInt(e.target.value) || 0 }))}
                  min="1"
                  max="10"
                />
              </div>
              <div>
                <Label>Coefficient</Label>
                <Input
                  type="number"
                  value={currentSubject.coefficient || ''}
                  onChange={(e) => setCurrentSubject(prev => ({ ...prev, coefficient: parseInt(e.target.value) || 1 }))}
                  min="1"
                  max="5"
                />
              </div>
            </div>

            <div>
              <Label>Type de module</Label>
              <Select 
                value={currentSubject.moduleType || 'cours'} 
                onValueChange={(value) => setCurrentSubject(prev => ({ ...prev, moduleType: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cours">Cours</SelectItem>
                  <SelectItem value="seminaire">Séminaire</SelectItem>
                  <SelectItem value="atelier">Atelier</SelectItem>
                  <SelectItem value="projet">Projet</SelectItem>
                  <SelectItem value="stage">Stage</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSaveSubject} className="bg-green-600 hover:bg-green-700">
                <Save className="mr-2 h-4 w-4" />
                {editingSubject ? 'Mettre à jour' : 'Créer'}
              </Button>
              <Button variant="outline" onClick={() => setShowSubjectDialog(false)}>
                <X className="mr-2 h-4 w-4" />
                Annuler
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
