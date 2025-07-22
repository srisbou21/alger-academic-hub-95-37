
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Database, Users, Calendar, Building2, BookOpen, Clock, Info } from "lucide-react";

export const AcademicSystemArchitecture = () => {
  const permanentTables = [
    { name: "Enseignants", description: "Profils, qualifications, contacts", icon: Users },
    { name: "Personnel Admin", description: "Employés administratifs", icon: Users },
    { name: "Échelons", description: "Grilles de classification", icon: Building2 },
    { name: "Départements", description: "Structure organisationnelle", icon: Building2 },
    { name: "Spécialisations", description: "Domaines d'études", icon: BookOpen }
  ];

  const annualTables = [
    { name: "Inscriptions", description: "Étudiants inscrits par année", icon: Users },
    { name: "Offres Formation", description: "Programmes proposés", icon: BookOpen },
    { name: "Sections/Groupes", description: "Organisation pédagogique", icon: Users },
    { name: "Charges Enseignement", description: "Attribution des cours", icon: Clock },
    { name: "Emplois du Temps", description: "Planification annuelle", icon: Calendar },
    { name: "Notes/Évaluations", description: "Résultats académiques", icon: BookOpen }
  ];

  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Architecture Intelligente:</strong> Le système distingue automatiquement entre les données 
          permanentes (partagées entre toutes les années) et les données annuelles (spécifiques à chaque année universitaire).
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Database className="h-5 w-5" />
              Données Permanentes
              <Badge variant="outline" className="text-green-700">
                Partagées entre toutes les années
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {permanentTables.map((table, index) => {
                const IconComponent = table.icon;
                return (
                  <div key={index} className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
                    <IconComponent className="h-4 w-4 text-green-600" />
                    <div>
                      <div className="font-medium text-green-800">{table.name}</div>
                      <div className="text-sm text-green-600">{table.description}</div>
                    </div>
                  </div>
                );
              })}
              <div className="mt-4 text-sm text-green-700 font-medium">
                ✅ Avantages: Pas de duplication, maintenance centralisée
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Calendar className="h-5 w-5" />
              Données Annuelles
              <Badge variant="outline" className="text-blue-700">
                Spécifiques par année
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {annualTables.map((table, index) => {
                const IconComponent = table.icon;
                return (
                  <div key={index} className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
                    <IconComponent className="h-4 w-4 text-blue-600" />
                    <div>
                      <div className="font-medium text-blue-800">{table.name}</div>
                      <div className="text-sm text-blue-600">{table.description}</div>
                    </div>
                  </div>
                );
              })}
              <div className="mt-4 text-sm text-blue-700 font-medium">
                📊 Historique complet préservé pour chaque année
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="text-purple-800">Fonctionnalités du Système</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                <span className="text-sm">Migration intelligente entre années</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                <span className="text-sm">Copie sélective des configurations</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                <span className="text-sm">Création automatique des charges</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                <span className="text-sm">Export/Import des données</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                <span className="text-sm">Nettoyage sélectif des anciennes données</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                <span className="text-sm">Activation d'année avec archivage</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
