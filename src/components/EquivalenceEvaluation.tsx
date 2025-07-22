
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileCheck, Globe, BookOpen, CheckCircle, AlertTriangle, Star, Calendar } from "lucide-react";
import { useState } from "react";

interface EquivalenceEvaluationProps {
  caseId: string;
  onBack: () => void;
}

export const EquivalenceEvaluation = ({ caseId, onBack }: EquivalenceEvaluationProps) => {
  const [evaluationStep, setEvaluationStep] = useState(1);

  const equivalenceData = {
    id: caseId,
    studentName: "Sarah Khalil",
    foreignDegree: "Bachelor of Economics",
    foreignUniversity: "Université de Tunis",
    country: "Tunisie",
    graduationYear: "2023",
    requestedLevel: "L3",
    requestedDepartment: "Économie",
    submittedDate: "2024-06-08",
    status: "review",
    documents: [
      { name: "Diplôme original", status: "validated", mandatory: true },
      { name: "Relevé de notes détaillé", status: "validated", mandatory: true },
      { name: "Programmes des matières", status: "validated", mandatory: true },
      { name: "Traduction certifiée", status: "validated", mandatory: true },
      { name: "Attestation d'authenticité", status: "validated", mandatory: true },
      { name: "CV académique", status: "validated", mandatory: false }
    ],
    subjectMapping: [
      {
        foreignSubject: "Microeconomics I & II",
        credits: 6,
        localEquivalent: "Microéconomie",
        localCredits: 6,
        grade: "A",
        localGrade: 16,
        status: "full_equivalence"
      },
      {
        foreignSubject: "Macroeconomics I & II", 
        credits: 6,
        localEquivalent: "Macroéconomie",
        localCredits: 6,
        grade: "A-",
        localGrade: 15,
        status: "full_equivalence"
      },
      {
        foreignSubject: "Statistics for Economics",
        credits: 4,
        localEquivalent: "Statistiques",
        localCredits: 4,
        grade: "B+",
        localGrade: 14,
        status: "full_equivalence"
      },
      {
        foreignSubject: "International Trade",
        credits: 4,
        localEquivalent: "Commerce International",
        localCredits: 4,
        grade: "A",
        localGrade: 16,
        status: "full_equivalence"
      },
      {
        foreignSubject: "Business Management",
        credits: 4,
        localEquivalent: "Gestion d'Entreprise",
        localCredits: 3,
        grade: "B",
        localGrade: 13,
        status: "partial_equivalence"
      },
      {
        foreignSubject: "Financial Markets",
        credits: 3,
        localEquivalent: "Marchés Financiers",
        localCredits: 4,
        grade: "B+",
        localGrade: 14,
        status: "additional_required"
      }
    ],
    totalCredits: {
      foreign: 87,
      validated: 73,
      required: 90,
      missing: 17
    }
  };

  const getEquivalenceStatusColor = (status: string) => {
    switch (status) {
      case "full_equivalence": return "text-green-600";
      case "partial_equivalence": return "text-amber-600";
      case "additional_required": return "text-blue-600";
      case "no_equivalence": return "text-red-600";
      default: return "text-slate-600";
    }
  };

  const getEquivalenceStatusText = (status: string) => {
    switch (status) {
      case "full_equivalence": return "Équivalence totale";
      case "partial_equivalence": return "Équivalence partielle";
      case "additional_required": return "Complément requis";
      case "no_equivalence": return "Pas d'équivalence";
      default: return "À évaluer";
    }
  };

  const getEquivalenceStatusIcon = (status: string) => {
    switch (status) {
      case "full_equivalence": return CheckCircle;
      case "partial_equivalence": return AlertTriangle;
      case "additional_required": return BookOpen;
      case "no_equivalence": return AlertTriangle;
      default: return FileCheck;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Évaluation d'Équivalence</h2>
          <p className="text-slate-600">{equivalenceData.id} - {equivalenceData.studentName}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Degree Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Diplôme Étranger
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-700">Diplôme</p>
                  <p className="text-slate-900">{equivalenceData.foreignDegree}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Université</p>
                  <p className="text-slate-900">{equivalenceData.foreignUniversity}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Pays</p>
                  <p className="text-slate-900">{equivalenceData.country}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Année d'obtention</p>
                  <p className="text-slate-900">{equivalenceData.graduationYear}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Niveau demandé</p>
                  <p className="text-slate-900">{equivalenceData.requestedLevel}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Département</p>
                  <p className="text-slate-900">{equivalenceData.requestedDepartment}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Credits Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Bilan des Crédits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <p className="text-sm font-medium text-blue-700">Crédits étrangers</p>
                  <p className="text-2xl font-bold text-blue-900">{equivalenceData.totalCredits.foreign}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg text-center">
                  <p className="text-sm font-medium text-green-700">Crédits validés</p>
                  <p className="text-2xl font-bold text-green-900">{equivalenceData.totalCredits.validated}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg text-center">
                  <p className="text-sm font-medium text-slate-700">Crédits requis</p>
                  <p className="text-2xl font-bold text-slate-900">{equivalenceData.totalCredits.required}</p>
                </div>
                <div className="p-4 bg-amber-50 rounded-lg text-center">
                  <p className="text-sm font-medium text-amber-700">Crédits manquants</p>
                  <p className="text-2xl font-bold text-amber-900">{equivalenceData.totalCredits.missing}</p>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Progression des équivalences</span>
                  <span>{Math.round((equivalenceData.totalCredits.validated / equivalenceData.totalCredits.required) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div 
                    className="bg-green-600 h-3 rounded-full" 
                    style={{ width: `${(equivalenceData.totalCredits.validated / equivalenceData.totalCredits.required) * 100}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subject Equivalences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Équivalences par Matière
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {equivalenceData.subjectMapping.map((subject, index) => {
                  const StatusIcon = getEquivalenceStatusIcon(subject.status);
                  return (
                    <div key={index} className="border border-slate-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-800">{subject.foreignSubject}</h4>
                          <p className="text-sm text-slate-600">
                            {subject.credits} crédits • Note: {subject.grade} ({subject.localGrade}/20)
                          </p>
                        </div>
                        <Badge className={`${getEquivalenceStatusColor(subject.status)} bg-opacity-10`}>
                          {getEquivalenceStatusText(subject.status)}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <StatusIcon className={`h-4 w-4 ${getEquivalenceStatusColor(subject.status)}`} />
                        <span className="text-slate-700">Équivalent à:</span>
                        <span className="font-medium">{subject.localEquivalent}</span>
                        <span className="text-slate-500">({subject.localCredits} crédits)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="h-5 w-5" />
                Statut de l'Évaluation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <Badge className="bg-blue-100 text-blue-800 text-lg px-4 py-2">
                    En cours d'évaluation
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Documents validés</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Analyse des matières</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <span className="text-sm">Validation commission</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-400">Décision finale</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Evaluation Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Recommandation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 border border-green-200 rounded">
                  <p className="text-sm font-medium text-green-800">
                    Équivalence recommandée avec compléments
                  </p>
                  <p className="text-xs text-green-700 mt-1">
                    L'étudiant peut être admis en L3 avec 17 crédits à rattraper.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approuver l'équivalence
                </Button>
                <Button variant="outline" className="w-full">
                  Demander expertise
                </Button>
                <Button variant="outline" className="w-full text-red-600 border-red-200">
                  Rejeter la demande
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Historique
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Demande soumise</p>
                    <p className="text-slate-600">8 juin 2024</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Documents validés</p>
                    <p className="text-slate-600">10 juin 2024</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Analyse en cours</p>
                    <p className="text-slate-600">12 juin 2024</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
