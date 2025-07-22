
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Save, 
  Plus, 
  Trash2, 
  CalendarIcon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PersonalFile } from "../../../types/personalFile";
import { personalFileService } from "../../../services/personalFileService";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface PersonalFileFormProps {
  fileId?: string;
  onSave: (file: PersonalFile) => void;
  onCancel: () => void;
}

export const PersonalFileForm: React.FC<PersonalFileFormProps> = ({
  fileId,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState<Partial<PersonalFile>>({
    personalInfo: {
      firstName: '',
      lastName: '',
      dateOfBirth: new Date(),
      placeOfBirth: '',
      nationality: 'Algérienne',
      maritalStatus: 'celibataire',
      children: 0,
      nationalId: '',
      contact: {
        email: '',
        phone: '',
        emergencyContact: {
          name: '',
          relationship: '',
          phone: ''
        },
        address: {
          street: '',
          city: '',
          wilaya: '',
          postalCode: '',
          country: 'Algérie'
        }
      }
    },
    professionalInfo: {
      employeeId: '',
      startDate: new Date(),
      currentPosition: '',
      department: '',
      grade: '',
      echelon: 1,
      contractType: 'permanent',
      workSchedule: 'Temps plein',
      directSupervisor: '',
      workLocation: ''
    },
    employeeType: 'enseignant',
    education: [],
    experience: [],
    skills: {
      languages: [],
      technical: [],
      certifications: []
    }
  });

  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (fileId) {
      loadPersonalFile();
    }
  }, [fileId]);

  const loadPersonalFile = async () => {
    if (!fileId) return;
    
    setLoading(true);
    try {
      const file = await personalFileService.getPersonalFileById(fileId);
      if (file) {
        setFormData(file);
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger le dossier personnel",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let savedFile: PersonalFile;
      
      if (fileId) {
        savedFile = await personalFileService.updatePersonalFile(fileId, formData) as PersonalFile;
      } else {
        savedFile = await personalFileService.createPersonalFile(formData);
      }

      toast({
        title: "Succès",
        description: fileId ? "Dossier modifié avec succès" : "Dossier créé avec succès"
      });

      onSave(savedFile);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le dossier",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePersonalInfo = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo!,
        [field]: value
      }
    }));
  };

  const updateContact = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo!,
        contact: {
          ...prev.personalInfo!.contact,
          [field]: value
        }
      }
    }));
  };

  const updateAddress = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo!,
        contact: {
          ...prev.personalInfo!.contact,
          address: {
            ...prev.personalInfo!.contact.address,
            [field]: value
          }
        }
      }
    }));
  };

  const updateProfessionalInfo = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      professionalInfo: {
        ...prev.professionalInfo!,
        [field]: value
      }
    }));
  };

  const addEducation = () => {
    const newEducation = {
      id: `edu_${Date.now()}`,
      level: 'Licence' as const,
      field: '',
      institution: '',
      country: 'Algérie',
      startYear: new Date().getFullYear(),
      endYear: new Date().getFullYear(),
      isRecognized: true
    };

    setFormData(prev => ({
      ...prev,
      education: [...(prev.education || []), newEducation]
    }));
  };

  const removeEducation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education?.filter((_, i) => i !== index) || []
    }));
  };

  const updateEducation = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education?.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      ) || []
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {fileId ? 'Modifier le Dossier Personnel' : 'Nouveau Dossier Personnel'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end gap-2 mb-6">
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal">Personnel</TabsTrigger>
          <TabsTrigger value="professional">Professionnel</TabsTrigger>
          <TabsTrigger value="education">Formation</TabsTrigger>
          <TabsTrigger value="skills">Compétences</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informations Personnelles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input
                    id="firstName"
                    value={formData.personalInfo?.firstName || ''}
                    onChange={(e) => updatePersonalInfo('firstName', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Nom</Label>
                  <Input
                    id="lastName"
                    value={formData.personalInfo?.lastName || ''}
                    onChange={(e) => updatePersonalInfo('lastName', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Date de naissance</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.personalInfo?.dateOfBirth && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.personalInfo?.dateOfBirth ? (
                          format(formData.personalInfo.dateOfBirth, "PPP")
                        ) : (
                          <span>Sélectionner une date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.personalInfo?.dateOfBirth}
                        onSelect={(date) => updatePersonalInfo('dateOfBirth', date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label htmlFor="placeOfBirth">Lieu de naissance</Label>
                  <Input
                    id="placeOfBirth"
                    value={formData.personalInfo?.placeOfBirth || ''}
                    onChange={(e) => updatePersonalInfo('placeOfBirth', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nationality">Nationalité</Label>
                  <Input
                    id="nationality"
                    value={formData.personalInfo?.nationality || ''}
                    onChange={(e) => updatePersonalInfo('nationality', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="maritalStatus">État civil</Label>
                  <Select
                    value={formData.personalInfo?.maritalStatus || 'celibataire'}
                    onValueChange={(value) => updatePersonalInfo('maritalStatus', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="celibataire">Célibataire</SelectItem>
                      <SelectItem value="marie">Marié(e)</SelectItem>
                      <SelectItem value="divorce">Divorcé(e)</SelectItem>
                      <SelectItem value="veuf">Veuf/Veuve</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="children">Nombre d'enfants</Label>
                  <Input
                    id="children"
                    type="number"
                    min="0"
                    value={formData.personalInfo?.children || 0}
                    onChange={(e) => updatePersonalInfo('children', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="nationalId">Numéro CIN</Label>
                  <Input
                    id="nationalId"
                    value={formData.personalInfo?.nationalId || ''}
                    onChange={(e) => updatePersonalInfo('nationalId', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email professionnel</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.personalInfo?.contact.email || ''}
                    onChange={(e) => updateContact('email', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    value={formData.personalInfo?.contact.phone || ''}
                    onChange={(e) => updateContact('phone', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="street">Adresse</Label>
                <Input
                  id="street"
                  value={formData.personalInfo?.contact.address.street || ''}
                  onChange={(e) => updateAddress('street', e.target.value)}
                  placeholder="Rue"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">Ville</Label>
                  <Input
                    id="city"
                    value={formData.personalInfo?.contact.address.city || ''}
                    onChange={(e) => updateAddress('city', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="wilaya">Wilaya</Label>
                  <Input
                    id="wilaya"
                    value={formData.personalInfo?.contact.address.wilaya || ''}
                    onChange={(e) => updateAddress('wilaya', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="postalCode">Code postal</Label>
                  <Input
                    id="postalCode"
                    value={formData.personalInfo?.contact.address.postalCode || ''}
                    onChange={(e) => updateAddress('postalCode', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="professional" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informations Professionnelles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="employeeType">Type d'employé</Label>
                <Select
                  value={formData.employeeType || 'enseignant'}
                  onValueChange={(value: 'enseignant' | 'administratif') => 
                    setFormData(prev => ({ ...prev, employeeType: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="enseignant">Enseignant</SelectItem>
                    <SelectItem value="administratif">Personnel Administratif</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="employeeId">ID Employé</Label>
                  <Input
                    id="employeeId"
                    value={formData.professionalInfo?.employeeId || ''}
                    onChange={(e) => updateProfessionalInfo('employeeId', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="department">Département</Label>
                  <Input
                    id="department"
                    value={formData.professionalInfo?.department || ''}
                    onChange={(e) => updateProfessionalInfo('department', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="currentPosition">Poste actuel</Label>
                  <Input
                    id="currentPosition"
                    value={formData.professionalInfo?.currentPosition || ''}
                    onChange={(e) => updateProfessionalInfo('currentPosition', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="grade">Grade</Label>
                  <Input
                    id="grade"
                    value={formData.professionalInfo?.grade || ''}
                    onChange={(e) => updateProfessionalInfo('grade', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="echelon">Échelon</Label>
                  <Input
                    id="echelon"
                    type="number"
                    min="1"
                    max="12"
                    value={formData.professionalInfo?.echelon || 1}
                    onChange={(e) => updateProfessionalInfo('echelon', parseInt(e.target.value))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="contractType">Type de contrat</Label>
                  <Select
                    value={formData.professionalInfo?.contractType || 'permanent'}
                    onValueChange={(value) => updateProfessionalInfo('contractType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="permanent">Permanent</SelectItem>
                      <SelectItem value="temporary">Temporaire</SelectItem>
                      <SelectItem value="vacation">Vacation</SelectItem>
                      <SelectItem value="titulaire">Titulaire</SelectItem>
                      <SelectItem value="vacataire">Vacataire</SelectItem>
                      <SelectItem value="contractuel">Contractuel</SelectItem>
                      <SelectItem value="stagiaire">Stagiaire</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="directSupervisor">Supérieur direct</Label>
                  <Input
                    id="directSupervisor"
                    value={formData.professionalInfo?.directSupervisor || ''}
                    onChange={(e) => updateProfessionalInfo('directSupervisor', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="workLocation">Lieu de travail</Label>
                  <Input
                    id="workLocation"
                    value={formData.professionalInfo?.workLocation || ''}
                    onChange={(e) => updateProfessionalInfo('workLocation', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="education" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Formation et Diplômes</CardTitle>
                <Button type="button" onClick={addEducation}>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.education?.map((edu, index) => (
                <div key={edu.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Formation #{index + 1}</h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeEducation(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Niveau</Label>
                      <Select
                        value={edu.level}
                        onValueChange={(value) => updateEducation(index, 'level', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Licence">Licence</SelectItem>
                          <SelectItem value="Master">Master</SelectItem>
                          <SelectItem value="Doctorat">Doctorat</SelectItem>
                          <SelectItem value="HDR">HDR</SelectItem>
                          <SelectItem value="Diplome technique">Diplôme technique</SelectItem>
                          <SelectItem value="Autre">Autre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Spécialité</Label>
                      <Input
                        value={edu.field}
                        onChange={(e) => updateEducation(index, 'field', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Institution</Label>
                      <Input
                        value={edu.institution}
                        onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Pays</Label>
                      <Input
                        value={edu.country}
                        onChange={(e) => updateEducation(index, 'country', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Année de début</Label>
                      <Input
                        type="number"
                        value={edu.startYear}
                        onChange={(e) => updateEducation(index, 'startYear', parseInt(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label>Année de fin</Label>
                      <Input
                        type="number"
                        value={edu.endYear}
                        onChange={(e) => updateEducation(index, 'endYear', parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compétences et Langues</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-slate-500">Section des compétences en développement</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </form>
  );
};
