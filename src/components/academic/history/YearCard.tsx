
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AcademicYear } from "./types";
import { getStatusColor, getStatusText, getMentionColor, getMention } from "./utils";

interface YearCardProps {
  year: AcademicYear;
}

export const YearCard = ({ year }: YearCardProps) => {
  return (
    <Card className="border-slate-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-3">
              {year.year} - {year.level}
              <Badge className={getStatusColor(year.status)}>
                {getStatusText(year.status)}
              </Badge>
            </CardTitle>
            <CardDescription>
              {year.totalEcts} ECTS • Moyenne : {year.yearAverage.toFixed(2)}/20
            </CardDescription>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${getMentionColor(year.yearAverage)}`}>
              {year.yearAverage.toFixed(2)}/20
            </div>
            <div className="text-sm text-slate-500">
              {getMention(year.yearAverage)}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Progression de l'année */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Progression de l'année</span>
              <span>{((year.yearAverage / 20) * 100).toFixed(0)}%</span>
            </div>
            <Progress value={(year.yearAverage / 20) * 100} className="h-2" />
          </div>

          {/* Détail par semestre */}
          <div className="grid gap-4 md:grid-cols-2">
            {year.semesters.map((semester) => (
              <div key={semester.id} className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-slate-800">{semester.name}</h4>
                  <Badge className={getStatusColor(semester.status)}>
                    {getStatusText(semester.status)}
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Moyenne :</span>
                    <span className={`font-bold ${getMentionColor(semester.average)}`}>
                      {semester.average}/20
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>ECTS :</span>
                    <span className="font-medium">{semester.ects}</span>
                  </div>
                  {semester.rank && (
                    <div className="flex justify-between">
                      <span>Classement :</span>
                      <span className="font-medium">
                        {semester.rank}e / {semester.totalStudents}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="mt-2">
                  <Progress 
                    value={(semester.average / 20) * 100} 
                    className="h-1"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
