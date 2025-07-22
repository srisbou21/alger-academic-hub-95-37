
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit } from "lucide-react";

interface Semester {
  id: string;
  name: string;
  ects: number;
}

interface SemesterSelectorProps {
  semesters: Semester[];
  selectedSemester: string;
  onSemesterChange: (semesterId: string) => void;
  currentSemester?: Semester;
}

export const SemesterSelector = ({ 
  semesters, 
  selectedSemester, 
  onSemesterChange, 
  currentSemester 
}: SemesterSelectorProps) => {
  // Filter out semesters with empty or invalid IDs
  const validSemesters = semesters.filter(semester => semester.id && semester.id.trim() !== '');

  return (
    <Card className="border-emerald-200">
      <CardHeader className="bg-gradient-to-r from-emerald-50 to-emerald-100">
        <CardTitle className="text-emerald-800">Structure de la Formation</CardTitle>
        <CardDescription>Organisation par semestres et unités d'enseignement</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <Label htmlFor="semester-select" className="font-medium">Semestre :</Label>
          <Select value={selectedSemester} onValueChange={onSemesterChange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {validSemesters.map((semester) => (
                <SelectItem key={semester.id} value={semester.id}>
                  {semester.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {currentSemester && (
            <Badge className="bg-emerald-100 text-emerald-800">
              {currentSemester.ects} ECTS
            </Badge>
          )}
        </div>

        <div className="flex gap-2">
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter UE
          </Button>
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Modifier structure
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
