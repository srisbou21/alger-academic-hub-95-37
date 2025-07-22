import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Send, 
  Eye, 
  Download,
  PenTool,
  Archive,
  Search,
  Filter,
  Plus,
  User,
  Calendar,
  ArrowRight
} from "lucide-react";

interface DigitalDocument {
  id: string;
  title: string;
  type: 'demande_conge' | 'autorisation_absence' | 'rapport_mission' | 'demande_formation' | 'autre';
  status: 'brouillon' | 'en_attente' | 'en_cours' | 'approuve' | 'rejete' | 'archive';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  submittedBy: string;
  submittedAt: Date;
  assignedTo?: string;
  approvers: string[];
  currentApprover?: string;
  deadline?: Date;
  content: string;
  attachments: string[];
  comments: WorkflowComment[];
  signatures: ElectronicSignature[];
}

interface WorkflowComment {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
  type: 'comment' | 'approval' | 'rejection';
}

interface ElectronicSignature {
  id: string;
  signedBy: string;
  signedAt: Date;
  role: string;
  verified: boolean;
}

export const DigitalWorkflowManager = () => {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<DigitalDocument[]>([
    {
      id: '1',
      title: 'Demande de congé - Dr. Ahmed Benali',
      type: 'demande_conge',
      status: 'en_cours',
      priority: 'medium',
      submittedBy: 'Dr. Ahmed Benali',
      submittedAt: new Date('2024-01-15'),
      assignedTo: 'Chef de département',
      approvers: ['Chef de département', 'Doyen', 'RH'],
      currentApprover: 'Chef de département',
      deadline: new Date('2024-01-25'),
      content: 'Demande de congé du 1er au 15 février 2024',
      attachments: ['certificat_medical.pdf'],
      comments: [],
      signatures: []
    },
    {
      id: '2',
      title: 'Rapport de mission - Prof. Fatima Zahra',
      type: 'rapport_mission',
      status: 'approuve',
      priority: 'low',
      submittedBy: 'Prof. Fatima Zahra',
      submittedAt: new Date('2024-01-10'),
      approvers: ['Chef de département'],
      content: 'Rapport de mission de formation à Rabat',
      attachments: ['rapport_mission.pdf', 'factures.pdf'],
      comments: [],
      signatures: [
        {
          id: '1',
          signedBy: 'Chef de département',
          signedAt: new Date('2024-01-12'),
          role: 'Approbateur',
          verified: true
        }
      ]
    }
  ]);

  const [selectedDocument, setSelectedDocument] = useState<DigitalDocument | null>(null);
  const [showNewDocumentForm, setShowNewDocumentForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [newDocument, setNewDocument] = useState({
    title: '',
    type: 'demande_conge' as const,
    priority: 'medium' as const,
    content: '',
    deadline: ''
  });

  const getStatusColor = (status: DigitalDocument['status']) => {
    switch (status) {
      case 'brouillon': return 'bg-gray-100 text-gray-700';
      case 'en_attente': return 'bg-yellow-100 text-yellow-700';
      case 'en_cours': return 'bg-blue-100 text-blue-700';
      case 'approuve': return 'bg-green-100 text-green-700';
      case 'rejete': return 'bg-red-100 text-red-700';
      case 'archive': return 'bg-gray-100 text-gray-500';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: DigitalDocument['priority']) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'high': return 'bg-orange-100 text-orange-700';
      case 'urgent': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeLabel = (type: DigitalDocument['type']) => {
    switch (type) {
      case 'demande_conge': return 'Demande de congé';
      case 'autorisation_absence': return 'Autorisation d\'absence';
      case 'rapport_mission': return 'Rapport de mission';
      case 'demande_formation': return 'Demande de formation';
      case 'autre': return 'Autre';
      default: return type;
    }
  };

  const handleCreateDocument = () => {
    const document: DigitalDocument = {
      id: Date.now().toString(),
      title: newDocument.title,
      type: newDocument.type,
      status: 'brouillon',
      priority: newDocument.priority,
      submittedBy: 'Utilisateur actuel', // À remplacer par l'utilisateur connecté
      submittedAt: new Date(),
      deadline: newDocument.deadline ? new Date(newDocument.deadline) : undefined,
      content: newDocument.content,
      attachments: [],
      comments: [],
      signatures: [],
      approvers: ['Chef de département', 'Doyen', 'RH'] // Workflow par défaut
    };

    setDocuments([document, ...documents]);
    setNewDocument({ title: '', type: 'demande_conge', priority: 'medium', content: '', deadline: '' });
    setShowNewDocumentForm(false);

    toast({
      title: "Document créé",
      description: "Le document a été créé avec succès",
    });
  };

  const handleSubmitDocument = (id: string) => {
    setDocuments(documents.map(doc => 
      doc.id === id 
        ? { ...doc, status: 'en_attente' as const, assignedTo: doc.approvers[0] }
        : doc
    ));

    toast({
      title: "Document soumis",
      description: "Le document a été soumis pour approbation",
    });
  };

  const handleApproveDocument = (id: string) => {
    setDocuments(documents.map(doc => {
      if (doc.id === id) {
        const currentApproverIndex = doc.approvers.findIndex(a => a === doc.currentApprover);
        const isLastApprover = currentApproverIndex === doc.approvers.length - 1;
        
        const newSignature: ElectronicSignature = {
          id: Date.now().toString(),
          signedBy: doc.currentApprover || 'Approbateur',
          signedAt: new Date(),
          role: 'Approbateur',
          verified: true
        };

        return {
          ...doc,
          status: isLastApprover ? 'approuve' as const : 'en_cours' as const,
          currentApprover: isLastApprover ? undefined : doc.approvers[currentApproverIndex + 1],
          signatures: [...doc.signatures, newSignature]
        };
      }
      return doc;
    }));

    toast({
      title: "Document approuvé",
      description: "Le document a été approuvé avec succès",
    });
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.submittedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-green-600 to-teal-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-8 w-8" />
            Gestion Numérique des Workflows
          </CardTitle>
          <p className="text-green-100">
            Système sans papier pour la gestion des processus administratifs
          </p>
        </CardHeader>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 font-medium">En attente</p>
                <p className="text-2xl font-bold text-blue-800">
                  {documents.filter(d => d.status === 'en_attente').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 font-medium">En cours</p>
                <p className="text-2xl font-bold text-orange-800">
                  {documents.filter(d => d.status === 'en_cours').length}
                </p>
              </div>
              <ArrowRight className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 font-medium">Approuvés</p>
                <p className="text-2xl font-bold text-green-800">
                  {documents.filter(d => d.status === 'approuve').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 font-medium">Total</p>
                <p className="text-2xl font-bold text-purple-800">{documents.length}</p>
              </div>
              <FileText className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher des documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="brouillon">Brouillon</SelectItem>
                <SelectItem value="en_attente">En attente</SelectItem>
                <SelectItem value="en_cours">En cours</SelectItem>
                <SelectItem value="approuve">Approuvé</SelectItem>
                <SelectItem value="rejete">Rejeté</SelectItem>
                <SelectItem value="archive">Archivé</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => setShowNewDocumentForm(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nouveau document
            </Button>
          </div>

          {/* Documents List */}
          <div className="space-y-4">
            {filteredDocuments.map((document) => (
              <Card key={document.id} className="border border-slate-200 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold">{document.title}</h3>
                        <Badge className={getStatusColor(document.status)}>
                          {document.status.replace('_', ' ')}
                        </Badge>
                        <Badge className={getPriorityColor(document.priority)}>
                          {document.priority}
                        </Badge>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                        <span className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          {getTypeLabel(document.type)}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {document.submittedBy}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {document.submittedAt.toLocaleDateString()}
                        </span>
                        {document.deadline && (
                          <span className="flex items-center gap-1 text-orange-600">
                            <AlertCircle className="h-4 w-4" />
                            Échéance: {document.deadline.toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      {document.currentApprover && (
                        <div className="text-sm text-blue-600">
                          Assigné à: {document.currentApprover}
                        </div>
                      )}

                      {document.signatures.length > 0 && (
                        <div className="flex items-center gap-2">
                          <PenTool className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-green-600">
                            {document.signatures.length} signature(s) électronique(s)
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedDocument(document)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {document.status === 'brouillon' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleSubmitDocument(document.id)}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      )}
                      {document.status === 'en_cours' && document.currentApprover && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleApproveDocument(document.id)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* New Document Form */}
      <Dialog open={showNewDocumentForm} onOpenChange={setShowNewDocumentForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nouveau Document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Titre</label>
              <Input
                value={newDocument.title}
                onChange={(e) => setNewDocument({...newDocument, title: e.target.value})}
                placeholder="Titre du document"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Type</label>
                <Select value={newDocument.type} onValueChange={(value) => setNewDocument({...newDocument, type: value as any})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="demande_conge">Demande de congé</SelectItem>
                    <SelectItem value="autorisation_absence">Autorisation d'absence</SelectItem>
                    <SelectItem value="rapport_mission">Rapport de mission</SelectItem>
                    <SelectItem value="demande_formation">Demande de formation</SelectItem>
                    <SelectItem value="autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Priorité</label>
                <Select value={newDocument.priority} onValueChange={(value) => setNewDocument({...newDocument, priority: value as any})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Basse</SelectItem>
                    <SelectItem value="medium">Moyenne</SelectItem>
                    <SelectItem value="high">Haute</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Échéance (optionnel)</label>
              <Input
                type="date"
                value={newDocument.deadline}
                onChange={(e) => setNewDocument({...newDocument, deadline: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Contenu</label>
              <Textarea
                value={newDocument.content}
                onChange={(e) => setNewDocument({...newDocument, content: e.target.value})}
                placeholder="Décrivez votre demande..."
                rows={4}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowNewDocumentForm(false)}>
                Annuler
              </Button>
              <Button onClick={handleCreateDocument}>
                Créer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Document Viewer */}
      <Dialog open={!!selectedDocument} onOpenChange={() => setSelectedDocument(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedDocument && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedDocument.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong>Type:</strong> {getTypeLabel(selectedDocument.type)}
                  </div>
                  <div>
                    <strong>Statut:</strong> 
                    <Badge className={`ml-2 ${getStatusColor(selectedDocument.status)}`}>
                      {selectedDocument.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div>
                    <strong>Soumis par:</strong> {selectedDocument.submittedBy}
                  </div>
                  <div>
                    <strong>Date:</strong> {selectedDocument.submittedAt.toLocaleDateString()}
                  </div>
                </div>

                <div>
                  <strong>Contenu:</strong>
                  <div className="mt-2 p-4 bg-slate-50 rounded-lg">
                    {selectedDocument.content}
                  </div>
                </div>

                {selectedDocument.signatures.length > 0 && (
                  <div>
                    <strong>Signatures électroniques:</strong>
                    <div className="mt-2 space-y-2">
                      {selectedDocument.signatures.map((signature) => (
                        <div key={signature.id} className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                          <PenTool className="h-4 w-4 text-green-600" />
                          <span>{signature.signedBy}</span>
                          <span className="text-sm text-slate-500">
                            - {signature.signedAt.toLocaleDateString()}
                          </span>
                          {signature.verified && (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger PDF
                  </Button>
                  {selectedDocument.status === 'approuve' && (
                    <Button variant="outline">
                      <Archive className="h-4 w-4 mr-2" />
                      Archiver
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};