
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Save, X } from "lucide-react";

interface StudentStatsFormProps {
  onSave: (data: any) => void;
}

export const StudentStatsForm = ({ onSave }: StudentStatsFormProps) => {
  const [formData, setFormData] = useState({
    department: '',
    level: '',
    totalStudents: '',
    maleStudents: '',
    femaleStudents: '',
    foreignStudents: '',
    newEnrollments: '',
    successRate: '',
    date: new Date().toISOString().split('T')[0]
  });

  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation simple
    if (!formData.department || !formData.totalStudents) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    const processedData = {
      ...formData,
      totalStudents: parseInt(formData.totalStudents),
      maleStudents: parseInt(formData.maleStudents),
      femaleStudents: parseInt(formData.femaleStudents),
      foreignStudents: parseInt(formData.foreignStudents),
      newEnrollments: parseInt(formData.newEnrollments),
      successRate: parseFloat(formData.successRate)
    };

    onSave(processedData);
    toast({
      title: "Données sauvegardées",
      description: "Les statistiques étudiantes ont été enregistrées avec succès"
    });
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Save className="h-5 w-5" />
          Saisie des Statistiques Étudiantes
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
              <Label htmlFor="level">Niveau</Label>
              <Select value={formData.level} onValueChange={(value) => updateField('level', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un niveau" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="L1">Licence 1</SelectItem>
                  <SelectItem value="L2">Licence 2</SelectItem>
                  <SelectItem value="L3">Licence 3</SelectItem>
                  <SelectItem value="M1">Master 1</SelectItem>
                  <SelectItem value="M2">Master 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="totalStudents">Nombre Total d'Étudiants *</Label>
              <Input
                id="totalStudents"
                type="number"
                value={formData.totalStudents}
                onChange={(e) => updateField('totalStudents', e.target.value)}
                placeholder="Ex: 1247"
              />
            </div>

            <div>
              <Label htmlFor="maleStudents">Étudiants Masculins</Label>
              <Input
                id="maleStudents"
                type="number"
                value={formData.maleStudents}
                onChange={(e) => updateField('maleStudents', e.target.value)}
                placeholder="Ex: 623"
              />
            </div>

            <div>
              <Label htmlFor="femaleStudents">Étudiants Féminins</Label>
              <Input
                id="femaleStudents"
                type="number"
                value={formData.femaleStudents}
                onChange={(e) => updateField('femaleStudents', e.target.value)}
                placeholder="Ex: 624"
              />
            </div>

            <div>
              <Label htmlFor="foreignStudents">Étudiants Étrangers</Label>
              <Input
                id="foreignStudents"
                type="number"
                value={formData.foreignStudents}
                onChange={(e) => updateField('foreignStudents', e.target.value)}
                placeholder="Ex: 45"
              />
            </div>

            <div>
              <Label htmlFor="newEnrollments">Nouvelles Inscriptions</Label>
              <Input
                id="newEnrollments"
                type="number"
                value={formData.newEnrollments}
                onChange={(e) => updateField('newEnrollments', e.target.value)}
                placeholder="Ex: 156"
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
                placeholder="Ex: 87.1"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="date">Date de Référence</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => updateField('date', e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
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
