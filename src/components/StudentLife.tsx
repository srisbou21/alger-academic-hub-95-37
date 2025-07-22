
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, FileText, Star, BookOpen, Clock, Users, MessageSquare, Download } from "lucide-react";

export const StudentLife = () => {
  const announcements = [
    {
      id: 1,
      title: "Journée Portes Ouvertes Master",
      date: "2024-06-25",
      category: "Événement",
      priority: "high",
      description: "Découvrez nos formations Master en économie et gestion"
    },
    {
      id: 2,
      title: "Nouvelle bibliothèque numérique",
      date: "2024-06-20",
      category: "Information",
      priority: "medium",
      description: "Accès à plus de 10,000 ouvrages en ligne"
    },
    {
      id: 3,
      title: "Conférence sur l'innovation",
      date: "2024-06-28",
      category: "Événement",
      priority: "medium",
      description: "Conférence avec des experts de l'innovation technologique"
    }
  ];

  const availableSlots = [
    { date: "2024-06-18", time: "09:00", service: "Scolarité", available: true },
    { date: "2024-06-18", time: "10:30", service: "Scolarité", available: true },
    { date: "2024-06-18", time: "14:00", service: "Orientation", available: false },
    { date: "2024-06-19", time: "09:30", service: "Stages", available: true },
    { date: "2024-06-19", time: "11:00", service: "Bourses", available: true }
  ];

  const coursesToEvaluate = [
    { id: 1, course: "Microéconomie", teacher: "Prof. Martin", deadline: "2024-06-30", completed: false },
    { id: 2, course: "Statistiques", teacher: "Prof. Dubois", deadline: "2024-06-25", completed: true },
    { id: 3, course: "Marketing", teacher: "Prof. Laurent", deadline: "2024-07-05", completed: false }
  ];

  const resources = [
    { id: 1, title: "Guide de méthodologie", type: "PDF", category: "Méthodologie", downloads: 234 },
    { id: 2, title: "Base de données économiques", type: "Lien", category: "Recherche", downloads: 156 },
    { id: 3, title: "Modèles de rapport de stage", type: "Word", category: "Stage", downloads: 189 },
    { id: 4, title: "Exercices corrigés - Econométrie", type: "PDF", category: "Exercices", downloads: 312 }
  ];

  const getPriorityBadge = (priority: string) => {
    const styles = {
      high: "bg-red-100 text-red-800 border-red-200",
      medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
      low: "bg-green-100 text-green-800 border-green-200"
    };
    return styles[priority as keyof typeof styles] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Vie Étudiante</h2>
          <p className="text-slate-600">Services et ressources pour votre parcours universitaire</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Users className="h-3 w-3 mr-1" />
            Communauté active
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="announcements" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6 bg-white shadow-sm border border-slate-200">
          <TabsTrigger 
            value="announcements"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Annonces
          </TabsTrigger>
          <TabsTrigger 
            value="appointments"
            className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Rendez-vous
          </TabsTrigger>
          <TabsTrigger 
            value="evaluations"
            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
          >
            <Star className="h-4 w-4 mr-2" />
            Évaluations
          </TabsTrigger>
          <TabsTrigger 
            value="resources"
            className="data-[state=active]:bg-orange-600 data-[state=active]:text-white"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Ressources
          </TabsTrigger>
        </TabsList>

        <TabsContent value="announcements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Annonces et Événements
              </CardTitle>
              <CardDescription>
                Restez informé des dernières actualités de la faculté
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {announcements.map((announcement) => (
                  <div key={announcement.id} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-slate-800">{announcement.title}</h4>
                      <div className="flex gap-2">
                        <Badge className={getPriorityBadge(announcement.priority)}>
                          {announcement.priority}
                        </Badge>
                        <Badge variant="outline">
                          {announcement.category}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-slate-600 text-sm mb-2">{announcement.description}</p>
                    <div className="flex items-center text-xs text-slate-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(announcement.date).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Réservation de Rendez-vous
              </CardTitle>
              <CardDescription>
                Prenez rendez-vous avec les services administratifs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableSlots.map((slot, index) => (
                  <div 
                    key={index} 
                    className={`p-4 border rounded-lg ${
                      slot.available 
                        ? 'border-green-200 bg-green-50 hover:bg-green-100' 
                        : 'border-gray-200 bg-gray-50'
                    } transition-colors`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-800">{slot.service}</p>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Calendar className="h-3 w-3" />
                          {new Date(slot.date).toLocaleDateString('fr-FR')}
                          <Clock className="h-3 w-3 ml-2" />
                          {slot.time}
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        disabled={!slot.available}
                        className={slot.available ? "bg-green-600 hover:bg-green-700" : ""}
                      >
                        {slot.available ? "Réserver" : "Occupé"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evaluations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Évaluation des Enseignements
              </CardTitle>
              <CardDescription>
                Évaluez anonymement vos cours et enseignants
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {coursesToEvaluate.map((course) => (
                  <div key={course.id} className="p-4 border border-slate-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-800">{course.course}</h4>
                        <p className="text-sm text-slate-600">{course.teacher}</p>
                        <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                          <Clock className="h-3 w-3" />
                          Échéance: {new Date(course.deadline).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {course.completed ? (
                          <Badge className="bg-green-100 text-green-800">Complété</Badge>
                        ) : (
                          <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                            <Star className="h-3 w-3 mr-1" />
                            Évaluer
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Ressources Pédagogiques
              </CardTitle>
              <CardDescription>
                Accédez aux documents et outils partagés par la faculté
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resources.map((resource) => (
                  <div key={resource.id} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-800">{resource.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {resource.type}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {resource.category}
                          </Badge>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="h-3 w-3 mr-1" />
                        Télécharger
                      </Button>
                    </div>
                    <div className="flex items-center text-xs text-slate-500">
                      <Users className="h-3 w-3 mr-1" />
                      {resource.downloads} téléchargements
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
