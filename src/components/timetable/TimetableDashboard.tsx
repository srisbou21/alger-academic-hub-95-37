import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Calendar, BarChart3, CheckCircle, Clock, Users, MapPin, Zap } from "lucide-react";

export const TimetableDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-blue-800">Emplois du Temps Générés</h3>
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-blue-900">127</p>
            <p className="text-sm text-blue-600">Cette semaine</p>
          </CardContent>
        </Card>
        
        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-green-800">Taux d'Optimisation</h3>
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-900">94.7%</p>
            <p className="text-sm text-green-600">Efficacité moyenne</p>
          </CardContent>
        </Card>
        
        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-purple-800">Conflits Résolus</h3>
              <CheckCircle className="h-6 w-6 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-purple-900">45</p>
            <p className="text-sm text-purple-600">Automatiquement</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recommandations IA</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <Brain className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium">Optimisation suggérée pour la formation L3 Informatique</p>
                <p className="text-sm text-slate-600">Réduction possible de 15% des créneaux libres</p>
              </div>
              <Button size="sm">Appliquer</Button>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <Zap className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium">Nouvelle contrainte détectée</p>
                <p className="text-sm text-slate-600">Préférence enseignant pour les créneaux matinaux</p>
              </div>
              <Button size="sm" variant="outline">Configurer</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};