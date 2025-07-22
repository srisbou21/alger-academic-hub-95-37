
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search, Edit, Calendar, DollarSign, Users, Target } from "lucide-react";

interface Scholarship {
  id: string;
  name: string;
  type: string;
  amount: number;
  duration: string;
  criteria: string[];
  deadline: string;
  available: number;
  total: number;
  status: string;
  description: string;
}

const mockScholarships: Scholarship[] = [
  {
    id: "SCH001",
    name: "Bourse Excellence Académique",
    type: "Mérite Académique",
    amount: 3000,
    duration: "1 an",
    criteria: ["Moyenne ≥ 16/20", "Assiduité exemplaire", "Projet professionnel"],
    deadline: "2024-03-15",
    available: 5,
    total: 10,
    status: "ouverte",
    description: "Destinée aux étudiants ayant obtenu d'excellents résultats académiques"
  },
  {
    id: "SCH002",
    name: "Aide Sociale Étudiante",
    type: "Besoin Social",
    amount: 2500,
    duration: "1 semestre",
    criteria: ["Quotient familial < 20000€", "Boursier CROUS", "Dossier social"],
    deadline: "2024-02-28",
    available: 8,
    total: 15,
    status: "ouverte",
    description: "Soutien financier pour les étudiants en difficulté économique"
  },
  {
    id: "SCH003",
    name: "Bourse Recherche Innovation",
    type: "Recherche",
    amount: 4000,
    duration: "6 mois",
    criteria: ["Niveau Master", "Projet de recherche", "Encadrement confirmé"],
    deadline: "2024-04-01",
    available: 0,
    total: 5,
    status: "fermee",
    description: "Financement de projets de recherche en Master"
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "ouverte":
      return <Badge variant="default">Ouverte</Badge>;
    case "fermee":
      return <Badge variant="destructive">Fermée</Badge>;
    case "bientot":
      return <Badge variant="secondary">Bientôt</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export const ScholarshipCatalog = () => {
  const { toast } = useToast();
  const [scholarships, setScholarships] = useState<Scholarship[]>(mockScholarships);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredScholarships = scholarships.filter(scholarship => {
    const matchesSearch = scholarship.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scholarship.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || scholarship.type === typeFilter;
    const matchesStatus = statusFilter === "all" || scholarship.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleAction = (action: string, scholarshipId: string) => {
    toast({
      title: "Action effectuée",
      description: `${action} pour la bourse ${scholarshipId}`
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Catalogue des Bourses</CardTitle>
              <CardDescription>
                Gestion des programmes de bourses disponibles
              </CardDescription>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle Bourse
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filtres */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une bourse..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="Mérite Académique">Mérite Académique</SelectItem>
                <SelectItem value="Besoin Social">Besoin Social</SelectItem>
                <SelectItem value="Excellence Sportive">Excellence Sportive</SelectItem>
                <SelectItem value="Recherche">Recherche</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="ouverte">Ouverte</SelectItem>
                <SelectItem value="fermee">Fermée</SelectItem>
                <SelectItem value="bientot">Bientôt</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Grille des bourses */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredScholarships.map((scholarship) => (
              <Card key={scholarship.id} className="h-fit">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{scholarship.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {scholarship.description}
                      </CardDescription>
                    </div>
                    {getStatusBadge(scholarship.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Informations principales */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">€{scholarship.amount.toLocaleString()}</span>
                      <span className="text-sm text-muted-foreground">({scholarship.duration})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        Échéance: {new Date(scholarship.deadline).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {scholarship.available}/{scholarship.total} places disponibles
                      </span>
                    </div>
                  </div>

                  {/* Critères */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Critères d'éligibilité</span>
                    </div>
                    <div className="space-y-1">
                      {scholarship.criteria.map((criteria, index) => (
                        <div key={index} className="text-xs bg-muted px-2 py-1 rounded">
                          {criteria}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Barre de progression */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Places attribuées</span>
                      <span>{scholarship.total - scholarship.available}/{scholarship.total}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{
                          width: `${((scholarship.total - scholarship.available) / scholarship.total) * 100}%`
                        }}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleAction("Modifier", scholarship.id)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Modifier
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleAction("Voir détails", scholarship.id)}
                    >
                      Détails
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Statistiques du catalogue */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{scholarships.length}</div>
            <div className="text-sm text-muted-foreground">Total Programmes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {scholarships.filter(s => s.status === "ouverte").length}
            </div>
            <div className="text-sm text-muted-foreground">Campagnes Ouvertes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {scholarships.reduce((sum, s) => sum + s.total, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Places Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {scholarships.reduce((sum, s) => sum + s.available, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Places Disponibles</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
