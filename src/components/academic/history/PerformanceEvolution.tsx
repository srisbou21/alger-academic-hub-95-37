
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AcademicYear } from "./types";
import { getMentionColor } from "./utils";

interface PerformanceEvolutionProps {
  academicHistory: AcademicYear[];
}

export const PerformanceEvolution = ({ academicHistory }: PerformanceEvolutionProps) => {
  const evolutionData = academicHistory.flatMap(year => 
    year.semesters.map(semester => ({
      label: `${year.year.split('-')[0]} ${semester.name}`,
      average: semester.average,
      status: semester.status
    }))
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Évolution des Performances</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-slate-600 mb-4">
            Évolution de vos moyennes au fil des semestres
          </div>
          
          {/* Graphique simple avec barres */}
          <div className="space-y-3">
            {evolutionData.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-32 text-sm">{item.label}</div>
                <div className="flex-1">
                  <Progress 
                    value={(item.average / 20) * 100} 
                    className="h-3"
                  />
                </div>
                <div className={`w-16 text-sm font-medium ${getMentionColor(item.average)}`}>
                  {item.average}/20
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
