
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ModuleAccess } from '../../../types/rbac';

interface ModuleAccessCardProps {
  module: ModuleAccess;
  isSelected: boolean;
  onClick: () => void;
}

export const ModuleAccessCard: React.FC<ModuleAccessCardProps> = ({
  module,
  isSelected,
  onClick
}) => {
  return (
    <Card 
      className={`border-slate-200 hover:border-blue-300 transition-colors cursor-pointer ${
        isSelected ? 'border-blue-400' : ''
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <h4 className="font-semibold text-slate-800">{module.moduleName}</h4>
          <Badge className="bg-green-100 text-green-800">
            Accessible
          </Badge>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm text-slate-600">
            <strong>Onglets :</strong> {module.tabs.filter(t => t.canView).length}/{module.tabs.length}
          </p>
          <div className="flex flex-wrap gap-1">
            {module.tabs.slice(0, 3).map((tab) => (
              <Badge 
                key={tab.tabId} 
                variant="outline" 
                className="text-xs"
              >
                {tab.tabName}
              </Badge>
            ))}
            {module.tabs.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{module.tabs.length - 3}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
