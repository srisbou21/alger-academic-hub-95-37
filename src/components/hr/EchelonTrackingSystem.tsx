
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Award, Calendar, TrendingUp, Users, AlertTriangle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Employee {
  id: string;
  name: string;
  type: 'enseignant' | 'administratif';
  department: string;
  grade: string;
  currentEchelon: number;
  maxEchelon: number;
  appointmentDate: Date;
  lastPromotionDate: Date;
  nextEligibilityDate: Date;
  evaluationScore: number;
  status: 'active' | 'inactive' | 'suspended';
  requiredDuration: 30 | 36 | 42; // en mois
}

interface AutomaticPromotion {
  id: string;
  employeeId: string;
  employeeName: string;
  fromEchelon: number;
  toEchelon: number;
  effectiveDate: Date;
  reason: string;
  processed: boolean;
}

export const EchelonTrackingSystem = () => {
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: '1',
      name: 'Dr. Ahmed Benali',
      type: 'enseignant',
      department: 'Informatique',
      grade: 'Maitre de Conférences A',
      currentEchelon: 3,
      maxEchelon: 12,
      appointmentDate: new Date('2021-01-15'),
      lastPromotionDate: new Date('2021-01-15'),
      nextEligibilityDate: new Date('2024-01-15'),
      evaluationScore: 18,
      status: 'active',
      requiredDuration: 30
    },
    {
      id: '2',
      name: 'Mme. Fatima Zohra',
      type: 'administratif',
      department: 'Secrétariat',
      grade: 'Attaché Principal',
      currentEchelon: 5,
      maxEchelon: 12,
      appointmentDate: new Date('2020-09-01'),
      lastPromotionDate: new Date('2020-09-01'),
      nextEligibilityDate: new Date('2023-09-01'),
      evaluationScore: 16,
      status: 'active',
      requiredDuration: 36
    }
  ]);

  const [automaticPromotions, setAutomaticPromotions] = useState<AutomaticPromotion[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    checkAutomaticPromotions();
  }, [employees]);

  const checkAutomaticPromotions = () => {
    const today = new Date();
    const pendingPromotions: AutomaticPromotion[] = [];

    employees.forEach(employee => {
      if (employee.status === 'active' && 
          employee.currentEchelon < employee.maxEchelon &&
          today >= employee.nextEligibilityDate) {
        
        pendingPromotions.push({
          id: `promo_${employee.id}_${Date.now()}`,
          employeeId: employee.id,
          employeeName: employee.name,
          fromEchelon: employee.currentEchelon,
          toEchelon: employee.currentEchelon + 1,
          effectiveDate: employee.nextEligibilityDate,
          reason: `Durée réglementaire atteinte (${employee.requiredDuration} mois)`,
          processed: false
        });
      }
    });

    setAutomaticPromotions(pendingPromotions);
  };

  const processAutomaticPromotion = (promotionId: string) => {
    const promotion = automaticPromotions.find(p => p.id === promotionId);
    if (!promotion) return;

    // Mettre à jour l'employé
    setEmployees(employees.map(emp => 
      emp.id === promotion.employeeId 
        ? {
            ...emp,
            currentEchelon: promotion.toEchelon,
            lastPromotionDate: new Date(),
            nextEligibilityDate: calculateNextEligibilityDate(new Date(), emp.requiredDuration)
          }
        : emp
    ));

    // Marquer la promotion comme traitée
    setAutomaticPromotions(automaticPromotions.map(p => 
      p.id === promotionId ? { ...p, processed: true } : p
    ));

    toast({
      title: "Promotion automatique effectuée",
      description: `${promotion.employeeName} a été promu(e) à l'échelon ${promotion.toEchelon}`
    });
  };

  const calculateNextEligibilityDate = (currentDate: Date, duration: number): Date => {
    const nextDate = new Date(currentDate);
    nextDate.setMonth(nextDate.getMonth() + duration);
    return nextDate;
  };

  const calculateProgress = (employee: Employee): number => {
    const today = new Date();
    const totalDuration = employee.requiredDuration * 30 * 24 * 60 * 60 * 1000; // en ms
    const elapsed = today.getTime() - employee.lastPromotionDate.getTime();
    return Math.min((elapsed / totalDuration) * 100, 100);
  };

  const getDurationLabel = (duration: 30 | 36 | 42): string => {
    switch (duration) {
      case 30: return 'Rapide (30 mois)';
      case 36: return 'Normal (36 mois)';
      case 42: return 'Lent (42 mois)';
    }
  };

  const getEvaluationBadge = (score: number) => {
    if (score >= 18) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
    if (score >= 14) return <Badge className="bg-blue-100 text-blue-800">Satisfaisant</Badge>;
    if (score >= 12) return <Badge className="bg-yellow-100 text-yellow-800">Passable</Badge>;
    return <Badge className="bg-red-100 text-red-800">Insuffisant</Badge>;
  };

  const eligibleCount = automaticPromotions.filter(p => !p.processed).length;
  const teacherCount = employees.filter(e => e.type === 'enseignant').length;
  const adminCount = employees.filter(e => e.type === 'administratif').length;
  const averageEchelon = Math.round(employees.reduce((sum, e) => sum + e.currentEchelon, 0) / employees.length);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-6 w-6" />
            Système de Suivi Automatique des Échelons
          </CardTitle>
          <p className="text-slate-600">
            Suivi automatisé des promotions d'échelons pour les enseignants et le personnel administratif
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-2xl font-bold text-red-600">{eligibleCount}</p>
              <p className="text-sm text-red-800">Promotions en attente</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{teacherCount}</p>
              <p className="text-sm text-blue-800">Enseignants suivis</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{adminCount}</p>
              <p className="text-sm text-green-800">Personnel administratif</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">{averageEchelon}</p>
              <p className="text-sm text-purple-800">Échelon moyen</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="tracking" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tracking">Suivi Échelons</TabsTrigger>
          <TabsTrigger value="promotions">Promotions Automatiques</TabsTrigger>
          <TabsTrigger value="statistics">Statistiques</TabsTrigger>
        </TabsList>

        <TabsContent value="tracking" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Suivi Individual des Échelons</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {employees.map((employee) => {
                  const progress = calculateProgress(employee);
                  const isEligible = new Date() >= employee.nextEligibilityDate;
                  
                  return (
                    <div key={employee.id} className="border rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">{employee.name}</h3>
                          <p className="text-sm text-slate-600">
                            {employee.grade} - {employee.type === 'enseignant' ? 'Enseignant' : 'Personnel Administratif'}
                          </p>
                          <p className="text-sm text-slate-500">{employee.department}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getEvaluationBadge(employee.evaluationScore)}
                          {isEligible && (
                            <Badge className="bg-red-100 text-red-800">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Éligible
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium">Échelon Actuel</p>
                          <p className="text-lg font-semibold text-blue-600">
                            {employee.currentEchelon} / {employee.maxEchelon}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Durée d'Avancement</p>
                          <p className="text-sm text-slate-600">
                            {getDurationLabel(employee.requiredDuration)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Prochaine Éligibilité</p>
                          <p className="text-sm text-slate-600">
                            {employee.nextEligibilityDate.toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-sm font-medium">Progression vers prochaine promotion</p>
                          <p className="text-sm text-slate-600">{Math.round(progress)}%</p>
                        </div>
                        <Progress value={progress} className="w-full" />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-slate-600">
                          Dernière promotion: {employee.lastPromotionDate.toLocaleDateString()}
                        </div>
                        {isEligible && employee.currentEchelon < employee.maxEchelon && (
                          <Button
                            onClick={() => {
                              const promotion: AutomaticPromotion = {
                                id: `manual_${employee.id}_${Date.now()}`,
                                employeeId: employee.id,
                                employeeName: employee.name,
                                fromEchelon: employee.currentEchelon,
                                toEchelon: employee.currentEchelon + 1,
                                effectiveDate: new Date(),
                                reason: 'Promotion manuelle',
                                processed: false
                              };
                              processAutomaticPromotion(promotion.id);
                            }}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Award className="h-4 w-4 mr-2" />
                            Promouvoir
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="promotions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Promotions Automatiques En Attente</CardTitle>
              <p className="text-slate-600">
                Promotions détectées automatiquement par le système
              </p>
            </CardHeader>
            <CardContent>
              {automaticPromotions.filter(p => !p.processed).length > 0 ? (
                <div className="space-y-4">
                  {automaticPromotions
                    .filter(p => !p.processed)
                    .map((promotion) => (
                      <div key={promotion.id} className="border rounded-lg p-4 bg-blue-50">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">{promotion.employeeName}</h4>
                            <p className="text-sm text-slate-600">
                              Échelon {promotion.fromEchelon} → Échelon {promotion.toEchelon}
                            </p>
                            <p className="text-sm text-slate-500">
                              Raison: {promotion.reason}
                            </p>
                            <p className="text-sm text-slate-500">
                              Date d'effet: {promotion.effectiveDate.toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => processAutomaticPromotion(promotion.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approuver
                            </Button>
                            <Button variant="outline">
                              Reporter
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-500">Aucune promotion automatique en attente</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Statistiques du Système</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Répartition par Type</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Enseignants</span>
                      <span className="font-semibold">{teacherCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Personnel Administratif</span>
                      <span className="font-semibold">{adminCount}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Durées d'Avancement</h3>
                  <div className="space-y-2">
                    {[30, 36, 42].map(duration => {
                      const count = employees.filter(e => e.requiredDuration === duration).length;
                      return (
                        <div key={duration} className="flex justify-between">
                          <span>{getDurationLabel(duration as 30 | 36 | 42)}</span>
                          <span className="font-semibold">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
