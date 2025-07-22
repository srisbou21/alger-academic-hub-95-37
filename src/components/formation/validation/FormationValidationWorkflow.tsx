
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, Clock, AlertTriangle, Eye, MessageSquare } from "lucide-react";
import { FormationOffer, ValidationEntry } from "../../../types/academic";

interface FormationValidationWorkflowProps {
  formations: FormationOffer[];
  onUpdateFormation: (formation: FormationOffer) => void;
}

export const FormationValidationWorkflow = ({ formations, onUpdateFormation }: FormationValidationWorkflowProps) => {
  const [selectedFormationId, setSelectedFormationId] = useState("");
  const [validationComment, setValidationComment] = useState("");
  const [validationStage, setValidationStage] = useState<'pedagogical' | 'administrative' | 'final'>('pedagogical');

  const selectedFormation = formations.find(f => f.id === selectedFormationId);
  const pendingValidations = formations.filter(f => f.status === 'validation');

  const handleValidation = (formationId: string, status: 'approved' | 'rejected') => {
    const formation = formations.find(f => f.id === formationId);
    if (!formation) return;

    const validationEntry: ValidationEntry = {
      id: Date.now().toString(),
      date: new Date(),
      validatorId: 'current_user',
      validatorName: 'Validateur',
      status,
      comments: validationComment,
      stage: validationStage
    };

    const updatedFormation: FormationOffer = {
      ...formation,
      status: status === 'approved' ? 'validated' : 'draft',
      validationHistory: [...formation.validationHistory, validationEntry],
      lastModifiedBy: 'current_user',
      updatedAt: new Date()
    };

    onUpdateFormation(updatedFormation);
    setValidationComment("");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft': return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Brouillon</Badge>;
      case 'validation': return <Badge className="bg-yellow-100 text-yellow-800"><AlertTriangle className="h-3 w-3 mr-1" />En validation</Badge>;
      case 'validated': return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Validée</Badge>;
      case 'archived': return <Badge variant="destructive">Archivée</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Workflow de Validation des Formations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <AlertTriangle className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-yellow-600">{pendingValidations.length}</p>
              <p className="text-sm text-yellow-800">En attente</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">
                {formations.filter(f => f.status === 'validated').length}
              </p>
              <p className="text-sm text-green-800">Validées</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Eye className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">{formations.length}</p>
              <p className="text-sm text-blue-800">Total</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Formations en Attente de Validation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingValidations.map((formation) => (
              <div key={formation.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{formation.name}</h3>
                    <p className="text-sm text-slate-600">{formation.code} - {formation.academicYear}</p>
                  </div>
                  {getStatusBadge(formation.status)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Étape de validation</label>
                    <Select value={validationStage} onValueChange={(value: 'pedagogical' | 'administrative' | 'final') => setValidationStage(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pedagogical">Pédagogique</SelectItem>
                        <SelectItem value="administrative">Administrative</SelectItem>
                        <SelectItem value="final">Finale</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Commentaires</label>
                    <Textarea
                      value={validationComment}
                      onChange={(e) => setValidationComment(e.target.value)}
                      placeholder="Commentaires de validation..."
                      rows={2}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleValidation(formation.id, 'approved')}
                    className="bg-green-600 hover:bg-green-700"
                    size="sm"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approuver
                  </Button>
                  <Button
                    onClick={() => handleValidation(formation.id, 'rejected')}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    Rejeter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    Détails
                  </Button>
                </div>

                {formation.validationHistory.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="text-sm font-medium mb-2">Historique de validation</h4>
                    <div className="space-y-2">
                      {formation.validationHistory.slice(-3).map((entry) => (
                        <div key={entry.id} className="text-xs bg-slate-50 p-2 rounded">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{entry.validatorName}</span>
                            <span className="text-slate-500">
                              {entry.date.toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-slate-600 mt-1">{entry.comments}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {pendingValidations.length === 0 && (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <p className="text-slate-500">Aucune formation en attente de validation</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
