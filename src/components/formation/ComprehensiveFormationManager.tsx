import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  Plus, 
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertTriangle,
  Users,
  BookOpen,
  Award,
  FileText,
  TrendingUp,
  Palette
} from "lucide-react";
import { FormationOffer, ValidationEntry } from "../../types/academic";
import { FormationStatistics } from "./statistics/FormationStatistics";
import { CanevasManager } from "../curriculum/CanevasManager";
import { FormationSearchFilters } from "./search/FormationSearchFilters";
import { FormationExportManager } from "./export/FormationExportManager";
import { academicConfigService } from "../../services/academicConfigService";
import { useToast } from "@/hooks/use-toast";

export const ComprehensiveFormationManager = () => {
  const [formations, setFormations] = useState<FormationOffer[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("overview");
  const [selectedFormation, setSelectedFormation] = useState<FormationOffer | null>(null);
  const [showCreationForm, setShowCreationForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [diplomaTypeFilter, setDiplomaTypeFilter] = useState("all");
  const [modalityFilter, setModalityFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [selectedFormations, setSelectedFormations] = useState<string[]>([]);

  useEffect(() => {
    loadFormations();
  }, []);

  const loadFormations = async () => {
    setLoading(true);
    try {
      const formationsData = await academicConfigService.getFormationOffers();
      console.log('Formations chargées depuis academicConfigService:', formationsData);
      setFormations(formationsData);
    } catch (error) {
      console.error('Erreur lors du chargement des formations:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les formations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredFormations = formations.filter(formation => {
    const matchesSearch = formation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         formation.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         formation.responsibleName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || formation.status === statusFilter;
    const matchesDiplomaType = diplomaTypeFilter === "all" || formation.diplomaType === diplomaTypeFilter;
    const matchesModality = modalityFilter === "all" || formation.modality === modalityFilter;
    const matchesYear = yearFilter === "all" || formation.academicYear === yearFilter;
    
    return matchesSearch && matchesStatus && matchesDiplomaType && matchesModality && matchesYear;
  });

  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchTerm) count++;
    if (statusFilter !== "all") count++;
    if (diplomaTypeFilter !== "all") count++;
    if (modalityFilter !== "all") count++;
    if (yearFilter !== "all") count++;
    return count;
  };

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setDiplomaTypeFilter("all");
    setModalityFilter("all");
    setYearFilter("all");
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      draft: "bg-gray-100 text-gray-800",
      validation: "bg-yellow-100 text-yellow-800",
      validated: "bg-green-100 text-green-800",
      archived: "bg-red-100 text-red-800"
    };
    return styles[status as keyof typeof styles] || styles.draft;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Edit className="h-3 w-3" />;
      case 'validation': return <Clock className="h-3 w-3" />;
      case 'validated': return <CheckCircle className="h-3 w-3" />;
      case 'archived': return <AlertTriangle className="h-3 w-3" />;
      default: return <Edit className="h-3 w-3" />;
    }
  };

  const handleCreateFormation = (formation: Partial<FormationOffer>) => {
    const newFormation: FormationOffer = {
      id: Date.now().toString(),
      ...formation,
      modules: [],
      sections: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'draft',
      validationHistory: [],
      totalECTS: 0
    } as FormationOffer;

    setFormations(prev => [...prev, newFormation]);
    setShowCreationForm(false);
  };

  const handleUpdateFormation = (formation: FormationOffer) => {
    setFormations(prev => prev.map(f => f.id === formation.id ? formation : f));
  };

  const handleDeleteFormation = (formationId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette formation ?")) {
      setFormations(prev => prev.filter(f => f.id !== formationId));
    }
  };

  const handleDuplicateFormation = (formation: FormationOffer) => {
    const duplicatedFormation: FormationOffer = {
      ...formation,
      id: Date.now().toString(),
      name: `${formation.name} (Copie)`,
      code: `${formation.code}-COPY`,
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
      validationHistory: []
    };
    
    setFormations(prev => [...prev, duplicatedFormation]);
  };

  const handleSelectFormation = (formationId: string, selected: boolean) => {
    if (selected) {
      setSelectedFormations(prev => [...prev, formationId]);
    } else {
      setSelectedFormations(prev => prev.filter(id => id !== formationId));
    }
  };

  const getStatsCounts = () => {
    const total = formations.length;
    const draft = formations.filter(f => f.status === 'draft').length;
    const validation = formations.filter(f => f.status === 'validation').length;
    const validated = formations.filter(f => f.status === 'validated').length;
    const archived = formations.filter(f => f.status === 'archived').length;

    return { total, draft, validation, validated, archived };
  };

  const stats = getStatsCounts();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Chargement des formations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête unifié bleu */}
      <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="h-8 w-8" />
            Système de Gestion des Formations
          </CardTitle>
          <p className="text-blue-100">
            Module complet pour la modification, validation et gestion des programmes d'études
          </p>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
              <p className="text-sm text-blue-800">Total</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Edit className="h-8 w-8 text-gray-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-600">{stats.draft}</p>
              <p className="text-sm text-gray-800">Brouillons</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-yellow-600">{stats.validation}</p>
              <p className="text-sm text-yellow-800">En validation</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">{stats.validated}</p>
              <p className="text-sm text-green-800">Validées</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-red-600">{stats.archived}</p>
              <p className="text-sm text-red-800">Archivées</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-white border border-blue-200">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="canevas" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Canevas
          </TabsTrigger>
          <TabsTrigger value="statistics">Statistiques</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-blue-800">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-medium">Information importante</span>
            </div>
            <p className="text-blue-700 mt-2">
              Pour créer de nouvelles formations, rendez-vous dans le module <strong>Administration</strong> → 
              onglet <strong>Faculté</strong> → section <strong>Spécialités & Formations</strong>.
            </p>
          </div>

          <FormationSearchFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            diplomaTypeFilter={diplomaTypeFilter}
            onDiplomaTypeChange={setDiplomaTypeFilter}
            modalityFilter={modalityFilter}
            onModalityChange={setModalityFilter}
            yearFilter={yearFilter}
            onYearChange={setYearFilter}
            onResetFilters={resetFilters}
            activeFiltersCount={getActiveFiltersCount()}
          />

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Liste des Formations ({filteredFormations.length})</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Exporter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredFormations.map((formation) => (
                  <div key={formation.id} className="border rounded-lg p-6 bg-white">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={selectedFormations.includes(formation.id)}
                          onChange={(e) => handleSelectFormation(formation.id, e.target.checked)}
                          className="mt-1"
                        />
                        <div>
                          <h3 className="text-lg font-semibold text-slate-800">{formation.name}</h3>
                          <p className="text-sm text-slate-600">{formation.code} - {formation.academicYear}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                            <span>📚 {formation.diplomaType.toUpperCase()}</span>
                            <span>🎯 {formation.totalECTS} ECTS</span>
                            <span>👥 Max: {formation.maxCapacity}</span>
                            <span>🌐 {formation.modality}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Badge className={getStatusBadge(formation.status)}>
                          {getStatusIcon(formation.status)}
                          <span className="ml-1 capitalize">{formation.status}</span>
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-slate-700">Responsable</p>
                        <p className="text-sm text-slate-600">{formation.responsibleName}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-700">Dernière modification</p>
                        <p className="text-sm text-slate-600">
                          {new Date(formation.updatedAt).toLocaleDateString()} par {formation.lastModifiedBy}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-slate-600">
                        {formation.pedagogicalObjectives.length} objectifs • {formation.careerProspects.length} débouchés
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setSelectedFormation(formation)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Voir
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setSelectedFormation(formation)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Modifier
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDuplicateFormation(formation)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          Dupliquer
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDeleteFormation(formation.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredFormations.length === 0 && (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-500">Aucune formation trouvée</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="canevas">
          <CanevasManager />
        </TabsContent>

        <TabsContent value="statistics">
          <FormationStatistics formations={formations} />
        </TabsContent>

        <TabsContent value="export">
          <FormationExportManager 
            formations={formations}
            selectedFormations={selectedFormations}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
