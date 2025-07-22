
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, Send, Plus, Trash2 } from "lucide-react";

interface ScholarshipApplicationData {
  personalInfo: {
    studentId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    birthDate: string;
  };
  academic: {
    level: string;
    program: string;
    year: string;
    gpa: string;
    institution: string;
  };
  scholarship: {
    type: string;
    amount: string;
    duration: string;
    motivation: string;
    objectives: string;
  };
  financial: {
    familyIncome: string;
    hasOtherScholarships: boolean;
    otherScholarships: string;
    employmentStatus: string;
  };
  documents: File[];
}

export const ScholarshipApplicationForm = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ScholarshipApplicationData>({
    personalInfo: {
      studentId: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      birthDate: ""
    },
    academic: {
      level: "",
      program: "",
      year: "",
      gpa: "",
      institution: ""
    },
    scholarship: {
      type: "",
      amount: "",
      duration: "",
      motivation: "",
      objectives: ""
    },
    financial: {
      familyIncome: "",
      hasOtherScholarships: false,
      otherScholarships: "",
      employmentStatus: ""
    },
    documents: []
  });

  const updatePersonalInfo = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  const updateAcademic = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      academic: { ...prev.academic, [field]: value }
    }));
  };

  const updateScholarship = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      scholarship: { ...prev.scholarship, [field]: value }
    }));
  };

  const updateFinancial = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      financial: { ...prev.financial, [field]: value }
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, ...files]
    }));
  };

  const removeDocument = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = () => {
    toast({
      title: "Candidature soumise",
      description: "Votre demande de bourse a été enregistrée avec succès"
    });
    console.log("Application submitted:", formData);
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Candidature de Bourse d'Études</CardTitle>
        <CardDescription>
          Formulaire de demande de bourse - Étape {currentStep} sur 4
        </CardDescription>
        
        {/* Progress indicator */}
        <div className="flex items-center justify-between mt-4">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {step}
              </div>
              {step < 4 && (
                <div
                  className={`w-20 h-1 mx-2 ${
                    step < currentStep ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Étape 1: Informations personnelles */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informations Personnelles</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="studentId">Numéro étudiant</Label>
                <Input
                  id="studentId"
                  value={formData.personalInfo.studentId}
                  onChange={(e) => updatePersonalInfo("studentId", e.target.value)}
                  placeholder="20240001"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom</Label>
                <Input
                  id="firstName"
                  value={formData.personalInfo.firstName}
                  onChange={(e) => updatePersonalInfo("firstName", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom</Label>
                <Input
                  id="lastName"
                  value={formData.personalInfo.lastName}
                  onChange={(e) => updatePersonalInfo("lastName", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.personalInfo.email}
                  onChange={(e) => updatePersonalInfo("email", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  value={formData.personalInfo.phone}
                  onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthDate">Date de naissance</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.personalInfo.birthDate}
                  onChange={(e) => updatePersonalInfo("birthDate", e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Adresse complète</Label>
              <Textarea
                id="address"
                value={formData.personalInfo.address}
                onChange={(e) => updatePersonalInfo("address", e.target.value)}
                rows={3}
                required
              />
            </div>
          </div>
        )}

        {/* Étape 2: Informations académiques */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informations Académiques</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="level">Niveau d'études</Label>
                <Select value={formData.academic.level} onValueChange={(value) => updateAcademic("level", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="l1">Licence 1</SelectItem>
                    <SelectItem value="l2">Licence 2</SelectItem>
                    <SelectItem value="l3">Licence 3</SelectItem>
                    <SelectItem value="m1">Master 1</SelectItem>
                    <SelectItem value="m2">Master 2</SelectItem>
                    <SelectItem value="doctorat">Doctorat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="program">Programme d'études</Label>
                <Select value={formData.academic.program} onValueChange={(value) => updateAcademic("program", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="economie">Économie</SelectItem>
                    <SelectItem value="gestion">Gestion</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="informatique">Informatique</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="year">Année d'études</Label>
                <Input
                  id="year"
                  value={formData.academic.year}
                  onChange={(e) => updateAcademic("year", e.target.value)}
                  placeholder="2023-2024"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gpa">Moyenne générale</Label>
                <Input
                  id="gpa"
                  type="number"
                  step="0.01"
                  min="0"
                  max="20"
                  value={formData.academic.gpa}
                  onChange={(e) => updateAcademic("gpa", e.target.value)}
                  placeholder="15.50"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="institution">Établissement actuel</Label>
              <Input
                id="institution"
                value={formData.academic.institution}
                onChange={(e) => updateAcademic("institution", e.target.value)}
                placeholder="Université de..."
                required
              />
            </div>
          </div>
        )}

        {/* Étape 3: Informations sur la bourse */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Demande de Bourse</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="scholarshipType">Type de bourse</Label>
                <Select value={formData.scholarship.type} onValueChange={(value) => updateScholarship("type", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="merite">Mérite Académique</SelectItem>
                    <SelectItem value="social">Besoin Social</SelectItem>
                    <SelectItem value="sport">Excellence Sportive</SelectItem>
                    <SelectItem value="recherche">Recherche</SelectItem>
                    <SelectItem value="international">International</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount">Montant demandé (€)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.scholarship.amount}
                  onChange={(e) => updateScholarship("amount", e.target.value)}
                  placeholder="3000"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="motivation">Lettre de motivation</Label>
              <Textarea
                id="motivation"
                value={formData.scholarship.motivation}
                onChange={(e) => updateScholarship("motivation", e.target.value)}
                rows={6}
                placeholder="Expliquez vos motivations pour cette demande de bourse..."
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="objectives">Objectifs académiques et professionnels</Label>
              <Textarea
                id="objectives"
                value={formData.scholarship.objectives}
                onChange={(e) => updateScholarship("objectives", e.target.value)}
                rows={4}
                placeholder="Décrivez vos objectifs à court et long terme..."
                required
              />
            </div>
          </div>
        )}

        {/* Étape 4: Situation financière et documents */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Situation Financière</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="familyIncome">Revenus familiaux annuels (€)</Label>
                  <Input
                    id="familyIncome"
                    type="number"
                    value={formData.financial.familyIncome}
                    onChange={(e) => updateFinancial("familyIncome", e.target.value)}
                    placeholder="25000"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="employmentStatus">Statut professionnel</Label>
                  <Select 
                    value={formData.financial.employmentStatus} 
                    onValueChange={(value) => updateFinancial("employmentStatus", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Étudiant</SelectItem>
                      <SelectItem value="working">Salarié</SelectItem>
                      <SelectItem value="unemployed">Sans emploi</SelectItem>
                      <SelectItem value="part_time">Temps partiel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasOtherScholarships"
                  checked={formData.financial.hasOtherScholarships}
                  onCheckedChange={(checked) => updateFinancial("hasOtherScholarships", checked as boolean)}
                />
                <Label htmlFor="hasOtherScholarships">
                  Je bénéficie d'autres bourses ou aides financières
                </Label>
              </div>
              
              {formData.financial.hasOtherScholarships && (
                <div className="space-y-2">
                  <Label htmlFor="otherScholarships">Détails des autres aides</Label>
                  <Textarea
                    id="otherScholarships"
                    value={formData.financial.otherScholarships}
                    onChange={(e) => updateFinancial("otherScholarships", e.target.value)}
                    rows={3}
                    placeholder="Précisez les autres bourses ou aides..."
                  />
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Documents Justificatifs</h3>
              
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.doc,.docx,.jpg,.png"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center">
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground text-center">
                      Cliquez pour ajouter des documents ou glissez-déposez
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PDF, DOC, DOCX, JPG, PNG (max 5MB par fichier)
                    </p>
                  </div>
                </label>
              </div>
              
              {formData.documents.length > 0 && (
                <div className="space-y-2">
                  <Label>Documents ajoutés</Label>
                  {formData.documents.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span className="text-sm">{file.name}</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeDocument(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-6">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            Précédent
          </Button>
          
          {currentStep < 4 ? (
            <Button onClick={nextStep}>
              Suivant
            </Button>
          ) : (
            <Button onClick={handleSubmit}>
              <Send className="h-4 w-4 mr-2" />
              Soumettre la Candidature
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
