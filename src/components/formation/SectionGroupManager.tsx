
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Plus, Trash2 } from "lucide-react";
import { FormationOffer, Section, Group } from "../../types/academic";
import { SectionForm } from "./forms/SectionForm";
import { GroupForm } from "./forms/GroupForm";
import { SectionCard } from "./lists/SectionCard";
import { useToast } from "@/hooks/use-toast";

interface SectionGroupManagerProps {
  formationOffers: FormationOffer[];
  onUpdateOffer: (offer: FormationOffer) => void;
}

export const SectionGroupManager = ({ formationOffers, onUpdateOffer }: SectionGroupManagerProps) => {
  const { toast } = useToast();
  const [selectedOfferId, setSelectedOfferId] = useState("");
  const [currentSection, setCurrentSection] = useState<Partial<Section>>({});
  const [currentGroup, setCurrentGroup] = useState<Partial<Group>>({});
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [showSectionForm, setShowSectionForm] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState("");

  const selectedOffer = formationOffers.find(o => o.id === selectedOfferId);
  const selectedSection = selectedOffer?.sections.find(s => s.id === selectedSectionId);

  const handleSaveSection = () => {
    if (!selectedOffer || !currentSection.name || !currentSection.code) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires de la section",
        variant: "destructive"
      });
      return;
    }

    const sectionToSave: Section = {
      id: editingSectionId || Date.now().toString(),
      name: currentSection.name!,
      code: currentSection.code!,
      capacity: currentSection.capacity || 0,
      currentEnrollment: currentSection.currentEnrollment || 0,
      specialtyId: selectedOffer.specialtyId,
      groups: editingSectionId 
        ? selectedOffer.sections.find(s => s.id === editingSectionId)?.groups || []
        : [],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const updatedOffer = {
      ...selectedOffer,
      sections: editingSectionId
        ? selectedOffer.sections.map(s => s.id === editingSectionId ? sectionToSave : s)
        : [...selectedOffer.sections, sectionToSave]
    };

    onUpdateOffer(updatedOffer);
    setCurrentSection({});
    setEditingSectionId(null);
    setShowSectionForm(false);
    
    toast({
      title: "Succès",
      description: editingSectionId ? "Section modifiée avec succès" : "Section créée avec succès"
    });
  };

  const handleEditSection = (section: Section) => {
    setCurrentSection(section);
    setEditingSectionId(section.id);
    setShowSectionForm(true);
  };

  const handleDeleteSection = (sectionId: string) => {
    if (!selectedOffer) return;
    
    if (confirm("Êtes-vous sûr de vouloir supprimer cette section et tous ses groupes ?")) {
      const updatedOffer = {
        ...selectedOffer,
        sections: selectedOffer.sections.filter(s => s.id !== sectionId)
      };
      onUpdateOffer(updatedOffer);
    }
  };

  const handleCancelSectionForm = () => {
    setCurrentSection({});
    setEditingSectionId(null);
    setShowSectionForm(false);
  };

  const handleAddGroup = () => {
    if (!selectedSection || !currentGroup.name || !currentGroup.code || !currentGroup.type) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires du groupe",
        variant: "destructive"
      });
      return;
    }

    const groupToSave: Group = {
      id: Date.now().toString(),
      name: currentGroup.name!,
      code: currentGroup.code!,
      sectionId: selectedSection.id,
      capacity: currentGroup.capacity || 0,
      currentEnrollment: 0,
      type: currentGroup.type!,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const updatedSection = {
      ...selectedSection,
      groups: [...selectedSection.groups, groupToSave]
    };

    const updatedOffer = {
      ...selectedOffer!,
      sections: selectedOffer!.sections.map(s => 
        s.id === selectedSection.id ? updatedSection : s
      )
    };

    onUpdateOffer(updatedOffer);
    setCurrentGroup({});
    
    toast({
      title: "Succès",
      description: "Groupe ajouté avec succès"
    });
  };

  const handleDeleteGroup = (groupId: string) => {
    if (!selectedSection || !selectedOffer) return;
    
    if (confirm("Êtes-vous sûr de vouloir supprimer ce groupe ?")) {
      const updatedSection = {
        ...selectedSection,
        groups: selectedSection.groups.filter(g => g.id !== groupId)
      };

      const updatedOffer = {
        ...selectedOffer,
        sections: selectedOffer.sections.map(s => 
          s.id === selectedSection.id ? updatedSection : s
        )
      };

      onUpdateOffer(updatedOffer);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Gestion des Sections et Groupes
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

          {selectedOffer && !showSectionForm && (
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Sections ({selectedOffer.sections.length})</h3>
              <Button 
                onClick={() => setShowSectionForm(true)} 
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle Section
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedOffer && showSectionForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingSectionId ? 'Modifier la Section' : 'Nouvelle Section'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SectionForm
              section={currentSection}
              onChange={setCurrentSection}
              onSave={handleSaveSection}
              onCancel={handleCancelSectionForm}
              isEditing={!!editingSectionId}
            />
          </CardContent>
        </Card>
      )}

      {selectedOffer && !showSectionForm && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {selectedOffer.sections.map((section) => (
            <SectionCard
              key={section.id}
              section={section}
              onEdit={handleEditSection}
              onDelete={handleDeleteSection}
              onSelectForGroups={setSelectedSectionId}
              isSelected={selectedSectionId === section.id}
            />
          ))}
          {selectedOffer.sections.length === 0 && (
            <p className="text-center text-slate-500 py-8 col-span-2">
              Aucune section définie pour cette offre
            </p>
          )}
        </div>
      )}

      {selectedSection && (
        <Card>
          <CardHeader>
            <CardTitle>Groupes de la Section {selectedSection.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <GroupForm
              group={currentGroup}
              onChange={setCurrentGroup}
              onAdd={handleAddGroup}
            />

            <div className="space-y-3">
              {selectedSection.groups.map((group) => (
                <div key={group.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div>
                      <h4 className="font-semibold">{group.name}</h4>
                      <p className="text-sm text-slate-600">{group.code}</p>
                    </div>
                    <div className="text-sm text-slate-500">
                      <span>Capacité: {group.capacity}</span>
                      <span className="ml-4">Type: {group.type.toUpperCase()}</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteGroup(group.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {selectedSection.groups.length === 0 && (
                <p className="text-center text-slate-500 py-4">
                  Aucun groupe défini pour cette section
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
