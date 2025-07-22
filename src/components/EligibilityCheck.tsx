
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, X, BarChart3, Calendar } from "lucide-react";

interface EligibilityCheckProps {
  studentData: any;
  onComplete: () => void;
  onUpdate: (data: any) => void;
}

export const EligibilityCheck = ({ studentData, onComplete, onUpdate }: EligibilityCheckProps) => {
  const eligibilityData = {
    grades: {
      average: 14.5,
      required: 10,
      status: "pass",
      details: [
        { subject: "Microéconomie", grade: 15.5, credits: 6 },
        { subject: "Macroéconomie", grade: 13.0, credits: 6 },
        { subject: "Statistiques", grade: 16.0, credits: 4 },
        { subject: "Comptabilité", grade: 12.5, credits: 4 }
      ]
    },
    attendance: {
      rate: 88,
      required: 75,
      status: "pass",
      absences: 12,
      totalSessions: 100
    },
    debts: {
      amount: 0,
      status: "clear"
    },
    disciplinary: {
      sanctions: 0,
      status: "clear"
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pass": return "bg-green-100 text-green-800 border-green-200";
      case "fail": return "bg-red-100 text-red-800 border-red-200";
      case "warning": return "bg-amber-100 text-amber-800 border-amber-200";
      default: return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pass": return <CheckCircle className="h-4 w-4" />;
      case "fail": return <X className="h-4 w-4" />;
      case "warning": return <AlertTriangle className="h-4 w-4" />;
      default: return null;
    }
  };

  const isEligible = eligibilityData.grades.status === "pass" && 
                    eligibilityData.attendance.status === "pass" &&
                    eligibilityData.debts.status === "clear" &&
                    eligibilityData.disciplinary.status === "clear";

  const handleValidateEligibility = () => {
    onUpdate({ ...studentData, eligible: true });
    onComplete();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Vérification de l'Éligibilité
        </CardTitle>
        <CardDescription>
          Contrôle des conditions requises pour la réinscription
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Résultats Académiques */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Résultats Académiques
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-slate-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Moyenne générale</span>
                    <Badge className={getStatusColor(eligibilityData.grades.status)}>
                      {getStatusIcon(eligibilityData.grades.status)}
                      {eligibilityData.grades.average}/20
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600">
                    Minimum requis: {eligibilityData.grades.required}/20
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-slate-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Assiduité</span>
                    <Badge className={getStatusColor(eligibilityData.attendance.status)}>
                      {getStatusIcon(eligibilityData.attendance.status)}
                      {eligibilityData.attendance.rate}%
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600">
                    Minimum requis: {eligibilityData.attendance.required}%
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Détail des Notes */}
          <div>
            <h4 className="font-medium mb-2">Détail par matière</h4>
            <div className="space-y-2">
              {eligibilityData.grades.details.map((subject, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                  <div>
                    <span className="text-sm font-medium">{subject.subject}</span>
                    <span className="text-xs text-slate-500 ml-2">({subject.credits} crédits)</span>
                  </div>
                  <Badge variant="outline" className={subject.grade >= 10 ? "border-green-200 text-green-700" : "border-red-200 text-red-700"}>
                    {subject.grade}/20
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Situation Administrative */}
          <div>
            <h3 className="font-semibold mb-3">Situation Administrative</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded">
                <span className="text-sm">Dettes financières</span>
                <Badge className={getStatusColor(eligibilityData.debts.status)}>
                  {getStatusIcon(eligibilityData.debts.status)}
                  {eligibilityData.debts.amount === 0 ? "Aucune" : `${eligibilityData.debts.amount} DA`}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded">
                <span className="text-sm">Sanctions disciplinaires</span>
                <Badge className={getStatusColor(eligibilityData.disciplinary.status)}>
                  {getStatusIcon(eligibilityData.disciplinary.status)}
                  {eligibilityData.disciplinary.sanctions === 0 ? "Aucune" : eligibilityData.disciplinary.sanctions}
                </Badge>
              </div>
            </div>
          </div>

          {/* Résultat Final */}
          <div className={`p-4 rounded-lg border ${isEligible ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <div className="flex items-center gap-2 mb-2">
              {isEligible ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <X className="h-5 w-5 text-red-600" />
              )}
              <h3 className={`font-semibold ${isEligible ? 'text-green-800' : 'text-red-800'}`}>
                {isEligible ? "Éligible pour la réinscription" : "Non éligible pour la réinscription"}
              </h3>
            </div>
            <p className={`text-sm ${isEligible ? 'text-green-700' : 'text-red-700'}`}>
              {isEligible 
                ? "Toutes les conditions sont remplies. Vous pouvez procéder à la réinscription."
                : "Certaines conditions ne sont pas remplies. Contactez l'administration."
              }
            </p>
          </div>

          {isEligible && (
            <Button onClick={handleValidateEligibility} className="w-full bg-blue-600 hover:bg-blue-700">
              Continuer vers la mise à jour des informations
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
