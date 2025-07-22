
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrendingUp, Calculator, DollarSign } from "lucide-react";

export const CareerSimulation: React.FC = () => {
  const [selectedGrade, setSelectedGrade] = useState('');
  const [currentEchelon, setCurrentEchelon] = useState('');
  const [yearsToSimulate, setYearsToSimulate] = useState('');
  const [currentSalary, setCurrentSalary] = useState('');
  const [simulationResult, setSimulationResult] = useState<any>(null);

  const grades = [
    'Assistant',
    'Maitre Assistant B',
    'Maitre Assistant A', 
    'Maitre de Conférences B',
    'Maitre de Conférences A',
    'Professeur'
  ];

  const simulateCareer = () => {
    if (!selectedGrade || !currentEchelon || !yearsToSimulate || !currentSalary) return;

    const years = parseInt(yearsToSimulate);
    const salary = parseInt(currentSalary);
    const echelon = parseInt(currentEchelon);
    
    // Simulation simple : promotion tous les 3-4 ans
    const promotionsExpected = Math.floor(years / 3);
    const finalEchelon = Math.min(echelon + promotionsExpected, 10); // Max 10 échelons
    
    // Calcul salaire final (10% par promotion + 2% par an d'ancienneté)
    let finalSalary = salary;
    for (let i = 0; i < promotionsExpected; i++) {
      finalSalary *= 1.1; // 10% par promotion
    }
    finalSalary *= Math.pow(1.02, years); // 2% par an d'ancienneté
    
    const totalIncrease = finalSalary - salary;
    const percentageIncrease = ((totalIncrease / salary) * 100);

    setSimulationResult({
      finalEchelon,
      finalSalary: Math.round(finalSalary),
      totalIncrease: Math.round(totalIncrease),
      percentageIncrease: percentageIncrease.toFixed(1),
      promotionsExpected,
      yearlyGrowth: (Math.pow(finalSalary / salary, 1/years) - 1) * 100
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Simulation de Carrière
        </CardTitle>
        <p className="text-slate-600">
          Projetez l'évolution de carrière et salariale sur plusieurs années
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="grade">Grade Actuel</Label>
            <Select value={selectedGrade} onValueChange={setSelectedGrade}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un grade" />
              </SelectTrigger>
              <SelectContent>
                {grades.map(grade => (
                  <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="echelon">Échelon Actuel</Label>
            <Input
              id="echelon"
              type="number"
              min="1"
              max="10"
              value={currentEchelon}
              onChange={(e) => setCurrentEchelon(e.target.value)}
              placeholder="Ex: 3"
            />
          </div>

          <div>
            <Label htmlFor="salary">Salaire Actuel (DA)</Label>
            <Input
              id="salary"
              type="number"
              value={currentSalary}
              onChange={(e) => setCurrentSalary(e.target.value)}
              placeholder="Ex: 80000"
            />
          </div>

          <div>
            <Label htmlFor="years">Années à Simuler</Label>
            <Input
              id="years"
              type="number"
              min="1"
              max="30"
              value={yearsToSimulate}
              onChange={(e) => setYearsToSimulate(e.target.value)}
              placeholder="Ex: 10"
            />
          </div>
        </div>

        <Button onClick={simulateCareer} className="w-full">
          <Calculator className="h-4 w-4 mr-2" />
          Lancer la Simulation
        </Button>

        {simulationResult && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-3">Résultats de la Simulation</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{simulationResult.finalEchelon}</p>
                <p className="text-sm text-blue-800">Échelon Final</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {simulationResult.finalSalary.toLocaleString()} DA
                </p>
                <p className="text-sm text-green-800">Salaire Final</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">
                  +{simulationResult.percentageIncrease}%
                </p>
                <p className="text-sm text-orange-800">Augmentation Totale</p>
              </div>
            </div>
            <div className="mt-4 text-sm text-slate-600">
              <p>• {simulationResult.promotionsExpected} promotions attendues</p>
              <p>• Croissance annuelle moyenne: {simulationResult.yearlyGrowth.toFixed(1)}%</p>
              <p>• Gain total: +{simulationResult.totalIncrease.toLocaleString()} DA</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
