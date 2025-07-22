
import React from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download } from "lucide-react";

interface WorkloadFiltersProps {
  selectedDepartment: string;
  setSelectedDepartment: (value: string) => void;
  selectedSemester: 'S1' | 'S2';
  setSelectedSemester: (value: 'S1' | 'S2') => void;
  selectedYear: string;
  setSelectedYear: (value: string) => void;
  onExportReport: () => void;
}

export const WorkloadFilters: React.FC<WorkloadFiltersProps> = ({
  selectedDepartment,
  setSelectedDepartment,
  selectedSemester,
  setSelectedSemester,
  selectedYear,
  setSelectedYear,
  onExportReport
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Select value={selectedDepartment || "informatique"} onValueChange={setSelectedDepartment}>
        <SelectTrigger>
          <SelectValue placeholder="Sélectionner le département" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="informatique">Informatique</SelectItem>
          <SelectItem value="mathematiques">Mathématiques</SelectItem>
          <SelectItem value="physique">Physique</SelectItem>
          <SelectItem value="chimie">Chimie</SelectItem>
        </SelectContent>
      </Select>

      <Select value={selectedSemester || "S1"} onValueChange={(value: 'S1' | 'S2') => setSelectedSemester(value)}>
        <SelectTrigger>
          <SelectValue placeholder="Sélectionner le semestre" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="S1">Semestre 1</SelectItem>
          <SelectItem value="S2">Semestre 2</SelectItem>
        </SelectContent>
      </Select>

      <Select value={selectedYear || "2024-2025"} onValueChange={setSelectedYear}>
        <SelectTrigger>
          <SelectValue placeholder="Année académique" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="2024-2025">2024-2025</SelectItem>
          <SelectItem value="2023-2024">2023-2024</SelectItem>
          <SelectItem value="2022-2023">2022-2023</SelectItem>
        </SelectContent>
      </Select>

      <Button onClick={onExportReport} className="bg-green-600 hover:bg-green-700">
        <Download className="h-4 w-4 mr-2" />
        Export PDF
      </Button>
    </div>
  );
};
