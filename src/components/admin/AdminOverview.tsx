
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, FileText, TrendingUp, AlertTriangle, Settings, Shield, UserCheck, Calendar } from "lucide-react";

export const AdminOverview = () => {
  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Étudiants Actifs</p>
                <p className="text-2xl font-bold text-blue-800">4,847</p>
                <p className="text-xs text-blue-500">+12% ce semestre</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Documents Générés</p>
                <p className="text-2xl font-bold text-green-800">1,247</p>
                <p className="text-xs text-green-500">Ce mois</p>
              </div>
              <FileText className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-600 text-sm font-medium">Demandes en Attente</p>
                <p className="text-2xl font-bold text-amber-800">23</p>
                <p className="text-xs text-amber-500">Validation requise</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Performance</p>
                <p className="text-2xl font-bold text-purple-800">98.5%</p>
                <p className="text-xs text-purple-500">Disponibilité système</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-6 w-6 text-blue-600" />
              Gestion des Années Universitaires
            </CardTitle>
            <CardDescription>
              Créez et gérez les années universitaires, importez des données
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              <Calendar className="h-4 w-4 mr-2" />
              Gérer les Années Universitaires
            </Button>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-purple-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-6 w-6 text-purple-600" />
              Gestion des Utilisateurs
            </CardTitle>
            <CardDescription>
              Créez et gérez les comptes utilisateurs, rôles et permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-purple-600 hover:bg-purple-700">
              <Users className="h-4 w-4 mr-2" />
              Gérer les Utilisateurs
            </Button>
          </CardContent>
        </Card>

        <Card className="border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-emerald-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-6 w-6 text-emerald-600" />
              Emplois du Temps
            </CardTitle>
            <CardDescription>
              Générez et gérez les emplois du temps automatiquement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
              <UserCheck className="h-4 w-4 mr-2" />
              Gérer les Emplois du Temps
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Activité Récente</CardTitle>
          <CardDescription>Actions importantes des dernières 24h</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium">Documents générés</p>
                <p className="text-sm text-slate-600">127 attestations de scolarité</p>
              </div>
              <Badge className="ml-auto">Aujourd'hui</Badge>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <Users className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium">Nouvelles inscriptions</p>
                <p className="text-sm text-slate-600">45 étudiants validés</p>
              </div>
              <Badge className="ml-auto">Aujourd'hui</Badge>
            </div>
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <Shield className="h-5 w-5 text-purple-600" />
              <div>
                <p className="font-medium">Nouveaux utilisateurs</p>
                <p className="text-sm text-slate-600">3 comptes créés</p>
              </div>
              <Badge className="ml-auto">Aujourd'hui</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Alertes Système</CardTitle>
          <CardDescription>Notifications importantes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border-l-4 border-amber-400">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <div>
                <p className="font-medium">Validation en attente</p>
                <p className="text-sm text-slate-600">23 documents nécessitent une validation</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
              <Settings className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium">Maintenance programmée</p>
                <p className="text-sm text-slate-600">Dimanche 16 juin à 02:00</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
