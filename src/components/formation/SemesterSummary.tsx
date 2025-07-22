
import { Card, CardContent } from "@/components/ui/card";

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

interface Semester {
  id: string;
  name: string;
  ects: number;
  ues: UE[];
}

interface SemesterSummaryProps {
  semester: Semester;
}

export const SemesterSummary = ({ semester }: SemesterSummaryProps) => {
  const calculateTotalHours = (subjects: Subject[]) => {
    return subjects.reduce((total, subject) => total + subject.hours, 0);
  };

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardContent className="p-6">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-700">{semester.ues.length}</p>
            <p className="text-sm text-blue-600">Unités d'Enseignement</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-700">
              {semester.ues.reduce((total, ue) => total + ue.subjects.length, 0)}
            </p>
            <p className="text-sm text-blue-600">Matières</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-700">{semester.ects}</p>
            <p className="text-sm text-blue-600">ECTS Total</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-700">
              {semester.ues.reduce((total, ue) => total + calculateTotalHours(ue.subjects), 0)}h
            </p>
            <p className="text-sm text-blue-600">Volume Horaire</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
