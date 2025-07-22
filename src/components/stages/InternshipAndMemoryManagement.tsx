
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building2, BookOpen, Calendar, Users, FileText, 
  BarChart3, CheckCircle, Clock, AlertTriangle
} from "lucide-react";
import { CompanyDatabase } from "./CompanyDatabase";
import { MemorySupervision } from "./MemorySupervision";
import { DefenseManagement } from "./DefenseManagement";

export const InternshipAndMemoryManagement = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Gestion des Stages et Mémoires</h2>
          <p className="text-slate-600">Module complet de suivi des stages et projets de fin d'études</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Building2 className="h-3 w-3 mr-1" />
            Système intégré
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Opérationnel
          </Badge>
        </div>
      </div>

      {/* Tableau de bord général */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Stages Actifs</p>
                <p className="text-3xl font-bold text-blue-800">24</p>
                <p className="text-xs text-blue-500">+12% ce mois</p>
              </div>
              <Building2 className="h-10 w-10 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Mémoires Encadrés</p>
                <p className="text-3xl font-bold text-purple-800">18</p>
                <p className="text-xs text-purple-500">Tous niveaux</p>
              </div>
              <BookOpen className="h-10 w-10 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Soutenances Programmées</p>
                <p className="text-3xl font-bold text-green-800">8</p>
                <p className="text-xs text-green-500">Ce mois</p>
              </div>
              <Calendar className="h-10 w-10 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-600 text-sm font-medium">Entreprises Partenaires</p>
                <p className="text-3xl font-bold text-amber-800">45</p>
                <p className="text-xs text-amber-500">Actives</p>
              </div>
              <Users className="h-10 w-10 text-amber-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="companies" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8 bg-white shadow-sm border border-slate-200">
          <TabsTrigger 
            value="companies"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            <Building2 className="h-4 w-4 mr-2" />
            Base Entreprises
          </TabsTrigger>
          <TabsTrigger 
            value="supervision"
            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Encadrement Mémoires
          </TabsTrigger>
          <TabsTrigger 
            value="defenses"
            className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Gestion Soutenances
          </TabsTrigger>
        </TabsList>

        <TabsContent value="companies" className="space-y-6">
          <CompanyDatabase />
        </TabsContent>

        <TabsContent value="supervision" className="space-y-6">
          <MemorySupervision />
        </TabsContent>

        <TabsContent value="defenses" className="space-y-6">
          <DefenseManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};
