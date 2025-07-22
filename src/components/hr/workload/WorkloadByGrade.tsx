
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WorkloadStatistics } from "../../../types/teacher";

interface WorkloadByGradeProps {
  statistics: WorkloadStatistics;
}

export const WorkloadByGrade: React.FC<WorkloadByGradeProps> = ({ statistics }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Répartition par Grade</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(statistics.byGrade).map(([grade, data]) => (
            <div key={grade} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">{grade}</h3>
                <Badge variant="outline">{data.count} enseignants</Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center p-2 bg-slate-50 rounded">
                  <p className="font-medium text-slate-700">{Math.round(data.averageHours)}</p>
                  <p className="text-slate-600">Moyenne</p>
                </div>
                <div className="text-center p-2 bg-slate-50 rounded">
                  <p className="font-medium text-slate-700">{data.maxHours}</p>
                  <p className="text-slate-600">Maximum</p>
                </div>
                <div className="text-center p-2 bg-slate-50 rounded">
                  <p className="font-medium text-slate-700">{data.minHours}</p>
                  <p className="text-slate-600">Minimum</p>
                </div>
                <div className="text-center p-2 bg-red-50 rounded">
                  <p className="font-medium text-red-700">{data.overloadedCount}</p>
                  <p className="text-red-800">Surchargés</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
