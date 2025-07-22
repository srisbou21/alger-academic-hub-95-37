import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LucideIcon, ArrowLeft } from "lucide-react";

interface ModuleHeaderProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onBack: () => void;
  version?: string;
  status?: string;
  statusVariant?: "default" | "secondary" | "destructive" | "outline";
}

export const ModuleHeader = ({
  title,
  description,
  icon: Icon,
  onBack,
  version = "2.0",
  status = "Actif",
  statusVariant = "default"
}: ModuleHeaderProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour au tableau de bord
        </Button>
        <Badge variant={statusVariant} className="bg-green-100 text-green-800">
          {status}
        </Badge>
      </div>

      {/* En-tête unifié bleu comme dans l'image de référence */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Icon className="h-10 w-10 text-white" />
            <div>
              <h1 className="text-2xl font-bold text-white">{title}</h1>
              <p className="text-blue-100 font-medium">{description}</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-white/20 text-white border-white/30">
            Version {version}
          </Badge>
        </div>
      </div>
    </div>
  );
};