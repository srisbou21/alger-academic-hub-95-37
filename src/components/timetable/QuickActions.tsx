import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Zap, PlusCircle, BarChart3 } from "lucide-react";

interface QuickActionsProps {
  onAction: (action: string) => void;
}

export const QuickActions = ({ onAction }: QuickActionsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="h-5 w-5" />
          Actions Rapides
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            className="h-16 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            onClick={() => onAction("automation")}
          >
            <div className="flex flex-col items-center gap-2">
              <Zap className="h-6 w-6" />
              <span>Génération Automatique</span>
            </div>
          </Button>
          <Button 
            variant="outline" 
            className="h-16 border-blue-200 hover:bg-blue-50"
            onClick={() => onAction("generator")}
          >
            <div className="flex flex-col items-center gap-2">
              <PlusCircle className="h-6 w-6" />
              <span>Créer Manuellement</span>
            </div>
          </Button>
          <Button 
            variant="outline" 
            className="h-16 border-green-200 hover:bg-green-50"
            onClick={() => onAction("optimization")}
          >
            <div className="flex flex-col items-center gap-2">
              <BarChart3 className="h-6 w-6" />
              <span>Optimiser Existant</span>
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};