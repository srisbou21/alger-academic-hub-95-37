
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2, Plus } from "lucide-react";

interface Subject {
  code: string;
  name: string;
  hours: number;
  coefficient: number;
  teacher: string;
}

interface SubjectTableProps {
  subjects: Subject[];
}

export const SubjectTable = ({ subjects }: SubjectTableProps) => {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Matière</TableHead>
            <TableHead className="text-center">Volume horaire</TableHead>
            <TableHead className="text-center">Coefficient</TableHead>
            <TableHead>Enseignant</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subjects.map((subject) => (
            <TableRow key={subject.code}>
              <TableCell className="font-mono text-sm">{subject.code}</TableCell>
              <TableCell className="font-medium">{subject.name}</TableCell>
              <TableCell className="text-center">{subject.hours}h</TableCell>
              <TableCell className="text-center">{subject.coefficient}</TableCell>
              <TableCell className="text-sm text-slate-600">{subject.teacher}</TableCell>
              <TableCell className="text-center">
                <div className="flex gap-1 justify-center">
                  <Button size="sm" variant="ghost">
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center mt-4 pt-4 border-t">
        <div className="text-sm text-slate-600">
          Total: {subjects.length} matière(s) • {subjects.reduce((total, subject) => total + subject.hours, 0)} heures
        </div>
        <Button size="sm" variant="outline" className="text-blue-600">
          <Plus className="h-3 w-3 mr-1" />
          Ajouter matière
        </Button>
      </div>
    </>
  );
};
