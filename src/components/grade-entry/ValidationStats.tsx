
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye } from "lucide-react";
import { ValidationStats as Stats } from "@/types/grade";

interface ValidationStatsProps {
  stats: Stats;
}

export const ValidationStats = ({ stats }: ValidationStatsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          État de Validation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-800">{stats.total}</div>
            <div className="text-sm text-slate-600">Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600">{stats.validated}</div>
            <div className="text-sm text-slate-600">Validées</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{stats.withErrors}</div>
            <div className="text-sm text-slate-600">Avec erreurs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-600">{stats.missing}</div>
            <div className="text-sm text-slate-600">Manquantes</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
