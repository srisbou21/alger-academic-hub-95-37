
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Download } from "lucide-react";

interface Subject {
  code: string;
  name: string;
  ue: string;
}

interface ProgramSelectorProps {
  availableSubjects: Subject[];
  selectedSubject: string;
  onSubjectChange: (subjectId: string) => void;
}

export const ProgramSelector = ({ 
  availableSubjects, 
  selectedSubject, 
  onSubjectChange 
}: ProgramSelectorProps) => {
  return (
    <Card className="border-purple-200">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100">
        <CardTitle className="text-purple-800">Programmes Détaillés</CardTitle>
        <CardDescription>Gestion des objectifs, contenus et modalités d'évaluation</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <Label htmlFor="subject-select" className="font-medium">Matière :</Label>
          <Select value={selectedSubject} onValueChange={onSubjectChange}>
            <SelectTrigger className="w-96">
              <SelectValue placeholder="Sélectionner une matière" />
            </SelectTrigger>
            <SelectContent>
              {availableSubjects
                .filter(subject => subject.code && subject.code.trim() !== '')
                .map((subject) => (
                  <SelectItem key={subject.code} value={subject.code}>
                    {subject.code} - {subject.name} ({subject.ue})
                  </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="flex gap-2">
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Edit className="h-4 w-4 mr-2" />
              Modifier programme
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exporter PDF
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
