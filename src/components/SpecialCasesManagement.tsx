
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeftRight, FileCheck, RotateCcw, GraduationCap, Users, Search, Eye, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { TransferManagement } from "./TransferManagement";
import { EquivalenceEvaluation } from "./EquivalenceEvaluation";

export const SpecialCasesManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("transfers");

  const specialCases = [
    {
      id: "TRANS-2024-001",
      studentName: "Ahmed Benali",
      type: "transfer_in",
      status: "pending",
      university: "Université d'Oran",
      level: "L2",
      department: "Économie",
      documents: 8,
      submittedDate: "2024-06-10",
      priority: "normal"
    },
    {
      id: "EQUIV-2024-002",
      studentName: "Sarah Khalil",
      type: "equivalence",
      status: "review",
      foreignDegree: "Bachelor Economics - Université de Tunis",
      requestedLevel: "L3",
      department: "Économie",
      documents: 12,
      submittedDate: "2024-06-08",
      priority: "high"
    },
    {
      id: "REOR-2024-003",
      studentName: "Karim Meziane",
      type: "reorientation",
      status: "approved",
      fromDepartment: "Gestion",
      toDepartment: "Commerce International",
      currentLevel: "L2",
      documents: 5,
      submittedDate: "2024-06-05",
      priority: "normal"
    },
    {
      id: "REPRISE-2024-004",
      studentName: "Nadia Ouali",
      type: "resumption",
      status: "pending",
      lastStudyYear: "2019-2020",
      lastLevel: "L2",
      department: "Finance",
      documents: 7,
      submittedDate: "2024-06-12",
      priority: "normal"
    }
  ];

  const getTypeInfo = (type: string) => {
    switch (type) {
      case "transfer_in":
        return { label: "Transfert entrant", color: "bg-blue-100 text-blue-800 border-blue-200", icon: ArrowLeftRight };
      case "transfer_out":
        return { label: "Transfert sortant", color: "bg-purple-100 text-purple-800 border-purple-200", icon: ArrowLeftRight };
      case "equivalence":
        return { label: "Équivalence", color: "bg-green-100 text-green-800 border-green-200", icon: FileCheck };
      case "reorientation":
        return { label: "Réorientation", color: "bg-orange-100 text-orange-800 border-orange-200", icon: RotateCcw };
      case "resumption":
        return { label: "Reprise d'études", color: "bg-cyan-100 text-cyan-800 border-cyan-200", icon: GraduationCap };
      case "parallel":
        return { label: "Inscription parallèle", color: "bg-pink-100 text-pink-800 border-pink-200", icon: Users };
      default:
        return { label: "Inconnu", color: "bg-slate-100 text-slate-800 border-slate-200", icon: FileCheck };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-green-100 text-green-800 border-green-200";
      case "pending": return "bg-amber-100 text-amber-800 border-amber-200";
      case "review": return "bg-blue-100 text-blue-800 border-blue-200";
      case "rejected": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved": return "Approuvé";
      case "pending": return "En attente";
      case "review": return "En révision";
      case "rejected": return "Rejeté";
      default: return "Inconnu";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-600";
      case "normal": return "text-slate-600";
      case "low": return "text-green-600";
      default: return "text-slate-600";
    }
  };

  if (selectedCase) {
    const caseData = specialCases.find(c => c.id === selectedCase);
    if (caseData?.type === "transfer_in" || caseData?.type === "transfer_out") {
      return <TransferManagement caseId={selectedCase} onBack={() => setSelectedCase(null)} />;
    }
    if (caseData?.type === "equivalence") {
      return <EquivalenceEvaluation caseId={selectedCase} onBack={() => setSelectedCase(null)} />;
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Gestion des Cas Particuliers</h2>
          <p className="text-slate-600">Traitement des transferts, équivalences et réorientations</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          Nouveau cas particulier
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Transferts</p>
                <p className="text-2xl font-bold text-blue-800">23</p>
              </div>
              <ArrowLeftRight className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Équivalences</p>
                <p className="text-2xl font-bold text-green-800">15</p>
              </div>
              <FileCheck className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium">Réorientations</p>
                <p className="text-2xl font-bold text-orange-800">8</p>
              </div>
              <RotateCcw className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-cyan-200 bg-gradient-to-br from-cyan-50 to-cyan-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyan-600 text-sm font-medium">Reprises</p>
                <p className="text-2xl font-bold text-cyan-800">12</p>
              </div>
              <GraduationCap className="h-8 w-8 text-cyan-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-pink-200 bg-gradient-to-br from-pink-50 to-pink-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-pink-600 text-sm font-medium">Parallèles</p>
                <p className="text-2xl font-bold text-pink-800">5</p>
              </div>
              <Users className="h-8 w-8 text-pink-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Recherche et Filtres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Rechercher par nom, numéro ou université..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              Filtres avancés
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Cases List */}
      <Card>
        <CardHeader>
          <CardTitle>Dossiers en Cours ({specialCases.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {specialCases.map((caseItem) => {
              const typeInfo = getTypeInfo(caseItem.type);
              const TypeIcon = typeInfo.icon;

              return (
                <Card key={caseItem.id} className="border-slate-200 hover:border-blue-300 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-slate-100 rounded-lg">
                          <TypeIcon className="h-6 w-6 text-slate-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-800">{caseItem.studentName}</h3>
                          <p className="text-sm text-slate-600">{caseItem.id}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={typeInfo.color}>
                              {typeInfo.label}
                            </Badge>
                            <span className="text-xs text-slate-500">
                              {caseItem.documents} documents
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <Badge className={getStatusColor(caseItem.status)}>
                            {getStatusText(caseItem.status)}
                          </Badge>
                          <p className="text-xs text-slate-500 mt-1">
                            {new Date(caseItem.submittedDate).toLocaleDateString('fr-FR')}
                          </p>
                          <p className={`text-xs font-medium ${getPriorityColor(caseItem.priority)}`}>
                            Priorité {caseItem.priority === "high" ? "haute" : caseItem.priority === "low" ? "basse" : "normale"}
                          </p>
                        </div>
                        
                        <Button
                          size="sm"
                          onClick={() => setSelectedCase(caseItem.id)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Traiter
                        </Button>
                      </div>
                    </div>

                    {/* Additional case-specific info */}
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-slate-600">
                        {caseItem.type === "transfer_in" && (
                          <>
                            <div><span className="font-medium">Université:</span> {caseItem.university}</div>
                            <div><span className="font-medium">Niveau:</span> {caseItem.level}</div>
                            <div><span className="font-medium">Département:</span> {caseItem.department}</div>
                          </>
                        )}
                        {caseItem.type === "equivalence" && (
                          <>
                            <div><span className="font-medium">Diplôme:</span> {caseItem.foreignDegree}</div>
                            <div><span className="font-medium">Niveau demandé:</span> {caseItem.requestedLevel}</div>
                            <div><span className="font-medium">Département:</span> {caseItem.department}</div>
                          </>
                        )}
                        {caseItem.type === "reorientation" && (
                          <>
                            <div><span className="font-medium">De:</span> {caseItem.fromDepartment}</div>
                            <div><span className="font-medium">Vers:</span> {caseItem.toDepartment}</div>
                            <div><span className="font-medium">Niveau:</span> {caseItem.currentLevel}</div>
                          </>
                        )}
                        {caseItem.type === "resumption" && (
                          <>
                            <div><span className="font-medium">Dernière année:</span> {caseItem.lastStudyYear}</div>
                            <div><span className="font-medium">Dernier niveau:</span> {caseItem.lastLevel}</div>
                            <div><span className="font-medium">Département:</span> {caseItem.department}</div>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
