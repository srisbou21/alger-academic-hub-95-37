
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Save, X } from "lucide-react";

interface AcademicStatsFormProps {
  onSave: (data: any) => void;
}

export const AcademicStatsForm = ({ onSave }: AcademicStatsFormProps) => {
  const [formData, setFormData] = useState({
    department: '',
    semester: '',
    totalCourses: '',
    theoreticalCourses: '',
    practicalCourses: '',
    teachingHours: '',
    averageGrade: '',
    successRate: '',
    evaluationMethod: '',
    participants: '',
    observations: '',
    date: new Date().toISOString().split('T')[0]
  });

  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.department || !formData.totalCourses) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    const processedData = {
      ...formData,
      totalCourses: parseInt(formData.totalCourses),
      theoreticalCourses: parseInt(formData.theoreticalCourses),
      practicalCourses: parseInt(formData.practicalCourses),
      teachingHours: parseInt(formData.teachingHours),
      averageGrade: parseFloat(formData.averageGrade),
      successRate: parseFloat(formData.successRate),
      participants: parseInt(formData.participants)
    };

    onSave(processedData);
    toast({
      title: "Données sauvegardées",
      description: "Les statistiques académiques ont été enregistrées avec succès"
    });
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Saisie des Statistiques Académiques
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="department">Département *</Label>
              <Select value={formData.department} onValueChange={(value) => updateField('department', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un département" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sciences-economiques">Sciences Économiques</SelectItem>
                  <SelectItem value="sciences-gestion">Sciences de Gestion</SelectItem>
                  <SelectItem value="sciences-commerciales">Sciences Commerciales</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="semester">Semestre</Label>
              <Select value={formData.semester} onValueChange={(value) => updateField('semester', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un semestre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="S1">Semestre 1</SelectItem>
                  <SelectItem value="S2">Semestre 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="totalCourses">Nombre Total de Cours *</Label>
              <Input
                id="totalCourses"
                type="number"
                value={formData.totalCourses}
                onChange={(e) => updateField('totalCourses', e.target.value)}
                placeholder="Ex: 115"
              />
            </div>

            <div>
              <Label htmlFor="theoreticalCourses">Cours Théoriques</Label>
              <Input
                id="theoreticalCourses"
                type="number"
                value={formData.theoreticalCourses}
                onChange={(e) => updateField('theoreticalCourses', e.target.value)}
                placeholder="Ex: 72"
              />
            </div>

            <div>
              <Label htmlFor="practicalCourses">Cours Pratiques</Label>
              <Input
                id="practicalCourses"
                type="number"
                value={formData.practicalCourses}
                onChange={(e) => updateField('practicalCourses', e.target.value)}
                placeholder="Ex: 43"
              />
            </div>

            <div>
              <Label htmlFor="teachingHours">Heures d'Enseignement</Label>
              <Input
                id="teachingHours"
                type="number"
                value={formData.teachingHours}
                onChange={(e) => updateField('teachingHours', e.target.value)}
                placeholder="Ex: 1725"
              />
            </div>

            <div>
              <Label htmlFor="averageGrade">Moyenne Générale (/20)</Label>
              <Input
                id="averageGrade"
                type="number"
                step="0.01"
                max="20"
                value={formData.averageGrade}
                onChange={(e) => updateField('averageGrade', e.target.value)}
                placeholder="Ex: 12.8"
              />
            </div>

            <div>
              <Label htmlFor="successRate">Taux de Réussite (%)</Label>
              <Input
                id="successRate"
                type="number"
                step="0.1"
                max="100"
                value={formData.successRate}
                onChange={(e) => updateField('successRate', e.target.value)}
                placeholder="Ex: 80.3"
              />
            </div>

            <div>
              <Label htmlFor="evaluationMethod">Méthode d'Évaluation</Label>
              <Select value={formData.evaluationMethod} onValueChange={(value) => updateField('evaluationMethod', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une méthode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="examen-final">Examens Finaux</SelectItem>
                  <SelectItem value="controle-continu">Contrôle Continu</SelectItem>
                  <SelectItem value="projets">Projets</SelectItem>
                  <SelectItem value="mixte">Méthode Mixte</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="participants">Nombre de Participants</Label>
              <Input
                id="participants"
                type="number"
                value={formData.participants}
                onChange={(e) => updateField('participants', e.target.value)}
                placeholder="Ex: 2847"
              />
            </div>

            <div>
              <Label htmlFor="date">Date de Référence</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => updateField('date', e.target.value)}
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="observations">Observations</Label>
              <Textarea
                id="observations"
                value={formData.observations}
                onChange={(e) => updateField('observations', e.target.value)}
                placeholder="Remarques sur les performances académiques..."
                rows={3}
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder
            </Button>
            <Button type="button" variant="outline">
              <X className="h-4 w-4 mr-2" />
              Annuler
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
