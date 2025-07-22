
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Edit, FileText, Phone, Mail, MapPin, GraduationCap, CreditCard, Download, Upload, CheckCircle, AlertTriangle } from "lucide-react";
import { DocumentManager } from "./DocumentManager";

interface StudentRecordProps {
  studentId: string;
  onBack: () => void;
}

export const StudentRecord = ({ studentId, onBack }: StudentRecordProps) => {
  // Données simulées pour l'exemple
  const studentData = {
    id: "ETU-2024-001",
    firstName: "Sarah",
    lastName: "Benhamou",
    photo: "/placeholder.svg",
    
    // Données Personnelles
    personalData: {
      dateOfBirth: "1998-03-15",
      placeOfBirth: "Alger",
      nationality: "Algérienne",
      gender: "Féminin",
      maritalStatus: "Célibataire",
      
      // Adresses
      homeAddress: {
        street: "12 Rue des Martyrs",
        city: "Alger",
        postalCode: "16000",
        wilaya: "Alger"
      },
      parentsAddress: {
        street: "45 Avenue de l'Indépendance", 
        city: "Blida",
        postalCode: "09000",
        wilaya: "Blida"
      },
      
      // Contacts
      phone: "0555-123-456",
      email: "sarah.benhamou@univ-alger3.dz",
      parentPhone: "0777-987-654",
      emergencyContact: "0666-555-444",
      
      // Situation familiale
      fatherName: "Ahmed Benhamou",
      fatherProfession: "Ingénieur",
      motherName: "Fatima Benhamou",
      motherProfession: "Enseignante",
      familyIncome: "Moyen"
    },
    
    // Données Académiques
    academicData: {
      baccalaureate: {
        series: "Sciences Expérimentales",
        year: "2020",
        grade: "Bien",
        establishment: "Lycée Ibn Khaldoun",
        average: "14.25"
      },
      previousEducation: [
        {
          institution: "Université d'Alger 1",
          year: "2020-2021",
          level: "L1 Biologie",
          result: "Échec",
          reason: "Réorientation"
        }
      ],
      languages: [
        { language: "Arabe", level: "Natif" },
        { language: "Français", level: "Courant" },
        { language: "Anglais", level: "Intermédiaire" },
        { language: "Espagnol", level: "Débutant" }
      ],
      skills: ["Informatique bureautique", "Comptabilité", "Analyse statistique"],
      professionalProject: "Devenir analyste financière dans une banque internationale"
    },
    
    // Données Administratives
    administrativeData: {
      registrationNumber: "ETU-2024-001",
      academicYear: "2023-2024",
      level: "L3",
      department: "Économie",
      specialization: "Économie Monétaire et Financière",
      status: "Actif",
      scholarship: true,
      scholarshipType: "Mérite académique",
      tuitionPaid: true,
      tuitionAmount: "15000 DA",
      paymentDate: "2023-09-15",
      insurance: "CNAS",
      insuranceNumber: "123456789012",
      studentCard: {
        issued: true,
        issueDate: "2023-09-20",
        expiryDate: "2024-09-20"
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <div className="flex items-center gap-4 flex-1">
          <Avatar className="h-16 w-16">
            <AvatarImage src={studentData.photo} />
            <AvatarFallback>{studentData.firstName[0]}{studentData.lastName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {studentData.firstName} {studentData.lastName}
            </h1>
            <p className="text-slate-600">{studentData.id}</p>
            <div className="flex gap-2 mt-1">
              <Badge className="bg-blue-100 text-blue-800">
                {studentData.administrativeData.level} {studentData.administrativeData.department}
              </Badge>
              {studentData.administrativeData.scholarship && (
                <Badge className="bg-green-100 text-green-800">Boursier</Badge>
              )}
            </div>
          </div>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Edit className="h-4 w-4 mr-2" />
          Modifier
        </Button>
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal">Données Personnelles</TabsTrigger>
          <TabsTrigger value="academic">Données Académiques</TabsTrigger>
          <TabsTrigger value="administrative">Données Administratives</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* État Civil */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  État Civil
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Date de naissance</p>
                    <p className="font-medium">{new Date(studentData.personalData.dateOfBirth).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Lieu de naissance</p>
                    <p className="font-medium">{studentData.personalData.placeOfBirth}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Nationalité</p>
                    <p className="font-medium">{studentData.personalData.nationality}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Genre</p>
                    <p className="font-medium">{studentData.personalData.gender}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Situation familiale</p>
                    <p className="font-medium">{studentData.personalData.maritalStatus}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contacts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Informations de Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-slate-500" />
                  <span>{studentData.personalData.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-slate-500" />
                  <span>{studentData.personalData.email}</span>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Téléphone parents</p>
                  <p className="font-medium">{studentData.personalData.parentPhone}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Contact d'urgence</p>
                  <p className="font-medium">{studentData.personalData.emergencyContact}</p>
                </div>
              </CardContent>
            </Card>

            {/* Adresses */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Adresses
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-1">Domicile</p>
                  <p className="text-sm text-slate-600">
                    {studentData.personalData.homeAddress.street}<br />
                    {studentData.personalData.homeAddress.postalCode} {studentData.personalData.homeAddress.city}<br />
                    {studentData.personalData.homeAddress.wilaya}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-1">Adresse des parents</p>
                  <p className="text-sm text-slate-600">
                    {studentData.personalData.parentsAddress.street}<br />
                    {studentData.personalData.parentsAddress.postalCode} {studentData.personalData.parentsAddress.city}<br />
                    {studentData.personalData.parentsAddress.wilaya}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Situation Familiale */}
            <Card>
              <CardHeader>
                <CardTitle>Situation Familiale</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-slate-500">Père</p>
                  <p className="font-medium">{studentData.personalData.fatherName}</p>
                  <p className="text-sm text-slate-600">{studentData.personalData.fatherProfession}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Mère</p>
                  <p className="font-medium">{studentData.personalData.motherName}</p>
                  <p className="text-sm text-slate-600">{studentData.personalData.motherProfession}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Revenu familial</p>
                  <p className="font-medium">{studentData.personalData.familyIncome}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="academic" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Baccalauréat */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Baccalauréat
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Série</p>
                    <p className="font-medium">{studentData.academicData.baccalaureate.series}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Année</p>
                    <p className="font-medium">{studentData.academicData.baccalaureate.year}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Mention</p>
                    <p className="font-medium">{studentData.academicData.baccalaureate.grade}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Moyenne</p>
                    <p className="font-medium">{studentData.academicData.baccalaureate.average}/20</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Établissement</p>
                  <p className="font-medium">{studentData.academicData.baccalaureate.establishment}</p>
                </div>
              </CardContent>
            </Card>

            {/* Langues */}
            <Card>
              <CardHeader>
                <CardTitle>Niveau de Langues</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {studentData.academicData.languages.map((lang, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="font-medium">{lang.language}</span>
                      <Badge variant="outline">{lang.level}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Parcours Antérieur */}
            <Card>
              <CardHeader>
                <CardTitle>Parcours Antérieur</CardTitle>
              </CardHeader>
              <CardContent>
                {studentData.academicData.previousEducation.map((edu, index) => (
                  <div key={index} className="border-l-2 border-slate-200 pl-4 pb-4">
                    <p className="font-medium">{edu.institution}</p>
                    <p className="text-sm text-slate-600">{edu.level} ({edu.year})</p>
                    <p className="text-sm text-slate-500">{edu.result} - {edu.reason}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Compétences et Projet */}
            <Card>
              <CardHeader>
                <CardTitle>Compétences & Projet Professionnel</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-slate-500 mb-2">Compétences particulières</p>
                  <div className="flex flex-wrap gap-2">
                    {studentData.academicData.skills.map((skill, index) => (
                      <Badge key={index} variant="outline">{skill}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-2">Projet professionnel</p>
                  <p className="text-sm">{studentData.academicData.professionalProject}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="administrative" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Inscription */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Informations d'Inscription
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Numéro d'inscription</p>
                    <p className="font-medium">{studentData.administrativeData.registrationNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Année académique</p>
                    <p className="font-medium">{studentData.administrativeData.academicYear}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Niveau</p>
                    <p className="font-medium">{studentData.administrativeData.level}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Département</p>
                    <p className="font-medium">{studentData.administrativeData.department}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Spécialisation</p>
                  <p className="font-medium">{studentData.administrativeData.specialization}</p>
                </div>
              </CardContent>
            </Card>

            {/* Statut et Bourse */}
            <Card>
              <CardHeader>
                <CardTitle>Statut et Bourse</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-slate-500">Statut</p>
                  <Badge className="bg-green-100 text-green-800">{studentData.administrativeData.status}</Badge>
                </div>
                {studentData.administrativeData.scholarship && (
                  <div>
                    <p className="text-sm text-slate-500">Type de bourse</p>
                    <p className="font-medium">{studentData.administrativeData.scholarshipType}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Droits d'inscription */}
            <Card>
              <CardHeader>
                <CardTitle>Droits d'Inscription</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  {studentData.administrativeData.tuitionPaid ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                  )}
                  <span className={studentData.administrativeData.tuitionPaid ? "text-green-600" : "text-amber-600"}>
                    {studentData.administrativeData.tuitionPaid ? "Payé" : "Non payé"}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Montant</p>
                  <p className="font-medium">{studentData.administrativeData.tuitionAmount}</p>
                </div>
                {studentData.administrativeData.paymentDate && (
                  <div>
                    <p className="text-sm text-slate-500">Date de paiement</p>
                    <p className="font-medium">{new Date(studentData.administrativeData.paymentDate).toLocaleDateString('fr-FR')}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Assurance et Carte */}
            <Card>
              <CardHeader>
                <CardTitle>Assurance et Carte Étudiant</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-slate-500">Assurance</p>
                  <p className="font-medium">{studentData.administrativeData.insurance}</p>
                  <p className="text-sm text-slate-600">N° {studentData.administrativeData.insuranceNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Carte d'étudiant</p>
                  <div className="flex items-center gap-2">
                    {studentData.administrativeData.studentCard.issued ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                    )}
                    <span className={studentData.administrativeData.studentCard.issued ? "text-green-600" : "text-amber-600"}>
                      {studentData.administrativeData.studentCard.issued ? "Délivrée" : "Non délivrée"}
                    </span>
                  </div>
                  {studentData.administrativeData.studentCard.issued && (
                    <p className="text-sm text-slate-600">
                      Émise le {new Date(studentData.administrativeData.studentCard.issueDate).toLocaleDateString('fr-FR')} 
                      - Expire le {new Date(studentData.administrativeData.studentCard.expiryDate).toLocaleDateString('fr-FR')}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <DocumentManager studentId={studentId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
