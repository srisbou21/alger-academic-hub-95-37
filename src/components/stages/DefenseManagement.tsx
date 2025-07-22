
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, MapPin, Plus, CheckCircle
} from "lucide-react";
import { useState } from "react";
import { DefenseStats } from "./defense/DefenseStats";
import { DefenseCard } from "./defense/DefenseCard";
import { CompletedDefensesTable } from "./defense/CompletedDefensesTable";
import { RoomsGrid } from "./defense/RoomsGrid";

export const DefenseManagement = () => {
  const [selectedTab, setSelectedTab] = useState("planning");

  const upcomingDefenses = [
    {
      id: "SOUT001",
      student: "Amina Benali",
      title: "Impact du commerce électronique sur l'économie algérienne",
      date: "2024-06-20",
      time: "09:00",
      duration: "45 min",
      room: "Amphi A",
      supervisor: "Prof. Mansouri",
      jury: [
        { name: "Prof. Mansouri", role: "Président", status: "confirmé" },
        { name: "Dr. Belkacem", role: "Examinateur", status: "confirmé" },
        { name: "Dr. Hamdani", role: "Invité", status: "en_attente" }
      ],
      status: "programmee",
      documents: ["Mémoire final", "Résumé", "Présentation"]
    },
    {
      id: "SOUT002",
      student: "Yacine Boudjedra",
      title: "Analyse de la performance financière des banques islamiques",
      date: "2024-06-25",
      time: "14:30",
      duration: "45 min", 
      room: "Salle 204",
      supervisor: "Prof. Mansouri",
      jury: [
        { name: "Prof. Mansouri", role: "Président", status: "confirmé" },
        { name: "Dr. Benaissa", role: "Examinateur", status: "confirmé" },
        { name: "Dr. Chekroun", role: "Invité", status: "confirmé" }
      ],
      status: "programmee",
      documents: ["Mémoire final", "Résumé"]
    }
  ];

  const completedDefenses = [
    {
      id: "SOUT003",
      student: "Fatima Zohra",
      title: "Marketing digital dans le secteur bancaire algérien",
      date: "2024-06-10",
      time: "10:00",
      room: "Amphi B",
      supervisor: "Dr. Benchikh",
      finalGrade: 16.5,
      mention: "Très Bien",
      jury: [
        { name: "Dr. Benchikh", role: "Président", grade: 17 },
        { name: "Prof. Mansouri", role: "Examinateur", grade: 16 },
        { name: "Dr. Belkacem", role: "Invité", grade: 16.5 }
      ],
      status: "termine"
    }
  ];

  const availableRooms = [
    { id: "AMPHI_A", name: "Amphi A", capacity: 150, equipment: ["Projecteur", "Micro", "Tableau"] },
    { id: "AMPHI_B", name: "Amphi B", capacity: 100, equipment: ["Projecteur", "Tableau"] },
    { id: "SALLE_204", name: "Salle 204", capacity: 50, equipment: ["Projecteur", "Tableau"] },
    { id: "SALLE_301", name: "Salle 301", capacity: 30, equipment: ["Projecteur"] }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "programmee": return "bg-blue-100 text-blue-800 border-blue-200";
      case "en_cours": return "bg-amber-100 text-amber-800 border-amber-200";
      case "termine": return "bg-green-100 text-green-800 border-green-200";
      case "reporte": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "programmee": return "Programmée";
      case "en_cours": return "En cours";
      case "termine": return "Terminée";
      case "reporte": return "Reportée";
      default: return status;
    }
  };

  const getJuryStatusColor = (status: string) => {
    switch (status) {
      case "confirmé": return "bg-green-100 text-green-800";
      case "en_attente": return "bg-amber-100 text-amber-800";
      case "refuse": return "bg-red-100 text-red-800";
      default: return "bg-slate-100 text-slate-800";
    }
  };

  const getMentionColor = (mention: string) => {
    switch (mention) {
      case "Excellent": return "bg-green-600 text-white";
      case "Très Bien": return "bg-blue-600 text-white";
      case "Bien": return "bg-purple-600 text-white";
      case "Assez Bien": return "bg-amber-600 text-white";
      default: return "bg-slate-600 text-white";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-slate-800">Gestion des Soutenances</h3>
          <p className="text-slate-600">Planification et suivi des soutenances de mémoires</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Programmer soutenance
          </Button>
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Planning global
          </Button>
        </div>
      </div>

      <DefenseStats
        upcomingCount={upcomingDefenses.length}
        completedCount={completedDefenses.length}
        availableRoomsCount={availableRooms.length}
        averageGrade={16.5}
      />

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="planning">
            <Calendar className="h-4 w-4 mr-2" />
            Planification
          </TabsTrigger>
          <TabsTrigger value="completed">
            <CheckCircle className="h-4 w-4 mr-2" />
            Terminées
          </TabsTrigger>
          <TabsTrigger value="rooms">
            <MapPin className="h-4 w-4 mr-2" />
            Salles
          </TabsTrigger>
        </TabsList>

        <TabsContent value="planning" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Soutenances Programmées</CardTitle>
              <CardDescription>Planning des prochaines soutenances</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingDefenses.map((defense) => (
                  <DefenseCard
                    key={defense.id}
                    defense={defense}
                    getStatusColor={getStatusColor}
                    getStatusText={getStatusText}
                    getJuryStatusColor={getJuryStatusColor}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Soutenances Terminées</CardTitle>
              <CardDescription>Historique et résultats</CardDescription>
            </CardHeader>
            <CardContent>
              <CompletedDefensesTable
                completedDefenses={completedDefenses}
                getMentionColor={getMentionColor}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rooms" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des Salles</CardTitle>
              <CardDescription>Réservation et disponibilité des espaces</CardDescription>
            </CardHeader>
            <CardContent>
              <RoomsGrid availableRooms={availableRooms} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
