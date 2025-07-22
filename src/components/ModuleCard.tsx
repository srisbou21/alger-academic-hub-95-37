
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ModuleCardProps {
  title: string;
  description: string;
  status?: 'active' | 'inactive';
  onSelect?: () => void;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({ 
  title, 
  description, 
  status = 'active', 
  onSelect 
}) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <Badge variant={status === 'active' ? 'default' : 'secondary'}>
            {status === 'active' ? 'Actif' : 'Inactif'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">{description}</p>
        <Button onClick={onSelect} className="w-full">
          Accéder au module
        </Button>
      </CardContent>
    </Card>
  );
};
