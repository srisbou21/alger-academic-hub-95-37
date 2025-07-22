import React from 'react';
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Zap, Calendar, CheckCircle } from "lucide-react";

export const TimetableHeader = () => {
  return (
    <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl">
          <Brain className="h-8 w-8 text-purple-600" />
          Module Emplois du Temps IA
        </CardTitle>
        <p className="text-slate-600 text-lg">
          Système intelligent de génération automatique d'emplois du temps avec IA avancée
        </p>
        <div className="flex gap-2 mt-4">
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Système Actif
          </Badge>
          <Badge className="bg-blue-100 text-blue-800">
            <Zap className="h-3 w-3 mr-1" />
            IA Optimisée
          </Badge>
          <Badge className="bg-purple-100 text-purple-800">
            <Calendar className="h-3 w-3 mr-1" />
            Automatisation Complète
          </Badge>
        </div>
      </CardHeader>
    </Card>
  );
};