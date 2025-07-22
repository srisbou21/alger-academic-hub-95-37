
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Target, Calendar } from "lucide-react";
import { AcademicYear } from "./types";
import { getMention } from "./utils";

interface StatsCardsProps {
  academicHistory: AcademicYear[];
  totalEcts: number;
  overallAverage: number;
}

export const StatsCards = ({ academicHistory, totalEcts, overallAverage }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="border-purple-200 bg-purple-50">
        <CardContent className="p-4 text-center">
          <Trophy className="h-6 w-6 text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-purple-800">
            {overallAverage.toFixed(2)}
          </div>
          <div className="text-sm text-purple-600">Moyenne générale</div>
        </CardContent>
      </Card>
      
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4 text-center">
          <Target className="h-6 w-6 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-800">
            {totalEcts}
          </div>
          <div className="text-sm text-blue-600">ECTS Obtenus</div>
        </CardContent>
      </Card>
      
      <Card className="border-emerald-200 bg-emerald-50">
        <CardContent className="p-4 text-center">
          <Calendar className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-emerald-800">
            {academicHistory.length}
          </div>
          <div className="text-sm text-emerald-600">Années d'études</div>
        </CardContent>
      </Card>
      
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-amber-800">
            {getMention(overallAverage)}
          </div>
          <div className="text-sm text-amber-600">Mention actuelle</div>
        </CardContent>
      </Card>
    </div>
  );
};
