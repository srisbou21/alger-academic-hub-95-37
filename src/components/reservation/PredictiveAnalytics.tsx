
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain } from 'lucide-react';

export const PredictiveAnalytics = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Analytics Prédictifs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>Analytics prédictifs en cours de développement...</p>
      </CardContent>
    </Card>
  );
};
