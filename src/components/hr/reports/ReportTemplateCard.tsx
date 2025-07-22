
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Clock, Calendar, Settings, Play } from "lucide-react";

interface ReportTemplate {
  id: string;
  name: string;
  type: 'attendance' | 'workload' | 'performance' | 'financial' | 'custom';
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom';
  isActive: boolean;
  lastGenerated?: Date;
  nextScheduled?: Date;
}

interface ReportTemplateCardProps {
  template: ReportTemplate;
  onActivate: (templateId: string) => void;
}

export const ReportTemplateCard: React.FC<ReportTemplateCardProps> = ({ 
  template, 
  onActivate 
}) => {
  const getFrequencyBadge = (frequency: string) => {
    const variants = {
      daily: "bg-green-100 text-green-800",
      weekly: "bg-blue-100 text-blue-800",
      monthly: "bg-purple-100 text-purple-800",
      quarterly: "bg-orange-100 text-orange-800",
      yearly: "bg-red-100 text-red-800",
      custom: "bg-gray-100 text-gray-800"
    };
    const labels = {
      daily: "Quotidien",
      weekly: "Hebdomadaire",
      monthly: "Mensuel",
      quarterly: "Trimestriel",
      yearly: "Annuel",
      custom: "Personnalisé"
    };
    
    return (
      <Badge className={variants[frequency as keyof typeof variants]}>
        {labels[frequency as keyof typeof labels]}
      </Badge>
    );
  };

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-lg">{template.name}</h3>
            {getFrequencyBadge(template.frequency)}
            <Switch 
              checked={template.isActive} 
              onCheckedChange={() => onActivate(template.id)}
            />
          </div>
          
          <p className="text-sm text-slate-600 mb-3">{template.description}</p>
          
          <div className="space-y-1 text-sm text-slate-500">
            {template.lastGenerated && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Dernière génération: {template.lastGenerated.toLocaleDateString('fr-FR')}</span>
              </div>
            )}
            {template.nextScheduled && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Prochaine génération: {template.nextScheduled.toLocaleDateString('fr-FR')}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t">
        <div className="text-sm">
          <Badge variant="outline" className={template.isActive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}>
            {template.isActive ? "Actif" : "Inactif"}
          </Badge>
        </div>
        
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <Settings className="h-4 w-4 mr-1" />
            Configurer
          </Button>
          <Button size="sm" variant="outline">
            <Play className="h-4 w-4 mr-1" />
            Exécuter
          </Button>
        </div>
      </div>
    </div>
  );
};
