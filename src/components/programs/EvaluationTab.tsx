
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Award } from "lucide-react";

interface EvaluationMethod {
  type: string;
  coefficient: number;
  description: string;
}

interface EvaluationTabProps {
  methods: EvaluationMethod[];
  skills: string[];
}

export const EvaluationTab = ({ methods, skills }: EvaluationTabProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-700">
            <Star className="h-5 w-5" />
            Modalités d'Évaluation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {methods.map((method, index) => (
              <div key={index} className="p-3 border border-amber-200 rounded-lg bg-amber-50">
                <div className="flex justify-between items-center mb-2">
                  <h5 className="font-medium text-amber-800">{method.type}</h5>
                  <Badge className="bg-amber-600 text-white">
                    {(method.coefficient * 100)}%
                  </Badge>
                </div>
                <p className="text-sm text-amber-700">{method.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-700">
            <Award className="h-5 w-5" />
            Compétences Visées
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {skills.map((skill, index) => (
              <div key={index} className="flex items-start gap-2 p-2 bg-purple-50 rounded">
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2"></span>
                <p className="text-purple-800 text-sm">{skill}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
