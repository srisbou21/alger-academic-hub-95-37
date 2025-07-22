
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  TrendingUp, 
  Calendar,
  Award,
  Bell,
  Search,
  Filter,
  FileSpreadsheet,
  Download,
  UserCheck,
  GraduationCap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { advancementService } from "../../../services/advancementService";
import { EchelonAdvancement } from "../../../types/advancement";
import { PromotionDialog } from "./PromotionDialog";
import { echelonHistoryService, EchelonHistoryEntry } from "../../../services/echelonHistoryService";

interface AutomaticTrackingDashboardProps {
  employees: Array<{
    id: string;
    name: string;
    type: 'enseignant' | 'administratif';
    grade: string;
    currentEchelon: number;
    appointmentDate: Date;
    lastEvaluationScore: number;
    status: 'active' | 'inactive' | 'suspended';
  }>;
}

interface AutoTrackingEmployee {
  id: string;
  name: string;
  type: 'enseignant' | 'administratif';
  grade: string;
  currentEchelon: number;
  monthsSinceLastPromotion: number;
  lastPromotionDate: Date | null;
  isEligible: boolean;
  status: 'active' | 'inactive' | 'suspended';
}

export const AutomaticTrackingDashboard: React.FC<AutomaticTrackingDashboardProps> = ({ employees }) => {
  const [autoTrackingEmployees, setAutoTrackingEmployees] = useState<AutoTrackingEmployee[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [employeeTypeFilter, setEmployeeTypeFilter] = useState('all');
  const [eligibilityFilter, setEligibilityFilter] = useState('all');
  const [promotionDialogOpen, setPromotionDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<AutoTrackingEmployee | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadAutoTrackingData();
  }, [employees]);

  const loadAutoTrackingData = async () => {
    setLoading(true);
    try {
      const trackingEmployees: AutoTrackingEmployee[] = [];
      
      for (const employee of employees) {
        if (employee.status !== 'active') continue;
        
        const monthsSinceLastPromotion = echelonHistoryService.calculateMonthsSinceLastPromotion(employee.id);
        const isEligible = monthsSinceLastPromotion >= 30;
        
        // Seuls les employés éligibles (30+ mois) sont ajoutés à la liste de suivi auto
        if (isEligible) {
          const history = await echelonHistoryService.getEmployeeHistory(employee.id);
          const lastPromotionDate = history.length > 0 ? new Date(history[0].promotionDate) : null;
          
          trackingEmployees.push({
            id: employee.id,
            name: employee.name,
            type: employee.type,
            grade: employee.grade,
            currentEchelon: employee.currentEchelon,
            monthsSinceLastPromotion,
            lastPromotionDate,
            isEligible: true,
            status: employee.status
          });
        }
      }
      
      setAutoTrackingEmployees(trackingEmployees);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les données de suivi automatique",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Filtrage des employés
  const filteredEmployees = autoTrackingEmployees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = employeeTypeFilter === 'all' || employee.type === employeeTypeFilter;
    const matchesEligibility = eligibilityFilter === 'all' || 
      (eligibilityFilter === 'eligible' && employee.isEligible) ||
      (eligibilityFilter === 'non-eligible' && !employee.isEligible);
    
    return matchesSearch && matchesType && matchesEligibility;
  });

  const handlePromoteClick = (employee: AutoTrackingEmployee) => {
    setSelectedEmployee(employee);
    setPromotionDialogOpen(true);
  };

  const handlePromote = async (employeeId: string, duration: 'courte' | 'moyenne' | 'longue') => {
    try {
      const employee = autoTrackingEmployees.find(emp => emp.id === employeeId);
      if (!employee) return;

      const durationMonths = duration === 'courte' ? 30 : duration === 'moyenne' ? 36 : 42;
      
      // Calculer la date d'acquisition (promotion date + duration)
      const promotionDate = new Date();
      const acquisitionDate = new Date(promotionDate);
      acquisitionDate.setMonth(acquisitionDate.getMonth() + durationMonths);

      // Ajouter à l'historique des échelons avec la date d'acquisition calculée
      await echelonHistoryService.addHistoryEntry({
        employeeId: employee.id,
        employeeName: employee.name,
        previousEchelon: employee.currentEchelon,
        newEchelon: employee.currentEchelon + 1,
        grade: employee.grade,
        promotionDate,
        acquisitionDate,
        duration,
        durationMonths,
        reason: `Promotion automatique - ${duration} durée`,
        processedBy: 'Système RH'
      });

      // Mettre à jour la liste de suivi automatique
      await loadAutoTrackingData();

      toast({
        title: "Promotion réussie",
        description: `${employee.name} a été promu à l'échelon ${employee.currentEchelon + 1} avec une durée ${duration}. Date d'acquisition: ${acquisitionDate.toLocaleDateString()}.`,
        duration: 4000
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de traiter la promotion",
        variant: "destructive"
      });
    }
  };

  const exportTrackingReport = () => {
    const csvHeader = [
      'Nom et Prénom',
      'Type Personnel',
      'Grade',
      'Échelon Actuel',
      'Mois depuis dernière promotion',
      'Dernière promotion',
      'Statut éligibilité',
      'Date d\'ajout au suivi'
    ].join(';');

    const csvRows = filteredEmployees.map(employee => [
      `"${employee.name}"`,
      `"${employee.type === 'enseignant' ? 'Personnel Enseignant' : 'Personnel Administratif'}"`,
      `"${employee.grade}"`,
      employee.currentEchelon,
      employee.monthsSinceLastPromotion,
      employee.lastPromotionDate ? `"${employee.lastPromotionDate.toLocaleDateString()}"` : '"Aucune promotion enregistrée"',
      '"Éligible (30+ mois)"',
      `"${new Date().toLocaleDateString()}"`
    ].join(';'));

    const csvContent = [csvHeader, ...csvRows].join('\n');
    const filename = `suivi_automatique_echelons_${new Date().toISOString().split('T')[0]}.csv`;
    
    const BOM = '\uFEFF';
    const csvWithBOM = BOM + csvContent;
    const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Export réussi",
      description: `Liste de suivi automatique exportée (${filteredEmployees.length} employés)`,
      duration: 3000
    });
  };

  const resetFilters = () => {
    setSearchTerm('');
    setEmployeeTypeFilter('all');
    setEligibilityFilter('all');
  };

  const eligibleCount = filteredEmployees.filter(e => e.isEligible).length;
  const enseignantCount = filteredEmployees.filter(e => e.type === 'enseignant').length;
  const adminCount = filteredEmployees.filter(e => e.type === 'administratif').length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-blue-500" />
            Suivi Automatique des Échelons
          </CardTitle>
          <p className="text-slate-600">
            Employés automatiquement ajoutés après 30 mois sans promotion
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">{filteredEmployees.length}</p>
              <p className="text-sm text-blue-800">En suivi automatique</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">{eligibleCount}</p>
              <p className="text-sm text-green-800">Éligibles à promotion</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <GraduationCap className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-600">{enseignantCount}</p>
              <p className="text-sm text-purple-800">Enseignants</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <UserCheck className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-orange-600">{adminCount}</p>
              <p className="text-sm text-orange-800">Personnel Admin</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filtres de recherche */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres de Recherche
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher par nom..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={employeeTypeFilter} onValueChange={setEmployeeTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Type d'employé" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="enseignant">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Personnel Enseignant
                  </div>
                </SelectItem>
                <SelectItem value="administratif">
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4" />
                    Personnel Administratif
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={resetFilters}>
              Réinitialiser
            </Button>

            <Button 
              onClick={exportTrackingReport}
              className="bg-green-600 hover:bg-green-700"
            >
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Exporter ({filteredEmployees.length})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Liste des employés en suivi automatique */}
      <Card>
        <CardHeader>
          <CardTitle>Employés en Suivi Automatique ({filteredEmployees.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredEmployees.map((employee) => (
              <div key={employee.id} className="border rounded-lg p-6 bg-white">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">{employee.name}</h3>
                    <p className="text-sm text-slate-600">{employee.grade}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {employee.type === 'enseignant' ? (
                        <GraduationCap className="h-4 w-4 text-blue-600" />
                      ) : (
                        <UserCheck className="h-4 w-4 text-green-600" />
                      )}
                      <span className="text-xs text-slate-600">
                        {employee.type === 'enseignant' ? 'Personnel Enseignant' : 'Personnel Administratif'}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Badge className="bg-red-100 text-red-800">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      {employee.monthsSinceLastPromotion} mois
                    </Badge>
                    <Badge className="bg-blue-100 text-blue-800">
                      Suivi Auto
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-slate-700">Échelon Actuel</p>
                    <p className="text-lg font-bold text-slate-800">{employee.currentEchelon}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">Mois sans promotion</p>
                    <p className="text-lg font-bold text-red-600">{employee.monthsSinceLastPromotion}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">Dernière promotion</p>
                    <p className="text-sm text-slate-600">
                      {employee.lastPromotionDate ? 
                        employee.lastPromotionDate.toLocaleDateString() : 
                        'Aucune promotion enregistrée'
                      }
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-600">
                    Ajouté automatiquement au suivi (30+ mois sans promotion)
                  </div>
                  <Button 
                    onClick={() => handlePromoteClick(employee)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Award className="h-4 w-4 mr-2" />
                    Promouvoir à l'échelon suivant
                  </Button>
                </div>
              </div>
            ))}

            {filteredEmployees.length === 0 && (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-500">
                  {loading ? 'Chargement...' : 'Aucun employé en suivi automatique'}
                </p>
                {!loading && (
                  <p className="text-sm text-slate-400 mt-2">
                    Les employés sont automatiquement ajoutés après 30 mois sans promotion
                  </p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dialog de promotion */}
      {selectedEmployee && (
        <PromotionDialog
          isOpen={promotionDialogOpen}
          onClose={() => {
            setPromotionDialogOpen(false);
            setSelectedEmployee(null);
          }}
          employee={{
            id: selectedEmployee.id,
            name: selectedEmployee.name,
            grade: selectedEmployee.grade,
            currentEchelon: selectedEmployee.currentEchelon,
            employeeType: selectedEmployee.type
          }}
          onPromote={handlePromote}
        />
      )}
    </div>
  );
};
