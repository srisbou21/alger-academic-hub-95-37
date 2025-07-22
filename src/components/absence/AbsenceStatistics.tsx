
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, Calendar, Download, Users, Clock, AlertTriangle } from "lucide-react";
import { useState } from "react";

export const AbsenceStatistics = () => {
  const [period, setPeriod] = useState("month");
  const [department, setDepartment] = useState("all");

  const departments = ["Tous", "Économie", "Gestion", "Mathématiques", "Informatique"];
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Statistiques des Absences</h2>
          <p className="text-slate-600">Analyse et rapports détaillés</p>
        </div>
        <div className="flex gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Cette semaine</SelectItem>
              <SelectItem value="month">Ce mois</SelectItem>
              <SelectItem value="semester">Ce semestre</SelectItem>
              <SelectItem value="year">Cette année</SelectItem>
            </SelectContent>
          </Select>
          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept.toLowerCase()}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Total Absences</p>
                <p className="text-2xl font-bold text-blue-800">47</p>
                <p className="text-xs text-blue-500">+12% vs mois dernier</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Taux d'Approbation</p>
                <p className="text-2xl font-bold text-green-800">94%</p>
                <p className="text-xs text-green-500">+2% vs mois dernier</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-600 text-sm font-medium">Cours Affectés</p>
                <p className="text-2xl font-bold text-amber-800">128</p>
                <p className="text-xs text-amber-500">-5% vs mois dernier</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Temps Moyen</p>
                <p className="text-2xl font-bold text-purple-800">2.4h</p>
                <p className="text-xs text-purple-500">Traitement demande</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique des absences par motif */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Absences par Motif
            </CardTitle>
            <CardDescription>Répartition des motifs d'absence</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Maladie</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-slate-200 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: "45%" }}></div>
                  </div>
                  <span className="text-sm text-slate-600">21</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Formation</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-slate-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: "30%" }}></div>
                  </div>
                  <span className="text-sm text-slate-600">14</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Congé Personnel</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-slate-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: "20%" }}></div>
                  </div>
                  <span className="text-sm text-slate-600">9</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Mission</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-slate-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: "15%" }}></div>
                  </div>
                  <span className="text-sm text-slate-600">7</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Autres</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-slate-200 rounded-full h-2">
                    <div className="bg-amber-500 h-2 rounded-full" style={{ width: "10%" }}></div>
                  </div>
                  <span className="text-sm text-slate-600">3</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top enseignants par absences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Enseignants - Absences Fréquentes
            </CardTitle>
            <CardDescription>Suivi individuel des absences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                <div>
                  <p className="font-medium text-red-800">Dr. Sarah Benali</p>
                  <p className="text-sm text-red-600">Département Économie</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-red-800">8</p>
                  <p className="text-xs text-red-600">absences</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div>
                  <p className="font-medium text-amber-800">Prof. Karim Meziani</p>
                  <p className="text-sm text-amber-600">Département Gestion</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-amber-800">6</p>
                  <p className="text-xs text-amber-600">absences</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div>
                  <p className="font-medium text-blue-800">Dr. Fatima Ouali</p>
                  <p className="text-sm text-blue-600">Département Économie</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-800">4</p>
                  <p className="text-xs text-blue-600">absences</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div>
                  <p className="font-medium text-green-800">Prof. Yacine Mansouri</p>
                  <p className="text-sm text-green-600">Département Mathématiques</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-800">2</p>
                  <p className="text-xs text-green-600">absences</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Évolution temporelle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Évolution des Absences
          </CardTitle>
          <CardDescription>Tendances sur la période sélectionnée</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-slate-400 mx-auto mb-2" />
              <p className="text-slate-600">Graphique d'évolution temporelle</p>
              <p className="text-sm text-slate-500">Intégration avec bibliothèque de graphiques</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rapports et exports */}
      <Card>
        <CardHeader>
          <CardTitle>Rapports et Exports</CardTitle>
          <CardDescription>Génération de rapports personnalisés</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-16 flex-col">
              <Download className="h-6 w-6 mb-1" />
              <span>Rapport Mensuel</span>
            </Button>
            
            <Button variant="outline" className="h-16 flex-col">
              <Calendar className="h-6 w-6 mb-1" />
              <span>Planning Absences</span>
            </Button>
            
            <Button variant="outline" className="h-16 flex-col">
              <Users className="h-6 w-6 mb-1" />
              <span>Rapport Individuel</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
