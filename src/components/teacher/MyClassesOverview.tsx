
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

interface ClassInfo {
  id: string;
  name: string;
  students: number;
  semester: string;
}

interface MyClassesOverviewProps {
  classes: ClassInfo[];
}

export const MyClassesOverview = ({ classes }: MyClassesOverviewProps) => {
  return (
    <Card className="border-purple-200 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-purple-800">
          <Users className="h-5 w-5" />
          Mes Classes
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          {classes.map((cls) => (
            <div key={cls.id} className="p-3 border border-purple-200 rounded-lg bg-purple-50">
              <h4 className="font-medium text-purple-900">{cls.name}</h4>
              <div className="flex justify-between text-sm text-purple-700 mt-1">
                <span>{cls.students} étudiants</span>
                <span>{cls.semester}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
