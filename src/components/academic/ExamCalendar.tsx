
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, MapPin, Bell, Download, Filter } from "lucide-react";

interface ExamEvent {
  id: string;
  subject: string;
  type: "examen" | "rattrapage" | "oral" | "pratique";
  date: string;
  startTime: string;
  endTime: string;
  room: string;
  duration: number;
  coefficient: number;
  supervisor: string;
  instructions?: string;
  isRetake: boolean;
  registrationDeadline?: string;
}

export const ExamCalendar = () => {
  const { toast } = useToast();
  const [selectedSession, setSelectedSession] = useState("janvier-2024");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const examEvents: ExamEvent[] = [
    {
      id: "1",
      subject: "Microéconomie",
      type: "examen",
      date: "2024-01-15",
      startTime: "08:00",
      endTime: "10:00",
      room: "Amphithéâtre A",
      duration: 120,
      coefficient: 3,
      supervisor: "Dr. Martin",
      instructions: "Calculatrice autorisée. Documents interdits.",
      isRetake: false
    },
    {
      id: "2",
      subject: "Statistiques",
      type: "examen",
      date: "2024-01-17",
      startTime: "14:00",
      endTime: "16:00",
      room: "Salle 201",
      duration: 120,
      coefficient: 2,
      supervisor: "Mme. Dubois",
      instructions: "QCM et exercices. Calculatrice autorisée.",
      isRetake: false
    },
    {
      id: "3",
      subject: "Management",
      type: "examen",
      date: "2024-01-20",
      startTime: "10:00",
      endTime: "12:00",
      room: "Amphi B",
      duration: 120,
      coefficient: 2,
      supervisor: "M. Bernard",
      isRetake: false
    },
    {
      id: "4",
      subject: "Droit des affaires",
      type: "rattrapage",
      date: "2024-06-28",
      startTime: "09:00",
      endTime: "11:00",
      room: "Salle 305",
      duration: 120,
      coefficient: 2,
      supervisor: "Mme. Kadi",
      instructions: "Session de rattrapage. Documents autorisés.",
      isRetake: true,
      registrationDeadline: "2024-06-15"
    },
    {
      id: "5",
      subject: "Comptabilité",
      type: "oral",
      date: "2024-01-25",
      startTime: "14:30",
      endTime: "14:45",
      room: "Bureau 108",
      duration: 15,
      coefficient: 1,
      supervisor: "M. Bachir",
      instructions: "Présentation de 10 min + questions (5 min)",
      isRetake: false
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "examen": return "bg-blue-100 text-blue-800 border-blue-200";
      case "rattrapage": return "bg-orange-100 text-orange-800 border-orange-200";
      case "oral": return "bg-purple-100 text-purple-800 border-purple-200";
      case "pratique": return "bg-emerald-100 text-emerald-800 border-emerald-200";
      default: return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case "examen": return "Examen écrit";
      case "rattrapage": return "Rattrapage";
      case "oral": return "Examen oral";
      case "pratique": return "TP/Pratique";
      default: return type;
    }
  };

  const isUpcoming = (date: string) => {
    return new Date(date) > new Date();
  };

  const getDaysUntilExam = (date: string) => {
    const examDate = new Date(date);
    const today = new Date();
    const diffTime = examDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filterExams = (exams: ExamEvent[]) => {
    switch (selectedFilter) {
      case "upcoming": return exams.filter(exam => isUpcoming(exam.date));
      case "retakes": return exams.filter(exam => exam.isRetake);
      case "oral": return exams.filter(exam => exam.type === "oral");
      default: return exams;
    }
  };

  const exportCalendar = () => {
    toast({
      title: "Export en cours",
      description: "Le calendrier des examens est en cours d'export vers votre calendrier"
    });
  };

  const setReminder = (examId: string) => {
    toast({
      title: "Rappel programmé",
      description: "Vous recevrez un rappel 24h avant l'examen"
    });
  };

  const registerForRetake = (examId: string) => {
    toast({
      title: "Inscription au rattrapage",
      description: "Votre inscription au rattrapage a été prise en compte"
    });
  };

  const filteredExams = filterExams(examEvents);
  const upcomingExams = examEvents.filter(exam => isUpcoming(exam.date));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Calendrier des Examens et Rattrapages
              </CardTitle>
              <CardDescription>
                Planning complet de vos examens avec notifications et rappels
              </CardDescription>
            </div>
            <Button onClick={exportCalendar} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exporter calendrier
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4 text-center">
            <Calendar className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-800">
              {upcomingExams.length}
            </div>
            <div className="text-sm text-blue-600">Examens à venir</div>
          </CardContent>
        </Card>
        
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4 text-center">
            <Clock className="h-6 w-6 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-800">
              {examEvents.filter(e => e.isRetake).length}
            </div>
            <div className="text-sm text-orange-600">Rattrapages</div>
          </CardContent>
        </Card>
        
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4 text-center">
            <MapPin className="h-6 w-6 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-800">
              {examEvents.filter(e => e.type === "oral").length}
            </div>
            <div className="text-sm text-purple-600">Examens oraux</div>
          </CardContent>
        </Card>
        
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="p-4 text-center">
            <Bell className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-emerald-800">
              {upcomingExams.filter(e => getDaysUntilExam(e.date) <= 7).length}
            </div>
            <div className="text-sm text-emerald-600">Cette semaine</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Filter className="h-4 w-4 text-slate-500" />
            <Select value={selectedSession} onValueChange={setSelectedSession}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Session d'examen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="janvier-2024">Session Janvier 2024</SelectItem>
                <SelectItem value="juin-2024">Session Juin 2024</SelectItem>
                <SelectItem value="septembre-2024">Rattrapages Sept 2024</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrer par type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les examens</SelectItem>
                <SelectItem value="upcoming">À venir</SelectItem>
                <SelectItem value="retakes">Rattrapages</SelectItem>
                <SelectItem value="oral">Examens oraux</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Prochains examens (alerte) */}
      {upcomingExams.filter(e => getDaysUntilExam(e.date) <= 7).length > 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="text-amber-800 flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Examens cette semaine
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {upcomingExams
                .filter(exam => getDaysUntilExam(exam.date) <= 7)
                .map((exam) => (
                  <div key={exam.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-amber-200">
                    <div>
                      <span className="font-medium text-amber-800">{exam.subject}</span>
                      <span className="text-sm text-amber-600 ml-2">
                        {new Date(exam.date).toLocaleDateString('fr-FR')} à {exam.startTime}
                      </span>
                    </div>
                    <Badge className="bg-amber-100 text-amber-800">
                      Dans {getDaysUntilExam(exam.date)} jour{getDaysUntilExam(exam.date) > 1 ? 's' : ''}
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Liste des examens */}
      <Card>
        <CardHeader>
          <CardTitle>Planning détaillé</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredExams.map((exam) => (
              <div key={exam.id} className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="font-semibold text-slate-800">{exam.subject}</h3>
                      <Badge className={getTypeColor(exam.type)}>
                        {getTypeText(exam.type)}
                      </Badge>
                      {exam.isRetake && (
                        <Badge className="bg-orange-100 text-orange-800">
                          Rattrapage
                        </Badge>
                      )}
                      {isUpcoming(exam.date) && getDaysUntilExam(exam.date) <= 3 && (
                        <Badge className="bg-red-100 text-red-800">
                          Urgent
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-500" />
                        <span>{new Date(exam.date).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-slate-500" />
                        <span>{exam.startTime} - {exam.endTime} ({exam.duration} min)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-slate-500" />
                        <span>{exam.room}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Surveillant: </span>
                        <span className="font-medium">{exam.supervisor}</span>
                      </div>
                    </div>

                    <div className="text-sm text-slate-600 mb-2">
                      <span className="font-medium">Coefficient: </span>{exam.coefficient}
                    </div>

                    {exam.instructions && (
                      <div className="text-sm text-slate-600 bg-slate-50 p-2 rounded">
                        <span className="font-medium">Instructions: </span>
                        {exam.instructions}
                      </div>
                    )}

                    {exam.registrationDeadline && (
                      <div className="text-sm text-orange-600 mt-2">
                        <span className="font-medium">Date limite d'inscription: </span>
                        {new Date(exam.registrationDeadline).toLocaleDateString('fr-FR')}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    {isUpcoming(exam.date) && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setReminder(exam.id)}
                      >
                        <Bell className="h-3 w-3 mr-1" />
                        Rappel
                      </Button>
                    )}
                    
                    {exam.isRetake && isUpcoming(exam.date) && (
                      <Button 
                        size="sm"
                        onClick={() => registerForRetake(exam.id)}
                        className="bg-orange-600 hover:bg-orange-700"
                      >
                        S'inscrire
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Conseils et rappels */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-800">Conseils pour les examens</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-blue-700">
            <p>• Arrivez 15 minutes avant le début de l'épreuve</p>
            <p>• Munissez-vous de votre carte d'étudiant et d'une pièce d'identité</p>
            <p>• Vérifiez les matériaux autorisés pour chaque examen</p>
            <p>• Les téléphones portables doivent être éteints et rangés</p>
            <p>• Consultez régulièrement vos emails pour les éventuels changements</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
