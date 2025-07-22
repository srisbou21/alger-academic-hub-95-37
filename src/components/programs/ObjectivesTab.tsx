
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, Edit, Plus } from "lucide-react";

interface ObjectivesTabProps {
  objectives: string[];
}

export const ObjectivesTab = ({ objectives }: ObjectivesTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-700">
          <Target className="h-5 w-5" />
          Objectifs Pédagogiques
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {objectives.map((objective, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <Badge className="bg-green-600 text-white text-xs px-2 py-1 mt-0.5">
                {index + 1}
              </Badge>
              <p className="text-green-800 flex-1">{objective}</p>
              <Button size="sm" variant="ghost" className="text-green-600">
                <Edit className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
        <Button className="mt-4 bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter objectif
        </Button>
      </CardContent>
    </Card>
  );
};
