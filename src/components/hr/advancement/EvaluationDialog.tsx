
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface EvaluationForm {
  employeeId: string;
  evaluationYear: number;
  score: number;
  appreciation: 'Excellent' | 'Très satisfaisant' | 'Satisfaisant' | 'Assez bien' | 'Passable' | 'Insuffisant';
  criteria: {
    professionalCompetence: number;
    workQuality: number;
    initiative: number;
    teamwork: number;
    punctuality: number;
  };
  comments: string;
}

interface EvaluationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  evaluationForm: EvaluationForm;
  onFormChange: (form: EvaluationForm) => void;
  onSubmit: () => void;
}

export const EvaluationDialog: React.FC<EvaluationDialogProps> = ({
  isOpen,
  onClose,
  evaluationForm,
  onFormChange,
  onSubmit
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Créer une Évaluation</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>ID Employé</Label>
              <Input
                value={evaluationForm.employeeId}
                onChange={(e) => onFormChange({...evaluationForm, employeeId: e.target.value})}
                placeholder="ID de l'employé"
              />
            </div>
            <div className="space-y-2">
              <Label>Année d'évaluation</Label>
              <Input
                type="number"
                value={evaluationForm.evaluationYear}
                onChange={(e) => onFormChange({...evaluationForm, evaluationYear: parseInt(e.target.value)})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Appréciation générale</Label>
            <Select value={evaluationForm.appreciation} onValueChange={(value: any) => onFormChange({...evaluationForm, appreciation: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Excellent">Excellent</SelectItem>
                <SelectItem value="Très satisfaisant">Très satisfaisant</SelectItem>
                <SelectItem value="Satisfaisant">Satisfaisant</SelectItem>
                <SelectItem value="Assez bien">Assez bien</SelectItem>
                <SelectItem value="Passable">Passable</SelectItem>
                <SelectItem value="Insuffisant">Insuffisant</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <Label>Critères d'évaluation (sur 20)</Label>
            {Object.entries(evaluationForm.criteria).map(([key, value]) => (
              <div key={key} className="grid grid-cols-2 gap-4 items-center">
                <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</Label>
                <Input
                  type="number"
                  min="0"
                  max="20"
                  value={value}
                  onChange={(e) => onFormChange({
                    ...evaluationForm,
                    criteria: {
                      ...evaluationForm.criteria,
                      [key]: parseFloat(e.target.value) || 0
                    }
                  })}
                />
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label>Commentaires</Label>
            <Textarea
              value={evaluationForm.comments}
              onChange={(e) => onFormChange({...evaluationForm, comments: e.target.value})}
              placeholder="Commentaires sur l'évaluation..."
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={onSubmit}>
            Créer l'évaluation
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
