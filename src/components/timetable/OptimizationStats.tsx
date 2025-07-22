import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Clock, Users, MapPin } from "lucide-react";

export const OptimizationStats = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4 text-center">
          <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
          <p className="text-lg font-bold text-green-800">98%</p>
          <p className="text-sm text-green-600">Contraintes respectées</p>
        </CardContent>
      </Card>
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4 text-center">
          <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
          <p className="text-lg font-bold text-blue-800">0</p>
          <p className="text-sm text-blue-600">Conflits horaires</p>
        </CardContent>
      </Card>
      <Card className="border-purple-200 bg-purple-50">
        <CardContent className="p-4 text-center">
          <Users className="h-6 w-6 text-purple-600 mx-auto mb-2" />
          <p className="text-lg font-bold text-purple-800">85%</p>
          <p className="text-sm text-purple-600">Charge équilibrée</p>
        </CardContent>
      </Card>
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-4 text-center">
          <MapPin className="h-6 w-6 text-amber-600 mx-auto mb-2" />
          <p className="text-lg font-bold text-amber-800">92%</p>
          <p className="text-sm text-amber-600">Utilisation salles</p>
        </CardContent>
      </Card>
    </div>
  );
};