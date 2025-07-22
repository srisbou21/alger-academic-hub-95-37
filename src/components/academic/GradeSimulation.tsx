
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Target, Calculator, RefreshCw, TrendingUp, AlertTriangle } from "lucide-react";

interface SimulationSubject {
  id: string;
  name: string;
  currentGrade: number | null;
  coefficient: number;
  simulatedGrade: number | null;
  isRequired: boolean;
}

interface SimulationUE {
  id: string;
  name: string;
  subjects: SimulationSubject[];
  requiredAverage: number;
  currentAverage: number | null;
  simulatedAverage: number | null;
  ects: number;
}

export const GradeSimulation = () => {
  const { toast } = useToast();
  const [selectedUE, setSelectedUE] = useState("ue1");
  const [targetAverage, setTargetAverage] = useState("12");

  const [simulationData, setSimulationData] = useState<SimulationUE[]>([
    {
      id: "ue1",
      name: "UE Économie Fondamentale",
      subjects: [
        {
          id: "micro",
          name: "Microéconomie",
          currentGrade: 15.5,
          coefficient: 3,
          simulatedGrade: null,
          isRequired: false
        },
        {
          id: "macro",
          name: "Macroéconomie",
          currentGrade: null,
          coefficient: 2,
          simulatedGrade: null,
          isRequired: true
        }
      ],
      requiredAverage: 10,
      currentAverage: null,
      simulatedAverage: null,
      ects: 8
    },
    {
      id: "ue2",
      name: "UE Méthodes Quantitatives",
      subjects: [
        {
          id: "stats",
          name: "Statistiques",
          currentGrade: 12.0,
          coefficient: 2,
          simulatedGrade: null,
          isRequired: false
        },
        {
          id: "math",
          name: "Mathématiques",
          currentGrade: null,
          coefficient: 2,
          simulatedGrade: null,
          isRequired: true
        },
        {
          id: "info",
          name: "Informatique",
          currentGrade: null,
          coefficient: 1,
          simulatedGrade: null,
          isRequired: true
        }
      ],
      requiredAverage: 10,
      currentAverage: null,
      simulatedAverage: null,
      ects: 6
    }
  ]);

  const calculateUEAverage = (ue: SimulationUE, useSimulated: boolean = false): number | null => {
    const totalWeighted = ue.subjects.reduce((sum, subject) => {
      const grade = useSimulated && subject.simulatedGrade !== null 
        ? subject.simulatedGrade 
        : subject.currentGrade;
      return grade !== null ? sum + (grade * subject.coefficient) : sum;
    }, 0);

    const totalCoeff = ue.subjects.reduce((sum, subject) => {
      const grade = useSimulated && subject.simulatedGrade !== null 
        ? subject.simulatedGrade 
        : subject.currentGrade;
      return grade !== null ? sum + subject.coefficient : sum;
    }, 0);

    return totalCoeff > 0 ? totalWeighted / totalCoeff : null;
  };

  const updateSimulatedGrade = (ueId: string, subjectId: string, grade: string) => {
    const numericGrade = grade === "" ? null : parseFloat(grade);
    
    setSimulationData(prev => prev.map(ue => {
      if (ue.id === ueId) {
        const updatedUE = {
          ...ue,
          subjects: ue.subjects.map(subject => 
            subject.id === subjectId 
              ? { ...subject, simulatedGrade: numericGrade }
              : subject
          )
        };
        updatedUE.simulatedAverage = calculateUEAverage(updatedUE, true);
        return updatedUE;
      }
      return ue;
    }));
  };

  const calculateRequiredGrades = () => {
    const ue = simulationData.find(u => u.id === selectedUE);
    if (!ue) return;

    const target = parseFloat(targetAverage);
    const missingSubjects = ue.subjects.filter(s => s.currentGrade === null);
    
    if (missingSubjects.length === 0) {
      toast({
        title: "Aucune simulation nécessaire",
        description: "Toutes les notes sont déjà disponibles pour cette UE"
      });
      return;
    }

    // Calcul simplifié : répartition égale de la note cible
    const currentWeighted = ue.subjects.reduce((sum, s) => 
      s.currentGrade !== null ? sum + (s.currentGrade * s.coefficient) : sum, 0
    );
    const currentCoeff = ue.subjects.reduce((sum, s) => 
      s.currentGrade !== null ? sum + s.coefficient : sum, 0
    );
    const missingCoeff = ue.subjects.reduce((sum, s) => 
      s.currentGrade === null ? sum + s.coefficient : sum, 0
    );
    
    const totalCoeff = currentCoeff + missingCoeff;
    const requiredWeighted = target * totalCoeff;
    const remainingWeighted = requiredWeighted - currentWeighted;
    const averageRequired = remainingWeighted / missingCoeff;

    setSimulationData(prev => prev.map(u => {
      if (u.id === selectedUE) {
        const updatedUE = {
          ...u,
          subjects: u.subjects.map(subject => 
            subject.currentGrade === null 
              ? { ...subject, simulatedGrade: Math.max(0, Math.min(20, averageRequired)) }
              : subject
          )
        };
        updatedUE.simulatedAverage = calculateUEAverage(updatedUE, true);
        return updatedUE;
      }
      return u;
    }));

    toast({
      title: "Simulation calculée",
      description: `Notes requises calculées pour atteindre ${target}/20 de moyenne`
    });
  };

  const resetSimulation = () => {
    setSimulationData(prev => prev.map(ue => ({
      ...ue,
      subjects: ue.subjects.map(subject => ({ ...subject, simulatedGrade: null })),
      simulatedAverage: null
    })));
    
    toast({
      title: "Simulation réinitialisée",
      description: "Toutes les notes simulées ont été effacées"
    });
  };

  const currentUE = simulationData.find(ue => ue.id === selectedUE);

  const getGradeColor = (grade: number) => {
    if (grade >= 16) return "text-purple-600";
    if (grade >= 14) return "text-blue-600";
    if (grade >= 12) return "text-emerald-600";
    if (grade >= 10) return "text-yellow-600";
    return "text-red-600";
  };

  const getRequiredEffort = (required: number): { text: string; color: string } => {
    if (required <= 8) return { text: "Très difficile", color: "text-red-600" };
    if (required <= 10) return { text: "Difficile", color: "text-orange-600" };
    if (required <= 14) return { text: "Modéré", color: "text-yellow-600" };
    if (required <= 18) return { text: "Réalisable", color: "text-green-600" };
    return { text: "Impossible", color: "text-red-800" };
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Simulation de Notes
          </CardTitle>
          <CardDescription>
            Simulez vos notes pour prévoir la validation de vos UE et calculer les objectifs à atteindre
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Configuration de la simulation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Configuration de la Simulation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium mb-2 block">UE à simuler</label>
              <Select value={selectedUE} onValueChange={setSelectedUE}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {simulationData.map(ue => (
                    <SelectItem key={ue.id} value={ue.id}>{ue.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Moyenne cible</label>
              <Input
                type="number"
                min="0"
                max="20"
                step="0.1"
                value={targetAverage}
                onChange={(e) => setTargetAverage(e.target.value)}
                placeholder="Ex: 12.0"
              />
            </div>
            
            <div className="flex items-end gap-2">
              <Button onClick={calculateRequiredGrades} className="bg-blue-600 hover:bg-blue-700">
                <Calculator className="h-4 w-4 mr-2" />
                Calculer
              </Button>
              <Button onClick={resetSimulation} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Simulation détaillée */}
      {currentUE && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{currentUE.name}</span>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{currentUE.ects} ECTS</Badge>
                {currentUE.simulatedAverage !== null && (
                  <Badge className={
                    currentUE.simulatedAverage >= currentUE.requiredAverage 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  }>
                    {currentUE.simulatedAverage >= currentUE.requiredAverage ? "Validée" : "Non validée"}
                  </Badge>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Résumé des moyennes */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <div className="text-sm text-slate-600">Moyenne actuelle</div>
                  <div className="text-xl font-bold text-slate-800">
                    {currentUE.currentAverage ? currentUE.currentAverage.toFixed(2) : "—"}/20
                  </div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-sm text-blue-600">Moyenne simulée</div>
                  <div className={`text-xl font-bold ${
                    currentUE.simulatedAverage ? getGradeColor(currentUE.simulatedAverage) : 'text-slate-400'
                  }`}>
                    {currentUE.simulatedAverage ? currentUE.simulatedAverage.toFixed(2) : "—"}/20
                  </div>
                </div>
                <div className="text-center p-4 bg-emerald-50 rounded-lg">
                  <div className="text-sm text-emerald-600">Objectif</div>
                  <div className="text-xl font-bold text-emerald-800">
                    {currentUE.requiredAverage}/20
                  </div>
                </div>
              </div>

              {/* Progression vers l'objectif */}
              {currentUE.simulatedAverage !== null && (
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progression vers l'objectif</span>
                    <span>{((currentUE.simulatedAverage / currentUE.requiredAverage) * 100).toFixed(0)}%</span>
                  </div>
                  <Progress 
                    value={Math.min(100, (currentUE.simulatedAverage / currentUE.requiredAverage) * 100)} 
                    className="h-3"
                  />
                </div>
              )}

              {/* Détail par matière */}
              <div className="space-y-3">
                <h4 className="font-medium text-slate-700">Simulation par matière :</h4>
                {currentUE.subjects.map((subject) => (
                  <div key={subject.id} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <h5 className="font-medium text-slate-800">{subject.name}</h5>
                        <Badge variant="outline">Coeff. {subject.coefficient}</Badge>
                        {subject.isRequired && (
                          <Badge className="bg-amber-100 text-amber-800">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Requis
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs text-slate-500">Note actuelle</label>
                        <div className={`text-lg font-bold ${
                          subject.currentGrade ? getGradeColor(subject.currentGrade) : 'text-slate-400'
                        }`}>
                          {subject.currentGrade ? `${subject.currentGrade}/20` : "En attente"}
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-xs text-slate-500">Note simulée</label>
                        <Input
                          type="number"
                          min="0"
                          max="20"
                          step="0.1"
                          value={subject.simulatedGrade || ""}
                          onChange={(e) => updateSimulatedGrade(currentUE.id, subject.id, e.target.value)}
                          placeholder="Saisir note"
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <label className="text-xs text-slate-500">Impact sur moyenne</label>
                        <div className="text-sm text-slate-600 mt-1">
                          {subject.simulatedGrade !== null && (
                            <span>
                              +{(subject.simulatedGrade * subject.coefficient).toFixed(1)} pts
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Analyse et recommandations */}
              {currentUE.simulatedAverage !== null && (
                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="p-4">
                    <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Analyse de la simulation
                    </h4>
                    <div className="space-y-2 text-sm text-blue-700">
                      {currentUE.simulatedAverage >= currentUE.requiredAverage ? (
                        <p>✅ Objectif atteint ! Votre UE sera validée avec cette simulation.</p>
                      ) : (
                        <p>❌ Objectif non atteint. Il vous faut {(currentUE.requiredAverage - currentUE.simulatedAverage).toFixed(2)} points supplémentaires.</p>
                      )}
                      
                      {currentUE.subjects.filter(s => s.simulatedGrade !== null).map(subject => {
                        if (subject.simulatedGrade! > 18) {
                          const effort = getRequiredEffort(subject.simulatedGrade!);
                          return (
                            <p key={subject.id} className={effort.color}>
                              ⚠️ {subject.name} : {subject.simulatedGrade}/20 requis - {effort.text}
                            </p>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Vue d'ensemble des UE */}
      <Card>
        <CardHeader>
          <CardTitle>Vue d'ensemble des simulations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {simulationData.map((ue) => (
              <div key={ue.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-slate-800">{ue.name}</h4>
                  <p className="text-sm text-slate-600">{ue.ects} ECTS</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-500">Simulé</div>
                  <div className={`font-bold ${
                    ue.simulatedAverage ? getGradeColor(ue.simulatedAverage) : 'text-slate-400'
                  }`}>
                    {ue.simulatedAverage ? `${ue.simulatedAverage.toFixed(2)}/20` : "—"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
