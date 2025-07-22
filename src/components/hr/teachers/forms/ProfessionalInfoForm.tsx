import React, { useState, useEffect } from 'react';
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
import { ProfessionalInfo, TEACHER_GRADES } from "@/types/teacher";
import { Faculty, Department } from "@/types/academic";
import { academicConfigService } from "@/services/academicConfigService";

interface ProfessionalInfoFormProps {
  professionalInfo: Partial<ProfessionalInfo>;
  onUpdate: (updates: Partial<ProfessionalInfo>) => void;
}

export const ProfessionalInfoForm: React.FC<ProfessionalInfoFormProps> = ({
  professionalInfo,
  onUpdate
}) => {
  const [showHireCalendar, setShowHireCalendar] = useState(false);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [filteredDepartments, setFilteredDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAcademicData();
  }, []);

  useEffect(() => {
    if (professionalInfo.faculty && departments.length > 0) {
      const selectedFaculty = faculties.find(f => f.name === professionalInfo.faculty);
      if (selectedFaculty) {
        const depts = departments.filter(d => d.facultyId === selectedFaculty.id);
        setFilteredDepartments(depts);
      }
    } else {
      setFilteredDepartments([]);
    }
  }, [professionalInfo.faculty, departments, faculties]);

  const loadAcademicData = async () => {
    setLoading(true);
    try {
      const [facultiesData, departmentsData] = await Promise.all([
        academicConfigService.getFaculties(),
        academicConfigService.getDepartments()
      ]);
      setFaculties(facultiesData);
      setDepartments(departmentsData);
    } catch (error) {
      console.error('Erreur lors du chargement des données académiques:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFacultyChange = (facultyName: string) => {
    onUpdate({ 
      faculty: facultyName,
      department: "" // Reset department when faculty changes
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="employeeId">Matricule</Label>
          <Input
            id="employeeId"
            value={professionalInfo.employeeId || ""}
            onChange={(e) => onUpdate({ employeeId: e.target.value })}
            placeholder="Matricule de l'enseignant"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="grade">Grade *</Label>
          <Select 
            value={professionalInfo.currentGrade || ""} 
            onValueChange={(value) => onUpdate({ currentGrade: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un grade" />
            </SelectTrigger>
            <SelectContent>
              {TEACHER_GRADES.map(grade => (
                <SelectItem key={grade} value={grade}>{grade}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="echelon">Échelon</Label>
          <Select 
            value={professionalInfo.currentEchelon?.toString() || ""} 
            onValueChange={(value) => onUpdate({ currentEchelon: parseInt(value) })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un échelon" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 10 }, (_, i) => i + 1).map(echelon => (
                <SelectItem key={echelon} value={echelon.toString()}>
                  Échelon {echelon}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="specialty">Spécialité *</Label>
          <Input
            id="specialty"
            value={professionalInfo.speciality || ""}
            onChange={(e) => onUpdate({ speciality: e.target.value })}
            placeholder="Domaine de spécialité"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="faculty">Faculté</Label>
          <Select 
            value={professionalInfo.faculty || ""} 
            onValueChange={handleFacultyChange}
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue placeholder={loading ? "Chargement..." : "Sélectionner une faculté"} />
            </SelectTrigger>
            <SelectContent>
              {faculties.map(faculty => (
                <SelectItem key={faculty.id} value={faculty.name}>
                  {faculty.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="department">Département</Label>
          <Select 
            value={professionalInfo.department || ""} 
            onValueChange={(value) => onUpdate({ department: value })}
            disabled={!professionalInfo.faculty || filteredDepartments.length === 0}
          >
            <SelectTrigger>
              <SelectValue placeholder={
                !professionalInfo.faculty 
                  ? "Sélectionner d'abord une faculté" 
                  : filteredDepartments.length === 0 
                    ? "Aucun département disponible"
                    : "Sélectionner un département"
              } />
            </SelectTrigger>
            <SelectContent>
              {filteredDepartments.map(department => (
                <SelectItem key={department.id} value={department.name}>
                  {department.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {professionalInfo.faculty && filteredDepartments.length === 0 && (
            <p className="text-xs text-red-500 mt-1">
              Aucun département trouvé pour cette faculté
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Date de recrutement</Label>
          <Popover open={showHireCalendar} onOpenChange={setShowHireCalendar}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !professionalInfo.hireDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {professionalInfo.hireDate ? 
                  format(professionalInfo.hireDate, "dd MMMM yyyy", { locale: fr }) :
                  "Sélectionner une date"
                }
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={professionalInfo.hireDate}
                onSelect={(date) => {
                  onUpdate({ hireDate: date });
                  setShowHireCalendar(false);
                }}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
                disabled={(date) => date > new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>Date de titularisation</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !professionalInfo.tenureDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {professionalInfo.tenureDate ? 
                  format(professionalInfo.tenureDate, "dd MMMM yyyy", { locale: fr }) :
                  "Sélectionner une date"
                }
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={professionalInfo.tenureDate}
                onSelect={(date) => onUpdate({ tenureDate: date })}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
                disabled={(date) => date > new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="contractType">Type de contrat</Label>
          <Select 
            value={professionalInfo.contractType || ""} 
            onValueChange={(value) => onUpdate({ contractType: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CDI">CDI - Contrat à Durée Indéterminée</SelectItem>
              <SelectItem value="CDD">CDD - Contrat à Durée Déterminée</SelectItem>
              <SelectItem value="Vacation">Vacation</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Statut</Label>
          <Select 
            value={professionalInfo.status || ""} 
            onValueChange={(value) => onUpdate({ status: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Actif">Actif</SelectItem>
              <SelectItem value="Inactif">Inactif</SelectItem>
              <SelectItem value="Suspendu">Suspendu</SelectItem>
              <SelectItem value="En congé">En congé</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};