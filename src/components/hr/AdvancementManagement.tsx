
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { TrendingUp, Users, Award, Calendar, Search, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AdvancementFilters } from "./advancement/AdvancementFilters";
import { CareerSimulation } from "./advancement/CareerSimulation";

interface Advancement {
  id: string;
  teacherId: string;
  teacherName: string;
  currentGrade: string;
  targetGrade: string;
  dateEligible: Date;
  dateRequested?: Date;
  status: 'eligible' | 'pending' | 'approved' | 'rejected';
  yearsInCurrentGrade: number;
  requiredYears: number;
  researchScore: number;
  teachingScore: number;
  serviceScore: number;
  overallScore: number;
  documents: string[];
  evaluationDate?: Date;
}

export const AdvancementManagement = () => {
  const [advancements, setAdvancements] = useState<Advancement[]>([
    {
      id: '1',
      teacherId: 'teacher1',
      teacherName: 'Dr. Ahmed Benali',
      currentGrade: 'Maitre Assistant A',
      targetGrade: 'Maitre de Conférences B',
      dateEligible: new Date('2024-01-01'),
      status: 'eligible',
      yearsInCurrentGrade: 6,
      requiredYears: 5,
      researchScore: 85,
      teachingScore: 90,
      serviceScore: 80,
      overallScore: 85,
      documents: ['cv.pdf', 'publications.pdf', 'evaluation.pdf']
    },
    {
      id: '2',
      teacherId: 'teacher2',
      teacherName: 'Dr. Fatima Zohra',
      currentGrade: 'Maitre de Conférences B',
      targetGrade: 'Maitre de Conférences A',
      dateEligible: new Date('2023-09-01'),
      dateRequested: new Date('2024-01-15'),
      status: 'pending',
      yearsInCurrentGrade: 7,
      requiredYears: 6,
      researchScore: 92,
      teachingScore: 88,
      serviceScore: 85,
      overallScore: 88,
      documents: ['dossier_complet.pdf'],
      evaluationDate: new Date('2024-02-15')
    }
  ]);

  const [filteredAdvancements, setFilteredAdvancements] = useState<Advancement[]>(advancements);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [gradeFilter, setGradeFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    filterAdvancements();
  }, [advancements, searchTerm, statusFilter, gradeFilter]);

  const filterAdvancements = () => {
    let filtered = advancements;

    if (searchTerm) {
      filtered = filtered.filter(adv => 
        adv.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        adv.currentGrade.toLowerCase().includes(searchTerm.toLowerCase()) ||
        adv.targetGrade.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(adv => adv.status === statusFilter);
    }

    if (gradeFilter !== 'all') {
      filtered = filtered.filter(adv => adv.currentGrade === gradeFilter);
    }

    setFilteredAdvancements(filtered);
  };

  const handleApprove = (id: string) => {
    setAdvancements(advancements.map(adv => 
      adv.id === id ? { ...adv, status: 'approved' as const } : adv
    ));
    toast({
      title: "Avancement approuvé",
      description: "L'avancement a été approuvé avec succès"
    });
  };

  const handleReject = (id: string) => {
    setAdvancements(advancements.map(adv => 
      adv.id === id ? { ...adv, status: 'rejected' as const } : adv
    ));
    toast({
      title: "Avancement rejeté",
      description: "L'avancement a été rejeté"
    });
  };

  const initiateAdvancement = (teacherId: string) => {
    toast({
      title: "Avancement initié",
      description: "La procédure d'avancement a été initiée"
    });
  };

  const eligibleCount = advancements.filter(adv => adv.status === 'eligible').length;
  const pendingCount = advancements.filter(adv => adv.status === 'pending').length;
  const approvedCount = advancements.filter(adv => adv.status === 'approved').length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6" />
            Gestion des Avancements
          </CardTitle>
          <p className="text-slate-600">
            Suivi et gestion des avancements de grade du personnel enseignant
          </p>
        </CardHeader>
        <CardContent>
          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{eligibleCount}</p>
              <p className="text-sm text-blue-800">Éligibles</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">{pendingCount}</p>
              <p className="text-sm text-orange-800">En attente</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
              <p className="text-sm text-green-800">Approuvés</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">{advancements.length}</p>
              <p className="text-sm text-purple-800">Total</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="list">Liste des Avancements</TabsTrigger>
          <TabsTrigger value="simulation">Simulation de Carrière</TabsTrigger>
          <TabsTrigger value="stats">Statistiques</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Avancements ({filteredAdvancements.length})</CardTitle>
                <Button className="bg-green-600 hover:bg-green-700">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Nouvel Avancement
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filtres */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="eligible">Éligible</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="approved">Approuvé</SelectItem>
                    <SelectItem value="rejected">Rejeté</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={gradeFilter} onValueChange={setGradeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Grade actuel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les grades</SelectItem>
                    <SelectItem value="Assistant">Assistant</SelectItem>
                    <SelectItem value="Maitre Assistant A">Maitre Assistant A</SelectItem>
                    <SelectItem value="Maitre Assistant B">Maitre Assistant B</SelectItem>
                    <SelectItem value="Maitre de Conférences B">Maitre de Conférences B</SelectItem>
                    <SelectItem value="Maitre de Conférences A">Maitre de Conférences A</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Plus de filtres
                </Button>
              </div>

              {/* Liste des avancements */}
              <div className="space-y-4">
                {filteredAdvancements.map((advancement) => (
                  <div key={advancement.id} className="border rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{advancement.teacherName}</h3>
                        <p className="text-sm text-slate-600">
                          {advancement.currentGrade} → {advancement.targetGrade}
                        </p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs ${
                        advancement.status === 'approved' ? 'bg-green-100 text-green-800' :
                        advancement.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                        advancement.status === 'eligible' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {advancement.status === 'approved' ? 'Approuvé' :
                         advancement.status === 'pending' ? 'En attente' :
                         advancement.status === 'eligible' ? 'Éligible' : 'Rejeté'}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium">Ancienneté</p>
                        <p className="text-sm text-slate-600">
                          {advancement.yearsInCurrentGrade} / {advancement.requiredYears} ans
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Score Recherche</p>
                        <p className="text-sm text-slate-600">{advancement.researchScore}/100</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Score Enseignement</p>
                        <p className="text-sm text-slate-600">{advancement.teachingScore}/100</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Score Global</p>
                        <p className="text-sm font-semibold text-blue-600">{advancement.overallScore}/100</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-slate-600">
                        Éligible depuis: {advancement.dateEligible.toLocaleDateString()}
                        {advancement.evaluationDate && (
                          <span className="ml-4">
                            Évaluation: {advancement.evaluationDate.toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {advancement.status === 'pending' && (
                          <>
                            <Button 
                              size="sm" 
                              onClick={() => handleApprove(advancement.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Approuver
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleReject(advancement.id)}
                            >
                              Rejeter
                            </Button>
                          </>
                        )}
                        {advancement.status === 'eligible' && (
                          <Button 
                            size="sm"
                            onClick={() => initiateAdvancement(advancement.teacherId)}
                          >
                            Initier Avancement
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="simulation">
          <CareerSimulation />
        </TabsContent>

        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>Statistiques des Avancements</CardTitle>
              <p className="text-slate-600">
                Analyse détaillée des avancements par grade et période
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">Taux de Réussite</h3>
                  <p className="text-3xl font-bold text-blue-600">
                    {((approvedCount / (approvedCount + pendingCount + eligibleCount)) * 100 || 0).toFixed(1)}%
                  </p>
                </div>
                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Temps Moyen</h3>
                  <p className="text-3xl font-bold text-green-600">
                    {(advancements.reduce((sum, adv) => sum + adv.yearsInCurrentGrade, 0) / advancements.length || 0).toFixed(1)} ans
                  </p>
                </div>
                <div className="text-center p-6 bg-purple-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-purple-800 mb-2">Score Moyen</h3>
                  <p className="text-3xl font-bold text-purple-600">
                    {(advancements.reduce((sum, adv) => sum + adv.overallScore, 0) / advancements.length || 0).toFixed(1)}/100
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
