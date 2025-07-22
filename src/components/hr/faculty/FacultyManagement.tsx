
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, School, Users, Building, BookOpen, Search, Filter, Edit, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FacultyForm } from './FacultyForm';
import { DepartmentForm } from './DepartmentForm';
import { Faculty, Department } from '@/types/academic';

export const FacultyManagement = () => {
  const [activeView, setActiveView] = useState<'faculties' | 'departments'>('faculties');
  const [showFacultyForm, setShowFacultyForm] = useState(false);
  const [showDepartmentForm, setShowDepartmentForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Mock data
  const faculties: Faculty[] = [
    {
      id: '1',
      name: 'Faculté des Sciences et Technologies',
      description: 'Formation en sciences fondamentales et appliquées',
      dean: 'Prof. Ahmed Benali',
      isActive: true,
      isValidated: false,
      createdAt: new Date('2020-01-15'),
      updatedAt: new Date('2024-01-10')
    },
    {
      id: '2',
      name: 'Faculté des Sciences Économiques',
      description: 'Formation en économie, gestion et finance',
      dean: 'Prof. Fatima Zahra',
      isActive: true,
      isValidated: false,
      createdAt: new Date('2019-09-01'),
      updatedAt: new Date('2024-01-05')
    }
  ];

  const departments: Department[] = [
    {
      id: '1',
      name: 'Département Informatique',
      code: 'INFO',
      facultyId: '1',
      head: 'Dr. Mohamed Alami',
      description: 'Sciences informatiques et ingénierie logicielle',
      isActive: true,
      isValidated: false,
      createdAt: new Date('2020-02-01'),
      updatedAt: new Date('2024-01-08')
    },
    {
      id: '2',
      name: 'Département Mathématiques',
      code: 'MATH',
      facultyId: '1',
      head: 'Dr. Aicha Bennani',
      description: 'Mathématiques pures et appliquées',
      isActive: true,
      isValidated: false,
      createdAt: new Date('2020-02-15'),
      updatedAt: new Date('2024-01-12')
    }
  ];

  const getFacultyName = (facultyId: string) => {
    return faculties.find(f => f.id === facultyId)?.name || 'N/A';
  };

  const filteredFaculties = faculties.filter(faculty => {
    const matchesSearch = faculty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faculty.dean.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && faculty.isActive) ||
                         (statusFilter === 'inactive' && !faculty.isActive);
    return matchesSearch && matchesStatus;
  });

  const filteredDepartments = departments.filter(dept => {
    const matchesSearch = dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dept.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dept.head.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && dept.isActive) ||
                         (statusFilter === 'inactive' && !dept.isActive);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <School className="h-8 w-8" />
            Gestion de la Faculté
          </CardTitle>
          <p className="text-purple-100">
            Gestion des facultés et départements
          </p>
        </CardHeader>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 font-medium">Facultés</p>
                <p className="text-2xl font-bold text-blue-800">{faculties.length}</p>
              </div>
              <School className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 font-medium">Départements</p>
                <p className="text-2xl font-bold text-green-800">{departments.length}</p>
              </div>
              <Building className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              variant={activeView === 'faculties' ? 'default' : 'outline'}
              onClick={() => setActiveView('faculties')}
              className="flex items-center gap-2"
            >
              <School className="h-4 w-4" />
              Facultés
            </Button>
            <Button
              variant={activeView === 'departments' ? 'default' : 'outline'}
              onClick={() => setActiveView('departments')}
              className="flex items-center gap-2"
            >
              <Building className="h-4 w-4" />
              Départements
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={(value: 'all' | 'active' | 'inactive') => setStatusFilter(value)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="inactive">Inactif</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={() => {
                if (activeView === 'faculties') setShowFacultyForm(true);
                else setShowDepartmentForm(true);
              }}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Ajouter
            </Button>
          </div>

          {/* Content based on active view */}
          {activeView === 'faculties' && (
            <div className="space-y-4">
              {filteredFaculties.map((faculty) => (
                <Card key={faculty.id} className="border border-slate-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold">{faculty.name}</h3>
                          <Badge variant={faculty.isActive ? "default" : "secondary"}>
                            {faculty.isActive ? "Actif" : "Inactif"}
                          </Badge>
                        </div>
                        <p className="text-slate-600">{faculty.description}</p>
                        <p className="text-sm text-slate-500">
                          <strong>Doyen:</strong> {faculty.dean}
                        </p>
                        <p className="text-xs text-slate-400">
                          Créé le {faculty.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeView === 'departments' && (
            <div className="space-y-4">
              {filteredDepartments.map((department) => (
                <Card key={department.id} className="border border-slate-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold">{department.name}</h3>
                          <Badge variant="outline">{department.code}</Badge>
                          <Badge variant={department.isActive ? "default" : "secondary"}>
                            {department.isActive ? "Actif" : "Inactif"}
                          </Badge>
                        </div>
                        <p className="text-slate-600">{department.description}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                          <span><strong>Chef:</strong> {department.head}</span>
                          <span><strong>Faculté:</strong> {getFacultyName(department.facultyId)}</span>
                        </div>
                        <p className="text-xs text-slate-400">
                          Créé le {department.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Forms */}
      {showFacultyForm && (
        <FacultyForm
          onClose={() => setShowFacultyForm(false)}
          onSave={(faculty) => {
            console.log('Nouvelle faculté:', faculty);
            setShowFacultyForm(false);
          }}
        />
      )}

      {showDepartmentForm && (
        <DepartmentForm
          faculties={faculties}
          onClose={() => setShowDepartmentForm(false)}
          onSave={(department) => {
            console.log('Nouveau département:', department);
            setShowDepartmentForm(false);
          }}
        />
      )}
    </div>
  );
};
