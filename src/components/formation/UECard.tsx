
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { SubjectTable } from "./SubjectTable";

interface Subject {
  code: string;
  name: string;
  hours: number;
  coefficient: number;
  teacher: string;
}

interface UE {
  code: string;
  name: string;
  ects: number;
  coefficient: number;
  type: string;
  subjects: Subject[];
}

interface UECardProps {
  ue: UE;
}

export const UECard = ({ ue }: UECardProps) => {
  const getUETypeColor = (type: string) => {
    switch (type) {
      case "fondamentale": return "bg-blue-100 text-blue-800 border-blue-200";
      case "outil": return "bg-green-100 text-green-800 border-green-200";
      case "transversale": return "bg-purple-100 text-purple-800 border-purple-200";
      case "optionnelle": return "bg-amber-100 text-amber-800 border-amber-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const calculateTotalHours = (subjects: Subject[]) => {
    return subjects.reduce((total, subject) => total + subject.hours, 0);
  };

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg text-slate-800">
              {ue.code} - {ue.name}
            </CardTitle>
            <div className="flex gap-2 mt-2">
              <Badge className={getUETypeColor(ue.type)}>
                {ue.type}
              </Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                {ue.ects} ECTS
              </Badge>
              <Badge variant="outline" className="bg-purple-50 text-purple-700">
                Coeff. {ue.coefficient}
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                {calculateTotalHours(ue.subjects)}h
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <Edit className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <SubjectTable subjects={ue.subjects} />
      </CardContent>
    </Card>
  );
};
