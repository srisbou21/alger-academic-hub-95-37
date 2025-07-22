
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Users, 
  UserCheck, 
  Building2, 
  MessageSquare, 
  BarChart3, 
  FileText,
  Brain,
  Calendar,
  Clock,
  Settings,
  GraduationCap,
  School
} from "lucide-react";
import { WorkloadMainDashboard } from "./workload/WorkloadMainDashboard";
import { TimetableGenerator } from "./timetable/TimetableGenerator";
import { HRDashboard } from "./hr/HRDashboard";
import { StatisticsDashboard } from "./statistics/StatisticsDashboard";
import { ModuleHeader } from "./shared/ModuleHeader";
import { UnifiedModuleLayout } from "./shared/UnifiedModuleLayout";

export const MainFacultyDashboard = () => {
  const [activeModule, setActiveModule] = useState<string | null>(null);

  // Statistiques principales
  const stats = [
    {
      title: "Enseignants",
      value: "247",
      subtitle: "Corps enseignant",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      icon: Users
    },
    {
      title: "RH Actives",
      value: "156",
      subtitle: "Dossiers traités",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      icon: UserCheck
    },
    {
      title: "Emplois du Temps",
      value: "127",
      subtitle: "Générés par IA",
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      icon: Brain
    },
    {
      title: "Espaces",
      value: "89",
      subtitle: "Salles et labs",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      icon: Building2
    }
  ];

  // Modules du système
  const systemModules = [
    {
      id: "dashboard",
      title: "Tableau de Bord",
      description: "Vue d'ensemble de la faculté",
      stats: "3,247 étudiants actifs",
      icon: Home,
      color: "bg-blue-50",
      textColor: "text-blue-600",
      isActive: true
    },
    {
      id: "workload-management",
      title: "Gestion des Enseignants",
      description: "Profils et informations enseignants",
      stats: "247 enseignants",
      icon: Users,
      color: "bg-purple-50",
      textColor: "text-purple-600",
      isActive: true
    },
    {
      id: "hr-resources",
      title: "Ressources Humaines",
      description: "RH, absences, bourses, charges",
      stats: "156 dossiers RH",
      icon: UserCheck,
      color: "bg-green-50",
      textColor: "text-green-600",
      isActive: true
    },
    {
      id: "timetable-ai",
      title: "Emplois du Temps IA",
      description: "Génération automatique intelligente",
      stats: "127 plannings générés",
      icon: Brain,
      color: "bg-red-50",
      textColor: "text-red-600",
      isActive: true
    },
    {
      id: "space-reservation",
      title: "Réservation d'Espaces",
      description: "Salles, amphithéâtres, laboratoires",
      stats: "89 espaces",
      icon: Building2,
      color: "bg-blue-50",
      textColor: "text-blue-600",
      isActive: true
    },
    {
      id: "communication",
      title: "Communication",
      description: "Annonces, messagerie, forums",
      stats: "24 annonces",
      icon: MessageSquare,
      color: "bg-pink-50",
      textColor: "text-pink-600",
      isActive: true
    },
    {
      id: "statistics",
      title: "Statistiques",
      description: "Rapports et analyses",
      stats: "12 rapports",
      icon: BarChart3,
      color: "bg-cyan-50",
      textColor: "text-cyan-600",
      isActive: true
    },
    {
      id: "administration",
      title: "Administration",
      description: "Documents, workflow, archives",
      stats: "1,456 documents",
      icon: FileText,
      color: "bg-gray-50",
      textColor: "text-gray-600",
      isActive: true
    }
  ];

  const handleModuleClick = (moduleId: string) => {
    setActiveModule(moduleId);
  };

  const getModuleInfo = (moduleId: string) => {
    const module = systemModules.find(m => m.id === moduleId);
    return module || null;
  };

  const renderModuleContent = () => {
    const moduleInfo = getModuleInfo(activeModule!);
    if (!moduleInfo) return null;

    const moduleHeader = (
      <ModuleHeader
        title={moduleInfo.title}
        description={moduleInfo.description}
        icon={moduleInfo.icon}
        onBack={() => setActiveModule(null)}
      />
    );

    switch (activeModule) {
      case "workload-management":
        return (
          <UnifiedModuleLayout>
            <div className="space-y-6">
              {moduleHeader}
              <WorkloadMainDashboard />
            </div>
          </UnifiedModuleLayout>
        );
      case "timetable-ai":
        return (
          <UnifiedModuleLayout>
            <div className="space-y-6">
              {moduleHeader}
              <TimetableGenerator />
            </div>
          </UnifiedModuleLayout>
        );
      case "hr-resources":
        return (
          <UnifiedModuleLayout>
            <div className="space-y-6">
              {moduleHeader}
              <HRDashboard />
            </div>
          </UnifiedModuleLayout>
        );
      case "statistics":
        return (
          <UnifiedModuleLayout>
            <div className="space-y-6">
              {moduleHeader}
              <StatisticsDashboard />
            </div>
          </UnifiedModuleLayout>
        );
      default:
        return (
          <UnifiedModuleLayout>
            <div className="space-y-6">
              {moduleHeader}
              <div className="text-center py-12">
                <p className="text-gray-500">Module en cours de développement</p>
              </div>
            </div>
          </UnifiedModuleLayout>
        );
    }
  };

  if (activeModule) {
    return renderModuleContent();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-6">
        {/* En-tête principal */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <School className="h-8 w-8" />
                <h1 className="text-3xl font-bold">Système d'Information Facultaire</h1>
              </div>
              <p className="text-xl opacity-90">Faculté des Sciences Économiques, Commerciales et des Sciences de Gestion</p>
              <p className="opacity-80">Université Alger 3 - Alger, Algérie</p>
            </div>
            <div className="text-right">
              <Badge className="bg-white/20 text-white border-white/30 mb-2">
                Version 2.0
              </Badge>
              <p className="text-lg">Année Académique 2024-2025</p>
            </div>
          </div>
        </div>

        {/* Statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className={`${stat.bgColor} ${stat.borderColor} border-2`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm ${stat.color} font-medium`}>{stat.title}</p>
                      <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                      <p className="text-sm text-gray-600">{stat.subtitle}</p>
                    </div>
                    <Icon className={`h-10 w-10 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Titre des modules */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Modules du Système</h2>
          <p className="text-gray-600">Accédez aux différentes fonctionnalités du système d'information</p>
        </div>

        {/* Modules du système */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {systemModules.map((module) => {
            const Icon = module.icon;
            return (
              <Card 
                key={module.id} 
                className={`${module.color} border-2 hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:scale-105`}
                onClick={() => handleModuleClick(module.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Icon className={`h-8 w-8 ${module.textColor}`} />
                    <Badge 
                      variant={module.isActive ? "default" : "secondary"}
                      className={module.isActive ? "bg-green-100 text-green-800" : ""}
                    >
                      {module.isActive ? "Actif" : "Inactif"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className={`text-lg mb-2 ${module.textColor}`}>
                    {module.title}
                  </CardTitle>
                  <p className="text-sm text-gray-600 mb-3">{module.description}</p>
                  <p className={`text-sm font-medium ${module.textColor}`}>{module.stats}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Section d'accès rapide aux fonctionnalités spéciales */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Fonctionnalités Avancées</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-700">
                  <Clock className="h-6 w-6" />
                  Gestion des Charges d'Enseignement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Configuration des sections, groupes et attribution complète des modules aux enseignants par année universitaire.
                </p>
                <Button 
                  onClick={() => handleModuleClick("workload-management")}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Accéder au Module
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700">
                  <Brain className="h-6 w-6" />
                  Générateur IA d'Emplois du Temps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Génération automatique intelligente des emplois du temps avec gestion des contraintes et optimisation.
                </p>
                <Button 
                  onClick={() => handleModuleClick("timetable-ai")}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Générer avec IA
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
