import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  GraduationCap, 
  Upload, 
  FileText, 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  MapPin,
  School,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

export const AcademicRegistrationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Informations personnelles
    nom: '',
    prenom: '',
    dateNaissance: '',
    lieuNaissance: '',
    nationalite: 'Algérienne',
    sexe: '',
    adresse: '',
    telephone: '',
    email: '',
    
    // Informations académiques
    niveauDemande: '',
    specialite: '',
    anneePrecedente: '',
    moyenneBac: '',
    mentionBac: '',
    
    // Documents
    documents: {
      photoIdentite: null,
      copieBAC: null,
      releveNotes: null,
      acteTaissance: null,
      certificatResidence: null
    }
  });

  const [errors, setErrors] = useState<string[]>([]);

  const niveaux = [
    { value: 'l1', label: 'Licence 1ère Année (L1)' },
    { value: 'l2', label: 'Licence 2ème Année (L2)' },
    { value: 'l3', label: 'Licence 3ème Année (L3)' },
    { value: 'm1', label: 'Master 1ère Année (M1)' },
    { value: 'm2', label: 'Master 2ème Année (M2)' }
  ];

  const specialites = [
    { value: 'eco', label: 'Sciences Économiques' },
    { value: 'comm', label: 'Sciences Commerciales' },
    { value: 'gestion', label: 'Sciences de Gestion' },
    { value: 'finance', label: 'Finance et Comptabilité' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'management', label: 'Management' }
  ];

  const mentionsBac = [
    { value: 'passable', label: 'Passable (10-12)' },
    { value: 'assez-bien', label: 'Assez Bien (12-14)' },
    { value: 'bien', label: 'Bien (14-16)' },
    { value: 'tres-bien', label: 'Très Bien (16-18)' },
    { value: 'excellent', label: 'Excellent (18-20)' }
  ];

  const requiredDocuments = [
    { key: 'photoIdentite', label: 'Photo d\'identité récente', required: true },
    { key: 'copieBAC', label: 'Copie du Baccalauréat', required: true },
    { key: 'releveNotes', label: 'Relevé de notes du Bac', required: true },
    { key: 'acteNaissance', label: 'Acte de naissance', required: true },
    { key: 'certificatResidence', label: 'Certificat de résidence', required: false }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (documentKey: string, file: File | null) => {
    setFormData(prev => ({
      ...prev,
      documents: { ...prev.documents, [documentKey]: file }
    }));
  };

  const validateStep = (step: number) => {
    const newErrors: string[] = [];

    switch (step) {
      case 1:
        if (!formData.nom.trim()) newErrors.push('Le nom est requis');
        if (!formData.prenom.trim()) newErrors.push('Le prénom est requis');
        if (!formData.dateNaissance) newErrors.push('La date de naissance est requise');
        if (!formData.email.trim() || !formData.email.includes('@')) newErrors.push('Email valide requis');
        if (!formData.telephone.trim()) newErrors.push('Le téléphone est requis');
        break;
      case 2:
        if (!formData.niveauDemande) newErrors.push('Le niveau demandé est requis');
        if (!formData.specialite) newErrors.push('La spécialité est requise');
        if (!formData.moyenneBac) newErrors.push('La moyenne du Bac est requise');
        break;
      case 3:
        const requiredDocs = requiredDocuments.filter(doc => doc.required);
        const missingDocs = requiredDocs.filter(doc => !formData.documents[doc.key as keyof typeof formData.documents]);
        if (missingDocs.length > 0) {
          newErrors.push(`Documents manquants: ${missingDocs.map(d => d.label).join(', ')}`);
        }
        break;
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    if (validateStep(3)) {
      console.log('Inscription soumise:', formData);
      setCurrentStep(4); // Page de confirmation
    }
  };

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nom">Nom *</Label>
          <Input
            id="nom"
            value={formData.nom}
            onChange={(e) => handleInputChange('nom', e.target.value)}
            placeholder="Nom de famille"
          />
        </div>
        <div>
          <Label htmlFor="prenom">Prénom *</Label>
          <Input
            id="prenom"
            value={formData.prenom}
            onChange={(e) => handleInputChange('prenom', e.target.value)}
            placeholder="Prénom"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="dateNaissance">Date de naissance *</Label>
          <Input
            id="dateNaissance"
            type="date"
            value={formData.dateNaissance}
            onChange={(e) => handleInputChange('dateNaissance', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="lieuNaissance">Lieu de naissance</Label>
          <Input
            id="lieuNaissance"
            value={formData.lieuNaissance}
            onChange={(e) => handleInputChange('lieuNaissance', e.target.value)}
            placeholder="Ville, Wilaya"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="sexe">Sexe</Label>
          <Select value={formData.sexe} onValueChange={(value) => handleInputChange('sexe', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="M">Masculin</SelectItem>
              <SelectItem value="F">Féminin</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="nationalite">Nationalité</Label>
          <Input
            id="nationalite"
            value={formData.nationalite}
            onChange={(e) => handleInputChange('nationalite', e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="adresse">Adresse complète</Label>
        <Textarea
          id="adresse"
          value={formData.adresse}
          onChange={(e) => handleInputChange('adresse', e.target.value)}
          placeholder="Rue, ville, wilaya, code postal"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="telephone">Téléphone *</Label>
          <Input
            id="telephone"
            value={formData.telephone}
            onChange={(e) => handleInputChange('telephone', e.target.value)}
            placeholder="+213 XXX XXX XXX"
          />
        </div>
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="votre.email@example.com"
          />
        </div>
      </div>
    </div>
  );

  const renderAcademicInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="niveauDemande">Niveau demandé *</Label>
          <Select value={formData.niveauDemande} onValueChange={(value) => handleInputChange('niveauDemande', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner le niveau" />
            </SelectTrigger>
            <SelectContent>
              {niveaux.map(niveau => (
                <SelectItem key={niveau.value} value={niveau.value}>
                  {niveau.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="specialite">Spécialité *</Label>
          <Select value={formData.specialite} onValueChange={(value) => handleInputChange('specialite', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner la spécialité" />
            </SelectTrigger>
            <SelectContent>
              {specialites.map(spec => (
                <SelectItem key={spec.value} value={spec.value}>
                  {spec.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="moyenneBac">Moyenne du Baccalauréat *</Label>
          <Input
            id="moyenneBac"
            type="number"
            step="0.01"
            min="10"
            max="20"
            value={formData.moyenneBac}
            onChange={(e) => handleInputChange('moyenneBac', e.target.value)}
            placeholder="Ex: 14.50"
          />
        </div>
        <div>
          <Label htmlFor="mentionBac">Mention obtenue</Label>
          <Select value={formData.mentionBac} onValueChange={(value) => handleInputChange('mentionBac', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner la mention" />
            </SelectTrigger>
            <SelectContent>
              {mentionsBac.map(mention => (
                <SelectItem key={mention.value} value={mention.value}>
                  {mention.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="anneePrecedente">Établissement d'origine (si transfert)</Label>
        <Input
          id="anneePrecedente"
          value={formData.anneePrecedente}
          onChange={(e) => handleInputChange('anneePrecedente', e.target.value)}
          placeholder="Nom de l'université ou établissement précédent"
        />
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">Documents requis</h4>
        <p className="text-sm text-blue-600">
          Veuillez télécharger tous les documents requis. Les fichiers acceptés sont: PDF, JPG, PNG (max 5MB chacun).
        </p>
      </div>

      <div className="space-y-4">
        {requiredDocuments.map(doc => (
          <div key={doc.key} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span className="font-medium">{doc.label}</span>
                {doc.required && <Badge variant="destructive">Requis</Badge>}
              </div>
              {formData.documents[doc.key as keyof typeof formData.documents] && (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileUpload(doc.key, e.target.files?.[0] || null)}
                className="flex-1"
              />
              <Button size="sm" variant="outline">
                <Upload className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderConfirmation = () => (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <div className="bg-green-100 p-4 rounded-full">
          <CheckCircle className="h-16 w-16 text-green-600" />
        </div>
      </div>
      <div>
        <h3 className="text-2xl font-bold text-green-600 mb-2">Inscription soumise avec succès !</h3>
        <p className="text-gray-600">
          Votre demande d'inscription a été enregistrée. Vous recevrez un email de confirmation sous peu.
        </p>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="font-medium mb-2">Numéro de dossier: <span className="text-blue-600">INS-2024-{Date.now().toString().slice(-6)}</span></p>
        <p className="text-sm text-gray-600">
          Conservez ce numéro pour suivre l'état de votre demande.
        </p>
      </div>
      <div className="space-y-2">
        <Button className="w-full">Télécharger le récépissé</Button>
        <Button variant="outline" className="w-full" onClick={() => window.print()}>
          Imprimer cette page
        </Button>
      </div>
    </div>
  );

  if (currentStep === 4) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="p-8">
            {renderConfirmation()}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-full">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">Inscription Académique</CardTitle>
                <CardDescription>FSECSG - Année universitaire 2024-2025</CardDescription>
              </div>
            </div>
            
            {/* Indicateur de progression */}
            <div className="flex items-center space-x-2 mt-6">
              {[1, 2, 3].map(step => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step === currentStep 
                      ? 'bg-blue-600 text-white' 
                      : step < currentStep 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step < currentStep ? <CheckCircle className="h-4 w-4" /> : step}
                  </div>
                  {step < 3 && <div className={`w-12 h-1 mx-2 ${step < currentStep ? 'bg-green-500' : 'bg-gray-200'}`} />}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>Informations personnelles</span>
              <span>Informations académiques</span>
              <span>Documents</span>
            </div>
          </CardHeader>
          
          <CardContent>
            {errors.length > 0 && (
              <Alert variant="destructive" className="mb-6">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <ul className="list-disc list-inside">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {currentStep === 1 && renderPersonalInfo()}
            {currentStep === 2 && renderAcademicInfo()}
            {currentStep === 3 && renderDocuments()}

            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                Précédent
              </Button>
              <div className="text-sm text-gray-500">
                Étape {currentStep} sur 3
              </div>
              {currentStep < 3 ? (
                <Button onClick={nextStep}>
                  Suivant
                </Button>
              ) : (
                <Button onClick={handleSubmit}>
                  Soumettre l'inscription
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};