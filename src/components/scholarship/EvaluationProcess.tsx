
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Users, CheckCircle, Clock, FileText, Star } from "lucide-react";

interface EvaluationCriteria {
  name: string;
  weight: number;
  score?: number;
  maxScore: number;
}

interface Application {
  id: string;
  studentName: string;
  scholarshipType: string;
  documents: string[];
  criteria: EvaluationCriteria[];
  currentEvaluator?: string;
  evaluationStatus: string;
}

const mockApplications: Application[] = [
  {
    id: "APP001",
    studentName: "Amina Benali",
    scholarshipType: "Mérite Académique",
    documents: ["Relevé de notes", "Lettre de motivation", "CV"],
    criteria: [
      { name: "Excellence académique", weight: 40, maxScore: 20 },
      { name: "Motivation", weight: 30, maxScore: 20 },
      { name: "Projet professionnel", weight: 20, maxScore: 20 },
      { name: "Situation sociale", weight: 10, maxScore: 20 }
    ],
    currentEvaluator: "Prof. Martin",
    evaluationStatus: "en_cours"
  },
  {
    id: "APP002",
    studentName: "Karim Meziane",
    scholarshipType: "Besoin Social",
    documents: ["Justificatifs revenus", "Lettre de motivation"],
    criteria: [
      { name: "Situation financière", weight: 50, maxScore: 20 },
      { name: "Mérite académique", weight: 30, maxScore: 20 },
      { name: "Motivation", weight: 20, maxScore: 20 }
    ],
    evaluationStatus: "en_attente"
  }
];

export const EvaluationProcess = () => {
  const { toast } = useToast();
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [evaluationScores, setEvaluationScores] = useState<Record<string, number>>({});
  const [comments, setComments] = useState("");
  const [recommendation, setRecommendation] = useState("");

  const handleScoreChange = (criteriaName: string, score: number) => {
    setEvaluationScores(prev => ({
      ...prev,
      [criteriaName]: score
    }));
  };

  const calculateTotalScore = () => {
    if (!selectedApplication) return 0;
    
    let totalWeightedScore = 0;
    let totalWeight = 0;
    
    selectedApplication.criteria.forEach(criteria => {
      const score = evaluationScores[criteria.name] || 0;
      totalWeightedScore += (score / criteria.maxScore) * criteria.weight;
      totalWeight += criteria.weight;
    });
    
    return totalWeight > 0 ? (totalWeightedScore / totalWeight * 20).toFixed(2) : 0;
  };

  const handleSubmitEvaluation = () => {
    toast({
      title: "Évaluation soumise",
      description: `L'évaluation de ${selectedApplication?.studentName} a été enregistrée avec succès.`
    });
    setSelectedApplication(null);
    setEvaluationScores({});
    setComments("");
    setRecommendation("");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Processus d'Évaluation
          </CardTitle>
          <CardDescription>
            Évaluation et notation des candidatures de bourses
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des candidatures à évaluer */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Candidatures Assignées</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockApplications.map((app) => (
              <div
                key={app.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedApplication?.id === app.id
                    ? "border-primary bg-primary/5"
                    : "hover:bg-muted/50"
                }`}
                onClick={() => setSelectedApplication(app)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="font-medium">{app.studentName}</div>
                  <Badge variant={app.evaluationStatus === "en_cours" ? "default" : "secondary"}>
                    {app.evaluationStatus === "en_cours" ? "En cours" : "En attente"}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">{app.scholarshipType}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {app.documents.length} document(s)
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Formulaire d'évaluation */}
        <div className="lg:col-span-2">
          {selectedApplication ? (
            <Card>
              <CardHeader>
                <CardTitle>Évaluation - {selectedApplication.studentName}</CardTitle>
                <CardDescription>
                  {selectedApplication.scholarshipType}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Documents */}
                <div>
                  <Label className="text-base font-medium">Documents Fournis</Label>
                  <div className="flex gap-2 mt-2">
                    {selectedApplication.documents.map((doc, index) => (
                      <Badge key={index} variant="outline">
                        <FileText className="h-3 w-3 mr-1" />
                        {doc}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Critères d'évaluation */}
                <div>
                  <Label className="text-base font-medium">Critères d'Évaluation</Label>
                  <div className="space-y-4 mt-3">
                    {selectedApplication.criteria.map((criteria) => (
                      <div key={criteria.name} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{criteria.name}</span>
                          <span className="text-sm text-muted-foreground">
                            Poids: {criteria.weight}%
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <Select
                            value={evaluationScores[criteria.name]?.toString() || ""}
                            onValueChange={(value) => handleScoreChange(criteria.name, parseInt(value))}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue placeholder="Note" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: criteria.maxScore + 1 }, (_, i) => (
                                <SelectItem key={i} value={i.toString()}>
                                  {i}/{criteria.maxScore}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <div className="flex-1">
                            <Progress 
                              value={(evaluationScores[criteria.name] || 0) / criteria.maxScore * 100} 
                              className="h-2"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Score total */}
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Score Total Pondéré</span>
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-500" />
                      <span className="text-xl font-bold">{calculateTotalScore()}/20</span>
                    </div>
                  </div>
                </div>

                {/* Commentaires */}
                <div className="space-y-2">
                  <Label htmlFor="comments">Commentaires d'Évaluation</Label>
                  <Textarea
                    id="comments"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Détaillez votre évaluation..."
                    rows={4}
                  />
                </div>

                {/* Recommandation */}
                <div className="space-y-2">
                  <Label>Recommandation Finale</Label>
                  <Select value={recommendation} onValueChange={setRecommendation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir une recommandation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="accepter">Accepter</SelectItem>
                      <SelectItem value="refuser">Refuser</SelectItem>
                      <SelectItem value="liste_attente">Mettre en liste d'attente</SelectItem>
                      <SelectItem value="complements">Demander des compléments</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button onClick={handleSubmitEvaluation} className="flex-1">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Soumettre l'Évaluation
                  </Button>
                  <Button variant="outline">
                    Sauvegarder Brouillon
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-96">
                <div className="text-center text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-4" />
                  <p>Sélectionnez une candidature à évaluer</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
