
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Users, FileText, AlertCircle, CheckCircle2 } from "lucide-react";
import { useState } from "react";

interface ExamSession {
  id: string;
  subject: string;
  date: string;
  time: string;
  duration: number;
  room: string;
  capacity: number;
  registered: number;
  supervisors: string[];
  type: "ecrit" | "oral" | "pratique";
  level: string;
  specialNeeds: number; // étudiants tiers-temps
  status: "planned" | "confirmed" | "completed";
}

interface DefenseSession {
  id: string;
  student: string;
  subject: string;
  date: string;
  time: string;
  room: string;
  jury: string[];
  type: "licence" | "master";
  status: "scheduled" | "confirmed" | "completed";
}

export const ExamPlanning = () => {
  const [selectedSession, setSelectedSession] = useState("janvier-2024");
  const [selectedType, setSelectedType] = useState("all");

  const examSessions: ExamSession[] = [
    {
      id: "exam1",
      subject: "Microéconomie",
      date: "2024-01-15",
      time: "08:00-10:00",
      duration: 120,
      room: "Amphithéâtre A",
      capacity: 200,
      registered: 145,
      supervisors: ["Dr. Martin", "Mme. Dubois"],
      type: "ecrit",
      level: "L3",
      specialNeeds: 3,
      status: "confirmed"
    },
    {
      id: "exam2",
      subject: "Comptabilité Analytique",
      date: "2024-01-16",
      time: "14:00-16:00",
      duration: 120,
      room: "Salle 201",
      capacity: 80,
      registered: 67,
      supervisors: ["M. Bernard"],
      type: "ecrit",
      level: "L2",
      specialNeeds: 1,
      status: "planned"
    }
  ];

  const defenses: DefenseSession[] = [
    {
      id: "def1",
      student: "Ahmed Benali",
      subject: "Analyse financière des PME algériennes",
      date: "2024-06-20",
      time: "09:00-10:00",
      room: "Salle de conférences",
      jury: ["Prof. Kaddour", "Dr. Amara", "M. Sellami"],
      type: "master",
      status: "scheduled"
    },
    {
      id: "def2",
      student: "Fatima Zerrouki",
      subject: "Impact du e-commerce sur le commerce traditionnel",
      date: "2024-06-20",
      time: "14:30-15:30",
      room: "Salle 105",
      jury: ["Dr. Benaissa", "Mme. Hadjab"],
      type: "licence",
      status: "confirmed"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800 border-green-200";
      case "planned": return "bg-amber-100 text-amber-800 border-amber-200";
      case "completed": return "bg-blue-100 text-blue-800 border-blue-200";
      case "scheduled": return "bg-purple-100 text-purple-800 border-purple-200";
      default: return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed": return "Confirmé";
      case "planned": return "Planifié";
      case "completed": return "Terminé";
      case "scheduled": return "Programmé";
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="exams" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="exams">Sessions d'Examens</TabsTrigger>
          <TabsTrigger value="defenses">Soutenances</TabsTrigger>
        </TabsList>

        <TabsContent value="exams" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Planification des Examens
              </CardTitle>
              <CardDescription>
                Organisation et coordination des sessions d'examens
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <Select value={selectedSession} onValueChange={setSelectedSession}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Session d'examen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="janvier-2024">Session Janvier 2024</SelectItem>
                    <SelectItem value="juin-2024">Session Juin 2024</SelectItem>
                    <SelectItem value="septembre-2024">Session Rattrapage Sept 2024</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Type d'examen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    <SelectItem value="ecrit">Examens écrits</SelectItem>
                    <SelectItem value="oral">Examens oraux</SelectItem>
                    <SelectItem value="pratique">Examens pratiques</SelectItem>
                  </SelectContent>
                </Select>

                <Button className="bg-blue-600 hover:bg-blue-700">
                  Nouvel examen
                </Button>
                <Button variant="outline">
                  Générer planning
                </Button>
              </div>

              <div className="space-y-4">
                {examSessions.map((exam) => (
                  <Card key={exam.id} className="border-slate-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-2">
                            <h3 className="font-semibold text-slate-800">{exam.subject}</h3>
                            <Badge variant="outline">{exam.level}</Badge>
                            <Badge className={exam.type === "ecrit" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"}>
                              {exam.type}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                            <div>
                              <span className="text-slate-500">Date: </span>
                              <span className="font-medium">
                                {new Date(exam.date).toLocaleDateString('fr-FR')}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-500">Horaire: </span>
                              <span className="font-medium">{exam.time}</span>
                            </div>
                            <div>
                              <span className="text-slate-500">Salle: </span>
                              <span className="font-medium">{exam.room}</span>
                            </div>
                            <div>
                              <span className="text-slate-500">Inscrits: </span>
                              <span className="font-medium">{exam.registered}/{exam.capacity}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-sm">
                            <div>
                              <span className="text-slate-500">Surveillants: </span>
                              <span className="font-medium">{exam.supervisors.join(", ")}</span>
                            </div>
                            {exam.specialNeeds > 0 && (
                              <div className="flex items-center gap-1 text-amber-600">
                                <AlertCircle className="h-4 w-4" />
                                <span>{exam.specialNeeds} tiers-temps</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-2">
                          <Badge className={getStatusColor(exam.status)}>
                            {getStatusText(exam.status)}
                          </Badge>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline">
                              Modifier
                            </Button>
                            {exam.status === "planned" && (
                              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                Confirmer
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Statistics */}
              <div className="mt-6 grid grid-cols-4 gap-4">
                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="p-4 text-center">
                    <FileText className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-lg font-bold text-blue-800">24</p>
                    <p className="text-sm text-blue-600">Examens planifiés</p>
                  </CardContent>
                </Card>
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="p-4 text-center">
                    <CheckCircle2 className="h-6 w-6 text-green-600 mx-auto mb-2" />
                    <p className="text-lg font-bold text-green-800">18</p>
                    <p className="text-sm text-green-600">Confirmés</p>
                  </CardContent>
                </Card>
                <Card className="border-amber-200 bg-amber-50">
                  <CardContent className="p-4 text-center">
                    <AlertCircle className="h-6 w-6 text-amber-600 mx-auto mb-2" />
                    <p className="text-lg font-bold text-amber-800">12</p>
                    <p className="text-sm text-amber-600">Tiers-temps</p>
                  </CardContent>
                </Card>
                <Card className="border-purple-200 bg-purple-50">
                  <CardContent className="p-4 text-center">
                    <Users className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                    <p className="text-lg font-bold text-purple-800">48</p>
                    <p className="text-sm text-purple-600">Surveillants requis</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="defenses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Planning des Soutenances
              </CardTitle>
              <CardDescription>
                Gestion des soutenances de mémoire et projets de fin d'études
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Nouvelle soutenance
                </Button>
                <Button variant="outline">
                  Assigner jury
                </Button>
                <Button variant="outline">
                  Planning complet
                </Button>
              </div>

              <div className="space-y-4">
                {defenses.map((defense) => (
                  <Card key={defense.id} className="border-slate-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-2">
                            <h3 className="font-semibold text-slate-800">{defense.student}</h3>
                            <Badge className={defense.type === "master" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"}>
                              {defense.type === "master" ? "Master" : "Licence"}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-slate-600 mb-3 italic">"{defense.subject}"</p>
                          
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-3">
                            <div>
                              <span className="text-slate-500">Date: </span>
                              <span className="font-medium">
                                {new Date(defense.date).toLocaleDateString('fr-FR')}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-500">Horaire: </span>
                              <span className="font-medium">{defense.time}</span>
                            </div>
                            <div>
                              <span className="text-slate-500">Salle: </span>
                              <span className="font-medium">{defense.room}</span>
                            </div>
                          </div>

                          <div>
                            <span className="text-slate-500">Jury: </span>
                            <span className="font-medium">{defense.jury.join(", ")}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-2">
                          <Badge className={getStatusColor(defense.status)}>
                            {getStatusText(defense.status)}
                          </Badge>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline">
                              Modifier
                            </Button>
                            {defense.status === "scheduled" && (
                              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                Confirmer
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
