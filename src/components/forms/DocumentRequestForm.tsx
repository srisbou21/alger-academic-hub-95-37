
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { FileText, Send } from "lucide-react";

interface DocumentRequestFormData {
  studentId: string;
  studentName: string;
  documentType: string;
  urgency: string;
  reason: string;
  copies: number;
}

export const DocumentRequestForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<DocumentRequestFormData>({
    studentId: "",
    studentName: "",
    documentType: "",
    urgency: "normal",
    reason: "",
    copies: 1
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Document request submitted:", formData);
    toast({
      title: "Demande soumise",
      description: "Votre demande de document a été enregistrée avec succès"
    });
    // Reset form
    setFormData({
      studentId: "",
      studentName: "",
      documentType: "",
      urgency: "normal",
      reason: "",
      copies: 1
    });
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Demande de Document
        </CardTitle>
        <CardDescription>
          Formulaire de demande de documents officiels
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="studentId">Numéro étudiant</Label>
              <Input
                id="studentId"
                value={formData.studentId}
                onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                placeholder="20240001"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="studentName">Nom complet</Label>
              <Input
                id="studentName"
                value={formData.studentName}
                onChange={(e) => setFormData({...formData, studentName: e.target.value})}
                placeholder="Nom et prénom"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="documentType">Type de document</Label>
            <Select 
              value={formData.documentType} 
              onValueChange={(value) => setFormData({...formData, documentType: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="attestation_scolarite">Attestation de scolarité</SelectItem>
                <SelectItem value="releve_notes">Relevé de notes</SelectItem>
                <SelectItem value="certificat_reussite">Certificat de réussite</SelectItem>
                <SelectItem value="convention_stage">Convention de stage</SelectItem>
                <SelectItem value="diplome">Diplôme</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="urgency">Urgence</Label>
              <Select 
                value={formData.urgency} 
                onValueChange={(value) => setFormData({...formData, urgency: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal (5-7 jours)</SelectItem>
                  <SelectItem value="urgent">Urgent (24-48h)</SelectItem>
                  <SelectItem value="express">Express (même jour)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="copies">Nombre d'exemplaires</Label>
              <Select 
                value={formData.copies.toString()} 
                onValueChange={(value) => setFormData({...formData, copies: parseInt(value)})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 exemplaire</SelectItem>
                  <SelectItem value="2">2 exemplaires</SelectItem>
                  <SelectItem value="3">3 exemplaires</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Motif de la demande</Label>
            <Textarea
              id="reason"
              value={formData.reason}
              onChange={(e) => setFormData({...formData, reason: e.target.value})}
              placeholder="Précisez le motif..."
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full">
            <Send className="h-4 w-4 mr-2" />
            Soumettre la demande
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
