import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Archive, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Lock, 
  Unlock,
  Calendar,
  FileText,
  User,
  Shield,
  HardDrive,
  Database,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Settings
} from "lucide-react";

interface ArchivedDocument {
  id: string;
  title: string;
  type: 'contract' | 'leave_request' | 'mission_report' | 'evaluation' | 'training' | 'other';
  category: 'personnel' | 'academic' | 'administrative' | 'financial' | 'legal';
  employeeId: string;
  employeeName: string;
  department: string;
  createdAt: Date;
  archivedAt: Date;
  archivedBy: string;
  retentionPeriod: number; // en années
  expiresAt: Date;
  status: 'active' | 'expired' | 'deleted' | 'migrated';
  accessLevel: 'public' | 'restricted' | 'confidential' | 'secret';
  fileSize: number;
  checksum: string;
  encryptionStatus: boolean;
  lastAccessed?: Date;
  accessCount: number;
  tags: string[];
  metadata: Record<string, any>;
}

interface ArchiveStats {
  totalDocuments: number;
  totalSize: number;
  documentsByType: Record<string, number>;
  documentsByCategory: Record<string, number>;
  expiringDocuments: number;
  encryptedDocuments: number;
}

export const DigitalArchiveManager = () => {
  const { toast } = useToast();
  
  const [archivedDocuments, setArchivedDocuments] = useState<ArchivedDocument[]>([
    {
      id: '1',
      title: 'Contrat de travail - Dr. Ahmed Benali',
      type: 'contract',
      category: 'personnel',
      employeeId: 'EMP001',
      employeeName: 'Dr. Ahmed Benali',
      department: 'Informatique',
      createdAt: new Date('2020-09-01'),
      archivedAt: new Date('2024-01-15'),
      archivedBy: 'Système automatique',
      retentionPeriod: 10,
      expiresAt: new Date('2034-01-15'),
      status: 'active',
      accessLevel: 'confidential',
      fileSize: 2048576, // 2MB
      checksum: 'SHA256:a1b2c3d4e5f6...',
      encryptionStatus: true,
      lastAccessed: new Date('2024-01-20'),
      accessCount: 5,
      tags: ['contrat', 'enseignant', 'CDI'],
      metadata: {
        signedBy: ['Dr. Ahmed Benali', 'RH Manager'],
        contractType: 'CDI',
        salary: 'Confidentiel'
      }
    },
    {
      id: '2',
      title: 'Évaluation annuelle 2023 - Prof. Fatima Zahra',
      type: 'evaluation',
      category: 'academic',
      employeeId: 'EMP002',
      employeeName: 'Prof. Fatima Zahra',
      department: 'Sciences Économiques',
      createdAt: new Date('2023-12-15'),
      archivedAt: new Date('2024-01-10'),
      archivedBy: 'Chef de département',
      retentionPeriod: 7,
      expiresAt: new Date('2031-01-10'),
      status: 'active',
      accessLevel: 'restricted',
      fileSize: 1536000, // 1.5MB
      checksum: 'SHA256:b2c3d4e5f6g7...',
      encryptionStatus: true,
      lastAccessed: new Date('2024-01-18'),
      accessCount: 3,
      tags: ['évaluation', 'performance', '2023'],
      metadata: {
        evaluator: 'Chef de département',
        score: 'Excellent',
        nextReview: '2024-12-15'
      }
    }
  ]);

  const [selectedDocument, setSelectedDocument] = useState<ArchivedDocument | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [accessLevelFilter, setAccessLevelFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'documents' | 'stats' | 'settings'>('documents');

  const calculateStats = (): ArchiveStats => {
    const stats: ArchiveStats = {
      totalDocuments: archivedDocuments.length,
      totalSize: archivedDocuments.reduce((sum, doc) => sum + doc.fileSize, 0),
      documentsByType: {},
      documentsByCategory: {},
      expiringDocuments: 0,
      encryptedDocuments: archivedDocuments.filter(doc => doc.encryptionStatus).length
    };

    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

    archivedDocuments.forEach(doc => {
      // Count by type
      stats.documentsByType[doc.type] = (stats.documentsByType[doc.type] || 0) + 1;
      
      // Count by category
      stats.documentsByCategory[doc.category] = (stats.documentsByCategory[doc.category] || 0) + 1;
      
      // Count expiring documents
      if (doc.expiresAt <= oneYearFromNow) {
        stats.expiringDocuments++;
      }
    });

    return stats;
  };

  const stats = calculateStats();

  const getAccessLevelColor = (level: ArchivedDocument['accessLevel']) => {
    switch (level) {
      case 'public': return 'bg-green-100 text-green-700';
      case 'restricted': return 'bg-yellow-100 text-yellow-700';
      case 'confidential': return 'bg-orange-100 text-orange-700';
      case 'secret': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: ArchivedDocument['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'expired': return 'bg-red-100 text-red-700';
      case 'deleted': return 'bg-gray-100 text-gray-700';
      case 'migrated': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeLabel = (type: ArchivedDocument['type']) => {
    switch (type) {
      case 'contract': return 'Contrat';
      case 'leave_request': return 'Demande de congé';
      case 'mission_report': return 'Rapport de mission';
      case 'evaluation': return 'Évaluation';
      case 'training': return 'Formation';
      case 'other': return 'Autre';
      default: return type;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredDocuments = archivedDocuments.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter === 'all' || doc.type === typeFilter;
    const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter;
    const matchesAccessLevel = accessLevelFilter === 'all' || doc.accessLevel === accessLevelFilter;
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    
    return matchesSearch && matchesType && matchesCategory && matchesAccessLevel && matchesStatus;
  });

  const handleDownloadDocument = (documentId: string) => {
    const document = archivedDocuments.find(doc => doc.id === documentId);
    if (document) {
      // Update access count and last accessed
      setArchivedDocuments(docs =>
        docs.map(doc =>
          doc.id === documentId
            ? { ...doc, accessCount: doc.accessCount + 1, lastAccessed: new Date() }
            : doc
        )
      );

      toast({
        title: "Téléchargement initié",
        description: `Téléchargement de "${document.title}"`,
      });
    }
  };

  const handleDeleteDocument = (documentId: string) => {
    setArchivedDocuments(docs =>
      docs.map(doc =>
        doc.id === documentId ? { ...doc, status: 'deleted' as const } : doc
      )
    );

    toast({
      title: "Document supprimé",
      description: "Le document a été marqué comme supprimé",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Archive className="h-8 w-8" />
            Gestionnaire d'Archives Numériques
          </CardTitle>
          <p className="text-teal-100">
            Système d'archivage sécurisé et conforme pour documents RH
          </p>
        </CardHeader>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 font-medium">Total documents</p>
                <p className="text-2xl font-bold text-blue-800">{stats.totalDocuments}</p>
              </div>
              <Database className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 font-medium">Taille totale</p>
                <p className="text-2xl font-bold text-green-800">{formatFileSize(stats.totalSize)}</p>
              </div>
              <HardDrive className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 font-medium">Expirant bientôt</p>
                <p className="text-2xl font-bold text-orange-800">{stats.expiringDocuments}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 font-medium">Chiffrés</p>
                <p className="text-2xl font-bold text-purple-800">{stats.encryptedDocuments}</p>
              </div>
              <Shield className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-2 mb-6">
            <Button
              variant={activeTab === 'documents' ? 'default' : 'outline'}
              onClick={() => setActiveTab('documents')}
            >
              <Archive className="h-4 w-4 mr-2" />
              Documents archivés
            </Button>
            <Button
              variant={activeTab === 'stats' ? 'default' : 'outline'}
              onClick={() => setActiveTab('stats')}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Statistiques
            </Button>
            <Button
              variant={activeTab === 'settings' ? 'default' : 'outline'}
              onClick={() => setActiveTab('settings')}
            >
              <Settings className="h-4 w-4 mr-2" />
              Configuration
            </Button>
          </div>

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <>
              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
                <div className="md:col-span-2">
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
                
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    <SelectItem value="contract">Contrat</SelectItem>
                    <SelectItem value="leave_request">Demande de congé</SelectItem>
                    <SelectItem value="mission_report">Rapport de mission</SelectItem>
                    <SelectItem value="evaluation">Évaluation</SelectItem>
                    <SelectItem value="training">Formation</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les catégories</SelectItem>
                    <SelectItem value="personnel">Personnel</SelectItem>
                    <SelectItem value="academic">Académique</SelectItem>
                    <SelectItem value="administrative">Administratif</SelectItem>
                    <SelectItem value="financial">Financier</SelectItem>
                    <SelectItem value="legal">Légal</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={accessLevelFilter} onValueChange={setAccessLevelFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Niveau d'accès" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les niveaux</SelectItem>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="restricted">Restreint</SelectItem>
                    <SelectItem value="confidential">Confidentiel</SelectItem>
                    <SelectItem value="secret">Secret</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="expired">Expiré</SelectItem>
                    <SelectItem value="deleted">Supprimé</SelectItem>
                    <SelectItem value="migrated">Migré</SelectItem>
                  </SelectContent>
                </Select>
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
                              {document.status}
                            </Badge>
                            <Badge className={getAccessLevelColor(document.accessLevel)}>
                              {document.accessLevel}
                            </Badge>
                            {document.encryptionStatus && (
                              <Lock className="h-4 w-4 text-green-600" />
                            )}
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-600">
                            <div className="flex items-center gap-1">
                              <FileText className="h-4 w-4" />
                              {getTypeLabel(document.type)}
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {document.employeeName}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Archivé: {document.archivedAt.toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <HardDrive className="h-4 w-4" />
                              {formatFileSize(document.fileSize)}
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-slate-500">
                            <span>Expire: {document.expiresAt.toLocaleDateString()}</span>
                            <span>Accès: {document.accessCount}</span>
                            {document.lastAccessed && (
                              <span>Dernier accès: {document.lastAccessed.toLocaleDateString()}</span>
                            )}
                          </div>

                          <div className="flex gap-2">
                            {document.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2 ml-4">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedDocument(document)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDownloadDocument(document.id)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          {document.status === 'active' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeleteDocument(document.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <AlertTriangle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}

          {/* Statistics Tab */}
          {activeTab === 'stats' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Documents par type</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {Object.entries(stats.documentsByType).map(([type, count]) => (
                        <div key={type} className="flex justify-between">
                          <span>{getTypeLabel(type as any)}</span>
                          <span className="font-medium">{count}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Documents par catégorie</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {Object.entries(stats.documentsByCategory).map(([category, count]) => (
                        <div key={category} className="flex justify-between">
                          <span className="capitalize">{category}</span>
                          <span className="font-medium">{count}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Politiques de rétention</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Contrats de travail</label>
                        <Input defaultValue="10 ans" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Évaluations</label>
                        <Input defaultValue="7 ans" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Rapports de mission</label>
                        <Input defaultValue="5 ans" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Demandes de congé</label>
                        <Input defaultValue="3 ans" />
                      </div>
                    </div>
                    <Button>Sauvegarder les politiques</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Configuration du chiffrement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Chiffrement automatique des documents confidentiels</span>
                      <Button variant="outline">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Activé
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Algorithme de chiffrement</span>
                      <Select defaultValue="aes256">
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="aes256">AES-256</SelectItem>
                          <SelectItem value="aes128">AES-128</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Document Details Dialog */}
      <Dialog open={!!selectedDocument} onOpenChange={() => setSelectedDocument(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedDocument && (
            <>
              <DialogHeader>
                <DialogTitle>Détails du document archivé</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong>Titre:</strong> {selectedDocument.title}
                  </div>
                  <div>
                    <strong>Type:</strong> {getTypeLabel(selectedDocument.type)}
                  </div>
                  <div>
                    <strong>Employé:</strong> {selectedDocument.employeeName}
                  </div>
                  <div>
                    <strong>Département:</strong> {selectedDocument.department}
                  </div>
                  <div>
                    <strong>Statut:</strong>
                    <Badge className={`ml-2 ${getStatusColor(selectedDocument.status)}`}>
                      {selectedDocument.status}
                    </Badge>
                  </div>
                  <div>
                    <strong>Niveau d'accès:</strong>
                    <Badge className={`ml-2 ${getAccessLevelColor(selectedDocument.accessLevel)}`}>
                      {selectedDocument.accessLevel}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong>Date de création:</strong> {selectedDocument.createdAt.toLocaleDateString()}
                  </div>
                  <div>
                    <strong>Date d'archivage:</strong> {selectedDocument.archivedAt.toLocaleDateString()}
                  </div>
                  <div>
                    <strong>Archivé par:</strong> {selectedDocument.archivedBy}
                  </div>
                  <div>
                    <strong>Expire le:</strong> {selectedDocument.expiresAt.toLocaleDateString()}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong>Taille du fichier:</strong> {formatFileSize(selectedDocument.fileSize)}
                  </div>
                  <div>
                    <strong>Somme de contrôle:</strong> {selectedDocument.checksum}
                  </div>
                  <div>
                    <strong>Chiffrement:</strong> {selectedDocument.encryptionStatus ? 'Oui' : 'Non'}
                  </div>
                  <div>
                    <strong>Nombre d'accès:</strong> {selectedDocument.accessCount}
                  </div>
                </div>

                {selectedDocument.metadata && Object.keys(selectedDocument.metadata).length > 0 && (
                  <div>
                    <strong>Métadonnées:</strong>
                    <div className="mt-2 p-4 bg-slate-50 rounded-lg">
                      <pre className="text-sm">
                        {JSON.stringify(selectedDocument.metadata, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button onClick={() => handleDownloadDocument(selectedDocument.id)}>
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger
                  </Button>
                  <Button variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    Prévisualiser
                  </Button>
                  {selectedDocument.status === 'active' && (
                    <Button 
                      variant="outline"
                      onClick={() => handleDeleteDocument(selectedDocument.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Supprimer
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