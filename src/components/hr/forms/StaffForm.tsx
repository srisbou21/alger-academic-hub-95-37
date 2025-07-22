
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, User, Briefcase, GraduationCap, Star, TrendingUp, Folder } from "lucide-react";
import { AdministrativeStaff } from "../../../types/administrative";
import { administrativeService } from "../../../services/administrativeService";
import { useToast } from "@/hooks/use-toast";

interface StaffFormProps {
  staffId?: string;
  onSave: (data: any) => void;
  onCancel: () => void;
}

export const StaffForm: React.FC<StaffFormProps> = ({ staffId, onSave, onCancel }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [formData, setFormData] = useState({
    // Informations personnelles
    firstName: '',
    lastName: '',
    firstNameArabic: '',
    lastNameArabic: '',
    civility: 'M.' as 'M.' | 'Mme' | 'Mlle',
    email: '',
    phone: '',
    dateOfBirth: '',
    placeOfBirth: '',
    placeOfBirthArabic: '',
    nationality: 'Algérienne',
    nationalId: '',
    socialSecurityNumber: '',
    ccpAccount: '',
    bloodType: '' as 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | '',
    rfidCardNumber: '',
    photo: '',
    affiliationDate: '',
    familyStatus: 'celibataire' as 'celibataire' | 'marie' | 'divorce' | 'veuf',
    numberOfChildren: 0,
    nationalService: {
      status: 'effectue' as 'effectue' | 'exempte' | 'reporte' | 'en_cours',
      startDate: '',
      endDate: '',
      militaryNumber: ''
    },
    address: {
      street: '',
      city: '',
      wilaya: '',
      postalCode: ''
    },
    // Informations professionnelles
    employeeId: '',
    position: '',
    grade: 'grade_1' as 'hors_grade' | 'grade_1' | 'grade_2' | 'grade_3' | 'grade_4' | 'grade_5' | 'grade_6' | 'grade_7' | 'grade_8' | 'grade_9' | 'grade_10' | 'grade_11' | 'grade_12' | 'grade_13' | 'grade_14' | 'grade_15' | 'grade_16' | 'grade_17' | 'grade_18' | 'grade_19' | 'grade_20',
    gradeCategory: 'administratif' as 'administratif' | 'technique' | 'service' | 'medical' | 'enseignement_superieur',
    gradeDetails: 'agent_dadministration' as any,
    echelon: 1,
    service: '',
    hireDate: '',
    tenureDate: '',
    contractType: 'titulaire' as 'titulaire' | 'vacataire' | 'contractuel' | 'stagiaire',
    status: 'active' as 'active' | 'inactive' | 'suspended' | 'retired' | 'terminated',
    supervisor: '',
    workSchedule: {
      type: 'full_time' as 'full_time' | 'part_time' | 'flexible',
      hoursPerWeek: 40,
      workDays: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi']
    },
    // Parcours professionnel
    careerPath: '',
    // Documents numériques
    digitalDocuments: '',
    // Compétences
    languages: '',
    certifications: '',
    computerSkills: '',
    specialSkills: ''
  });

  useEffect(() => {
    if (staffId) {
      loadStaffData();
    }
  }, [staffId]);

  const loadStaffData = async () => {
    if (!staffId) return;
    
    setLoading(true);
    try {
      const staff = await administrativeService.getStaffById(staffId);
      setFormData({
        firstName: staff.personalInfo.firstName,
        lastName: staff.personalInfo.lastName,
        firstNameArabic: staff.personalInfo.firstNameArabic || '',
        lastNameArabic: staff.personalInfo.lastNameArabic || '',
        civility: staff.personalInfo.civility,
        email: staff.personalInfo.email,
        phone: staff.personalInfo.phone,
        dateOfBirth: staff.personalInfo.dateOfBirth.toISOString().split('T')[0],
        placeOfBirth: staff.personalInfo.placeOfBirth,
        placeOfBirthArabic: staff.personalInfo.placeOfBirthArabic || '',
        nationality: staff.personalInfo.nationality,
        nationalId: staff.personalInfo.nationalId,
        socialSecurityNumber: staff.personalInfo.socialSecurityNumber || '',
        ccpAccount: staff.personalInfo.ccpAccount || '',
        bloodType: staff.personalInfo.bloodType || '',
        rfidCardNumber: staff.personalInfo.rfidCardNumber || '',
        photo: staff.personalInfo.photo || '',
        affiliationDate: staff.personalInfo.affiliationDate?.toISOString().split('T')[0] || '',
        familyStatus: staff.personalInfo.familyStatus,
        numberOfChildren: staff.personalInfo.numberOfChildren,
        nationalService: {
          status: staff.personalInfo.nationalService?.status || 'effectue',
          startDate: staff.personalInfo.nationalService?.startDate?.toISOString().split('T')[0] || '',
          endDate: staff.personalInfo.nationalService?.endDate?.toISOString().split('T')[0] || '',
          militaryNumber: staff.personalInfo.nationalService?.militaryNumber || ''
        },
        address: staff.personalInfo.address,
        employeeId: staff.professionalInfo.employeeId,
        position: staff.professionalInfo.position,
        grade: staff.professionalInfo.grade,
        gradeCategory: staff.professionalInfo.gradeCategory,
        gradeDetails: staff.professionalInfo.gradeDetails,
        echelon: staff.professionalInfo.echelon,
        service: staff.professionalInfo.service,
        hireDate: staff.professionalInfo.hireDate.toISOString().split('T')[0],
        tenureDate: staff.professionalInfo.tenureDate?.toISOString().split('T')[0] || '',
        contractType: staff.professionalInfo.contractType,
        status: staff.professionalInfo.status,
        supervisor: staff.professionalInfo.supervisor || '',
        workSchedule: staff.professionalInfo.workSchedule,
        careerPath: '', // À compléter selon les données existantes
        digitalDocuments: '', // À compléter selon les données existantes
        languages: staff.skills.languages.join(', '),
        certifications: staff.skills.certifications.join(', '),
        computerSkills: staff.skills.computerSkills.join(', '),
        specialSkills: staff.skills.specialSkills.join(', ')
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les données du personnel",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const staffData: Omit<AdministrativeStaff, 'id' | 'createdAt' | 'updatedAt'> = {
      personalInfo: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        firstNameArabic: formData.firstNameArabic || undefined,
        lastNameArabic: formData.lastNameArabic || undefined,
        civility: formData.civility,
        email: formData.email,
        phone: formData.phone,
        dateOfBirth: new Date(formData.dateOfBirth),
        placeOfBirth: formData.placeOfBirth,
        placeOfBirthArabic: formData.placeOfBirthArabic || undefined,
        nationality: formData.nationality,
        nationalId: formData.nationalId,
        socialSecurityNumber: formData.socialSecurityNumber || undefined,
        ccpAccount: formData.ccpAccount || undefined,
        bloodType: formData.bloodType || undefined,
        rfidCardNumber: formData.rfidCardNumber || undefined,
        photo: formData.photo || undefined,
        affiliationDate: formData.affiliationDate ? new Date(formData.affiliationDate) : undefined,
        familyStatus: formData.familyStatus,
        numberOfChildren: formData.numberOfChildren,
        nationalService: formData.nationalService.status ? {
          status: formData.nationalService.status,
          startDate: formData.nationalService.startDate ? new Date(formData.nationalService.startDate) : undefined,
          endDate: formData.nationalService.endDate ? new Date(formData.nationalService.endDate) : undefined,
          militaryNumber: formData.nationalService.militaryNumber || undefined
        } : undefined,
        address: formData.address
      },
      professionalInfo: {
        employeeId: formData.employeeId,
        position: formData.position,
        grade: formData.grade,
        gradeCategory: formData.gradeCategory,
        gradeDetails: formData.gradeDetails,
        echelon: formData.echelon,
        echelonHistory: [],
        service: formData.service,
        hireDate: new Date(formData.hireDate),
        tenureDate: formData.tenureDate ? new Date(formData.tenureDate) : undefined,
        contractType: formData.contractType,
        status: formData.status,
        supervisor: formData.supervisor || undefined,
        workSchedule: formData.workSchedule
      },
      education: [],
      salaryInfo: {
        baseSalary: 0,
        allowances: {},
        totalSalary: 0,
        paymentMethod: 'bank_transfer'
      },
      skills: {
        languages: formData.languages.split(',').map(s => s.trim()).filter(s => s),
        certifications: formData.certifications.split(',').map(s => s.trim()).filter(s => s),
        computerSkills: formData.computerSkills.split(',').map(s => s.trim()).filter(s => s),
        specialSkills: formData.specialSkills.split(',').map(s => s.trim()).filter(s => s)
      },
      performance: {
        strengths: [],
        areasForImprovement: [],
        goals: []
      }
    };

    onSave(staffData);
  };

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as any),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-slate-500">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onCancel}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <div>
              <CardTitle>{staffId ? 'Modifier le personnel' : 'Nouveau personnel'}</CardTitle>
              <p className="text-slate-600">
                {staffId ? 'Modifiez les informations du personnel administratif' : 'Ajoutez un nouveau membre du personnel administratif'}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="personal" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Personnel
                </TabsTrigger>
                <TabsTrigger value="professional" className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Professionnel
                </TabsTrigger>
                <TabsTrigger value="career" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Parcours
                </TabsTrigger>
                <TabsTrigger value="documents" className="flex items-center gap-2">
                  <Folder className="h-4 w-4" />
                  Documents
                </TabsTrigger>
                <TabsTrigger value="skills" className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Compétences
                </TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-4 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="civility">Civilité *</Label>
                    <Select value={formData.civility} onValueChange={(value) => handleInputChange('civility', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="M.">M.</SelectItem>
                        <SelectItem value="Mme">Mme</SelectItem>
                        <SelectItem value="Mlle">Mlle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="firstNameArabic">الاسم بالعربية</Label>
                    <Input
                      id="firstNameArabic"
                      value={formData.firstNameArabic}
                      onChange={(e) => handleInputChange('firstNameArabic', e.target.value)}
                      placeholder="الاسم الأول"
                      dir="rtl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastNameArabic">اللقب بالعربية</Label>
                    <Input
                      id="lastNameArabic"
                      value={formData.lastNameArabic}
                      onChange={(e) => handleInputChange('lastNameArabic', e.target.value)}
                      placeholder="اللقب"
                      dir="rtl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date de naissance *</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="placeOfBirth">Lieu de naissance</Label>
                    <Input
                      id="placeOfBirth"
                      value={formData.placeOfBirth}
                      onChange={(e) => handleInputChange('placeOfBirth', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="placeOfBirthArabic">مكان الميلاد بالعربية</Label>
                    <Input
                      id="placeOfBirthArabic"
                      value={formData.placeOfBirthArabic}
                      onChange={(e) => handleInputChange('placeOfBirthArabic', e.target.value)}
                      placeholder="مكان الميلاد"
                      dir="rtl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nationality">Nationalité</Label>
                    <Input
                      id="nationality"
                      value={formData.nationality}
                      onChange={(e) => handleInputChange('nationality', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nationalId">Numéro d'identité nationale *</Label>
                    <Input
                      id="nationalId"
                      value={formData.nationalId}
                      onChange={(e) => handleInputChange('nationalId', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="socialSecurityNumber">Numéro sécurité sociale</Label>
                    <Input
                      id="socialSecurityNumber"
                      value={formData.socialSecurityNumber}
                      onChange={(e) => handleInputChange('socialSecurityNumber', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ccpAccount">Numéro CCP</Label>
                    <Input
                      id="ccpAccount"
                      value={formData.ccpAccount}
                      onChange={(e) => handleInputChange('ccpAccount', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bloodType">Groupe sanguin</Label>
                    <Select value={formData.bloodType} onValueChange={(value) => handleInputChange('bloodType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rfidCardNumber">Numéro carte RFID</Label>
                    <Input
                      id="rfidCardNumber"
                      value={formData.rfidCardNumber}
                      onChange={(e) => handleInputChange('rfidCardNumber', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="photo">Photo</Label>
                    <Input
                      id="photo"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleInputChange('photo', file.name);
                        }
                      }}
                    />
                    {formData.photo && (
                      <p className="text-xs text-muted-foreground">
                        Photo actuelle: {formData.photo}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="affiliationDate">Date d'affiliation</Label>
                    <Input
                      id="affiliationDate"
                      type="date"
                      value={formData.affiliationDate}
                      onChange={(e) => handleInputChange('affiliationDate', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="familyStatus">Situation familiale</Label>
                    <Select value={formData.familyStatus} onValueChange={(value) => handleInputChange('familyStatus', value)}>
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

                  <div className="space-y-2">
                    <Label htmlFor="numberOfChildren">Nombre d'enfants</Label>
                    <Input
                      id="numberOfChildren"
                      type="number"
                      min="0"
                      value={formData.numberOfChildren}
                      onChange={(e) => handleInputChange('numberOfChildren', parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>

                {/* Service National */}
                <div className="space-y-4 border-t pt-4">
                  <h4 className="font-semibold">Service National</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nationalServiceStatus">Statut</Label>
                      <Select 
                        value={formData.nationalService.status} 
                        onValueChange={(value) => handleInputChange('nationalService.status', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="effectue">Effectué</SelectItem>
                          <SelectItem value="exempte">Exempté</SelectItem>
                          <SelectItem value="reporte">Reporté</SelectItem>
                          <SelectItem value="en_cours">En cours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="militaryNumber">Numéro militaire</Label>
                      <Input
                        id="militaryNumber"
                        value={formData.nationalService.militaryNumber}
                        onChange={(e) => handleInputChange('nationalService.militaryNumber', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nationalServiceStart">Date de début</Label>
                      <Input
                        id="nationalServiceStart"
                        type="date"
                        value={formData.nationalService.startDate}
                        onChange={(e) => handleInputChange('nationalService.startDate', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nationalServiceEnd">Date de fin</Label>
                      <Input
                        id="nationalServiceEnd"
                        type="date"
                        value={formData.nationalService.endDate}
                        onChange={(e) => handleInputChange('nationalService.endDate', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Adresse */}
                <div className="space-y-4 border-t pt-4">
                  <h4 className="font-semibold">Adresse</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="street">Rue</Label>
                      <Input
                        id="street"
                        value={formData.address.street}
                        onChange={(e) => handleInputChange('address.street', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">Ville</Label>
                      <Input
                        id="city"
                        value={formData.address.city}
                        onChange={(e) => handleInputChange('address.city', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="wilaya">Wilaya</Label>
                      <Input
                        id="wilaya"
                        value={formData.address.wilaya}
                        onChange={(e) => handleInputChange('address.wilaya', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Code postal</Label>
                      <Input
                        id="postalCode"
                        value={formData.address.postalCode}
                        onChange={(e) => handleInputChange('address.postalCode', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="professional" className="space-y-4 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="employeeId">ID Employé *</Label>
                    <Input
                      id="employeeId"
                      value={formData.employeeId}
                      onChange={(e) => handleInputChange('employeeId', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="position">Poste *</Label>
                    <Input
                      id="position"
                      value={formData.position}
                      onChange={(e) => handleInputChange('position', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="service">Service *</Label>
                    <Select value={formData.service} onValueChange={(value) => handleInputChange('service', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Scolarité">Scolarité</SelectItem>
                        <SelectItem value="Ressources Humaines">Ressources Humaines</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                        <SelectItem value="Sécurité">Sécurité</SelectItem>
                        <SelectItem value="Bibliothèque">Bibliothèque</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contractType">Type de contrat</Label>
                    <Select value={formData.contractType} onValueChange={(value) => handleInputChange('contractType', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="titulaire">Titulaire</SelectItem>
                        <SelectItem value="vacataire">Vacataire</SelectItem>
                        <SelectItem value="contractuel">Contractuel</SelectItem>
                        <SelectItem value="stagiaire">Stagiaire</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                   <div className="space-y-2">
                     <Label htmlFor="gradeCategory">Catégorie</Label>
                     <Select value={formData.gradeCategory} onValueChange={(value) => handleInputChange('gradeCategory', value)}>
                       <SelectTrigger>
                         <SelectValue placeholder="Sélectionner une catégorie" />
                       </SelectTrigger>
                       <SelectContent>
                         <SelectItem value="administratif">Personnel Administratif</SelectItem>
                         <SelectItem value="technique">Personnel Technique</SelectItem>
                         <SelectItem value="service">Personnel de Service</SelectItem>
                         <SelectItem value="medical">Personnel Médical</SelectItem>
                         <SelectItem value="enseignement_superieur">Personnel Universitaire</SelectItem>
                       </SelectContent>
                     </Select>
                   </div>

                   <div className="space-y-2">
                     <Label htmlFor="grade">Grade (Fonction Publique Algérienne)</Label>
                     <Select value={formData.grade} onValueChange={(value) => handleInputChange('grade', value)}>
                       <SelectTrigger>
                         <SelectValue placeholder="Sélectionner un grade" />
                       </SelectTrigger>
                       <SelectContent>
                         <SelectItem value="hors_grade">Hors Grade</SelectItem>
                         <SelectItem value="grade_1">Grade 1 - Agent/Secrétaire d'archives</SelectItem>
                         <SelectItem value="grade_2">Grade 2 - Agent d'administration</SelectItem>
                         <SelectItem value="grade_3">Grade 3 - Secrétaire d'administration</SelectItem>
                         <SelectItem value="grade_4">Grade 4 - Adjoint d'administration</SelectItem>
                         <SelectItem value="grade_5">Grade 5 - Adjoint d'administration principal</SelectItem>
                         <SelectItem value="grade_6">Grade 6 - Contrôleur d'administration</SelectItem>
                         <SelectItem value="grade_7">Grade 7 - Contrôleur d'administration principal</SelectItem>
                         <SelectItem value="grade_8">Grade 8 - Inspecteur d'administration</SelectItem>
                         <SelectItem value="grade_9">Grade 9 - Inspecteur d'administration principal</SelectItem>
                         <SelectItem value="grade_10">Grade 10 - Inspecteur d'administration central</SelectItem>
                         <SelectItem value="grade_11">Grade 11 - Administrateur</SelectItem>
                         <SelectItem value="grade_12">Grade 12 - Administrateur principal</SelectItem>
                         <SelectItem value="grade_13">Grade 13 - Administrateur en chef</SelectItem>
                         <SelectItem value="grade_14">Grade 14</SelectItem>
                         <SelectItem value="grade_15">Grade 15</SelectItem>
                         <SelectItem value="grade_16">Grade 16</SelectItem>
                         <SelectItem value="grade_17">Grade 17</SelectItem>
                         <SelectItem value="grade_18">Grade 18</SelectItem>
                         <SelectItem value="grade_19">Grade 19</SelectItem>
                         <SelectItem value="grade_20">Grade 20</SelectItem>
                       </SelectContent>
                     </Select>
                   </div>

                   <div className="space-y-2">
                     <Label htmlFor="gradeDetails">Intitulé du poste</Label>
                     <Select value={formData.gradeDetails} onValueChange={(value) => handleInputChange('gradeDetails', value)}>
                       <SelectTrigger>
                         <SelectValue placeholder="Sélectionner l'intitulé" />
                       </SelectTrigger>
                       <SelectContent>
                         {/* Grades administratifs */}
                         <SelectItem value="secretaire_darchives_documentaliste">Secrétaire d'archives/Documentaliste</SelectItem>
                         <SelectItem value="agent_dadministration">Agent d'administration</SelectItem>
                         <SelectItem value="secretaire_dadministration">Secrétaire d'administration</SelectItem>
                         <SelectItem value="adjoint_dadministration">Adjoint d'administration</SelectItem>
                         <SelectItem value="adjoint_dadministration_principal">Adjoint d'administration principal</SelectItem>
                         <SelectItem value="controleur_dadministration">Contrôleur d'administration</SelectItem>
                         <SelectItem value="controleur_dadministration_principal">Contrôleur d'administration principal</SelectItem>
                         <SelectItem value="inspecteur_dadministration">Inspecteur d'administration</SelectItem>
                         <SelectItem value="inspecteur_dadministration_principal">Inspecteur d'administration principal</SelectItem>
                         <SelectItem value="inspecteur_dadministration_central">Inspecteur d'administration central</SelectItem>
                         <SelectItem value="administrateur">Administrateur</SelectItem>
                         <SelectItem value="administrateur_principal">Administrateur principal</SelectItem>
                         <SelectItem value="administrateur_en_chef">Administrateur en chef</SelectItem>
                         
                         {/* Grades techniques */}
                         <SelectItem value="agent_technique">Agent technique</SelectItem>
                         <SelectItem value="ouvrier_professionnel_1ere_categorie">Ouvrier professionnel 1ère catégorie</SelectItem>
                         <SelectItem value="ouvrier_professionnel_2eme_categorie">Ouvrier professionnel 2ème catégorie</SelectItem>
                         <SelectItem value="ouvrier_professionnel_3eme_categorie">Ouvrier professionnel 3ème catégorie</SelectItem>
                         <SelectItem value="conducteur_de_travaux">Conducteur de travaux</SelectItem>
                         <SelectItem value="technicien">Technicien</SelectItem>
                         <SelectItem value="technicien_principal">Technicien principal</SelectItem>
                         <SelectItem value="technicien_en_chef">Technicien en chef</SelectItem>
                         <SelectItem value="ingenieur_dapplication">Ingénieur d'application</SelectItem>
                         <SelectItem value="ingenieur_detudes">Ingénieur d'études</SelectItem>
                         <SelectItem value="ingenieur_principal">Ingénieur principal</SelectItem>
                         <SelectItem value="ingenieur_en_chef">Ingénieur en chef</SelectItem>
                         
                         {/* Grades de service */}
                         <SelectItem value="agent_de_service">Agent de service</SelectItem>
                         <SelectItem value="agent_de_service_principal">Agent de service principal</SelectItem>
                         <SelectItem value="chef_dequipe">Chef d'équipe</SelectItem>
                         <SelectItem value="surveillant_general">Surveillant général</SelectItem>
                         <SelectItem value="surveillant_general_principal">Surveillant général principal</SelectItem>
                         
                         {/* Grades médicaux */}
                         <SelectItem value="aide_soignant">Aide-soignant</SelectItem>
                         <SelectItem value="infirmier">Infirmier</SelectItem>
                         <SelectItem value="infirmier_principal">Infirmier principal</SelectItem>
                         <SelectItem value="infirmier_major">Infirmier major</SelectItem>
                         <SelectItem value="medecin_generaliste">Médecin généraliste</SelectItem>
                         <SelectItem value="medecin_specialiste">Médecin spécialiste</SelectItem>
                         <SelectItem value="medecin_professeur">Médecin professeur</SelectItem>
                         
                         {/* Grades enseignement supérieur */}
                         <SelectItem value="adjoint_technique_de_recherche">Adjoint technique de recherche</SelectItem>
                         <SelectItem value="technicien_de_recherche">Technicien de recherche</SelectItem>
                         <SelectItem value="assistant_de_recherche">Assistant de recherche</SelectItem>
                         <SelectItem value="ingenieur_de_recherche">Ingénieur de recherche</SelectItem>
                         <SelectItem value="ingenieur_de_recherche_principal">Ingénieur de recherche principal</SelectItem>
                         <SelectItem value="directeur_de_recherche">Directeur de recherche</SelectItem>
                       </SelectContent>
                     </Select>
                   </div>

                  <div className="space-y-2">
                    <Label htmlFor="echelon">Échelon</Label>
                    <Input
                      id="echelon"
                      type="number"
                      min="1"
                      max="12"
                      value={formData.echelon}
                      onChange={(e) => handleInputChange('echelon', parseInt(e.target.value) || 1)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hireDate">Date d'embauche *</Label>
                    <Input
                      id="hireDate"
                      type="date"
                      value={formData.hireDate}
                      onChange={(e) => handleInputChange('hireDate', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Statut</Label>
                    <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Actif</SelectItem>
                        <SelectItem value="inactive">Inactif</SelectItem>
                        <SelectItem value="suspended">Suspendu</SelectItem>
                        <SelectItem value="retired">Retraité</SelectItem>
                        <SelectItem value="terminated">Licencié</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="career" className="space-y-4 mt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Parcours Professionnel</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="careerPath">Parcours et évolution de carrière</Label>
                    <Textarea
                      id="careerPath"
                      value={formData.careerPath}
                      onChange={(e) => handleInputChange('careerPath', e.target.value)}
                      placeholder="Décrivez le parcours professionnel, les promotions, les changements de postes..."
                      rows={6}
                    />
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Informations</h4>
                    <p className="text-sm text-blue-700">
                      Ce champ permet de documenter l'évolution de carrière du personnel administratif,
                      incluant les promotions, changements de grade, formations suivies, et responsabilités assumées.
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="documents" className="space-y-4 mt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Documents Numériques</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="digitalDocuments">Documents du dossier administratif</Label>
                    <Textarea
                      id="digitalDocuments"
                      value={formData.digitalDocuments}
                      onChange={(e) => handleInputChange('digitalDocuments', e.target.value)}
                      placeholder="Liste des documents numérisés : CV, diplômes, certificats, attestations..."
                      rows={6}
                    />
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Documents Standards</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Copie CIN</li>
                      <li>• Acte de naissance</li>
                      <li>• Diplômes et certificats</li>
                      <li>• Certificat médical</li>
                      <li>• Photos d'identité</li>
                      <li>• Attestation de travail</li>
                      <li>• Fiche de paie</li>
                      <li>• Attestation de service national</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="skills" className="space-y-4 mt-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="languages">Langues</Label>
                    <Input
                      id="languages"
                      value={formData.languages}
                      onChange={(e) => handleInputChange('languages', e.target.value)}
                      placeholder="Arabe, Français, Anglais (séparés par des virgules)"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="certifications">Certifications</Label>
                    <Input
                      id="certifications"
                      value={formData.certifications}
                      onChange={(e) => handleInputChange('certifications', e.target.value)}
                      placeholder="Liste des certifications (séparées par des virgules)"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="computerSkills">Compétences informatiques</Label>
                    <Textarea
                      id="computerSkills"
                      value={formData.computerSkills}
                      onChange={(e) => handleInputChange('computerSkills', e.target.value)}
                      placeholder="Word, Excel, PowerPoint (séparées par des virgules)"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specialSkills">Compétences spécialisées</Label>
                    <Textarea
                      id="specialSkills"
                      value={formData.specialSkills}
                      onChange={(e) => handleInputChange('specialSkills', e.target.value)}
                      placeholder="Compétences particulières liées au poste"
                      rows={3}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-4 mt-6 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onCancel}>
                Annuler
              </Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                <Save className="h-4 w-4 mr-2" />
                {staffId ? 'Modifier' : 'Enregistrer'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
