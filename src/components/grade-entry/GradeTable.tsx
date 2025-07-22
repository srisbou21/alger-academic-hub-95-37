
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, AlertTriangle, Lock, Unlock } from "lucide-react";
import { Grade } from "@/types/grade";

interface GradeTableProps {
  grades: Grade[];
  onGradeChange: (gradeId: string, newGrade: string) => void;
}

export const GradeTable = ({ grades, onGradeChange }: GradeTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Saisie Rapide des Notes</CardTitle>
        <CardDescription>
          Saisissez les notes directement dans le tableau. Les contrôles de cohérence sont automatiques.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Étudiant</TableHead>
                <TableHead>Matière</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Note (/20)</TableHead>
                <TableHead>Coeff.</TableHead>
                <TableHead>État</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {grades.map((grade) => (
                <TableRow key={grade.id} className={grade.isLocked ? "bg-slate-50" : ""}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{grade.studentName}</div>
                      <div className="text-sm text-slate-500">{grade.studentId}</div>
                    </div>
                  </TableCell>
                  <TableCell>{grade.subject}</TableCell>
                  <TableCell>{grade.examType}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Input
                        type="number"
                        min="0"
                        max="20"
                        step="0.25"
                        value={grade.grade || ""}
                        onChange={(e) => onGradeChange(grade.id, e.target.value)}
                        disabled={grade.isLocked}
                        className={`w-20 ${grade.errors.length > 0 ? 'border-red-500' : ''}`}
                      />
                      {grade.errors.length > 0 && (
                        <div className="text-xs text-red-600">
                          {grade.errors.join(", ")}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{grade.coefficient}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {grade.isValidated && (
                        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Validé
                        </Badge>
                      )}
                      {grade.errors.length > 0 && (
                        <Badge variant="destructive">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Erreur
                        </Badge>
                      )}
                      {grade.grade === null && (
                        <Badge variant="outline">
                          Manquant
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {grade.isLocked ? (
                      <Badge variant="secondary">
                        <Lock className="h-3 w-3 mr-1" />
                        Verrouillé
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        <Unlock className="h-3 w-3 mr-1" />
                        Modifiable
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
