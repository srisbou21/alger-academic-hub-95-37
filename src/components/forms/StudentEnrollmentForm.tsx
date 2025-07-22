
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Save } from "lucide-react";

interface StudentEnrollmentData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  placeOfBirth: string;
  address: string;
  nationalId: string;
  baccalaureateSeries: string;
  baccalaureateYear: string;
  baccalaureateGrade: string;
  selectedProgram: string;
  academicYear: string;
}

interface StudentEnrollmentFormProps {
  onBack?: () => void;
}

export const StudentEnrollmentForm = ({ onBack }: StudentEnrollmentFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<StudentEnrollmentData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    placeOfBirth: "",
    address: "",
    nationalId: "",
    baccalaureateSeries: "",
    baccalaureateYear: "",
    baccalaureateGrade: "",
    selectedProgram: "",
    academicYear: "2024-2025"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Student enrollment:", formData);
    toast({
      title: "Inscription enregistrée",
      description: "Le dossier d'inscription a été créé avec succès"
    });
  };

  const updateField = (field: keyof StudentEnrollmentData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Inscription Étudiant
        </CardTitle>
        <CardDescription>
          Formulaire d'inscription pour nouveaux étudiants
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations personnelles */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informations personnelles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => updateField("firstName", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom de famille</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => updateField("lastName", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date de naissance</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => updateField("dateOfBirth", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="placeOfBirth">Lieu de naissance</Label>
                <Input
                  id="placeOfBirth"
                  value={formData.placeOfBirth}
                  onChange={(e) => updateField("placeOfBirth", e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Adresse complète</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => updateField("address", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nationalId">Numéro CNI</Label>
              <Input
                id="nationalId"
                value={formData.nationalId}
                onChange={(e) => updateField("nationalId", e.target.value)}
                required
              />
            </div>
          </div>

          {/* Informations académiques */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informations du Baccalauréat</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="baccalaureateSeries">Série du Bac</Label>
                <Select 
                  value={formData.baccalaureateSeries} 
                  onValueChange={(value) => updateField("baccalaureateSeries", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sciences_exp">Sciences Expérimentales</SelectItem>
                    <SelectItem value="mathematiques">Mathématiques</SelectItem>
                    <SelectItem value="lettres_philo">Lettres et Philosophie</SelectItem>
                    <SelectItem value="langues_etrangeres">Langues Étrangères</SelectItem>
                    <SelectItem value="gestion_economie">Gestion et Économie</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="baccalaureateYear">Année d'obtention</Label>
                <Input
                  id="baccalaureateYear"
                  value={formData.baccalaureateYear}
                  onChange={(e) => updateField("baccalaureateYear", e.target.value)}
                  placeholder="2024"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="baccalaureateGrade">Mention</Label>
                <Select 
                  value={formData.baccalaureateGrade} 
                  onValueChange={(value) => updateField("baccalaureateGrade", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="passable">Passable</SelectItem>
                    <SelectItem value="assez_bien">Assez Bien</SelectItem>
                    <SelectItem value="bien">Bien</SelectItem>
                    <SelectItem value="tres_bien">Très Bien</SelectItem>
                    <SelectItem value="excellent">Excellent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Choix de formation */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Choix de Formation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="selectedProgram">Programme souhaité</Label>
                <Select 
                  value={formData.selectedProgram} 
                  onValueChange={(value) => updateField("selectedProgram", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un programme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="licence_economie">Licence Économie</SelectItem>
                    <SelectItem value="licence_gestion">Licence Gestion</SelectItem>
                    <SelectItem value="licence_commerce">Licence Commerce International</SelectItem>
                    <SelectItem value="master_finance">Master Finance</SelectItem>
                    <SelectItem value="master_management">Master Management</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="academicYear">Année académique</Label>
                <Select 
                  value={formData.academicYear} 
                  onValueChange={(value) => updateField("academicYear", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024-2025">2024-2025</SelectItem>
                    <SelectItem value="2025-2026">2025-2026</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              Enregistrer l'inscription
            </Button>
            {onBack && (
              <Button type="button" variant="outline" onClick={onBack}>
                Retour
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
