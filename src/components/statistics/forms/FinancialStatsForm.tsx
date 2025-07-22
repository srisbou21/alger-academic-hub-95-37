
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, Save, X } from "lucide-react";

interface FinancialStatsFormProps {
  onSave: (data: any) => void;
}

export const FinancialStatsForm = ({ onSave }: FinancialStatsFormProps) => {
  const [formData, setFormData] = useState({
    budgetCategory: '',
    allocatedBudget: '',
    executedBudget: '',
    personnelCosts: '',
    equipmentCosts: '',
    researchCosts: '',
    operatingCosts: '',
    costPerStudent: '',
    efficiency: '',
    fiscalYear: '',
    observations: '',
    date: new Date().toISOString().split('T')[0]
  });

  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.budgetCategory || !formData.allocatedBudget) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    const processedData = {
      ...formData,
      allocatedBudget: parseFloat(formData.allocatedBudget),
      executedBudget: parseFloat(formData.executedBudget),
      personnelCosts: parseFloat(formData.personnelCosts),
      equipmentCosts: parseFloat(formData.equipmentCosts),
      researchCosts: parseFloat(formData.researchCosts),
      operatingCosts: parseFloat(formData.operatingCosts),
      costPerStudent: parseFloat(formData.costPerStudent),
      efficiency: parseFloat(formData.efficiency)
    };

    onSave(processedData);
    toast({
      title: "Données sauvegardées",
      description: "Les statistiques financières ont été enregistrées avec succès"
    });
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Saisie des Statistiques Financières
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="budgetCategory">Catégorie Budgétaire *</Label>
              <Select value={formData.budgetCategory} onValueChange={(value) => updateField('budgetCategory', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personnel">Personnel</SelectItem>
                  <SelectItem value="equipement">Équipement</SelectItem>
                  <SelectItem value="recherche">Recherche</SelectItem>
                  <SelectItem value="fonctionnement">Fonctionnement</SelectItem>
                  <SelectItem value="global">Budget Global</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="fiscalYear">Année Fiscale</Label>
              <Select value={formData.fiscalYear} onValueChange={(value) => updateField('fiscalYear', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une année" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="allocatedBudget">Budget Alloué (DA) *</Label>
              <Input
                id="allocatedBudget"
                type="number"
                step="0.01"
                value={formData.allocatedBudget}
                onChange={(e) => updateField('allocatedBudget', e.target.value)}
                placeholder="Ex: 13000000"
              />
            </div>

            <div>
              <Label htmlFor="executedBudget">Budget Exécuté (DA)</Label>
              <Input
                id="executedBudget"
                type="number"
                step="0.01"
                value={formData.executedBudget}
                onChange={(e) => updateField('executedBudget', e.target.value)}
                placeholder="Ex: 8900000"
              />
            </div>

            <div>
              <Label htmlFor="personnelCosts">Coûts Personnel (DA)</Label>
              <Input
                id="personnelCosts"
                type="number"
                step="0.01"
                value={formData.personnelCosts}
                onChange={(e) => updateField('personnelCosts', e.target.value)}
                placeholder="Ex: 8500000"
              />
            </div>

            <div>
              <Label htmlFor="equipmentCosts">Coûts Équipement (DA)</Label>
              <Input
                id="equipmentCosts"
                type="number"
                step="0.01"
                value={formData.equipmentCosts}
                onChange={(e) => updateField('equipmentCosts', e.target.value)}
                placeholder="Ex: 2000000"
              />
            </div>

            <div>
              <Label htmlFor="researchCosts">Coûts Recherche (DA)</Label>
              <Input
                id="researchCosts"
                type="number"
                step="0.01"
                value={formData.researchCosts}
                onChange={(e) => updateField('researchCosts', e.target.value)}
                placeholder="Ex: 1500000"
              />
            </div>

            <div>
              <Label htmlFor="operatingCosts">Coûts Fonctionnement (DA)</Label>
              <Input
                id="operatingCosts"
                type="number"
                step="0.01"
                value={formData.operatingCosts}
                onChange={(e) => updateField('operatingCosts', e.target.value)}
                placeholder="Ex: 1000000"
              />
            </div>

            <div>
              <Label htmlFor="costPerStudent">Coût par Étudiant (DA)</Label>
              <Input
                id="costPerStudent"
                type="number"
                step="0.01"
                value={formData.costPerStudent}
                onChange={(e) => updateField('costPerStudent', e.target.value)}
                placeholder="Ex: 4567"
              />
            </div>

            <div>
              <Label htmlFor="efficiency">Efficacité (%)</Label>
              <Input
                id="efficiency"
                type="number"
                step="0.1"
                max="100"
                value={formData.efficiency}
                onChange={(e) => updateField('efficiency', e.target.value)}
                placeholder="Ex: 68.5"
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
                placeholder="Remarques sur l'exécution budgétaire..."
                rows={3}
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="bg-amber-600 hover:bg-amber-700">
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
