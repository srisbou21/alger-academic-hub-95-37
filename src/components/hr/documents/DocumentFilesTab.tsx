
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Upload, Download, Search, Filter, Users, GraduationCap } from "lucide-react";

interface Document {
  id: string;
  name: string;
  type: 'personal' | 'administrative' | 'academic' | 'medical';
  category: string;
  staffId: string;
  staffName: string;
  staffType: 'teacher' | 'administrative';
  dateUploaded: Date;
  size: string;
  status: 'complete' | 'pending' | 'expired';
}

export const DocumentFilesTab = () => {
  const [documents] = useState<Document[]>([
    {
      id: "doc1",
      name: "CV_Benali_Fatima.pdf",
      type: "personal",
      category: "CV",
      staffId: "admin1",
      staffName: "Fatima Benali",
      staffType: "administrative",
      dateUploaded: new Date("2024-01-15"),
      size: "1.2 MB",
      status: "complete"
    },
    {
      id: "doc2",
      name: "Diplome_Khelifi_Mohamed.pdf",
      type: "academic",
      category: "Diplôme",
      staffId: "admin2",
      staffName: "Mohamed Khelifi",
      staffType: "administrative",
      dateUploaded: new Date("2024-01-20"),
      size: "0.8 MB",
      status: "complete"
    },
    {
      id: "doc3",
      name: "Certificat_Medical_2024.pdf",
      type: "medical",
      category: "Certificat médical",
      staffId: "teacher1",
      staffName: "Dr. Ahmed Benali",
      staffType: "teacher",
      dateUploaded: new Date("2024-02-01"),
      size: "0.5 MB",
      status: "pending"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStaffType, setFilterStaffType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredDocuments = documents.filter(doc => {
    if (searchTerm && !doc.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !doc.staffName.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (filterType !== 'all' && doc.type !== filterType) return false;
    if (filterStaffType !== 'all' && doc.staffType !== filterStaffType) return false;
    if (filterStatus !== 'all' && doc.status !== filterStatus) return false;
    return true;
  });

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      'personal': { label: 'Personnel', class: 'bg-blue-100 text-blue-800' },
      'administrative': { label: 'Administratif', class: 'bg-purple-100 text-purple-800' },
      'academic': { label: 'Académique', class: 'bg-green-100 text-green-800' },
      'medical': { label: 'Médical', class: 'bg-red-100 text-red-800' }
    };
    const config = typeConfig[type as keyof typeof typeConfig] || { label: type, class: 'bg-gray-100 text-gray-800' };
    return <Badge className={config.class}>{config.label}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'complete':
        return <Badge className="bg-green-100 text-green-800">Complet</Badge>;
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-800">En attente</Badge>;
      case 'expired':
        return <Badge className="bg-red-100 text-red-800">Expiré</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getStaffTypeBadge = (staffType: string) => {
    return staffType === 'teacher' 
      ? <Badge className="bg-blue-100 text-blue-800">Enseignant</Badge>
      : <Badge className="bg-purple-100 text-purple-800">Administratif</Badge>;
  };

  const totalDocs = documents.length;
  const completeDocs = documents.filter(doc => doc.status === 'complete').length;
  const pendingDocs = documents.filter(doc => doc.status === 'pending').length;
  const teacherDocs = documents.filter(doc => doc.staffType === 'teacher').length;
  const adminDocs = documents.filter(doc => doc.staffType === 'administrative').length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Gestion des Dossiers et Documents
              </CardTitle>
              <p className="text-slate-600">Centralisation et suivi des documents du personnel</p>
            </div>
            <Button className="bg-green-600 hover:bg-green-700">
              <Upload className="h-4 w-4 mr-2" />
              Télécharger Document
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-800">{totalDocs}</p>
              <p className="text-sm text-blue-700">Total Documents</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <FileText className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-800">{completeDocs}</p>
              <p className="text-sm text-green-700">Complets</p>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-200">
              <FileText className="h-8 w-8 text-amber-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-amber-800">{pendingDocs}</p>
              <p className="text-sm text-amber-700">En attente</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <GraduationCap className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-800">{teacherDocs}</p>
              <p className="text-sm text-purple-700">Enseignants</p>
            </div>
            <div className="text-center p-4 bg-cyan-50 rounded-lg border border-cyan-200">
              <Users className="h-8 w-8 text-cyan-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-cyan-800">{adminDocs}</p>
              <p className="text-sm text-cyan-700">Administratif</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres et Recherche
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Type de document" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="personal">Personnel</SelectItem>
                <SelectItem value="administrative">Administratif</SelectItem>
                <SelectItem value="academic">Académique</SelectItem>
                <SelectItem value="medical">Médical</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStaffType} onValueChange={setFilterStaffType}>
              <SelectTrigger>
                <SelectValue placeholder="Type de personnel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tout le personnel</SelectItem>
                <SelectItem value="teacher">Enseignants</SelectItem>
                <SelectItem value="administrative">Administratif</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="complete">Complet</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="expired">Expiré</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={() => {
              setSearchTerm('');
              setFilterType('all');
              setFilterStaffType('all');
              setFilterStatus('all');
            }}>
              Réinitialiser
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">Tous les Documents</TabsTrigger>
          <TabsTrigger value="pending">En Attente</TabsTrigger>
          <TabsTrigger value="teachers">Enseignants</TabsTrigger>
          <TabsTrigger value="administrative">Administratif</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Tous les Documents ({filteredDocuments.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom du Document</TableHead>
                    <TableHead>Personnel</TableHead>
                    <TableHead>Type Personnel</TableHead>
                    <TableHead>Type Document</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Taille</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">{doc.name}</TableCell>
                      <TableCell>{doc.staffName}</TableCell>
                      <TableCell>{getStaffTypeBadge(doc.staffType)}</TableCell>
                      <TableCell>{getTypeBadge(doc.type)}</TableCell>
                      <TableCell>{doc.category}</TableCell>
                      <TableCell>{getStatusBadge(doc.status)}</TableCell>
                      <TableCell>{doc.dateUploaded.toLocaleDateString('fr-FR')}</TableCell>
                      <TableCell>{doc.size}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            Détails
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Documents en Attente</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>Personnel</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.filter(doc => doc.status === 'pending').map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">{doc.name}</TableCell>
                      <TableCell>{doc.staffName}</TableCell>
                      <TableCell>{getTypeBadge(doc.type)}</TableCell>
                      <TableCell>{doc.dateUploaded.toLocaleDateString('fr-FR')}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            Valider
                          </Button>
                          <Button size="sm" variant="outline">
                            Réviser
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teachers">
          <Card>
            <CardHeader>
              <CardTitle>Documents Enseignants</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>Enseignant</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.filter(doc => doc.staffType === 'teacher').map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">{doc.name}</TableCell>
                      <TableCell>{doc.staffName}</TableCell>
                      <TableCell>{getTypeBadge(doc.type)}</TableCell>
                      <TableCell>{getStatusBadge(doc.status)}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          Voir
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="administrative">
          <Card>
            <CardHeader>
              <CardTitle>Documents Personnel Administratif</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>Personnel</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.filter(doc => doc.staffType === 'administrative').map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">{doc.name}</TableCell>
                      <TableCell>{doc.staffName}</TableCell>
                      <TableCell>{getTypeBadge(doc.type)}</TableCell>
                      <TableCell>{getStatusBadge(doc.status)}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          Voir
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
