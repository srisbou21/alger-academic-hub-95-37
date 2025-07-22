
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building2, Search, Star, MapPin, Phone, Mail, 
  FileText, Calendar, Users, Plus, Filter
} from "lucide-react";
import { useState } from "react";

export const CompanyDatabase = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const companies = [
    {
      id: "ENT001",
      name: "Sonelgaz",
      sector: "Énergie",
      address: "Alger Centre",
      contact: "M. Belkacem",
      phone: "+213 21 XXX XXX",
      email: "stages@sonelgaz.dz",
      activeInternships: 12,
      totalInternships: 45,
      rating: 4.5,
      lastPartnership: "2024-01-15",
      status: "actif"
    },
    {
      id: "ENT002", 
      name: "Banque Nationale d'Algérie",
      sector: "Finance",
      address: "Hydra, Alger",
      contact: "Mme Bencheikh",
      phone: "+213 21 YYY YYY",
      email: "rh@bna.dz",
      activeInternships: 8,
      totalInternships: 67,
      rating: 4.2,
      lastPartnership: "2024-02-10",
      status: "actif"
    },
    {
      id: "ENT003",
      name: "Air Algérie",
      sector: "Transport",
      address: "Dar El Beida",
      contact: "M. Mansouri",
      phone: "+213 21 ZZZ ZZZ", 
      email: "stages@airalgerie.dz",
      activeInternships: 5,
      totalInternships: 23,
      rating: 3.8,
      lastPartnership: "2024-03-05",
      status: "actif"
    }
  ];

  const internshipOffers = [
    {
      id: "OFF001",
      company: "Sonelgaz",
      title: "Analyse Financière et Contrôle de Gestion",
      duration: "3 mois",
      startDate: "2024-07-01",
      requirements: "L3 Finance, Comptabilité",
      description: "Participation à l'analyse des états financiers et au reporting mensuel",
      status: "ouvert",
      applicants: 15
    },
    {
      id: "OFF002",
      company: "BNA",
      title: "Marketing Digital et Communication",
      duration: "4 mois", 
      startDate: "2024-08-15",
      requirements: "L3 Marketing, Communication",
      description: "Développement de la stratégie digitale de la banque",
      status: "ouvert",
      applicants: 23
    }
  ];

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.sector.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "actif": return "bg-green-100 text-green-800 border-green-200";
      case "inactif": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-slate-800">Base de Données Entreprises</h3>
          <p className="text-slate-600">Gestion des partenaires et offres de stages</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle entreprise
          </Button>
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Convention cadre
          </Button>
        </div>
      </div>

      <Tabs defaultValue="companies" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="companies">
            <Building2 className="h-4 w-4 mr-2" />
            Entreprises Partenaires
          </TabsTrigger>
          <TabsTrigger value="offers">
            <FileText className="h-4 w-4 mr-2" />
            Offres de Stages
          </TabsTrigger>
        </TabsList>

        <TabsContent value="companies" className="space-y-6">
          {/* Barre de recherche et filtres */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4 items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Rechercher une entreprise ou secteur..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filtres
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Liste des entreprises */}
          <Card>
            <CardHeader>
              <CardTitle>Annuaire des Entreprises</CardTitle>
              <CardDescription>
                {filteredCompanies.length} entreprise(s) partenaire(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Entreprise</TableHead>
                      <TableHead>Secteur</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Stages Actifs</TableHead>
                      <TableHead>Historique</TableHead>
                      <TableHead>Évaluation</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCompanies.map((company) => (
                      <TableRow key={company.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{company.name}</p>
                            <p className="text-sm text-slate-500 flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {company.address}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{company.sector}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p className="font-medium">{company.contact}</p>
                            <p className="text-slate-500 flex items-center">
                              <Phone className="h-3 w-3 mr-1" />
                              {company.phone}
                            </p>
                            <p className="text-slate-500 flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {company.email}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-blue-100 text-blue-800">
                            {company.activeInternships}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-slate-600">
                            {company.totalInternships} stages
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-amber-400 fill-current" />
                            <span className="text-sm">{company.rating}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(company.status)}>
                            {company.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline">
                              <FileText className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Calendar className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="offers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Offres de Stages Disponibles</CardTitle>
              <CardDescription>Opportunités actuellement ouvertes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {internshipOffers.map((offer) => (
                  <Card key={offer.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-lg">{offer.title}</h4>
                          <p className="text-slate-600 flex items-center">
                            <Building2 className="h-4 w-4 mr-1" />
                            {offer.company}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge className="bg-green-100 text-green-800 mb-2">
                            {offer.status}
                          </Badge>
                          <p className="text-sm text-slate-500">
                            {offer.applicants} candidatures
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div>
                          <p className="text-sm font-medium text-slate-700">Durée</p>
                          <p className="text-sm text-slate-600">{offer.duration}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-700">Début</p>
                          <p className="text-sm text-slate-600">
                            {new Date(offer.startDate).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-700">Prérequis</p>
                          <p className="text-sm text-slate-600">{offer.requirements}</p>
                        </div>
                      </div>
                      
                      <p className="text-sm text-slate-700 mb-4">{offer.description}</p>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Users className="h-3 w-3 mr-1" />
                          Voir candidatures
                        </Button>
                        <Button size="sm" variant="outline">
                          <FileText className="h-3 w-3 mr-1" />
                          Détails
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
