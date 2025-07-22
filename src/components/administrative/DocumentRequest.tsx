
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FileText, Calendar as CalendarIcon, Send, AlertCircle } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface DocumentRequestProps {
  onSubmit: (request: any) => void;
  onCancel: () => void;
}

export const DocumentRequest = ({ onSubmit, onCancel }: DocumentRequestProps) => {
  const [formData, setFormData] = useState({
    documentType: "attestation_scolarite",
    studentId: "",
    studentName: "",
    urgency: "normal",
    deliveryMethod: "email",
    needsBy: null as Date | null,
    reason: "",
    copies: 1
  });

  const documentTypes = [
    { value: "attestation_scolarite", label: "Attestation de scolarité", autoGenerate: true },
    { value: "releve_notes", label: "Relevé de notes", autoGenerate: false },
    { value: "certificat_reussite", label: "Certificat de réussite", autoGenerate: false },
    { value: "convention_stage", label: "Convention de stage", autoGenerate: true },
    { value: "diplome", label: "Diplôme", autoGenerate: false }
  ];

  const selectedDocType = documentTypes.find(doc => doc.value === formData.documentType);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      id: `DOC-${Date.now()}`,
      requestDate: new Date().toISOString().split('T')[0],
      status: selectedDocType?.autoGenerate ? "processing" : "pending_validation"
    });
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Nouvelle Demande de Document
        </CardTitle>
        <CardDescription>
          Formulaire de demande de documents officiels
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="documentType">Type de document *</Label>
              <Select 
                value={formData.documentType} 
                onValueChange={(value) => setFormData({...formData, documentType: value})}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  {documentTypes.map((doc) => (
                    <SelectItem key={doc.value} value={doc.value}>
                      <div className="flex items-center justify-between w-full">
                        <span>{doc.label}</span>
                        {doc.autoGenerate && (
                          <Badge className="ml-2 bg-green-100 text-green-800 text-xs">Auto</Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="studentId">Numéro étudiant *</Label>
              <Input
                id="studentId"
                value={formData.studentId}
                onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                placeholder="20230045"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="studentName">Nom complet *</Label>
              <Input
                id="studentName"
                value={formData.studentName}
                onChange={(e) => setFormData({...formData, studentName: e.target.value})}
                placeholder="Nom et prénom"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date limite (optionnel)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.needsBy && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.needsBy ? format(formData.needsBy, "PPP") : <span>Sélectionner une date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.needsBy || undefined}
                    onSelect={(date) => setFormData({...formData, needsBy: date || null})}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
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
                  <SelectItem value="5">5 exemplaires</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deliveryMethod">Mode de livraison</Label>
            <Select 
              value={formData.deliveryMethod} 
              onValueChange={(value) => setFormData({...formData, deliveryMethod: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email (PDF)</SelectItem>
                <SelectItem value="pickup">Retrait sur place</SelectItem>
                <SelectItem value="mail">Courrier postal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Motif de la demande (optionnel)</Label>
            <Textarea
              id="reason"
              value={formData.reason}
              onChange={(e) => setFormData({...formData, reason: e.target.value})}
              placeholder="Précisez le motif si nécessaire..."
              rows={3}
            />
          </div>

          {selectedDocType && !selectedDocType.autoGenerate && (
            <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800">Validation requise</p>
                <p className="text-sm text-amber-600">
                  Ce type de document nécessite une validation hiérarchique avant génération.
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
              <Send className="h-4 w-4 mr-2" />
              Soumettre la demande
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
