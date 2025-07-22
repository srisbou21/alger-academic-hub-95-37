
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";

interface ProgramHeaderProps {
  program: {
    code: string;
    name: string;
    ue: string;
    semester: string;
    hours: number;
    ects: number;
    coefficient: number;
    teacher: string;
  };
}

export const ProgramHeader = ({ program }: ProgramHeaderProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-blue-600" />
          {program.code} - {program.name}
        </CardTitle>
        <div className="flex gap-2 flex-wrap">
          <Badge className="bg-blue-100 text-blue-800">{program.ue}</Badge>
          <Badge className="bg-green-100 text-green-800">{program.semester}</Badge>
          <Badge className="bg-purple-100 text-purple-800">{program.hours}h</Badge>
          <Badge className="bg-amber-100 text-amber-800">{program.ects} ECTS</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-slate-600 mb-2">
          <strong>Enseignant responsable :</strong> {program.teacher}
        </p>
        <p className="text-slate-600">
          <strong>Coefficient :</strong> {program.coefficient}
        </p>
      </CardContent>
    </Card>
  );
};
