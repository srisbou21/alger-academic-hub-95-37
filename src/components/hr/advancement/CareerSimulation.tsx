import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, TrendingUp, Calculator, LineChart, PieChart } from "lucide-react";
import { advancementService } from "../../../services/advancementService";
import { CareerSimulation as CareerSimulationType } from "../../../types/advancement";
import { useToast } from "@/hooks/use-toast";

interface SimulationScenario {
  name: string;
  averageScore: number;
  description: string;
  color: string;
}

const SIMULATION_SCENARIOS: SimulationScenario[] = [
  {
    name: 'Optimiste',
    averageScore: 18,
    description: 'Performance excellente constante (≥18/20)',
    color: 'text-green-600'
  },
  {
    name: 'Réaliste',
    averageScore: 15,
    description: 'Performance satisfaisante moyenne (14-17/20)',
    color: 'text-blue-600'
  },
  {
    name: 'Pessimiste',
    averageScore: 12,
    description: 'Performance minimale acceptable (12-13/20)',
    color: 'text-orange-600'
  }
];

export const CareerSimulation: React.FC = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [currentEchelon, setCurrentEchelon] = useState(1);
  const [currentAge, setCurrentAge] = useState(30);
  const [years, setYears] = useState(10);
  const [selectedScenario, setSelectedScenario] = useState('all');
  const [simulation, setSimulation] = useState<CareerSimulationType | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSimulate = async () => {
    if (!employeeId) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un ID employé",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    try {
      const projections = await advancementService.simulateCareer(employeeId, years);
      
      // Create simulation structure with scenarios
      const simulationResult: CareerSimulationType = {
        employeeId,
        currentEchelon,
        projections: projections.map(p => ({
          ...p,
          salaryImpact: calculateSalaryImpact(currentEchelon, p.echelon)
        })),
        scenarios: {
          optimistic: projections.map(p => ({ year: p.year, echelon: Math.min(p.echelon + 1, 12) })),
          realistic: projections.map(p => ({ year: p.year, echelon: p.echelon })),
          pessimistic: projections.map(p => ({ year: p.year, echelon: Math.max(p.echelon - 1, currentEchelon) }))
        }
      };
      
      setSimulation(simulationResult);
      toast({
        title: "Simulation terminée",
        description: "La projection de carrière a été générée avec succès"
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de générer la simulation",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateSalaryImpact = (fromEchelon: number, toEchelon: number): number => {
    // Simulation d'impact salarial (à personnaliser selon la grille indiciaire réelle)
    const baseImpact = 150000; // DZD par échelon
    return (toEchelon - fromEchelon) * baseImpact;
  };

  const calculateRetirementProjection = (): { age: number; echelon: number } => {
    const retirementAge = 60; // Age légal de retraite
    const yearsToRetirement = Math.max(0, retirementAge - currentAge);
    
    if (!simulation) return { age: retirementAge, echelon: currentEchelon };
    
    const realisticScenario = simulation.scenarios.realistic;
    const lastProjection = realisticScenario[Math.min(yearsToRetirement - 1, realisticScenario.length - 1)];
    
    return {
      age: retirementAge,
      echelon: lastProjection?.echelon || currentEchelon
    };
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Simulation de Carrière
          </CardTitle>
          <p className="text-slate-600">
            Projections et analyses prévisionnelles de progression d'échelons
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>ID Employé</Label>
              <Input
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="Entrez l'ID de l'employé"
              />
            </div>
            <div className="space-y-2">
              <Label>Échelon actuel</Label>
              <Select value={currentEchelon.toString()} onValueChange={(value) => setCurrentEchelon(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(echelon => (
                    <SelectItem key={echelon} value={echelon.toString()}>
                      Échelon {echelon}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Âge actuel</Label>
              <Input
                type="number"
                min="20"
                max="60"
                value={currentAge}
                onChange={(e) => setCurrentAge(parseInt(e.target.value) || 30)}
              />
            </div>
            <div className="space-y-2">
              <Label>Années à simuler</Label>
              <Input
                type="number"
                min="1"
                max="30"
                value={years}
                onChange={(e) => setYears(parseInt(e.target.value) || 10)}
              />
            </div>
          </div>

          <Button onClick={handleSimulate} disabled={loading || !employeeId} className="w-full">
            <Calculator className="h-4 w-4 mr-2" />
            {loading ? 'Simulation en cours...' : 'Lancer la Simulation'}
          </Button>
        </CardContent>
      </Card>

      {simulation && (
        <Tabs defaultValue="scenarios" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="scenarios">
              <LineChart className="h-4 w-4 mr-2" />
              Scénarios
            </TabsTrigger>
            <TabsTrigger value="financial">
              <PieChart className="h-4 w-4 mr-2" />
              Impact Financier
            </TabsTrigger>
            <TabsTrigger value="retirement">
              <TrendingUp className="h-4 w-4 mr-2" />
              Retraite
            </TabsTrigger>
            <TabsTrigger value="comparison">
              <BarChart3 className="h-4 w-4 mr-2" />
              Comparaison
            </TabsTrigger>
          </TabsList>

          <TabsContent value="scenarios" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SIMULATION_SCENARIOS.map((scenario) => {
                const scenarioData = simulation.scenarios[scenario.name.toLowerCase() as keyof typeof simulation.scenarios];
                return (
                  <Card key={scenario.name}>
                    <CardHeader>
                      <CardTitle className={`text-lg ${scenario.color}`}>
                        Scénario {scenario.name}
                      </CardTitle>
                      <p className="text-sm text-slate-600">{scenario.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {scenarioData.slice(0, Math.min(years, 10)).map((projection, index) => (
                          <div key={index} className="flex justify-between items-center py-2 border-b border-slate-100">
                            <span className="text-sm font-medium">Année {projection.year}</span>
                            <div className="flex items-center gap-2">
                              <span className={`text-sm font-semibold ${scenario.color}`}>
                                Échelon {projection.echelon}
                              </span>
                              {projection.echelon > (index === 0 ? currentEchelon : scenarioData[index - 1]?.echelon || currentEchelon) && (
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                  +{projection.echelon - (index === 0 ? currentEchelon : scenarioData[index - 1]?.echelon || currentEchelon)}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                        <div className="pt-2 mt-4 border-t">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold">Projection finale:</span>
                            <span className={`font-bold ${scenario.color}`}>
                              Échelon {scenarioData[scenarioData.length - 1]?.echelon || currentEchelon}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="financial" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Impact Financier Estimé</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {SIMULATION_SCENARIOS.map((scenario) => {
                    const scenarioData = simulation.scenarios[scenario.name.toLowerCase() as keyof typeof simulation.scenarios];
                    const finalEchelon = scenarioData[scenarioData.length - 1]?.echelon || currentEchelon;
                    const salaryImpact = calculateSalaryImpact(currentEchelon, finalEchelon);
                    
                    return (
                      <div key={scenario.name} className="text-center">
                        <h4 className={`font-semibold ${scenario.color} mb-2`}>
                          {scenario.name}
                        </h4>
                        <div className="space-y-2">
                          <p className="text-2xl font-bold">
                            +{salaryImpact.toLocaleString()} DZD
                          </p>
                          <p className="text-sm text-slate-600">
                            Gain mensuel estimé
                          </p>
                          <p className="text-xs text-slate-500">
                            Échelon {currentEchelon} → {finalEchelon}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="retirement" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Projection à la Retraite</CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const retirementInfo = calculateRetirementProjection();
                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="text-center">
                        <h4 className="font-semibold mb-4">Échelon à la Retraite</h4>
                        <div className="text-4xl font-bold text-blue-600 mb-2">
                          {retirementInfo.echelon}
                        </div>
                        <p className="text-slate-600">
                          À l'âge de {retirementInfo.age} ans
                        </p>
                      </div>
                      <div className="text-center">
                        <h4 className="font-semibold mb-4">Pension Estimée</h4>
                        <div className="text-4xl font-bold text-green-600 mb-2">
                          {(retirementInfo.echelon * 45000).toLocaleString()}
                        </div>
                        <p className="text-slate-600">DZD/mois</p>
                        <p className="text-xs text-slate-500 mt-2">
                          Estimation basée sur l'échelon final
                        </p>
                      </div>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comparison" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Comparaison des Scénarios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-4 font-semibold text-sm border-b pb-2">
                    <div>Scénario</div>
                    <div>Échelon Final</div>
                    <div>Gain Salarial</div>
                    <div>Durée Moyenne</div>
                  </div>
                  {SIMULATION_SCENARIOS.map((scenario) => {
                    const scenarioData = simulation.scenarios[scenario.name.toLowerCase() as keyof typeof simulation.scenarios];
                    const finalEchelon = scenarioData[scenarioData.length - 1]?.echelon || currentEchelon;
                    const salaryImpact = calculateSalaryImpact(currentEchelon, finalEchelon);
                    const averageDuration = scenario.averageScore >= 18 ? 30 : scenario.averageScore >= 14 ? 36 : 42;
                    
                    return (
                      <div key={scenario.name} className="grid grid-cols-4 gap-4 text-sm py-2 border-b">
                        <div className={`font-medium ${scenario.color}`}>
                          {scenario.name}
                        </div>
                        <div>Échelon {finalEchelon}</div>
                        <div>+{salaryImpact.toLocaleString()} DZD</div>
                        <div>{averageDuration} mois</div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};
