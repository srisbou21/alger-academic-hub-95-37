
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, Users, MapPin, Cpu, CheckCircle2, AlertTriangle } from "lucide-react";
import { useState } from "react";

interface TeacherConstraint {
  id: string;
  name: string;
  availableDays: string[];
  availableHours: string[];
  maxHoursPerDay: number;
  subjects: string[];
}

interface RoomConstraint {
  id: string;
  name: string;
  capacity: number;
  equipment: string[];
  type: "amphi" | "td" | "lab" | "conference";
  availability: string[];
}

interface ScheduleItem {
  id: string;
  subject: string;
  teacher: string;
  room: string;
  day: string;
  time: string;
  duration: number;
  students: number;
  type: "cours" | "td" | "tp";
}

export const ScheduleGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [selectedSemester, setSelectedSemester] = useState("S1");
  const [selectedLevel, setSelectedLevel] = useState("L1");
  const [optimizationStatus, setOptimizationStatus] = useState<"idle" | "running" | "success" | "warning">("idle");

  const teacherConstraints: TeacherConstraint[] = [
    {
      id: "prof1",
      name: "Dr. Martin",
      availableDays: ["lundi", "mardi", "mercredi", "jeudi"],
      availableHours: ["08:00-12:00", "14:00-18:00"],
      maxHoursPerDay: 6,
      subjects: ["Microéconomie", "Macroéconomie"]
    },
    {
      id: "prof2",
      name: "Mme. Dubois",
      availableDays: ["mardi", "mercredi", "jeudi", "vendredi"],
      availableHours: ["09:00-17:00"],
      maxHoursPerDay: 8,
      subjects: ["Comptabilité", "Finance"]
    }
  ];

  const roomConstraints: RoomConstraint[] = [
    {
      id: "amphi-a",
      name: "Amphithéâtre A",
      capacity: 200,
      equipment: ["projecteur", "micro", "tableau"],
      type: "amphi",
      availability: ["lundi-vendredi: 08:00-18:00"]
    },
    {
      id: "lab-info1",
      name: "Laboratoire Info 1",
      capacity: 30,
      equipment: ["ordinateurs", "projecteur", "réseau"],
      type: "lab",
      availability: ["lundi-vendredi: 08:00-17:00"]
    }
  ];

  const generatedSchedule: ScheduleItem[] = [
    {
      id: "1",
      subject: "Microéconomie",
      teacher: "Dr. Martin",
      room: "Amphithéâtre A",
      day: "Lundi",
      time: "08:30-10:00",
      duration: 90,
      students: 120,
      type: "cours"
    },
    {
      id: "2",
      subject: "Comptabilité",
      teacher: "Mme. Dubois",
      room: "Salle 201",
      day: "Mardi",
      time: "14:00-15:30",
      duration: 90,
      students: 45,
      type: "td"
    }
  ];

  const handleGenerateSchedule = async () => {
    setIsGenerating(true);
    setOptimizationStatus("running");
    setGenerationProgress(0);

    // Simulation de l'algorithme d'optimisation
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setGenerationProgress(i);
    }

    setOptimizationStatus("success");
    setIsGenerating(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running": return "bg-blue-100 text-blue-800 border-blue-200";
      case "success": return "bg-green-100 text-green-800 border-green-200";
      case "warning": return "bg-amber-100 text-amber-800 border-amber-200";
      default: return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Configuration Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="h-5 w-5" />
            Génération Automatique d'Emplois du Temps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Niveau</label>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le niveau" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="L1">Licence 1</SelectItem>
                  <SelectItem value="L2">Licence 2</SelectItem>
                  <SelectItem value="L3">Licence 3</SelectItem>
                  <SelectItem value="M1">Master 1</SelectItem>
                  <SelectItem value="M2">Master 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Semestre</label>
              <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le semestre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="S1">Semestre 1</SelectItem>
                  <SelectItem value="S2">Semestre 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Année Académique</label>
              <Input type="text" value="2024-2025" readOnly />
            </div>
          </div>

          <div className="flex gap-4 mb-6">
            <Button 
              onClick={handleGenerateSchedule} 
              disabled={isGenerating}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isGenerating ? (
                <>
                  <Cpu className="mr-2 h-4 w-4 animate-spin" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <Cpu className="mr-2 h-4 w-4" />
                  Générer Emploi du Temps
                </>
              )}
            </Button>
            <Button variant="outline">
              Paramètres d'optimisation
            </Button>
            <Button variant="outline">
              Contraintes avancées
            </Button>
          </div>

          {isGenerating && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Optimisation en cours...</span>
                <span>{generationProgress}%</span>
              </div>
              <Progress value={generationProgress} className="h-2" />
            </div>
          )}

          {optimizationStatus !== "idle" && (
            <div className="mt-4">
              <Badge className={getStatusColor(optimizationStatus)}>
                {optimizationStatus === "running" && "Algorithme en cours"}
                {optimizationStatus === "success" && "Optimisation réussie"}
                {optimizationStatus === "warning" && "Optimisation avec conflits"}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Constraints Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Contraintes Enseignants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {teacherConstraints.map((teacher) => (
                <div key={teacher.id} className="p-3 border border-slate-200 rounded-lg">
                  <h4 className="font-medium text-slate-800">{teacher.name}</h4>
                  <div className="text-sm text-slate-600 mt-1">
                    <p>Disponible: {teacher.availableDays.join(", ")}</p>
                    <p>Max: {teacher.maxHoursPerDay}h/jour</p>
                    <p>Matières: {teacher.subjects.join(", ")}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Contraintes Salles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {roomConstraints.map((room) => (
                <div key={room.id} className="p-3 border border-slate-200 rounded-lg">
                  <h4 className="font-medium text-slate-800">{room.name}</h4>
                  <div className="text-sm text-slate-600 mt-1">
                    <p>Capacité: {room.capacity} places</p>
                    <p>Type: {room.type}</p>
                    <p>Équipements: {room.equipment.join(", ")}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Generated Schedule */}
      {optimizationStatus === "success" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Emploi du Temps Généré - {selectedLevel} {selectedSemester}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {generatedSchedule.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="text-sm font-mono text-green-700 bg-green-200 px-3 py-1 rounded">
                      {item.day}
                    </div>
                    <div className="text-sm font-mono text-green-600">
                      {item.time}
                    </div>
                    <Badge variant="outline">{item.type}</Badge>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-slate-800">{item.subject}</p>
                    <p className="text-sm text-slate-500">{item.teacher} • {item.room}</p>
                    <p className="text-xs text-slate-400">{item.students} étudiants</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex gap-4">
              <Button className="bg-green-600 hover:bg-green-700">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Valider et Publier
              </Button>
              <Button variant="outline">
                Ajustements manuels
              </Button>
              <Button variant="outline">
                Export PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Optimization Statistics */}
      {optimizationStatus === "success" && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4 text-center">
              <CheckCircle2 className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <p className="text-lg font-bold text-green-800">98%</p>
              <p className="text-sm text-green-600">Contraintes respectées</p>
            </CardContent>
          </Card>
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4 text-center">
              <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <p className="text-lg font-bold text-blue-800">0</p>
              <p className="text-sm text-blue-600">Conflits horaires</p>
            </CardContent>
          </Card>
          <Card className="border-purple-200 bg-purple-50">
            <CardContent className="p-4 text-center">
              <Users className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <p className="text-lg font-bold text-purple-800">85%</p>
              <p className="text-sm text-purple-600">Charge équilibrée</p>
            </CardContent>
          </Card>
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-4 text-center">
              <MapPin className="h-6 w-6 text-amber-600 mx-auto mb-2" />
              <p className="text-lg font-bold text-amber-800">92%</p>
              <p className="text-sm text-amber-600">Utilisation salles</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
