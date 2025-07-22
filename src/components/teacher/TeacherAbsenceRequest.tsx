
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Plus, Upload, Eye, Edit, Trash2, Clock, CheckCircle, XCircle, AlertTriangle, FileText, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AbsenceRequest {
  id: string;
  startDate: Date;
  endDate: Date;
  type: 'maladie' | 'conge_annuel' | 'formation' | 'mission' | 'autre';
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  coursesAffected: string[];
  handlingMethod: 'replacement' | 'recovery';
  replacementTeacher?: string;
  recoveryDetails?: string;
  justificationDocument?: string;
  createdAt: Date;
  adminComment?: string;
}

const mockAbsenceRequests: AbsenceRequest[] = [
  {
    id: 'req_1',
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-01-16'),
    type: 'maladie',
    reason: 'Grippe saisonnière avec certificat médical',
    status: 'approved',
    coursesAffected: ['INF101 - Algorithmique (L1)', 'INF102 - Programmation (L1)'],
    handlingMethod: 'replacement',
    replacementTeacher: 'Dr. Fatima Kaci',
    justificationDocument: 'certificat_medical.pdf',
    createdAt: new Date('2024-01-10'),
    adminComment: 'Demande approuvée. Remplacement organisé.'
  },
  {
    id: 'req_2',
    startDate: new Date('2024-02-20'),
    endDate: new Date('2024-02-21'),
    type: 'formation',
    reason: 'Formation pédagogique sur les nouvelles technologies',
    status: 'pending',
    coursesAffected: ['INF201 - Base de données (L2)', 'INF202 - Réseaux (L2)'],
    handlingMethod: 'recovery',
    recoveryDetails: 'Récupération prévue le samedi 24/02 de 8h à 12h',
    createdAt: new Date('2024-02-15')
  },
  {
    id: 'req_3',
    startDate: new Date('2024-01-08'),
    endDate: new Date('2024-01-10'),
    type: 'conge_annuel',
    reason: 'Congé personnel planifié',
    status: 'rejected',
    coursesAffected: ['INF301 - Génie logiciel (L3)'],
    handlingMethod: 'replacement',
    replacementTeacher: 'Dr. Omar Belkacem',
    createdAt: new Date('2024-01-03'),
    adminComment: 'Période trop chargée. Proposer une autre date.'
  }
];

const mockTeachers = [
  'Dr. Fatima Kaci',
  'Dr. Omar Belkacem', 
  'Dr. Yasmine Khelif',
  'Dr. Said Benaissa',
  'Dr. Amina Lounis'
];

const mockCourses = [
  'INF101 - Algorithmique (L1)',
  'INF102 - Programmation (L1)',
  'INF201 - Base de données (L2)',
  'INF202 - Réseaux (L2)',
  'INF301 - Génie logiciel (L3)',
  'INF302 - Intelligence artificielle (L3)'
];

export const TeacherAbsenceRequest = () => {
  const [requests, setRequests] = useState<AbsenceRequest[]>(mockAbsenceRequests);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<AbsenceRequest | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [newRequest, setNewRequest] = useState({
    startDate: '',
    endDate: '',
    type: '',
    reason: '',
    coursesAffected: [] as string[],
    handlingMethod: 'replacement' as 'replacement' | 'recovery',
    replacementTeacher: '',
    recoveryDetails: ''
  });
  const { toast } = useToast();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-800"><Clock className="h-3 w-3 mr-1" />En attente</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Approuvée</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Rejetée</Badge>;
      default:
        return <Badge>Inconnu</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    const types = {
      'maladie': { label: 'Maladie', color: 'bg-red-100 text-red-800' },
      'conge_annuel': { label: 'Congé annuel', color: 'bg-blue-100 text-blue-800' },
      'formation': { label: 'Formation', color: 'bg-green-100 text-green-800' },
      'mission': { label: 'Mission', color: 'bg-purple-100 text-purple-800' },
      'autre': { label: 'Autre', color: 'bg-gray-100 text-gray-800' }
    };
    const typeInfo = types[type as keyof typeof types];
    return <Badge className={typeInfo?.color || 'bg-gray-100 text-gray-800'}>{typeInfo?.label || type}</Badge>;
  };

  const handleCreateRequest = () => {
    if (!newRequest.startDate || !newRequest.endDate || !newRequest.type || !newRequest.reason) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    const request: AbsenceRequest = {
      id: `req_${Date.now()}`,
      startDate: new Date(newRequest.startDate),
      endDate: new Date(newRequest.endDate),
      type: newRequest.type as any,
      reason: newRequest.reason,
      status: 'pending',
      coursesAffected: newRequest.coursesAffected,
      handlingMethod: newRequest.handlingMethod,
      replacementTeacher: newRequest.replacementTeacher,
      recoveryDetails: newRequest.recoveryDetails,
      createdAt: new Date()
    };

    setRequests(prev => [request, ...prev]);
    setIsCreateDialogOpen(false);
    setNewRequest({
      startDate: '',
      endDate: '',
      type: '',
      reason: '',
      coursesAffected: [],
      handlingMethod: 'replacement',
      replacementTeacher: '',
      recoveryDetails: ''
    });

    toast({
      title: "Demande créée",
      description: "Votre demande d'absence a été soumise avec succès",
    });
  };

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length
  };

  return (
    <div className="space-y-6">
      <Card className="border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-800">
            <Calendar className="h-5 w-5" />
            Mes Demandes d'Absence
          </CardTitle>
          <p className="text-emerald-700">
            Gérez vos demandes d'absence et proposez des solutions de remplacement ou de récupération
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4 text-center">
            <FileText className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <p className="text-xl font-bold text-blue-800">{stats.total}</p>
            <p className="text-xs text-blue-700">Total</p>
          </CardContent>
        </Card>
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4 text-center">
            <Clock className="h-6 w-6 text-amber-600 mx-auto mb-2" />
            <p className="text-xl font-bold text-amber-800">{stats.pending}</p>
            <p className="text-xs text-amber-700">En attente</p>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <p className="text-xl font-bold text-green-800">{stats.approved}</p>
            <p className="text-xs text-green-700">Approuvées</p>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 text-center">
            <XCircle className="h-6 w-6 text-red-600 mx-auto mb-2" />
            <p className="text-xl font-bold text-red-800">{stats.rejected}</p>
            <p className="text-xs text-red-700">Rejetées</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Mes Demandes ({requests.length})</CardTitle>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle Demande
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Nouvelle Demande d'Absence</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startDate">Date de début *</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={newRequest.startDate}
                        onChange={(e) => setNewRequest({...newRequest, startDate: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDate">Date de fin *</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={newRequest.endDate}
                        onChange={(e) => setNewRequest({...newRequest, endDate: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="type">Type d'absence *</Label>
                    <Select value={newRequest.type} onValueChange={(value) => setNewRequest({...newRequest, type: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="maladie">Maladie</SelectItem>
                        <SelectItem value="conge_annuel">Congé annuel</SelectItem>
                        <SelectItem value="formation">Formation</SelectItem>
                        <SelectItem value="mission">Mission</SelectItem>
                        <SelectItem value="autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="reason">Motif *</Label>
                    <Textarea
                      id="reason"
                      placeholder="Décrivez le motif de votre absence..."
                      value={newRequest.reason}
                      onChange={(e) => setNewRequest({...newRequest, reason: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label>Cours affectés</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {mockCourses.map(course => (
                        <div key={course} className="flex items-center space-x-2">
                          <Checkbox
                            id={course}
                            checked={newRequest.coursesAffected.includes(course)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setNewRequest({
                                  ...newRequest,
                                  coursesAffected: [...newRequest.coursesAffected, course]
                                });
                              } else {
                                setNewRequest({
                                  ...newRequest,
                                  coursesAffected: newRequest.coursesAffected.filter(c => c !== course)
                                });
                              }
                            }}
                          />
                          <Label htmlFor={course} className="text-sm">{course}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Gestion des cours</Label>
                    <RadioGroup 
                      value={newRequest.handlingMethod} 
                      onValueChange={(value: 'replacement' | 'recovery') => setNewRequest({...newRequest, handlingMethod: value})}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="replacement" id="replacement" />
                        <Label htmlFor="replacement">Remplacement par un collègue</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="recovery" id="recovery" />
                        <Label htmlFor="recovery">Récupération des séances</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {newRequest.handlingMethod === 'replacement' && (
                    <div>
                      <Label htmlFor="replacementTeacher">Enseignant remplaçant proposé</Label>
                      <Select value={newRequest.replacementTeacher} onValueChange={(value) => setNewRequest({...newRequest, replacementTeacher: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un enseignant" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockTeachers.map(teacher => (
                            <SelectItem key={teacher} value={teacher}>{teacher}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {newRequest.handlingMethod === 'recovery' && (
                    <div>
                      <Label htmlFor="recoveryDetails">Détails de la récupération</Label>
                      <Textarea
                        id="recoveryDetails"
                        placeholder="Précisez quand et comment vous comptez récupérer les séances..."
                        value={newRequest.recoveryDetails}
                        onChange={(e) => setNewRequest({...newRequest, recoveryDetails: e.target.value})}
                      />
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button onClick={handleCreateRequest} className="flex-1">
                      Soumettre la demande
                    </Button>
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="flex-1">
                      Annuler
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Période</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Gestion</TableHead>
                <TableHead>Cours affectés</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{request.startDate.toLocaleDateString('fr-FR')}</p>
                      <p className="text-sm text-gray-500">au {request.endDate.toLocaleDateString('fr-FR')}</p>
                    </div>
                  </TableCell>
                  <TableCell>{getTypeBadge(request.type)}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>
                    {request.handlingMethod === 'replacement' ? (
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span className="text-sm">Remplacement</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span className="text-sm">Récupération</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {request.coursesAffected.slice(0, 2).map(course => (
                        <div key={course}>{course}</div>
                      ))}
                      {request.coursesAffected.length > 2 && (
                        <div className="text-gray-500">+{request.coursesAffected.length - 2} autres</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" onClick={() => { setSelectedRequest(request); setIsViewDialogOpen(true); }}>
                        <Eye className="h-3 w-3" />
                      </Button>
                      {request.status === 'pending' && (
                        <>
                          <Button size="sm" variant="outline">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="destructive">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails de la Demande</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Période</Label>
                  <p>{selectedRequest.startDate.toLocaleDateString('fr-FR')} - {selectedRequest.endDate.toLocaleDateString('fr-FR')}</p>
                </div>
                <div>
                  <Label>Type</Label>
                  <div className="mt-1">{getTypeBadge(selectedRequest.type)}</div>
                </div>
              </div>
              
              <div>
                <Label>Statut</Label>
                <div className="mt-1">{getStatusBadge(selectedRequest.status)}</div>
              </div>

              <div>
                <Label>Motif</Label>
                <p className="mt-1">{selectedRequest.reason}</p>
              </div>

              <div>
                <Label>Cours affectés</Label>
                <div className="mt-1 space-y-1">
                  {selectedRequest.coursesAffected.map(course => (
                    <Badge key={course} variant="outline">{course}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label>Gestion des cours</Label>
                <p className="mt-1">
                  {selectedRequest.handlingMethod === 'replacement' ? 'Remplacement' : 'Récupération'}
                </p>
                {selectedRequest.replacementTeacher && (
                  <p className="text-sm text-gray-600">Remplaçant: {selectedRequest.replacementTeacher}</p>
                )}
                {selectedRequest.recoveryDetails && (
                  <p className="text-sm text-gray-600">Récupération: {selectedRequest.recoveryDetails}</p>
                )}
              </div>

              {selectedRequest.adminComment && (
                <div>
                  <Label>Commentaire administratif</Label>
                  <p className="mt-1 p-2 bg-gray-50 rounded">{selectedRequest.adminComment}</p>
                </div>
              )}

              <div className="text-sm text-gray-500">
                Demande créée le {selectedRequest.createdAt.toLocaleDateString('fr-FR')}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
