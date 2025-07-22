import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Briefcase, GraduationCap, Save, X, TrendingUp, Folder } from "lucide-react";
import { Teacher, PersonalInfo, ProfessionalInfo, CareerPath, DigitalFolder } from "@/types/teacher";
import { PersonalInfoForm } from "./forms/PersonalInfoForm";
import { ProfessionalInfoForm } from "./forms/ProfessionalInfoForm";
import { AcademicInfoForm } from "./forms/AcademicInfoForm";
import { CareerPathForm } from "./forms/CareerPathForm";
import { DigitalFolderForm } from "./forms/DigitalFolderForm";

interface TeacherFormProps {
  teacher?: Teacher;
  loading?: boolean;
  onSave: (teacher: Partial<Teacher>) => void;
  onCancel: () => void;
}

export const TeacherForm: React.FC<TeacherFormProps> = ({
  teacher,
  loading = false,
  onSave,
  onCancel
}) => {
  const [personalInfo, setPersonalInfo] = useState<Partial<PersonalInfo>>({
    firstName: teacher?.firstName || "",
    lastName: teacher?.lastName || "",
    firstNameArabic: teacher?.personalInfo?.firstNameArabic || "",
    lastNameArabic: teacher?.personalInfo?.lastNameArabic || "",
    email: teacher?.email || "",
    phone: teacher?.phone || "",
    dateOfBirth: teacher?.personalInfo?.dateOfBirth || undefined,
    placeOfBirth: teacher?.personalInfo?.placeOfBirth || "",
    placeOfBirthArabic: teacher?.personalInfo?.placeOfBirthArabic || "",
    nationality: teacher?.personalInfo?.nationality || "Algérienne",
    nationalId: teacher?.personalInfo?.nationalId || "",
    familyStatus: teacher?.personalInfo?.familyStatus || "",
    numberOfChildren: teacher?.personalInfo?.numberOfChildren || 0,
    address: teacher?.personalInfo?.address || {
      street: "",
      city: "",
      wilaya: "",
      postalCode: ""
    }
  });

  const [professionalInfo, setProfessionalInfo] = useState<Partial<ProfessionalInfo>>({
    employeeId: teacher?.professionalInfo?.employeeId || "",
    currentGrade: teacher?.grade || "",
    currentEchelon: teacher?.echelon || 1,
    speciality: teacher?.specialty || "",
    department: teacher?.professionalInfo?.department || "",
    faculty: teacher?.professionalInfo?.faculty || "",
    hireDate: teacher?.hiringDate || undefined,
    contractType: teacher?.contractType || "CDI",
    status: teacher?.isActive ? "Actif" : "Inactif"
  });

  const [qualifications, setQualifications] = useState<string[]>(
    teacher?.qualifications || []
  );
  const [researchInterests, setResearchInterests] = useState<string[]>(
    teacher?.researchInterests || []
  );
  const [careerPath, setCareerPath] = useState<CareerPath[]>(
    teacher?.careerPath || []
  );
  const [digitalFolder, setDigitalFolder] = useState<DigitalFolder | undefined>(
    teacher?.digitalFolder
  );

  const handlePersonalInfoUpdate = (updates: Partial<PersonalInfo>) => {
    setPersonalInfo(prev => ({ ...prev, ...updates }));
  };

  const handleProfessionalInfoUpdate = (updates: Partial<ProfessionalInfo>) => {
    setProfessionalInfo(prev => ({ ...prev, ...updates }));
  };

  const handleSave = () => {
    // Validation des champs obligatoires
    if (!personalInfo.firstName || !personalInfo.lastName || !personalInfo.email || !professionalInfo.currentGrade || !professionalInfo.speciality) {
      console.error("Champs obligatoires manquants:", {
        firstName: personalInfo.firstName,
        lastName: personalInfo.lastName, 
        email: personalInfo.email,
        currentGrade: professionalInfo.currentGrade,
        speciality: professionalInfo.speciality
      });
      // Afficher un message d'erreur plus clair à l'utilisateur
      return;
    }

    const teacherData: Partial<Teacher> = {
      id: teacher?.id,
      firstName: personalInfo.firstName!,
      lastName: personalInfo.lastName!,
      email: personalInfo.email!,
      phone: personalInfo.phone,
      grade: professionalInfo.currentGrade as any,
      specialty: professionalInfo.speciality!,
      departmentId: "dept_default", // Valeur par défaut - à améliorer
      isActive: professionalInfo.status === "Actif",
      hiringDate: professionalInfo.hireDate || new Date(),
      echelon: professionalInfo.currentEchelon!,
      isExternal: false,
      contractType: professionalInfo.contractType as any,
      maxWeeklyHours: 16,
      currentWeeklyHours: 0,
      qualifications,
      researchInterests,
      careerPath,
      digitalFolder,
      personalInfo: {
        ...personalInfo,
        firstName: personalInfo.firstName!,
        lastName: personalInfo.lastName!,
        email: personalInfo.email!,
        dateOfBirth: personalInfo.dateOfBirth || new Date()
      } as PersonalInfo,
      professionalInfo: professionalInfo as ProfessionalInfo,
      createdAt: teacher?.createdAt || new Date(),
      updatedAt: new Date()
    };

    console.log("Données de l'enseignant à sauvegarder:", teacherData);
    onSave(teacherData);
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-6 w-6" />
          {teacher ? "Modifier l'enseignant" : "Nouvel enseignant"}
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
            <TabsTrigger value="academic">
              <GraduationCap className="h-4 w-4 mr-2" />
              Académique
            </TabsTrigger>
            <TabsTrigger value="documents">
              <Folder className="h-4 w-4 mr-2" />
              Documents
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-6">
            <PersonalInfoForm
              personalInfo={personalInfo}
              onUpdate={handlePersonalInfoUpdate}
            />
          </TabsContent>

          <TabsContent value="professional" className="space-y-6">
            <ProfessionalInfoForm
              professionalInfo={professionalInfo}
              onUpdate={handleProfessionalInfoUpdate}
            />
          </TabsContent>

          <TabsContent value="career" className="space-y-6">
            <CareerPathForm
              careerPath={careerPath}
              onUpdate={setCareerPath}
            />
          </TabsContent>

          <TabsContent value="academic" className="space-y-6">
            <AcademicInfoForm
              qualifications={qualifications}
              researchInterests={researchInterests}
              onQualificationsChange={setQualifications}
              onResearchInterestsChange={setResearchInterests}
            />
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <DigitalFolderForm
              digitalFolder={digitalFolder}
              onUpdate={setDigitalFolder}
            />
          </TabsContent>
        </Tabs>
        
        {/* Actions */}
        <div className="flex justify-end gap-2 mt-6 pt-6 border-t">
          <Button variant="outline" onClick={onCancel} disabled={loading}>
            <X className="h-4 w-4 mr-2" />
            Annuler
          </Button>
          <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700" disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? "Enregistrement..." : (teacher ? "Mettre à jour" : "Enregistrer")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};