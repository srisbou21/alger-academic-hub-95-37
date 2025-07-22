
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, CheckCircle, Clock, AlertCircle, RefreshCw } from "lucide-react";

interface RealTimeGrade {
  id: string;
  subject: string;
  examType: string;
  grade: number | null;
  coefficient: number;
  examDate: string;
  status: "published" | "pending" | "validated";
  publishedAt?: Date;
  isNew?: boolean;
}

export const RealTimeGrades = () => {
  const { toast } = useToast();
  const [grades, setGrades] = useState<RealTimeGrade[]>([
    {
      id: "1",
      subject: "Microéconomie",
      examType: "Examen Final",
      grade: 15.5,
      coefficient: 3,
      examDate: "2024-01-15",
      status: "validated",
      publishedAt: new Date(Date.now() - 86400000) // Hier
    },
    {
      id: "2",
      subject: "Statistiques",
      examType: "Contrôle Continu",
      grade: 12.0,
      coefficient: 2,
      examDate: "2024-01-20",
      status: "published",
      publishedAt: new Date(Date.now() - 3600000), // Il y a 1 heure
      isNew: true
    },
    {
      id: "3",
      subject: "Management",
      examType: "Examen Final",
      grade: null,
      coefficient: 2,
      examDate: "2024-01-25",
      status: "pending"
    }
  ]);

  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Simuler la réception d'une nouvelle note
    const timer = setTimeout(() => {
      const newGrade: RealTimeGrade = {
        id: "4",
        subject: "Comptabilité",
        examType: "TD",
        grade: 16.0,
        coefficient: 1,
        examDate: "2024-01-22",
        status: "published",
        publishedAt: new Date(),
        isNew: true
      };
      
      setGrades(prev => [newGrade, ...prev]);
      toast({
        title: "Nouvelle note disponible !",
        description: `Note de ${newGrade.subject} publiée : ${newGrade.grade}/20`
      });
    }, 5000);

    return () => clearTimeout(timer);
  }, [toast]);

  const refreshGrades = async () => {
    setIsRefreshing(true);
    
    // Simuler un appel API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setLastRefresh(new Date());
    setIsRefreshing(false);
    
    // Marquer toutes les notes comme vues
    setGrades(prev => prev.map(grade => ({ ...grade, isNew: false })));
    
    toast({
      title: "Notes actualisées",
      description: "Vos notes ont été synchronisées"
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "validated": return "bg-green-100 text-green-800 border-green-200";
      case "published": return "bg-blue-100 text-blue-800 border-blue-200";
      case "pending": return "bg-amber-100 text-amber-800 border-amber-200";
      default: return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "validated": return <CheckCircle className="h-3 w-3" />;
      case "published": return <BookOpen className="h-3 w-3" />;
      case "pending": return <Clock className="h-3 w-3" />;
      default: return <AlertCircle className="h-3 w-3" />;
    }
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 16) return "text-purple-600";
    if (grade >= 14) return "text-blue-600";
    if (grade >= 12) return "text-emerald-600";
    if (grade >= 10) return "text-yellow-600";
    return "text-red-600";
  };

  const publishedGrades = grades.filter(g => g.status !== "pending");
  const averageGrade = publishedGrades.length > 0 
    ? publishedGrades.reduce((sum, g) => sum + (g.grade || 0) * g.coefficient, 0) / 
      publishedGrades.reduce((sum, g) => sum + g.coefficient, 0)
    : 0;

  return (
    <div className="space-y-6">
      {/* En-tête avec actualisation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Mes Notes en Temps Réel
              </CardTitle>
              <CardDescription>
                Consultation des notes dès leur validation par les enseignants
              </CardDescription>
            </div>
            <div className="text-right">
              <Button 
                onClick={refreshGrades}
                disabled={isRefreshing}
                variant="outline"
                className="mb-2"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Actualiser
              </Button>
              <p className="text-xs text-slate-500">
                Dernière sync: {lastRefresh.toLocaleString('fr-FR')}
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Résumé rapide */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-800">
              {publishedGrades.length}
            </div>
            <div className="text-sm text-blue-600">Notes disponibles</div>
          </CardContent>
        </Card>
        
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-emerald-800">
              {averageGrade.toFixed(2)}
            </div>
            <div className="text-sm text-emerald-600">Moyenne actuelle</div>
          </CardContent>
        </Card>
        
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-amber-800">
              {grades.filter(g => g.status === "pending").length}
            </div>
            <div className="text-sm text-amber-600">En attente</div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des notes */}
      <Card>
        <CardHeader>
          <CardTitle>Détail des Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {grades.map((grade) => (
              <div 
                key={grade.id} 
                className={`p-4 rounded-lg border transition-all ${
                  grade.isNew 
                    ? 'bg-blue-50 border-blue-200 shadow-md' 
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium text-slate-800">{grade.subject}</h4>
                      <Badge variant="outline">{grade.examType}</Badge>
                      <Badge className={getStatusColor(grade.status)}>
                        {getStatusIcon(grade.status)}
                        {grade.status === "validated" ? "Validé" : 
                         grade.status === "published" ? "Publié" : "En attente"}
                      </Badge>
                      {grade.isNew && (
                        <Badge className="bg-red-100 text-red-800 border-red-200">
                          NOUVEAU
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm text-slate-600">
                      <div>
                        <span className="text-slate-500">Date examen: </span>
                        {new Date(grade.examDate).toLocaleDateString('fr-FR')}
                      </div>
                      <div>
                        <span className="text-slate-500">Coefficient: </span>
                        {grade.coefficient}
                      </div>
                      {grade.publishedAt && (
                        <div>
                          <span className="text-slate-500">Publié: </span>
                          {grade.publishedAt.toLocaleString('fr-FR')}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    {grade.grade !== null ? (
                      <div className={`text-2xl font-bold ${getGradeColor(grade.grade)}`}>
                        {grade.grade}/20
                      </div>
                    ) : (
                      <div className="text-xl text-slate-400">
                        —
                      </div>
                    )}
                  </div>
                </div>
                
                {grade.grade !== null && (
                  <div className="mt-3">
                    <Progress 
                      value={(grade.grade / 20) * 100} 
                      className="h-2"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
