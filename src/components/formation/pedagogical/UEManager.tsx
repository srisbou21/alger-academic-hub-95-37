import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Plus, Edit, Trash2, Save, X } from "lucide-react";
import { FormationOffer, UniteEnseignement } from "../../../types/academic";

interface UEManagerProps {
  formation: FormationOffer;
  semester: number;
  onUpdateFormation: (formation: FormationOffer) => void;
}

export const UEManager = ({ formation, semester, onUpdateFormation }: UEManagerProps) => {
  const [ues, setUes] = useState<UniteEnseignement[]>([
    {
      id: "ue1",
      code: "UE-INFO-101",
      name: "Fondamentaux de l'informatique",
      ects: 6,
      semester: 1,
      character: 'obligatoire',
      unitType: 'fondamentale',
      prerequisites: [],
      evaluationMethods: ['Examen écrit', 'TP noté'],
      subjects: [],
      formationId: formation.id,
      coefficient: 1
    },
    {
      id: "ue2", 
      code: "UE-MATH-101",
      name: "Mathématiques pour l'informatique",
      ects: 6,
      semester: 1,
      character: 'obligatoire',
      unitType: 'methodologique',
      prerequisites: [],
      evaluationMethods: ['Examen écrit', 'Contrôle continu'],
      subjects: [],
      formationId: formation.id,
      coefficient: 1
    }
  ]);

  const [currentUE, setCurrentUE] = useState<Partial<UniteEnseignement>>({
    semester: semester,
    character: 'obligatoire',
    prerequisites: [],
    evaluationMethods: [],
    subjects: [],
    formationId: formation.id,
    coefficient: 1
  });
  const [editingUEId, setEditingUEId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const semesterUEs = ues.filter(ue => ue.semester === semester);
  const totalECTS = semesterUEs.reduce((sum, ue) => sum + ue.ects, 0);

  const handleSaveUE = () => {
    if (!currentUE.code || !currentUE.name || !currentUE.ects) {
      return;
    }

    const ueToSave: UniteEnseignement = {
      id: editingUEId || Date.now().toString(),
      code: currentUE.code!,
      name: currentUE.name!,
      ects: currentUE.ects!,
      semester: currentUE.semester || semester,
      character: currentUE.character || 'obligatoire',
      unitType: currentUE.unitType || 'fondamentale',
      prerequisites: currentUE.prerequisites || [],
      evaluationMethods: currentUE.evaluationMethods || [],
      subjects: currentUE.subjects || [],
      formationId: formation.id,
      coefficient: currentUE.coefficient || 1
    };

    if (editingUEId) {
      setUes(prev => prev.map(ue => ue.id === editingUEId ? ueToSave : ue));
    } else {
      setUes(prev => [...prev, ueToSave]);
    }

    setCurrentUE({
      semester: semester,
      character: 'obligatoire',
      prerequisites: [],
      evaluationMethods: [],
      subjects: [],
      formationId: formation.id,
      coefficient: 1
    });
    setEditingUEId(null);
    setShowForm(false);
  };

  function handleEditUE(ue: UniteEnseignement) {
    setCurrentUE(ue);
    setEditingUEId(ue.id);
    setShowForm(true);
  }

  function handleDeleteUE(ueId: string) {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette UE ?")) {
      setUes(prev => prev.filter(ue => ue.id !== ueId));
    }
  }

  function handleCancelForm() {
    setCurrentUE({
      semester: semester,
      character: 'obligatoire',
      prerequisites: [],
      evaluationMethods: [],
      subjects: [],
      formationId: formation.id,
      coefficient: 1
    });
    setEditingUEId(null);
    setShowForm(false);
  }

  function getCharacterBadge(character: string) {
    switch (character) {
      case 'obligatoire': return <Badge className="bg-red-100 text-red-800">Obligatoire</Badge>;
      case 'optionnel': return <Badge className="bg-yellow-100 text-yellow-800">Optionnel</Badge>;
      case 'libre': return <Badge className="bg-green-100 text-green-800">Libre</Badge>;
      default: return <Badge variant="outline">{character}</Badge>;
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Unités d'Enseignement - Semestre {semester}
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <span className="font-medium">Total ECTS: </span>
              <span className={`font-bold ${totalECTS < 27 ? 'text-red-600' : totalECTS > 33 ? 'text-orange-600' : 'text-green-600'}`}>
                {totalECTS}/30
              </span>
            </div>
            {!showForm && (
              <Button onClick={() => setShowForm(true)} size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-1" />
                Nouvelle UE
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {showForm && (
          <div className="mb-6 p-4 border rounded-lg bg-slate-50">
            <h3 className="font-medium mb-4">
              {editingUEId ? 'Modifier l\'UE' : 'Nouvelle UE'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="code">Code UE *</Label>
                <Input
                  id="code"
                  value={currentUE.code || ''}
                  onChange={(e) => setCurrentUE(prev => ({ ...prev, code: e.target.value }))}
                  placeholder="ex: UE-INFO-101"
                />
              </div>
              <div>
                <Label htmlFor="name">Nom de l'UE *</Label>
                <Input
                  id="name"
                  value={currentUE.name || ''}
                  onChange={(e) => setCurrentUE(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="ex: Fondamentaux de l'informatique"
                />
              </div>
              <div>
                <Label htmlFor="ects">Crédits ECTS *</Label>
                <Input
                  id="ects"
                  type="number"
                  value={currentUE.ects || ''}
                  onChange={(e) => setCurrentUE(prev => ({ ...prev, ects: parseInt(e.target.value) }))}
                  min="1"
                  max="12"
                />
              </div>
              <div>
                <Label htmlFor="coefficient">Coefficient *</Label>
                <Input
                  id="coefficient"
                  type="number"
                  value={currentUE.coefficient || ''}
                  onChange={(e) => setCurrentUE(prev => ({ ...prev, coefficient: parseInt(e.target.value) }))}
                  min="1"
                  max="5"
                />
              </div>
              <div>
                <Label htmlFor="character">Caractère</Label>
                <Select 
                  value={currentUE.character} 
                  onValueChange={(value: 'obligatoire' | 'optionnel' | 'libre') => 
                    setCurrentUE(prev => ({ ...prev, character: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="obligatoire">Obligatoire</SelectItem>
                    <SelectItem value="optionnel">Optionnel</SelectItem>
                    <SelectItem value="libre">Libre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="unitType">Type d'unité</Label>
                <Select 
                  value={currentUE.unitType} 
                  onValueChange={(value: 'fondamentale' | 'methodologique' | 'decouverte' | 'transversale') => 
                    setCurrentUE(prev => ({ ...prev, unitType: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fondamentale">Fondamentale</SelectItem>
                    <SelectItem value="methodologique">Méthodologique</SelectItem>
                    <SelectItem value="decouverte">Découverte</SelectItem>
                    <SelectItem value="transversale">Transversale</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mb-4">
              <Label htmlFor="prerequisites">Prérequis</Label>
              <Textarea
                id="prerequisites"
                value={currentUE.prerequisites?.join(', ') || ''}
                onChange={(e) => setCurrentUE(prev => ({ 
                  ...prev, 
                  prerequisites: e.target.value.split(',').map(p => p.trim()).filter(p => p) 
                }))}
                placeholder="Séparer les prérequis par des virgules"
                rows={2}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSaveUE} size="sm" className="bg-green-600 hover:bg-green-700">
                <Save className="h-4 w-4 mr-1" />
                Sauvegarder
              </Button>
              <Button onClick={handleCancelForm} size="sm" variant="outline">
                <X className="h-4 w-4 mr-1" />
                Annuler
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {semesterUEs.map((ue) => (
            <div key={ue.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold">{ue.name}</h3>
                  <p className="text-sm text-slate-600">{ue.code}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {getCharacterBadge(ue.character)}
                    <Badge variant="outline">{ue.ects} ECTS</Badge>
                    <Badge variant="outline">Coef. {ue.coefficient}</Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEditUE(ue)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleDeleteUE(ue.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {ue.prerequisites.length > 0 && (
                <div className="text-sm text-slate-600 mb-2">
                  <span className="font-medium">Prérequis: </span>
                  {ue.prerequisites.join(', ')}
                </div>
              )}

              <div className="text-sm text-slate-600">
                <span className="font-medium">Matières: </span>
                {ue.subjects.length} matière(s)
              </div>
            </div>
          ))}

          {semesterUEs.length === 0 && (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-500">Aucune UE définie pour ce semestre</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
