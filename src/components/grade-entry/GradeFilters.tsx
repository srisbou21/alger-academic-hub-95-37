
import { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Upload, CheckCircle, Lock, Unlock, Download, FileSpreadsheet } from "lucide-react";

interface GradeFiltersProps {
  selectedSubject: string;
  setSelectedSubject: (value: string) => void;
  selectedExamType: string;
  setSelectedExamType: (value: string) => void;
  selectedSession: string;
  setSelectedSession: (value: string) => void;
  isImporting: boolean;
  importProgress: number;
  allLocked: boolean;
  onValidateAll: () => void;
  onLockGrades: () => void;
  onUnlockGrades: () => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const GradeFilters = ({
  selectedSubject,
  setSelectedSubject,
  selectedExamType,
  setSelectedExamType,
  selectedSession,
  setSelectedSession,
  isImporting,
  importProgress,
  allLocked,
  onValidateAll,
  onLockGrades,
  onUnlockGrades,
  onFileUpload
}: GradeFiltersProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const subjects = ["Microéconomie", "Macroéconomie", "Statistiques", "Comptabilité", "Management"];
  const examTypes = ["Examen Final", "Contrôle Continu", "TD", "TP", "Rattrapage"];
  const sessions = ["Session 1 - 2024", "Session 2 - 2024", "Rattrapage - 2024"];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5" />
          Configuration et Import
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="subject">Matière</Label>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une matière" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map(subject => (
                  <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="examType">Type d'examen</Label>
            <Select value={selectedExamType} onValueChange={setSelectedExamType}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner le type" />
              </SelectTrigger>
              <SelectContent>
                {examTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="session">Session</Label>
            <Select value={selectedSession} onValueChange={setSelectedSession}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner la session" />
              </SelectTrigger>
              <SelectContent>
                {sessions.map(session => (
                  <SelectItem key={session} value={session}>{session}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={() => fileInputRef.current?.click()}
            className="bg-emerald-600 hover:bg-emerald-700"
            disabled={isImporting || allLocked}
          >
            <Upload className="h-4 w-4 mr-2" />
            Importer Excel
          </Button>
          
          <Button 
            onClick={onValidateAll}
            className="bg-blue-600 hover:bg-blue-700"
            disabled={allLocked}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Valider Tout
          </Button>
          
          {allLocked ? (
            <Button onClick={onUnlockGrades} variant="outline">
              <Unlock className="h-4 w-4 mr-2" />
              Déverrouiller
            </Button>
          ) : (
            <Button onClick={onLockGrades} className="bg-red-600 hover:bg-red-700">
              <Lock className="h-4 w-4 mr-2" />
              Verrouiller
            </Button>
          )}
          
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={onFileUpload}
          className="hidden"
        />

        {isImporting && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Import en cours...</span>
              <span>{importProgress}%</span>
            </div>
            <Progress value={importProgress} className="w-full" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
