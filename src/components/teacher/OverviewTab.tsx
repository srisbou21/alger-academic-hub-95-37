
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Clock, 
  Users, 
  BookOpen, 
  AlertTriangle, 
  CheckCircle,
  MessageSquare,
  FileQuestion,
  BarChart3,
  Bell
} from "lucide-react";

export const OverviewTab = () => {
  const todaySchedule = [
    { time: "08:00-09:30", course: "Microéconomie L3", room: "Amphi A", students: 45 },
    { time: "10:00-11:30", course: "Statistiques L2", room: "Salle 205", students: 38 },
    { time: "14:00-15:30", course: "Économie générale L1", room: "Amphi B", students: 67 }
  ];

  const quickStats = {
    totalHours: 135,
    maxHours: 180,
    absenceRequests: 2,
    unreadMessages: 5,
    pendingQuestionnaires: 1,
    studentsToday: 150
  };

  const recentNotifications = [
    {
      id: 1,
      type: "absence",
      message: "Votre demande d'absence du 15/07 a été approuvée",
      time: "Il y a 2h",
      priority: "normal"
    },
    {
      id: 2,
      type: "message",
      message: "Nouveau message de Amina Benali (Microéconomie L3)",
      time: "Il y a 3h",
      priority: "high"
    },
    {
      id: 3,
      type: "workload",
      message: "Nouvelle attribution: Statistiques L2 - TD Groupe 3",
      time: "Il y a 1 jour",
      priority: "normal"
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'normal': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'absence': return <Calendar className="h-4 w-4 text-amber-600" />;
      case 'message': return <MessageSquare className="h-4 w-4 text-blue-600" />;
      case 'workload': return <BookOpen className="h-4 w-4 text-green-600" />;
      default: return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Bienvenue et statistiques rapides */}
      <Card className="border-emerald-200 bg-gradient-to-r from-emerald-50 to-emerald-100">
        <CardHeader>
          <CardTitle className="text-emerald-800">
            Tableau de Bord Enseignant
          </CardTitle>
          <p className="text-emerald-600">
            Bienvenue Dr. Ahmed Benali - {new Date().toLocaleDateString('fr-FR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
              <Clock className="h-6 w-6 text-blue-600 mx-auto mb-1" />
              <p className="text-lg font-bold text-blue-800">{quickStats.totalHours}h</p>
              <p className="text-xs text-blue-700">Charge actuelle</p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
              <Users className="h-6 w-6 text-purple-600 mx-auto mb-1" />
              <p className="text-lg font-bold text-purple-800">{quickStats.studentsToday}</p>
              <p className="text-xs text-purple-700">Étudiants aujourd'hui</p>
            </div>
            <div className="text-center p-3 bg-amber-50 rounded-lg border border-amber-200">
              <Calendar className="h-6 w-6 text-amber-600 mx-auto mb-1" />
              <p className="text-lg font-bold text-amber-800">{quickStats.absenceRequests}</p>
              <p className="text-xs text-amber-700">Demandes d'absence</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
              <MessageSquare className="h-6 w-6 text-green-600 mx-auto mb-1" />
              <p className="text-lg font-bold text-green-800">{quickStats.unreadMessages}</p>
              <p className="text-xs text-green-700">Messages non lus</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Planning d'aujourd'hui */}
        <Card className="border-blue-200">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Calendar className="h-5 w-5" />
              Planning d'Aujourd'hui
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              {todaySchedule.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-center">
                      <div className="text-sm font-medium text-blue-600">{item.time}</div>
                    </div>
                    <div>
                      <h4 className="font-medium">{item.course}</h4>
                      <p className="text-sm text-gray-600">{item.room} • {item.students} étudiants</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    <Clock className="h-3 w-3 mr-1" />
                    1h30
                  </Badge>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4 border-blue-200">
              Voir le planning complet
            </Button>
          </CardContent>
        </Card>

        {/* Charge pédagogique */}
        <Card className="border-green-200">
          <CardHeader className="bg-gradient-to-r from-green-50 to-green-100">
            <CardTitle className="flex items-center gap-2 text-green-800">
              <BarChart3 className="h-5 w-5" />
              Charge Pédagogique
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progression annuelle</span>
                <span className="text-sm text-gray-500">
                  {quickStats.totalHours}h / {quickStats.maxHours}h
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-green-600 h-3 rounded-full transition-all duration-500" 
                  style={{ width: `${(quickStats.totalHours / quickStats.maxHours) * 100}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-500">0h</span>
                <span className="text-sm font-medium text-green-600">
                  {((quickStats.totalHours / quickStats.maxHours) * 100).toFixed(1)}%
                </span>
                <span className="text-xs text-gray-500">{quickStats.maxHours}h</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                <span className="text-sm">Cours Magistraux</span>
                <Badge variant="outline">45h</Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                <span className="text-sm">Travaux Dirigés</span>
                <Badge variant="outline">67.5h</Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-purple-50 rounded">
                <span className="text-sm">Travaux Pratiques</span>
                <Badge variant="outline">22.5h</Badge>
              </div>
            </div>

            <Button variant="outline" className="w-full mt-4 border-green-200">
              Gérer mes charges
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications récentes */}
        <Card className="border-purple-200">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100">
            <CardTitle className="flex items-center gap-2 text-purple-800">
              <Bell className="h-5 w-5" />
              Notifications Récentes
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              {recentNotifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-3 border rounded-lg ${getPriorityColor(notification.priority)}`}
                >
                  <div className="flex items-start gap-3">
                    {getTypeIcon(notification.type)}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4 border-purple-200">
              Voir toutes les notifications
            </Button>
          </CardContent>
        </Card>

        {/* Actions rapides */}
        <Card className="border-amber-200">
          <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100">
            <CardTitle className="flex items-center gap-2 text-amber-800">
              <CheckCircle className="h-5 w-5" />
              Actions Rapides
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-20 flex flex-col gap-2 border-blue-200">
                <Calendar className="h-6 w-6 text-blue-600" />
                <span className="text-sm">Demande d'absence</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2 border-green-200">
                <MessageSquare className="h-6 w-6 text-green-600" />
                <span className="text-sm">Nouveau message</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2 border-purple-200">
                <FileQuestion className="h-6 w-6 text-purple-600" />
                <span className="text-sm">Créer questionnaire</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2 border-amber-200">
                <BarChart3 className="h-6 w-6 text-amber-600" />
                <span className="text-sm">Voir charges</span>
              </Button>
            </div>

            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">Rappel</span>
              </div>
              <p className="text-sm text-yellow-700 mt-1">
                Saisie des notes CC2 avant le 15 juillet
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
