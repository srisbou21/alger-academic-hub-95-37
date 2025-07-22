
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, User, GraduationCap, Briefcase, FileText, Calendar, Award } from "lucide-react";
import { Teacher } from "../../../types/teacher";

interface TeacherDetailedProfileProps {
  teacherId: string;
  onBack: () => void;
}

export const TeacherDetailedProfile: React.FC<TeacherDetailedProfileProps> = ({
  teacherId,
  onBack
}) => {
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTeacherData();
  }, [teacherId]);

  const loadTeacherData = async () => {
    // Simulation - remplacer par un appel API réel
    setLoading(false);
    // Mock data pour la démonstration
    setTeacher({
      id: teacherId,
      firstName: "Ahmed",
      lastName: "Benali",
      email: "a.benali@univ.dz",
      phone: "0555-123-456",
      grade: "Maître de Conférences A",
      specialty: "Informatique",
      departmentId: "dept_1",
      isActive: true,
      hiringDate: new Date("2010-09-01"),
      echelon: 3,
      lastPromotionDate: new Date("2017-09-01"),
      nextPromotionDate: new Date("2025-09-01"),
      isExternal: false,
      contractType: "CDI",
      maxWeeklyHours: 40,
      currentWeeklyHours: 35,
      qualifications: ["Doctorat en Informatique", "HDR"],
      researchInterests: ["Intelligence Artificielle", "Machine Learning"],
      publications: [
        {
          id: "pub1",
          title: "Advanced AI Techniques",
          type: "Article",
          year: 2023,
          journal: "Journal of AI Research"
        }
      ],
      createdAt: new Date("2010-09-01"),
      updatedAt: new Date(),
      personalInfo: {
        firstName: "Ahmed",
        lastName: "Benali",
        firstNameArabic: "أحمد",
        lastNameArabic: "بن علي",
        civility: "Dr.",
        email: "a.benali@univ.dz",
        phone: "0555-123-456",
        dateOfBirth: new Date("1975-05-15"),
        placeOfBirth: "Alger",
        nationality: "Algérienne",
        nationalId: "197505151234567",
        socialSecurityNumber: "123456789",
        affiliationDate: new Date("2010-09-01"),
        familyStatus: "marie",
        numberOfChildren: 2,
        ccpAccount: "12345678901",
        bloodType: "A+",
        rfidCardNumber: "RF123456",
        photo: "",
        nationalService: {
          status: "effectue",
          startDate: new Date("1998-01-01"),
          endDate: new Date("1999-12-31")
        },
        address: {
          street: "Rue de l'Université",
          city: "Alger",
          wilaya: "Alger",
          postalCode: "16000"
        }
      },
      professionalInfo: {
        employeeId: "ENG001",
        currentGrade: "Maître de Conférences A",
        currentEchelon: 3,
        speciality: "Informatique",
        department: "Informatique",
        faculty: "Sciences et Technologies",
        hireDate: new Date("2010-09-01"),
        tenureDate: new Date("2013-09-01"),
        contractType: "permanent",
        status: "active"
      },
      echelonHistory: [
        {
          echelon: 1,
          acquisitionDate: new Date("2010-09-01"),
          advancementType: "court",
          decision: "DEC001"
        },
        {
          echelon: 2,
          acquisitionDate: new Date("2013-09-01"),
          advancementType: "moyen",
          decision: "DEC002"
        },
        {
          echelon: 3,
          acquisitionDate: new Date("2017-09-01"),
          advancementType: "long",
          decision: "DEC003"
        }
      ],
      gradeHistory: [
        {
          grade: "Maître de Conférences B",
          acquisitionDate: new Date("2010-09-01"),
          endDate: new Date("2015-09-01"),
          decision: "GRADE001"
        },
        {
          grade: "Maître de Conférences A",
          acquisitionDate: new Date("2015-09-01"),
          decision: "GRADE002"
        }
      ],
      administrativePositions: [
        {
          id: "pos1",
          position: "Chef de département",
          startDate: new Date("2020-01-01"),
          endDate: new Date("2023-12-31"),
          isCurrent: false
        }
      ],
      education: [
        {
          id: "edu1",
          level: "Doctorat",
          field: "Informatique",
          institution: "Université d'Alger",
          country: "Algérie",
          graduationYear: 2005,
          isRecognized: true
        }
      ]
    });
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Chargement...</div>;
  }

  if (!teacher) {
    return <div className="flex items-center justify-center h-64">Enseignant non trouvé</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button onClick={onBack} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <h1 className="text-2xl font-bold">
          Profil de {teacher.personalInfo.firstName} {teacher.personalInfo.lastName}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations de base */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informations Personnelles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <User className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold">
                {teacher.personalInfo.civility} {teacher.personalInfo.firstName} {teacher.personalInfo.lastName}
              </h3>
              <p className="text-sm text-slate-600">
                {teacher.personalInfo.firstNameArabic} {teacher.personalInfo.lastNameArabic}
              </p>
            </div>
            
            <div className="space-y-2">
              <div>
                <span className="font-medium">Email:</span>
                <p className="text-sm text-slate-600">{teacher.personalInfo.email}</p>
              </div>
              <div>
                <span className="font-medium">Téléphone:</span>
                <p className="text-sm text-slate-600">{teacher.personalInfo.phone}</p>
              </div>
              <div>
                <span className="font-medium">Date de naissance:</span>
                <p className="text-sm text-slate-600">{teacher.personalInfo.dateOfBirth.toLocaleDateString()}</p>
              </div>
              <div>
                <span className="font-medium">Lieu de naissance:</span>
                <p className="text-sm text-slate-600">{teacher.personalInfo.placeOfBirth}</p>
              </div>
              <div>
                <span className="font-medium">Nationalité:</span>
                <p className="text-sm text-slate-600">{teacher.personalInfo.nationality}</p>
              </div>
              <div>
                <span className="font-medium">Situation familiale:</span>
                <p className="text-sm text-slate-600">{teacher.personalInfo.familyStatus}</p>
              </div>
              <div>
                <span className="font-medium">Nombre d'enfants:</span>
                <p className="text-sm text-slate-600">{teacher.personalInfo.numberOfChildren}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contenu principal */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="professional" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="professional">Professionnel</TabsTrigger>
              <TabsTrigger value="education">Formation</TabsTrigger>
              <TabsTrigger value="career">Carrière</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="professional" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Informations Professionnelles
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium">ID Employé:</span>
                      <p className="text-sm text-slate-600">{teacher.professionalInfo.employeeId}</p>
                    </div>
                    <div>
                      <span className="font-medium">Grade actuel:</span>
                      <p className="text-sm text-slate-600">{teacher.professionalInfo.currentGrade}</p>
                    </div>
                    <div>
                      <span className="font-medium">Échelon actuel:</span>
                      <p className="text-sm text-slate-600">{teacher.professionalInfo.currentEchelon}</p>
                    </div>
                    <div>
                      <span className="font-medium">Spécialité:</span>
                      <p className="text-sm text-slate-600">{teacher.professionalInfo.speciality}</p>
                    </div>
                    <div>
                      <span className="font-medium">Département:</span>
                      <p className="text-sm text-slate-600">{teacher.professionalInfo.department}</p>
                    </div>
                    <div>
                      <span className="font-medium">Faculté:</span>
                      <p className="text-sm text-slate-600">{teacher.professionalInfo.faculty}</p>
                    </div>
                    <div>
                      <span className="font-medium">Date d'embauche:</span>
                      <p className="text-sm text-slate-600">{teacher.professionalInfo.hireDate.toLocaleDateString()}</p>
                    </div>
                    {teacher.professionalInfo.tenureDate && (
                      <div>
                        <span className="font-medium">Date de titularisation:</span>
                        <p className="text-sm text-slate-600">{teacher.professionalInfo.tenureDate.toLocaleDateString()}</p>
                      </div>
                    )}
                    <div>
                      <span className="font-medium">Type de contrat:</span>
                      <Badge variant="outline">{teacher.professionalInfo.contractType}</Badge>
                    </div>
                    <div>
                      <span className="font-medium">Statut:</span>
                      <Badge className={teacher.professionalInfo.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {teacher.professionalInfo.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Postes administratifs */}
              {teacher.administrativePositions.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Postes Administratifs
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {teacher.administrativePositions.map((position) => (
                        <div key={position.id} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{position.position}</h4>
                            <Badge variant={position.isCurrent ? "default" : "outline"}>
                              {position.isCurrent ? "En cours" : "Terminé"}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600 mt-1">
                            Du {position.startDate.toLocaleDateString()} 
                            {position.endDate ? ` au ${position.endDate.toLocaleDateString()}` : " - En cours"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="education" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Formation et Diplômes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {teacher.education.map((edu) => (
                      <div key={edu.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{edu.level} en {edu.field}</h4>
                          <Badge variant={edu.isRecognized ? "default" : "outline"}>
                            {edu.isRecognized ? "Reconnu" : "Non reconnu"}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600">{edu.institution}, {edu.country}</p>
                        <p className="text-sm text-slate-500">Année d'obtention: {edu.graduationYear}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="career" className="space-y-4">
              {/* Historique des grades */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Historique des Grades
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {teacher.gradeHistory.map((grade, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{grade.grade}</h4>
                          <Badge variant={!grade.endDate ? "default" : "outline"}>
                            {!grade.endDate ? "Actuel" : "Précédent"}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 mt-1">
                          Du {grade.acquisitionDate.toLocaleDateString()}
                          {grade.endDate ? ` au ${grade.endDate.toLocaleDateString()}` : " - En cours"}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Historique des échelons */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Historique des Échelons
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {teacher.echelonHistory.map((echelon, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Échelon {echelon.echelon}</h4>
                          <Badge variant="outline">{echelon.advancementType}</Badge>
                        </div>
                        <p className="text-sm text-slate-600 mt-1">
                          Acquis le {echelon.acquisitionDate.toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Documents du Dossier
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-500 mb-4">Aucun document dans le dossier</p>
                    <Button>
                      Ajouter un document
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
