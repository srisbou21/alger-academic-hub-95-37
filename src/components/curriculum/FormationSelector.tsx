
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen } from "lucide-react";

interface Formation {
  id: string;
  name: string;
  level: string;
  duration: number;
}

interface FormationSelectorProps {
  formations: Formation[];
  selectedFormation: string;
  onFormationChange: (formationId: string) => void;
}

export const FormationSelector = ({ 
  formations, 
  selectedFormation, 
  onFormationChange 
}: FormationSelectorProps) => {
  const currentFormation = formations.find(f => f.id === selectedFormation);

  return (
    <Card className="border-blue-200">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <BookOpen className="h-5 w-5" />
          Maquettes Pédagogiques
        </CardTitle>
        <CardDescription>
          Gestion de la structure des formations et des programmes détaillés
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <Label htmlFor="formation-select" className="font-medium">Formation :</Label>
          <Select value={selectedFormation} onValueChange={onFormationChange}>
            <SelectTrigger className="w-80">
              <SelectValue placeholder="Sélectionner une formation" />
            </SelectTrigger>
            <SelectContent>
              {formations.map((formation) => (
                <SelectItem key={formation.id} value={formation.id}>
                  {formation.name} ({formation.level}{formation.duration})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {currentFormation && (
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                {currentFormation.level}{currentFormation.duration}
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                {currentFormation.duration} semestres
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
