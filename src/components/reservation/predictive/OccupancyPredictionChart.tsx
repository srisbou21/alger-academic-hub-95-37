
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Brain } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { occupancyData } from './mockData';

export const OccupancyPredictionChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Prédiction d'Occupation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={occupancyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="occupancy" 
              stroke="#8884d8" 
              name="Réel"
              strokeWidth={2}
            />
            <Line 
              type="monotone" 
              dataKey="prediction" 
              stroke="#82ca9d" 
              name="Prédit"
              strokeDasharray="5 5"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-blue-800">Prédiction IA</span>
          </div>
          <p className="text-sm text-blue-700">
            Le pic d'affluence est prévu entre 15h-16h avec 92% d'occupation. 
            Recommandation : prévoir du personnel supplémentaire.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
