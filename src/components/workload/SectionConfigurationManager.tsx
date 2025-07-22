import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Save, X, Users, Settings, BookOpen } from "lucide-react";
import { SectionConfiguration, SectionDefinition, GroupDefinition } from "../../types/workload";
import { FormationOffer } from "../../types/academic";
import { workloadService } from "../../services/workloadService";
import { formationOfferService } from "../../services/formationOfferService";
import { useToast } from "@/hooks/use-toast";

interface SectionConfigurationManagerProps {
  academicYear?: string;
}

export const SectionConfigurationManager = ({ academicYear = "2024-2025" }: SectionConfigurationManagerProps) => {
  const { toast } = useToast();
  const [configurations, setConfigurations] = useState<SectionConfiguration[]>([]);
  const [formationOffers, setFormationOffers] = useState<FormationOffer[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<SectionConfiguration | null>(null);
  const [loading, setLoading] = useState(false);

  const [configForm, setConfigForm] = useState({
    formationOfferId: '',
    sections: [] as SectionDefinition[]
  });

  useEffect(() => {
    loadData();
  }, [academicYear]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [configs, offers] = await Promise.all([
        workloadService.getSectionConfigurations(),
        formationOfferService.getFormationOffers()
      ]);
      
      // Filtrer par année académique
      const filteredConfigs = configs.filter(c => c.academicYear === academicYear);
      setConfigurations(filteredConfigs);
      setFormationOffers(offers);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les données",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfiguration = async () => {
    if (!configForm.formationOfferId || configForm.sections.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une formation et ajouter au moins une section",
        variant: "destructive"
      });
      return;
    }

    try {
      if (editingConfig) {
        // For updating existing configuration, merge with existing data
        const updatedConfig: SectionConfiguration = {
          ...editingConfig,
          formationOfferId: configForm.formationOfferId,
          sections: configForm.sections,
          updatedAt: new Date()
        };
        await workloadService.updateSectionConfiguration(updatedConfig);
        toast({
          title: "Succès",
          description: "Configuration mise à jour avec succès"
        });
      } else {
        // For creating new configuration
        const configData = {
          formationOfferId: configForm.formationOfferId,
          academicYear,
          sections: configForm.sections,
          createdBy: "admin"
        };
        await workloadService.createSectionConfiguration(configData);
        toast({
          title: "Succès",
          description: "Configuration créée avec succès"
        });
      }
      
      setIsDialogOpen(false);
      setEditingConfig(null);
      resetForm();
      loadData();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la configuration",
        variant: "destructive"
      });
    }
  };

  const addSection = () => {
    const newSection: SectionDefinition = {
      id: `section_${Date.now()}`,
      name: `Section ${String.fromCharCode(65 + configForm.sections.length)}`,
      code: `SEC-${String.fromCharCode(65 + configForm.sections.length)}`,
      capacity: 40,
      startGroupNumber: 1,
      endGroupNumber: 4,
      groups: []
    };
    
    // Générer automatiquement les groupes TD et TP
    for (let i = newSection.startGroupNumber; i <= newSection.endGroupNumber; i++) {
      newSection.groups.push({
        id: `td_${Date.now()}_${i}`,
        name: `Groupe TD${i}`,
        code: `TD${i}`,
        sectionId: newSection.id,
        type: 'td',
        capacity: 20,
        groupNumber: i
      });
      
      newSection.groups.push({
        id: `tp_${Date.now()}_${i}`,
        name: `Groupe TP${i}`,
        code: `TP${i}`,
        sectionId: newSection.id,
        type: 'tp',
        capacity: 15,
        groupNumber: i
      });
    }

    setConfigForm(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
  };

  const resetForm = () => {
    setConfigForm({
      formationOfferId: '',
      sections: []
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Configuration des Sections et Groupes</h3>
          <p className="text-sm text-slate-600">Année académique: {academicYear}</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingConfig(null); resetForm(); }}>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle Configuration
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingConfig ? "Modifier" : "Nouvelle"} Configuration - {academicYear}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="formation">Offre de Formation</Label>
                <Select 
                  value={configForm.formationOfferId} 
                  onValueChange={(value) => setConfigForm(prev => ({ ...prev, formationOfferId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une formation" />
                  </SelectTrigger>
                  <SelectContent>
                    {formationOffers.map(offer => (
                      <SelectItem key={offer.id} value={offer.id}>
                        {offer.name} - {offer.level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Sections</h4>
                  <Button onClick={addSection} size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter Section
                  </Button>
                </div>

                {configForm.sections.map((section, sectionIndex) => (
                  <Card key={section.id} className="p-4">
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label>Nom de la Section</Label>
                          <Input
                            value={section.name}
                            onChange={(e) => {
                              const newSections = [...configForm.sections];
                              newSections[sectionIndex].name = e.target.value;
                              setConfigForm(prev => ({ ...prev, sections: newSections }));
                            }}
                          />
                        </div>
                        <div>
                          <Label>Code</Label>
                          <Input
                            value={section.code}
                            onChange={(e) => {
                              const newSections = [...configForm.sections];
                              newSections[sectionIndex].code = e.target.value;
                              setConfigForm(prev => ({ ...prev, sections: newSections }));
                            }}
                          />
                        </div>
                        <div>
                          <Label>Capacité</Label>
                          <Input
                            type="number"
                            value={section.capacity}
                            onChange={(e) => {
                              const newSections = [...configForm.sections];
                              newSections[sectionIndex].capacity = parseInt(e.target.value);
                              setConfigForm(prev => ({ ...prev, sections: newSections }));
                            }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Premier Groupe (Numéro)</Label>
                          <Input
                            type="number"
                            value={section.startGroupNumber}
                            onChange={(e) => {
                              const newSections = [...configForm.sections];
                              newSections[sectionIndex].startGroupNumber = parseInt(e.target.value);
                              setConfigForm(prev => ({ ...prev, sections: newSections }));
                            }}
                          />
                        </div>
                        <div>
                          <Label>Dernier Groupe (Numéro)</Label>
                          <Input
                            type="number"
                            value={section.endGroupNumber}
                            onChange={(e) => {
                              const newSections = [...configForm.sections];
                              newSections[sectionIndex].endGroupNumber = parseInt(e.target.value);
                              setConfigForm(prev => ({ ...prev, sections: newSections }));
                            }}
                          />
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-2">Groupes générés automatiquement:</p>
                        <div className="flex flex-wrap gap-1">
                          {section.groups.map(group => (
                            <Badge key={group.id} variant="outline" className="text-xs">
                              {group.name} ({group.type.toUpperCase()}) - {group.capacity} places
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSaveConfiguration} className="bg-green-600 hover:bg-green-700">
                  <Save className="mr-2 h-4 w-4" />
                  Sauvegarder
                </Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  <X className="mr-2 h-4 w-4" />
                  Annuler
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {configurations.map((config) => {
          const offer = formationOffers.find(o => o.id === config.formationOfferId);
          const totalSections = config.sections.length;
          const totalGroups = config.sections.reduce((sum, section) => sum + section.groups.length, 0);
          const totalCapacity = config.sections.reduce((sum, section) => sum + section.capacity, 0);
          
          return (
            <Card key={config.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{offer?.name}</h3>
                    <p className="text-sm text-slate-600">{config.academicYear}</p>
                    <div className="flex gap-4 mt-2 text-sm">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {totalSections} sections
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {totalGroups} groupes
                      </span>
                      <span className="flex items-center gap-1">
                        <Settings className="h-4 w-4" />
                        {totalCapacity} places
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline">
                      {config.createdAt.toLocaleDateString()}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingConfig(config);
                        setConfigForm({
                          formationOfferId: config.formationOfferId,
                          sections: config.sections
                        });
                        setIsDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  {config.sections.map(section => (
                    <div key={section.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{section.name}</h4>
                        <Badge variant="outline">
                          Capacité: {section.capacity} | Groupes: {section.startGroupNumber}-{section.endGroupNumber}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {section.groups.map(group => (
                          <Badge key={group.id} variant="secondary" className="text-xs">
                            {group.name} ({group.type.toUpperCase()}) - {group.capacity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}

        {configurations.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Settings className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600">Aucune configuration pour l'année {academicYear}</p>
              <p className="text-sm text-slate-500">
                Créez une nouvelle configuration pour commencer
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
