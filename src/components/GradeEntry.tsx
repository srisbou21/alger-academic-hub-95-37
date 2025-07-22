
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Grade, ValidationStats } from "@/types/grade";
import { GradeFilters } from "./grade-entry/GradeFilters";
import { ValidationStats as ValidationStatsComponent } from "./grade-entry/ValidationStats";
import { GradeTable } from "./grade-entry/GradeTable";
import { ValidationDialog } from "./grade-entry/ValidationDialog";

export const GradeEntry = () => {
  const { toast } = useToast();
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedExamType, setSelectedExamType] = useState("");
  const [selectedSession, setSelectedSession] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [showValidationDialog, setShowValidationDialog] = useState(false);
  const [grades, setGrades] = useState<Grade[]>([
    {
      id: "1",
      studentId: "20230001",
      studentName: "Amina Benali",
      subject: "Microéconomie",
      examType: "Examen Final",
      grade: 15.5,
      coefficient: 2,
      date: "2024-01-15",
      isLocked: false,
      isValidated: false,
      errors: []
    },
    {
      id: "2",
      studentId: "20230002", 
      studentName: "Karim Meziani",
      subject: "Microéconomie",
      examType: "Examen Final",
      grade: null,
      coefficient: 2,
      date: "2024-01-15",
      isLocked: false,
      isValidated: false,
      errors: []
    },
    {
      id: "3",
      studentId: "20230003",
      studentName: "Fatima Ouali",
      subject: "Microéconomie", 
      examType: "Examen Final",
      grade: 22,
      coefficient: 2,
      date: "2024-01-15",
      isLocked: false,
      isValidated: false,
      errors: ["Note supérieure à 20"]
    }
  ]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
        toast({
          title: "Format non supporté",
          description: "Veuillez sélectionner un fichier Excel (.xlsx ou .xls)",
          variant: "destructive"
        });
        return;
      }

      setIsImporting(true);
      setImportProgress(0);

      const interval = setInterval(() => {
        setImportProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsImporting(false);
            toast({
              title: "Import réussi",
              description: `${file.name} a été importé avec succès. 45 notes ajoutées.`
            });
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }
  };

  const validateGrade = (grade: number | null): string[] => {
    const errors: string[] = [];
    if (grade === null) {
      errors.push("Note manquante");
    } else if (grade < 0) {
      errors.push("Note négative");
    } else if (grade > 20) {
      errors.push("Note supérieure à 20");
    }
    return errors;
  };

  const handleGradeChange = (gradeId: string, newGrade: string) => {
    const numericGrade = newGrade === "" ? null : parseFloat(newGrade);
    const errors = validateGrade(numericGrade);
    
    setGrades(prev => prev.map(grade => 
      grade.id === gradeId 
        ? { ...grade, grade: numericGrade, errors, isValidated: false }
        : grade
    ));
  };

  const validateAllGrades = () => {
    const invalidGrades = grades.filter(grade => grade.errors.length > 0 || grade.grade === null);
    
    if (invalidGrades.length > 0) {
      toast({
        title: "Validation échouée",
        description: `${invalidGrades.length} note(s) nécessitent une correction`,
        variant: "destructive"
      });
      return false;
    }
    
    setGrades(prev => prev.map(grade => ({ ...grade, isValidated: true })));
    toast({
      title: "Validation réussie",
      description: "Toutes les notes ont été validées avec succès"
    });
    return true;
  };

  const lockGrades = () => {
    if (!validateAllGrades()) return;
    
    setGrades(prev => prev.map(grade => ({ ...grade, isLocked: true })));
    toast({
      title: "Notes verrouillées",
      description: "Les notes ont été verrouillées et ne peuvent plus être modifiées"
    });
  };

  const unlockGrades = () => {
    setGrades(prev => prev.map(grade => ({ ...grade, isLocked: false, isValidated: false })));
    toast({
      title: "Notes déverrouillées",
      description: "Les notes peuvent maintenant être modifiées"
    });
  };

  const getValidationStats = (): ValidationStats => {
    const total = grades.length;
    const validated = grades.filter(g => g.isValidated).length;
    const withErrors = grades.filter(g => g.errors.length > 0).length;
    const missing = grades.filter(g => g.grade === null).length;
    
    return { total, validated, withErrors, missing };
  };

  const stats = getValidationStats();
  const allLocked = grades.every(g => g.isLocked);

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Saisie des Notes</h2>
        <p className="text-slate-600">
          Interface avancée pour la saisie, validation et verrouillage des notes
        </p>
      </div>

      <GradeFilters
        selectedSubject={selectedSubject}
        setSelectedSubject={setSelectedSubject}
        selectedExamType={selectedExamType}
        setSelectedExamType={setSelectedExamType}
        selectedSession={selectedSession}
        setSelectedSession={setSelectedSession}
        isImporting={isImporting}
        importProgress={importProgress}
        allLocked={allLocked}
        onValidateAll={() => setShowValidationDialog(true)}
        onLockGrades={lockGrades}
        onUnlockGrades={unlockGrades}
        onFileUpload={handleFileUpload}
      />

      <ValidationStatsComponent stats={stats} />

      <GradeTable
        grades={grades}
        onGradeChange={handleGradeChange}
      />

      <ValidationDialog
        open={showValidationDialog}
        onOpenChange={setShowValidationDialog}
        stats={stats}
        onValidate={validateAllGrades}
      />
    </div>
  );
};
