import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { PersonalInfo } from "@/types/teacher";

interface PersonalInfoFormProps {
  personalInfo: Partial<PersonalInfo>;
  onUpdate: (updates: Partial<PersonalInfo>) => void;
}

export const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  personalInfo,
  onUpdate
}) => {
  const [showBirthCalendar, setShowBirthCalendar] = React.useState(false);

  const handleAddressChange = (field: string, value: string) => {
    onUpdate({
      address: {
        ...personalInfo.address,
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Informations personnelles de base */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Prénom *</Label>
          <Input
            id="firstName"
            value={personalInfo.firstName || ""}
            onChange={(e) => onUpdate({ firstName: e.target.value })}
            placeholder="Prénom de l'enseignant"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Nom *</Label>
          <Input
            id="lastName"
            value={personalInfo.lastName || ""}
            onChange={(e) => onUpdate({ lastName: e.target.value })}
            placeholder="Nom de l'enseignant"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="firstNameArabic">الاسم بالعربية</Label>
          <Input
            id="firstNameArabic"
            value={personalInfo.firstNameArabic || ""}
            onChange={(e) => onUpdate({ firstNameArabic: e.target.value })}
            placeholder="الاسم الأول"
            dir="rtl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastNameArabic">اللقب بالعربية</Label>
          <Input
            id="lastNameArabic"
            value={personalInfo.lastNameArabic || ""}
            onChange={(e) => onUpdate({ lastNameArabic: e.target.value })}
            placeholder="اللقب"
            dir="rtl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={personalInfo.email || ""}
            onChange={(e) => onUpdate({ email: e.target.value })}
            placeholder="email@univ.dz"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone</Label>
          <Input
            id="phone"
            value={personalInfo.phone || ""}
            onChange={(e) => onUpdate({ phone: e.target.value })}
            placeholder="+213 555 123 456"
          />
        </div>

        <div className="space-y-2">
          <Label>Date de naissance</Label>
          <Popover open={showBirthCalendar} onOpenChange={setShowBirthCalendar}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !personalInfo.dateOfBirth && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {personalInfo.dateOfBirth ? 
                  format(personalInfo.dateOfBirth, "dd MMMM yyyy", { locale: fr }) :
                  "Sélectionner une date"
                }
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={personalInfo.dateOfBirth}
                onSelect={(date) => {
                  onUpdate({ dateOfBirth: date });
                  setShowBirthCalendar(false);
                }}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
                disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="placeOfBirth">Lieu de naissance</Label>
          <Input
            id="placeOfBirth"
            value={personalInfo.placeOfBirth || ""}
            onChange={(e) => onUpdate({ placeOfBirth: e.target.value })}
            placeholder="Ville, Wilaya"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="placeOfBirthArabic">مكان الميلاد بالعربية</Label>
          <Input
            id="placeOfBirthArabic"
            value={personalInfo.placeOfBirthArabic || ""}
            onChange={(e) => onUpdate({ placeOfBirthArabic: e.target.value })}
            placeholder="مكان الميلاد"
            dir="rtl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="nationalId">Numéro CIN</Label>
          <Input
            id="nationalId"
            value={personalInfo.nationalId || ""}
            onChange={(e) => onUpdate({ nationalId: e.target.value })}
            placeholder="1234567890123456"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="familyStatus">Situation familiale</Label>
          <Select 
            value={personalInfo.familyStatus || ""} 
            onValueChange={(value) => onUpdate({ familyStatus: value })}
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

        <div className="space-y-2">
          <Label htmlFor="numberOfChildren">Nombre d'enfants</Label>
          <Input
            id="numberOfChildren"
            type="number"
            min="0"
            value={personalInfo.numberOfChildren || 0}
            onChange={(e) => onUpdate({ numberOfChildren: parseInt(e.target.value) || 0 })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ccpAccount">Numéro CCP</Label>
          <Input
            id="ccpAccount"
            value={personalInfo.ccpAccount || ""}
            onChange={(e) => onUpdate({ ccpAccount: e.target.value })}
            placeholder="Numéro de compte CCP"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="socialSecurityNumber">Numéro sécurité sociale</Label>
          <Input
            id="socialSecurityNumber"
            value={personalInfo.socialSecurityNumber || ""}
            onChange={(e) => onUpdate({ socialSecurityNumber: e.target.value })}
            placeholder="Numéro de sécurité sociale"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bloodType">Groupe sanguin</Label>
          <Select 
            value={personalInfo.bloodType || ""} 
            onValueChange={(value) => onUpdate({ bloodType: value })}
          >
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
            value={personalInfo.rfidCardNumber || ""}
            onChange={(e) => onUpdate({ rfidCardNumber: e.target.value })}
            placeholder="Numéro carte RFID"
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
                // Pour le moment, on stocke juste le nom du fichier
                // Dans une vraie app, on uploaderait le fichier
                onUpdate({ photo: file.name });
              }
            }}
          />
          {personalInfo.photo && (
            <p className="text-xs text-muted-foreground">
              Photo actuelle: {personalInfo.photo}
            </p>
          )}
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
              value={personalInfo.address?.street || ""}
              onChange={(e) => handleAddressChange("street", e.target.value)}
              placeholder="Adresse complète"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">Ville</Label>
            <Input
              id="city"
              value={personalInfo.address?.city || ""}
              onChange={(e) => handleAddressChange("city", e.target.value)}
              placeholder="Ville"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="wilaya">Wilaya</Label>
            <Input
              id="wilaya"
              value={personalInfo.address?.wilaya || ""}
              onChange={(e) => handleAddressChange("wilaya", e.target.value)}
              placeholder="Wilaya"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="postalCode">Code postal</Label>
            <Input
              id="postalCode"
              value={personalInfo.address?.postalCode || ""}
              onChange={(e) => handleAddressChange("postalCode", e.target.value)}
              placeholder="Code postal"
            />
          </div>
        </div>
      </div>
    </div>
  );
};