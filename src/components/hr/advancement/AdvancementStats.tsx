
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Clock, Users, Target } from "lucide-react";
import { EchelonAdvancement } from "../../../types/advancement";

interface AdvancementStatsProps {
  advancements: EchelonAdvancement[];
}

export const AdvancementStats: React.FC<AdvancementStatsProps> = ({ advancements }) => {
  const eligibleCount = advancements.filter(a => a.status === 'eligible').length;
  const pendingCount = advancements.filter(a => a.status === 'pending').length;
  const averageDuration = advancements.length > 0 
    ? advancements.reduce((sum, a) => sum + a.requiredDuration, 0) / advancements.length 
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card className="border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Éligibles</p>
              <p className="text-3xl font-bold text-green-600">{eligibleCount}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-yellow-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">En Attente</p>
              <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Personnel</p>
              <p className="text-3xl font-bold text-blue-600">{advancements.length}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Durée Moyenne</p>
              <p className="text-3xl font-bold text-purple-600">{Math.round(averageDuration)}</p>
              <p className="text-xs text-purple-500">mois</p>
            </div>
            <Target className="h-8 w-8 text-purple-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
