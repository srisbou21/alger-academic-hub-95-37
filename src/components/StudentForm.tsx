
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  generalInfo: z.object({
    firstName: z.string().min(2, { message: "Le prénom doit contenir au moins 2 caractères." }),
    lastName: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères." }),
    birthDate: z.date(),
    gender: z.enum(['male', 'female']),
    nationality: z.string().optional(),
    email: z.string().email({ message: "Adresse email invalide." }),
    phone: z.string().optional(),
    address: z.string().optional(),
  }),
  academicInfo: z.object({
    studentId: z.string().optional(),
    level: z.enum(['L1', 'L2', 'L3', 'M1', 'M2']),
    specialization: z.string().optional(),
    department: z.string().optional(),
    enrollmentDate: z.date(),
    graduationDate: z.date().optional(),
    status: z.enum(['active', 'graduated', 'suspended']),
  }),
  previousEducation: z.object({
    institution: z.string().optional(),
    year: z.string().optional(),
    degree: z.string().optional(),
    major: z.string().optional(),
  }),
  familyInfo: z.object({
    fatherName: z.string().optional(),
    motherName: z.string().optional(),
    familyStatus: z.enum(['married', 'single', 'divorced', 'widowed']).optional(),
    numSiblings: z.number().optional(),
  }),
  socialInfo: z.object({
    scholarship: z.enum(['oui', 'non']).optional(),
    disability: z.enum(['oui', 'non']).optional(),
    workingStudent: z.enum(['oui', 'non']).optional(),
  }),
  emergencyContact: z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    relationship: z.string().optional(),
  }),
  notes: z.string().optional(),
  fees: z.object({
    amount: z.number().optional(),
    paid: z.enum(['oui', 'non']).optional(),
  }),
});

type StudentFormValues = z.infer<typeof formSchema>;

interface StudentFormProps {
  onBack?: () => void;
}

export const StudentForm: React.FC<StudentFormProps> = ({ onBack }) => {
  const form = useForm<StudentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      generalInfo: {
        firstName: "",
        lastName: "",
        birthDate: new Date(),
        gender: 'male',
        nationality: "",
        email: "",
        phone: "",
        address: "",
      },
      academicInfo: {
        studentId: "",
        level: 'L1',
        specialization: "",
        department: "",
        enrollmentDate: new Date(),
        graduationDate: new Date(),
        status: 'active',
      },
      previousEducation: {
        institution: "",
        year: "",
        degree: "",
        major: "",
      },
      familyInfo: {
        fatherName: "",
        motherName: "",
        familyStatus: 'single',
        numSiblings: 0,
      },
      socialInfo: {
        scholarship: 'non',
        disability: 'non',
        workingStudent: 'non',
      },
      emergencyContact: {
        name: "",
        phone: "",
        relationship: "",
      },
      notes: "",
      fees: {
        amount: 0,
        paid: 'non',
      },
    },
  });

  const { handleSubmit, register, formState: { errors }, setValue } = form;

  const onSubmit = (values: StudentFormValues) => {
    console.log(values);
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Formulaire d'Inscription Étudiant</CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Informations Générales */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Informations Générales</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">Prénom</Label>
                <Input id="firstName" {...register("generalInfo.firstName")} />
                {errors.generalInfo?.firstName && (
                  <p className="text-red-500 text-sm">{errors.generalInfo.firstName.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="lastName">Nom</Label>
                <Input id="lastName" {...register("generalInfo.lastName")} />
                {errors.generalInfo?.lastName && (
                  <p className="text-red-500 text-sm">{errors.generalInfo.lastName.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="birthDate">Date de Naissance</Label>
                <Input id="birthDate" type="date" {...register("generalInfo.birthDate", { valueAsDate: true })} />
              </div>
              <div>
                <Label htmlFor="gender">Genre</Label>
                <Select onValueChange={(value) => setValue("generalInfo.gender", value as "male" | "female")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le genre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Masculin</SelectItem>
                    <SelectItem value="female">Féminin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="nationality">Nationalité</Label>
                <Input id="nationality" {...register("generalInfo.nationality")} />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register("generalInfo.email")} />
                {errors.generalInfo?.email && (
                  <p className="text-red-500 text-sm">{errors.generalInfo.email.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="phone">Téléphone</Label>
                <Input id="phone" {...register("generalInfo.phone")} />
              </div>
              <div>
                <Label htmlFor="address">Adresse</Label>
                <Input id="address" {...register("generalInfo.address")} />
              </div>
            </div>
          </div>

          {/* Formation Antérieure */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Formation Antérieure</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="previousInstitution">Établissement</Label>
                <Input id="previousInstitution" {...register("previousEducation.institution")} />
              </div>
              <div>
                <Label htmlFor="previousYear">Année</Label>
                <Input id="previousYear" {...register("previousEducation.year")} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="previousDegree">Diplôme</Label>
                <Input id="previousDegree" {...register("previousEducation.degree")} />
              </div>
              <div>
                <Label htmlFor="previousMajor">Spécialité</Label>
                <Input id="previousMajor" {...register("previousEducation.major")} />
              </div>
            </div>
          </div>

          {/* Informations Académiques */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Informations Académiques</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="studentId">Matricule</Label>
                <Input id="studentId" {...register("academicInfo.studentId")} />
              </div>
              <div>
                <Label htmlFor="level">Niveau</Label>
                <Select onValueChange={(value) => setValue("academicInfo.level", value as "L1" | "L2" | "L3" | "M1" | "M2")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le niveau" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="L1">Licence 1</SelectItem>
                    <SelectItem value="L2">Licence 2</SelectItem>
                    <SelectItem value="L3">Licence 3</SelectItem>
                    <SelectItem value="M1">Master 1</SelectItem>
                    <SelectItem value="M2">Master 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="specialization">Spécialité</Label>
                <Input id="specialization" {...register("academicInfo.specialization")} />
              </div>
              <div>
                <Label htmlFor="department">Département</Label>
                <Input id="department" {...register("academicInfo.department")} />
              </div>
              <div>
                <Label htmlFor="enrollmentDate">Date d'Inscription</Label>
                <Input id="enrollmentDate" type="date" {...register("academicInfo.enrollmentDate", { valueAsDate: true })} />
              </div>
              <div>
                <Label htmlFor="graduationDate">Date de Graduation (si applicable)</Label>
                <Input id="graduationDate" type="date" {...register("academicInfo.graduationDate", { valueAsDate: true })} />
              </div>
              <div>
                <Label htmlFor="status">Statut</Label>
                <Select onValueChange={(value) => setValue("academicInfo.status", value as "active" | "graduated" | "suspended")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="graduated">Diplômé</SelectItem>
                    <SelectItem value="suspended">Suspendu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Informations Sociales */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Informations Sociales</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="scholarship">Bourse</Label>
                <Select onValueChange={(value) => setValue("socialInfo.scholarship", value as "oui" | "non")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Bénéficiaire d'une bourse ?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="non">Non</SelectItem>
                    <SelectItem value="oui">Oui</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="disability">Handicap</Label>
                <Select onValueChange={(value) => setValue("socialInfo.disability", value as "oui" | "non")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Situation de handicap ?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="non">Non</SelectItem>
                    <SelectItem value="oui">Oui</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="workingStudent">Étudiant travailleur</Label>
                <Select onValueChange={(value) => setValue("socialInfo.workingStudent", value as "oui" | "non")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Étudiant travailleur ?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="non">Non</SelectItem>
                    <SelectItem value="oui">Oui</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Informations Familiales */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Informations Familiales</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fatherName">Nom du Père</Label>
                <Input id="fatherName" {...register("familyInfo.fatherName")} />
              </div>
              <div>
                <Label htmlFor="motherName">Nom de la Mère</Label>
                <Input id="motherName" {...register("familyInfo.motherName")} />
              </div>
              <div>
                <Label htmlFor="familyStatus">Situation Familiale</Label>
                <Select onValueChange={(value) => setValue("familyInfo.familyStatus", value as "married" | "single" | "divorced" | "widowed")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner la situation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="married">Marié(e)</SelectItem>
                    <SelectItem value="single">Célibataire</SelectItem>
                    <SelectItem value="divorced">Divorcé(e)</SelectItem>
                    <SelectItem value="widowed">Veuf(ve)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="numSiblings">Nombre de Frères et Sœurs</Label>
                <Input id="numSiblings" type="number" {...register("familyInfo.numSiblings", { valueAsNumber: true })} />
              </div>
            </div>
          </div>

          {/* Contact d'Urgence */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Contact d'Urgence</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="emergencyName">Nom</Label>
                <Input id="emergencyName" {...register("emergencyContact.name")} />
              </div>
              <div>
                <Label htmlFor="emergencyPhone">Téléphone</Label>
                <Input id="emergencyPhone" {...register("emergencyContact.phone")} />
              </div>
              <div>
                <Label htmlFor="emergencyRelationship">Relation</Label>
                <Input id="emergencyRelationship" {...register("emergencyContact.relationship")} />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Notes</h3>
            <div>
              <Label htmlFor="notes">Informations Supplémentaires</Label>
              <Textarea id="notes" {...register("notes")} />
            </div>
          </div>

          {/* Droits d'Inscription */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Droits d'Inscription</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="feesAmount">Montant (DA)</Label>
                <Input id="feesAmount" type="number" {...register("fees.amount", { valueAsNumber: true })} />
              </div>
              <div>
                <Label htmlFor="feesPaid">Statut</Label>
                <Select onValueChange={(value) => setValue("fees.paid", value as "oui" | "non")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Droits payés ?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="non">Non payé</SelectItem>
                    <SelectItem value="oui">Payé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end space-x-2">
            {onBack && (
              <Button type="button" variant="secondary" onClick={onBack}>
                Retour
              </Button>
            )}
            <Button type="reset" variant="secondary">
              Annuler
            </Button>
            <Button type="submit">
              Soumettre
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
