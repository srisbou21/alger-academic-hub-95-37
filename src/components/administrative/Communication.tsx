
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Megaphone, Bell, Users, Send, Archive } from "lucide-react";
import { AnnouncementSystem } from "./AnnouncementSystem";
import { IntegratedMessaging } from "./IntegratedMessaging";
import { NotificationCenter } from "./NotificationCenter";

export const Communication = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Module Communication</h2>
          <p className="text-slate-600">Gestion des annonces, messages et notifications</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Bell className="h-3 w-3 mr-1" />
            12 notifications
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <MessageSquare className="h-3 w-3 mr-1" />
            Système actif
          </Badge>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Annonces Actives</p>
                <p className="text-2xl font-bold text-blue-800">15</p>
              </div>
              <Megaphone className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Messages Envoyés</p>
                <p className="text-2xl font-bold text-green-800">247</p>
              </div>
              <Send className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Utilisateurs Actifs</p>
                <p className="text-2xl font-bold text-purple-800">1,247</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-600 text-sm font-medium">Taux de Lecture</p>
                <p className="text-2xl font-bold text-amber-800">89%</p>
              </div>
              <Archive className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="announcements" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6 bg-white shadow-sm border border-slate-200">
          <TabsTrigger 
            value="announcements"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            <Megaphone className="h-4 w-4 mr-2" />
            Système d'Annonces
          </TabsTrigger>
          <TabsTrigger 
            value="messaging"
            className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Messagerie Intégrée
          </TabsTrigger>
          <TabsTrigger 
            value="notifications"
            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
          >
            <Bell className="h-4 w-4 mr-2" />
            Centre de Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="announcements" className="space-y-6">
          <AnnouncementSystem />
        </TabsContent>

        <TabsContent value="messaging" className="space-y-6">
          <IntegratedMessaging />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <NotificationCenter />
        </TabsContent>
      </Tabs>
    </div>
  );
};
