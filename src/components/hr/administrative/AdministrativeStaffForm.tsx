import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  User, 
  Briefcase, 
  FileText, 
  Calendar as CalendarIcon,
  Save,
  X,
  Plus,
  Trash2,
  TrendingUp,
  Folder
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CareerPathManager } from "./components/CareerPathManager";
import { DigitalDocumentsManager } from "./components/DigitalDocumentsManager";

interface CareerPathEntry {
  id: string;
  position: string;
  grade: string;
  department: string;
  startDate: Date;
  endDate?: Date;
  isCurrent: boolean;
  responsibilities: string[];
  achievements: string[];
}

interface DigitalDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadDate: Date;
  category: 'academic' | 'professional' | 'personal' | 'administrative';
}

interface AdministrativeStaff {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  position: string;
  department: string;
  service: string;
  grade: string;
  echelon: number;
  isActive: boolean;
  hiringDate: Date;
  contractType: 'CDI' | 'CDD' | 'Stagiaire';
  personalInfo?: {
    dateOfBirth?: Date;
    placeOfBirth?: string;
    nationality?: string;
    nationalId?: string;
    familyStatus?: string;
    numberOfChildren?: number;
    address?: {
      street?: string;
      city?: string;
      wilaya?: string;
      postalCode?: string;
    }
  };
  skills: string[];
  certifications: string[];
  careerPath: CareerPathEntry[];
  digitalDocuments: DigitalDocument[];
  createdAt?: Date;
  updatedAt?: Date;
}

const ADMINISTRATIVE_GRADES = [
  'Secrétaire',
  'Attaché d\'Administration',
  'Attaché Principal d\'Administration',
  'Administrateur',
  'Administrateur Principal',
  'Chef de Service',
  'Sous-Directeur',
  'Directeur'
];

const ADMINISTRATIVE_DEPARTMENTS = [
  'Direction Générale',
  'Ressources Humaines',
  'Finances et Comptabilité',
  'Affaires Académiques',
  'Scolarité',
  'Recherche et Post-Graduation',
  'Relations Extérieures',
  'Maintenance et Sécurité',
  'Informatique',
  'Bibliothèque'
];

interface AdministrativeStaffFormProps {
  staff?: AdministrativeStaff;
  onSave: (staff: Partial<AdministrativeStaff>) => void;
  onCancel: () => void;
}

export const AdministrativeStaffForm: React.FC<AdministrativeStaffFormProps> = ({
  staff,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState<Partial<AdministrativeStaff>>({
    firstName: staff?.firstName || "",
    lastName: staff?.lastName || "",
    email: staff?.email || "",
    phone: staff?.phone || "",
    position: staff?.position || "",
    department: staff?.department || "",
    service: staff?.service || "",
    grade: staff?.grade || "",
    echelon: staff?.echelon || 1,
    isActive: staff?.isActive ?? true,
    hiringDate: staff?.hiringDate || new Date(),
    contractType: staff?.contractType || "CDI",
    personalInfo: {
      dateOfBirth: staff?.personalInfo?.dateOfBirth || new Date(),
      placeOfBirth: staff?.personalInfo?.placeOfBirth || "",
      nationality: staff?.personalInfo?.nationality || "Algérienne",
      nationalId: staff?.personalInfo?.nationalId || "",
      familyStatus: staff?.personalInfo?.familyStatus || "",
      numberOfChildren: staff?.personalInfo?.numberOfChildren || 0,
      address: {
        street: staff?.personalInfo?.address?.street || "",
        city: staff?.personalInfo?.address?.city || "",
        wilaya: staff?.personalInfo?.address?.wilaya || "",
        postalCode: staff?.personalInfo?.address?.postalCode || ""
      }
    },
    skills: staff?.skills || [],
    certifications: staff?.certifications || [],
    careerPath: staff?.careerPath || [],
    digitalDocuments: staff?.digitalDocuments || []
  });

  const [newSkill, setNewSkill] = useState("");
  const [newCertification, setNewCertification] = useState("");
  const [showBirthCalendar, setShowBirthCalendar] = useState(false);
  const [showHireCalendar, setShowHireCalendar] = useState(false);

  const updateFormData = (path: string, value: any) => {
    const keys = path.split('.');
    setFormData(prev => {
      const updated = { ...prev };
      let current: any = updated;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  const handleSave = () => {
    const staffData: Partial<AdministrativeStaff> = {
      ...formData,
      id: staff?.id,
      createdAt: staff?.createdAt || new Date(),
      updatedAt: new Date()
    };

    onSave(staffData);
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills?.includes(newSkill.trim())) {
      updateFormData('skills', [...(formData.skills || []), newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (index: number) => {
    const updatedSkills = formData.skills?.filter((_, i) => i !== index) || [];
    updateFormData('skills', updatedSkills);
  };

  const addCertification = () => {
    if (newCertification.trim() && !formData.certifications?.includes(newCertification.trim())) {
      updateFormData('certifications', [...(formData.certifications || []), newCertification.trim()]);
      setNewCertification("");
    }
  };

  const removeCertification = (index: number) => {
    const updatedCertifications = formData.certifications?.filter((_, i) => i !== index) || [];
    updateFormData('certifications', updatedCertifications);
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-6 w-6" />
          {staff ? "Modifier le personnel administratif" : "Nouveau personnel administratif"}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="personal">
              <User className="h-4 w-4 mr-2" />
              Personnel
            </TabsTrigger>
            <TabsTrigger value="professional">
              <Briefcase className="h-4 w-4 mr-2" />
              Professionnel
            </TabsTrigger>
            <TabsTrigger value="career">
              <TrendingUp className="h-4 w-4 mr-2" />
              Parcours
            </TabsTrigger>
            <TabsTrigger value="skills">
              <FileText className="h-4 w-4 mr-2" />
              Compétences
            </TabsTrigger>
            <TabsTrigger value="documents">
              <Folder className="h-4 w-4 mr-2" />
              Documents
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => updateFormData('firstName', e.target.value)}
                  placeholder="Prénom"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => updateFormData('lastName', e.target.value)}
                  placeholder="Nom"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  placeholder="email@univ.dz"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => updateFormData('phone', e.target.value)}
                  placeholder="+213 555 123 456"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Date de naissance</Label>
                <Popover open={showBirthCalendar} onOpenChange={setShowBirthCalendar}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.personalInfo?.dateOfBirth ? 
                        format(formData.personalInfo.dateOfBirth, "dd MMMM yyyy", { locale: fr }) :
                        "Sélectionner une date"
                      }
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.personalInfo?.dateOfBirth}
                      onSelect={(date) => {
                        updateFormData('personalInfo.dateOfBirth', date);
                        setShowBirthCalendar(false);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="placeOfBirth">Lieu de naissance</Label>
                <Input
                  id="placeOfBirth"
                  value={formData.personalInfo?.placeOfBirth}
                  onChange={(e) => updateFormData('personalInfo.placeOfBirth', e.target.value)}
                  placeholder="Ville, Wilaya"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="nationalId">Numéro CIN</Label>
                <Input
                  id="nationalId"
                  value={formData.personalInfo?.nationalId}
                  onChange={(e) => updateFormData('personalInfo.nationalId', e.target.value)}
                  placeholder="1234567890123456"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="familyStatus">Situation familiale</Label>
                <Select 
                  value={formData.personalInfo?.familyStatus} 
                  onValueChange={(value) => updateFormData('personalInfo.familyStatus', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Célibataire">Célibataire</SelectItem>
                    <SelectItem value="Marié(e)">Marié(e)</SelectItem>
                    <SelectItem value="Divorcé(e)">Divorcé(e)</SelectItem>
                    <SelectItem value="Veuf(ve)">Veuf(ve)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Adresse */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Adresse</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="street">Rue</Label>
                  <Input
                    id="street"
                    value={formData.personalInfo?.address?.street}
                    onChange={(e) => updateFormData('personalInfo.address.street', e.target.value)}
                    placeholder="Adresse complète"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="city">Ville</Label>
                  <Input
                    id="city"
                    value={formData.personalInfo?.address?.city}
                    onChange={(e) => updateFormData('personalInfo.address.city', e.target.value)}
                    placeholder="Ville"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="wilaya">Wilaya</Label>
                  <Input
                    id="wilaya"
                    value={formData.personalInfo?.address?.wilaya}
                    onChange={(e) => updateFormData('personalInfo.address.wilaya', e.target.value)}
                    placeholder="Wilaya"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Code postal</Label>
                  <Input
                    id="postalCode"
                    value={formData.personalInfo?.address?.postalCode}
                    onChange={(e) => updateFormData('personalInfo.address.postalCode', e.target.value)}
                    placeholder="Code postal"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="professional" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="position">Poste *</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => updateFormData('position', e.target.value)}
                  placeholder="Intitulé du poste"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="department">Département *</Label>
                <Select 
                  value={formData.department} 
                  onValueChange={(value) => updateFormData('department', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un département" />
                  </SelectTrigger>
                  <SelectContent>
                    {ADMINISTRATIVE_DEPARTMENTS.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="service">Service</Label>
                <Input
                  id="service"
                  value={formData.service}
                  onChange={(e) => updateFormData('service', e.target.value)}
                  placeholder="Service d'affectation"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="grade">Grade *</Label>
                <Select 
                  value={formData.grade} 
                  onValueChange={(value) => updateFormData('grade', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {ADMINISTRATIVE_GRADES.map(grade => (
                      <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="echelon">Échelon</Label>
                <Select 
                  value={formData.echelon?.toString()} 
                  onValueChange={(value) => updateFormData('echelon', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un échelon" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1,2,3,4,5,6,7,8,9,10].map(echelon => (
                      <SelectItem key={echelon} value={echelon.toString()}>
                        Échelon {echelon}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Date de recrutement</Label>
                <Popover open={showHireCalendar} onOpenChange={setShowHireCalendar}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.hiringDate ? 
                        format(formData.hiringDate, "dd MMMM yyyy", { locale: fr }) :
                        "Sélectionner une date"
                      }
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.hiringDate}
                      onSelect={(date) => {
                        updateFormData('hiringDate', date);
                        setShowHireCalendar(false);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contractType">Type de contrat</Label>
                <Select 
                  value={formData.contractType} 
                  onValueChange={(value) => updateFormData('contractType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CDI">CDI - Contrat à Durée Indéterminée</SelectItem>
                    <SelectItem value="CDD">CDD - Contrat à Durée Déterminée</SelectItem>
                    <SelectItem value="Stagiaire">Stagiaire</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => updateFormData('isActive', checked)}
                  />
                  <Label htmlFor="isActive">Employé actif</Label>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="skills" className="space-y-6">
            {/* Compétences */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Compétences</h3>
              
              <div className="flex gap-2">
                <Input
                  placeholder="Ajouter une compétence..."
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                />
                <Button onClick={addSkill}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {formData.skills?.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {skill}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-4 w-4 p-0 ml-2"
                      onClick={() => removeSkill(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Certifications</h3>
              
              <div className="flex gap-2">
                <Input
                  placeholder="Ajouter une certification..."
                  value={newCertification}
                  onChange={(e) => setNewCertification(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCertification()}
                />
                <Button onClick={addCertification}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {formData.certifications?.map((cert, index) => (
                  <Badge key={index} variant="outline" className="text-sm">
                    {cert}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-4 w-4 p-0 ml-2"
                      onClick={() => removeCertification(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Boutons d'action */}
        <div className="flex justify-end space-x-2 mt-6 pt-6 border-t">
          <Button variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            Annuler
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Enregistrer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};