
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Users, 
  Award, 
  History, 
  Plus,
  TrendingUp,
  Calendar
} from "lucide-react";
import { Teacher } from "../../types/teacher";
import { Echelon, TeacherEchelon } from "../../types/echelon";
import { echelonService } from "../../services/echelonService";
import { teacherService } from "../../services/teacherService";
import { useToast } from "@/hooks/use-toast";

export const TeacherEchelonAssignment = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [echelons, setEchelons] = useState<Echelon[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [selectedEchelon, setSelectedEchelon] = useState<string>("");
  const [motif, setMotif] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [teacherEchelons, setTeacherEchelons] = useState<Array<{teacher: Teacher, echelon: Echelon, affectation: TeacherEchelon}>>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [teachersData, gradeEchelons] = await Promise.all([
        teacherService.getAllTeachers(),
        echelonService.getAllGradeEchelons()
      ]);
      
      setTeachers(teachersData);
      const allEchelons = gradeEchelons.flatMap(g => g.echelons);
      setEchelons(allEchelons);

      // Charger les affectations actuelles
      const currentAssignments = [];
      for (const teacher of teachersData) {
        const assignment = await echelonService.getTeacherCurrentEchelon(teacher.id);
        if (assignment) {
          currentAssignments.push({
            teacher,
            echelon: assignment.echelon,
            affectation: assignment.affectation
          });
        }
      }
      setTeacherEchelons(currentAssignments);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les données",
        variant: "destructive"
      });
    }
  };

  const handleAssignEchelon = async () => {
    if (!selectedTeacher || !selectedEchelon) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un enseignant et un échelon",
        variant: "destructive"
      });
      return;
    }

    try {
      await echelonService.affectTeacherToEchelon(selectedTeacher.id, selectedEchelon, motif);
      toast({
        title: "Succès",
        description: "Échelon affecté avec succès"
      });
      setIsDialogOpen(false);
      setSelectedTeacher(null);
      setSelectedEchelon("");
      setMotif("");
      loadData();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'affecter l'échelon",
        variant: "destructive"
      });
    }
  };

  const getEchelonsForGrade = (currentGrade: string) => {
    return echelons.filter(e => e.grade === currentGrade && e.statut === 'actif');
  };

  const calculateAnciennete = (dateOfBirth: Date) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    return today.getFullYear() - birthDate.getFullYear();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Award className="h-6 w-6" />
              Affectation des Échelons aux Enseignants
            </CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle Affectation
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Affecter un Échelon</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Enseignant</Label>
                    <Select 
                      value={selectedTeacher?.id || ""} 
                      onValueChange={(value) => {
                        const teacher = teachers.find(t => t.id === value);
                        setSelectedTeacher(teacher || null);
                        setSelectedEchelon(""); // Reset échelon when teacher changes
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un enseignant" />
                      </SelectTrigger>
                      <SelectContent>
                        {teachers.map((teacher) => (
                          <SelectItem key={teacher.id} value={teacher.id}>
                            {teacher.personalInfo.firstName} {teacher.personalInfo.lastName} - {teacher.professionalInfo.currentGrade}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedTeacher && (
                    <div className="space-y-2">
                      <Label>Échelon</Label>
                      <Select value={selectedEchelon} onValueChange={setSelectedEchelon}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un échelon" />
                        </SelectTrigger>
                        <SelectContent>
                          {getEchelonsForGrade(selectedTeacher.professionalInfo.currentGrade).map((echelon) => (
                            <SelectItem key={echelon.id} value={echelon.id}>
                              Échelon {echelon.echelon} - Indice {echelon.indice} ({echelon.salaire_base.toLocaleString()} DA)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Motif de l'affectation</Label>
                    <Textarea
                      value={motif}
                      onChange={(e) => setMotif(e.target.value)}
                      placeholder="Motif de l'affectation (promotion, titularisation, etc.)"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleAssignEchelon}>
                    Affecter
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Enseignants avec Échelon</p>
                <p className="text-3xl font-bold text-blue-600">{teacherEchelons.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Salaire Moyen</p>
                <p className="text-3xl font-bold text-green-600">
                  {teacherEchelons.length > 0 
                    ? Math.round(teacherEchelons.reduce((sum, te) => 
                        sum + echelonService.calculateSalaryWithEchelon(te.echelon), 0
                      ) / teacherEchelons.length).toLocaleString()
                    : 0
                  }
                </p>
                <p className="text-xs text-green-500">DA</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Promotions Cette Année</p>
                <p className="text-3xl font-bold text-purple-600">12</p>
              </div>
              <Award className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">En Attente Promotion</p>
                <p className="text-3xl font-bold text-orange-600">8</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des affectations actuelles */}
      <Card>
        <CardHeader>
          <CardTitle>Affectations Actuelles</CardTitle>
        </CardHeader>
        <CardContent>
          {teacherEchelons.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-500">Aucune affectation d'échelon trouvée</p>
            </div>
          ) : (
            <div className="space-y-4">
              {teacherEchelons.map(({ teacher, echelon, affectation }) => (
                <div key={teacher.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">
                          {teacher.personalInfo.firstName} {teacher.personalInfo.lastName}
                        </h3>
                        <Badge>{teacher.professionalInfo.currentGrade}</Badge>
                        <Badge variant="outline">Échelon {echelon.echelon}</Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Indice:</span> {echelon.indice}
                        </div>
                        <div>
                          <span className="font-medium">Salaire calculé:</span> 
                          <span className="text-green-600 font-semibold ml-1">
                            {echelonService.calculateSalaryWithEchelon(
                              echelon, 
                              calculateAnciennete(teacher.personalInfo.dateOfBirth)
                            ).toLocaleString()} DA
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">Affecté le:</span> {new Date(affectation.date_affectation).toLocaleDateString('fr-FR')}
                        </div>
                      </div>

                      {affectation.motif_changement && (
                        <div className="mt-2 text-sm">
                          <span className="font-medium">Motif:</span> {affectation.motif_changement}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <History className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
