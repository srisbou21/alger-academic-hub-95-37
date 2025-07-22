
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, User, Users } from "lucide-react";

interface Employee {
  id: string;
  name: string;
  type: 'enseignant' | 'administratif';
  department?: string;
  position?: string;
  grade?: string;
  email: string;
  status: 'active' | 'inactive';
}

interface EmployeeSelectorProps {
  onEmployeeSelect: (employee: Employee) => void;
  selectedEmployee: Employee | null;
}

export const EmployeeSelector: React.FC<EmployeeSelectorProps> = ({
  onEmployeeSelect,
  selectedEmployee
}) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    const mockEmployees: Employee[] = [
      {
        id: "1",
        name: "Dr. Ahmed Benali",
        type: "enseignant",
        department: "Informatique",
        grade: "Maitre de Conférences A",
        email: "ahmed.benali@univ.dz",
        status: "active"
      },
      {
        id: "2", 
        name: "Dr. Fatima Zohra",
        type: "enseignant",
        department: "Mathématiques",
        grade: "Professeur",
        email: "fatima.zohra@univ.dz",
        status: "active"
      },
      {
        id: "3",
        name: "Mohammed Larbi",
        type: "administratif",
        department: "Secrétariat",
        position: "Secrétaire",
        email: "mohammed.larbi@univ.dz",
        status: "active"
      },
      {
        id: "4",
        name: "Aisha Mansouri",
        type: "administratif",
        department: "Comptabilité",
        position: "Comptable",
        email: "aisha.mansouri@univ.dz",
        status: "active"
      }
    ];
    setEmployees(mockEmployees);
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || emp.type === typeFilter;
    return matchesSearch && matchesType;
  });

  if (selectedEmployee) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Employé sélectionné
            </CardTitle>
            <Button variant="outline" onClick={() => onEmployeeSelect(null as any)}>
              Changer d'employé
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{selectedEmployee.name}</h3>
              <p className="text-sm text-slate-600">{selectedEmployee.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={selectedEmployee.type === 'enseignant' ? 'default' : 'secondary'}>
                  {selectedEmployee.type === 'enseignant' ? 'Enseignant' : 'Personnel Administratif'}
                </Badge>
                <Badge variant="outline">{selectedEmployee.department}</Badge>
                {selectedEmployee.grade && (
                  <Badge variant="outline">{selectedEmployee.grade}</Badge>
                )}
                {selectedEmployee.position && (
                  <Badge variant="outline">{selectedEmployee.position}</Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Sélectionner un employé
        </CardTitle>
        <p className="text-slate-600">
          Chaque employé possède automatiquement un dossier personnel
        </p>
      </CardHeader>
      <CardContent>
        {/* Filtres */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher un employé..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Type d'employé" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="enseignant">Enseignants</SelectItem>
              <SelectItem value="administratif">Personnel Administratif</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Liste des employés */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredEmployees.map((employee) => (
            <div 
              key={employee.id} 
              className="border rounded-lg p-4 hover:bg-slate-50 cursor-pointer transition-colors"
              onClick={() => onEmployeeSelect(employee)}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{employee.name}</h4>
                  <p className="text-sm text-slate-600">{employee.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={employee.type === 'enseignant' ? 'default' : 'secondary'}>
                      {employee.type === 'enseignant' ? 'Enseignant' : 'Personnel Administratif'}
                    </Badge>
                    <Badge variant="outline">{employee.department}</Badge>
                    {employee.grade && (
                      <Badge variant="outline">{employee.grade}</Badge>
                    )}
                    {employee.position && (
                      <Badge variant="outline">{employee.position}</Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredEmployees.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-500">Aucun employé trouvé</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
