import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Download, Filter } from "lucide-react";
import { AdministrativeStaff } from "../../../types/administrative";
import { administrativeService } from "../../../services/administrativeService";
import { useToast } from "@/hooks/use-toast";
import { StaffFilters } from "./StaffFilters";
import { StaffCard } from "./StaffCard";

interface AdministrativeListViewProps {
  staff: AdministrativeStaff[];
  loading: boolean;
  onAddStaff: () => void;
  onEditStaff: (staff: AdministrativeStaff) => void;
  onViewStaff: (staff: AdministrativeStaff) => void;
  onRefresh: () => void;
  onToggleStatus: (staffId: string, newStatus: string) => Promise<void>;
}

export const AdministrativeListView: React.FC<AdministrativeListViewProps> = ({
  staff,
  loading,
  onAddStaff,
  onEditStaff,
  onViewStaff,
  onRefresh,
  onToggleStatus
}) => {
  const [filteredStaff, setFilteredStaff] = useState<AdministrativeStaff[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [contractFilter, setContractFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    filterStaff();
  }, [staff, searchTerm, contractFilter, serviceFilter, statusFilter]);

  const filterStaff = () => {
    let filtered = [...staff];

    if (searchTerm && searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(person => 
        person.personalInfo.firstName.toLowerCase().includes(searchLower) ||
        person.personalInfo.lastName.toLowerCase().includes(searchLower) ||
        person.personalInfo.email.toLowerCase().includes(searchLower) ||
        person.professionalInfo.employeeId.toLowerCase().includes(searchLower) ||
        person.professionalInfo.position.toLowerCase().includes(searchLower) ||
        person.professionalInfo.service.toLowerCase().includes(searchLower)
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

  const handleMoreActions = async (staffId: string, action: string) => {
    const person = staff.find(s => s.id === staffId);
    if (!person) return;

    try {
      switch (action) {
        case 'view':
          onViewStaff(person);
          break;
        case 'edit':
          onEditStaff(person);
          break;
        case 'toggle_status':
          const newStatus = person.professionalInfo.status === 'active' ? 'inactive' : 'active';
          await onToggleStatus(staffId, newStatus);
          toast({
            title: "Statut modifié",
            description: `Le statut du personnel a été modifié avec succès`
          });
          break;
        case 'delete':
          if (confirm('Êtes-vous sûr de vouloir supprimer ce personnel ?')) {
            await administrativeService.deleteStaff(staffId);
            onRefresh();
            toast({
              title: "Personnel supprimé",
              description: "Le personnel a été supprimé avec succès"
            });
          }
          break;
        default:
          console.log('Action non gérée:', action);
      }
    } catch (error) {
      console.error('Erreur lors de l\'action:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'effectuer cette action",
        variant: "destructive"
      });
    }
  };

  const handleExportData = () => {
    // Ici on pourrait implémenter l'export en CSV/Excel
    toast({
      title: "Export en cours",
      description: "La fonctionnalité d'export sera bientôt disponible"
    });
  };

  const uniqueServices = [...new Set(staff
    .map(s => s.professionalInfo.service)
    .filter(service => service && service.trim() !== '')
  )];
  
  const uniqueContracts = [...new Set(staff
    .map(s => s.professionalInfo.contractType)
    .filter(contract => contract && contract.trim() !== '')
  )];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-6 w-6" />
                Liste du Personnel Administratif
              </CardTitle>
              <p className="text-slate-600 mt-1">
                Gestion complète du personnel administratif de la faculté
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleExportData}>
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
              <Button onClick={onRefresh} variant="outline">
                Actualiser
              </Button>
            </div>
          </div>
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
            onAddNew={onAddStaff}
          />

          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                Personnel Administratif ({filteredStaff.length})
              </h3>
              <div className="flex gap-2">
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  Total: {staff.length}
                </Badge>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  Actifs: {staff.filter(s => s.professionalInfo.status === 'active').length}
                </Badge>
                <Badge variant="outline" className="bg-purple-50 text-purple-700">
                  Titulaires: {staff.filter(s => s.professionalInfo.contractType === 'titulaire').length}
                </Badge>
                <Badge variant="outline" className="bg-orange-50 text-orange-700">
                  Vacataires: {staff.filter(s => s.professionalInfo.contractType === 'vacataire').length}
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
                <p className="text-slate-600 mb-2">
                  {staff.length === 0 ? "Aucun personnel trouvé" : "Aucun personnel correspond aux filtres sélectionnés"}
                </p>
                {staff.length === 0 && (
                  <Button onClick={onAddStaff} className="bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter le premier personnel
                  </Button>
                )}
                {staff.length > 0 && (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchTerm('');
                      setContractFilter('all');
                      setServiceFilter('all');
                      setStatusFilter('all');
                    }}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Réinitialiser les filtres
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredStaff.map((person) => (
                  <StaffCard
                    key={person.id}
                    person={person}
                    onEdit={() => onEditStaff(person)}
                    onMore={(id) => handleMoreActions(id, 'view')}
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