
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, MessageSquare, Settings, Users, BarChart3, Archive } from "lucide-react";
import { OfficialDocuments } from "./OfficialDocuments";
import { Communication } from "./Communication";

export const AdministrativeServices = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Services Administratifs</h2>
          <p className="text-slate-600">Gestion documentaire et communication institutionnelle</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Services actifs
          </Badge>
        </div>
      </div>

      {/* Tableau de bord des services */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Documents Générés</p>
                <p className="text-3xl font-bold text-blue-800">1,247</p>
                <p className="text-xs text-blue-500">+15% ce mois</p>
              </div>
              <FileText className="h-10 w-10 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Messages Échangés</p>
                <p className="text-3xl font-bold text-green-800">3,456</p>
                <p className="text-xs text-green-500">Cette semaine</p>
              </div>
              <MessageSquare className="h-10 w-10 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Utilisateurs Actifs</p>
                <p className="text-3xl font-bold text-purple-800">4,892</p>
                <p className="text-xs text-purple-500">Connectés</p>
              </div>
              <Users className="h-10 w-10 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="documents" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8 bg-white shadow-sm border border-slate-200">
          <TabsTrigger 
            value="documents"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            <FileText className="h-4 w-4 mr-2" />
            Documents Officiels
          </TabsTrigger>
          <TabsTrigger 
            value="communication"
            className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Communication
          </TabsTrigger>
          <TabsTrigger 
            value="analytics"
            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytiques
          </TabsTrigger>
          <TabsTrigger 
            value="settings"
            className="data-[state=active]:bg-slate-600 data-[state=active]:text-white"
          >
            <Settings className="h-4 w-4 mr-2" />
            Configuration
          </TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-6">
          <OfficialDocuments />
        </TabsContent>

        <TabsContent value="communication" className="space-y-6">
          <Communication />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analytiques et Rapports</CardTitle>
              <CardDescription>Statistiques d'utilisation des services administratifs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-lg">Génération de Documents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Attestations de scolarité</span>
                        <Badge>847</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Relevés de notes</span>
                        <Badge>234</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Conventions de stage</span>
                        <Badge>156</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-green-200">
                  <CardHeader>
                    <CardTitle className="text-lg">Activité Communication</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Annonces publiées</span>
                        <Badge>15</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Messages échangés</span>
                        <Badge>3,456</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Notifications envoyées</span>
                        <Badge>12,847</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuration des Services</CardTitle>
              <CardDescription>Paramètres généraux et personnalisation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-lg">Templates de Documents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600 mb-4">
                      Gestion des modèles de documents officiels
                    </p>
                    <Button variant="outline" className="w-full">
                      <Settings className="h-4 w-4 mr-2" />
                      Configurer les Templates
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-lg">Paramètres Communication</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600 mb-4">
                      Configuration des canaux de communication
                    </p>
                    <Button variant="outline" className="w-full">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Gérer les Canaux
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
