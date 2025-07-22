
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, Plus, RefreshCw } from "lucide-react";
import { FormationOffer } from "../../types/academic";
import { FormationOfferForm } from "./FormationOfferForm";
import { ModuleManager } from "./ModuleManager";
import { SectionGroupManager } from "./SectionGroupManager";
import { OfferCard } from "./lists/OfferCard";
import { useSpecialties } from "../../hooks/useSpecialties";
import { useToast } from "@/hooks/use-toast";

export const FormationOfferManager = () => {
  const { 
    formations, 
    addFormation, 
    updateFormation, 
    deleteFormation, 
    refreshData,
    loading 
  } = useSpecialties();
  
  const [selectedOffer, setSelectedOffer] = useState<FormationOffer | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("list");
  const { toast } = useToast();

  useEffect(() => {
    refreshData();
  }, []);

  const handleCreateOffer = () => {
    setSelectedOffer(null);
    setIsFormOpen(true);
    setActiveTab("form");
  };

  const handleEditOffer = (offer: FormationOffer) => {
    setSelectedOffer(offer);
    setIsFormOpen(true);
    setActiveTab("form");
  };

  const handleDeleteOffer = (offerId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette offre de formation ?")) {
      deleteFormation(offerId);
      toast({
        title: "Succès",
        description: "Offre de formation supprimée avec succès"
      });
    }
  };

  const handleSaveOffer = (offer: FormationOffer) => {
    try {
      if (selectedOffer) {
        updateFormation(offer.id, offer);
        toast({
          title: "Succès",
          description: "Offre de formation modifiée avec succès"
        });
      } else {
        const newOffer = {
          ...offer,
          id: `formation_${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        addFormation(newOffer);
        toast({
          title: "Succès",
          description: "Offre de formation créée avec succès"
        });
      }
      setIsFormOpen(false);
      setActiveTab("list");
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder l'offre de formation",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6" />
            Gestion des Offres de Formation
          </CardTitle>
          <p className="text-slate-600">
            Créez et gérez les offres de formation avec leurs modules, sections et groupes
          </p>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="list">Liste des Offres</TabsTrigger>
          <TabsTrigger value="form">Créer/Modifier</TabsTrigger>
          <TabsTrigger value="modules">Gestion Modules</TabsTrigger>
          <TabsTrigger value="sections">Sections & Groupes</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Offres de Formation ({formations.length})</h3>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={refreshData}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Actualiser
              </Button>
              <Button onClick={handleCreateOffer} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle Offre
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-slate-400" />
              <p className="text-slate-500">Chargement des formations...</p>
            </div>
          ) : formations.length === 0 ? (
            <div className="text-center py-8">
              <GraduationCap className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-500">Aucune offre de formation</p>
              <p className="text-sm text-slate-400">
                Créez votre première offre de formation pour commencer
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {formations.map((offer) => (
                <OfferCard
                  key={offer.id}
                  offer={offer}
                  onEdit={handleEditOffer}
                  onDelete={handleDeleteOffer}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="form">
          <FormationOfferForm
            offer={selectedOffer}
            onSave={handleSaveOffer}
            onCancel={() => { setIsFormOpen(false); setActiveTab("list"); }}
          />
        </TabsContent>

        <TabsContent value="modules">
          <ModuleManager 
            formationOffers={formations}
            onUpdateOffer={(offer) => updateFormation(offer.id, offer)}
          />
        </TabsContent>

        <TabsContent value="sections">
          <SectionGroupManager 
            formationOffers={formations}
            onUpdateOffer={(offer) => updateFormation(offer.id, offer)}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
