import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarCheck, FileText, Clock, BookOpen, Award, AlertCircle, Users, Heart } from "lucide-react";
import { StudentLife } from "./StudentLife";

export const StudentDashboard = () => {
  const currentGrades = [
    { subject: "Microéconomie", grade: 14.5, coefficient: 3, status: "validé" },
    { subject: "Statistiques", grade: 12.0, coefficient: 2, status: "validé" },
    { subject: "Comptabilité", grade: 16.0, coefficient: 4, status: "validé" },
    { subject: "Droit des affaires", grade: 11.5, coefficient: 2, status: "rattrapage" },
    { subject: "Marketing", grade: null, coefficient: 3, status: "en_attente" }
  ];

  const upcomingExams = [
    { subject: "Macroéconomie", date: "2024-06-20", time: "09:00", room: "Amphi A" },
    { subject: "Finance d'entreprise", date: "2024-06-22", time: "14:00", room: "Salle 205" },
    { subject: "Économétrie", date: "2024-06-25", time: "10:30", room: "Labo Info" }
  ];

  const weekSchedule = [
    { day: "Lundi", courses: [
      { time: "08:30", subject: "Microéconomie", room: "Amphi B", type: "Cours" },
      { time: "14:00", subject: "Statistiques", room: "Salle 104", type: "TD" }
    ]},
    { day: "Mardi", courses: [
      { time: "10:00", subject: "Comptabilité", room: "Salle 201", type: "Cours" },
      { time: "15:30", subject: "Marketing", room: "Salle 305", type: "TD" }
    ]},
    { day: "Mercredi", courses: [
      { time: "09:00", subject: "Droit des affaires", room: "Amphi C", type: "Cours" }
    ]}
  ];

  const getGradeColor = (grade: number | null, status: string) => {
    if (grade === null) return "text-slate-500";
    if (status === "rattrapage") return "text-orange-600";
    if (grade >= 16) return "text-green-600";
    if (grade >= 12) return "text-blue-600";
    return "text-red-600";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "validé": return <Badge className="bg-green-100 text-green-800 border-green-200">Validé</Badge>;
      case "rattrapage": return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Rattrapage</Badge>;
      case "en_attente": return <Badge className="bg-slate-100 text-slate-800 border-slate-200">En attente</Badge>;
      default: return null;
    }
  };

  return (
    <Tabs defaultValue="academic" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6 bg-white shadow-sm border border-slate-200">
        <TabsTrigger 
          value="academic"
          className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
        >
          <BookOpen className="h-4 w-4 mr-2" />
          Parcours Académique
        </TabsTrigger>
        <TabsTrigger 
          value="student-life"
          className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
        >
          <Heart className="h-4 w-4 mr-2" />
          Vie Étudiante
        </TabsTrigger>
      </TabsList>

      <TabsContent value="academic">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Academic Progress */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Grades */}
            <Card className="border-blue-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <Award className="h-5 w-5" />
                  Mes Notes - Semestre 6
                </CardTitle>
                <CardDescription>Résultats académiques actuels</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {currentGrades.map((grade, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-800">{grade.subject}</h4>
                        <p className="text-sm text-slate-500">Coefficient: {grade.coefficient}</p>
                      </div>
                      <div className="text-right">
                        <div className={`text-xl font-bold ${getGradeColor(grade.grade, grade.status)}`}>
                          {grade.grade ? `${grade.grade}/20` : "—"}
                        </div>
                        {getStatusBadge(grade.status)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-blue-800">Moyenne générale</span>
                    <span className="text-2xl font-bold text-blue-800">13.8/20</span>
                  </div>
                  <Progress value={69} className="mt-2 h-2" />
                  <p className="text-sm text-blue-600 mt-2">Très bien ! Continuez ainsi.</p>
                </div>
              </CardContent>
            </Card>

            {/* Weekly Schedule */}
            <Card className="border-emerald-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-emerald-800">
                  <CalendarCheck className="h-5 w-5" />
                  Emploi du Temps - Semaine courante
                </CardTitle>
                <CardDescription>Planning des cours et TD</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {weekSchedule.map((day, dayIndex) => (
                    <div key={dayIndex} className="border-l-4 border-emerald-400 pl-4">
                      <h4 className="font-semibold text-slate-800 mb-2">{day.day}</h4>
                      <div className="space-y-2">
                        {day.courses.map((course, courseIndex) => (
                          <div key={courseIndex} className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="text-sm font-mono text-emerald-700 bg-emerald-200 px-2 py-1 rounded">
                                {course.time}
                              </div>
                              <div>
                                <p className="font-medium text-slate-800">{course.subject}</p>
                                <p className="text-sm text-slate-500">{course.room} • {course.type}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Exams */}
            <Card className="border-amber-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-amber-800">
                  <Clock className="h-5 w-5" />
                  Examens à venir
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {upcomingExams.map((exam, index) => (
                    <div key={index} className="p-3 border border-amber-200 rounded-lg bg-amber-50">
                      <h4 className="font-medium text-amber-900">{exam.subject}</h4>
                      <div className="text-sm text-amber-700 mt-1">
                        <p>{new Date(exam.date).toLocaleDateString('fr-FR')} à {exam.time}</p>
                        <p>{exam.room}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-purple-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-purple-800">
                  <FileText className="h-5 w-5" />
                  Services étudiants
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <Button className="w-full justify-start bg-purple-600 hover:bg-purple-700" size="sm">
                  <FileText className="mr-2 h-4 w-4" />
                  Demander une attestation
                </Button>
                <Button variant="outline" className="w-full justify-start border-purple-200 text-purple-700 hover:bg-purple-50" size="sm">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Télécharger le relevé de notes
                </Button>
                <Button variant="outline" className="w-full justify-start border-purple-200 text-purple-700 hover:bg-purple-50" size="sm">
                  <CalendarCheck className="mr-2 h-4 w-4" />
                  Prendre un RDV
                </Button>
              </CardContent>
            </Card>

            {/* Alerts */}
            <Card className="border-red-200 bg-red-50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-800">
                  <AlertCircle className="h-5 w-5" />
                  Alertes importantes
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-2 text-sm text-red-700">
                  <p>• Rattrapage Droit des affaires: 28 juin</p>
                  <p>• Date limite dépôt mémoire: 30 juin</p>
                  <p>• Réunion orientation Master: 3 juillet</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="student-life">
        <StudentLife />
      </TabsContent>
    </Tabs>
  );
};
