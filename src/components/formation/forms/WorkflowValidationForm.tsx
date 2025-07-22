
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertTriangle, MessageSquare, User } from "lucide-react";
import { FormationOffer, ValidationEntry } from "../../../types/academic";

interface WorkflowValidationFormProps {
  formation: FormationOffer;
  onValidate: (validation: ValidationEntry) => void;
  currentUserRole: string;
}

export const WorkflowValidationForm = ({ formation, onValidate, currentUserRole }: WorkflowValidationFormProps) => {
  const [validationAction, setValidationAction] = useState<'approved' | 'rejected' | ''>('');
  const [comments, setComments] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const handleSubmit = () => {
    if (!validationAction || !comments.trim()) return;

    const validation: ValidationEntry = {
      id: Date.now().toString(),
      validatorId: 'current-user',
      validatorName: currentUserRole,
      status: validationAction as 'approved' | 'rejected',
      comments: comments.trim(),
      date: new Date(),
      stage: getValidationStage()
    };

    onValidate(validation);
    setValidationAction('');
    setComments('');
    setPriority('medium');
  };

  const getValidationStage = (): 'pedagogical' | 'administrative' | 'final' => {
    switch (currentUserRole) {
      case 'responsable': return 'pedagogical';
      case 'admin': return 'administrative';
      case 'direction': return 'final';
      default: return 'pedagogical';
    }
  };

  const getValidationSteps = () => [
    { stage: 'pedagogical', label: 'Validation Pédagogique', icon: User, status: getStepStatus('pedagogical') },
    { stage: 'administrative', label: 'Validation Administrative', icon: CheckCircle, status: getStepStatus('administrative') },
    { stage: 'final', label: 'Validation Finale', icon: AlertTriangle, status: getStepStatus('final') }
  ];

  const getStepStatus = (stage: string) => {
    const validations = formation.validationHistory || [];
    const stageValidation = validations.find(v => v.stage === stage);
    
    if (stageValidation) {
      return stageValidation.status === 'approved' ? 'completed' : 'rejected';
    }
    
    return formation.status === 'validation' ? 'pending' : 'waiting';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Validé</Badge>;
      case 'rejected': return <Badge className="bg-red-100 text-red-800"><AlertTriangle className="h-3 w-3 mr-1" />Rejeté</Badge>;
      case 'pending': return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />En cours</Badge>;
      default: return <Badge variant="outline"><Clock className="h-3 w-3 mr-1" />En attente</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Circuit de Validation - {formation.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {getValidationSteps().map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.stage} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="flex-shrink-0">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-medium">{step.label}</h3>
                    <p className="text-sm text-slate-600">Étape {index + 1} du processus de validation</p>
                  </div>
                  <div className="flex-shrink-0">
                    {getStatusBadge(step.status)}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {formation.status === 'validation' && (
        <Card>
          <CardHeader>
            <CardTitle>Valider la Formation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="action">Action</Label>
              <Select value={validationAction} onValueChange={(value: 'approved' | 'rejected') => setValidationAction(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="approved">Approuver</SelectItem>
                  <SelectItem value="rejected">Rejeter</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">Priorité</Label>
              <Select value={priority} onValueChange={(value: 'low' | 'medium' | 'high') => setPriority(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Faible</SelectItem>
                  <SelectItem value="medium">Moyenne</SelectItem>
                  <SelectItem value="high">Élevée</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="comments">Commentaires *</Label>
              <Textarea
                id="comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Vos commentaires sur cette formation..."
                rows={4}
              />
            </div>

            <Button 
              onClick={handleSubmit} 
              disabled={!validationAction || !comments.trim()}
              className="w-full"
            >
              Soumettre la Validation
            </Button>
          </CardContent>
        </Card>
      )}

      {formation.validationHistory && formation.validationHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Historique des Validations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {formation.validationHistory.map((validation) => (
                <div key={validation.id} className="border-l-4 border-blue-200 pl-4 py-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{validation.validatorName}</span>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(validation.status === 'approved' ? 'completed' : 'rejected')}
                      <span className="text-sm text-slate-500">
                        {validation.date.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">{validation.comments}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
