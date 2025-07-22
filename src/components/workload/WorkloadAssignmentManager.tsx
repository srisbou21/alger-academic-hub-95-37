import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Save, X, BookOpen, Clock, Users } from "lucide-react";
import { TeacherWorkload, WorkloadAssignment } from "../../types/workload";
import { FormationOffer, Module } from "../../types/academic";
import { workloadService } from "../../services/workloadService";
import { formationOfferService } from "../../services/formationOfferService";
import { useToast } from "@/hooks/use-toast";

interface WorkloadAssignmentManagerProps {
  academicYear?: string;
  onWorkloadUpdate: () => void;
}

export const WorkloadAssignmentManager = ({ academicYear = "2024-2025", onWorkloadUpdate }: WorkloadAssignmentManagerProps) => {
  const { toast } = useToast();
  const [workloads, setWorkloads] = useState<TeacherWorkload[]>([]);
  const [formationOffers, setFormationOffers] = useState<FormationOffer[]>([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [selectedWorkload, setSelectedWorkload] = useState<TeacherWorkload | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [assignmentForm, setAssignmentForm] = useState({
    moduleId: '',
    moduleName: '',
    formationOfferId: '',
    formationName: '',
    atomType: 'cours' as 'cours' | 'td' | 'tp' | 'stage',
    targetAudienceType: 'section' as 'section' | 'group',
    targetAudienceId: '',
    targetAudienceName: '',
    targetAudienceCapacity: 40,
    hoursPerWeek: 1.5,
    totalWeeks: 16,
    coefficient: 1.0
  });

  useEffect(() => {
    loadData();
  }, [academicYear]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [workloadData, offerData] = await Promise.all([
        workloadService.getTeacherWorkloads(academicYear),
        formationOfferService.getFormationOffers()
      ]);
      setWorkloads(workloadData);
      setFormationOffers(offerData);
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

  const handleCreateAssignment = (workload: TeacherWorkload) => {
    setSelectedWorkload(workload);
    setAssignmentForm({
      moduleId: '',
      moduleName: '',
      formationOfferId: '',
      formationName: '',
      atomType: 'cours',
      targetAudienceType: 'section',
      targetAudienceId: '',
      targetAudienceName: '',
      targetAudienceCapacity: 40,
      hoursPerWeek: 1.5,
      totalWeeks: 16,
      coefficient: 1.0
    });
    setIsDialogOpen(true);
  };

  const handleSaveAssignment = async () => {
    if (!selectedWorkload || !assignmentForm.moduleName || !assignmentForm.formationOfferId) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    const totalHours = assignmentForm.hoursPerWeek * assignmentForm.totalWeeks;
    
    const newAssignment: WorkloadAssignment = {
      id: `assign_${Date.now()}`,
      moduleId: assignmentForm.moduleId || `mod_${Date.now()}`,
      moduleName: assignmentForm.moduleName,
      specialtyId: assignmentForm.formationOfferId,
      specialtyName: assignmentForm.formationName,
      atomType: assignmentForm.atomType,
      targetAudience: {
        type: assignmentForm.targetAudienceType,
        id: assignmentForm.targetAudienceId || `target_${Date.now()}`,
        name: assignmentForm.targetAudienceName || `${assignmentForm.targetAudienceType} par défaut`,
        capacity: assignmentForm.targetAudienceCapacity
      },
      hoursPerWeek: assignmentForm.hoursPerWeek,
      totalWeeks: assignmentForm.totalWeeks,
      totalHours,
      coefficient: assignmentForm.coefficient,
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

  const getFormationName = (offerId: string) => {
    const offer = formationOffers.find(o => o.id === offerId);
    return offer?.name || 'Formation inconnue';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Attribution des Modules aux Enseignants</h3>
      </div>

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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Nouvelle Attribution - {selectedWorkload?.teacherName}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="moduleName">Nom du Module *</Label>
                <Input
                  id="moduleName"
                  value={assignmentForm.moduleName}
                  onChange={(e) => setAssignmentForm(prev => ({ ...prev, moduleName: e.target.value }))}
                  placeholder="ex: Programmation Java"
                />
              </div>
              <div>
                <Label htmlFor="atomType">Type d'Atome Pédagogique *</Label>
                <Select 
                  value={assignmentForm.atomType} 
                  onValueChange={(value: 'cours' | 'td' | 'tp' | 'stage') => 
                    setAssignmentForm(prev => ({ ...prev, atomType: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cours">Cours Magistral</SelectItem>
                    <SelectItem value="td">Travaux Dirigés</SelectItem>
                    <SelectItem value="tp">Travaux Pratiques</SelectItem>
                    <SelectItem value="stage">Stage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="formation">Offre de Formation *</Label>
              <Select 
                value={assignmentForm.formationOfferId} 
                onValueChange={(value) => {
                  const offer = formationOffers.find(o => o.id === value);
                  setAssignmentForm(prev => ({ 
                    ...prev, 
                    formationOfferId: value,
                    formationName: offer?.name || ''
                  }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une formation" />
                </SelectTrigger>
                <SelectContent>
                  {formationOffers.map(offer => (
                    <SelectItem key={offer.id} value={offer.id}>
                      {offer.name} - {offer.level} ({offer.academicYear})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="targetType">Public Cible *</Label>
                <Select 
                  value={assignmentForm.targetAudienceType}
                  onValueChange={(value: 'section' | 'group') => 
                    setAssignmentForm(prev => ({ ...prev, targetAudienceType: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="section">Section</SelectItem>
                    <SelectItem value="group">Groupe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="targetName">Nom du Public *</Label>
                <Input
                  id="targetName"
                  value={assignmentForm.targetAudienceName}
                  onChange={(e) => setAssignmentForm(prev => ({ ...prev, targetAudienceName: e.target.value }))}
                  placeholder="ex: Section A, Groupe TD1"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="hoursPerWeek">Heures/Semaine</Label>
                <Input
                  id="hoursPerWeek"
                  type="number"
                  step="0.5"
                  value={assignmentForm.hoursPerWeek}
                  onChange={(e) => setAssignmentForm(prev => ({ ...prev, hoursPerWeek: parseFloat(e.target.value) }))}
                />
              </div>
              <div>
                <Label htmlFor="totalWeeks">Nombre de Semaines</Label>
                <Input
                  id="totalWeeks"
                  type="number"
                  value={assignmentForm.totalWeeks}
                  onChange={(e) => setAssignmentForm(prev => ({ ...prev, totalWeeks: parseInt(e.target.value) }))}
                />
              </div>
              <div>
                <Label htmlFor="coefficient">Coefficient</Label>
                <Input
                  id="coefficient"
                  type="number"
                  step="0.1"
                  value={assignmentForm.coefficient}
                  onChange={(e) => setAssignmentForm(prev => ({ ...prev, coefficient: parseFloat(e.target.value) }))}
                />
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-blue-800">Calcul automatique:</p>
              <p className="text-sm text-blue-700">
                Total d'heures: {assignmentForm.hoursPerWeek * assignmentForm.totalWeeks}h
              </p>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSaveAssignment} className="bg-green-600 hover:bg-green-700">
                <Save className="mr-2 h-4 w-4" />
                Créer l'Attribution
              </Button>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                <X className="mr-2 h-4 w-4" />
                Annuler
              </Button>
            </div>
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
