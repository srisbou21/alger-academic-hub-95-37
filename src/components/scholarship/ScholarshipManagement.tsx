
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  GraduationCap,
  Search,
  Plus,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Users,
  DollarSign,
  Calendar
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Scholarship {
  id: string;
  title: string;
  description: string;
  amount: number;
  duration: number; // en mois
  eligibilityLevel: 'licence' | 'master' | 'doctorat' | 'tous';
  applicationDeadline: Date;
  availableSlots: number;
  appliedCount: number;
  status: 'active' | 'closed' | 'pending';
  requirements: string[];
  provider: string;
  category: 'merit' | 'need' | 'research' | 'international';
}

interface ScholarshipApplication {
  id: string;
  scholarshipId: string;
  studentId: string;
  studentName: string;
  studentLevel: string;
  applicationDate: Date;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  gpa: number;
  documents: Array<{
    type: string;
    name: string;
    uploaded: boolean;
  }>;
  reviewNotes?: string;
}

export const ScholarshipManagement = () => {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [applications, setApplications] = useState<ScholarshipApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [activeTab, setActiveTab] = useState("scholarships");
  const { toast } = useToast();

  useEffect(() => {
    loadScholarships();
    loadApplications();
  }, []);

  const loadScholarships = async () => {
    setLoading(true);
    try {
      // Simulation des données de bourses
      const mockScholarships: Scholarship[] = [
        {
          id: "sch1",
          title: "Bourse d'Excellence Académique",
          description: "Bourse pour les étudiants avec des résultats exceptionnels",
          amount: 50000,
          duration: 12,
          eligibilityLevel: "tous",
          applicationDeadline: new Date("2024-03-15"),
          availableSlots: 10,
          appliedCount: 25,
          status: "active",
          requirements: ["Moyenne générale ≥ 15/20", "Pas de redoublement", "Lettre de motivation"],
          provider: "Ministère de l'Enseignement Supérieur",
          category: "merit"
        },
        {
          id: "sch2", 
          title: "Bourse de Recherche Doctorale",
          description: "Financement pour les doctorants en sciences exactes",
          amount: 75000,
          duration: 36,
          eligibilityLevel: "doctorat",
          applicationDeadline: new Date("2024-04-30"),
          availableSlots: 5,
          appliedCount: 12,
          status: "active",
          requirements: ["Inscription en doctorat", "Projet de recherche validé", "Directeur de thèse"],
          provider: "DGRSDT",
          category: "research"
        }
      ];
      setScholarships(mockScholarships);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les bourses",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadApplications = async () => {
    try {
      // Simulation des candidatures
      const mockApplications: ScholarshipApplication[] = [
        {
          id: "app1",
          scholarshipId: "sch1",
          studentId: "student1",
          studentName: "Amina Bensalem",
          studentLevel: "Master 1 Informatique",
          applicationDate: new Date("2024-01-15"),
          status: "under_review",
          gpa: 16.5,
          documents: [
            { type: "Relevé de notes", name: "releve_s1_s2.pdf", uploaded: true },
            { type: "Lettre de motivation", name: "motivation.pdf", uploaded: true },
            { type: "Certificat de scolarité", name: "certificat.pdf", uploaded: false }
          ]
        }
      ];
      setApplications(mockApplications);
    } catch (error) {
      console.error("Erreur chargement candidatures:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-100 text-green-800",
      closed: "bg-red-100 text-red-800",
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      under_review: "bg-blue-100 text-blue-800"
    };
    
    const labels = {
      active: "Active",
      closed: "Fermée", 
      pending: "En attente",
      approved: "Approuvée",
      rejected: "Rejetée",
      under_review: "En cours d'examen"
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const getCategoryBadge = (category: string) => {
    const variants = {
      merit: "bg-purple-100 text-purple-800",
      need: "bg-orange-100 text-orange-800", 
      research: "bg-blue-100 text-blue-800",
      international: "bg-green-100 text-green-800"
    };
    
    const labels = {
      merit: "Mérite",
      need: "Besoin",
      research: "Recherche", 
      international: "International"
    };
    
    return (
      <Badge className={variants[category as keyof typeof variants]}>
        {labels[category as keyof typeof labels]}
      </Badge>
    );
  };

  const totalBudget = scholarships.reduce((sum, sch) => sum + (sch.amount * sch.availableSlots), 0);
  const totalApplications = applications.length;
  const approvedApplications = applications.filter(app => app.status === 'approved').length;
  const activeScholarships = scholarships.filter(sch => sch.status === 'active').length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6" />
            Gestion des Bourses d'Étude
          </CardTitle>
          <p className="text-slate-600">
            Gérez les programmes de bourses, les candidatures et les attributions
          </p>
        </CardHeader>
        <CardContent>
          {/* Statistiques rapides */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <GraduationCap className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">{activeScholarships}</p>
              <p className="text-sm text-blue-800">Bourses actives</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">{totalApplications}</p>
              <p className="text-sm text-green-800">Candidatures</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <CheckCircle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-600">{approvedApplications}</p>
              <p className="text-sm text-purple-800">Approuvées</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <DollarSign className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-orange-600">{totalBudget.toLocaleString()}</p>
              <p className="text-sm text-orange-800">Budget total (DA)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="scholarships">Programmes de Bourses</TabsTrigger>
          <TabsTrigger value="applications">Candidatures</TabsTrigger>
          <TabsTrigger value="statistics">Statistiques</TabsTrigger>
        </TabsList>

        <TabsContent value="scholarships" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Programmes de Bourses</CardTitle>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle Bourse
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher une bourse..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filtrer par statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tous les statuts</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="closed">Fermée</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                {scholarships.map((scholarship) => (
                  <div key={scholarship.id} className="border rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{scholarship.title}</h3>
                          {getStatusBadge(scholarship.status)}
                          {getCategoryBadge(scholarship.category)}
                        </div>
                        <p className="text-slate-600 mb-3">{scholarship.description}</p>
                      </div>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        Détails
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-slate-700">Montant</p>
                        <p className="text-lg font-bold text-green-600">{scholarship.amount.toLocaleString()} DA</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-700">Durée</p>
                        <p className="text-lg font-bold">{scholarship.duration} mois</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-700">Places disponibles</p>
                        <p className="text-lg font-bold text-blue-600">{scholarship.availableSlots}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-700">Candidatures</p>
                        <p className="text-lg font-bold text-purple-600">{scholarship.appliedCount}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Calendar className="h-4 w-4" />
                        <span>Échéance: {scholarship.applicationDeadline.toLocaleDateString('fr-FR')}</span>
                      </div>
                      <div className="text-sm text-slate-600">
                        Niveau: <span className="font-medium">{scholarship.eligibilityLevel}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Candidatures aux Bourses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {applications.map((application) => (
                  <div key={application.id} className="border rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{application.studentName}</h3>
                        <p className="text-slate-600">{application.studentLevel}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(application.status)}
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          Examiner
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-slate-700">Moyenne générale</p>
                        <p className="text-lg font-bold text-green-600">{application.gpa}/20</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-700">Date candidature</p>
                        <p className="text-sm">{application.applicationDate.toLocaleDateString('fr-FR')}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-700">Documents</p>
                        <p className="text-sm">
                          {application.documents.filter(doc => doc.uploaded).length}/{application.documents.length} téléchargés
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-700">Évaluation</p>
                        <div className="flex gap-1">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Statistiques des Bourses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-4">Répartition par catégorie</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Bourses de mérite</span>
                      <span className="font-medium">65%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bourses de recherche</span>
                      <span className="font-medium">25%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bourses sociales</span>
                      <span className="font-medium">10%</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-4">Taux de réussite</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Candidatures approuvées</span>
                      <span className="font-medium text-green-600">45%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>En cours d'examen</span>
                      <span className="font-medium text-blue-600">35%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rejetées</span>
                      <span className="font-medium text-red-600">20%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
