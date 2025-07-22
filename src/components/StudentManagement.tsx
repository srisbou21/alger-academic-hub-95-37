
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Search, UserPlus, FileText, Filter, Download, Upload, Eye } from "lucide-react";
import { useState } from "react";
import { StudentRecord } from "./StudentRecord";
import { StudentForm } from "./StudentForm";

export const StudentManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

  const students = [
    {
      id: "ETU-2024-001",
      firstName: "Sarah",
      lastName: "Benhamou",
      email: "sarah.benhamou@univ-alger3.dz",
      phone: "0555-123-456",
      level: "L3",
      department: "Économie",
      status: "active",
      scholarship: true,
      photo: "/placeholder.svg",
      registrationDate: "2022-09-15",
      lastUpdate: "2024-06-10"
    },
    {
      id: "ETU-2024-002", 
      firstName: "Karim",
      lastName: "Meziane",
      email: "karim.meziane@univ-alger3.dz",
      phone: "0666-789-012",
      level: "M1",
      department: "Gestion",
      status: "active",
      scholarship: false,
      photo: "/placeholder.svg",
      registrationDate: "2023-09-10",
      lastUpdate: "2024-06-08"
    },
    {
      id: "ETU-2024-003",
      firstName: "Nadia",
      lastName: "Ouali",
      email: "nadia.ouali@univ-alger3.dz", 
      phone: "0777-345-678",
      level: "L2",
      department: "Commerce",
      status: "pending",
      scholarship: true,
      photo: "/placeholder.svg",
      registrationDate: "2024-06-05",
      lastUpdate: "2024-06-12"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 border-green-200";
      case "pending": return "bg-amber-100 text-amber-800 border-amber-200";
      case "suspended": return "bg-red-100 text-red-800 border-red-200";
      case "graduated": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active": return "Actif";
      case "pending": return "En attente";
      case "suspended": return "Suspendu";
      case "graduated": return "Diplômé";
      default: return "Inconnu";
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeFilter === "all") return matchesSearch;
    if (activeFilter === "scholarship") return matchesSearch && student.scholarship;
    if (activeFilter === "active") return matchesSearch && student.status === "active";
    if (activeFilter === "pending") return matchesSearch && student.status === "pending";
    
    return matchesSearch;
  });

  if (selectedStudent) {
    return <StudentRecord studentId={selectedStudent} onBack={() => setSelectedStudent(null)} />;
  }

  if (showForm) {
    return <StudentForm onBack={() => setShowForm(false)} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Gestion des Étudiants</h2>
          <p className="text-slate-600">Gestion complète des dossiers étudiants</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
          <UserPlus className="h-4 w-4 mr-2" />
          Nouveau dossier
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Total Étudiants</p>
                <p className="text-2xl font-bold text-blue-800">4,847</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Actifs</p>
                <p className="text-2xl font-bold text-green-800">4,623</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-600 text-sm font-medium">En attente</p>
                <p className="text-2xl font-bold text-amber-800">127</p>
              </div>
              <FileText className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Boursiers</p>
                <p className="text-2xl font-bold text-purple-800">1,234</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Recherche et Filtres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Rechercher par nom, prénom ou numéro..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtres avancés
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              variant={activeFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter("all")}
            >
              Tous
            </Button>
            <Button
              variant={activeFilter === "active" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter("active")}
            >
              Actifs
            </Button>
            <Button
              variant={activeFilter === "pending" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter("pending")}
            >
              En attente
            </Button>
            <Button
              variant={activeFilter === "scholarship" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter("scholarship")}
            >
              Boursiers
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Students List */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Étudiants ({filteredStudents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredStudents.map((student) => (
              <Card key={student.id} className="border-slate-200 hover:border-blue-300 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={student.photo} />
                        <AvatarFallback>{student.firstName[0]}{student.lastName[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-slate-800">
                          {student.firstName} {student.lastName}
                        </h3>
                        <p className="text-sm text-slate-600">{student.id}</p>
                        <p className="text-sm text-slate-500">
                          {student.level} {student.department} • {student.email}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <Badge className={getStatusColor(student.status)}>
                          {getStatusText(student.status)}
                        </Badge>
                        {student.scholarship && (
                          <Badge className="bg-blue-100 text-blue-800 border-blue-200 ml-1">
                            Boursier
                          </Badge>
                        )}
                        <p className="text-xs text-slate-500 mt-1">
                          Inscrit le {new Date(student.registrationDate).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      
                      <Button
                        size="sm"
                        onClick={() => setSelectedStudent(student.id)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Voir dossier
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
