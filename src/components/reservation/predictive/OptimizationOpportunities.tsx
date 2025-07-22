
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap } from "lucide-react";
import { optimizationOpportunities } from './mockData';
import { getPriorityColor } from './utils';

export const OptimizationOpportunities = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Opportunités d'Optimisation Détectées par IA
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {optimizationOpportunities.map((opp, index) => (
            <Card key={index} className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">{opp.type}</h4>
                  <Badge className={getPriorityColor(opp.priority)}>
                    {opp.priority === 'high' ? 'Haute' : 
                     opp.priority === 'medium' ? 'Moyenne' : 'Basse'}
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-green-600 mb-2">
                  {opp.savings}
                </div>
                <p className="text-sm text-gray-600 mb-3">{opp.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Impact: {opp.impact}
                  </span>
                  <Button size="sm" variant="outline">
                    Appliquer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
