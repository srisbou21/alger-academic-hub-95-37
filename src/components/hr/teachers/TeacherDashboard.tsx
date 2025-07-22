import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  GraduationCap, 
  TrendingUp, 
  Clock,
  UserCheck,
  UserX,
  Calendar,
  AlertTriangle,
  BarChart3,
  PieChart
} from "lucide-react";

export const TeacherDashboard = () => {
  // Mock data pour les statistiques
  const stats = {
    totalTeachers: 150,
    activeTeachers: 142,
    inactiveTeachers: 8,
    externalTeachers: 25,
    averageAge: 42,
    averageExperience: 12,
    promotionsPending: 15,
    absencesToday: 8
  };

  const gradeDistribution = [
    { grade: "Professeur", count: 28, percentage: 18.7, color: "bg-purple-500" },
    { grade: "Maître de Conférences A", count: 45, percentage: 30.0, color: "bg-blue-500" },
    { grade: "Maître de Conférences B", count: 35, percentage: 23.3, color: "bg-blue-400" },
    { grade: "Maître Assistant A", count: 25, percentage: 16.7, color: "bg-green-500" },
    { grade: "Maître Assistant B", count: 12, percentage: 8.0, color: "bg-green-400" },
    { grade: "Assistant", count: 5, percentage: 3.3, color: "bg-yellow-500" }
  ];

  const workloadStats = [
    { department: "Informatique", totalHours: 320, averageHours: 12.8, overloaded: 3 },
    { department: "Mathématiques", totalHours: 280, averageHours: 14.0, overloaded: 1 },
    { department: "Physique", totalHours: 256, averageHours: 11.6, overloaded: 2 },
    { department: "Chimie", totalHours: 224, averageHours: 13.2, overloaded: 0 }
  ];

  const recentActivities = [
    { type: "promotion", message: "Dr. Ahmed Benali promu au grade de Professeur", time: "Il y a 2 heures" },
    { type: "absence", message: "5 enseignants absents aujourd'hui", time: "Il y a 3 heures" },
    { type: "recruitment", message: "Nouveau recrutement: Dr. Fatima Kader", time: "Il y a 1 jour" },
    { type: "training", message: "Formation pédagogique programmée pour 20 enseignants", time: "Il y a 2 jours" }
  ];

  return (
    <div className="space-y-6">
      {/* Vue d'ensemble */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Enseignants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTeachers}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12</span> depuis le mois dernier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enseignants Actifs</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activeTeachers}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.activeTeachers / stats.totalTeachers) * 100).toFixed(1)}% du total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promotions en attente</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.promotionsPending}</div>
            <p className="text-xs text-muted-foreground">
              À traiter ce mois
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absences Aujourd'hui</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.absencesToday}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.absencesToday / stats.totalTeachers) * 100).toFixed(1)}% du personnel
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Répartition par grades et charge de travail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Répartition par grades */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Répartition par Grades
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {gradeDistribution.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{item.grade}</span>
                  <span className="text-muted-foreground">{item.count} ({item.percentage}%)</span>
                </div>
                <div className="relative">
                  <Progress value={item.percentage} className="h-2" />
                  <div 
                    className={`absolute top-0 left-0 h-2 rounded-full ${item.color}`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Charge de travail par département */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Charge de Travail par Département
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {workloadStats.map((dept, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{dept.department}</span>
                  <div className="text-right">
                    <div className="text-sm font-semibold">{dept.averageHours}h/sem</div>
                    <div className="text-xs text-muted-foreground">{dept.totalHours}h total</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={(dept.averageHours / 16) * 100} className="flex-1 h-2" />
                  {dept.overloaded > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {dept.overloaded} surchargés
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Activités récentes et alertes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activités récentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Activités Récentes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className={`p-2 rounded-full ${
                  activity.type === 'promotion' ? 'bg-green-100 text-green-600' :
                  activity.type === 'absence' ? 'bg-red-100 text-red-600' :
                  activity.type === 'recruitment' ? 'bg-blue-100 text-blue-600' :
                  'bg-yellow-100 text-yellow-600'
                }`}>
                  {activity.type === 'promotion' && <TrendingUp className="h-4 w-4" />}
                  {activity.type === 'absence' && <UserX className="h-4 w-4" />}
                  {activity.type === 'recruitment' && <UserCheck className="h-4 w-4" />}
                  {activity.type === 'training' && <GraduationCap className="h-4 w-4" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.message}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Alertes et notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Alertes et Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 border border-orange-200 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <span className="font-medium text-orange-800 dark:text-orange-200">Promotions à traiter</span>
              </div>
              <p className="text-sm text-orange-700 dark:text-orange-300">
                15 dossiers de promotion nécessitent votre attention
              </p>
            </div>

            <div className="p-3 border border-red-200 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-red-600" />
                <span className="font-medium text-red-800 dark:text-red-200">Surcharge de travail</span>
              </div>
              <p className="text-sm text-red-700 dark:text-red-300">
                6 enseignants dépassent la charge horaire recommandée
              </p>
            </div>

            <div className="p-3 border border-blue-200 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-800 dark:text-blue-200">Formation à venir</span>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Session de formation pédagogique programmée le 15 mars
              </p>
            </div>

            <div className="p-3 border border-green-200 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <UserCheck className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-800 dark:text-green-200">Nouveau recrutement</span>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300">
                Intégration de 3 nouveaux enseignants cette semaine
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};