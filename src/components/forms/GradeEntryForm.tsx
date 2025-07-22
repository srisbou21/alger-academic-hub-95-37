
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { GraduationCap, Save, Plus } from "lucide-react";

interface GradeEntry {
  studentId: string;
  studentName: string;
  grade: string;
}

interface GradeFormData {
  subject: string;
  examType: string;
  examDate: string;
  coefficient: string;
  grades: GradeEntry[];
}

export const GradeEntryForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<GradeFormData>({
    subject: "",
    examType: "",
    examDate: "",
    coefficient: "1",
    grades: [
      { studentId: "20240001", studentName: "Amina Benali", grade: "" },
      { studentId: "20240002", studentName: "Karim Meziane", grade: "" },
      { studentId: "20240003", studentName: "Fatima Ouali", grade: "" }
    ]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Grades submitted:", formData);
    toast({
      title: "Notes enregistrées",
      description: "Les notes ont été sauvegardées avec succès"
    });
  };

  const updateGrade = (index: number, grade: string) => {
    const newGrades = [...formData.grades];
    newGrades[index].grade = grade;
    setFormData({ ...formData, grades: newGrades });
  };

  const addStudent = () => {
    const newStudent: GradeEntry = {
      studentId: "",
      studentName: "",
      grade: ""
    };
    setFormData({
      ...formData,
      grades: [...formData.grades, newStudent]
    });
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          Saisie des Notes
        </CardTitle>
        <CardDescription>
          Formulaire de saisie des notes d'examen
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Configuration de l'examen */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Configuration de l'Examen</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Matière</Label>
                <Select 
                  value={formData.subject} 
                  onValueChange={(value) => setFormData({...formData, subject: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une matière" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="microeconomie">Microéconomie</SelectItem>
                    <SelectItem value="macroeconomie">Macroéconomie</SelectItem>
                    <SelectItem value="comptabilite">Comptabilité Générale</SelectItem>
                    <SelectItem value="statistiques">Statistiques</SelectItem>
                    <SelectItem value="management">Management</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="examType">Type d'examen</Label>
                <Select 
                  value={formData.examType} 
                  onValueChange={(value) => setFormData({...formData, examType: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="controle_continu">Contrôle Continu</SelectItem>
                    <SelectItem value="examen_partiel">Examen Partiel</SelectItem>
                    <SelectItem value="examen_final">Examen Final</SelectItem>
                    <SelectItem value="rattrapage">Rattrapage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="examDate">Date d'examen</Label>
                <Input
                  id="examDate"
                  type="date"
                  value={formData.examDate}
                  onChange={(e) => setFormData({...formData, examDate: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="coefficient">Coefficient</Label>
                <Select 
                  value={formData.coefficient} 
                  onValueChange={(value) => setFormData({...formData, coefficient: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Saisie des notes */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Notes des Étudiants</h3>
              <Button type="button" onClick={addStudent} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter étudiant
              </Button>
            </div>
            
            <div className="space-y-3">
              {formData.grades.map((student, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
                  <div className="space-y-2">
                    <Label>Numéro étudiant</Label>
                    <Input
                      value={student.studentId}
                      onChange={(e) => {
                        const newGrades = [...formData.grades];
                        newGrades[index].studentId = e.target.value;
                        setFormData({...formData, grades: newGrades});
                      }}
                      placeholder="20240001"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Nom de l'étudiant</Label>
                    <Input
                      value={student.studentName}
                      onChange={(e) => {
                        const newGrades = [...formData.grades];
                        newGrades[index].studentName = e.target.value;
                        setFormData({...formData, grades: newGrades});
                      }}
                      placeholder="Nom Prénom"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Note (/20)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="20"
                      step="0.5"
                      value={student.grade}
                      onChange={(e) => updateGrade(index, e.target.value)}
                      placeholder="15.5"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              Enregistrer les notes
            </Button>
            <Button type="button" variant="outline">
              Annuler
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
