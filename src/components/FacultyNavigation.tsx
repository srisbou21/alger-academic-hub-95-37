import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  BookOpen, 
  Calendar, 
  FileText, 
  Building2,
  BarChart3,
  MessageSquare,
  Settings,
  Home,
  School,
  Brain,
  UserCheck
} from "lucide-react";

export const FacultyNavigation = () => {
  const [activeModule, setActiveModule] = useState<string | null>(null);

  const modules = [
    {
      id: 'overview',
      title: 'Tableau de Bord',
      description: 'Vue d\'ensemble de la faculté',
      icon: Home,
      color: 'blue',
      stats: { active: true, count: '3,247 étudiants actifs' }
    },
    {
      id: 'teachers',
      title: 'Gestion des Enseignants',
      description: 'Profils et informations enseignants',
      icon: Users,
      color: 'purple',
      stats: { active: true, count: '247 enseignants' }
    },
    {
      id: 'hr',
      title: 'Ressources Humaines',
      description: 'RH, absences, bourses, charges',
      icon: UserCheck,
      color: 'green',
      stats: { active: true, count: '156 dossiers RH' }
    },
    {
      id: 'timetable',
      title: 'Emplois du Temps IA', 
      description: 'Génération automatique intelligente',
      icon: Brain,
      color: 'pink',
      stats: { active: true, count: '127 plannings générés' }
    },
    {
      id: 'reservations',
      title: 'Réservation d\'Espaces',
      description: 'Salles, amphithéâtres, laboratoires',
      icon: Building2,
      color: 'indigo',
      stats: { active: true, count: '89 espaces' }
    },
    {
      id: 'communication',
      title: 'Communication',
      description: 'Annonces, messagerie, forums',
      icon: MessageSquare,
      color: 'pink',
      stats: { active: true, count: '24 annonces' }
    },
    {
      id: 'statistics',
      title: 'Statistiques',
      description: 'Rapports et analyses',
      icon: BarChart3,
      color: 'cyan',
      stats: { active: true, count: '12 rapports' }
    },
    {
      id: 'administration',
      title: 'Administration',
      description: 'Documents, workflow, archives',
      icon: FileText,
      color: 'gray',
      stats: { active: true, count: '1,456 documents' }
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap: { [key: string]: { card: string, icon: string, badge: string } } = {
      blue: { 
        card: 'border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200', 
        icon: 'text-blue-600', 
        badge: 'bg-blue-100 text-blue-800' 
      },
      green: { 
        card: 'border-green-200 bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200', 
        icon: 'text-green-600', 
        badge: 'bg-green-100 text-green-800' 
      },
      purple: { 
        card: 'border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200', 
        icon: 'text-purple-600', 
        badge: 'bg-purple-100 text-purple-800' 
      },
      indigo: { 
        card: 'border-indigo-200 bg-gradient-to-br from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200', 
        icon: 'text-indigo-600', 
        badge: 'bg-indigo-100 text-indigo-800' 
      },
      pink: { 
        card: 'border-pink-200 bg-gradient-to-br from-pink-50 to-pink-100 hover:from-pink-100 hover:to-pink-200', 
        icon: 'text-pink-600', 
        badge: 'bg-pink-100 text-pink-800' 
      },
      cyan: { 
        card: 'border-cyan-200 bg-gradient-to-br from-cyan-50 to-cyan-100 hover:from-cyan-100 hover:to-cyan-200', 
        icon: 'text-cyan-600', 
        badge: 'bg-cyan-100 text-cyan-800' 
      },
      gray: { 
        card: 'border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200', 
        icon: 'text-gray-600', 
        badge: 'bg-gray-100 text-gray-800' 
      }
    };
    return colorMap[color] || colorMap.gray;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto p-6">
        {/* En-tête */}
        <Card className="mb-8 border-blue-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl font-bold mb-2">
                  <School className="h-8 w-8 inline mr-3" />
                  Système d'Information Facultaire
                </CardTitle>
                <p className="text-blue-100 text-lg">
                  Faculté des Sciences Économiques, Commerciales et des Sciences de Gestion
                </p>
                <p className="text-blue-200 text-sm">
                  Université Alger 3 - Alger, Algérie
                </p>
              </div>
              <div className="text-right">
                <Badge className="bg-white/20 text-white mb-2">
                  Version 2.0
                </Badge>
                <p className="text-blue-200 text-sm">
                  Année Académique 2024-2025
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Enseignants</p>
                  <p className="text-2xl font-bold text-purple-800">247</p>
                  <p className="text-xs text-purple-500">Corps enseignant</p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">RH Actives</p>
                  <p className="text-2xl font-bold text-green-800">156</p>
                  <p className="text-xs text-green-500">Dossiers traités</p>
                </div>
                <UserCheck className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-pink-200 bg-gradient-to-br from-pink-50 to-pink-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pink-600 text-sm font-medium">Emplois du Temps</p>
                  <p className="text-2xl font-bold text-pink-800">127</p>
                  <p className="text-xs text-pink-500">Générés par IA</p>
                </div>
                <Brain className="h-8 w-8 text-pink-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-indigo-200 bg-gradient-to-br from-indigo-50 to-indigo-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-600 text-sm font-medium">Espaces</p>
                  <p className="text-2xl font-bold text-indigo-800">89</p>
                  <p className="text-xs text-indigo-500">Salles et labs</p>
                </div>
                <Building2 className="h-8 w-8 text-indigo-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Modules principaux */}
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Modules du Système</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {modules.map((module) => {
              const Icon = module.icon;
              const colors = getColorClasses(module.color);
              
              return (
                <Card 
                  key={module.id}
                  className={`cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${colors.card}`}
                  onClick={() => setActiveModule(module.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <Icon className={`h-10 w-10 ${colors.icon}`} />
                      {module.stats.active && (
                        <Badge className={colors.badge} variant="outline">
                          Actif
                        </Badge>
                      )}
                    </div>
                    
                    <h3 className="font-bold text-lg text-slate-800 mb-2">
                      {module.title}
                    </h3>
                    
                    <p className="text-slate-600 text-sm mb-4">
                      {module.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-medium ${colors.icon}`}>
                        {module.stats.count}
                      </span>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Accéder
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Footer informatif */}
        <Card className="mt-8 border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm text-slate-600">
              <div>
                <p>© 2024 Université Alger 3 - Faculté des Sciences Économiques</p>
                <p>Système d'Information Facultaire - Tous droits réservés</p>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Paramètres
                </Button>
                <Badge variant="outline">
                  Système opérationnel
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
