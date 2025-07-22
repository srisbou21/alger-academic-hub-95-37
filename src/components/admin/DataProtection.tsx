
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Shield, FileText, User, Trash2, 
  Download, Eye, Lock, AlertCircle
} from "lucide-react";
import { useState } from "react";

interface DataRequest {
  id: string;
  userId: string;
  userName: string;
  type: 'access' | 'rectification' | 'deletion' | 'portability';
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  requestDate: Date;
  reason: string;
  documents?: string[];
}

interface ConsentRecord {
  userId: string;
  userName: string;
  dataType: string;
  consentGiven: boolean;
  consentDate: Date;
  purpose: string;
  expiryDate?: Date;
}

export const DataProtection = () => {
  const [dataRequests, setDataRequests] = useState<DataRequest[]>([
    {
      id: 'REQ001',
      userId: 'student_1',
      userName: 'Amina Benali',
      type: 'access',
      status: 'pending',
      requestDate: new Date('2024-06-10'),
      reason: 'Consultation de mes données personnelles stockées'
    },
    {
      id: 'REQ002',
      userId: 'student_2',
      userName: 'Mohamed Djebbar',
      type: 'deletion',
      status: 'processing',
      requestDate: new Date('2024-06-08'),
      reason: 'Suppression définitive après fin d\'études'
    }
  ]);

  const [consentRecords, setConsentRecords] = useState<ConsentRecord[]>([
    {
      userId: 'student_1',
      userName: 'Amina Benali',
      dataType: 'Données académiques',
      consentGiven: true,
      consentDate: new Date('2024-01-15'),
      purpose: 'Gestion du parcours académique',
      expiryDate: new Date('2026-01-15')
    },
    {
      userId: 'student_1',
      userName: 'Amina Benali',
      dataType: 'Communications marketing',
      consentGiven: false,
      consentDate: new Date('2024-01-15'),
      purpose: 'Envoi d\'informations promotionnelles'
    }
  ]);

  const [newRequest, setNewRequest] = useState({
    userId: '',
    userName: '',
    type: 'access' as const,
    reason: ''
  });

  const handleRequestStatusChange = (requestId: string, newStatus: DataRequest['status']) => {
    setDataRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: newStatus } : req
    ));
  };

  const processDataRequest = (request: DataRequest) => {
    switch (request.type) {
      case 'access':
        // Générer un rapport des données personnelles
        generatePersonalDataReport(request.userId);
        break;
      case 'deletion':
        // Procédure de suppression des données
        initiateDataDeletion(request.userId);
        break;
      case 'rectification':
        // Interface de correction des données
        console.log('Rectification request for:', request.userId);
        break;
      case 'portability':
        // Export des données dans un format standard
        generatePortableData(request.userId);
        break;
    }
    handleRequestStatusChange(request.id, 'processing');
  };

  const generatePersonalDataReport = (userId: string) => {
    // Simulation de génération de rapport
    const report = {
      userId,
      generatedAt: new Date(),
      personalData: {
        identity: { name: 'Amina Benali', email: 'amina@example.com' },
        academic: { studentId: '20230045', level: 'L3' },
        technical: { lastLogin: new Date(), ipAddresses: ['192.168.1.100'] }
      }
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `personal-data-${userId}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const generatePortableData = (userId: string) => {
    // Export des données au format portable
    const portableData = {
      format: 'JSON-LD',
      version: '1.0',
      exportDate: new Date(),
      userData: {
        // Données structurées selon un standard
      }
    };

    const blob = new Blob([JSON.stringify(portableData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portable-data-${userId}.json`;
    a.click();
  };

  const initiateDataDeletion = (userId: string) => {
    // Processus de suppression des données personnelles
    console.log('Initiation suppression données pour:', userId);
    // En production, ceci déclencherait un workflow de suppression
  };

  const getRequestTypeColor = (type: string) => {
    switch (type) {
      case 'access': return 'bg-blue-100 text-blue-800';
      case 'rectification': return 'bg-amber-100 text-amber-800';
      case 'deletion': return 'bg-red-100 text-red-800';
      case 'portability': return 'bg-green-100 text-green-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-slate-800">Protection des Données</h3>
          <p className="text-slate-600">Conformité RGPD et gestion des droits des utilisateurs</p>
        </div>
        <Badge className="bg-green-100 text-green-800 border-green-200">
          <Shield className="h-3 w-3 mr-1" />
          Conforme RGPD
        </Badge>
      </div>

      <Tabs defaultValue="requests" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="requests">
            <FileText className="h-4 w-4 mr-2" />
            Demandes d'Exercice
          </TabsTrigger>
          <TabsTrigger value="consent">
            <User className="h-4 w-4 mr-2" />
            Gestion Consentements
          </TabsTrigger>
          <TabsTrigger value="compliance">
            <Shield className="h-4 w-4 mr-2" />
            Conformité
          </TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Demandes d'Exercice des Droits</CardTitle>
              <CardDescription>
                Gestion des demandes d'accès, rectification, suppression et portabilité
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dataRequests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Badge className={getRequestTypeColor(request.type)}>
                          {request.type === 'access' && 'Accès'}
                          {request.type === 'rectification' && 'Rectification'}
                          {request.type === 'deletion' && 'Suppression'}
                          {request.type === 'portability' && 'Portabilité'}
                        </Badge>
                        <Badge className={getStatusColor(request.status)}>
                          {request.status === 'pending' && 'En attente'}
                          {request.status === 'processing' && 'En cours'}
                          {request.status === 'completed' && 'Terminé'}
                          {request.status === 'rejected' && 'Rejeté'}
                        </Badge>
                      </div>
                      <span className="text-sm text-slate-500">
                        {request.requestDate.toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    
                    <div className="mb-3">
                      <h4 className="font-medium">{request.userName}</h4>
                      <p className="text-sm text-slate-600">ID: {request.userId}</p>
                      <p className="text-sm text-slate-600 mt-1">{request.reason}</p>
                    </div>

                    <div className="flex gap-2">
                      {request.status === 'pending' && (
                        <>
                          <Button size="sm" onClick={() => processDataRequest(request)}>
                            Traiter
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleRequestStatusChange(request.id, 'rejected')}>
                            Rejeter
                          </Button>
                        </>
                      )}
                      {request.status === 'processing' && (
                        <Button size="sm" onClick={() => handleRequestStatusChange(request.id, 'completed')}>
                          Marquer terminé
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="consent" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Registre des Consentements</CardTitle>
              <CardDescription>
                Suivi des consentements donnés par les utilisateurs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {consentRecords.map((consent, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{consent.userName}</h4>
                        <p className="text-sm text-slate-600">{consent.dataType}</p>
                      </div>
                      <Badge className={consent.consentGiven ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {consent.consentGiven ? 'Accordé' : 'Refusé'}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-slate-600 mb-2">
                      <strong>Finalité:</strong> {consent.purpose}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Consentement: {consent.consentDate.toLocaleDateString('fr-FR')}</span>
                      {consent.expiryDate && (
                        <span>Expire: {consent.expiryDate.toLocaleDateString('fr-FR')}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Mesures de Sécurité
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Chiffrement des données</span>
                  <Badge className="bg-green-100 text-green-800">Actif</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Pseudonymisation</span>
                  <Badge className="bg-green-100 text-green-800">Actif</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Minimisation des données</span>
                  <Badge className="bg-green-100 text-green-800">Actif</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Sauvegarde sécurisée</span>
                  <Badge className="bg-green-100 text-green-800">Actif</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Contrôles Automatisés
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Analyse d'impact (DPIA)</span>
                  <Badge className="bg-amber-100 text-amber-800">En cours</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Audit des accès</span>
                  <Badge className="bg-green-100 text-green-800">Quotidien</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Détection violations</span>
                  <Badge className="bg-green-100 text-green-800">Temps réel</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Rapport conformité</span>
                  <Badge className="bg-blue-100 text-blue-800">Mensuel</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Actions de Conformité</CardTitle>
              <CardDescription>
                Outils pour maintenir la conformité RGPD
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex-col">
                  <Download className="h-6 w-6 mb-2" />
                  Exporter registre
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <FileText className="h-6 w-6 mb-2" />
                  Rapport DPIA
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Shield className="h-6 w-6 mb-2" />
                  Audit sécurité
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Lock className="h-6 w-6 mb-2" />
                  Test intrusion
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
