
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Briefcase, Send } from "lucide-react";

interface InternshipRequestData {
  studentId: string;
  studentName: string;
  level: string;
  companyName: string;
  companyAddress: string;
  supervisorName: string;
  supervisorEmail: string;
  supervisorPhone: string;
  startDate: string;
  endDate: string;
  internshipType: string;
  description: string;
  objectives: string;
}

export const InternshipRequestForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<InternshipRequestData>({
    studentId: "",
    studentName: "",
    level: "",
    companyName: "",
    companyAddress: "",
    supervisorName: "",
    supervisorEmail: "",
    supervisorPhone: "",
    startDate: "",
    endDate: "",
    internshipType: "",
    description: "",
    objectives: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Internship request:", formData);
    toast({
      title: "Demande envoyée",
      description: "Votre demande de stage a été soumise avec succès"
    });
  };

  const updateField = (field: keyof InternshipRequestData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          Demande de Stage
        </CardTitle>
        <CardDescription>
          Formulaire de demande de convention de stage
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations étudiant */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informations Étudiant</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="studentId">Numéro étudiant</Label>
                <Input
                  id="studentId"
                  value={formData.studentId}
                  onChange={(e) => updateField("studentId", e.target.value)}
                  placeholder="20240001"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="studentName">Nom complet</Label>
                <Input
                  id="studentName"
                  value={formData.studentName}
                  onChange={(e) => updateField("studentName", e.target.value)}
                  placeholder="Nom Prénom"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="level">Niveau d'études</Label>
                <Select 
                  value={formData.level} 
                  onValueChange={(value) => updateField("level", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="l1">L1</SelectItem>
                    <SelectItem value="l2">L2</SelectItem>
                    <SelectItem value="l3">L3</SelectItem>
                    <SelectItem value="m1">M1</SelectItem>
                    <SelectItem value="m2">M2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Informations entreprise */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informations Entreprise</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Nom de l'entreprise</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => updateField("companyName", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyAddress">Adresse de l'entreprise</Label>
                <Input
                  id="companyAddress"
                  value={formData.companyAddress}
                  onChange={(e) => updateField("companyAddress", e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Encadrant entreprise */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Encadrant en Entreprise</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="supervisorName">Nom de l'encadrant</Label>
                <Input
                  id="supervisorName"
                  value={formData.supervisorName}
                  onChange={(e) => updateField("supervisorName", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supervisorEmail">Email</Label>
                <Input
                  id="supervisorEmail"
                  type="email"
                  value={formData.supervisorEmail}
                  onChange={(e) => updateField("supervisorEmail", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supervisorPhone">Téléphone</Label>
                <Input
                  id="supervisorPhone"
                  value={formData.supervisorPhone}
                  onChange={(e) => updateField("supervisorPhone", e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Détails du stage */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Détails du Stage</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Date de début</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => updateField("startDate", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Date de fin</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => updateField("endDate", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="internshipType">Type de stage</Label>
                <Select 
                  value={formData.internshipType} 
                  onValueChange={(value) => updateField("internshipType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="observation">Stage d'observation</SelectItem>
                    <SelectItem value="application">Stage d'application</SelectItem>
                    <SelectItem value="perfection">Stage de perfectionnement</SelectItem>
                    <SelectItem value="memoire">Stage de fin d'études</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description des missions</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Décrivez les missions qui vous seront confiées..."
                rows={4}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="objectives">Objectifs pédagogiques</Label>
              <Textarea
                id="objectives"
                value={formData.objectives}
                onChange={(e) => updateField("objectives", e.target.value)}
                placeholder="Quels sont vos objectifs d'apprentissage..."
                rows={3}
                required
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" className="flex-1">
              <Send className="h-4 w-4 mr-2" />
              Soumettre la demande
            </Button>
            <Button type="button" variant="outline">
              Annuler
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
