
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, TrendingUp, TrendingDown, AlertTriangle, 
  Users, Target, Award, BookOpen 
} from "lucide-react";

export const PerformanceDashboard = () => {
  const classPerformance = [
    {
      class: "Microéconomie L3",
      students: 45,
      average: 13.2,
      passRate: 78,
      trend: "up",
      atRisk: 8,
      excellent: 12
    },
    {
      class: "Statistiques L2", 
      students: 38,
      average: 11.8,
      passRate: 65,
      trend: "down",
      atRisk: 12,
      excellent: 6
    },
    {
      class: "Économie générale L1",
      students: 67,
      average: 12.5,
      passRate: 71,
      trend: "stable",
      atRisk: 18,
      excellent: 15
    }
  ];

  const difficultyStudents = [
    { name: "Fatima Zohra", class: "Microéconomie L3", average: 8.5, absences: 5, issues: ["Absences", "Notes faibles"] },
    { name: "Ahmed Boumediene", class: "Statistiques L2", average: 7.2, absences: 3, issues: ["Difficultés mathématiques"] },
    { name: "Leila Mansouri", class: "Économie L1", average: 9.1, absences: 4, issues: ["Absences", "Participation faible"] }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "down": return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <BarChart3 className="h-4 w-4 text-blue-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up": return "text-green-600";
      case "down": return "text-red-600";
      default: return "text-blue-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* Vue d'ensemble */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Total Étudiants</p>
                <p className="text-2xl font-bold text-blue-800">150</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-600 text-sm font-medium">Taux Réussite</p>
                <p className="text-2xl font-bold text-emerald-800">71%</p>
              </div>
              <Target className="h-8 w-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-600 text-sm font-medium">En Difficulté</p>
                <p className="text-2xl font-bold text-amber-800">38</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Excellence</p>
                <p className="text-2xl font-bold text-purple-800">33</p>
              </div>
              <Award className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance par classe */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Performance par Classe
            </CardTitle>
            <CardDescription>Analyse comparative des résultats</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {classPerformance.map((cls, index) => (
                <div key={index} className="p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{cls.class}</h4>
                      <p className="text-sm text-slate-600">{cls.students} étudiants</p>
                    </div>
                    <div className={`flex items-center gap-1 ${getTrendColor(cls.trend)}`}>
                      {getTrendIcon(cls.trend)}
                      <span className="text-sm font-medium">{cls.average}/20</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Taux de réussite</span>
                      <span className="font-medium">{cls.passRate}%</span>
                    </div>
                    <Progress value={cls.passRate} className="h-2" />
                    
                    <div className="flex justify-between text-xs text-slate-600 mt-2">
                      <span className="text-amber-600">En difficulté: {cls.atRisk}</span>
                      <span className="text-emerald-600">Excellence: {cls.excellent}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Étudiants en difficulté */}
        <Card className="border-amber-200">
          <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100">
            <CardTitle className="flex items-center gap-2 text-amber-800">
              <AlertTriangle className="h-5 w-5" />
              Étudiants Prioritaires
            </CardTitle>
            <CardDescription>Identification et suivi des étudiants à risque</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              {difficultyStudents.map((student, index) => (
                <div key={index} className="p-3 border border-amber-200 rounded-lg bg-amber-50">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-amber-900">{student.name}</h4>
                      <p className="text-sm text-amber-700">{student.class}</p>
                    </div>
                    <Badge className="bg-red-100 text-red-800">
                      Moy: {student.average}/20
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-2">
                    {student.issues.map((issue, i) => (
                      <Badge key={i} className="bg-amber-200 text-amber-800 text-xs">
                        {issue}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-amber-700">Absences: {student.absences}</span>
                    <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-xs">
                      Contacter
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <Button variant="outline" className="w-full mt-4 border-amber-200 text-amber-700">
              Voir tous les étudiants à risque
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
