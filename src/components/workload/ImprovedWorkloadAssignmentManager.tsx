
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Plus, 
  Save, 
  X, 
  BookOpen, 
  Clock, 
  Users, 
  GraduationCap,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Eye,
  Edit,
  Trash2
} from "lucide-react";
import { TeacherWorkload, WorkloadAssignment } from "../../types/workload";
import { FormationOffer } from "../../types/academic";
import { workloadService } from "../../services/workloadService";
import { 
  workloadFormationService, 
  FormationModuleInfo, 
  FormationSectionInfo 
} from "../../services/workloadFormationService";
import { useToast } from "@/hooks/use-toast";

interface ImprovedWorkloadAssignmentManagerProps {
  academicYear?: string;
  onWorkloadUpdate: () => void;
}

export const ImprovedWorkloadAssignmentManager = ({ 
  academicYear = "2024-2025", 
  onWorkloadUpdate 
}: ImprovedWorkloadAssignmentManagerProps) => {
  const { toast } = useToast();
  
  // États principaux
  const [workloads, setWorkloads] = useState<TeacherWorkload[]>([]);
  const [formations, setFormations] = useState<FormationOffer[]>([]);
  const [selectedWorkload, setSelectedWorkload] = useState<TeacherWorkload | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // États pour le formulaire d'attribution
  const [selectedFormationId, setSelectedFormationId] = useState("");
  const [availableModules, setAvailableModules] = useState<FormationModuleInfo[]>([]);
  const [selectedModuleId, setSelectedModuleId] = useState("");
  const [availableSections, setAvailableSections] = useState<FormationSectionInfo[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [selectedAtomId, setSelectedAtomId] = useState("");
  const [targetType, setTargetType] = useState<'section' | 'group'>('section');
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [validationMessage, setValidationMessage] = useState<{ type: 'error' | 'success', message: string } | null>(null);
  const [formProgress, setFormProgress] = useState(0);

  useEffect(() => {
    loadData();
  }, [academicYear]);

  // Charger les données principales
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      console.log('Chargement des données de charge d\'enseignement...');
      const [workloadData, formationData] = await Promise.all([
        workloadService.getTeacherWorkloads(academicYear),
        workloadFormationService.getAvailableFormations(academicYear)
      ]);
      
      console.log(`${workloadData.length} charges trouvées, ${formationData.length} formations disponibles`);
      setWorkloads(workloadData);
      setFormations(formationData);
      
      toast({
        title: "Données chargées",
        description: `${workloadData.length} charges et ${formationData.length} formations trouvées`
      });
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [academicYear, toast]);

  // Charger les modules quand une formation est sélectionnée
  useEffect(() => {
    if (selectedFormationId) {
      loadModules();
      loadSections();
      setFormProgress(25);
    } else {
      setFormProgress(0);
    }
  }, [selectedFormationId]);

  // Mettre à jour le progrès du formulaire
  useEffect(() => {
    let progress = 0;
    if (selectedFormationId) progress += 25;
    if (selectedModuleId) progress += 25;
    if (selectedSectionId) progress += 25;
    if (selectedAtomId) progress += 25;
    setFormProgress(progress);
  }, [selectedFormationId, selectedModuleId, selectedSectionId, selectedAtomId]);

  const loadModules = async () => {
    if (!selectedFormationId) return;
    
    try {
      console.log(`Chargement des modules pour la formation: ${selectedFormationId}`);
      const modules = await workloadFormationService.getFormationModules(selectedFormationId);
      setAvailableModules(modules);
      
      if (modules.length === 0) {
        toast({
          title: "Attention",
          description: "Aucun module trouvé pour cette formation",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement des modules:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les modules",
        variant: "destructive"
      });
    }
  };

  const loadSections = async () => {
    if (!selectedFormationId) return;
    
    try {
      console.log(`Chargement des sections pour la formation: ${selectedFormationId}`);
      const sections = await workloadFormationService.getFormationSections(selectedFormationId, academicYear);
      setAvailableSections(sections);
      
      if (sections.length === 0) {
        toast({
          title: "Attention", 
          description: "Aucune section configurée, sections par défaut créées",
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement des sections:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les sections",
        variant: "destructive"
      });
    }
  };

  // Valider l'attribution en temps réel
  useEffect(() => {
    validateCurrentAssignment();
  }, [selectedModuleId, selectedAtomId, selectedSectionId, targetType, selectedGroupId]);

  const validateCurrentAssignment = () => {
    if (!selectedModuleId || !selectedAtomId || !selectedSectionId) {
      setValidationMessage(null);
      return;
    }

    const module = availableModules.find(m => m.id === selectedModuleId);
    const atom = module?.atoms.find(a => a.id === selectedAtomId);
    const section = availableSections.find(s => s.id === selectedSectionId);

    if (!module || !atom || !section) {
      setValidationMessage({ type: 'error', message: 'Sélection incomplète' });
      return;
    }

    const validation = workloadFormationService.validateAssignment(
      module, 
      atom, 
      section, 
      targetType, 
      selectedGroupId
    );

    if (validation.valid) {
      const targetCapacity = targetType === 'group' 
        ? section.groups.find(g => g.id === selectedGroupId)?.capacity || section.capacity
        : section.capacity;
        
      const hours = workloadFormationService.calculateAtomHours(atom, targetCapacity);
      
      setValidationMessage({ 
        type: 'success', 
        message: `Attribution valide - ${hours.totalHours}h au total (${hours.hoursPerWeek}h/semaine × ${hours.totalWeeks} semaines, ${hours.groupsNeeded} groupe(s))` 
      });
    } else {
      setValidationMessage({ type: 'error', message: validation.message || 'Attribution invalide' });
    }
  };

  const handleCreateAssignment = (workload: TeacherWorkload) => {
    console.log(`Création d'une nouvelle attribution pour: ${workload.teacherName}`);
    setSelectedWorkload(workload);
    resetForm();
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    console.log('Réinitialisation du formulaire');
    setSelectedFormationId("");
    setAvailableModules([]);
    setSelectedModuleId("");
    setAvailableSections([]);
    setSelectedSectionId("");
    setSelectedAtomId("");
    setTargetType('section');
    setSelectedGroupId("");
    setValidationMessage(null);
    setFormProgress(0);
  };

  const handleSaveAssignment = async () => {
    if (!selectedWorkload || !selectedFormationId || !selectedModuleId || !selectedAtomId || !selectedSectionId) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    if (validationMessage?.type === 'error') {
      toast({
        title: "Erreur",
        description: "Corrigez les erreurs de validation avant de sauvegarder",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);

    try {
      const module = availableModules.find(m => m.id === selectedModuleId);
      const atom = module?.atoms.find(a => a.id === selectedAtomId);
      const section = availableSections.find(s => s.id === selectedSectionId);
      const formation = formations.find(f => f.id === selectedFormationId);

      if (!module || !atom || !section || !formation) {
        throw new Error('Données invalides pour l\'attribution');
      }

      const targetCapacity = targetType === 'group' 
        ? section.groups.find(g => g.id === selectedGroupId)?.capacity || section.capacity
        : section.capacity;

      const hours = workloadFormationService.calculateAtomHours(atom, targetCapacity);

      const newAssignment: WorkloadAssignment = {
        id: `assign_${Date.now()}`,
        moduleId: module.id,
        moduleName: module.name,
        specialtyId: formation.id,
        specialtyName: formation.name,
        atomType: atom.type,
        targetAudience: {
          type: targetType,
          id: targetType === 'group' ? selectedGroupId : section.id,
          name: targetType === 'group' 
            ? section.groups.find(g => g.id === selectedGroupId)?.name || section.name
            : section.name,
          capacity: targetCapacity
        },
        hoursPerWeek: hours.hoursPerWeek,
        totalWeeks: hours.totalWeeks,
        totalHours: hours.totalHours,
        coefficient: module.coefficient,
        isConfirmed: false
      };

      console.log('Création de l\'attribution:', newAssignment);

      await workloadService.updateWorkloadAssignment(selectedWorkload.id, newAssignment);
      
      toast({
        title: "Succès",
        description: `Attribution créée: ${newAssignment.totalHours}h pour ${module.name}`
      });
      
      setIsDialogOpen(false);
      resetForm();
      onWorkloadUpdate();
      await loadData();
      
    } catch (error) {
      console.error('Erreur lors de la création de l\'attribution:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer l'attribution",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAssignment = async (workloadId: string, assignmentId: string) => {
    try {
      console.log(`Suppression de l'attribution ${assignmentId} de la charge ${workloadId}`);
      await workloadService.deleteWorkloadAssignment(workloadId, assignmentId);
      
      toast({
        title: "Succès",
        description: "Attribution supprimée"
      });
      
      onWorkloadUpdate();
      await loadData();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'attribution",
        variant: "destructive"
      });
    }
  };

  const handleConfirmAssignment = async (workloadId: string, assignmentId: string) => {
    try {
      console.log(`Confirmation de l'attribution ${assignmentId}`);
      await workloadService.confirmAssignment(workloadId, assignmentId);
      
      toast({
        title: "Succès",
        description: "Attribution confirmée"
      });
      
      await loadData();
    } catch (error) {
      console.error('Erreur lors de la confirmation:', error);
      toast({
        title: "Erreur",
        description: "Impossible de confirmer l'attribution",
        variant: "destructive"
      });
    }
  };

  const getWorkloadStatusColor = (status: string) => {
    switch (status) {
      case 'overload': return 'destructive';
      case 'underload': return 'secondary';
      default: return 'default';
    }
  };

  const getWorkloadStatusText = (status: string) => {
    switch (status) {
      case 'overload': return 'Surcharge';
      case 'underload': return 'Sous-charge';
      default: return 'Normal';
    }
  };

  const selectedModule = availableModules.find(m => m.id === selectedModuleId);
  const selectedSection = availableSections.find(s => s.id === selectedSectionId);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Chargement des données...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-blue-600" />
            Gestion Améliorée des Charges d'Enseignement
          </CardTitle>
          <p className="text-slate-600">
            Attribution intelligente des modules aux enseignants
          </p>
          <div className="flex items-center gap-4 mt-2">
            <Badge variant="outline">Année: {academicYear}</Badge>
            <Badge variant="outline">{formations.length} formation(s)</Badge>
            <Badge variant="outline">{workloads.length} enseignant(s)</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button onClick={loadData} disabled={loading} variant="outline">
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Actualiser les Données
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {workloads.map((workload) => (
          <Card key={workload.id} className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{workload.teacherName}</h3>
                  <p className="text-sm text-slate-600">
                    {workload.academicYear} - {workload.semester}
                  </p>
                  <div className="flex gap-4 mt-2">
                    <span className="text-sm flex items-center">
                      <Clock className="inline h-4 w-4 mr-1" />
                      {workload.totalHours}h / {workload.maxHours}h
                    </span>
                    <Badge variant={getWorkloadStatusColor(workload.status)}>
                      {getWorkloadStatusText(workload.status)}
                    </Badge>
                    {workload.overloadHours && (
                      <Badge variant="destructive">
                        +{workload.overloadHours}h surcharge
                      </Badge>
                    )}
                  </div>
                </div>
                <Button 
                  onClick={() => handleCreateAssignment(workload)}
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={loading}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Nouvelle Attribution
                </Button>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">
                  Attributions actuelles ({workload.assignments.length}):
                </p>
                {workload.assignments.length > 0 ? (
                  workload.assignments.map((assignment) => (
                    <div key={assignment.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-blue-600" />
                          <span className="font-medium">{assignment.moduleName}</span>
                          <Badge variant="outline">
                            {assignment.atomType.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 mt-1">
                          {assignment.specialtyName} - {assignment.targetAudience.name}
                        </p>
                        <div className="flex gap-4 text-sm text-slate-500 mt-1">
                          <span>{assignment.hoursPerWeek}h/semaine</span>
                          <span>{assignment.totalWeeks} semaines</span>
                          <span>Total: {assignment.totalHours}h</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={assignment.isConfirmed ? "default" : "secondary"}>
                          {assignment.isConfirmed ? "Confirmé" : "En attente"}
                        </Badge>
                        <Badge variant="outline">{assignment.totalHours}h</Badge>
                        {!assignment.isConfirmed && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleConfirmAssignment(workload.id, assignment.id)}
                            className="text-green-600 hover:text-green-800"
                          >
                            <CheckCircle className="h-3 w-3" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteAssignment(workload.id, assignment.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500 italic">Aucune attribution pour le moment</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog pour créer une nouvelle attribution */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Nouvelle Attribution - {selectedWorkload?.teacherName}
            </DialogTitle>
            <div className="mt-2">
              <Progress value={formProgress} className="h-2" />
              <p className="text-sm text-slate-600 mt-1">
                Progression: {formProgress}%
              </p>
            </div>
          </DialogHeader>
          
          <Tabs defaultValue="selection" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="selection">Sélection</TabsTrigger>
              <TabsTrigger value="details">Détails & Validation</TabsTrigger>
            </TabsList>

            <TabsContent value="selection" className="space-y-4">
              {/* Sélection de la formation */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Formation * ({formations.length} disponible(s))
                </label>
                <Select value={selectedFormationId} onValueChange={setSelectedFormationId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une formation" />
                  </SelectTrigger>
                  <SelectContent>
                    {formations.map(formation => (
                      <SelectItem key={formation.id} value={formation.id}>
                        {formation.name} - {formation.level} ({formation.academicYear})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sélection du module */}
              {selectedFormationId && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Module * ({availableModules.length} disponible(s))
                  </label>
                  <Select value={selectedModuleId} onValueChange={setSelectedModuleId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un module" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableModules.map(module => (
                        <SelectItem key={module.id} value={module.id}>
                          {module.name} ({module.code}) - {module.credits} ECTS - {module.semester}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Sélection de l'atome pédagogique */}
              {selectedModule && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Atome Pédagogique * ({selectedModule.atoms.length} disponible(s))
                  </label>
                  <Select value={selectedAtomId} onValueChange={setSelectedAtomId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un atome pédagogique" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedModule.atoms.map(atom => (
                        <SelectItem key={atom.id} value={atom.id}>
                          {atom.type.toUpperCase()} - {atom.hours}h total ({atom.totalWeeks} semaines) - Groupe max: {atom.groupSize}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Sélection de la section */}
              {selectedFormationId && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Section * ({availableSections.length} disponible(s))
                  </label>
                  <Select value={selectedSectionId} onValueChange={setSelectedSectionId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une section" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSections.map(section => (
                        <SelectItem key={section.id} value={section.id}>
                          {section.name} ({section.code}) - Capacité: {section.capacity}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Type de public cible */}
              {selectedSectionId && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Public Cible *
                  </label>
                  <Select value={targetType} onValueChange={(value: 'section' | 'group') => setTargetType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="section">Section complète</SelectItem>
                      <SelectItem value="group">Groupe spécifique</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Sélection du groupe si nécessaire */}
              {targetType === 'group' && selectedSection && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Groupe * ({selectedSection.groups.length} disponible(s))
                  </label>
                  <Select value={selectedGroupId} onValueChange={setSelectedGroupId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un groupe" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedSection.groups.map(group => (
                        <SelectItem key={group.id} value={group.id}>
                          {group.name} ({group.code}) - {group.type.toUpperCase()} - Capacité: {group.capacity}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              {/* Message de validation */}
              {validationMessage && (
                <Alert variant={validationMessage.type === 'error' ? 'destructive' : 'default'}>
                  {validationMessage.type === 'error' ? (
                    <AlertTriangle className="h-4 w-4" />
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                  <AlertDescription>
                    {validationMessage.message}
                  </AlertDescription>
                </Alert>
              )}

              {/* Détails de l'attribution si valide */}
              {validationMessage?.type === 'success' && selectedModule && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Résumé de l'Attribution</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-slate-600">Module</p>
                        <p className="font-medium">{selectedModule.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Formation</p>
                        <p className="font-medium">{formations.find(f => f.id === selectedFormationId)?.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Section/Groupe</p>
                        <p className="font-medium">
                          {targetType === 'group' 
                            ? selectedSection?.groups.find(g => g.id === selectedGroupId)?.name
                            : selectedSection?.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Type d'enseignement</p>
                        <p className="font-medium">{selectedModule.atoms.find(a => a.id === selectedAtomId)?.type.toUpperCase()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Boutons d'action */}
              <div className="flex justify-end gap-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  disabled={saving}
                >
                  <X className="mr-2 h-4 w-4" />
                  Annuler
                </Button>
                <Button 
                  onClick={handleSaveAssignment}
                  disabled={saving || !validationMessage || validationMessage.type === 'error'}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {saving ? (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  {saving ? 'Enregistrement...' : 'Enregistrer l\'Attribution'}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
};
