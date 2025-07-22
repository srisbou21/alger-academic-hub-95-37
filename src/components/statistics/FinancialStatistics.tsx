
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { DollarSign, TrendingUp, PieChart as PieChartIcon, BarChart3 } from "lucide-react";
import { FinancialStatsForm } from "./forms/FinancialStatsForm";
import { useStatistics } from "../../hooks/useStatistics";

const chartConfig = {
  budget: { label: "Budget", color: "#F59E0B" },
  expenses: { label: "Dépenses", color: "#EF4444" },
  revenue: { label: "Recettes", color: "#10B981" },
};

export const FinancialStatistics = () => {
  const [showForm, setShowForm] = useState(false);
  const { saveStatistics } = useStatistics();

  const handleFormSave = async (data: any) => {
    try {
      await saveStatistics('financial', data);
      setShowForm(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const budgetData = [
    { category: "Personnel", budget: 8500000, executed: 6800000, percentage: 80 },
    { category: "Équipement", budget: 2000000, executed: 1200000, percentage: 60 },
    { category: "Recherche", budget: 1500000, executed: 950000, percentage: 63 },
    { category: "Fonctionnement", budget: 1000000, executed: 780000, percentage: 78 },
  ];

  const evolutionBudget = [
    { year: "2020", budget: 11.5, executed: 10.2, efficiency: 89 },
    { year: "2021", budget: 12.1, executed: 11.8, efficiency: 97 },
    { year: "2022", budget: 12.8, executed: 11.9, efficiency: 93 },
    { year: "2023", budget: 13.2, executed: 12.1, efficiency: 92 },
    { year: "2024", budget: 13.0, executed: 8.9, efficiency: 68 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Statistiques Financières</h2>
          <p className="text-slate-600">Suivi budgétaire et indicateurs financiers</p>
        </div>
        <Button 
          onClick={() => setShowForm(!showForm)}
          className="bg-amber-600 hover:bg-amber-700"
        >
          {showForm ? 'Masquer Formulaire' : 'Saisir Données'}
        </Button>
      </div>

      {showForm && (
        <FinancialStatsForm onSave={handleFormSave} />
      )}

      {/* KPIs Financiers */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-600 text-sm font-medium">Budget Total</p>
                <p className="text-2xl font-bold text-amber-800">13.0M DA</p>
                <p className="text-xs text-amber-500">Année 2024</p>
              </div>
              <DollarSign className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Exécuté</p>
                <p className="text-2xl font-bold text-green-800">8.9M DA</p>
                <p className="text-xs text-green-500">68.5% du budget</p>
              </div>
              <BarChart3 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Coût par Étudiant</p>
                <p className="text-2xl font-bold text-blue-800">4,567 DA</p>
                <p className="text-xs text-blue-500">Moyenne annuelle</p>
              </div>
              <PieChartIcon className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Efficacité</p>
                <p className="text-2xl font-bold text-purple-800">68.5%</p>
                <p className="text-xs text-purple-500">Taux d'exécution</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Répartition Budgétaire */}
        <Card>
          <CardHeader>
            <CardTitle>Exécution par Poste Budgétaire</CardTitle>
            <CardDescription>Budget vs Dépenses réalisées</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={budgetData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="budget" fill="#F59E0B" name="Budget Alloué" />
                  <Bar dataKey="executed" fill="#10B981" name="Exécuté" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Évolution Budgétaire */}
        <Card>
          <CardHeader>
            <CardTitle>Évolution Budgétaire 5 ans</CardTitle>
            <CardDescription>Tendances d'allocation et d'exécution</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={evolutionBudget}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="budget" stroke="#F59E0B" strokeWidth={3} name="Budget (M DA)" />
                  <Line type="monotone" dataKey="executed" stroke="#10B981" strokeWidth={3} name="Exécuté (M DA)" />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
