
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Calendar, MapPin, Users, Clock, Building, DollarSign, FileText, CheckCircle } from "lucide-react";
import { useState } from "react";

export const ResourceManagement = () => {
  const [selectedWeek, setSelectedWeek] = useState("2024-W03");

  const roomData = [
    { name: "Amphi A", capacity: 200, type: "Amphithéâtre", occupation: 75, status: "available" },
    { name: "Amphi B", capacity: 180, type: "Amphithéâtre", occupation: 90, status: "busy" },
    { name: "Salle 101", capacity: 40, type: "TD", occupation: 60, status: "available" },
    { name: "Salle 102", capacity: 40, type: "TD", occupation: 85, status: "maintenance" },
    { name: "Lab Info 1", capacity: 30, type: "Informatique", occupation: 95, status: "busy" },
    { name: "Lab Info 2", capacity: 30, type: "Informatique", occupation: 70, status: "available" }
  ];

  const vacationData = [
    { name: "Dr. Martin", matiere: "Économétrie", heures: 24, tarif: 35, total: 840, status: "approved" },
    { name: "Mme. Dubois", matiere: "Comptabilité", heures: 18, tarif: 32, total: 576, status: "pending" },
    { name: "M. Bernard", matiere: "Marketing", heures: 30, tarif: 38, total: 1140, status: "approved" },
    { name: "Dr. Rousseau", matiere: "Finance", heures: 20, tarif: 40, total: 800, status: "review" }
  ];

  const examSchedule = [
    { date: "2024-01-15", time: "08:00-10:00", matiere: "Microéconomie", niveau: "L2", salle: "Amphi A", surveillants: 3, status: "confirmed" },
    { date: "2024-01-15", time: "14:00-16:00", matiere: "Comptabilité", niveau: "L1", salle: "Salle 101", surveillants: 2, status: "confirmed" },
    { date: "2024-01-16", time: "08:00-10:00", matiere: "Statistiques", niveau: "L3", salle: "Amphi B", surveillants: 3, status: "pending" },
    { date: "2024-01-16", time: "10:30-12:30", matiere: "Gestion RH", niveau: "M1", salle: "Salle 102", surveillants: 2, status: "pending" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available": return "bg-green-100 text-green-800 border-green-200";
      case "busy": return "bg-red-100 text-red-800 border-red-200";
      case "maintenance": return "bg-amber-100 text-amber-800 border-amber-200";
      case "approved": return "bg-green-100 text-green-800 border-green-200";
      case "pending": return "bg-amber-100 text-amber-800 border-amber-200";
      case "review": return "bg-blue-100 text-blue-800 border-blue-200";
      case "confirmed": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "available": return "Disponible";
      case "busy": return "Occupée";
      case "maintenance": return "Maintenance";
      case "approved": return "Approuvé";
      case "pending": return "En attente";
      case "review": return "En révision";
      case "confirmed": return "Confirmé";
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="rooms" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="rooms">Gestion des Salles</TabsTrigger>
          <TabsTrigger value="vacations">Vacations</TabsTrigger>
          <TabsTrigger value="exams">Planification Examens</TabsTrigger>
        </TabsList>

        <TabsContent value="rooms" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Répartition des Salles et Équipements
              </CardTitle>
              <CardDescription>
                État d'occupation et disponibilité des espaces
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 flex gap-4">
                <Input
                  type="week"
                  value={selectedWeek}
                  onChange={(e) => setSelectedWeek(e.target.value)}
                  className="w-48"
                />
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Nouvelle réservation
                </Button>
                <Button variant="outline">
                  Export planning
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {roomData.map((room, index) => (
                  <Card key={index} className="border-slate-200">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-slate-800">{room.name}</h3>
                          <p className="text-sm text-slate-600">{room.type}</p>
                          <p className="text-xs text-slate-500">Capacité: {room.capacity} places</p>
                        </div>
                        <Badge className={getStatusColor(room.status)}>
                          {getStatusText(room.status)}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Occupation</span>
                          <span>{room.occupation}%</span>
                        </div>
                        <Progress value={room.occupation} className="h-2" />
                      </div>

                      <div className="mt-4 flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          Planning
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          Réserver
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Room utilization summary */}
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="p-4 text-center">
                    <MapPin className="h-6 w-6 text-green-600 mx-auto mb-2" />
                    <p className="text-lg font-bold text-green-800">12</p>
                    <p className="text-sm text-green-600">Salles disponibles</p>
                  </CardContent>
                </Card>
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="p-4 text-center">
                    <Clock className="h-6 w-6 text-red-600 mx-auto mb-2" />
                    <p className="text-lg font-bold text-red-800">8</p>
                    <p className="text-sm text-red-600">Salles occupées</p>
                  </CardContent>
                </Card>
                <Card className="border-amber-200 bg-amber-50">
                  <CardContent className="p-4 text-center">
                    <Building className="h-6 w-6 text-amber-600 mx-auto mb-2" />
                    <p className="text-lg font-bold text-amber-800">2</p>
                    <p className="text-sm text-amber-600">En maintenance</p>
                  </CardContent>
                </Card>
                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="p-4 text-center">
                    <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-lg font-bold text-blue-800">78%</p>
                    <p className="text-sm text-blue-600">Taux d'occupation</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vacations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Gestion des Vacations
              </CardTitle>
              <CardDescription>
                Attribution et suivi des charges d'enseignement vacataires
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <Button className="bg-green-600 hover:bg-green-700">
                  Nouvelle vacation
                </Button>
                <Button variant="outline">
                  Approuver en lot
                </Button>
                <Button variant="outline">
                  Export paie
                </Button>
              </div>

              <div className="space-y-4">
                {vacationData.map((vacation, index) => (
                  <Card key={index} className="border-slate-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-800">{vacation.name}</h3>
                          <p className="text-sm text-slate-600">{vacation.matiere}</p>
                          <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-slate-500">Heures: </span>
                              <span className="font-medium">{vacation.heures}h</span>
                            </div>
                            <div>
                              <span className="text-slate-500">Tarif: </span>
                              <span className="font-medium">{vacation.tarif}€/h</span>
                            </div>
                            <div>
                              <span className="text-slate-500">Total: </span>
                              <span className="font-bold text-green-600">{vacation.total}€</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge className={getStatusColor(vacation.status)}>
                            {getStatusText(vacation.status)}
                          </Badge>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline">
                              Modifier
                            </Button>
                            {vacation.status === "pending" && (
                              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                Approuver
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Vacation summary */}
              <div className="mt-6 grid grid-cols-3 gap-4">
                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="p-4 text-center">
                    <FileText className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-lg font-bold text-blue-800">24</p>
                    <p className="text-sm text-blue-600">Vacations actives</p>
                  </CardContent>
                </Card>
                <Card className="border-amber-200 bg-amber-50">
                  <CardContent className="p-4 text-center">
                    <Clock className="h-6 w-6 text-amber-600 mx-auto mb-2" />
                    <p className="text-lg font-bold text-amber-800">6</p>
                    <p className="text-sm text-amber-600">En attente validation</p>
                  </CardContent>
                </Card>
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="p-4 text-center">
                    <DollarSign className="h-6 w-6 text-green-600 mx-auto mb-2" />
                    <p className="text-lg font-bold text-green-800">28,450€</p>
                    <p className="text-sm text-green-600">Budget mensuel</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exams" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Planification des Examens
              </CardTitle>
              <CardDescription>
                Organisation et coordination des sessions d'examens
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Nouvel examen
                </Button>
                <Button variant="outline">
                  Importer planning
                </Button>
                <Button variant="outline">
                  Assigner surveillants
                </Button>
              </div>

              <div className="space-y-4">
                {examSchedule.map((exam, index) => (
                  <Card key={index} className="border-slate-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-2">
                            <h3 className="font-semibold text-slate-800">{exam.matiere}</h3>
                            <Badge variant="outline">{exam.niveau}</Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-slate-500">Date: </span>
                              <span className="font-medium">
                                {new Date(exam.date).toLocaleDateString('fr-FR')}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-500">Horaire: </span>
                              <span className="font-medium">{exam.time}</span>
                            </div>
                            <div>
                              <span className="text-slate-500">Salle: </span>
                              <span className="font-medium">{exam.salle}</span>
                            </div>
                            <div>
                              <span className="text-slate-500">Surveillants: </span>
                              <span className="font-medium">{exam.surveillants}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge className={getStatusColor(exam.status)}>
                            {getStatusText(exam.status)}
                          </Badge>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline">
                              Modifier
                            </Button>
                            {exam.status === "pending" && (
                              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                Confirmer
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Exam planning summary */}
              <div className="mt-6 grid grid-cols-4 gap-4">
                <Card className="border-purple-200 bg-purple-50">
                  <CardContent className="p-4 text-center">
                    <Calendar className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                    <p className="text-lg font-bold text-purple-800">48</p>
                    <p className="text-sm text-purple-600">Examens planifiés</p>
                  </CardContent>
                </Card>
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="p-4 text-center">
                    <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
                    <p className="text-lg font-bold text-green-800">32</p>
                    <p className="text-sm text-green-600">Confirmés</p>
                  </CardContent>
                </Card>
                <Card className="border-amber-200 bg-amber-50">
                  <CardContent className="p-4 text-center">
                    <Clock className="h-6 w-6 text-amber-600 mx-auto mb-2" />
                    <p className="text-lg font-bold text-amber-800">16</p>
                    <p className="text-sm text-amber-600">En attente</p>
                  </CardContent>
                </Card>
                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="p-4 text-center">
                    <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-lg font-bold text-blue-800">84</p>
                    <p className="text-sm text-blue-600">Surveillants requis</p>
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
