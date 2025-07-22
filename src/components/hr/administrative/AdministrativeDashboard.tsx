import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, Calendar, Award, Briefcase, CheckCircle } from "lucide-react";
import { AdministrativeStatistics } from "../../../types/administrative";
import { administrativeService } from "../../../services/administrativeService";
import { useToast } from "@/hooks/use-toast";

export const AdministrativeDashboard = () => {
  const [statistics, setStatistics] = useState<AdministrativeStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    setLoading(true);
    try {
      const stats = await administrativeService.getStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les statistiques",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-slate-500">Chargement des statistiques...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Personnel Total</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics?.totalStaff || 0}</div>
            <p className="text-xs text-muted-foreground">
              Tous types de contrats confondus
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Salaire Moyen</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statistics?.averageSalary ? `${statistics.averageSalary.toLocaleString()} DA` : '0 DA'}
            </div>
            <p className="text-xs text-muted-foreground">
              Salaire brut mensuel
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux d'Absence</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statistics?.absenceRate ? `${statistics.absenceRate.toFixed(1)}%` : '0%'}
            </div>
            <p className="text-xs text-muted-foreground">
              Ce mois-ci
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tâches Terminées</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statistics?.taskCompletionRate ? `${statistics.taskCompletionRate.toFixed(1)}%` : '0%'}
            </div>
            <p className="text-xs text-muted-foreground">
              Taux de completion
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Répartition par type de contrat */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Répartition par Type de Contrat
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {statistics?.byContractType && Object.entries(statistics.byContractType).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="secondary" 
                      className={
                        type === 'titulaire' ? 'bg-blue-100 text-blue-800' :
                        type === 'vacataire' ? 'bg-purple-100 text-purple-800' :
                        type === 'contractuel' ? 'bg-orange-100 text-orange-800' :
                        'bg-yellow-100 text-yellow-800'
                      }
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Badge>
                  </div>
                  <span className="font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Répartition par Service
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {statistics?.byService && Object.entries(statistics.byService).map(([service, count]) => (
                <div key={service} className="flex items-center justify-between">
                  <span className="text-sm">{service}</span>
                  <Badge variant="outline">{count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Retraites prochaines */}
      {statistics?.upcomingRetirements && statistics.upcomingRetirements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Retraites Prochaines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {statistics.upcomingRetirements.map((retirement) => (
                <div key={retirement.staffId} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div>
                    <p className="font-medium">{retirement.staffName}</p>
                    <p className="text-sm text-muted-foreground">
                      Date de retraite: {new Date(retirement.retirementDate).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-orange-100 text-orange-800">
                    Retraite
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Répartition par statut */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Répartition par Statut
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statistics?.byStatus && Object.entries(statistics.byStatus).map(([status, count]) => (
              <div key={status} className="text-center">
                <div className="text-2xl font-bold">
                  {count}
                </div>
                <Badge 
                  variant="secondary"
                  className={
                    status === 'active' ? 'bg-green-100 text-green-800' :
                    status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                    status === 'suspended' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }
                >
                  {status === 'active' ? 'Actifs' :
                   status === 'inactive' ? 'Inactifs' :
                   status === 'suspended' ? 'Suspendus' :
                   status === 'retired' ? 'Retraités' : status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};