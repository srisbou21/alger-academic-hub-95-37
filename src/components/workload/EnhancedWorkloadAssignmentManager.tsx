
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Edit, 
  Save, 
  X, 
  BookOpen, 
  Clock, 
  Users, 
  GraduationCap,
  AlertTriangle,
  CheckCircle,
  RefreshCw
} from "lucide-react";
import { TeacherWorkload, WorkloadAssignment } from "../../types/workload";
import { FormationOffer, PedagogicalAtom } from "../../types/academic";
import { workloadService } from "../../services/workloadService";
import { 
  workloadFormationService, 
  FormationModuleInfo, 
  FormationSectionInfo 
} from "../../services/workloadFormationService";
import { useToast } from "@/hooks/use-toast";

interface EnhancedWorkloadAssignmentManagerProps {
  academicYear?: string;
  onWorkloadUpdate: () => void;
}

export const EnhancedWorkloadAssignmentManager = ({ 
  academicYear = "2024-2025", 
  onWorkloadUpdate 
}: EnhancedWorkloadAssignmentManagerProps) => {
  const { toast } = useToast();
  const [workloads, setWorkloads] = useState<TeacherWorkload[]>([]);
  const [formations, setFormations] = useState<FormationOffer[]>([]);
  const [selectedWorkload, setSelectedWorkload] = useState<TeacherWorkload | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // État pour le formulaire d'attribution
  const [selectedFormationId, setSelectedFormationId] = useState("");
  const [availableModules, setAvailableModules] = useState<FormationModuleInfo[]>([]);
  const [selectedModuleId, setSelectedModuleId] = useState("");
  const [availableSections, setAvailableSections] = useState<FormationSectionInfo[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [selectedAtomId, setSelectedAtomId] = useState("");
  const [targetType, setTargetType] = useState<'section' | 'group'>('section');
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [validationMessage, setValidationMessage] = useState<{ type: 'error' | 'success', message: string } | null>(null);

  useEffect(() => {
    loadData();
  }, [academicYear]);

  // Charger les modules quand une formation est sélectionnée
  useEffect(() => {
    if (selectedFormationId) {
      loadModules();
      loadSections();
    }
  }, [selectedFormationId]);

  // Valider l'attribution quand les paramètres changent
  useEffect(() => {
    validateCurrentAssignment();
  }, [selectedModuleId, selectedAtomId, selectedSectionId, targetType, selectedGroupId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [workloadData, formationData] = await Promise.all([
        workloadService.getTeacherWorkloads(academicYear),
        workloadFormationService.getAvailableFormations(academicYear)
      ]);
      setWorkloads(workloadData);
      setFormations(formationData);
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

  const loadModules = async () => {
    if (!selectedFormationId) return;
    
    try {
      const modules = await workloadFormationService.getFormationModules(selectedFormationId);
      setAvailableModules(modules);
    } catch (error) {
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
      const sections = await workloadFormationService.getFormationSections(selectedFormationId, academicYear);
      setAvailableSections(sections);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les sections",
        variant: "destructive"
      });
    }
  };

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
      const hours = workloadFormationService.calculateAtomHours(
        atom, 
        targetType === 'group' 
          ? section.groups.find(g => g.id === selectedGroupId)?.capacity || section.capacity
          : section.capacity
      );
      setValidationMessage({ 
        type: 'success', 
        message: `Attribution valide - ${hours.totalHours}h au total (${hours.hoursPerWeek}h/semaine × ${hours.totalWeeks} semaines)` 
      });
    } else {
      setValidationMessage({ type: 'error', message: validation.message || 'Attribution invalide' });
    }
  };

  const handleCreateAssignment = (workload: TeacherWorkload) => {
    setSelectedWorkload(workload);
    resetForm();
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setSelectedFormationId("");
    setAvailableModules([]);
    setSelectedModuleId("");
    setAvailableSections([]);
    setSelectedSectionId("");
    setSelectedAtomId("");
    setTargetType('section');
    setSelectedGroupId("");
    setValidationMessage(null);
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

    const module = availableModules.find(m => m.id === selectedModuleId);
    const atom = module?.atoms.find(a => a.id === selectedAtomId);
    const section = availableSections.find(s => s.id === selectedSectionId);
    const formation = formations.find(f => f.id === selectedFormationId);

    if (!module || !atom || !section || !formation) {
      toast({
        title: "Erreur",
        description: "Données invalides pour l'attribution",
        variant: "destructive"
      });
      return;
    }

    // Calculer les heures
    const targetCapacity = targetType === 'group' 
      ? section.groups.find(g => g.id === selectedGroupId)?.capacity || section.capacity
      : section.capacity;

    const hours = workloadFormationService.calculateAtomHours(atom, targetCapacity);

    // Créer l'attribution
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

    try {
      await workloadService.updateWorkloadAssignment(selectedWorkload.id, newAssignment);
      toast({
        title: "Succès",
        description: "Attribution créée avec succès"
      });
      setIsDialogOpen(false);
      onWorkloadUpdate();
      loadData();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer l'attribution",
        variant: "destructive"
      });
    }
  };

  const selectedModule = availableModules.find(m => m.id === selectedModuleId);
  const selectedSection = availableSections.find(s => s.id === selectedSectionId);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-blue-600" />
            Gestion Avancée des Charges d'Enseignement
          </CardTitle>
          <p className="text-slate-600">
            Attribution des modules aux enseignants avec relations formations-sections-atomes
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button onClick={loadData} disabled={loading} variant="outline">
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
            <Badge variant="outline">
              Année: {academicYear}
            </Badge>
            <Badge variant="outline">
              {formations.length} formation(s) disponible(s)
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {workloads.map((workload) => (
          <Card key={workload.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{workload.teacherName}</h3>
                  <p className="text-sm text-slate-600">
                    {workload.academicYear} - {workload.semester}
                  </p>
                  <div className="flex gap-4 mt-2">
                    <span className="text-sm">
                      <Clock className="inline h-4 w-4 mr-1" />
                      {workload.totalHours}h / {workload.maxHours}h
                    </span>
                    <Badge variant={
                      workload.status === 'overload' ? 'destructive' : 
                      workload.status === 'underload' ? 'secondary' : 
                      'default'
                    }>
                      {workload.status === 'overload' ? 'Surcharge' : 
                       workload.status === 'underload' ? 'Sous-charge' : 
                       'Normal'}
                    </Badge>
                  </div>
                </div>
                <Button 
                  onClick={() => handleCreateAssignment(workload)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Nouvelle Attribution
                </Button>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">
                  Attributions actuelles ({workload.assignments.length}):
                </p>
                {workload.assignments.map((assignment) => (
                  <div key={assignment.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
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
                    </div>
                  </div>
                ))}
                {workload.assignments.length === 0 && (
                  <p className="text-sm text-slate-500 italic">Aucune attribution pour le moment</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Nouvelle Attribution - {selectedWorkload?.teacherName}
            </DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="selection" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="selection">Sélection</TabsTrigger>
              <TabsTrigger value="details">Détails & Validation</TabsTrigger>
            </TabsList>

            <TabsContent value="selection" className="space-y-4">
              {/* Sélection de la formation */}
              <div>
                <Label htmlFor="formation">Formation *</Label>
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
                  <Label htmlFor="module">Module *</Label>
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
                  <Label htmlFor="atom">Atome Pédagogique *</Label>
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
                  <Label htmlFor="section">Section *</Label>
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
                  <Label htmlFor="targetType">Public Cible *</Label>
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
                  <Label htmlFor="group">Groupe *</Label>
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
                  {validationMessage.type === 'error' ? 
                    <AlertTriangle className="h-4 w-4" /> : 
                    <CheckCircle className="h-4 w-4" />
                  }
                  <AlertDescription>{validationMessage.message}</AlertDescription>
                </Alert>
              )}

              {/* Résumé de l'attribution */}
              {selectedModule && selectedSection && selectedAtomId && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Résumé de l'Attribution</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium">Formation:</p>
                        <p className="text-slate-600">{formations.find(f => f.id === selectedFormationId)?.name}</p>
                      </div>
                      <div>
                        <p className="font-medium">Module:</p>
                        <p className="text-slate-600">{selectedModule.name} ({selectedModule.code})</p>
                      </div>
                      <div>
                        <p className="font-medium">Atome:</p>
                        <p className="text-slate-600">
                          {selectedModule.atoms.find(a => a.id === selectedAtomId)?.type.toUpperCase()}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">Public:</p>
                        <p className="text-slate-600">
                          {targetType === 'group' 
                            ? selectedSection.groups.find(g => g.id === selectedGroupId)?.name
                            : selectedSection.name}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>

          <div className="flex gap-2 pt-4">
            <Button 
              onClick={handleSaveAssignment} 
              disabled={!validationMessage || validationMessage.type === 'error'}
              className="bg-green-600 hover:bg-green-700"
            >
              <Save className="mr-2 h-4 w-4" />
              Créer l'Attribution
            </Button>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              <X className="mr-2 h-4 w-4" />
              Annuler
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {workloads.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600">Aucune charge d'enseignement trouvée</p>
            <p className="text-sm text-slate-500">
              Les charges seront créées automatiquement lors de l'attribution des modules
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
