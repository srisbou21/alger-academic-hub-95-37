
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Search, Filter } from "lucide-react";
import { AdministrativeStaff } from "../../../types/administrative";
import { administrativeService } from "../../../services/administrativeService";
import { useToast } from "@/hooks/use-toast";
import { StaffFilters } from "./StaffFilters";
import { StaffCard } from "./StaffCard";
import { StaffForm } from "../forms/StaffForm";

type ViewMode = 'list' | 'create' | 'edit';

export const AdministrativeStaffManager = () => {
  const [staff, setStaff] = useState<AdministrativeStaff[]>([]);
  const [filteredStaff, setFilteredStaff] = useState<AdministrativeStaff[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [contractFilter, setContractFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadStaff();
  }, []);

  useEffect(() => {
    filterStaff();
  }, [staff, searchTerm, contractFilter, serviceFilter, statusFilter]);

  const loadStaff = async () => {
    setLoading(true);
    try {
      const staffData = await administrativeService.getAllStaff();
      setStaff(staffData);
    } catch (error) {
      console.error("Erreur lors du chargement du personnel:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données du personnel administratif",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterStaff = () => {
    let filtered = [...staff];

    if (searchTerm && searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(person => 
        person.personalInfo.firstName.toLowerCase().includes(searchLower) ||
        person.personalInfo.lastName.toLowerCase().includes(searchLower) ||
        person.personalInfo.email.toLowerCase().includes(searchLower) ||
        person.professionalInfo.employeeId.toLowerCase().includes(searchLower)
      );
    }

    if (contractFilter && contractFilter !== "all") {
      filtered = filtered.filter(person => person.professionalInfo.contractType === contractFilter);
    }

    if (serviceFilter && serviceFilter !== "all") {
      filtered = filtered.filter(person => person.professionalInfo.service === serviceFilter);
    }

    if (statusFilter && statusFilter !== "all") {
      filtered = filtered.filter(person => person.professionalInfo.status === statusFilter);
    }

    setFilteredStaff(filtered);
  };

  const handleEditStaff = (id: string) => {
    setSelectedStaffId(id);
    setViewMode('edit');
  };

  const handleDeleteStaff = async (id: string) => {
    try {
      // Ici on implémenterait la suppression
      console.log("Suppression du personnel:", id);
      await loadStaff();
      toast({
        title: "Succès",
        description: "Personnel supprimé avec succès"
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le personnel",
        variant: "destructive"
      });
    }
  };

  const handleAddNew = () => {
    setSelectedStaffId(null);
    setViewMode('create');
  };

  const handleSaveStaff = async (formData: any) => {
    try {
      if (selectedStaffId) {
        await administrativeService.updateStaff(selectedStaffId, formData);
      } else {
        await administrativeService.createStaff(formData);
      }
      
      await loadStaff();
      setViewMode('list');
      setSelectedStaffId(null);
      
      toast({
        title: "Succès",
        description: selectedStaffId ? "Personnel modifié avec succès" : "Personnel ajouté avec succès"
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les données",
        variant: "destructive"
      });
    }
  };

  const handleCancel = () => {
    setViewMode('list');
    setSelectedStaffId(null);
  };

  const uniqueServices = [...new Set(staff
    .map(s => s.professionalInfo.service)
    .filter(service => service && service.trim() !== '')
  )];
  
  const uniqueContracts = [...new Set(staff
    .map(s => s.professionalInfo.contractType)
    .filter(contract => contract && contract.trim() !== '')
  )];

  if (viewMode === 'create' || viewMode === 'edit') {
    return (
      <StaffForm
        staffId={selectedStaffId || undefined}
        onSave={handleSaveStaff}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6" />
            Gestion du Personnel Administratif
          </CardTitle>
          <p className="text-slate-600">
            Gérez le personnel administratif titulaire et vacataire de la faculté
          </p>
        </CardHeader>
        <CardContent>
          <StaffFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            contractFilter={contractFilter}
            onContractFilterChange={setContractFilter}
            serviceFilter={serviceFilter}
            onServiceFilterChange={setServiceFilter}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            uniqueContracts={uniqueContracts}
            uniqueServices={uniqueServices}
            onAddNew={handleAddNew}
          />

          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Personnel Administratif ({filteredStaff.length})</h3>
              <div className="flex gap-2">
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  Total: {staff.length}
                </Badge>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  Actifs: {staff.filter(s => s.professionalInfo.status === 'active').length}
                </Badge>
              </div>
            </div>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-slate-500">Chargement du personnel...</p>
              </div>
            ) : filteredStaff.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600">
                  {staff.length === 0 ? "Aucun personnel trouvé" : "Aucun personnel correspond aux filtres sélectionnés"}
                </p>
                {staff.length === 0 && (
                  <Button onClick={handleAddNew} className="mt-4 bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter le premier personnel
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredStaff.map((person) => (
                  <StaffCard
                    key={person.id}
                    person={person}
                    onEdit={handleEditStaff}
                    onMore={(id) => console.log("Plus d'actions:", id)}
                  />
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
