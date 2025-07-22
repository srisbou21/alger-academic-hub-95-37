
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Users } from "lucide-react";

interface CompletedDefensesTableProps {
  completedDefenses: Array<{
    id: string;
    student: string;
    title: string;
    date: string;
    supervisor: string;
    finalGrade: number;
    mention: string;
  }>;
  getMentionColor: (mention: string) => string;
}

export const CompletedDefensesTable = ({ 
  completedDefenses, 
  getMentionColor 
}: CompletedDefensesTableProps) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Étudiant</TableHead>
            <TableHead>Titre</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Encadrant</TableHead>
            <TableHead>Note finale</TableHead>
            <TableHead>Mention</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {completedDefenses.map((defense) => (
            <TableRow key={defense.id}>
              <TableCell className="font-medium">{defense.student}</TableCell>
              <TableCell className="max-w-xs">
                <div className="truncate" title={defense.title}>
                  {defense.title}
                </div>
              </TableCell>
              <TableCell>
                {new Date(defense.date).toLocaleDateString('fr-FR')}
              </TableCell>
              <TableCell>{defense.supervisor}</TableCell>
              <TableCell>
                <Badge className="bg-blue-100 text-blue-800">
                  {defense.finalGrade}/20
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={getMentionColor(defense.mention)}>
                  {defense.mention}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline">
                    <FileText className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Users className="h-3 w-3" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
