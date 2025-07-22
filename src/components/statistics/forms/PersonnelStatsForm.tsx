
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Save, X } from "lucide-react";

interface PersonnelStatsFormProps {
  onSave: (data: any) => void;
}

export const PersonnelStatsForm = ({ onSave }: PersonnelStatsFormProps) => {
  const [formData, setFormData] = useState({
    department: '',
    grade: '',
    totalPersonnel: '',
    teachers: '',
    administrative: '',
    technical: '',
    newRecruits: '',
    departures: '',
    vacantPositions: '',
    observations: '',
    date: new Date().toISOString().split('T')[0]
  });

  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.department || !formData.totalPersonnel) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    const processedData = {
      ...formData,
      totalPersonnel: parseInt(formData.totalPersonnel),
      teachers: parseInt(formData.teachers),
      administrative: parseInt(formData.administrative),
      technical: parseInt(formData.technical),
      newRecruits: parseInt(formData.newRecruits),
      departures: parseInt(formData.departures),
      vacantPositions: parseInt(formData.vacantPositions)
    };

    onSave(processedData);
    toast({
      title: "Données sauvegardées",
      description: "Les statistiques du personnel ont été enregistrées avec succès"
    });
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Saisie des Statistiques du Personnel
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
                  <SelectItem value="administration">Administration Générale</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="grade">Grade/Catégorie</Label>
              <Select value={formData.grade} onValueChange={(value) => updateField('grade', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professeur">Professeur</SelectItem>
                  <SelectItem value="maitre-conferences">Maître de Conférences</SelectItem>
                  <SelectItem value="maitre-assistant">Maître Assistant</SelectItem>
                  <SelectItem value="charge-cours">Chargé de Cours</SelectItem>
                  <SelectItem value="administratif">Personnel Administratif</SelectItem>
                  <SelectItem value="technique">Personnel Technique</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="totalPersonnel">Personnel Total *</Label>
              <Input
                id="totalPersonnel"
                type="number"
                value={formData.totalPersonnel}
                onChange={(e) => updateField('totalPersonnel', e.target.value)}
                placeholder="Ex: 142"
              />
            </div>

            <div>
              <Label htmlFor="teachers">Enseignants</Label>
              <Input
                id="teachers"
                type="number"
                value={formData.teachers}
                onChange={(e) => updateField('teachers', e.target.value)}
                placeholder="Ex: 100"
              />
            </div>

            <div>
              <Label htmlFor="administrative">Personnel Administratif</Label>
              <Input
                id="administrative"
                type="number"
                value={formData.administrative}
                onChange={(e) => updateField('administrative', e.target.value)}
                placeholder="Ex: 28"
              />
            </div>

            <div>
              <Label htmlFor="technical">Personnel Technique</Label>
              <Input
                id="technical"
                type="number"
                value={formData.technical}
                onChange={(e) => updateField('technical', e.target.value)}
                placeholder="Ex: 14"
              />
            </div>

            <div>
              <Label htmlFor="newRecruits">Nouveaux Recrutés</Label>
              <Input
                id="newRecruits"
                type="number"
                value={formData.newRecruits}
                onChange={(e) => updateField('newRecruits', e.target.value)}
                placeholder="Ex: 3"
              />
            </div>

            <div>
              <Label htmlFor="departures">Départs</Label>
              <Input
                id="departures"
                type="number"
                value={formData.departures}
                onChange={(e) => updateField('departures', e.target.value)}
                placeholder="Ex: 2"
              />
            </div>

            <div>
              <Label htmlFor="vacantPositions">Postes Vacants</Label>
              <Input
                id="vacantPositions"
                type="number"
                value={formData.vacantPositions}
                onChange={(e) => updateField('vacantPositions', e.target.value)}
                placeholder="Ex: 5"
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
                placeholder="Remarques ou informations complémentaires..."
                rows={3}
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
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
