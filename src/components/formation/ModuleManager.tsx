
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Plus } from "lucide-react";
import { FormationOffer, Module } from "../../types/academic";
import { ModuleForm } from "./forms/ModuleForm";
import { ModuleList } from "./lists/ModuleList";

interface ModuleManagerProps {
  formationOffers: FormationOffer[];
  onUpdateOffer: (offer: FormationOffer) => void;
}

export const ModuleManager = ({ formationOffers, onUpdateOffer }: ModuleManagerProps) => {
  const [selectedOfferId, setSelectedOfferId] = useState("");
  const [currentModule, setCurrentModule] = useState<Partial<Module>>({
    pedagogicalAtoms: [],
    type: 'presential',
    semester: 1
  });
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const selectedOffer = formationOffers.find(o => o.id === selectedOfferId);

  const handleSaveModule = () => {
    if (!selectedOffer || !currentModule.name || !currentModule.code) {
      return;
    }

    const moduleToSave: Module = {
      id: editingModuleId || Date.now().toString(),
      name: currentModule.name!,
      code: currentModule.code!,
      credits: currentModule.credits || 0,
      coefficient: currentModule.coefficient || 0,
      teacher: currentModule.teacher || '',
      teacherId: currentModule.teacherId || '',
      type: currentModule.type!,
      semester: currentModule.semester!,
      moduleType: 'cours',
      pedagogicalAtoms: currentModule.pedagogicalAtoms || []
    };

    const updatedOffer = {
      ...selectedOffer,
      modules: editingModuleId 
        ? selectedOffer.modules.map(m => m.id === editingModuleId ? moduleToSave : m)
        : [...selectedOffer.modules, moduleToSave]
    };

    onUpdateOffer(updatedOffer);
    setCurrentModule({ pedagogicalAtoms: [], type: 'presential', semester: 1 });
    setEditingModuleId(null);
    setShowForm(false);
  };

  const handleEditModule = (module: Module) => {
    setCurrentModule(module);
    setEditingModuleId(module.id);
    setShowForm(true);
  };

  const handleDeleteModule = (moduleId: string) => {
    if (!selectedOffer) return;
    
    if (confirm("Êtes-vous sûr de vouloir supprimer ce module ?")) {
      const updatedOffer = {
        ...selectedOffer,
        modules: selectedOffer.modules.filter(m => m.id !== moduleId)
      };
      onUpdateOffer(updatedOffer);
    }
  };

  const handleCancelForm = () => {
    setCurrentModule({ pedagogicalAtoms: [], type: 'presential', semester: 1 });
    setEditingModuleId(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Gestion des Modules
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Sélectionner une offre de formation</label>
            <Select value={selectedOfferId} onValueChange={setSelectedOfferId}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir une offre de formation" />
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

          {selectedOffer && !showForm && (
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Modules ({selectedOffer.modules.length})</h3>
              <Button 
                onClick={() => setShowForm(true)} 
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Nouveau Module
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedOffer && showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingModuleId ? 'Modifier le Module' : 'Nouveau Module'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ModuleForm
              module={currentModule}
              onChange={setCurrentModule}
              onSave={handleSaveModule}
              onCancel={handleCancelForm}
            />
          </CardContent>
        </Card>
      )}

      {selectedOffer && !showForm && (
        <Card>
          <CardContent className="p-6">
            <ModuleList
              modules={selectedOffer.modules}
              onEdit={handleEditModule}
              onDelete={handleDeleteModule}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};
