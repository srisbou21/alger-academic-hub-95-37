
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  BookOpen, 
  GraduationCap, 
  Users, 
  Calendar,
  Building2,
  School
} from "lucide-react";
import { academicConfigService } from "../../services/academicConfigService";
import { FormationOffer, Specialty, Filiere, Department, Faculty } from "../../types/academic";

interface FormationWithDetails {
  formation: FormationOffer;
  specialty: Specialty;
  filiere: Filiere;
  department: Department;
  faculty: Faculty;
}

export const ComprehensiveFormationOfferManager = () => {
  const [formations, setFormations] = useState<FormationWithDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadFormations();
  }, []);

  const loadFormations = async () => {
    setLoading(true);
    try {
      const formationsWithDetails = await academicConfigService.getFormationsWithDetails();
      setFormations(formationsWithDetails);
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

  const getFormationsByLevel = (level: string) => {
    return formations.filter(f => f.formation.level === level);
  };

  const getStatistics = () => {
    const total = formations.length;
    const licence = getFormationsByLevel('licence').length;
    const master = getFormationsByLevel('master').length;
    const validated = formations.filter(f => f.formation.status === 'validated').length;
    
    return { total, licence, master, validated };
  };

  const stats = getStatistics();

  const FormationCard = ({ item }: { item: FormationWithDetails }) => (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-slate-800 mb-2">
              {item.formation.name}
            </CardTitle>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={item.formation.level === 'licence' ? 'default' : 'secondary'}>
                {item.formation.level.toUpperCase()}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {item.formation.totalECTS} ECTS
              </Badge>
              <Badge variant={item.formation.status === 'validated' ? 'default' : 'destructive'}>
                {item.formation.status === 'validated' ? 'Validée' : item.formation.status}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-slate-600 mb-4">
          {item.formation.pedagogicalObjectives?.join(', ') || 'Aucune description disponible'}
        </p>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-slate-500" />
            <span className="text-slate-700">{item.faculty.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <School className="h-4 w-4 text-slate-500" />
            <span className="text-slate-700">{item.department.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-slate-500" />
            <span className="text-slate-700">{item.filiere.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-slate-500" />
            <span className="text-slate-700">{item.specialty.name} ({item.specialty.code})</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-500" />
            <span className="text-slate-700">Durée: {item.formation.duration} an(s)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            Gestion des Offres de Formation
          </CardTitle>
          <p className="text-slate-600">
            Vue d'ensemble de toutes les formations disponibles dans l'établissement
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <BookOpen className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-blue-800">{stats.total}</p>
                  <p className="text-sm text-blue-600">Total Formations</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <GraduationCap className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-green-800">{stats.licence}</p>
                  <p className="text-sm text-green-600">Licences</p>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <School className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold text-purple-800">{stats.master}</p>
                  <p className="text-sm text-purple-600">Masters</p>
                </div>
              </div>
            </div>
            <div className="bg-emerald-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-emerald-600" />
                <div>
                  <p className="text-2xl font-bold text-emerald-800">{stats.validated}</p>
                  <p className="text-sm text-emerald-600">Validées</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Formations par Niveau</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">Toutes ({formations.length})</TabsTrigger>
                  <TabsTrigger value="licence">Licences ({stats.licence})</TabsTrigger>
                  <TabsTrigger value="master">Masters ({stats.master})</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {formations.map((item) => (
                      <FormationCard key={item.formation.id} item={item} />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="licence" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {getFormationsByLevel('licence').map((item) => (
                      <FormationCard key={item.formation.id} item={item} />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="master" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {getFormationsByLevel('master').map((item) => (
                      <FormationCard key={item.formation.id} item={item} />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
