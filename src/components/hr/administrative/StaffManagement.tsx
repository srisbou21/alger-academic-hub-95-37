
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdministrativeStaff } from "../../../types/administrative";
import { AdministrativeDashboard } from './AdministrativeDashboard';
import { AdministrativeListView } from './AdministrativeListView';
import { StaffForm } from '../forms/StaffForm';
import { useToast } from "@/hooks/use-toast";
import { administrativeService } from "../../../services/administrativeService";

export const StaffManagement = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedStaff, setSelectedStaff] = useState<AdministrativeStaff | undefined>();
  const [isEditing, setIsEditing] = useState(false);
  const [staff, setStaff] = useState<AdministrativeStaff[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    setLoading(true);
    try {
      const staffData = await administrativeService.getAllStaff();
      setStaff(staffData);
      console.log(`${staffData.length} personnel administratif chargé`);
    } catch (error) {
      console.error("Erreur lors du chargement du personnel:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger la liste du personnel administratif",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (staffId: string, newStatus: string) => {
    try {
      console.log(`Changement de statut pour le personnel ${staffId}: ${newStatus}`);
      
      // Obtenir le personnel existant
      const existingStaff = await administrativeService.getStaffById(staffId);
      
      // Mettre à jour seulement le statut
      const updatedStaff = {
        ...existingStaff,
        professionalInfo: {
          ...existingStaff.professionalInfo,
          status: newStatus as 'active' | 'inactive' | 'suspended' | 'retired' | 'terminated'
        }
      };
      
      await administrativeService.updateStaff(staffId, updatedStaff);
      
      // Mettre à jour localement la liste du personnel
      setStaff(prevStaff =>
        prevStaff.map(person =>
          person.id === staffId ? updatedStaff : person
        )
      );
      
      console.log(`Statut du personnel ${staffId} modifié avec succès`);
    } catch (error) {
      console.error("Erreur lors du changement de statut:", error);
      throw error;
    }
  };

  const handleAddStaff = () => {
    setSelectedStaff(undefined);
    setIsEditing(true);
    setActiveTab("form");
  };

  const handleEditStaff = (person: AdministrativeStaff) => {
    setSelectedStaff(person);
    setIsEditing(true);
    setActiveTab("form");
  };

  const handleViewStaff = (person: AdministrativeStaff) => {
    setSelectedStaff(person);
    setIsEditing(false);
    setActiveTab("form");
  };

  const handleSaveStaff = async (staffData: any) => {
    setLoading(true);
    try {
      console.log("Sauvegarde du personnel:", staffData);
      
      if (selectedStaff) {
        // Modification d'un personnel existant
        await administrativeService.updateStaff(selectedStaff.id, staffData);
        console.log("Personnel modifié avec succès");
        toast({
          title: "Personnel modifié",
          description: "Les informations du personnel ont été mises à jour avec succès.",
        });
      } else {
        // Création d'un nouveau personnel
        await administrativeService.createStaff(staffData);
        console.log("Nouveau personnel créé avec succès");
        toast({
          title: "Personnel ajouté",
          description: "Le nouveau personnel a été ajouté avec succès.",
        });
      }
      
      // Recharger la liste du personnel
      await loadStaff();
      
      // Retourner à la liste
      setActiveTab("list");
      setSelectedStaff(undefined);
      setIsEditing(false);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer le personnel. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelForm = () => {
    setActiveTab("list");
    setSelectedStaff(undefined);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white shadow-sm border border-slate-200">
          <TabsTrigger 
            value="dashboard"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Tableau de bord
          </TabsTrigger>
          <TabsTrigger 
            value="list"
            className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
          >
            Liste du personnel
          </TabsTrigger>
          <TabsTrigger 
            value="form"
            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            disabled={!isEditing && !selectedStaff}
          >
            {selectedStaff ? (isEditing ? "Modifier" : "Profil") : "Nouveau"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <AdministrativeDashboard />
        </TabsContent>

        <TabsContent value="list" className="space-y-6">
          <AdministrativeListView 
            staff={staff}
            loading={loading}
            onAddStaff={handleAddStaff}
            onEditStaff={handleEditStaff}
            onViewStaff={handleViewStaff}
            onRefresh={loadStaff}
            onToggleStatus={handleToggleStatus}
          />
        </TabsContent>

        <TabsContent value="form" className="space-y-6">
          {(isEditing || selectedStaff) && (
            <StaffForm
              staffId={selectedStaff?.id}
              onSave={handleSaveStaff}
              onCancel={handleCancelForm}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
